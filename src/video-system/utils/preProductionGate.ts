import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  validateContentBriefV2,
  type ContentBriefV2,
  type ScopeContractV2,
  type WorkflowMode,
} from "./contentBriefV2";

export type { WorkflowMode } from "./contentBriefV2";
export type ReviewerRole =
  | "cold-viewer"
  | "content-editor"
  | "fact-evidence"
  | "visual-audio-director";

export interface ReviewDimension {
  id: string;
  name?: string;
  score: number;
  maxScore: number;
  evidence: string[];
  gaps: string[];
  action: string;
}

export interface ReviewedInput {
  id: "contentBrief" | "videoSpec" | "coverBrief" | "visualDirection" | string;
  path: string;
  sha256: string;
  /** Optional formal execution path when the reviewed file is a candidate. */
  executionPath?: string;
}

export interface IndependentReview {
  reviewerId: string;
  reviewerSystem: string;
  role: ReviewerRole;
  independent: boolean;
  reviewedInputDigest: string;
  score: number;
  dimensions: ReviewDimension[];
  hardVetoes: string[];
  recommendation: "pass" | "revise" | "split" | "stop";
  reviewedAt?: string;
  contentSnapshotId?: string;
  visualSnapshotId?: string;
  candidateDigest?: string;
}

export interface PreProductionReview {
  schemaVersion: string;
  contractVersion?: string;
  projectId: string;
  mode: WorkflowMode;
  contentSnapshotId?: string;
  visualSnapshotId?: string;
  candidateDigest?: string;
  contentBriefPath: string;
  reviewedInputs: ReviewedInput[];
  scopeContract: ScopeContractV2;
  reviews: IndependentReview[];
  consensus: {
    reviewedInputDigest: string;
    meanScore: number;
    medianScore: number;
    minReviewerScore: number;
    scoreSpread: number;
    dimensionMeans: Record<string, number>;
    passed: boolean;
    blockingReasons: string[];
  };
  approval: {
    userDecision: "pending" | "continue" | "revise" | "split" | "stop";
    approvedByUser: boolean;
    decisionNote: string;
    decidedAt: string | null;
  };
}

export interface GateEvaluationOptions {
  projectRoot?: string;
  verifyInputFiles?: boolean;
  requireExecutionInputs?: boolean;
}

export interface GateEvaluation {
  passed: boolean;
  calculated: {
    reviewedInputDigest: string;
    meanScore: number;
    medianScore: number;
    minReviewerScore: number;
    scoreSpread: number;
    dimensionMeans: Record<string, number>;
  };
  blockingReasons: string[];
}

export const REQUIRED_DIMENSIONS: Record<string, number> = {
  "audience-pain": 12,
  "title-cover-promise": 8,
  "first15-retention": 15,
  "scope-completeness": 15,
  "explanation-depth": 15,
  "fact-evidence": 15,
  "actionable-value": 10,
  "voiceover-expression": 5,
  "visual-explainability": 5,
};

const REQUIRED_INPUT_IDS = ["contentBrief", "videoSpec", "coverBrief"];

const REQUIRED_ROLES_BY_MODE: Record<WorkflowMode, ReviewerRole[]> = {
  quick: ["cold-viewer", "content-editor", "fact-evidence"],
  standard: [
    "cold-viewer",
    "content-editor",
    "fact-evidence",
    "visual-audio-director",
  ],
  deep: [
    "cold-viewer",
    "content-editor",
    "fact-evidence",
    "visual-audio-director",
  ],
};

const PROJECT_ROOT = path.resolve(__dirname, "../../..");

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 0) return 0;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function normalizePath(value: string): string {
  return value.replace(/\\/g, "/").replace(/^\.\//, "");
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, "").trim();
}

export function sha256File(filePath: string): string {
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(filePath))
    .digest("hex");
}

export function calculateReviewedInputDigest(inputs: ReviewedInput[]): string {
  const stable = [...inputs]
    .map(
      (item) =>
        `${item.id}:${normalizePath(item.path)}:${item.sha256.toLowerCase()}`,
    )
    .sort()
    .join("\n");
  return crypto.createHash("sha256").update(stable).digest("hex");
}

function scoreFromDimensions(review: IndependentReview): number {
  return round2(review.dimensions.reduce((sum, item) => sum + item.score, 0));
}

