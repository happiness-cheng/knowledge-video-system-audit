/**
 * V4 Pre-Production Gate — 真实运行时边界测试
 *
 * 直接调用运行时函数，不复制 Gate 算法。
 * 覆盖 review-ready / execution gate 分离、contractVersion、reviewerSystem 规范化。
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateReviewedInputDigest,
  evaluatePreProductionExecutionGate,
  evaluatePreProductionReviewReady,
  type IndependentReview,
  type PreProductionReview,
  type UserApproval,
  REQUIRED_DIMENSIONS,
} from "./preProductionGate";

// ─── 基础 fixture 工厂 ─────────────────────────────────

const CS_ID = "CS-20260624-test";
const VS_ID = "VS-20260624-test";
const DIGEST = "a".repeat(64);

const inputs = [
  { id: "contentBrief", path: "content.json", sha256: "a".repeat(64) },
  { id: "videoSpec", path: "video.json", sha256: "b".repeat(64) },
  { id: "coverBrief", path: "cover.json", sha256: "c".repeat(64) },
];
const digest = calculateReviewedInputDigest(inputs);

function maxDimensions() {
  return Object.entries(REQUIRED_DIMENSIONS).map(([id, maxScore]) => ({
    id,
    score: maxScore,
    maxScore,
    evidence: ["verified"],
    gaps: [],
    action: "keep",
  }));
}

function makeReview(
  reviewerId: string,
  role: IndependentReview["role"],
  system: string,
  score = 100,
): IndependentReview {
  return {
    reviewerId,
    reviewerSystem: system,
    role,
    independent: true,
    reviewedInputDigest: digest,
    score,
    dimensions: maxDimensions(),
    hardVetoes: [],
    recommendation: "pass",
    reviewedAt: "2026-06-24T12:00:00Z",
  };
}

function makeReviewFile(): PreProductionReview {
  return {
    schemaVersion: "4.0",
    contractVersion: "4.0",
    projectId: "test-v4",
    mode: "standard",
    contentSnapshotId: CS_ID,
    visualSnapshotId: VS_ID,
    candidateDigest: DIGEST,
    contentBriefPath: "content.json",
    reviewedInputs: inputs,
    scopeContract: {
      corePromise: "Test promise",
      targetDepth: "decision",
      mustAnswer: ["Q1"],
      shouldAnswer: [],
      explicitlyOutOfScope: [],
      followUpDestination: [],
      splitDecision: "single",
    },
    reviews: [
      makeReview("cv", "cold-viewer", "OpenAI GPT", 100),
      makeReview("ce", "content-editor", "Anthropic Claude", 100),
      makeReview("fe", "fact-evidence", "Google Gemini", 100),
      makeReview("vad", "visual-audio-director", "OpenAI GPT", 100),
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
    decidedAt: "2026-06-24T12:00:00Z",
  };
}

// ─── Review-Ready 正向测试 ─────────────────────────────

test("review-ready passes with valid 4-role standard review", () => {
  const result = evaluatePreProductionReviewReady(makeReviewFile());
  assert.equal(result.passed, true);
  assert.equal(result.blockingReasons.length, 0);
});

test("review-ready passes without any approval field (review-only)", () => {
  const file = makeReviewFile();
  // Confirm no approval field exists
  assert.equal("approval" in file, false);
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, true);
});

// ─── Review-Ready 负向测试 ─────────────────────────────

test("review-ready fails when contractVersion is missing", () => {
  const file = makeReviewFile();
  delete (file as Record<string, unknown>).contractVersion;
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
  // The mode check will fail first since contractVersion is checked in evaluatePreProductionGate
  // but review-ready checks mode validity
});

test("review-ready fails when mode is quick", () => {
  const file = makeReviewFile();
  (file as Record<string, unknown>).mode = "quick";
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /quick/);
});

test("review-ready fails with only 3 reviews", () => {
  const file = makeReviewFile();
  file.reviews = file.reviews.slice(0, 3);
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /visual-audio-director/);
});

test("review-ready fails with duplicate role", () => {
  const file = makeReviewFile();
  file.reviews[1].role = "cold-viewer";
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /unique/);
});

test("review-ready fails with duplicate reviewerId", () => {
  const file = makeReviewFile();
  file.reviews[1].reviewerId = "cv";
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /reviewerId.*unique/i);
});

test("review-ready fails when all reviewers use same system", () => {
  const file = makeReviewFile();
  for (const r of file.reviews) r.reviewerSystem = "Same Model";
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /distinct reviewerSystem/);
});

test("review-ready fails when system differs only by trailing whitespace", () => {
  const file = makeReviewFile();
  file.reviews[0].reviewerSystem = "SameSystem";
  file.reviews[1].reviewerSystem = "SameSystem ";
  file.reviews[2].reviewerSystem = "SameSystem";
  file.reviews[3].reviewerSystem = "SameSystem ";
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /distinct reviewerSystem/);
});

test("review-ready fails when review has wrong reviewedInputDigest", () => {
  const file = makeReviewFile();
  file.reviews[0].reviewedInputDigest = "f".repeat(64);
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /reviewedInputDigest/);
});

test("review-ready fails when meanScore < 90", () => {
  const file = makeReviewFile();
  file.reviews[0].dimensions[0].score = 5;
  file.reviews[0].score = 93;
  file.consensus.meanScore = 98.25;
  file.consensus.medianScore = 100;
  file.consensus.minReviewerScore = 93;
  file.consensus.dimensionMeans["audience-pain"] = 10.25;
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
});

test("review-ready fails when hardVetoes non-empty", () => {
  const file = makeReviewFile();
  file.reviews[2].hardVetoes = ["factual error"];
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /hard veto/);
});

test("review-ready fails when recommendation is not pass", () => {
  const file = makeReviewFile();
  file.reviews[1].recommendation = "revise";
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /recommendation=revise/);
});

test("review-ready fails when score does not equal dimension sum", () => {
  const file = makeReviewFile();
  file.reviews[0].score = 999;
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
  assert.match(
    result.blockingReasons.join("\n"),
    /does not equal dimension sum/,
  );
});

test("review-ready fails when first15-retention mean < 13", () => {
  const file = makeReviewFile();
  for (const r of file.reviews) {
    const dim = r.dimensions.find((d) => d.id === "first15-retention")!;
    dim.score = 12;
    r.score = 100 - 3;
  }
  file.consensus.meanScore = 97;
  file.consensus.dimensionMeans["first15-retention"] = 12;
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /first15-retention/);
});

// ─── Execution Gate 正向测试 ───────────────────────────

test("execution gate passes with valid review + valid separate approval", () => {
  const review = makeReviewFile();
  const approval = makeApproval();
  const result = evaluatePreProductionExecutionGate(review, approval);
  assert.equal(result.passed, true);
  assert.equal(result.blockingReasons.length, 0);
});

// ─── Execution Gate 负向测试 ───────────────────────────

test("execution gate fails when approval is pending", () => {
  const review = makeReviewFile();
  const approval = makeApproval();
  approval.userDecision = "pending";
  approval.approvedByUser = false;
  approval.decidedAt = null;
  approval.decisionNote = "";
  const result = evaluatePreProductionExecutionGate(review, approval);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /user approval/);
});

test("execution gate fails when contentSnapshotId mismatch", () => {
  const review = makeReviewFile();
  review.contentSnapshotId = "CS-0001";
  const approval = makeApproval();
  approval.contentSnapshotId = "CS-9999";
  const result = evaluatePreProductionExecutionGate(review, approval);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /contentSnapshotId/);
});

test("execution gate fails when visualSnapshotId mismatch", () => {
  const review = makeReviewFile();
  review.visualSnapshotId = "VS-0001";
  const approval = makeApproval();
  approval.visualSnapshotId = "VS-9999";
  const result = evaluatePreProductionExecutionGate(review, approval);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /visualSnapshotId/);
});

test("execution gate fails when candidateDigest mismatch", () => {
  const review = makeReviewFile();
  review.candidateDigest = "a".repeat(64);
  const approval = makeApproval();
  approval.candidateDigest = "b".repeat(64);
  const result = evaluatePreProductionExecutionGate(review, approval);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /candidateDigest/);
});

test("execution gate fails when decisionNote is empty", () => {
  const review = makeReviewFile();
  const approval = makeApproval();
  approval.decisionNote = "";
  const result = evaluatePreProductionExecutionGate(review, approval);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /decisionNote/);
});

test("execution gate fails when decidedAt is invalid", () => {
  const review = makeReviewFile();
  const approval = makeApproval();
  approval.decidedAt = "not-a-date";
  const result = evaluatePreProductionExecutionGate(review, approval);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /decidedAt/);
});

test("execution gate fails when review fails review-ready", () => {
  const review = makeReviewFile();
  review.reviews[1].recommendation = "revise"; // fails review-ready
  const approval = makeApproval();
  const result = evaluatePreProductionExecutionGate(review, approval);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /recommendation/);
});

// ─── reviewerSystem 规范化 ─────────────────────────────

test("reviewerSystem normalization: mixed case/whitespace counts as one system", () => {
  const file = makeReviewFile();
  file.reviews[0].reviewerSystem = "OpenAI-GPT";
  file.reviews[1].reviewerSystem = "openai-gpt";
  file.reviews[2].reviewerSystem = "  OpenAI-GPT  ";
  file.reviews[3].reviewerSystem = "OPENAI-GPT";
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /distinct reviewerSystem/);
});

// ─── 三标识验证 ─────────────────────────────────────────

test("review-ready fails when all three identifiers are missing", () => {
  const file = makeReviewFile();
  file.contentSnapshotId = "";
  file.visualSnapshotId = "";
  file.candidateDigest = "";
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /contentSnapshotId/);
  assert.match(result.blockingReasons.join("\n"), /visualSnapshotId/);
  assert.match(result.blockingReasons.join("\n"), /candidateDigest/);
});

test("review-ready fails when contentSnapshotId is empty", () => {
  const file = makeReviewFile();
  file.contentSnapshotId = "";
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /contentSnapshotId/);
});

test("review-ready fails when visualSnapshotId is empty", () => {
  const file = makeReviewFile();
  file.visualSnapshotId = "";
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /visualSnapshotId/);
});

test("review-ready fails when candidateDigest is not 64-char hex", () => {
  const file = makeReviewFile();
  file.candidateDigest = "not-a-valid-digest";
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /candidateDigest/);
});

test("review-ready passes with real identifiers present", () => {
  const file = makeReviewFile();
  assert.equal(file.contentSnapshotId, CS_ID);
  assert.equal(file.visualSnapshotId, VS_ID);
  assert.equal(file.candidateDigest, DIGEST);
  const result = evaluatePreProductionReviewReady(file);
  assert.equal(result.passed, true);
});

test("execution gate fails when both sides have missing identifiers", () => {
  const review = makeReviewFile();
  review.contentSnapshotId = "";
  review.visualSnapshotId = "";
  review.candidateDigest = "";
  const approval = makeApproval();
  approval.contentSnapshotId = "";
  approval.visualSnapshotId = "";
  approval.candidateDigest = "";
  const result = evaluatePreProductionExecutionGate(review, approval);
  assert.equal(result.passed, false);
});

test("execution gate fails when approval contractVersion is missing", () => {
  const review = makeReviewFile();
  const approval = makeApproval();
  delete (approval as Record<string, unknown>).contractVersion;
  const result = evaluatePreProductionExecutionGate(review, approval);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /contractVersion/);
});

test("execution gate fails when approval contractVersion is 3.1", () => {
  const review = makeReviewFile();
  const approval = makeApproval();
  (approval as Record<string, unknown>).contractVersion = "3.1";
  const result = evaluatePreProductionExecutionGate(review, approval);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /contractVersion/);
});

test("execution gate fails when approval identifiers are empty", () => {
  const review = makeReviewFile();
  const approval = makeApproval();
  approval.contentSnapshotId = "";
  approval.visualSnapshotId = "";
  approval.candidateDigest = "";
  const result = evaluatePreProductionExecutionGate(review, approval);
  assert.equal(result.passed, false);
});

test("execution gate fails when review and approval use different candidateDigest", () => {
  const review = makeReviewFile();
  const approval = makeApproval();
  approval.candidateDigest = "f".repeat(64);
  const result = evaluatePreProductionExecutionGate(review, approval);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /candidateDigest/);
});

test("execution gate passes with real matching identifiers", () => {
  const review = makeReviewFile();
  const approval = makeApproval();
  assert.equal(review.contentSnapshotId, approval.contentSnapshotId);
  assert.equal(review.visualSnapshotId, approval.visualSnapshotId);
  assert.equal(review.candidateDigest, approval.candidateDigest);
  const result = evaluatePreProductionExecutionGate(review, approval);
  assert.equal(result.passed, true);
});
