import test from "node:test";
import assert from "node:assert/strict";
import {
  generateContentSnapshotId,
  validateContentSnapshotId,
  validateApprovedContentSnapshot,
} from "./contentSnapshot";

test("contentSnapshot: validateContentSnapshotId accepts valid CS-YYYYMMDD-xxxx", () => {
  assert.equal(validateContentSnapshotId("CS-20260624-ab12"), true);
});

test("contentSnapshot: validateContentSnapshotId rejects missing prefix", () => {
  assert.equal(validateContentSnapshotId("XX-20260624-ab12"), false);
});

test("contentSnapshot: validateContentSnapshotId rejects short hex", () => {
  assert.equal(validateContentSnapshotId("CS-20260624-a"), false);
});

test("contentSnapshot: generateContentSnapshotId produces valid format", () => {
  const id = generateContentSnapshotId();
  assert.equal(validateContentSnapshotId(id), true);
});

test("contentSnapshot: validateApprovedContentSnapshot passes for valid pending", () => {
  const valid = {
    contractVersion: "3.1",
    contentSnapshotId: "CS-20260624-ab12",
    sourceDigest: "a".repeat(64),
    approvedAt: null,
    userDecision: "pending",
    sources: {
      contentMasterDraft: "path/draft.md",
      beatSheet: "path/beat.json",
      shotPlan: "path/shot.json",
      coverBrief: "path/cover.json",
    },
  };
  assert.deepEqual(validateApprovedContentSnapshot(valid), []);
});

test("contentSnapshot: rejects wrong contractVersion", () => {
  const errors = validateApprovedContentSnapshot({
    contractVersion: "3.0",
    contentSnapshotId: "CS-20260624-ab12",
    sourceDigest: "a".repeat(64),
    approvedAt: null,
    userDecision: "pending",
    sources: {
      contentMasterDraft: "x",
      beatSheet: "x",
      shotPlan: "x",
      coverBrief: "x",
    },
  });
  assert.ok(errors.some((e) => e.includes("contractVersion")));
});

test("contentSnapshot: rejects approved with null approvedAt", () => {
  const errors = validateApprovedContentSnapshot({
    contractVersion: "3.1",
    contentSnapshotId: "CS-20260624-ab12",
    sourceDigest: "a".repeat(64),
    approvedAt: null,
    userDecision: "approved",
    sources: {
      contentMasterDraft: "x",
      beatSheet: "x",
      shotPlan: "x",
      coverBrief: "x",
    },
  });
  assert.ok(errors.some((e) => e.includes("approvedAt")));
});

test("contentSnapshot: rejects pending with non-null approvedAt", () => {
  const errors = validateApprovedContentSnapshot({
    contractVersion: "3.1",
    contentSnapshotId: "CS-20260624-ab12",
    sourceDigest: "a".repeat(64),
    approvedAt: "2026-06-24T00:00:00Z",
    userDecision: "pending",
    sources: {
      contentMasterDraft: "x",
      beatSheet: "x",
      shotPlan: "x",
      coverBrief: "x",
    },
  });
  assert.ok(errors.some((e) => e.includes("approvedAt")));
});