function validateReviewShape(
  review: IndependentReview,
  expectedDigest: string,
): string[] {
  const errors: string[] = [];
  if (!review || typeof review !== "object") return ["review is not an object"];
  if (!review.reviewerId?.trim()) errors.push("reviewerId is empty");
  if (!review.reviewerSystem?.trim()) {
    errors.push(`${review.reviewerId || "review"}: reviewerSystem is empty`);
  }
  if (!review.reviewedAt || Number.isNaN(Date.parse(review.reviewedAt))) {
    errors.push(
      `${review.reviewerId || "review"}: reviewedAt is empty or invalid`,
    );
  }
  const dimensions = Array.isArray(review.dimensions) ? review.dimensions : [];
  const dimensionIds = dimensions.map((item) => item.id);
  if (new Set(dimensionIds).size !== dimensionIds.length) {
    errors.push(`${review.reviewerId}: dimension ids must be unique`);
  }
  const dimensionMap = new Map(dimensions.map((item) => [item.id, item]));

  for (const [id, maxScore] of Object.entries(REQUIRED_DIMENSIONS)) {
    const dimension = dimensionMap.get(id);
    if (!dimension) {
      errors.push(`${review.reviewerId}: missing dimension ${id}`);
      continue;
    }
    if (dimension.maxScore !== maxScore) {
      errors.push(
        `${review.reviewerId}: ${id}.maxScore must be ${maxScore}, got ${dimension.maxScore}`,
      );
    }
    if (
      !Number.isFinite(dimension.score) ||
      dimension.score < 0 ||
      dimension.score > maxScore
    ) {
      errors.push(
        `${review.reviewerId}: ${id}.score must be within 0-${maxScore}`,
      );
    }
    if (!Array.isArray(dimension.evidence) || dimension.evidence.length === 0) {
      errors.push(`${review.reviewerId}: ${id}.evidence must not be empty`);
    }
    if (!Array.isArray(dimension.gaps)) {
      errors.push(`${review.reviewerId}: ${id}.gaps must be an array`);
    }
    if (!dimension.action?.trim()) {
      errors.push(`${review.reviewerId}: ${id}.action must not be empty`);
    }
  }
  for (const id of dimensionIds) {
    if (!(id in REQUIRED_DIMENSIONS)) {
      errors.push(`${review.reviewerId}: unknown dimension ${id}`);
    }
  }

  const calculatedScore = scoreFromDimensions(review);
  if (Math.abs(calculatedScore - review.score) > 0.01) {
    errors.push(
      `${review.reviewerId}: score=${review.score} does not equal dimension sum=${calculatedScore}`,
    );
  }
  if (!review.independent) {
    errors.push(`${review.reviewerId}: review must be marked independent=true`);
  }
  if (review.reviewedInputDigest !== expectedDigest) {
    errors.push(
      `${review.reviewerId}: reviewedInputDigest does not match reviewed inputs`,
    );
  }
  if (!Array.isArray(review.hardVetoes)) {
    errors.push(`${review.reviewerId}: hardVetoes must be an array`);
  }
  return errors;
}

export function validateIndependentReview(
  review: IndependentReview,
  expectedDigest: string,
): string[] {
  return validateReviewShape(review, expectedDigest);
}

function sameStringArray(a: string[] = [], b: string[] = []): boolean {
  return (
    a.length === b.length &&
    a
      .map(normalizeText)
      .every((item, index) => item === normalizeText(b[index] ?? ""))
  );
}

interface CandidateVideoScene {
  id?: string;
  type?: string;
  voiceover?: string;
  spokenText?: string;
  screenText?: string;
  durationEstimate?: number;
  attentionTrigger?: string;
  visualRole?: string;
}

interface CandidateVideoSpec {
  meta?: {
    title?: string;
    fps?: number;
    theme?: string;
  };
  scenes?: CandidateVideoScene[];
}

interface CandidateCoverBrief {
  videoTitle?: string;
  coreThesis?: string;
  coverAngle?: string;
  titleCandidates?: string[];
  recommendedTitle?: string;
  subtitle?: string;
  coverType?: string;
  visualDirection?: string;
  avoidList?: string[];
  approval?: {
    userDecision?: string;
    approvedByUser?: boolean;
  };
}

