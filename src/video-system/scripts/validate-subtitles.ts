#!/usr/bin/env npx tsx
/**
 * 字幕验证脚本
 *
 * 检查 subtitles.json 是否符合规范：
 * 1. 顶层必须是数组（不是 {items: [...]}）
 * 2. 每个 sceneId 必须在 videoSpec.scenes 中存在
 * 3. start 必须 < end
 * 4. 同一 sceneId 内字幕时间有序且不重叠
 * 5. 每条字幕文本不超过 ~40 字符（约 2 行 x 20 字）
 * 6. 字幕文本 vs spokenText 长度比检查（摘要/改写警告）
 *
 * 用法：npx tsx src/video-system/scripts/validate-subtitles.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ─── 路径 ─────────────────────────────────────────
const SUBTITLES_PATH = path.resolve(__dirname, "../data/subtitles.json");
const VIDEO_SPEC_PATH = path.resolve(__dirname, "../data/videoSpec.json");
const AUDIO_TIMING_PATH = path.resolve(__dirname, "../data/audioTiming.json");

// ─── 常量 ─────────────────────────────────────────
const MAX_CHARS_PER_SUBTITLE = 40;
const MAX_LINE_WIDTH = 20; // 每行约 20 中文字符（手机端安全区）
const LENGTH_RATIO_WARN_HIGH = 2.0;
const LENGTH_RATIO_WARN_LOW = 0.3;

// 容易被字幕遮挡关键内容的 scene type
const CONTENT_HEAVY_TYPES = new Set([
  "comparison",
  "two-column",
  "three-column",
  "pros-cons",
  "process-steps",
  "todo-checklist",
  "bullets",
]);

// ─── 类型 ─────────────────────────────────────────

interface Subtitle {
  sceneId: string;
  start: number;
  end: number;
  text: string;
}

interface VideoScene {
  id: string;
  audioSegmentIds?: string[];
  type?: string;
  spokenText?: string;
  [key: string]: unknown;
}

interface AudioSegment {
  sceneId: string;
  start: number;
  end: number;
  duration: number;
}

interface AudioTiming {
  segments: AudioSegment[];
}

interface VideoSpec {
  meta: { title: string; [key: string]: unknown };
  scenes: VideoScene[];
}

interface CheckResult {
  level: "error" | "warning";
  rule: string;
  message: string;
  scenes?: string[];
}

// ─── 检查函数 ─────────────────────────────────────

function checkIsArray(subs: unknown): CheckResult[] {
  const results: CheckResult[] = [];

  if (!Array.isArray(subs)) {
    results.push({
      level: "error",
      rule: "not-array",
      message:
        "subtitles.json 顶层必须是数组，不能是 {items: [...]} 等包装结构",
    });
  }

  return results;
}

function checkSceneIdExists(
  subs: Subtitle[],
  sceneIds: Set<string>,
): CheckResult[] {
  const results: CheckResult[] = [];
  const missing = subs.filter((s) => !sceneIds.has(s.sceneId));

  if (missing.length > 0) {
    const uniqueIds = [...new Set(missing.map((s) => s.sceneId))];
    results.push({
      level: "error",
      rule: "scene-id-not-found",
      message: `${missing.length} 条字幕的 sceneId 在 videoSpec.scenes 中不存在`,
      scenes: uniqueIds,
    });
  }

  return results;
}

function checkTimeOrder(subs: Subtitle[]): CheckResult[] {
  const results: CheckResult[] = [];
  const bad = subs.filter((s) => s.start >= s.end);

  if (bad.length > 0) {
    results.push({
      level: "error",
      rule: "invalid-time-range",
      message: `${bad.length} 条字幕的 start >= end`,
      scenes: bad.map(
        (s) => `${s.sceneId}[${s.start.toFixed(2)}-${s.end.toFixed(2)}]`,
      ),
    });
  }

  return results;
}

function checkOverlap(subs: Subtitle[]): CheckResult[] {
  const results: CheckResult[] = [];
  const byScene = new Map<string, Subtitle[]>();

  for (const s of subs) {
    if (!byScene.has(s.sceneId)) byScene.set(s.sceneId, []);
    byScene.get(s.sceneId)!.push(s);
  }

  const overlaps: string[] = [];

  for (const [sceneId, sceneSubs] of byScene) {
    // 按 start 排序
    sceneSubs.sort((a, b) => a.start - b.start);

    for (let i = 1; i < sceneSubs.length; i++) {
      const prev = sceneSubs[i - 1];
      const curr = sceneSubs[i];

      // 检查时间顺序
      if (curr.start < prev.start) {
        overlaps.push(
          `${sceneId}: 字幕时间未升序 (${prev.start.toFixed(2)} > ${curr.start.toFixed(2)})`,
        );
      }

      // 检查重叠
      if (curr.start < prev.end) {
        overlaps.push(
          `${sceneId}: 字幕重叠 (${prev.end.toFixed(2)} > ${curr.start.toFixed(2)})`,
        );
      }
    }
  }

  if (overlaps.length > 0) {
    results.push({
      level: "error",
      rule: "subtitle-overlap",
      message: `${overlaps.length} 处字幕时间重叠或乱序`,
      scenes: overlaps,
    });
  }

  return results;
}

function checkTextLength(subs: Subtitle[]): CheckResult[] {
  const results: CheckResult[] = [];
  const tooLong = subs.filter((s) => s.text.length > MAX_CHARS_PER_SUBTITLE);

  if (tooLong.length > 0) {
    results.push({
      level: "warning",
      rule: "subtitle-too-long",
      message: `${tooLong.length} 条字幕超过 ${MAX_CHARS_PER_SUBTITLE} 字符（可能需要换行）`,
      scenes: tooLong.map(
        (s) => `${s.sceneId}: "${s.text}" (${s.text.length}字)`,
      ),
    });
  }

  return results;
}

function checkSpokenTextRatio(
  subs: Subtitle[],
  sceneMap: Map<string, VideoScene>,
): CheckResult[] {
  const results: CheckResult[] = [];
  const warnings: string[] = [];

  // 按 scene 聚合字幕文本
  const subsByScene = new Map<string, string>();
  for (const s of subs) {
    const existing = subsByScene.get(s.sceneId) || "";
    subsByScene.set(s.sceneId, existing + s.text);
  }

  for (const [sceneId, subText] of subsByScene) {
    const scene = sceneMap.get(sceneId);
    if (!scene?.spokenText) continue;

    const ratio = subText.length / scene.spokenText.length;

    if (ratio > LENGTH_RATIO_WARN_HIGH) {
      warnings.push(
        `${sceneId}: 字幕长度是 spokenText 的 ${ratio.toFixed(1)}x，可能是改写而非转录`,
      );
    } else if (ratio < LENGTH_RATIO_WARN_LOW) {
      warnings.push(
        `${sceneId}: 字幕长度仅 spokenText 的 ${(ratio * 100).toFixed(0)}%，可能遗漏内容`,
      );
    }
  }

  if (warnings.length > 0) {
    results.push({
      level: "warning",
      rule: "spoken-text-mismatch",
      message: `${warnings.length} 个 scene 的字幕与 spokenText 长度差异较大`,
      scenes: warnings,
    });
  }

  return results;
}

function checkAudioTimingRange(
  subs: Subtitle[],
  audioSegments: AudioSegment[],
): CheckResult[] {
  const results: CheckResult[] = [];
  const timingMap = new Map(audioSegments.map((s) => [s.sceneId, s]));
  const outOfRange: string[] = [];

  for (const sub of subs) {
    const timing = timingMap.get(sub.sceneId);
    if (!timing || timing.duration === 0) continue;

    if (sub.start < timing.start - 0.1 || sub.end > timing.end + 0.1) {
      outOfRange.push(
        `${sub.sceneId}: 字幕[${sub.start.toFixed(2)}-${sub.end.toFixed(2)}] 超出音频范围[${timing.start.toFixed(2)}-${timing.end.toFixed(2)}]`,
      );
    }
  }

  if (outOfRange.length > 0) {
    results.push({
      level: "warning",
      rule: "subtitle-out-of-audio-range",
      message: `${outOfRange.length} 条字幕超出音频时序范围`,
      scenes: outOfRange,
    });
  }

  return results;
}

function checkLineCount(subs: Subtitle[]): CheckResult[] {
  const results: CheckResult[] = [];
  const tooManyLines: string[] = [];

  for (const sub of subs) {
    const estimatedLines = Math.ceil(sub.text.length / MAX_LINE_WIDTH);
    if (estimatedLines > 2) {
      tooManyLines.push(
        `${sub.sceneId}: "${sub.text}" 估算 ${estimatedLines} 行（${sub.text.length}字）`,
      );
    }
  }

  if (tooManyLines.length > 0) {
    results.push({
      level: "warning",
      rule: "subtitle-exceeds-two-lines",
      message: `${tooManyLines.length} 条字幕估算超过 2 行，手机端可能遮挡主体`,
      scenes: tooManyLines,
    });
  }

  return results;
}

function checkContentHeavyOverlap(
  subs: Subtitle[],
  sceneMap: Map<string, VideoScene>,
): CheckResult[] {
  const results: CheckResult[] = [];
  const riskyScenes: string[] = [];

  const subsByScene = new Map<string, number>();
  for (const s of subs) {
    subsByScene.set(s.sceneId, (subsByScene.get(s.sceneId) || 0) + 1);
  }

  for (const [sceneId, count] of subsByScene) {
    const scene = sceneMap.get(sceneId);
    if (!scene?.type) continue;

    if (CONTENT_HEAVY_TYPES.has(scene.type) && count > 4) {
      riskyScenes.push(
        `${sceneId}(${scene.type}): ${count} 条字幕，内容密集型页面字幕过多`,
      );
    }
  }

  if (riskyScenes.length > 0) {
    results.push({
      level: "warning",
      rule: "content-heavy-scene-subtitle-overlap",
      message: `${riskyScenes.length} 个内容密集型 scene 字幕过多，可能遮挡标签/模板卡/截图`,
      scenes: riskyScenes,
    });
  }

  return results;
}

// ─── 主流程 ───────────────────────────────────────

function main() {
  const spec: VideoSpec = JSON.parse(fs.readFileSync(VIDEO_SPEC_PATH, "utf-8"));
  const rawSubs = JSON.parse(fs.readFileSync(SUBTITLES_PATH, "utf-8"));

  let audioTiming: AudioTiming = { segments: [] };
  try {
    audioTiming = JSON.parse(fs.readFileSync(AUDIO_TIMING_PATH, "utf-8"));
  } catch {
    // audioTiming 不存在时跳过音频范围检查
  }

  const sceneIds = new Set<string>();
  const sceneMap = new Map<string, VideoScene>();

  for (const scene of spec.scenes) {
    sceneIds.add(scene.id);
    sceneMap.set(scene.id, scene);
    for (const segmentId of scene.audioSegmentIds ?? []) {
      sceneIds.add(segmentId);
      sceneMap.set(segmentId, scene);
    }
  }

  console.log(`\n视频: ${spec.meta.title}`);
  console.log(`\n${"═".repeat(60)}`);
  console.log("字幕验证");
  console.log("═".repeat(60));

  // 先检查是否为数组
  const arrayCheck = checkIsArray(rawSubs);
  if (arrayCheck.length > 0) {
    for (const r of arrayCheck) {
      console.log(`\n❌ [${r.rule}] ${r.message}`);
    }
    process.exit(1);
  }

  const subs: Subtitle[] = rawSubs;
  console.log(`字幕条数: ${subs.length}`);

  const allResults: CheckResult[] = [
    ...checkSceneIdExists(subs, sceneIds),
    ...checkTimeOrder(subs),
    ...checkOverlap(subs),
    ...checkTextLength(subs),
    ...checkSpokenTextRatio(subs, sceneMap),
    ...checkAudioTimingRange(subs, audioTiming.segments),
    ...checkLineCount(subs),
    ...checkContentHeavyOverlap(subs, sceneMap),
  ];

  const errors = allResults.filter((r) => r.level === "error");
  const warnings = allResults.filter((r) => r.level === "warning");

  for (const result of allResults) {
    const icon = result.level === "error" ? "❌" : "⚠️";
    console.log(`\n${icon} [${result.rule}] ${result.message}`);
    if (result.scenes) {
      // 截断输出，避免刷屏
      const display = result.scenes.slice(0, 10);
      console.log(`   涉及: ${display.join(", ")}`);
      if (result.scenes.length > 10) {
        console.log(`   ... 共 ${result.scenes.length} 条`);
      }
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  if (errors.length > 0) {
    console.log(
      `\n结论: 发现 ${errors.length} 个错误，${warnings.length} 个警告`,
    );
    console.log("建议: 重新生成字幕后再渲染");
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log(`\n结论: 发现 ${warnings.length} 个警告`);
    console.log("建议: 检查字幕是否需要调整");
    process.exit(0);
  } else {
    console.log("\n结论: 字幕验证通过");
    process.exit(0);
  }
}

main();
