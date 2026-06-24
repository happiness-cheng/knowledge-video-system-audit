#!/usr/bin/env npx tsx
/**
 * Recalculate consensus from completed independent reviews.
 * User approval is deliberately preserved and never inferred.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import {
  evaluatePreProductionReviewReady,
  readPreProductionReview,
} from "../utils/preProductionGate";

const reviewPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, "../data/preProductionReview.json");
const root = path.resolve(__dirname, "../../..");

function main() {
  const review = readPreProductionReview(reviewPath);
  const result = evaluatePreProductionReviewReady(review, {
    verifyInputFiles: true,
    projectRoot: root,
  });

  review.consensus.reviewedInputDigest = result.calculated.reviewedInputDigest;
  review.consensus.meanScore = result.calculated.meanScore;
  review.consensus.medianScore = result.calculated.medianScore;
  review.consensus.minReviewerScore = result.calculated.minReviewerScore;
  review.consensus.scoreSpread = result.calculated.scoreSpread;
  review.consensus.dimensionMeans = result.calculated.dimensionMeans;
  review.consensus.passed = result.passed;
  review.consensus.blockingReasons = result.blockingReasons;

  fs.writeFileSync(reviewPath, `${JSON.stringify(review, null, 2)}\n`);

  console.log(`Consensus refreshed: ${reviewPath}`);
  console.log(`passed=${review.consensus.passed}`);
  console.log(`mean=${review.consensus.meanScore}`);
  console.log(`median=${review.consensus.medianScore}`);
  console.log(`minimum=${review.consensus.minReviewerScore}`);
  console.log(`spread=${review.consensus.scoreSpread}`);
  if (result.blockingReasons.length > 0) {
    console.log("Blocking reasons:");
    for (const reason of result.blockingReasons) console.log(`- ${reason}`);
  }
}

main();
