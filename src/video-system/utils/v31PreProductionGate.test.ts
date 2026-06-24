import test from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import {
  validateV31IndependentReview,
  validateV31ReviewScores,
  evaluateV31ReviewReady,
  evaluateV31ExecutionGate,
  validateUserApproval,
  type V31StandardPreProductionReview,
  type V31IndependentReview,
  type V31ReviewScores,
  type UserApproval,
} from "./v31PreProductionGate";

function makeScores(overrides?: Partial<V31ReviewScores>) {
  return {
    topicPromise: 18,
    researchAndTruth: 14,
    contentMasterDraft: 23,
    hookStructure: 14,
    cover: 9,
    voiceoverVisualSync: 9,
    consistency: 4,
    ...overrides,
  };
}

function makeReview(
  overrides?: Partial<V31IndependentReview>,
): V31IndependentReview {
  const scores = makeScores(overrides?.scores);
  const totalScore = (Object.values(scores) as number[]).reduce(
    (s: number, v: number) => s + v,
    0,
  );
  return {
    reviewId: "R01",
    reviewerKind: "gpt-self",
    reviewerSystem: "OpenAI GPT-5.5",
    independent: true,
    contentSnapshotId: "CS-20260624-ab12",
    visualSnapshotId: "VS-20260624-ab12",
    candidateDigest: "a".repeat(64),
    scores,
    totalScore,
    issues: [],
    vetoes: [],
    recommendation: "pass",
    reviewedAt: "2026-06-24T12:00:00+08:00",
    ...overrides,
  };
}

function makeReviewFixture(): V31StandardPreProductionReview {
  const r1 = makeReview({
    reviewId: "R01",
    reviewerKind: "gpt-self",
    reviewerSystem: "OpenAI GPT-5.5",
  });
  const r2 = makeReview({
    reviewId: "R02",
    reviewerKind: "external-ai",
    reviewerSystem: "Anthropic Claude",
  });
  const avg = (r1.totalScore + r2.totalScore) / 2;
  const min = Math.min(r1.totalScore, r2.totalScore);
  return {
    contractVersion: "3.1",
    mode: "standard",
    contentSnapshotId: "CS-20260624-ab12",
    visualSnapshotId: "VS-20260624-ab12",
    candidateDigest: "a".repeat(64),
    reviews: [r1, r2],
    aggregate: {
      averageScore: Math.round(avg * 100) / 100,
      minimumScore: min,
      pass: true,
    },
  };
}

function makeApproval(overrides?: Partial<UserApproval>): UserApproval {
  return {
    contractVersion: "3.1",
    contentSnapshotId: "CS-20260624-ab12",
    visualSnapshotId: "VS-20260624-ab12",
    candidateDigest: "a".repeat(64),
    userDecision: "continue",
    approvedByUser: true,
    decisionNote: "approved",
    decidedAt: "2026-06-24T12:00:00+08:00",
    ...overrides,
  };
}

// --- validateV31ReviewScores ---

test("v31 scores: passes for valid", () => {
  assert.deepEqual(validateV31ReviewScores(makeScores(), "R01"), []);
});

test("v31 scores: rejects out of range", () => {
  const errors = validateV31ReviewScores(
    { ...makeScores(), topicPromise: 25 },
    "R01",
  );
  assert.ok(errors.some((e) => e.includes("topicPromise")));
});

test("v31 scores: rejects NaN", () => {
  const errors = validateV31ReviewScores(
    { ...makeScores(), cover: NaN },
    "R01",
  );
  assert.ok(errors.some((e) => e.includes("cover")));
});

// --- validateV31IndependentReview ---

test("v31 review: passes for valid", () => {
  assert.deepEqual(validateV31IndependentReview(makeReview()), []);
});

test("v31 review: rejects missing contentSnapshotId", () => {
  const errors = validateV31IndependentReview(
    makeReview({ contentSnapshotId: "" }),
  );
  assert.ok(errors.some((e) => e.includes("contentSnapshotId is required")));
});

