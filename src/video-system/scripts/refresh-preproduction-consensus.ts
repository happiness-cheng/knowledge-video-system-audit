#!/usr/bin/env npx tsx
/**
 * Recalculate consensus from completed independent reviews.
 * User approval is deliberately preserved and never inferred.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import {
  evaluatePreProductionGate,
  readPreProductionReview,
  type PreProductionReview,
} from "../utils/preProductionGate";

const reviewPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, "../data/preProductionReview.json");
const root = path.resolve(__dirname, "../../..");

function main() {
  const review = readPreProductionReview(reviewPath);
  const first = evaluatePreProductionGate(review);
  review.consensus.reviewedInputDigest = first.calculated.reviewedInputDigest;
  review.consensus.meanScore = first.calculated.meanScore;
  review.consensus.medianScore = first.calculated.medianScore;
  review.consensus.minReviewerScore = first.calculated.minReviewerScore;
  review.consensus.scoreSpread = first.calculated.scoreSpread;
  review.consensus.dimensionMeans = first.calculated.dimensionMeans;

  const simulated: PreProductionReview = JSON.parse(JSON.stringify(review));
  simulated.consensus.passed = true;
  simulated.consensus.blockingReasons = [];
  simulated.approval = {
    userDecision: "continue",
    approvedByUser: true,
    decisionNote: "simulation for consensus calculation only",
    decidedAt: new Date().toISOString(),
  };
  const reviewOnly = evaluatePreProductionGate(simulated, {
    verifyInputFiles: true,
    requireExecutionInputs: false,
    projectRoot: root,
  });

  review.consensus.passed = reviewOnly.passed;
  review.consensus.blockingReasons = reviewOnly.blockingReasons;
  fs.writeFileSync(reviewPath, `${JSON.stringify(review, null, 2)}\n`);

  console.log(`Consensus refreshed: ${reviewPath}`);
  console.log(`passed=${review.consensus.passed}`);
  console.log(`mean=${review.consensus.meanScore}`);
  console.log(`median=${review.consensus.medianScore}`);
  console.log(`minimum=${review.consensus.minReviewerScore}`);
  console.log(`spread=${review.consensus.scoreSpread}`);
  if (!review.consensus.passed) {
    for (const reason of review.consensus.blockingReasons) {
      console.error(`- ${reason}`);
    }
    process.exitCode = 1;
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
