import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateReviewedInputDigest,
  evaluatePreProductionExecutionGate,
  evaluatePreProductionReviewReady,
  evaluateStandardDualReview,
  validateContentSnapshotConsistency,
  validateVisualSnapshotConsistency,
  type IndependentReview,
  type PreProductionReview,
  type UserApproval,
  REQUIRED_DIMENSIONS,
} from "./preProductionGate";

const CS_ID = "CS-20260624-test";
const VS_ID = "VS-20260624-test";
const DIGEST = "a".repeat(64);

const inputs = [
  { id: "contentBrief", path: "content.json", sha256: "a".repeat(64) },
  { id: "videoSpec", path: "video.json", sha256: "b".repeat(64) },
  { id: "coverBrief", path: "cover.json", sha256: "c".repeat(64) },
];
const digest = calculateReviewedInputDigest(inputs);

function makeReview(
  reviewerId: string,
  role: IndependentReview["role"],
): IndependentReview {
  const dimensions = Object.entries(REQUIRED_DIMENSIONS).map(
    ([id, maxScore]) => ({
      id,
      score: maxScore,
      maxScore,
      evidence: ["verified"],
      gaps: [],
      action: "keep",
    }),
  );
  return {
    reviewerId,
    reviewerSystem:
      reviewerId === "viewer" ? "OpenAI GPT-5.5" : "Anthropic Claude",
    role,
    independent: true,
    reviewedInputDigest: digest,
    score: 100,
    dimensions,
    hardVetoes: [],
    recommendation: "pass",
    reviewedAt: "2026-06-23T12:00:00+08:00",
  };
}

function makeFile(): PreProductionReview {
  return {
    schemaVersion: "4.0",
    contractVersion: "4.0",
    projectId: "demo",
    mode: "standard",
    contentSnapshotId: CS_ID,
    visualSnapshotId: VS_ID,
    candidateDigest: DIGEST,
    contentBriefPath: "content.json",
    reviewedInputs: inputs,
    scopeContract: {
      corePromise: "Explain one verified question",
      targetDepth: "decision",
      mustAnswer: ["What changed?"],
      shouldAnswer: [],
      explicitlyOutOfScope: [],
      followUpDestination: [],
      splitDecision: "single",
    },
    reviews: [
      makeReview("viewer", "cold-viewer"),
      makeReview("editor", "content-editor"),
      makeReview("fact", "fact-evidence"),
      makeReview("vad", "visual-audio-director"),
    ],
    consensus: {
      reviewedInputDigest: digest,
      meanScore: 100,
      medianScore: 100,
      minReviewerScore: 100,
      scoreSpread: 0,
      dimensionMeans: { ...REQUIRED_DIMENSIONS },
      passed: true,
      blockingReasons: [],
    },
  };
}

function makeApproval(): UserApproval {
  return {
    contractVersion: "4.0",
    contentSnapshotId: CS_ID,
    visualSnapshotId: VS_ID,
    candidateDigest: DIGEST,
    userDecision: "continue",
    approvedByUser: true,
    decisionNote: "approved",
    decidedAt: "2026-06-23T12:00:00+08:00",
  };
}

// ─── Review-Ready Tests ─────────────────────────────────

test("review-ready passes with valid 4-role standard review", () => {
  const result = evaluatePreProductionReviewReady(makeFile());
  assert.equal(result.passed, true);
  assert.equal(result.calculated.meanScore, 100);
});

test("review-ready blocks a hard veto", () => {
  const file = makeFile();
  file.reviews[1].hardVetoes.push("unsupported core claim");
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /hard veto/);
});

test("review-ready blocks reviewers who reviewed another snapshot", () => {
  const file = makeFile();
  file.reviews[0].reviewedInputDigest = "d".repeat(64);
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /reviewedInputDigest/);
});

test("review-ready blocks score spread above eight points", () => {
  const file = makeFile();
  file.reviews[0].dimensions[0].score = 3;
  file.reviews[0].score = 91;
  file.consensus.meanScore = 97;
  file.consensus.medianScore = 100;
  file.consensus.minReviewerScore = 91;
  file.consensus.scoreSpread = 9;
  file.consensus.dimensionMeans["audience-pain"] = 9;
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /spread/);
});

test("review-ready requires at least two distinct reviewer systems", () => {
  const file = makeFile();
  for (const review of file.reviews) review.reviewerSystem = "Same Model";
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
  assert.match(
    result.blockingReasons.join("\n"),
    /two distinct reviewerSystem/,
  );
});

// ─── Execution Gate Tests ───────────────────────────────

test("execution gate passes with valid review + valid approval", () => {
  const result = evaluatePreProductionExecutionGate(makeFile(), makeApproval());
  assert.equal(result.passed, true);
});

test("execution gate blocks missing user approval", () => {
  const approval = makeApproval();
  approval.userDecision = "pending";
  approval.approvedByUser = false;
  approval.decidedAt = null;
  const result = evaluatePreProductionExecutionGate(makeFile(), approval);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /user approval/);
});

// ─── V3.1 Standard Dual-Review Tests ────────────────────

