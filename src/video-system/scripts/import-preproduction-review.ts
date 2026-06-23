#!/usr/bin/env npx tsx
/**
 * Import one independent external review into preProductionReview.json.
 * It validates the exact snapshot digest and review schema, but never infers
 * consensus or user approval.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import {
  calculateReviewedInputDigest,
  readPreProductionReview,
  validateIndependentReview,
  type IndependentReview,
} from "../utils/preProductionGate";

const incomingPath = process.argv[2] ? path.resolve(process.argv[2]) : null;
const reviewPath = process.argv[3]
  ? path.resolve(process.argv[3])
  : path.resolve(__dirname, "../data/preProductionReview.json");

function main() {
  if (!incomingPath) {
    throw new Error(
      "Usage: npm run import:preproduction-review -- <review.json> [preProductionReview.json]",
    );
  }
  if (!fs.existsSync(incomingPath)) {
    throw new Error(`Incoming review not found: ${incomingPath}`);
  }

  const reviewFile = readPreProductionReview(reviewPath);
  const expectedDigest = calculateReviewedInputDigest(reviewFile.reviewedInputs);
  const incoming = JSON.parse(
    fs.readFileSync(incomingPath, "utf-8"),
  ) as IndependentReview;
  const errors = validateIndependentReview(incoming, expectedDigest);
  if (errors.length > 0) {
    throw new Error(`REVIEW IMPORT BLOCKED\n- ${errors.join("\n- ")}`);
  }
  if (reviewFile.reviews.some((item) => item.reviewerId === incoming.reviewerId)) {
    throw new Error(`Duplicate reviewerId: ${incoming.reviewerId}`);
  }
  if (reviewFile.reviews.some((item) => item.role === incoming.role)) {
    throw new Error(
      `Role ${incoming.role} already has a review; use a distinct required role or explicitly remove the old review first`,
    );
  }

  reviewFile.reviews.push(incoming);
  reviewFile.consensus.passed = false;
  reviewFile.consensus.blockingReasons = [
    "Review imported; run npm run refresh:preproduction-consensus",
  ];
  fs.writeFileSync(reviewPath, `${JSON.stringify(reviewFile, null, 2)}\n`);
  console.log(`Imported reviewer ${incoming.reviewerId} (${incoming.role})`);
  console.log("Consensus and user approval were not inferred.");
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