function validateVideoReviewCandidate(input: unknown): {
  errors: string[];
  sceneIds: Set<string>;
} {
  const errors: string[] = [];
  const sceneIds = new Set<string>();
  if (!input || typeof input !== "object") {
    return {
      errors: ["videoSpec review candidate is not an object"],
      sceneIds,
    };
  }
  const spec = input as CandidateVideoSpec;
  if (!spec.meta?.title?.trim()) errors.push("videoSpec.meta.title is empty");
  if (!Number.isFinite(spec.meta?.fps) || (spec.meta?.fps ?? 0) <= 0) {
    errors.push("videoSpec.meta.fps must be a positive number");
  }
  if (!spec.meta?.theme?.trim()) errors.push("videoSpec.meta.theme is empty");

  const scenes = Array.isArray(spec.scenes) ? spec.scenes : [];
  if (scenes.length === 0) errors.push("videoSpec.scenes is empty");
  for (const [index, scene] of scenes.entries()) {
    const label = scene.id?.trim() || `scene[${index}]`;
    if (!scene.id?.trim()) {
      errors.push(`scene[${index}].id is empty`);
    } else {
      if (!/^S\d{2,}$/i.test(scene.id)) {
        errors.push(`${label}: id must use S01-style format`);
      }
      if (sceneIds.has(scene.id)) errors.push(`${label}: duplicate scene id`);
      sceneIds.add(scene.id);
    }
    if (!scene.type?.trim()) errors.push(`${label}: type is empty`);
    if (!scene.voiceover?.trim()) errors.push(`${label}: voiceover is empty`);
    if (!scene.spokenText?.trim()) errors.push(`${label}: spokenText is empty`);
    if (!scene.screenText?.trim()) errors.push(`${label}: screenText is empty`);
    if (
      !Number.isFinite(scene.durationEstimate) ||
      (scene.durationEstimate ?? 0) <= 0
    ) {
      errors.push(`${label}: durationEstimate must be a positive number`);
    }
    if (!scene.attentionTrigger?.trim()) {
      errors.push(`${label}: attentionTrigger is empty`);
    }
    if (!scene.visualRole?.trim()) errors.push(`${label}: visualRole is empty`);
  }
  return { errors, sceneIds };
}

function validateCoverReviewCandidate(input: unknown): string[] {
  const errors: string[] = [];
  if (!input || typeof input !== "object") {
    return ["coverBrief review candidate is not an object"];
  }
  const cover = input as CandidateCoverBrief;
  if (!cover.videoTitle?.trim()) errors.push("coverBrief.videoTitle is empty");
  if (!cover.coreThesis?.trim()) errors.push("coverBrief.coreThesis is empty");
  if (!cover.coverAngle?.trim()) errors.push("coverBrief.coverAngle is empty");
  if (
    !Array.isArray(cover.titleCandidates) ||
    cover.titleCandidates.length !== 2
  ) {
    errors.push("coverBrief.titleCandidates must contain exactly two titles");
  } else if (cover.titleCandidates.some((title) => !title?.trim())) {
    errors.push("coverBrief.titleCandidates contains an empty title");
  }
  if (!cover.recommendedTitle?.trim()) {
    errors.push("coverBrief.recommendedTitle is empty");
  } else if (
    Array.isArray(cover.titleCandidates) &&
    !cover.titleCandidates.includes(cover.recommendedTitle)
  ) {
    errors.push("coverBrief.recommendedTitle must be one of titleCandidates");
  }
  if (!cover.subtitle?.trim()) errors.push("coverBrief.subtitle is empty");
  if (
    !new Set(["pain-point", "curiosity", "contrast", "data"]).has(
      cover.coverType ?? "",
    )
  ) {
    errors.push(
      "coverBrief.coverType must be pain-point | curiosity | contrast | data",
    );
  }
  if (!cover.visualDirection?.trim()) {
    errors.push("coverBrief.visualDirection is empty");
  }
  if (!Array.isArray(cover.avoidList) || cover.avoidList.length < 2) {
    errors.push("coverBrief.avoidList must contain at least two items");
  }
  if (
    cover.approval?.userDecision !== "pending" ||
    cover.approval?.approvedByUser !== false
  ) {
    errors.push(
      "review candidate coverBrief.approval must remain pending / false",
    );
  }
  return errors;
}

