#!/usr/bin/env npx tsx
/**
 * 关键帧截图脚本
 *
 * 读取 audioTiming.json，为每个 scene 输出关键帧截图。
 * 用于审片：视觉中心、字幕遮挡、截图标签化、手机端可读性。
 *
 * 用法：npx tsx src/video-system/scripts/capture-keyframes.ts
 * 可选参数：--scene=S01 只截指定 scene
 * 可选参数：--mobile 输出手机缩小预览（390px 宽）
 * 可选参数：--composition=KnowledgeVideoWithSubtitles 指定 Composition
 * 可选参数：--output-dir=out/keyframes/with-subtitles 指定输出目录
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { execFileSync } from "node:child_process";
import * as os from "node:os";
import { createMobileScaledPreview } from "../utils/mobileScaledPreview";

/** Windows 下 execFileSync 需要 shell: true 才能找到 .cmd 文件 */
const EXEC_OPTS: import("node:child_process").ExecFileSyncOptionsWithStringEncoding =
  {
    encoding: "utf-8",
    timeout: 60000,
    stdio: "pipe",
    shell: os.platform() === "win32",
  };

/** Windows 下用 npx.cmd，其他平台用 npx */
const NPX_CMD = os.platform() === "win32" ? "npx.cmd" : "npx";

// ─── 路径 ─────────────────────────────────────────
const DATA_DIR = path.resolve(__dirname, "../data");
const AUDIO_TIMING_PATH = path.join(DATA_DIR, "audioTiming.json");
const VIDEO_SPEC_PATH = path.join(DATA_DIR, "videoSpec.json");
const DEFAULT_KEYFRAME_DIR = path.resolve(__dirname, "../../../out/keyframes");

// ─── 类型 ─────────────────────────────────────────
interface AudioSegment {
  sceneId: string;
  text: string;
  start: number;
  end: number;
  duration: number;
}

interface AudioTiming {
  audioPath: string;
  provider: string;
  totalDuration: number;
  segments: AudioSegment[];
}

// ─── 参数解析 ─────────────────────────────────────
const args = process.argv.slice(2);
const sceneFilter = args.find((a) => a.startsWith("--scene="))?.split("=")[1];
const mobilePreview = args.includes("--mobile");
const composition =
  args.find((a) => a.startsWith("--composition="))?.split("=")[1] ??
  "KnowledgeVideo";
const outputDirArg = args
  .find((a) => a.startsWith("--output-dir="))
  ?.split("=")[1];
const KEYFRAME_DIR = outputDirArg
  ? path.resolve(outputDirArg)
  : DEFAULT_KEYFRAME_DIR;

// ─── 主流程 ───────────────────────────────────────
async function main() {
  const timing: AudioTiming = JSON.parse(
    fs.readFileSync(AUDIO_TIMING_PATH, "utf-8"),
  );

  fs.mkdirSync(KEYFRAME_DIR, { recursive: true });

  const fps = 30;
  const scenes = sceneFilter
    ? timing.segments.filter((s) => s.sceneId === sceneFilter)
    : timing.segments.filter((s) => s.duration > 0);

  console.log(`\n关键帧截图`);
  console.log(`场景数: ${scenes.length}`);
  console.log(`Composition: ${composition}`);
  console.log(`输出目录: ${KEYFRAME_DIR}`);
  console.log(`${"═".repeat(60)}`);

  // 计算 composition 最大帧数（从 videoSpec 的 durationEstimates 推算）
  let maxFrame: number;
  try {
    const spec = JSON.parse(fs.readFileSync(VIDEO_SPEC_PATH, "utf-8"));
    const totalDuration = spec.scenes.reduce(
      (sum: number, s: { durationEstimate?: number }) =>
        sum + (s.durationEstimate ?? 0),
      0,
    );
    maxFrame = Math.round(totalDuration * fps) - 1;
  } catch {
    maxFrame = Math.round(timing.totalDuration * fps) - 1;
  }

  const results: Array<{
    sceneId: string;
    frame: number;
    time: string;
    file: string;
    status: string;
  }> = [];

  for (const seg of scenes) {
    // 截取 scene 30% 处的帧（避开开头过渡，拿到稳定画面）
    const targetTime = seg.start + seg.duration * 0.3;
    const frame = Math.min(Math.round(targetTime * fps), maxFrame);
    const outFile = path.join(KEYFRAME_DIR, `${seg.sceneId}.png`);

    // 跳过超出 composition 范围的 segment
    if (frame > maxFrame || seg.start >= timing.totalDuration) {
      console.log(`  [${seg.sceneId}] 跳过（超出 composition 范围）`);
      results.push({
        sceneId: seg.sceneId,
        frame,
        time: `${targetTime.toFixed(1)}s`,
        file: outFile,
        status: "skipped: out of range",
      });
      continue;
    }

    console.log(
      `  [${seg.sceneId}] t=${targetTime.toFixed(1)}s frame=${frame} → ${outFile}`,
    );

    try {
      execFileSync(
        NPX_CMD,
        [
          "remotion",
          "still",
          "src/index.ts",
          composition,
          `--frame=${frame}`,
          `--output=${outFile}`,
        ],
        EXEC_OPTS,
      );
      results.push({
        sceneId: seg.sceneId,
        frame,
        time: `${targetTime.toFixed(1)}s`,
        file: outFile,
        status: "ok",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`    ❌ 失败: ${msg}`);
      results.push({
        sceneId: seg.sceneId,
        frame,
        time: `${targetTime.toFixed(1)}s`,
        file: outFile,
        status: `failed: ${msg}`,
      });
    }
  }

  // 手机缩小预览
  if (mobilePreview) {
    console.log(`\n${"─".repeat(60)}`);
    console.log("手机缩小预览（390px 宽）");
    const mobileDir = path.join(KEYFRAME_DIR, "mobile");
    fs.mkdirSync(mobileDir, { recursive: true });

    for (const seg of scenes) {
      const outFile = path.join(mobileDir, `${seg.sceneId}-mobile.png`);

      try {
        const sourceFile = path.join(KEYFRAME_DIR, `${seg.sceneId}.png`);
        if (!fs.existsSync(sourceFile)) {
          throw new Error(`source keyframe missing: ${sourceFile}`);
        }
        await createMobileScaledPreview(sourceFile, outFile);
        console.log(`  [${seg.sceneId}] mobile ✓`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`  [${seg.sceneId}] mobile ❌ ${msg}`);
      }
    }
  }

  // 汇总
  console.log(`\n${"─".repeat(60)}`);
  const ok = results.filter((r) => r.status === "ok").length;
  const skipped = results.filter((r) => r.status.startsWith("skipped")).length;
  const failed = results.filter(
    (r) => r.status !== "ok" && !r.status.startsWith("skipped"),
  ).length;
  console.log(`完成: ${ok} 成功, ${skipped} 跳过, ${failed} 失败`);
  console.log(`输出目录: ${KEYFRAME_DIR}`);

  if (failed > 0) {
    console.log("\n失败项:");
    for (const r of results.filter(
      (r) => r.status !== "ok" && !r.status.startsWith("skipped"),
    )) {
      console.log(`  [${r.sceneId}] ${r.status}`);
    }
    process.exit(1);
  }
}

main();
