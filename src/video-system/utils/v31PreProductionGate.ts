import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  computeSourceDigest,
  validateContentSnapshotId,
} from "./contentSnapshot";

// --- V3.1 Review Issue ---

export interface ReviewIssue {
  dimension: string;
  severity: "info" | "warning" | "blocking";
  description: string;
  evidence?: string;
}

// --- V3.1 Independent Review ---

export type ReviewerKind = "gpt-self" | "external-ai";

const VALID_REVIEWER_KINDS: ReviewerKind[] = ["gpt-self", "external-ai"];

export interface V31ReviewScores {
  topicPromise: number;
  researchAndTruth: number;
  contentMasterDraft: number;
  hookStructure: number;
  cover: number;
  voiceoverVisualSync: number;
  consistency: number;
}

const SCORE_DIMENSIONS: Record<keyof V31ReviewScores, number> = {
  topicPromise: 20,
  researchAndTruth: 15,
  contentMasterDraft: 25,
  hookStructure: 15,
  cover: 10,
  voiceoverVisualSync: 10,
  consistency: 5,
};

export interface V31IndependentReview {
  reviewId: string;
  reviewerKind: ReviewerKind;
  reviewerSystem: string;
  independent: true;
  contentSnapshotId: string;
  visualSnapshotId: string;
  candidateDigest: string;
  scores: V31ReviewScores;
  totalScore: number;
  issues: ReviewIssue[];
  vetoes: string[];
  recommendation: "pass" | "revise" | "stop";
  reviewedAt: string;
}

// --- V3.1 Standard PreProduction Review ---

export interface V31StandardPreProductionReview {
  contractVersion: "3.1";
  mode: "standard";
  contentSnapshotId: string;
  visualSnapshotId: string;
  candidateDigest: string;
  reviews: V31IndependentReview[];
  aggregate: {
    averageScore: number;
    minimumScore: number;
    pass: boolean;
  };
}

// --- User Approval (separate file) ---

export interface UserApproval {
  contractVersion: "3.1";
  contentSnapshotId: string;
  visualSnapshotId: string;
  candidateDigest: string;
  userDecision: "pending" | "continue" | "revise" | "stop";
  approvedByUser: boolean;
  decisionNote: string;
  decidedAt: string | null;
}

// --- Review-Ready Evaluation ---

export interface V31ReviewReadyEvaluation {
  passed: boolean;
  blockingReasons: string[];
  aggregate: {
    averageScore: number;
    minimumScore: number;
  };
}

// --- Execution Gate Evaluation ---

export interface V31ExecutionGateEvaluation {
  passed: boolean;
  blockingReasons: string[];
}

// --- Constants ---

const SNAPSHOT_ID_PATTERN = /^[A-Z]{2}-\d{8}-[a-f0-9]{4}$/;
const DIGEST_PATTERN = /^[a-f0-9]{64}$/i;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function normalizeSystem(value: string): string {
  return value.trim().toLowerCase();
}

// --- V3.1 Review Validation ---

export function validateV31ReviewScores(
  scores: Partial<V31ReviewScores>,
  reviewId: string,
): string[] {
  const errors: string[] = [];
  for (const [key, maxScore] of Object.entries(SCORE_DIMENSIONS)) {
    const value = scores[key as keyof V31ReviewScores];
    if (!Number.isFinite(value)) {
      errors.push(`${reviewId}: scores.${key} must be a finite number`);
    } else if (value! < 0 || value! > maxScore) {
      errors.push(`${reviewId}: scores.${key}=${value} must be 0-${maxScore}`);
    }
  }
  return errors;
}

