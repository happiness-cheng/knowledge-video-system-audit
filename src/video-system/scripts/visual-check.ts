#!/usr/bin/env npx tsx
/**
 * visual:check — 读取 visualMetrics.json，输出风险摘要
 *
 * 用法：npx tsx src/video-system/scripts/visual-check.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";

const METRICS_PATH = path.resolve(__dirname, "../data/visualMetrics.json");

function main() {
  let metrics: {
    generatedAt: string;
    summary: {
      sceneCount: number;
      highRiskCount: number;
      mediumRiskCount: number;
      mobileReadabilityRisk: boolean;
      pptRisk: boolean;
    };
    scenes: Array<{
      sceneId: string;
      contractKey: string;
      recommendation: string;
      risks: string[];
    }>;
  };

  try {
    metrics = JSON.parse(fs.readFileSync(METRICS_PATH, "utf-8"));
  } catch {
    console.error("\n❌ 无法读取 visualMetrics.json，请先运行 visual:metrics");
    process.exit(1);
  }

  console.log(`\nvisual:check 报告`);
  console.log(`${"═".repeat(60)}`);
  console.log(`生成时间: ${metrics.generatedAt}`);
  console.log(`场景数: ${metrics.summary.sceneCount}`);

  const highRisks = metrics.scenes.filter((s) => s.recommendation === "revise");
  const mediumRisks = metrics.scenes.filter(
    (s) => s.recommendation === "inspect",
  );
  const passes = metrics.scenes.filter((s) => s.recommendation === "pass");

  console.log(`\n✅ pass: ${passes.length}`);
  console.log(`⚠️ inspect: ${mediumRisks.length}`);
  console.log(`❌ revise: ${highRisks.length}`);

  if (metrics.summary.mobileReadabilityRisk) {
    console.log(`\n🚨 手机端可读性风险`);
  }
  if (metrics.summary.pptRisk) {
    console.log(`🚨 PPT 感风险`);
  }

  if (highRisks.length > 0) {
    console.log(`\n${"─".repeat(60)}`);
    console.log("高风险项:");
    for (const scene of highRisks) {
      console.log(`\n  ❌ ${scene.sceneId} (${scene.contractKey})`);
      for (const risk of scene.risks) {
        console.log(`     · ${risk}`);
      }
    }
  }

  if (mediumRisks.length > 0) {
    console.log(`\n${"─".repeat(60)}`);
    console.log("中风险项:");
    for (const scene of mediumRisks) {
      console.log(`\n  ⚠️ ${scene.sceneId} (${scene.contractKey})`);
      for (const risk of scene.risks) {
        console.log(`     · ${risk}`);
      }
    }
  }

  // 最终判定
  console.log(`\n${"═".repeat(60)}`);
  if (highRisks.length > 0) {
    console.log("结论: revise — 有高风险项需要处理");
    process.exit(1);
  } else if (mediumRisks.length > 0) {
    console.log("结论: inspect — 有中风险项建议检查");
    process.exit(0);
  } else {
    console.log("结论: pass — 无风险项");
    process.exit(0);
  }
}

main();
