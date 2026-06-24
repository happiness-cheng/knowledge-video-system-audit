#!/usr/bin/env npx tsx
/**
 * Promote reviewed candidate files to formal execution paths.
 * Requires both review-ready AND user approval (execution gate).
 */
import * as fs from "node:fs";
import * as path from "node:path";
import {
  assertPreProductionExecutionGate,
  readPreProductionReview,
  sha256File,
} from "../utils/preProductionGate";

const args = process.argv.slice(2);
const reviewPath = args[0]
  ? path.resolve(args[0])
  : path.resolve(__dirname, "../data/preProductionReview.json");
const approvalPath = args[1]
  ? path.resolve(args[1])
  : path.resolve(__dirname, "../data/userApproval.json");
const root = path.resolve(__dirname, "../../..");

function main() {
  assertPreProductionExecutionGate(reviewPath, approvalPath);
  const review = readPreProductionReview(reviewPath);
  const promoted: string[] = [];

  for (const input of review.reviewedInputs) {
    if (!input.executionPath || input.executionPath === input.path) continue;
    const source = path.resolve(root, input.path);
    const target = path.resolve(root, input.executionPath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);

    // Verify copied file matches reviewed snapshot
    const targetHash = sha256File(target);
    if (targetHash !== input.sha256.toLowerCase()) {
      throw new Error(
        `Promoted file ${input.executionPath} hash ${targetHash} does not match reviewed snapshot ${input.sha256}`,
      );
    }
    promoted.push(`${input.path} -> ${input.executionPath}`);
  }

  // Re-verify execution gate after promotion
  assertPreProductionExecutionGate(reviewPath, approvalPath);
  console.log("Pre-production candidates promoted successfully.");
  if (promoted.length === 0)
    console.log("No separate candidate paths required promotion.");
  for (const item of promoted) console.log(`- ${item}`);
}

main();
