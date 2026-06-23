#!/usr/bin/env npx tsx
import { validateSystemRegistry } from "../utils/systemRegistry";

const result = validateSystemRegistry();
console.log(`System registry: ${result.passed ? "PASS" : "BLOCKED"}`);
console.log(`sceneTypes=${result.summary.sceneTypeCount}`);
console.log(`rendererCases=${result.summary.rendererCaseCount}`);
console.log(`themes=${result.summary.themeCount}`);
console.log(`semanticPatterns=${result.summary.semanticPatternCount}`);
if (!result.passed) {
  for (const error of result.errors) console.error(`- ${error}`);
  process.exitCode = 1;
}
