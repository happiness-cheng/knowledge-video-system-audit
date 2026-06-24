#!/usr/bin/env npx tsx
/**
 * preview:visual — 统一视觉预览门禁
 *
 * 生成无字幕与带字幕两套关键帧，默认 contact sheet 使用带字幕版本。
 * 任一关键步骤失败则 exit code 非 0。
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";
import { assertPreProductionReviewReady } from "../utils/preProductionGate";

const DATA_DIR = path.resolve(__dirname, "../data");
const OUT_DIR = path.resolve(__dirname, "../../../out");
const KEYFRAME_DIR = path.join(OUT_DIR, "keyframes");
const NO_SUBS_DIR = path.join(KEYFRAME_DIR, "no-subtitles");
const WITH_SUBS_DIR = path.join(KEYFRAME_DIR, "with-subtitles");
const WITH_SUBS_MOBILE_DIR = path.join(WITH_SUBS_DIR, "mobile");
const METRICS_PATH = path.join(DATA_DIR, "visualMetrics.json");
const REPORT_PATH = path.join(DATA_DIR, "previewVisualReport.json");
const VIDEO_SPEC_PATH = path.join(DATA_DIR, "videoSpec.json");

interface CheckResult {
  name: string;
  status: "pass" | "inspect" | "revise" | "failed";
  message?: string;
}

interface SceneRisk {
  sceneId: string;
  recommendation: string;
  risks: string[];
}

interface PreviewVisualReport {
  generatedAt: string;
  commandStatus: "pass" | "failed";
  visualGateStatus: "pass" | "inspect" | "revise" | "blocked";
  manualReviewRequired: boolean;
  hasReviseRisk: boolean;
  inputs: {
    videoSpec: string;
    visualDirectionSpecPresent: boolean;
    keyframeComposition: string;
    withSubtitles: boolean;
    noSubtitles: boolean;
  };
  outputs: {
    visualMetrics: string;
    contactSheet: string;
    mobileScaledContactSheet: string;
    contactSheetNoSubtitles: string;
    contactSheetWithSubtitles: string;
    mobileScaledContactSheetWithSubtitles: string;
  };
  checks: Record<string, string>;
  summary: {
    sceneCount: number;
    highRiskCount: number;
    mediumRiskCount: number;
    mobileReadabilityRisk: boolean;
    pptRisk: boolean;
    subtitleOverlapRisk: boolean;
  };
  inspectItems: string[];
  reviseItems: string[];
  risks: string[];
  subtitleOverlapRisks: string[];
  nextAction: string;
}

function runStep(name: string, cmd: string): CheckResult {
  try {
    execSync(cmd, { encoding: "utf-8", stdio: "pipe", timeout: 300000 });
    return { name, status: "pass" };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message.split("\n")[0] : String(err);
    return { name, status: "failed", message: msg };
  }
}

function copyIfExists(from: string, to: string): boolean {
  if (!fs.existsSync(from)) return false;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  return true;
}

function resetKeyframeDirs() {
  for (const dir of [NO_SUBS_DIR, WITH_SUBS_DIR]) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// 定位：审查预览模式。
// 本脚本只生成供用户批准前查看的关键帧、contact sheet、手机端预览和视觉风险报告。
// 输出进入候选审查目录，不覆盖正式生产产物。
// 如需依赖已提升的正式 videoSpec / 音频 / 字幕，改用 assertPreProductionExecutionGate。
function main() {
  assertPreProductionReviewReady();
  console.log(`\npreview:visual 审查预览门禁（review-only）`);
  console.log(`${"=".repeat(60)}`);

  resetKeyframeDirs();
  const checks: CheckResult[] = [];

  console.log("\n[1/9] validate:spec...");
  checks.push(runStep("validateSpec", "npm run validate:spec"));

  console.log("[2/9] visual:metrics...");
  checks.push(runStep("visualMetrics", "npm run visual:metrics"));

  console.log("[3/9] visual:check...");
  const checkResult = runStep("visualCheck", "npm run visual:check");
  if (checkResult.status === "failed") {
    checkResult.status = "revise";
    checkResult.message = "visual:check 报告 revise";
  }
  checks.push(checkResult);

  console.log("[4/9] capture:keyframes no-subtitles...");
  checks.push(
    runStep(
      "keyframesNoSubtitles",
      `npx tsx src/video-system/scripts/capture-keyframes.ts --composition=KnowledgeVideo --output-dir="${NO_SUBS_DIR}"`,
    ),
  );

  console.log("[5/9] capture:keyframes with-subtitles...");
  checks.push(
    runStep(
      "keyframesWithSubtitles",
      `npx tsx src/video-system/scripts/capture-keyframes.ts --composition=KnowledgeVideoWithSubtitles --output-dir="${WITH_SUBS_DIR}"`,
    ),
  );

  console.log("[6/9] capture:keyframes with-subtitles mobile...");
  checks.push(
    runStep(
      "mobileKeyframesWithSubtitles",
      `npx tsx src/video-system/scripts/capture-keyframes.ts --composition=KnowledgeVideoWithSubtitles --output-dir="${WITH_SUBS_DIR}" --mobile`,
    ),
  );

  console.log("[7/9] contact:sheet no-subtitles...");
  checks.push(
    runStep(
      "contactSheetNoSubtitles",
      `npx tsx src/video-system/scripts/generate-contact-sheet.ts --input-dir="${NO_SUBS_DIR}" --output="${path.join(
        KEYFRAME_DIR,
        "contact_sheet_no_subtitles.jpg",
      )}"`,
    ),
  );

  console.log("[8/9] contact:sheet with-subtitles...");
  checks.push(
    runStep(
      "contactSheetWithSubtitles",
      `npx tsx src/video-system/scripts/generate-contact-sheet.ts --input-dir="${WITH_SUBS_DIR}" --output="${path.join(
        KEYFRAME_DIR,
        "contact_sheet_with_subtitles.jpg",
      )}"`,
    ),
  );

  console.log("[9/9] contact:sheet with-subtitles mobile...");
  checks.push(
    runStep(
      "mobileScaledContactSheetWithSubtitles",
      `npx tsx src/video-system/scripts/generate-contact-sheet.ts --mobile --input-dir="${WITH_SUBS_MOBILE_DIR}" --output="${path.join(
        KEYFRAME_DIR,
        "mobile_scaled_contact_sheet_with_subtitles.jpg",
      )}"`,
    ),
  );

  const contactSheetWithSubtitles = path.join(
    KEYFRAME_DIR,
    "contact_sheet_with_subtitles.jpg",
  );
  const mobileSheetWithSubtitles = path.join(
    KEYFRAME_DIR,
    "mobile_scaled_contact_sheet_with_subtitles.jpg",
  );
  const defaultContactSheet = path.join(KEYFRAME_DIR, "contact_sheet.jpg");
  const defaultMobileSheet = path.join(
    KEYFRAME_DIR,
    "mobile_scaled_contact_sheet.jpg",
  );
  copyIfExists(contactSheetWithSubtitles, defaultContactSheet);
  copyIfExists(mobileSheetWithSubtitles, defaultMobileSheet);

  let metricsSummary = {
    sceneCount: 0,
    highRiskCount: 0,
    mediumRiskCount: 0,
    mobileReadabilityRisk: false,
    pptRisk: false,
  };
  let sceneRisks: SceneRisk[] = [];
  let allRisks: string[] = [];

  try {
    const metrics = JSON.parse(fs.readFileSync(METRICS_PATH, "utf-8"));
    metricsSummary = metrics.summary;
    sceneRisks = metrics.scenes ?? [];
    allRisks = sceneRisks
      .filter((s: SceneRisk) => s.risks.length > 0)
      .flatMap((s: SceneRisk) =>
        s.risks.map((r: string) => `${s.sceneId}: ${r}`),
      );
  } catch {
    // metrics 未生成时仍写出 blocked 报告。
  }

  const contactSheetExists = fs.existsSync(defaultContactSheet);
  const mobileContactSheetExists = fs.existsSync(defaultMobileSheet);
  const noSubtitleSheetExists = fs.existsSync(
    path.join(KEYFRAME_DIR, "contact_sheet_no_subtitles.jpg"),
  );
  const subtitleOverlapRisks = allRisks.filter((risk) =>
    /字幕|subtitle|遮挡|overlap/i.test(risk),
  );

  const inspectItems = sceneRisks
    .filter((s: SceneRisk) => s.recommendation === "inspect")
    .map((s: SceneRisk) => s.sceneId);
  const reviseItems = sceneRisks
    .filter((s: SceneRisk) => s.recommendation === "revise")
    .map((s: SceneRisk) => s.sceneId);

  const commandFailed = checks.some((c) => c.status === "failed");
  const commandStatus: "pass" | "failed" = commandFailed ? "failed" : "pass";
  const hasReviseRisk =
    reviseItems.length > 0 || checks.some((c) => c.status === "revise");
  const hasInspectRisk = inspectItems.length > 0;

  let visualGateStatus: PreviewVisualReport["visualGateStatus"];
  let manualReviewRequired: boolean;
  let nextAction: string;

  if (commandFailed || !contactSheetExists || !mobileContactSheetExists) {
    visualGateStatus = "blocked";
    manualReviewRequired = true;
    nextAction = "修复失败步骤或缺失产物后重新运行 preview:visual";
  } else if (hasReviseRisk) {
    visualGateStatus = "revise";
    manualReviewRequired = true;
    nextAction = "有 revise 级风险，必须先修复或交给用户决定";
  } else if (hasInspectRisk || subtitleOverlapRisks.length > 0) {
    visualGateStatus = "inspect";
    manualReviewRequired = true;
    nextAction = "有 inspect 级项目，需要人工审片确认";
  } else {
    visualGateStatus = "pass";
    manualReviewRequired = false;
    nextAction = "视觉验收通过，可进入下一阶段";
  }

  const visualDirectionSpecPath = path.join(DATA_DIR, "visualDirectionSpec.md");
  const report: PreviewVisualReport = {
    generatedAt: new Date().toISOString(),
    commandStatus,
    visualGateStatus,
    manualReviewRequired,
    hasReviseRisk,
    inputs: {
      videoSpec: VIDEO_SPEC_PATH,
      visualDirectionSpecPresent: fs.existsSync(visualDirectionSpecPath),
      keyframeComposition: "KnowledgeVideoWithSubtitles",
      withSubtitles: true,
      noSubtitles: noSubtitleSheetExists,
    },
    outputs: {
      visualMetrics: METRICS_PATH,
      contactSheet: defaultContactSheet,
      mobileScaledContactSheet: defaultMobileSheet,
      contactSheetNoSubtitles: path.join(
        KEYFRAME_DIR,
        "contact_sheet_no_subtitles.jpg",
      ),
      contactSheetWithSubtitles,
      mobileScaledContactSheetWithSubtitles: mobileSheetWithSubtitles,
    },
    checks: Object.fromEntries(checks.map((c) => [c.name, c.status])),
    summary: {
      ...metricsSummary,
      subtitleOverlapRisk: subtitleOverlapRisks.length > 0,
    },
    inspectItems,
    reviseItems,
    risks: allRisks,
    subtitleOverlapRisks,
    nextAction,
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");

  console.log(`\n${"=".repeat(60)}`);
  console.log(`COMMAND: ${commandStatus.toUpperCase()}`);
  console.log(`VISUAL GATE: ${visualGateStatus.toUpperCase()}`);
  if (manualReviewRequired) console.log("Manual review required");
  console.log(`场景数: ${metricsSummary.sceneCount}`);
  console.log(`高风险(revise): ${reviseItems.length}`);
  console.log(`中风险(inspect): ${inspectItems.length}`);
  console.log(`字幕遮挡风险: ${subtitleOverlapRisks.length}`);

  for (const c of checks) {
    const mark = c.status === "pass" ? "PASS" : c.status.toUpperCase();
    console.log(
      `  ${mark} ${c.name}: ${c.status}${c.message ? ` - ${c.message}` : ""}`,
    );
  }

  if (allRisks.length > 0) {
    console.log("\n全部风险:");
    for (const risk of allRisks) console.log(`  - ${risk}`);
  }

  console.log(`\n下一步: ${nextAction}`);
  console.log(`报告: ${REPORT_PATH}`);

  if (visualGateStatus === "blocked" || visualGateStatus === "revise") {
    process.exit(1);
  }
}

main();
