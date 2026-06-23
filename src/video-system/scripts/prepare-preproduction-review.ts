#!/usr/bin/env npx tsx
/**
 * Build a fresh preProductionReview.json from the current review candidates.
 * This script never creates scores or user approval.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import {
  calculateReviewedInputDigest,
  sha256File,
  type PreProductionReview,
  type ReviewedInput,
} from "../utils/preProductionGate";
import {
  validateContentBriefV2,
  type ContentBriefV2,
} from "../utils/contentBriefV2";

const root = path.resolve(__dirname, "../../..");
const dataDir = path.join(root, "src/video-system/data");
const outputPath = path.join(dataDir, "preProductionReview.json");

const candidates: Array<{
  id: ReviewedInput["id"];
  path: string;
  executionPath?: string;
  optional?: boolean;
}> = [
  {
    id: "contentBrief",
    path: "src/video-system/data/contentBrief.json",
  },
  {
    id: "videoSpec",
    path: "src/video-system/data/videoSpec.review-candidate.json",
    executionPath: "src/video-system/data/videoSpec.json",
  },
  {
    id: "coverBrief",
    path: "src/video-system/data/coverBrief.review-candidate.json",
    executionPath: "src/video-system/data/coverBrief.json",
  },
  {
    id: "visualDirection",
    path: "src/video-system/data/visualDirection.review-candidate.md",
    executionPath: "src/video-system/data/visualDirectionSpec.md",
    optional: true,
  },
];

function main() {
  const contentPath = path.resolve(root, candidates[0].path);
  if (!fs.existsSync(contentPath)) {
    throw new Error(`Missing content brief: ${candidates[0].path}`);
  }
  const content = JSON.parse(
    fs.readFileSync(contentPath, "utf-8"),
  ) as ContentBriefV2;
  const contentErrors = validateContentBriefV2(content);
  if (contentErrors.length > 0) {
    throw new Error(
      `CONTENT BRIEF V2 BLOCKED\n- ${contentErrors.join("\n- ")}`,
    );
  }

  const reviewedInputs: ReviewedInput[] = [];
  for (const candidate of candidates) {
    const absolute = path.resolve(root, candidate.path);
    if (!fs.existsSync(absolute)) {
      if (candidate.optional) continue;
      throw new Error(`Missing review candidate: ${candidate.path}`);
    }
    reviewedInputs.push({
      id: candidate.id,
      path: candidate.path,
      ...(candidate.executionPath
        ? { executionPath: candidate.executionPath }
        : {}),
      sha256: sha256File(absolute),
    });
  }

  const digest = calculateReviewedInputDigest(reviewedInputs);
  const review: PreProductionReview = {
    schemaVersion: "2.0",
    projectId:
      (typeof content.projectId === "string" && content.projectId) ||
      (typeof content.title === "string" && content.title) ||
      "untitled-topic",
    mode: content.workflowMode,
    contentBriefPath: candidates[0].path,
    reviewedInputs,
    scopeContract: content.scopeContract,
    reviews: [],
    consensus: {
      reviewedInputDigest: digest,
      meanScore: 0,
      medianScore: 0,
      minReviewerScore: 0,
      scoreSpread: 0,
      dimensionMeans: {},
      passed: false,
      blockingReasons: [
        "Awaiting independent reviews and explicit user approval",
      ],
    },
    approval: {
      userDecision: "pending",
      approvedByUser: false,
      decisionNote: "",
      decidedAt: null,
    },
  };

  fs.writeFileSync(outputPath, `${JSON.stringify(review, null, 2)}\n`);
  console.log(`Prepared: ${outputPath}`);
  console.log(`reviewedInputDigest: ${digest}`);
  for (const input of reviewedInputs) {
    console.log(`- ${input.id}: ${input.path}`);
  }
  console.log("No scores or approval were generated.");
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
