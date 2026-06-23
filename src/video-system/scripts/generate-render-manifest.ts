#!/usr/bin/env npx tsx
/**
 * 生成本次渲染运行清单。
 *
 * 用法：
 *   npx tsx src/video-system/scripts/generate-render-manifest.ts --run-id=xxx --agent-id=agent-a
 */

import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import { assertRenderManifestShape } from "../utils/renderManifestSchema";

const args = process.argv.slice(2);
const runId =
  args.find((arg) => arg.startsWith("--run-id="))?.split("=")[1] ??
  new Date().toISOString().replace(/[:.]/g, "-");
const agentId =
  args.find((arg) => arg.startsWith("--agent-id="))?.split("=")[1] ??
  "agent-a";

const ROOT = path.resolve(__dirname, "../../..");
const DATA_DIR = path.join(ROOT, "src/video-system/data");
const OUT_DIR = path.join(ROOT, "out");
const RUN_DIR = path.join(OUT_DIR, "runs", runId);
const MANIFEST_PATH = path.join(RUN_DIR, "renderManifest.json");

const inputFiles = [
  "contentBrief.json",
  "videoSpec.json",
  "coverBrief.json",
  "coverSpec.json",
  "assetManifest.json",
  "audioTiming.json",
  "subtitles.json",
  "previewVisualReport.json",
  "visualMetrics.json",
];

function sha256(filePath: string): string | null {
  if (!fs.existsSync(filePath)) return null;
  const hash = crypto.createHash("sha256");
  hash.update(fs.readFileSync(filePath));
  return hash.digest("hex");
}

function relative(filePath: string): string {
  return path.relative(ROOT, filePath).replace(/\\/g, "/");
}

function copyOutput(filePath: string) {
  if (!fs.existsSync(filePath)) return null;
  const target = path.join(RUN_DIR, path.basename(filePath));
  fs.copyFileSync(filePath, target);
  return relative(target);
}

function readPreviewReport() {
  const reportPath = path.join(DATA_DIR, "previewVisualReport.json");
  if (!fs.existsSync(reportPath)) return null;
  return JSON.parse(fs.readFileSync(reportPath, "utf-8"));
}

function main() {
  fs.mkdirSync(RUN_DIR, { recursive: true });

  const previewReport = readPreviewReport();
  const outputPaths = {
    videoPreview: path.join(OUT_DIR, "video-preview.mp4"),
    cover3x4: path.join(OUT_DIR, "cover-3x4.png"),
    cover4x3: path.join(OUT_DIR, "cover-4x3.png"),
    frame4s: path.join(OUT_DIR, "frame_4s.png"),
    contactSheet: path.join(OUT_DIR, "keyframes/contact_sheet.jpg"),
    contactSheetNoSubtitles: path.join(
      OUT_DIR,
      "keyframes/contact_sheet_no_subtitles.jpg",
    ),
    contactSheetWithSubtitles: path.join(
      OUT_DIR,
      "keyframes/contact_sheet_with_subtitles.jpg",
    ),
    mobileScaledContactSheet: path.join(
      OUT_DIR,
      "keyframes/mobile_scaled_contact_sheet.jpg",
    ),
    mobileScaledContactSheetWithSubtitles: path.join(
      OUT_DIR,
      "keyframes/mobile_scaled_contact_sheet_with_subtitles.jpg",
    ),
  };

  const manifest = {
    runId,
    agentId,
    createdAt: new Date().toISOString(),
    remotion: {
      entryPoint: "src/index.ts",
      compositions: {
        preview: "KnowledgeVideoWithSubtitles",
        videoNoSubtitles: "KnowledgeVideo",
        covers: ["CoverImage3x4", "CoverImage4x3"],
      },
      fps: 30,
    },
    inputs: Object.fromEntries(
      inputFiles.map((file) => {
        const fullPath = path.join(DATA_DIR, file);
        return [
          file,
          {
            path: relative(fullPath),
            sha256: sha256(fullPath),
            exists: fs.existsSync(fullPath),
          },
        ];
      }),
    ),
    commands: [
      "npm run generate-audio",
      "npm run generate-subtitles",
      "npm run typecheck",
      "npm run validate:all",
      "npx tsx --test \"src/**/*.test.ts\"",
      "npx remotion render src/index.ts KnowledgeVideoWithSubtitles --output=out/video-preview.mp4 --codec=h264",
      "npx remotion still src/index.ts KnowledgeVideoWithSubtitles --frame=120 --output=out/frame_4s.png",
      "npm run cover:3x4",
      "npm run cover:4x3",
      "npm run preview:visual",
      `npx tsx src/video-system/scripts/generate-render-manifest.ts --run-id=${runId} --agent-id=${agentId}`,
    ],
    outputs: Object.fromEntries(
      Object.entries(outputPaths).map(([key, fullPath]) => [
        key,
        {
          path: relative(fullPath),
          sha256: sha256(fullPath),
          exists: fs.existsSync(fullPath),
          archivedPath: copyOutput(fullPath),
        },
      ]),
    ),
    preview: {
      withSubtitles: true,
      noSubtitles: Boolean(previewReport?.inputs?.noSubtitles),
      keyframeComposition:
        previewReport?.inputs?.keyframeComposition ??
        "KnowledgeVideoWithSubtitles",
      visualGateStatus: previewReport?.visualGateStatus ?? "unknown",
      manualReviewRequired: previewReport?.manualReviewRequired ?? true,
      subtitleOverlapRisk:
        previewReport?.summary?.subtitleOverlapRisk ?? "unknown",
    },
  };

  assertRenderManifestShape(manifest);
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`renderManifest: ${MANIFEST_PATH}`);
}

main();