test("v31 review: rejects missing visualSnapshotId", () => {
  const errors = validateV31IndependentReview(
    makeReview({ visualSnapshotId: "" }),
  );
  assert.ok(errors.some((e) => e.includes("visualSnapshotId is required")));
});

test("v31 review: rejects missing candidateDigest", () => {
  const errors = validateV31IndependentReview(
    makeReview({ candidateDigest: "" }),
  );
  assert.ok(errors.some((e) => e.includes("candidateDigest is required")));
});

test("v31 review: rejects invalid reviewerKind", () => {
  const errors = validateV31IndependentReview(
    makeReview({ reviewerKind: "bad" as never }),
  );
  assert.ok(errors.some((e) => e.includes("reviewerKind")));
});

test("v31 review: rejects independent !== true", () => {
  const errors = validateV31IndependentReview(
    makeReview({ independent: false as never }),
  );
  assert.ok(errors.some((e) => e.includes("independent")));
});

test("v31 review: rejects totalScore mismatch", () => {
  const errors = validateV31IndependentReview(makeReview({ totalScore: 999 }));
  assert.ok(errors.some((e) => e.includes("totalScore")));
});

test("v31 review: rejects snapshot mismatch against declared", () => {
  const errors = validateV31IndependentReview(makeReview(), {
    contentSnapshotId: "CS-different",
  });
  assert.ok(errors.some((e) => e.includes("does not match declared")));
});

// --- evaluateV31ReviewReady ---

test("v31 review-ready: passes for valid fixture", () => {
  const result = evaluateV31ReviewReady(makeReviewFixture());
  assert.equal(
    result.passed,
    true,
    `blocking: ${result.blockingReasons.join(", ")}`,
  );
});

test("v31 review-ready: blocks with only 1 review", () => {
  const fixture = makeReviewFixture();
  fixture.reviews = [fixture.reviews[0]];
  fixture.aggregate.averageScore = fixture.reviews[0].totalScore;
  fixture.aggregate.minimumScore = fixture.reviews[0].totalScore;
  const result = evaluateV31ReviewReady(fixture);
  assert.equal(result.passed, false);
  assert.ok(
    result.blockingReasons.some((r) => r.includes("at least 2 reviews")),
  );
});

test("v31 review-ready: blocks when no gpt-self", () => {
  const fixture = makeReviewFixture();
  fixture.reviews[0].reviewerKind = "external-ai";
  const result = evaluateV31ReviewReady(fixture);
  assert.equal(result.passed, false);
  assert.ok(result.blockingReasons.some((r) => r.includes("gpt-self")));
});

test("v31 review-ready: blocks when same reviewerSystem", () => {
  const fixture = makeReviewFixture();
  fixture.reviews[1].reviewerSystem = "OpenAI GPT-5.5";
  const result = evaluateV31ReviewReady(fixture);
  assert.equal(result.passed, false);
  assert.ok(
    result.blockingReasons.some((r) => r.includes("distinct reviewerSystem")),
  );
});

test("v31 review-ready: blocks when averageScore = 85", () => {
  const fixture = makeReviewFixture();
  // Set both reviews to totalScore = 85
  const scores85 = {
    topicPromise: 17,
    researchAndTruth: 13,
    contentMasterDraft: 22,
    hookStructure: 13,
    cover: 8,
    voiceoverVisualSync: 8,
    consistency: 4,
  };
  const total85 = Object.values(scores85).reduce((s, v) => s + v, 0);
  fixture.reviews[0] = makeReview({
    ...fixture.reviews[0],
    scores: scores85,
    totalScore: total85,
  });
  fixture.reviews[1] = makeReview({
    ...fixture.reviews[1],
    scores: scores85,
    totalScore: total85,
  });
  fixture.aggregate.averageScore = total85;
  fixture.aggregate.minimumScore = total85;
  const result = evaluateV31ReviewReady(fixture);
  assert.equal(result.passed, false);
  assert.ok(result.blockingReasons.some((r) => r.includes("averageScore")));
});