export function validateV31IndependentReview(
  review: Partial<V31IndependentReview>,
  options?: {
    contentSnapshotId?: string;
    visualSnapshotId?: string;
    candidateDigest?: string;
  },
): string[] {
  const errors: string[] = [];
  const rid = review.reviewId ?? "review";

  if (!review.reviewId?.trim()) errors.push("reviewId is empty");

  if (!VALID_REVIEWER_KINDS.includes(review.reviewerKind as ReviewerKind)) {
    errors.push(`${rid}: reviewerKind must be gpt-self | external-ai`);
  }

  if (!review.reviewerSystem?.trim()) {
    errors.push(`${rid}: reviewerSystem is empty`);
  }

  if (review.independent !== true) {
    errors.push(`${rid}: independent must be true`);
  }

  // V3.1: three identifiers are mandatory
  if (!review.contentSnapshotId?.trim()) {
    errors.push(`${rid}: contentSnapshotId is required`);
  } else if (!SNAPSHOT_ID_PATTERN.test(review.contentSnapshotId)) {
    errors.push(`${rid}: contentSnapshotId must match CS-YYYYMMDD-xxxx format`);
  }
  if (!review.visualSnapshotId?.trim()) {
    errors.push(`${rid}: visualSnapshotId is required`);
  } else if (!SNAPSHOT_ID_PATTERN.test(review.visualSnapshotId)) {
    errors.push(`${rid}: visualSnapshotId must match VS-YYYYMMDD-xxxx format`);
  }
  if (!review.candidateDigest?.trim()) {
    errors.push(`${rid}: candidateDigest is required`);
  } else if (!DIGEST_PATTERN.test(review.candidateDigest)) {
    errors.push(`${rid}: candidateDigest must be 64-char hex`);
  }

  // Compare against declared identifiers (unconditional)
  if (
    options?.contentSnapshotId &&
    review.contentSnapshotId !== options.contentSnapshotId
  ) {
    errors.push(
      `${rid}: contentSnapshotId=${review.contentSnapshotId} does not match declared ${options.contentSnapshotId}`,
    );
  }
  if (
    options?.visualSnapshotId &&
    review.visualSnapshotId !== options.visualSnapshotId
  ) {
    errors.push(
      `${rid}: visualSnapshotId=${review.visualSnapshotId} does not match declared ${options.visualSnapshotId}`,
    );
  }
  if (
    options?.candidateDigest &&
    review.candidateDigest !== options.candidateDigest
  ) {
    errors.push(`${rid}: candidateDigest does not match declared snapshot`);
  }

  if (!review.scores || typeof review.scores !== "object") {
    errors.push(`${rid}: scores is missing`);
  } else {
    errors.push(...validateV31ReviewScores(review.scores, rid));
  }

  if (!Number.isFinite(review.totalScore)) {
    errors.push(`${rid}: totalScore must be a finite number`);
  } else if (review.scores && typeof review.scores === "object") {
    const expectedTotal = Object.values(review.scores).reduce(
      (s, v) => s + v,
      0,
    );
    if (Math.abs(review.totalScore! - expectedTotal) > 0.01) {
      errors.push(
        `${rid}: totalScore=${review.totalScore} does not equal scores sum=${round2(expectedTotal)}`,
      );
    }
  }

  if (!Array.isArray(review.issues)) {
    errors.push(`${rid}: issues must be an array`);
  }
  if (!Array.isArray(review.vetoes)) {
    errors.push(`${rid}: vetoes must be an array`);
  }

  if (!["pass", "revise", "stop"].includes(review.recommendation as string)) {
    errors.push(`${rid}: recommendation must be pass | revise | stop`);
  }

  if (!review.reviewedAt || Number.isNaN(Date.parse(review.reviewedAt))) {
    errors.push(`${rid}: reviewedAt is empty or invalid`);
  }

  return errors;
}

// --- V3.1 Review-Ready Gate ---

