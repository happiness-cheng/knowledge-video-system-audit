import test from "node:test";
import assert from "node:assert/strict";
import { validateSystemRegistry } from "./systemRegistry";

test("capability registry matches the real renderer and theme registry", () => {
  const result = validateSystemRegistry();
  assert.equal(result.passed, true, result.errors.join("\n"));
  assert.equal(result.summary.sceneTypeCount, 22);
  assert.equal(result.summary.themeCount, 8);
});
