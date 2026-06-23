#!/usr/bin/env npx tsx
import * as fs from "node:fs";
import * as path from "node:path";
import {
  assertPreProductionGate,
  calculateReviewedInputDigest,
  readPreProductionReview,
} from "../utils/preProductionGate";
import { validateQualityScoreV2 } from "../utils/qualityScoreGate";

const args = process.argv.slice(2);
const draftMode = args.includes("--draft");
const fileArg = args.find((arg) => arg !== "--draft");
const filePath = fileArg
  ? path.resolve(fileArg)
  : path.resolve(__dirname, "../data/qualityScore.json");

try {
  const reviewPath = path.resolve(__dirname, "../data/preProductionReview.json");
  const gate = assertPreProductionGate(reviewPath);
  const review = readPreProductionReview(reviewPath);
  const digest = calculateReviewedInputDigest(review.reviewedInputs);
  if (gate.calculated.reviewedInputDigest !== digest) {
    throw new Error("Current pre-production digest is inconsistent");
  }
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const errors = validateQualityScoreV2(data, {
    requirePublish: !draftMode,
    expectedPreProductionDigest: digest,
  });
  console.log(`Quality score gate: ${errors.length === 0 ? "PASS" : "BLOCKED"}`);
  if (errors.length > 0) {
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