test("standard dual-review passes with 2 reviews, 2 systems, GPT self-check, avg > 85", () => {
  const errors = evaluateStandardDualReview({
    reviews: [
      {
        reviewerId: "gpt-self",
        reviewerSystem: "OpenAI GPT-5.5",
        score: 88,
        recommendation: "pass",
        hardVetoes: [],
      },
      {
        reviewerId: "claude",
        reviewerSystem: "Anthropic Claude",
        score: 87,
        recommendation: "pass",
        hardVetoes: [],
      },
    ],
    candidateDigest: "a".repeat(64),
  });
  assert.deepEqual(errors, []);
});

test("standard dual-review blocks when only 1 review", () => {
  const errors = evaluateStandardDualReview({
    reviews: [
      {
        reviewerId: "gpt-self",
        reviewerSystem: "OpenAI GPT-5.5",
        score: 90,
        recommendation: "pass",
        hardVetoes: [],
      },
    ],
    candidateDigest: "a".repeat(64),
  });
  assert.ok(errors.length > 0);
  assert.match(errors.join("\n"), /at least 2 reviews/);
});

test("standard dual-review blocks when both reviews use same system", () => {
  const errors = evaluateStandardDualReview({
    reviews: [
      {
        reviewerId: "gpt-self",
        reviewerSystem: "OpenAI GPT-5.5",
        score: 90,
        recommendation: "pass",
        hardVetoes: [],
      },
      {
        reviewerId: "gpt-other",
        reviewerSystem: "OpenAI GPT-5.5",
        score: 90,
        recommendation: "pass",
        hardVetoes: [],
      },
    ],
    candidateDigest: "a".repeat(64),
  });
  assert.ok(errors.length > 0);
  assert.match(errors.join("\n"), /2 distinct reviewerSystem/);
});

test("standard dual-review blocks when no GPT self-check", () => {
  const errors = evaluateStandardDualReview({
    reviews: [
      {
        reviewerId: "claude-1",
        reviewerSystem: "Anthropic Claude",
        score: 90,
        recommendation: "pass",
        hardVetoes: [],
      },
      {
        reviewerId: "claude-2",
        reviewerSystem: "Google Gemini",
        score: 90,
        recommendation: "pass",
        hardVetoes: [],
      },
    ],
    candidateDigest: "a".repeat(64),
  });
  assert.ok(errors.length > 0);
  assert.match(errors.join("\n"), /GPT self-check/);
});

test("standard dual-review blocks when average <= 85", () => {
  const errors = evaluateStandardDualReview({
    reviews: [
      {
        reviewerId: "gpt-self",
        reviewerSystem: "OpenAI GPT-5.5",
        score: 85,
        recommendation: "pass",
        hardVetoes: [],
      },
      {
        reviewerId: "claude",
        reviewerSystem: "Anthropic Claude",
        score: 85,
        recommendation: "pass",
        hardVetoes: [],
      },
    ],
    candidateDigest: "a".repeat(64),
  });
  assert.ok(errors.length > 0);
  assert.match(errors.join("\n"), /averageScore.*must be > 85/);
});

test("standard dual-review blocks when recommendation is not pass", () => {
  const errors = evaluateStandardDualReview({
    reviews: [
      {
        reviewerId: "gpt-self",
        reviewerSystem: "OpenAI GPT-5.5",
        score: 90,
        recommendation: "revise",
        hardVetoes: [],
      },
      {
        reviewerId: "claude",
        reviewerSystem: "Anthropic Claude",
        score: 90,
        recommendation: "pass",
        hardVetoes: [],
      },
    ],
    candidateDigest: "a".repeat(64),
  });
  assert.ok(errors.length > 0);
  assert.match(errors.join("\n"), /recommendation=revise/);
});

test("standard dual-review blocks when hardVetoes present", () => {
  const errors = evaluateStandardDualReview({
    reviews: [
      {
        reviewerId: "gpt-self",
        reviewerSystem: "OpenAI GPT-5.5",
        score: 90,
        recommendation: "pass",
        hardVetoes: ["factual error"],
      },
      {
        reviewerId: "claude",
        reviewerSystem: "Anthropic Claude",
        score: 90,
        recommendation: "pass",
        hardVetoes: [],
      },
    ],
    candidateDigest: "a".repeat(64),
  });
  assert.ok(errors.length > 0);
  assert.match(errors.join("\n"), /vetoes/);
});

// ─── Snapshot Consistency ───────────────────────────────

test("content snapshot consistency passes with matching IDs", () => {
  const errors = validateContentSnapshotConsistency("CS-001", [
    "CS-001",
    "CS-001",
  ]);
  assert.deepEqual(errors, []);
});

test("content snapshot consistency fails with mismatched IDs", () => {
  const errors = validateContentSnapshotConsistency("CS-001", [
    "CS-001",
    "CS-002",
  ]);
  assert.ok(errors.length > 0);
  assert.match(errors.join("\n"), /does not match/);
});

test("visual snapshot consistency passes with matching values", () => {
  const errors = validateVisualSnapshotConsistency("VS-001", "a".repeat(64), {
    visualSnapshotId: "VS-001",
    candidateDigest: "a".repeat(64),
  });
  assert.deepEqual(errors, []);
});

test("visual snapshot consistency fails with mismatched visualSnapshotId", () => {
  const errors = validateVisualSnapshotConsistency("VS-001", "a".repeat(64), {
    visualSnapshotId: "VS-002",
    candidateDigest: "a".repeat(64),
  });
  assert.ok(errors.length > 0);
  assert.match(errors.join("\n"), /visualSnapshotId/);
});
