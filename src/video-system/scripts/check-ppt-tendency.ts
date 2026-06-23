#!/usr/bin/env npx tsx
/**
 * videoSpec PPT 化检查脚本
 *
 * 检查 videoSpec.json 是否有"高级 PPT"倾向：
 * 1. 连续 3+ 个 scene 类型相同
 * 2. 连续 3+ 个 scene 都是"静态展示"类型
 * 3. scene 缺少 animation 字段
 * 4. scene 缺少 visualRole 字段
 *
 * 用法：npx tsx src/video-system/scripts/check-ppt-tendency.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ─── 路径 ─────────────────────────────────────────
const VIDEO_SPEC_PATH = path.resolve(__dirname, "../data/videoSpec.json");

// ─── 类型 ─────────────────────────────────────────
interface VideoScene {
  id: string;
  type: string;
  animation?: string;
  visualRole?: string;
  beatRole?: string;
  screenText?: string;
  [key: string]: unknown;
}

interface VideoSpec {
  meta: { title: string; [key: string]: unknown };
  scenes: VideoScene[];
}

// ─── 静态展示类型（信息一次性摊开，不跟随口播逐步呈现）───
const STATIC_DISPLAY_TYPES = new Set([
  "title-subtitle",
  "big-quote",
  "bullets",
  "comparison", // 对比页如果不用 progressive-reveal 也是静态
]);

// ─── 结构型页面（支持逐步揭示）────────────────────
const STRUCTURED_TYPES = new Set([
  "process-steps",
  "flow-diagram",
  "roadmap",
  "timeline",
  "mindmap",
  "todo-checklist",
]);

// ─── 有 Sequence 内部时间轴的类型 ─────────────────
const SEQUENCE_INTERNAL_TYPES = new Set([
  "bullets",
  "process-steps",
  "big-quote",
]);

/**
 * 判断 scene 是否"真正静态"：
 * - bullets / process-steps / big-quote 有内部时序（steps/revealMode/timingNotes）时不算静态
 * - comparison / two-column 有 assetLayout 时不算静态（截图对比场景）
 */
function isTrulyStatic(scene: VideoScene): boolean {
  if (!STATIC_DISPLAY_TYPES.has(scene.type)) return false;

  // 有 Sequence 内部时间轴的类型
  if (SEQUENCE_INTERNAL_TYPES.has(scene.type)) {
    if ("steps" in scene || "revealMode" in scene || "timingNotes" in scene) {
      return false;
    }
  }

  // comparison / two-column 有 assetLayout 时不算静态
  if (
    (scene.type === "comparison" || scene.type === "two-column") &&
    "assetLayout" in scene
  ) {
    return false;
  }

  return true;
}

// ─── 检查结果类型 ─────────────────────────────────
interface CheckResult {
  level: "error" | "warning";
  rule: string;
  message: string;
  scenes?: string[];
}

// ─── 检查函数 ─────────────────────────────────────

function checkConsecutiveSameType(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  let count = 1;
  let startIdx = 0;

  for (let i = 1; i < scenes.length; i++) {
    if (scenes[i].type === scenes[i - 1].type) {
      count++;
    } else {
      if (count >= 3) {
        const sceneIds = scenes.slice(startIdx, i).map((s) => s.id);
        results.push({
          level: "error",
          rule: "consecutive-same-type",
          message: `连续 ${count} 个 scene 类型相同（${scenes[i - 1].type}），视觉重复严重`,
          scenes: sceneIds,
        });
      }
      count = 1;
      startIdx = i;
    }
  }
  // 检查最后一组
  if (count >= 3) {
    const sceneIds = scenes.slice(startIdx).map((s) => s.id);
    results.push({
      level: "error",
      rule: "consecutive-same-type",
      message: `连续 ${count} 个 scene 类型相同（${scenes[startIdx].type}），视觉重复严重`,
      scenes: sceneIds,
    });
  }

  return results;
}

function checkConsecutiveStaticDisplay(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  let count = 1;
  let startIdx = 0;

  for (let i = 1; i < scenes.length; i++) {
    const prevStatic = isTrulyStatic(scenes[i - 1]);
    const currStatic = isTrulyStatic(scenes[i]);

    if (prevStatic && currStatic) {
      count++;
    } else {
      if (count >= 2) {
        const sceneIds = scenes.slice(startIdx, i).map((s) => s.id);
        const types = scenes
          .slice(startIdx, i)
          .map((s) => s.type)
          .filter((t, idx, arr) => arr.indexOf(t) === idx);
        results.push({
          level: "warning",
          rule: "consecutive-static-display",
          message: `连续 ${count} 个 scene 都是静态展示类型（${types.join(", ")}），像 PPT 翻页`,
          scenes: sceneIds,
        });
      }
      count = currStatic ? 1 : 0;
      startIdx = currStatic ? i : i;
    }
  }
  // 检查最后一组
  if (count >= 2) {
    const sceneIds = scenes.slice(startIdx).map((s) => s.id);
    results.push({
      level: "warning",
      rule: "consecutive-static-display",
      message: `连续 ${count} 个 scene 都是静态展示类型，像 PPT 翻页`,
      scenes: sceneIds,
    });
  }

  return results;
}