export function evaluateV31ReviewReady(
  review: V31StandardPreProductionReview,
): V31ReviewReadyEvaluation {
  const blockingReasons: string[] = [];

  if (review.contractVersion !== "3.1") {
    blockingReasons.push("contractVersion must be 3.1");
  }
  if (review.mode !== "standard") {
    blockingReasons.push("mode must be standard for V3.1 Standard review");
  }

  // Top-level identifiers are mandatory
  if (!review.contentSnapshotId?.trim()) {
    blockingReasons.push("contentSnapshotId is required");
  } else if (!SNAPSHOT_ID_PATTERN.test(review.contentSnapshotId)) {
    blockingReasons.push(
      "contentSnapshotId must match CS-YYYYMMDD-xxxx format",
    );
  }
  if (!review.visualSnapshotId?.trim()) {
    blockingReasons.push("visualSnapshotId is required");
  } else if (!SNAPSHOT_ID_PATTERN.test(review.visualSnapshotId)) {
    blockingReasons.push("visualSnapshotId must match VS-YYYYMMDD-xxxx format");
  }
  if (!review.candidateDigest?.trim()) {
    blockingReasons.push("candidateDigest is required");
  } else if (!DIGEST_PATTERN.test(review.candidateDigest)) {
    blockingReasons.push("candidateDigest must be 64-char hex");
  }

  const reviews = Array.isArray(review.reviews) ? review.reviews : [];

  // At least 2 reviews
  if (reviews.length < 2) {
    blockingReasons.push(`requires at least 2 reviews, got ${reviews.length}`);
  }

  // At least 2 distinct reviewerSystem (normalized)
  const distinctSystems = new Set(
    reviews.map((r) => normalizeSystem(r.reviewerSystem)).filter(Boolean),
  );
  if (distinctSystems.size < 2) {
    blockingReasons.push("requires at least 2 distinct reviewerSystem values");
  }

  // At least one gpt-self
  const hasGptSelf = reviews.some((r) => r.reviewerKind === "gpt-self");
  if (!hasGptSelf) {
    blockingReasons.push("requires at least one gpt-self review");
  }

  // ReviewerId uniqueness
  const reviewIds = reviews.map((r) => r.reviewId);
  if (new Set(reviewIds).size !== reviewIds.length) {
    blockingReasons.push("reviewId values must be unique");
  }

  // Validate each review
  for (const r of reviews) {
    errors: for (const err of validateV31IndependentReview(r, {
      contentSnapshotId: review.contentSnapshotId,
      visualSnapshotId: review.visualSnapshotId,
      candidateDigest: review.candidateDigest,
    })) {
      blockingReasons.push(err);
    }
    if (r.recommendation !== "pass") {
      blockingReasons.push(
        `${r.reviewId}: recommendation=${r.recommendation}, must be pass`,
      );
    }
    if (r.vetoes.length > 0) {
      blockingReasons.push(`${r.reviewId} has vetoes: ${r.vetoes.join("; ")}`);
    }
  }

  // Score thresholds
  const scores = reviews.map((r) => r.totalScore).filter(Number.isFinite);
  const averageScore = scores.length
    ? round2(scores.reduce((s, v) => s + v, 0) / scores.length)
    : 0;
  const minimumScore = scores.length ? Math.min(...scores) : 0;

  if (averageScore <= 85) {
    blockingReasons.push(`averageScore ${averageScore} must be > 85`);
  }
  if (minimumScore <= 85) {
    blockingReasons.push(`minimumScore ${minimumScore} must be > 85`);
  }

  // Aggregate consistency
  if (Math.abs((review.aggregate?.averageScore ?? -1) - averageScore) > 0.01) {
    blockingReasons.push(
      "aggregate.averageScore does not match calculated value",
    );
  }
  if (Math.abs((review.aggregate?.minimumScore ?? -1) - minimumScore) > 0.01) {
    blockingReasons.push(
      "aggregate.minimumScore does not match calculated value",
    );
  }
  if (review.aggregate?.pass !== (blockingReasons.length === 0)) {
    blockingReasons.push("aggregate.pass does not match evaluation result");
  }

  return {
    passed: blockingReasons.length === 0,
    blockingReasons,
    aggregate: { averageScore, minimumScore },
  };
}

// --- V3.1 User Approval Validation ---

export function validateUserApproval(
  approval: Partial<UserApproval>,
): string[] {
  const errors: string[] = [];

  if (approval.contractVersion !== "3.1") {
    errors.push("userApproval.contractVersion must be 3.1");
  }

  if (!approval.contentSnapshotId?.trim()) {
    errors.push("userApproval.contentSnapshotId is required");
  } else if (!SNAPSHOT_ID_PATTERN.test(approval.contentSnapshotId)) {
    errors.push(
      "userApproval.contentSnapshotId must match CS-YYYYMMDD-xxxx format",
    );
  }
  if (!approval.visualSnapshotId?.trim()) {
    errors.push("userApproval.visualSnapshotId is required");
  } else if (!SNAPSHOT_ID_PATTERN.test(approval.visualSnapshotId)) {
    errors.push(
      "userApproval.visualSnapshotId must match VS-YYYYMMDD-xxxx format",
    );
  }
  if (!approval.candidateDigest?.trim()) {
    errors.push("userApproval.candidateDigest is required");
  } else if (!DIGEST_PATTERN.test(approval.candidateDigest)) {
    errors.push("userApproval.candidateDigest must be 64-char hex");
  }

  const validDecisions = ["pending", "continue", "revise", "stop"];
  if (!validDecisions.includes(approval.userDecision as string)) {
    errors.push(
      "userApproval.userDecision must be pending | continue | revise | stop",
    );
  }

  if (approval.userDecision === "pending") {
    if (approval.approvedByUser !== false) {
      errors.push("pending must use approvedByUser=false");
    }
    if (approval.decidedAt !== null) {
      errors.push("pending must use decidedAt=null");
    }
  } else {
    if (approval.approvedByUser !== true) {
      errors.push("non-pending requires approvedByUser=true");
    }
    if (!approval.decisionNote?.trim()) {
      errors.push("non-pending requires decisionNote");
    }
    if (!approval.decidedAt || Number.isNaN(Date.parse(approval.decidedAt))) {
      errors.push("non-pending requires valid decidedAt");
    }
  }

  return errors;
}