test("v31 review-ready: blocks when recommendation is revise", () => {
  const fixture = makeReviewFixture();
  fixture.reviews[1].recommendation = "revise";
  const result = evaluateV31ReviewReady(fixture);
  assert.equal(result.passed, false);
  assert.ok(
    result.blockingReasons.some((r) => r.includes("recommendation=revise")),
  );
});

test("v31 review-ready: blocks when vetoes present", () => {
  const fixture = makeReviewFixture();
  fixture.reviews[1].vetoes = ["fatal flaw"];
  const result = evaluateV31ReviewReady(fixture);
  assert.equal(result.passed, false);
  assert.ok(result.blockingReasons.some((r) => r.includes("vetoes")));
});

test("v31 review-ready: blocks when missing contentSnapshotId", () => {
  const fixture = makeReviewFixture();
  fixture.contentSnapshotId = "";
  const result = evaluateV31ReviewReady(fixture);
  assert.equal(result.passed, false);
  assert.ok(
    result.blockingReasons.some((r) =>
      r.includes("contentSnapshotId is required"),
    ),
  );
});

// --- validateUserApproval ---

test("user approval: passes for valid continue", () => {
  assert.deepEqual(validateUserApproval(makeApproval()), []);
});

test("user approval: passes for valid pending", () => {
  assert.deepEqual(
    validateUserApproval(
      makeApproval({
        userDecision: "pending",
        approvedByUser: false,
        decisionNote: "",
        decidedAt: null,
      }),
    ),
    [],
  );
});

test("user approval: blocks pending with approvedByUser=true", () => {
  const errors = validateUserApproval(
    makeApproval({
      userDecision: "pending",
      approvedByUser: true,
      decidedAt: null,
    }),
  );
  assert.ok(errors.some((e) => e.includes("approvedByUser=false")));
});

test("user approval: blocks continue with approvedByUser=false", () => {
  const errors = validateUserApproval(makeApproval({ approvedByUser: false }));
  assert.ok(errors.some((e) => e.includes("approvedByUser=true")));
});

test("user approval: blocks missing contentSnapshotId", () => {
  const errors = validateUserApproval(makeApproval({ contentSnapshotId: "" }));
  assert.ok(errors.some((e) => e.includes("contentSnapshotId is required")));
});

// --- evaluateV31ExecutionGate ---

test("v31 execution gate: passes with valid review + approval", () => {
  const result = evaluateV31ExecutionGate(makeReviewFixture(), makeApproval());
  assert.equal(
    result.passed,
    true,
    `blocking: ${result.blockingReasons.join(", ")}`,
  );
});

test("v31 execution gate: blocks when approval is pending", () => {
  const result = evaluateV31ExecutionGate(
    makeReviewFixture(),
    makeApproval({
      userDecision: "pending",
      approvedByUser: false,
      decisionNote: "",
      decidedAt: null,
    }),
  );
  assert.equal(result.passed, false);
  assert.ok(result.blockingReasons.some((r) => r.includes("approvedByUser")));
});

test("v31 execution gate: blocks when review fails", () => {
  const fixture = makeReviewFixture();
  fixture.reviews[0].recommendation = "revise";
  const result = evaluateV31ExecutionGate(fixture, makeApproval());
  assert.equal(result.passed, false);
  assert.ok(result.blockingReasons.some((r) => r.includes("[review]")));
});

test("v31 execution gate: blocks when snapshot IDs differ between review and approval", () => {
  const result = evaluateV31ExecutionGate(
    makeReviewFixture(),
    makeApproval({ contentSnapshotId: "CS-different" }),
  );
  assert.equal(result.passed, false);
  assert.ok(
    result.blockingReasons.some((r) => r.includes("contentSnapshotId")),
  );
});

