#!/usr/bin/env npx tsx
/**
 * visualMetrics.json 生成脚本
 *
 * 静态估算 videoSpec 的视觉风险，输出 visualMetrics.json。
 * 不依赖 DOM 测量，基于规则推断。
 *
 * 用法：npx tsx src/video-system/scripts/generate-visual-metrics.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";

import { projectedMobilePx } from "../visual/projectedMobilePx";
import { chineseTitleBreakRisk } from "../visual/chineseTitleBreak";
import { getSceneContract, contractKey } from "../visual/sceneContracts";
import type { SceneContract } from "../visual/sceneContracts";

// ─── 路径 ─────────────────────────────────────────
const VIDEO_SPEC_PATH = path.resolve(__dirname, "../data/videoSpec.json");
const OUTPUT_PATH = path.resolve(__dirname, "../data/visualMetrics.json");

// ─── 类型 ─────────────────────────────────────────
interface VideoSpecScene {
  id: string;
  type: string;
  visualRole?: string;
  title?: string;
  quote?: string;
  screenText?: string;
  subtitle?: string;
  leftTitle?: string;
  rightTitle?: string;
  leftItems?: string[];
  rightItems?: string[];
  bullets?: Array<{ text: string }>;
  steps?: string[];
  items?: string[];
  caption?: string;
  assetLayout?: {
    left?: {
      assetId?: string;
      label?: string;
      caption?: string;
      highlight?: unknown[];
    };
    right?: {
      assetId?: string;
      label?: string;
      caption?: string;
      highlight?: unknown[];
    };
  };
  keywords?: string[];
  durationEstimate?: number;
}

interface SceneMetric {
  sceneId: string;
  sceneType: string;
  visualRole: string | null;
  contractKey: string;
  titleText: string;
  titleChars: number;
  estimatedTitleLines: number;
  titleBreakRisk: string;
  screenTextChars: number;
  captionMaxLines: number | null;
  equalWeightBlocks: number;
  primaryAreaRatioEstimated: number | null;
  projectedTitlePx: number | null;
  projectedBodyPx: number | null;
  needsEvidenceAnchor: boolean;
  evidenceAnchorPresent: boolean;
  mobileReadabilityRisk: boolean;
  pptRisk: boolean;
  risks: string[];
  recommendation: "pass" | "inspect" | "revise";
}

interface VisualMetrics {
  generatedAt: string;
  source: {
    videoSpec: string;
    visualDirectionSpecPresent: boolean;
  };
  summary: {
    sceneCount: number;
    highRiskCount: number;
    mediumRiskCount: number;
    mobileReadabilityRisk: boolean;
    pptRisk: boolean;
  };
  scenes: SceneMetric[];
}

// ─── 工具函数 ─────────────────────────────────────

function getTitleText(scene: VideoSpecScene): string {
  return scene.title || scene.quote || scene.screenText || "";
}

function getCaptionMaxLines(scene: VideoSpecScene): number | null {
  const captions = [
    scene.caption,
    scene.assetLayout?.left?.caption,
    scene.assetLayout?.right?.caption,
  ].filter(Boolean) as string[];
  if (captions.length === 0) return null;
  const maxLen = Math.max(...captions.map((c) => c.length));
  // 粗略估算：每行约 14 个中文字符
  return Math.ceil(maxLen / 14);
}

function countEqualWeightBlocks(scene: VideoSpecScene): number {
  // comparison / two-column / pros-cons：左右各算 1 个块
  if (scene.leftTitle || scene.rightTitle || scene.assetLayout) {
    return 2; // 左栏 + 右栏
  }

  let count = 0;
  // bullets：每个算 1 个
  if (scene.bullets) count += scene.bullets.length;
  // steps：每个算 1 个
  if (scene.steps) count += scene.steps.length;
  // todo items：每个算 1 个
  if (scene.items) count += scene.items.length;
  return count;
}

function hasEvidenceAnchor(scene: VideoSpecScene): boolean {
  if (!scene.assetLayout) return false;
  const left = scene.assetLayout.left;
  const right = scene.assetLayout.right;
  return !!(
    left?.assetId ||
    left?.label ||
    left?.caption ||
    (left?.highlight && left.highlight.length > 0) ||
    right?.assetId ||
    right?.label ||
    right?.caption ||
    (right?.highlight && right.highlight.length > 0)
  );
}

function analyzeScene(scene: VideoSpecScene): SceneMetric {
  const contract = getSceneContract(scene.type, scene.visualRole);
  const titleText = getTitleText(scene);
  const titleBreak = chineseTitleBreakRisk(titleText);
  const captionMaxLines = getCaptionMaxLines(scene);
  const equalWeightBlocks = countEqualWeightBlocks(scene);
  const evidenceAnchor = hasEvidenceAnchor(scene);

  // 投影字号（直接使用合约阈值，即手机端最小可读字号）
  const projectedTitle = contract.minProjectedTitlePx;
  const projectedBody = contract.minProjectedBodyPx ?? null;

  // 风险判定
  const risks: string[] = [];
  let recommendation: "pass" | "inspect" | "revise" = "pass";

  // 标题断行风险
  if (titleBreak.riskLevel === "high") {
    risks.push(`标题断行高风险: ${titleBreak.notes.join("; ")}`);
    recommendation = "revise";
  } else if (titleBreak.riskLevel === "medium") {
    risks.push(`标题断行中风险: ${titleBreak.notes.join("; ")}`);
    if (recommendation === "pass") recommendation = "inspect";
  }

  // caption 行数风险
  if (
    captionMaxLines !== null &&
    contract.maxCaptionLines &&
    captionMaxLines > contract.maxCaptionLines
  ) {
    risks.push(
      `caption 估算 ${captionMaxLines} 行，超过上限 ${contract.maxCaptionLines}`,
    );
    recommendation = "revise";
  }

  // caption 字数风险（comparison / evidence / two-column）
  const captionTexts = [
    scene.assetLayout?.left?.caption,
    scene.assetLayout?.right?.caption,
    scene.caption,
  ].filter(Boolean) as string[];
  if (captionTexts.length > 0) {
    const maxCaptionChars = Math.max(...captionTexts.map((c) => c.length));
    if (maxCaptionChars >= 23) {
      risks.push(`caption ${maxCaptionChars} 字，超过 23 字上限`);
      recommendation = "revise";
    } else if (maxCaptionChars >= 16) {
      risks.push(`caption ${maxCaptionChars} 字，建议检查手机端观感`);
      if (recommendation === "pass") recommendation = "inspect";
    }
  }

  // 等权模块过多
  if (equalWeightBlocks > contract.maxEqualWeightBlocks) {
    risks.push(
      `等权模块 ${equalWeightBlocks} 个，超过上限 ${contract.maxEqualWeightBlocks}`,
    );
    recommendation = "revise";
  }

  // 证据锚点缺失
  if (contract.needsEvidenceAnchor && !evidenceAnchor) {
    risks.push("需要证据锚点但未找到 assetLayout");
    if (recommendation === "pass") recommendation = "inspect";
  }

  // 模板保存价值
  if (
    contract.needsScreenshotSaveable &&
    scene.items &&
    scene.items.length < 3
  ) {
    risks.push("模板项过少，可能不值得截图保存");
    if (recommendation === "pass") recommendation = "inspect";
  }

  // 手机端可读性风险
  const mobileReadabilityRisk = titleBreak.riskLevel === "high";

  // PPT 感风险
  const pptRisk = equalWeightBlocks > contract.maxEqualWeightBlocks;

  return {
    sceneId: scene.id,
    sceneType: scene.type,
    visualRole: scene.visualRole ?? null,
    contractKey: contractKey(contract),
    titleText,
    titleChars: titleBreak.charCount,
    estimatedTitleLines: titleBreak.estimatedLines,
    titleBreakRisk: titleBreak.riskLevel,
    screenTextChars: (scene.screenText || "").length,
    captionMaxLines,
    equalWeightBlocks,
    primaryAreaRatioEstimated: null,
    projectedTitlePx: projectedTitle,
    projectedBodyPx: projectedBody,
    needsEvidenceAnchor: contract.needsEvidenceAnchor ?? false,
    evidenceAnchorPresent: evidenceAnchor,
    mobileReadabilityRisk,
    pptRisk,
    risks,
    recommendation,
  };
}

// ─── 主流程 ───────────────────────────────────────
function main() {
  let spec: { scenes: VideoSpecScene[] };
  try {
    spec = JSON.parse(fs.readFileSync(VIDEO_SPEC_PATH, "utf-8"));
  } catch (err) {
    console.error(`\n❌ 无法读取 videoSpec.json: ${err}`);
    process.exit(1);
  }

  const visualDirectionSpecPath = path.resolve(
    __dirname,
    "../data/visualDirectionSpec.md",
  );
  const visualDirectionSpecPresent = fs.existsSync(visualDirectionSpecPath);

  const sceneMetrics = spec.scenes.map(analyzeScene);

  const highRiskCount = sceneMetrics.filter(
    (s) => s.recommendation === "revise",
  ).length;
  const mediumRiskCount = sceneMetrics.filter(
    (s) => s.recommendation === "inspect",
  ).length;

  const metrics: VisualMetrics = {
    generatedAt: new Date().toISOString(),
    source: {
      videoSpec: VIDEO_SPEC_PATH,
      visualDirectionSpecPresent,
    },
    summary: {
      sceneCount: sceneMetrics.length,
      highRiskCount,
      mediumRiskCount,
      mobileReadabilityRisk: sceneMetrics.some((s) => s.mobileReadabilityRisk),
      pptRisk: sceneMetrics.some((s) => s.pptRisk),
    },
    scenes: sceneMetrics,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(metrics, null, 2), "utf-8");

  // 输出报告
  console.log(`\nvisualMetrics 生成完成`);
  console.log(`${"═".repeat(60)}`);
  console.log(`场景数: ${metrics.summary.sceneCount}`);
  console.log(`高风险: ${metrics.summary.highRiskCount}`);
  console.log(`中风险: ${metrics.summary.mediumRiskCount}`);
  console.log(
    `手机端可读性风险: ${metrics.summary.mobileReadabilityRisk ? "是" : "否"}`,
  );
  console.log(`PPT 感风险: ${metrics.summary.pptRisk ? "是" : "否"}`);

  for (const scene of sceneMetrics) {
    const icon =
      scene.recommendation === "revise"
        ? "❌"
        : scene.recommendation === "inspect"
          ? "⚠️"
          : "✅";
    console.log(
      `\n${icon} ${scene.sceneId} (${scene.contractKey}) — ${scene.recommendation}`,
    );
    if (scene.risks.length > 0) {
      for (const risk of scene.risks) {
        console.log(`   · ${risk}`);
      }
    }
  }

  console.log(`\n输出: ${OUTPUT_PATH}`);
}

main();
