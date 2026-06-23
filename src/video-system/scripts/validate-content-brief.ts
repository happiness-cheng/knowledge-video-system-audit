#!/usr/bin/env npx tsx
import * as fs from "node:fs";
import * as path from "node:path";
import { validateContentBriefV2 } from "../utils/contentBriefV2";

const filePath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, "../data/contentBrief.json");

try {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const errors = validateContentBriefV2(data, {
    projectRoot: path.resolve(__dirname, "../../.."),
    verifySources: true,
  });
  console.log(`Content brief V2: ${errors.length === 0 ? "PASS" : "BLOCKED"}`);
  if (errors.length > 0) {
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