function validateInputFiles(
  reviewFile: PreProductionReview,
  root: string,
  requireExecutionInputs: boolean,
): { errors: string[]; contentBrief?: ContentBriefV2 } {
  const errors: string[] = [];
  let contentBrief: ContentBriefV2 | undefined;
  let videoSceneIds: Set<string> | undefined;
  const inputs = Array.isArray(reviewFile.reviewedInputs)
    ? reviewFile.reviewedInputs
    : [];
  const ids = inputs.map((item) => item.id);
  if (new Set(ids).size !== ids.length)
    errors.push("reviewedInputs ids must be unique");
  for (const requiredId of REQUIRED_INPUT_IDS) {
    if (!ids.includes(requiredId))
      errors.push(`missing reviewed input: ${requiredId}`);
  }

  for (const input of inputs) {
    if (!input.path?.trim()) {
      errors.push(`${input.id}: reviewed input path is empty`);
      continue;
    }
    if (!/^[a-f0-9]{64}$/i.test(input.sha256 ?? "")) {
      errors.push(`${input.id}: sha256 must be a 64-character hex digest`);
      continue;
    }
    const candidatePath = path.resolve(root, input.path);
    if (!fs.existsSync(candidatePath)) {
      errors.push(
        `${input.id}: reviewed file does not exist: ${normalizePath(input.path)}`,
      );
      continue;
    }
    const actualHash = sha256File(candidatePath);
    if (actualHash !== input.sha256.toLowerCase()) {
      errors.push(`${input.id}: reviewed file hash changed after review`);
    }

    if (input.id === "contentBrief") {
      try {
        contentBrief = JSON.parse(
          fs.readFileSync(candidatePath, "utf-8"),
        ) as ContentBriefV2;
        errors.push(
          ...validateContentBriefV2(contentBrief, {
            projectRoot: root,
            verifySources: true,
          }),
        );
      } catch (error) {
        errors.push(
          `contentBrief: cannot parse JSON: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    if (input.id === "videoSpec") {
      try {
        const candidate = JSON.parse(fs.readFileSync(candidatePath, "utf-8"));
        const checked = validateVideoReviewCandidate(candidate);
        videoSceneIds = checked.sceneIds;
        errors.push(...checked.errors);
      } catch (error) {
        errors.push(
          `videoSpec: cannot parse JSON: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    if (input.id === "coverBrief") {
      try {
        const candidate = JSON.parse(fs.readFileSync(candidatePath, "utf-8"));
        errors.push(...validateCoverReviewCandidate(candidate));
      } catch (error) {
        errors.push(
          `coverBrief: cannot parse JSON: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    if (requireExecutionInputs) {
      const executionPath = path.resolve(
        root,
        input.executionPath ?? input.path,
      );
      if (!fs.existsSync(executionPath)) {
        errors.push(
          `${input.id}: execution file does not exist: ${normalizePath(input.executionPath ?? input.path)}`,
        );
      } else if (sha256File(executionPath) !== input.sha256.toLowerCase()) {
        errors.push(
          `${input.id}: execution file does not match the reviewed snapshot`,
        );
      }
    }
  }

  const contentInput = inputs.find((item) => item.id === "contentBrief");
  if (
    contentInput &&
    normalizePath(reviewFile.contentBriefPath) !==
      normalizePath(contentInput.path)
  ) {
    errors.push(
      "contentBriefPath does not match reviewedInputs[contentBrief].path",
    );
  }

  if (contentBrief) {
    if (contentBrief.workflowMode !== reviewFile.mode) {
      errors.push(
        `contentBrief.workflowMode=${contentBrief.workflowMode} does not match review mode=${reviewFile.mode}`,
      );
    }
    const contentScope = contentBrief.scopeContract;
    const reviewScope = reviewFile.scopeContract;
    if (
      normalizeText(contentScope.corePromise) !==
      normalizeText(reviewScope.corePromise)
    ) {
      errors.push("scopeContract.corePromise does not match contentBrief");
    }
    if (contentScope.targetDepth !== reviewScope.targetDepth) {
      errors.push("scopeContract.targetDepth does not match contentBrief");
    }
    if (!sameStringArray(contentScope.mustAnswer, reviewScope.mustAnswer)) {
      errors.push("scopeContract.mustAnswer does not match contentBrief");
    }
    if (!sameStringArray(contentScope.shouldAnswer, reviewScope.shouldAnswer)) {
      errors.push("scopeContract.shouldAnswer does not match contentBrief");
    }
    if (
      !sameStringArray(
        contentScope.explicitlyOutOfScope,
        reviewScope.explicitlyOutOfScope,
      )
    ) {
      errors.push(
        "scopeContract.explicitlyOutOfScope does not match contentBrief",
      );
    }
    if (contentScope.splitDecision !== reviewScope.splitDecision) {
      errors.push("scopeContract.splitDecision does not match contentBrief");
    }
  }

  if (contentBrief && videoSceneIds) {
    for (const item of contentBrief.coverageMap) {
      for (const sceneId of item.plannedScenes) {
        if (!videoSceneIds.has(sceneId)) {
          errors.push(
            `${item.questionId}: planned scene ${sceneId} does not exist in videoSpec review candidate`,
          );
        }
      }
    }
  }

  return { errors, contentBrief };
}

export function evaluatePreProductionGate(
  reviewFile: PreProductionReview,
  options: GateEvaluationOptions = {},
): GateEvaluation {
  const blockingReasons: string[] = [];
  const inputs = Array.isArray(reviewFile?.reviewedInputs)
    ? reviewFile.reviewedInputs
    : [];
  const reviewedInputDigest = calculateReviewedInputDigest(inputs);

  const emptyCalculated = {
    reviewedInputDigest,
    meanScore: 0,
    medianScore: 0,
    minReviewerScore: 0,
    scoreSpread: 0,
    dimensionMeans: {} as Record<string, number>,
  };

  if (!reviewFile || typeof reviewFile !== "object") {
    return {
      passed: false,
      calculated: emptyCalculated,
      blockingReasons: ["preProductionReview is not an object"],
    };
  }

  if (!(["quick", "standard", "deep"] as const).includes(reviewFile.mode)) {
    blockingReasons.push(`invalid mode: ${String(reviewFile.mode)}`);
  }
  if (!reviewFile.scopeContract?.corePromise?.trim()) {
    blockingReasons.push("scopeContract.corePromise is empty");
  }
  if (!Array.isArray(reviewFile.scopeContract?.mustAnswer)) {
    blockingReasons.push("scopeContract.mustAnswer is missing");
  } else if (reviewFile.scopeContract.mustAnswer.length === 0) {
    blockingReasons.push(
      "scopeContract.mustAnswer must contain at least one item",
    );
  }
  if (reviewFile.scopeContract?.splitDecision === "stop") {
    blockingReasons.push("scopeContract.splitDecision=stop");
  }

  // V3.1 Standard: dispatch to dual-review logic
  const isV31 = reviewFile.contractVersion === "3.1";
  const isStandardV31 = isV31 && reviewFile.mode === "standard";

  const reviews = Array.isArray(reviewFile.reviews) ? reviewFile.reviews : [];
  const reviewerIds = reviews.map((item) => item.reviewerId);
  if (new Set(reviewerIds).size !== reviewerIds.length) {
    blockingReasons.push("reviewerId values must be unique");
  }

  if (isStandardV31) {
    // V3.1 Standard: dual independent review, >85 threshold
    const distinctSystems = new Set(
      reviews.map((item) => item.reviewerSystem?.trim()).filter(Boolean),
    );
    if (reviews.length < 2) {
      blockingReasons.push(
        `v3.1 standard requires at least 2 reviews, got ${reviews.length}`,
      );
    }
    if (distinctSystems.size < 2) {
      blockingReasons.push(
        "v3.1 standard requires at least 2 distinct reviewerSystem values",
      );
    }
    const hasGptSelfCheck = reviews.some(
      (r) =>
        r.reviewerSystem?.toLowerCase().includes("gpt") ||
        r.reviewerSystem?.toLowerCase().includes("chatgpt"),
    );
    if (!hasGptSelfCheck && reviews.length > 0) {
      blockingReasons.push(
        "v3.1 standard requires at least one GPT self-check review",
      );
    }

    // V3.1: each review must carry the same snapshot identifiers as the top-level
    for (const review of reviews) {
      if (
        reviewFile.contentSnapshotId &&
        review.contentSnapshotId !== reviewFile.contentSnapshotId
      ) {
        blockingReasons.push(
          `${review.reviewerId}: review contentSnapshotId=${review.contentSnapshotId} does not match declared ${reviewFile.contentSnapshotId}`,
        );
      }
      if (
        reviewFile.visualSnapshotId &&
        review.visualSnapshotId !== reviewFile.visualSnapshotId
      ) {
        blockingReasons.push(
          `${review.reviewerId}: review visualSnapshotId=${review.visualSnapshotId} does not match declared ${reviewFile.visualSnapshotId}`,
        );
      }
      if (
        reviewFile.candidateDigest &&
        review.candidateDigest !== reviewFile.candidateDigest
      ) {
        blockingReasons.push(
          `${review.reviewerId}: review candidateDigest does not match declared snapshot`,
        );
      }
    }
  } else {
    // V2 / V3.1 Quick / V3.1 Deep: role-based review
    const requiredRoles = REQUIRED_ROLES_BY_MODE[reviewFile.mode] ?? [];
    const reviewRoles = reviews.map((item) => item.role);
    const presentRoles = new Set(reviewRoles);
    if (presentRoles.size !== reviewRoles.length) {
      blockingReasons.push(
        "reviewer roles must be unique; use exactly one independent reviewer per required role",
      );
    }
    for (const role of requiredRoles) {
      if (!presentRoles.has(role))
        blockingReasons.push(`missing required reviewer role: ${role}`);
    }
    if (reviews.length !== requiredRoles.length) {
      blockingReasons.push(
        `review count ${reviews.length} must equal required ${requiredRoles.length} for mode=${reviewFile.mode}`,
      );
    }
    const distinctSystems = new Set(
      reviews.map((item) => item.reviewerSystem?.trim()).filter(Boolean),
    );
    if (reviews.length > 0 && distinctSystems.size < 2) {
      blockingReasons.push(
        "multi-AI review requires at least two distinct reviewerSystem values",
      );
    }
  }

  for (const review of reviews) {
    blockingReasons.push(...validateReviewShape(review, reviewedInputDigest));
    if (Array.isArray(review.hardVetoes) && review.hardVetoes.length > 0) {
      blockingReasons.push(
        `${review.reviewerId} hard veto: ${review.hardVetoes.join("; ")}`,
      );
    }
    if (review.recommendation !== "pass") {
      blockingReasons.push(
        `${review.reviewerId} recommendation=${review.recommendation}`,
      );
    }
  }

  const scores = reviews.map((item) => item.score).filter(Number.isFinite);
  const meanScore = scores.length
    ? round2(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    : 0;
  const medianScore = round2(median(scores));
  const minReviewerScore = scores.length ? Math.min(...scores) : 0;
  const maxReviewerScore = scores.length ? Math.max(...scores) : 0;
  const scoreSpread = round2(maxReviewerScore - minReviewerScore);

  const dimensionMeans: Record<string, number> = {};
  for (const id of Object.keys(REQUIRED_DIMENSIONS)) {
    const values = reviews
      .map((review) => review.dimensions?.find((item) => item.id === id)?.score)
      .filter((score): score is number => typeof score === "number");
    dimensionMeans[id] = values.length
      ? round2(values.reduce((sum, score) => sum + score, 0) / values.length)
      : 0;
  }

  // Score thresholds: V3.1 Standard uses >85, others use >=90
  if (isStandardV31) {
    if (meanScore <= 85)
      blockingReasons.push(`v3.1 standard meanScore ${meanScore} must be > 85`);
    if (minReviewerScore <= 85)
      blockingReasons.push(
        `v3.1 standard minReviewerScore ${minReviewerScore} must be > 85`,
      );
  } else {
    if (meanScore < 90) blockingReasons.push(`meanScore ${meanScore} < 90`);
    if (medianScore < 90)
      blockingReasons.push(`medianScore ${medianScore} < 90`);
    if (minReviewerScore < 85)
      blockingReasons.push(`minReviewerScore ${minReviewerScore} < 85`);
    if (scoreSpread > 8)
      blockingReasons.push(
        `reviewer score spread ${scoreSpread} > 8; arbitration required`,
      );
  }

  if (!isStandardV31) {
    const thresholdByDimension: Record<string, number> = {
      "first15-retention": 13,
      "scope-completeness": 13,
      "explanation-depth": 13,
      "fact-evidence": 13,
      "actionable-value": 8,
      "visual-explainability": 4,
    };
    for (const [id, threshold] of Object.entries(thresholdByDimension)) {
      if ((dimensionMeans[id] ?? 0) < threshold) {
        blockingReasons.push(
          `dimension mean ${id}=${dimensionMeans[id] ?? 0} < ${threshold}`,
        );
      }
    }
  }

  if (
    reviewFile.approval?.userDecision !== "continue" ||
    reviewFile.approval?.approvedByUser !== true
  ) {
    blockingReasons.push("user approval is not continue + approvedByUser=true");
  }
  if (!reviewFile.approval?.decisionNote?.trim()) {
    blockingReasons.push("approval.decisionNote is empty");
  }
  if (
    !reviewFile.approval?.decidedAt ||
    Number.isNaN(Date.parse(reviewFile.approval.decidedAt))
  ) {
    blockingReasons.push("approval.decidedAt is empty or invalid");
  }

  if (reviewFile.consensus?.reviewedInputDigest !== reviewedInputDigest) {
    blockingReasons.push(
      "stored consensus.reviewedInputDigest does not match calculated digest",
    );
  }
  if (Math.abs((reviewFile.consensus?.meanScore ?? -1) - meanScore) > 0.01) {
    blockingReasons.push(
      "stored consensus.meanScore does not match calculated value",
    );
  }
  if (
    Math.abs((reviewFile.consensus?.medianScore ?? -1) - medianScore) > 0.01
  ) {
    blockingReasons.push(
      "stored consensus.medianScore does not match calculated value",
    );
  }
  if (
    Math.abs(
      (reviewFile.consensus?.minReviewerScore ?? -1) - minReviewerScore,
    ) > 0.01
  ) {
    blockingReasons.push(
      "stored consensus.minReviewerScore does not match calculated value",
    );
  }
  if (
    Math.abs((reviewFile.consensus?.scoreSpread ?? -1) - scoreSpread) > 0.01
  ) {
    blockingReasons.push(
      "stored consensus.scoreSpread does not match calculated value",
    );
  }
  for (const id of Object.keys(REQUIRED_DIMENSIONS)) {
    if (
      Math.abs(
        (reviewFile.consensus?.dimensionMeans?.[id] ?? -1) - dimensionMeans[id],
      ) > 0.01
    ) {
      blockingReasons.push(
        `stored consensus.dimensionMeans.${id} does not match calculated value`,
      );
    }
  }
  if (reviewFile.consensus?.passed !== true) {
    blockingReasons.push("stored consensus.passed is not true");
  }

  if (options.verifyInputFiles) {
    const checked = validateInputFiles(
      reviewFile,
      options.projectRoot ?? PROJECT_ROOT,
      options.requireExecutionInputs ?? false,
    );
    blockingReasons.push(...checked.errors);
  }

  const passed = blockingReasons.length === 0;
  return {
    passed,
    calculated: {
      reviewedInputDigest,
      meanScore,
      medianScore,
      minReviewerScore,
      scoreSpread,
      dimensionMeans,
    },
    blockingReasons,
  };
}

export function readPreProductionReview(
  filePath = path.resolve(__dirname, "../data/preProductionReview.json"),
): PreProductionReview {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing pre-production review file: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as PreProductionReview;
}

export function assertPreProductionGate(
  filePath = path.resolve(__dirname, "../data/preProductionReview.json"),
): GateEvaluation {
  const reviewFile = readPreProductionReview(filePath);
  const evaluation = evaluatePreProductionGate(reviewFile, {
    verifyInputFiles: true,
    requireExecutionInputs: true,
  });
  if (!evaluation.passed) {
    throw new Error(
      `PRE-PRODUCTION GATE BLOCKED\n- ${evaluation.blockingReasons.join("\n- ")}`,
    );
  }
  return evaluation;
}

export function assertPreProductionReviewReady(
  filePath = path.resolve(__dirname, "../data/preProductionReview.json"),
): GateEvaluation {
  const reviewFile = readPreProductionReview(filePath);
  const evaluation = evaluatePreProductionGate(reviewFile, {
    verifyInputFiles: true,
    requireExecutionInputs: false,
  });
  if (!evaluation.passed) {
    throw new Error(
      `PRE-PRODUCTION REVIEW BLOCKED\n- ${evaluation.blockingReasons.join("\n- ")}`,
    );
  }
  return evaluation;
}

// --- V3.1 Standard Dual-Review Gate ---

export interface StandardDualReviewInput {
  reviews: Array<{
    reviewerId: string;
    reviewerSystem: string;
    score: number;
    recommendation: string;
    hardVetoes: string[];
    contentSnapshotId?: string;
    visualSnapshotId?: string;
    candidateDigest?: string;
  }>;
  candidateDigest: string;
  contentSnapshotId?: string;
  visualSnapshotId?: string;
}

export function evaluateStandardDualReview(
  input: StandardDualReviewInput,
): string[] {
  const blockingReasons: string[] = [];
  const { reviews, candidateDigest } = input;

  if (reviews.length < 2) {
    blockingReasons.push(
      `standard requires at least 2 reviews, got ${reviews.length}`,
    );
  }

  const distinctSystems = new Set(
    reviews.map((r) => r.reviewerSystem?.trim()).filter(Boolean),
  );
  if (distinctSystems.size < 2) {
    blockingReasons.push(
      "standard requires at least 2 distinct reviewerSystem values",
    );
  }

  const hasGptSelfCheck = reviews.some(
    (r) =>
      r.reviewerSystem?.toLowerCase().includes("gpt") ||
      r.reviewerSystem?.toLowerCase().includes("chatgpt"),
  );
  if (!hasGptSelfCheck && reviews.length > 0) {
    blockingReasons.push(
      "standard requires at least one GPT self-check review",
    );
  }

  if (!/^[a-f0-9]{64}$/i.test(candidateDigest)) {
    blockingReasons.push(
      "candidateDigest must be a 64-character SHA-256 hex digest",
    );
  }

  for (const review of reviews) {
    // V3.1: each review must carry the same snapshot identifiers
    if (
      input.contentSnapshotId &&
      review.contentSnapshotId !== input.contentSnapshotId
    ) {
      blockingReasons.push(
        `${review.reviewerId}: review contentSnapshotId does not match declared snapshot`,
      );
    }
    if (
      input.visualSnapshotId &&
      review.visualSnapshotId !== input.visualSnapshotId
    ) {
      blockingReasons.push(
        `${review.reviewerId}: review visualSnapshotId does not match declared snapshot`,
      );
    }
    if (review.candidateDigest && review.candidateDigest !== candidateDigest) {
      blockingReasons.push(
        `${review.reviewerId}: review candidateDigest does not match declared snapshot`,
      );
    }

    if (review.recommendation !== "pass") {
      blockingReasons.push(
        `${review.reviewerId}: recommendation=${review.recommendation}, must be pass`,
      );
    }
    if (Array.isArray(review.hardVetoes) && review.hardVetoes.length > 0) {
      blockingReasons.push(
        `${review.reviewerId} has vetoes: ${review.hardVetoes.join("; ")}`,
      );
    }
  }

  const scores = reviews.map((r) => r.score).filter(Number.isFinite);
  if (scores.length > 0) {
    const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
    const min = Math.min(...scores);
    if (avg <= 85) {
      blockingReasons.push(`standard averageScore ${round2(avg)} must be > 85`);
    }
    if (min <= 85) {
      blockingReasons.push(`standard minimumScore ${min} must be > 85`);
    }
  }

  return blockingReasons;
}

export function validateContentSnapshotConsistency(
  declaredContentSnapshotId: string,
  artifactContentSnapshotIds: string[],
): string[] {
  const errors: string[] = [];
  for (const [index, id] of artifactContentSnapshotIds.entries()) {
    if (id !== declaredContentSnapshotId) {
      errors.push(
        `artifact[${index}] contentSnapshotId=${id} does not match declared ${declaredContentSnapshotId}`,
      );
    }
  }
  return errors;
}

export function validateVisualSnapshotConsistency(
  declaredVisualSnapshotId: string,
  declaredCandidateDigest: string,
  artifact: { visualSnapshotId?: string; candidateDigest?: string },
): string[] {
  const errors: string[] = [];
  if (
    artifact.visualSnapshotId &&
    artifact.visualSnapshotId !== declaredVisualSnapshotId
  ) {
    errors.push(
      `visualSnapshotId ${artifact.visualSnapshotId} does not match declared ${declaredVisualSnapshotId}`,
    );
  }
  if (
    artifact.candidateDigest &&
    artifact.candidateDigest !== declaredCandidateDigest
  ) {
    errors.push(`candidateDigest does not match declared snapshot`);
  }
  return errors;
}
