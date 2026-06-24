#!/usr/bin/env npx tsx
import * as path from "node:path";
import {
  assertPreProductionReviewReady,
  assertPreProductionExecutionGate,
  evaluatePreProductionReviewReady,
  evaluatePreProductionExecutionGate,
  readPreProductionReview,
  readUserApproval,
} from "../utils/preProductionGate";

const args = process.argv.slice(2);
const reviewOnly = args.includes("--review-only");
const positional = args.find((item) => !item.startsWith("--"));
const filePath = positional
  ? path.resolve(positional)
  : path.resolve(__dirname, "../data/preProductionReview.json");
const approvalPath = path.resolve(__dirname, "../data/userApproval.json");

try {
  if (reviewOnly) {
    const file = readPreProductionReview(filePath);
    const evaluation = evaluatePreProductionReviewReady(file, {
      verifyInputFiles: true,
    });
    console.log(
      `\nPre-production review-ready gate: ${evaluation.passed ? "PASS" : "BLOCKED"}`,
    );
    console.log(`snapshot=${evaluation.calculated.reviewedInputDigest}`);
    console.log(`mean=${evaluation.calculated.meanScore}`);
    console.log(`median=${evaluation.calculated.medianScore}`);
    console.log(`minimum=${evaluation.calculated.minReviewerScore}`);
    console.log(`spread=${evaluation.calculated.scoreSpread}`);
    for (const [id, score] of Object.entries(
      evaluation.calculated.dimensionMeans,
    )) {
      console.log(`${id}=${score}`);
    }
    if (!evaluation.passed) {
      console.error("\nBlocking reasons:");
      for (const reason of evaluation.blockingReasons)
        console.error(`- ${reason}`);
      process.exitCode = 1;
    } else {
      assertPreProductionReviewReady(filePath);
    }
  } else {
    const review = readPreProductionReview(filePath);
    const approval = readUserApproval(approvalPath);
    const evaluation = evaluatePreProductionExecutionGate(review, approval, {
      verifyInputFiles: true,
      requireExecutionInputs: true,
    });
    console.log(
      `\nPre-production execution gate: ${evaluation.passed ? "PASS" : "BLOCKED"}`,
    );
    console.log(`snapshot=${evaluation.calculated.reviewedInputDigest}`);
    console.log(`mean=${evaluation.calculated.meanScore}`);
    console.log(`median=${evaluation.calculated.medianScore}`);
    console.log(`minimum=${evaluation.calculated.minReviewerScore}`);
    console.log(`spread=${evaluation.calculated.scoreSpread}`);
    for (const [id, score] of Object.entries(
      evaluation.calculated.dimensionMeans,
    )) {
      console.log(`${id}=${score}`);
    }
    if (!evaluation.passed) {
      console.error("\nBlocking reasons:");
      for (const reason of evaluation.blockingReasons)
        console.error(`- ${reason}`);
      process.exitCode = 1;
    } else {
      assertPreProductionExecutionGate(filePath, approvalPath);
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