test("v31 execution gate: verifies content snapshot file digest", () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "v31snap-"));
  const draftPath = path.join(tmpDir, "draft.md");
  fs.writeFileSync(draftPath, "original content");
  const beatPath = path.join(tmpDir, "beat.json");
  fs.writeFileSync(beatPath, "{}");
  const shotPath = path.join(tmpDir, "shot.json");
  fs.writeFileSync(shotPath, "{}");
  const coverPath = path.join(tmpDir, "cover.json");
  fs.writeFileSync(coverPath, "{}");

  // Compute the actual digest
  const { computeSourceDigest } = require("./contentSnapshot");
  const sources = {
    contentMasterDraft: "draft.md",
    beatSheet: "beat.json",
    shotPlan: "shot.json",
    coverBrief: "cover.json",
  };
  const digest = computeSourceDigest(sources, tmpDir);

  const snapPath = path.join(tmpDir, "approvedContentSnapshot.json");
  fs.writeFileSync(
    snapPath,
    JSON.stringify({
      contractVersion: "3.1",
      contentSnapshotId: "CS-20260624-ab12",
      sourceDigest: digest,
      approvedAt: "2026-06-24T12:00:00Z",
      userDecision: "approved",
      sources,
    }),
  );

  // Should pass
  const result1 = evaluateV31ExecutionGate(
    makeReviewFixture(),
    makeApproval(),
    snapPath,
    tmpDir,
  );
  assert.equal(
    result1.passed,
    true,
    `should pass: ${result1.blockingReasons.join(", ")}`,
  );

  // Modify file content
  fs.writeFileSync(draftPath, "modified content");

  // Should fail: sourceDigest mismatch
  const result2 = evaluateV31ExecutionGate(
    makeReviewFixture(),
    makeApproval(),
    snapPath,
    tmpDir,
  );
  assert.equal(result2.passed, false);
  assert.ok(
    result2.blockingReasons.some((r) => r.includes("sourceDigest mismatch")),
  );

  // Cleanup
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

// --- Prompt→Runtime contract test ---

test("v31 contract: prompt JSON fixture can be consumed by runtime", () => {
  // This fixture mirrors 07_OUTPUT_CONTRACTS.md V3.1 Standard schema exactly
  const promptFixture = {
    contractVersion: "3.1",
    mode: "standard",
    contentSnapshotId: "CS-20260624-ab12",
    visualSnapshotId: "VS-20260624-ab12",
    candidateDigest: "a".repeat(64),
    reviews: [
      {
        reviewId: "R01",
        reviewerKind: "gpt-self",
        reviewerSystem: "openai-gpt",
        independent: true,
        contentSnapshotId: "CS-20260624-ab12",
        visualSnapshotId: "VS-20260624-ab12",
        candidateDigest: "a".repeat(64),
        scores: {
          topicPromise: 18,
          researchAndTruth: 14,
          contentMasterDraft: 23,
          hookStructure: 14,
          cover: 9,
          voiceoverVisualSync: 9,
          consistency: 4,
        },
        totalScore: 91,
        issues: [],
        vetoes: [],
        recommendation: "pass",
        reviewedAt: "2026-06-24T12:00:00+08:00",
      },
      {
        reviewId: "R02",
        reviewerKind: "external-ai",
        reviewerSystem: "anthropic-claude",
        independent: true,
        contentSnapshotId: "CS-20260624-ab12",
        visualSnapshotId: "VS-20260624-ab12",
        candidateDigest: "a".repeat(64),
        scores: {
          topicPromise: 17,
          researchAndTruth: 13,
          contentMasterDraft: 22,
          hookStructure: 13,
          cover: 8,
          voiceoverVisualSync: 9,
          consistency: 4,
        },
        totalScore: 86,
        issues: [],
        vetoes: [],
        recommendation: "pass",
        reviewedAt: "2026-06-24T12:00:00+08:00",
      },
    ],
    aggregate: {
      averageScore: 88.5,
      minimumScore: 86,
      pass: true,
    },
  };

  // Write to temp file, read back, validate
  const tmpFile = path.join(os.tmpdir(), "v31-contract-test.json");
  fs.writeFileSync(tmpFile, JSON.stringify(promptFixture));

  const { readV31StandardReview } = require("./v31PreProductionGate");
  const readBack = readV31StandardReview(tmpFile);
  const result = evaluateV31ReviewReady(readBack);
  assert.equal(
    result.passed,
    true,
    `contract test failed: ${result.blockingReasons.join(", ")}`,
  );

  fs.unlinkSync(tmpFile);
});