function checkMissingAnimation(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  const missingScenes = scenes.filter((s) => !s.animation);

  if (missingScenes.length > 0) {
    results.push({
      level: "error",
      rule: "missing-animation",
      message: `${missingScenes.length} 个 scene 缺少 animation 字段`,
      scenes: missingScenes.map((s) => s.id),
    });
  }

  return results;
}

function checkMissingVisualRole(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  const missingScenes = scenes.filter((s) => !s.visualRole);

  if (missingScenes.length > 0) {
    results.push({
      level: "warning",
      rule: "missing-visualRole",
      message: `${missingScenes.length} 个 scene 缺少 visualRole 字段`,
      scenes: missingScenes.map((s) => s.id),
    });
  }

  return results;
}

function checkStaticRatio(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  const staticCount = scenes.filter((s) => isTrulyStatic(s)).length;
  const ratio = staticCount / scenes.length;

  if (ratio > 0.35) {
    results.push({
      level: "warning",
      rule: "high-static-ratio",
      message: `静态展示类 scene 占比 ${Math.round(ratio * 100)}%（${staticCount}/${scenes.length}），整体像 PPT`,
    });
  }

  return results;
}

function checkStructuredTypes(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  const structuredCount = scenes.filter((s) =>
    STRUCTURED_TYPES.has(s.type),
  ).length;

  if (structuredCount === 0 && scenes.length > 5) {
    results.push({
      level: "warning",
      rule: "no-structured-types",
      message: `没有使用任何结构型页面（process-steps, flow-diagram, todo-checklist 等），信息呈现方式单一`,
    });
  }

  return results;
}

function checkStaticWithFadeIn(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  const problemScenes = scenes.filter(
    (s) => isTrulyStatic(s) && s.animation === "fade-in",
  );

  if (problemScenes.length > 0) {
    results.push({
      level: "warning",
      rule: "static-with-fade-in",
      message: `${problemScenes.length} 个静态展示页使用 fade-in 动画，更像 PPT 翻页（建议用 progressive-reveal 或 slide-up）`,
      scenes: problemScenes.map((s) => s.id),
    });
  }

  return results;
}

// ─── 主流程 ───────────────────────────────────────
function main() {
  const spec: VideoSpec = JSON.parse(fs.readFileSync(VIDEO_SPEC_PATH, "utf-8"));

  console.log(`\n视频: ${spec.meta.title}`);
  console.log(`场景数: ${spec.scenes.length}`);
  console.log(`\n${"═".repeat(60)}`);
  console.log("PPT 化检查");
  console.log("═".repeat(60));

  const allResults: CheckResult[] = [
    ...checkConsecutiveSameType(spec.scenes),
    ...checkConsecutiveStaticDisplay(spec.scenes),
    ...checkMissingAnimation(spec.scenes),
    ...checkMissingVisualRole(spec.scenes),
    ...checkStaticRatio(spec.scenes),
    ...checkStructuredTypes(spec.scenes),
    ...checkStaticWithFadeIn(spec.scenes),
  ];

  const errors = allResults.filter((r) => r.level === "error");
  const warnings = allResults.filter((r) => r.level === "warning");

  // 输出结果
  for (const result of allResults) {
    const icon = result.level === "error" ? "❌" : "⚠️";
    console.log(`\n${icon} [${result.rule}] ${result.message}`);
    if (result.scenes) {
      console.log(`   涉及场景: ${result.scenes.join(", ")}`);
    }
  }

  // 场景类型分布
  console.log(`\n${"─".repeat(60)}`);
  console.log("场景类型分布:");
  const typeCount = new Map<string, number>();
  for (const s of spec.scenes) {
    typeCount.set(s.type, (typeCount.get(s.type) || 0) + 1);
  }
  for (const [type, count] of typeCount) {
    const isStatic = STATIC_DISPLAY_TYPES.has(type);
    const marker = isStatic ? " (静态)" : "";
    console.log(`  ${type}: ${count}${marker}`);
  }

  // 总结
  console.log(`\n${"─".repeat(60)}`);
  if (errors.length > 0) {
    console.log(
      `\n结论: 发现 ${errors.length} 个错误，${warnings.length} 个警告`,
    );
    console.log("建议: 回到 ChatGPT 修改 videoSpec 后再执行渲染");
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log(`\n结论: 发现 ${warnings.length} 个警告`);
    console.log("建议: 检查是否需要调整画面呈现节奏");
    process.exit(0);
  } else {
    console.log("\n结论: 未发现 PPT 化倾向");
    process.exit(0);
  }
}

main();
