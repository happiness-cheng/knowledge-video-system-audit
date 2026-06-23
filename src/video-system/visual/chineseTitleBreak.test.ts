import test from "node:test";
import assert from "node:assert/strict";
import { chineseTitleBreakRisk } from "./chineseTitleBreak";

test("chineseTitleBreakRisk treats explicit semantic two-line titles as safe", () => {
  const risk = chineseTitleBreakRisk("不是 AI 没懂你\n是你没给判断材料");

  assert.equal(risk.estimatedLines, 2);
  assert.equal(risk.hasSingleCharLineRisk, false);
  assert.equal(risk.hasBadTailRisk, false);
  assert.equal(risk.hasPunctuationLineRisk, false);
  assert.equal(risk.riskLevel, "low");
});
