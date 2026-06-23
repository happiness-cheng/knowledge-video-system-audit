#!/usr/bin/env npx tsx
/**
 * visual:fixtures — 运行视觉 fixture 回归测试
 *
 * 用法：npx tsx src/video-system/scripts/visual-fixtures.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { chineseTitleBreakRisk } from "../visual/chineseTitleBreak";
import { getSceneContract, contractKey } from "../visual/sceneContracts";

// ─── 路径 ─────────────────────────────────────────
const FIXTURES_DIR = path.resolve(__dirname, "../fixtures/visual");

interface FixtureResult {
  file: string;
  passed: boolean;
  expected: string;
  actual: string;
  risks: string[];
}

// 每个 fixture 文件的预期 recommendation
const EXPECTATIONS: Record<string, string> = {
  "short-title-hook.json": "pass",
  "long-title-hook.json": "inspect",
  "comparison-long-caption.json": "revise",
  "comparison-with-screenshot.json": "pass",
  "template-4-items.json": "pass",
  "template-6-items.json": "pass",
  "process-3-steps.json": "pass",
  "process-5-steps.json": "pass",
  "code-claude-md.json": "pass",
  "diff-before-after.json": "pass",
  "terminal-validate-result.json": "pass",
  "image-hero-complex-visual.json": "pass",
  "gantt-execution-plan.json": "pass",
  "pressure-build-hook.json": "pass",
  "confused-to-guided.json": "pass",
  "wrong-to-correct.json": "pass",
};

function analyzeFixture(filePath: string): {
  recommendation: string;
  risks: string[];
} {
  const spec = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const scene = spec.scenes?.[0];
  if (!scene) return { recommendation: "pass", risks: [] };

  const contract = getSceneContract(scene.type, scene.visualRole);
  const titleText = scene.title || scene.quote || scene.screenText || "";
  const titleBreak = chineseTitleBreakRisk(titleText);

  // caption 检查
  const captionTexts = [
    scene.assetLayout?.left?.caption,
    scene.assetLayout?.right?.caption,
    scene.caption,
  ].filter(Boolean) as string[];

  // 等权模块计数（标题不计入，它不是内容块）
  let equalWeightBlocks = 0;
  if (scene.leftTitle || scene.rightTitle || scene.assetLayout) {
    equalWeightBlocks = 2;
  } else if (scene.type === "image-hero") {
    equalWeightBlocks =
      1 + Math.max(scene.points?.length ?? 0, scene.annotations?.length ?? 0);
  } else if (scene.type === "gantt") {
    equalWeightBlocks = scene.lanes?.length ?? 0;
  } else {
    if (scene.bullets) equalWeightBlocks += scene.bullets.length;
    if (scene.steps) equalWeightBlocks += scene.steps.length;
    if (scene.items) equalWeightBlocks += scene.items.length;
  }

  const risks: string[] = [];
  let recommendation = "pass";

  // 标题断行
  if (titleBreak.riskLevel === "high") {
    risks.push(`标题断行高风险: ${titleBreak.charCount}字`);
    recommendation = "revise";
  } else if (titleBreak.riskLevel === "medium") {
    risks.push(`标题断行中风险: ${titleBreak.charCount}字`);
    if (recommendation === "pass") recommendation = "inspect";
  }

  // caption 字数
  if (captionTexts.length > 0) {
    const maxCaptionChars = Math.max(...captionTexts.map((c) => c.length));
    if (maxCaptionChars >= 23) {
      risks.push(`caption ${maxCaptionChars} 字，超过上限`);
      recommendation = "revise";
    } else if (maxCaptionChars >= 16) {
      risks.push(`caption ${maxCaptionChars} 字，建议检查`);
      if (recommendation === "pass") recommendation = "inspect";
    }
  }

  // 等权模块
  if (equalWeightBlocks > contract.maxEqualWeightBlocks) {
    risks.push(
      `等权模块 ${equalWeightBlocks} 超过上限 ${contract.maxEqualWeightBlocks}`,
    );
    recommendation = "revise";
  }

  return { recommendation, risks };
}

function main() {
  const files = fs.readdirSync(FIXTURES_DIR).filter((f) => f.endsWith(".json"));

  console.log(`\nvisual:fixtures 回归测试`);
  console.log(`${"═".repeat(60)}`);

  const results: FixtureResult[] = [];

  for (const file of files) {
    const filePath = path.join(FIXTURES_DIR, file);
    const expected = EXPECTATIONS[file] ?? "pass";
    const { recommendation: actual, risks } = analyzeFixture(filePath);
    const passed = actual === expected;

    results.push({ file, passed, expected, actual, risks });

    const icon = passed ? "✅" : "❌";
    console.log(`\n${icon} ${file}`);
    console.log(`   预期: ${expected} | 实际: ${actual}`);
    if (risks.length > 0) {
      for (const r of risks) {
        console.log(`   · ${r}`);
      }
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`结果: ${passed} 通过, ${failed} 失败`);

  if (failed > 0) {
    console.log("\n失败项:");
    for (const r of results.filter((r) => !r.passed)) {
      console.log(`  ❌ ${r.file}: 预期 ${r.expected}，实际 ${r.actual}`);
    }
    process.exit(1);
  }
}

main();
