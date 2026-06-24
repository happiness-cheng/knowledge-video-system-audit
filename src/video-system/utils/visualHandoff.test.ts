import test from "node:test";
import assert from "node:assert/strict";
import {
  validateAlignmentId,
  validateSemanticVoiceoverVisualAlignment,
  validateTimedVisualAlignment,
  validateCapabilityPreflightItem,
  validateShotSceneCompileEntry,
  validateVisualSnapshotId,
} from "./visualHandoff";

test("visualHandoff: validateAlignmentId accepts A01", () => {
  assert.equal(validateAlignmentId("A01"), true);
});

test("visualHandoff: validateAlignmentId rejects 01A", () => {
  assert.equal(validateAlignmentId("01A"), false);
});

test("visualHandoff: validateVisualSnapshotId accepts VS-YYYYMMDD-xxxx", () => {
  assert.equal(validateVisualSnapshotId("VS-20260624-ab12"), true);
});

test("visualHandoff: validateVisualSnapshotId rejects bad prefix", () => {
  assert.equal(validateVisualSnapshotId("XX-20260624-ab12"), false);
});

const validSemantic = {
  alignmentId: "A01",
  contentSnapshotId: "CS-20260624-ab12",
  beatId: "B01",
  shotId: "B01-S01",
  spokenClause: "这个工具的核心是...",
  visualMeaning: "工具卡片从左侧滑入",
  evidenceAnchor: null,
};

test("visualHandoff: semanticAlignment passes for valid", () => {
  assert.deepEqual(validateSemanticVoiceoverVisualAlignment(validSemantic), []);
});

test("visualHandoff: semanticAlignment rejects invalid alignmentId", () => {
  const errors = validateSemanticVoiceoverVisualAlignment({
    ...validSemantic,
    alignmentId: "bad",
  });
  assert.ok(errors.some((e) => e.includes("A01")));
});

test("visualHandoff: semanticAlignment rejects mismatched contentSnapshotId", () => {
  const errors = validateSemanticVoiceoverVisualAlignment(validSemantic, {
    contentSnapshotId: "CS-different",
  });
  assert.ok(errors.some((e) => e.includes("contentSnapshotId")));
});

const validTimed = {
  alignmentId: "A01",
  shotId: "B01-S01",
  audioSegmentId: "AUD-001",
  startMs: 0,
  endMs: 4300,
  startFrame: 0,
  endFrame: 129,
  sceneId: "S01",
};

test("visualHandoff: timedAlignment passes for valid", () => {
  assert.deepEqual(validateTimedVisualAlignment(validTimed), []);
});

test("visualHandoff: timedAlignment rejects endMs <= startMs", () => {
  const errors = validateTimedVisualAlignment({ ...validTimed, endMs: 0 });
  assert.ok(errors.some((e) => e.includes("endMs")));
});

test("visualHandoff: timedAlignment rejects negative startFrame", () => {
  const errors = validateTimedVisualAlignment({
    ...validTimed,
    startFrame: -1,
  });
  assert.ok(errors.some((e) => e.includes("startFrame")));
});

const validPreflight = {
  shotId: "B01-S01",
  capabilityStatus: "supported" as const,
  recommendedHost: "comparison",
  requiredCapabilities: ["comparison"],
  missingCapabilities: [],
  implementationPlan: "Use existing comparison component",
};

test("visualHandoff: capabilityPreflight passes for supported", () => {
  assert.deepEqual(validateCapabilityPreflightItem(validPreflight), []);
});

test("visualHandoff: capabilityPreflight blocks fallback-unacceptable", () => {
  const errors = validateCapabilityPreflightItem({
    ...validPreflight,
    capabilityStatus: "fallback-unacceptable",
  });
  assert.ok(errors.some((e) => e.includes("blocks production")));
});

test("visualHandoff: capabilityPreflight requires missingCapabilities for new-component-gap", () => {
  const errors = validateCapabilityPreflightItem({
    ...validPreflight,
    capabilityStatus: "new-component-gap",
    missingCapabilities: [],
  });
  assert.ok(errors.some((e) => e.includes("missingCapabilities")));
});

const validCompile = {
  sceneId: "S01",
  sourceShotIds: ["B01-S01"],
  alignmentIds: ["A01"],
};

test("visualHandoff: shotSceneCompile passes for valid", () => {
  assert.deepEqual(validateShotSceneCompileEntry(validCompile), []);
});

test("visualHandoff: shotSceneCompile rejects empty sourceShotIds", () => {
  const errors = validateShotSceneCompileEntry({
    ...validCompile,
    sourceShotIds: [],
  });
  assert.ok(errors.some((e) => e.includes("sourceShotIds")));
});

test("visualHandoff: shotSceneCompile rejects empty alignmentIds", () => {
  const errors = validateShotSceneCompileEntry({
    ...validCompile,
    alignmentIds: [],
  });
  assert.ok(errors.some((e) => e.includes("alignmentIds")));
});
