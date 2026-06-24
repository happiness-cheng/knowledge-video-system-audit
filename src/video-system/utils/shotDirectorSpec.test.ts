import test from "node:test";
import assert from "node:assert/strict";
import {
  validateShotDirectorSpecId,
  validateShotDirectorSpec,
  validateHoldMotion,
} from "./shotDirectorSpec";
import type { ShotDirectorSpec } from "./shotDirectorSpec";

test("shotDirectorSpec: accepts B01-S01 format", () => {
  assert.equal(validateShotDirectorSpecId("B01-S01"), true);
});

test("shotDirectorSpec: accepts multi-digit B02-S10", () => {
  assert.equal(validateShotDirectorSpecId("B02-S10"), true);
});

test("shotDirectorSpec: rejects S01 without beat prefix", () => {
  assert.equal(validateShotDirectorSpecId("S01"), false);
});

test("shotDirectorSpec: holdMotion no error for duration <= 1.2s", () => {
  const base = {
    shotId: "B01-S01",
    holdMotion: { type: "drift", purpose: "life" },
  } as unknown as ShotDirectorSpec;
  assert.deepEqual(validateHoldMotion(base, 1.0), []);
});

test("shotDirectorSpec: holdMotion errors when >1.2s and missing", () => {
  const spec = {
    shotId: "B01-S01",
    holdMotion: undefined,
  } as unknown as ShotDirectorSpec;
  const errors = validateHoldMotion(spec, 2.0);
  assert.ok(errors.some((e) => e.includes("holdMotion")));
});

test("shotDirectorSpec: holdMotion errors when >1.2s, type=none, no noneReason", () => {
  const spec = {
    shotId: "B01-S01",
    holdMotion: { type: "none", purpose: "" },
  } as unknown as ShotDirectorSpec;
  const errors = validateHoldMotion(spec, 2.0);
  assert.ok(errors.some((e) => e.includes("noneReason")));
});

test("shotDirectorSpec: holdMotion passes when >1.2s, type=none, has noneReason", () => {
  const spec = {
    shotId: "B01-S01",
    holdMotion: {
      type: "none",
      purpose: "",
      noneReason: "evidence needs reading",
    },
  } as unknown as ShotDirectorSpec;
  assert.deepEqual(validateHoldMotion(spec, 2.0), []);
});

const validSpec: ShotDirectorSpec = {
  contractVersion: "3.1",
  contentSnapshotId: "CS-20260624-ab12",
  beatId: "B01",
  shotId: "B01-S01",
  contentSourceRef: "draftBody paragraph 3",
  spokenClause: "这个工具的核心是...",
  explanationGoal: "观众理解工具的核心机制",
  informationDelta: "新增工具的存在和作用",
  primaryAttentionTarget: "工具卡片",
  objects: ["tool-card"],
  initialState: "卡片未出现",
  semanticAction: "卡片从左侧滑入",
  finalState: "卡片居中显示",
  enterMotion: { type: "slide-in-left", purpose: "引导注意力" },
  holdMotion: { type: "drift", purpose: "保持生命感" },
  exitOrCarryMotion: { type: "fade-out", carryObject: null },
  continuityAnchor: "tool-card",
  ambientMotion: { type: "none", purpose: "不干扰主讲解" },
  assetStrategy: "component-only",
  evidenceAnchor: null,
  implementationLock: "preferred",
  capabilityStatus: "supported",
  fallbackPolicy: "return-gap",
  acceptanceCriteria: ["卡片清晰可读"],
};

test("shotDirectorSpec: passes for valid spec", () => {
  assert.deepEqual(validateShotDirectorSpec(validSpec), []);
});

test("shotDirectorSpec: rejects wrong contractVersion", () => {
  const errors = validateShotDirectorSpec({
    ...validSpec,
    contractVersion: "3.0",
  });
  assert.ok(errors.some((e) => e.includes("contractVersion")));
});

test("shotDirectorSpec: rejects mismatched contentSnapshotId", () => {
  const errors = validateShotDirectorSpec(validSpec, {
    contentSnapshotId: "CS-different-id",
  });
  assert.ok(errors.some((e) => e.includes("contentSnapshotId")));
});

test("shotDirectorSpec: rejects invalid shotId format", () => {
  const errors = validateShotDirectorSpec({ ...validSpec, shotId: "S01" });
  assert.ok(errors.some((e) => e.includes("B01-S01")));
});

test("shotDirectorSpec: rejects empty objects", () => {
  const errors = validateShotDirectorSpec({ ...validSpec, objects: [] });
  assert.ok(errors.some((e) => e.includes("objects")));
});

test("shotDirectorSpec: rejects invalid ambientMotion type", () => {
  const errors = validateShotDirectorSpec({
    ...validSpec,
    ambientMotion: { type: "spin", purpose: "test" },
  });
  assert.ok(errors.some((e) => e.includes("ambientMotion.type")));
});

test("shotDirectorSpec: rejects empty acceptanceCriteria", () => {
  const errors = validateShotDirectorSpec({
    ...validSpec,
    acceptanceCriteria: [],
  });
  assert.ok(errors.some((e) => e.includes("acceptanceCriteria")));
});
