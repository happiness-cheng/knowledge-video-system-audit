#!/usr/bin/env npx tsx
/**
 * Promote reviewed candidate files to formal execution paths.
 * The review snapshot must already pass scores, evidence, file hashes and user approval.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import {
  assertPreProductionReviewReady,
  assertPreProductionReviewReady,
  readPreProductionReview,
} from "../utils/preProductionGate";

const reviewPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, "../data/preProductionReview.json");
const root = path.resolve(__dirname, "../../..");

function main() {
  assertPreProductionReviewReady(reviewPath);
  const review = readPreProductionReview(reviewPath);
  const promoted: string[] = [];

  for (const input of review.reviewedInputs) {
    if (!input.executionPath || input.executionPath === input.path) continue;
    const source = path.resolve(root, input.path);
    const target = path.resolve(root, input.executionPath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
    promoted.push(`${input.path} -> ${input.executionPath}`);
  }

  assertPreProductionReviewReady(reviewPath);
  console.log("Pre-production candidates promoted successfully.");
  if (promoted.length === 0)
    console.log("No separate candidate paths required promotion.");
  for (const item of promoted) console.log(`- ${item}`);
}

main();