// --- V3.1 Execution Gate (review-ready + user approval) ---

export function evaluateV31ExecutionGate(
  review: V31StandardPreProductionReview,
  approval: UserApproval,
  contentSnapshotPath?: string,
  projectRoot?: string,
): V31ExecutionGateEvaluation {
  const blockingReasons: string[] = [];

  // Step 1: review must pass
  const reviewResult = evaluateV31ReviewReady(review);
  if (!reviewResult.passed) {
    blockingReasons.push(
      ...reviewResult.blockingReasons.map((r) => `[review] ${r}`),
    );
  }

  // Step 2: user approval must be structurally valid AND decision=continue
  const approvalErrors = validateUserApproval(approval);
  if (approvalErrors.length > 0) {
    blockingReasons.push(...approvalErrors.map((e) => `[approval] ${e}`));
  } else if (
    approval.userDecision !== "continue" ||
    approval.approvedByUser !== true
  ) {
    blockingReasons.push(
      "[approval] userDecision must be continue + approvedByUser=true",
    );
  }

  // Step 3: identifiers must match between review and approval
  if (approval.contentSnapshotId !== review.contentSnapshotId) {
    blockingReasons.push(
      `[consistency] approval contentSnapshotId=${approval.contentSnapshotId} does not match review ${review.contentSnapshotId}`,
    );
  }
  if (approval.visualSnapshotId !== review.visualSnapshotId) {
    blockingReasons.push(
      `[consistency] approval visualSnapshotId=${approval.visualSnapshotId} does not match review ${review.visualSnapshotId}`,
    );
  }
  if (approval.candidateDigest !== review.candidateDigest) {
    blockingReasons.push(
      "[consistency] approval candidateDigest does not match review",
    );
  }

  // Step 4: verify content snapshot if path provided
  if (contentSnapshotPath && projectRoot) {
    try {
      const snap = JSON.parse(fs.readFileSync(contentSnapshotPath, "utf-8"));
      if (snap.contentSnapshotId !== review.contentSnapshotId) {
        blockingReasons.push(
          `[snapshot] file contentSnapshotId=${snap.contentSnapshotId} does not match review ${review.contentSnapshotId}`,
        );
      }
      const actualDigest = computeSourceDigest(snap.sources, projectRoot);
      if (actualDigest !== snap.sourceDigest) {
        blockingReasons.push(
          "[snapshot] file content has changed since snapshot was created (sourceDigest mismatch)",
        );
      }
    } catch (err) {
      blockingReasons.push(
        `[snapshot] cannot read or parse contentSnapshot: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  return {
    passed: blockingReasons.length === 0,
    blockingReasons,
  };
}

// --- File I/O ---

export function readV31StandardReview(
  filePath: string,
): V31StandardPreProductionReview {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing V3.1 review file: ${filePath}`);
  }
  return JSON.parse(
    fs.readFileSync(filePath, "utf-8"),
  ) as V31StandardPreProductionReview;
}

export function readUserApproval(filePath: string): UserApproval {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing userApproval file: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as UserApproval;
}

// --- Assert helpers ---

export function assertV31ReviewReady(
  reviewPath: string,
): V31ReviewReadyEvaluation {
  const review = readV31StandardReview(reviewPath);
  const result = evaluateV31ReviewReady(review);
  if (!result.passed) {
    throw new Error(
      `V3.1 REVIEW-READY BLOCKED\n- ${result.blockingReasons.join("\n- ")}`,
    );
  }
  return result;
}

export function assertV31ExecutionGate(
  reviewPath: string,
  approvalPath: string,
  contentSnapshotPath?: string,
  projectRoot?: string,
): V31ExecutionGateEvaluation {
  const review = readV31StandardReview(reviewPath);
  const approval = readUserApproval(approvalPath);
  const result = evaluateV31ExecutionGate(
    review,
    approval,
    contentSnapshotPath,
    projectRoot,
  );
  if (!result.passed) {
    throw new Error(
      `V3.1 EXECUTION GATE BLOCKED\n- ${result.blockingReasons.join("\n- ")}`,
    );
  }
  return result;
}
