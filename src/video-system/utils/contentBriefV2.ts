import * as fs from "node:fs";
import * as path from "node:path";

export type WorkflowMode = "quick" | "standard" | "deep";

export interface ScopeContractV2 {
  corePromise: string;
  targetDepth: "discovery" | "decision" | "execution" | "complete-guide";
  mustAnswer: string[];
  shouldAnswer: string[];
  explicitlyOutOfScope: string[];
  followUpDestination?: string[];
  splitDecision: "single" | "series" | "stop";
}

export interface CoverageItemV2 {
  questionId: string;
  question: string;
  priority: "must" | "should" | "optional";
  answerSummary: string;
  evidenceIds: string[];
  plannedScenes: string[];
  status: "covered" | "partial" | "missing";
  gapAction: string;
}

export interface FactEvidenceItemV2 {
  claimId: string;
  claim: string;
  criticality: "core" | "supporting";
  claimType:
    | "official-fact"
    | "experiment"
    | "inference"
    | "opinion"
    | "metaphor";
  source: string;
  confidence: "high" | "medium" | "low";
  counterexampleChecked: boolean;
  qualification: string;
  productionStatus: "allowed" | "qualify" | "remove";
}

export interface ContentBriefV2 {
  workflowMode: WorkflowMode;
  scopeContract: ScopeContractV2;
  coverageMap: CoverageItemV2[];
  factEvidenceMap: FactEvidenceItemV2[];
  preProductionReadiness: {
    status: "ready-for-review" | "revise" | "split" | "stop";
    blockingReasons: string[];
  };
  [key: string]: unknown;
}

export interface ContentBriefValidationOptions {
  projectRoot?: string;
  verifySources?: boolean;
}

const WORKFLOW_MODES: WorkflowMode[] = ["quick", "standard", "deep"];
const TARGET_DEPTHS: ScopeContractV2["targetDepth"][] = [
  "discovery",
  "decision",
  "execution",
  "complete-guide",
];
const SPLIT_DECISIONS: ScopeContractV2["splitDecision"][] = [
  "single",
  "series",
  "stop",
];
const PRIORITIES: CoverageItemV2["priority"][] = ["must", "should", "optional"];
const COVERAGE_STATUSES: CoverageItemV2["status"][] = [
  "covered",
  "partial",
  "missing",
];
const CLAIM_TYPES: FactEvidenceItemV2["claimType"][] = [
  "official-fact",
  "experiment",
  "inference",
  "opinion",
  "metaphor",
];
const CRITICALITIES: FactEvidenceItemV2["criticality"][] = ["core", "supporting"];
const CONFIDENCES: FactEvidenceItemV2["confidence"][] = ["high", "medium", "low"];
const PRODUCTION_STATUSES: FactEvidenceItemV2["productionStatus"][] = [
  "allowed",
  "qualify",
  "remove",
];

function normalize(value: string): string {
  return value.replace(/\s+/g, "").trim();
}

function hasDuplicateNormalized(values: string[]): boolean {
  const normalized = values.map(normalize).filter(Boolean);
  return new Set(normalized).size !== normalized.length;
}

function isUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

function verifyTraceableSource(
  item: FactEvidenceItemV2,
  options: ContentBriefValidationOptions,
): string | null {
  if (!options.verifySources) return null;
  const source = item.source?.trim() ?? "";
  if (!source) return `${item.claimId}: source is empty`;

  if (item.claimType === "official-fact") {
    if (!isUrl(source)) {
      return `${item.claimId}: official-fact source must be an http(s) official URL`;
    }
    return null;
  }

  if (item.claimType === "experiment") {
    if (isUrl(source)) return null;
    const root = options.projectRoot ?? process.cwd();
    const absolute = path.isAbsolute(source) ? source : path.resolve(root, source);
    if (!fs.existsSync(absolute)) {
      return `${item.claimId}: experiment source file does not exist: ${source}`;
    }
  }
  return null;
}

export function validateContentBriefV2(
  input: unknown,
  options: ContentBriefValidationOptions = {},
): string[] {
  const errors: string[] = [];
  if (!input || typeof input !== "object") return ["contentBrief is not an object"];
  const brief = input as Partial<ContentBriefV2>;

  if (!WORKFLOW_MODES.includes(brief.workflowMode as WorkflowMode)) {
    errors.push("contentBrief.workflowMode must be quick | standard | deep");
  }

  const scope = brief.scopeContract;
  if (!scope || typeof scope !== "object") {
    errors.push("contentBrief.scopeContract is missing");
  } else {
    if (!scope.corePromise?.trim()) {
      errors.push("contentBrief.scopeContract.corePromise is empty");
    }
    if (!TARGET_DEPTHS.includes(scope.targetDepth)) {
      errors.push(
        "contentBrief.scopeContract.targetDepth must be discovery | decision | execution | complete-guide",
      );
    }
    if (!SPLIT_DECISIONS.includes(scope.splitDecision)) {
      errors.push("contentBrief.scopeContract.splitDecision must be single | series | stop");
    }
    if (!Array.isArray(scope.mustAnswer) || scope.mustAnswer.length === 0) {
      errors.push("contentBrief.scopeContract.mustAnswer must contain at least one item");
    } else {
      if (scope.mustAnswer.some((item) => !item?.trim())) {
        errors.push("contentBrief.scopeContract.mustAnswer contains an empty item");
      }
      if (hasDuplicateNormalized(scope.mustAnswer)) {
        errors.push("contentBrief.scopeContract.mustAnswer contains duplicate items");
      }
    }
    for (const key of ["shouldAnswer", "explicitlyOutOfScope"] as const) {
      if (!Array.isArray(scope[key])) {
        errors.push(`contentBrief.scopeContract.${key} must be an array`);
      } else if (scope[key].some((item) => !item?.trim())) {
        errors.push(`contentBrief.scopeContract.${key} contains an empty item`);
      }
    }
    if (
      scope.followUpDestination !== undefined &&
      !Array.isArray(scope.followUpDestination)
    ) {
      errors.push("contentBrief.scopeContract.followUpDestination must be an array");
    }
    if (scope.splitDecision === "stop") {
      errors.push("contentBrief.scopeContract.splitDecision=stop");
    }
  }

  const coverage = Array.isArray(brief.coverageMap) ? brief.coverageMap : [];
  if (coverage.length === 0) errors.push("contentBrief.coverageMap is empty");
  const ids = coverage.map((item) => item.questionId);
  if (new Set(ids).size !== ids.length) {
    errors.push("contentBrief.coverageMap questionId values must be unique");
  }

  const facts = Array.isArray(brief.factEvidenceMap) ? brief.factEvidenceMap : [];
  if (facts.length === 0) errors.push("contentBrief.factEvidenceMap is empty");
  const claimIds = facts.map((item) => item.claimId);
  if (new Set(claimIds).size !== claimIds.length) {
    errors.push("contentBrief.factEvidenceMap claimId values must be unique");
  }
  const claimIdSet = new Set(claimIds);

  const mustQuestions = new Set((scope?.mustAnswer ?? []).map(normalize));
  const coveredMust = new Set<string>();
  const referencedClaimIds = new Set<string>();
  for (const item of coverage) {
    const label = item.questionId || "coverage item";
    if (!item.questionId?.trim()) errors.push("coverageMap item has empty questionId");
    if (!/^Q\d{2,}$/i.test(item.questionId ?? "")) {
      errors.push(`${label}: questionId should use Q01-style format`);
    }
    if (!item.question?.trim()) errors.push(`${label}: question is empty`);
    if (!PRIORITIES.includes(item.priority)) {
      errors.push(`${label}: invalid priority=${String(item.priority)}`);
    }
    if (!COVERAGE_STATUSES.includes(item.status)) {
      errors.push(`${label}: invalid status=${String(item.status)}`);
    }
    if (!item.answerSummary?.trim()) errors.push(`${label}: answerSummary is empty`);
    if (!item.gapAction?.trim()) errors.push(`${label}: gapAction is empty`);
    if (!Array.isArray(item.evidenceIds) || item.evidenceIds.length === 0) {
      errors.push(`${label}: evidenceIds must contain at least one claimId`);
    } else {
      for (const evidenceId of item.evidenceIds) {
        referencedClaimIds.add(evidenceId);
        if (!claimIdSet.has(evidenceId)) {
          errors.push(`${label}: evidenceId ${evidenceId} is not present in factEvidenceMap`);
        }
      }
    }
    if (!Array.isArray(item.plannedScenes) || item.plannedScenes.length === 0) {
      errors.push(`${label}: plannedScenes must contain at least one sceneId`);
    } else if (item.plannedScenes.some((sceneId) => !/^S\d{2,}$/i.test(sceneId))) {
      errors.push(`${label}: plannedScenes must use S01-style scene IDs`);
    }
    if (item.priority === "must") {
      if (item.status !== "covered") {
        errors.push(`${label}: must question status=${item.status}`);
      }
      coveredMust.add(normalize(item.question));
    }
  }
  for (const question of mustQuestions) {
    if (!coveredMust.has(question)) {
      errors.push(
        `scope mustAnswer is not mapped as covered in coverageMap: ${question}`,
      );
    }
  }

  if (!facts.some((item) => item.criticality === "core")) {
    errors.push("contentBrief.factEvidenceMap must contain at least one core claim");
  }
  for (const item of facts) {
    const label = item.claimId || "claim";
    if (!item.claimId?.trim()) errors.push("factEvidenceMap item has empty claimId");
    if (!/^C\d{2,}$/i.test(item.claimId ?? "")) {
      errors.push(`${label}: claimId should use C01-style format`);
    }
    if (!item.claim?.trim()) errors.push(`${label}: claim is empty`);
    if (!CRITICALITIES.includes(item.criticality)) {
      errors.push(`${label}: invalid criticality=${String(item.criticality)}`);
    }
    if (!CLAIM_TYPES.includes(item.claimType)) {
      errors.push(`${label}: invalid claimType=${String(item.claimType)}`);
    }
    if (!CONFIDENCES.includes(item.confidence)) {
      errors.push(`${label}: invalid confidence=${String(item.confidence)}`);
    }
    if (!PRODUCTION_STATUSES.includes(item.productionStatus)) {
      errors.push(`${label}: invalid productionStatus=${String(item.productionStatus)}`);
    }
    if (item.criticality === "core" && item.counterexampleChecked !== true) {
      errors.push(`${label}: core claim counterexampleChecked must be true`);
    }
    if (item.criticality === "core" && item.productionStatus === "remove") {
      errors.push(`${label}: core claim is marked remove`);
    }
    if (item.criticality === "core" && item.confidence === "low") {
      errors.push(`${label}: core claim confidence cannot be low`);
    }
    if (
      (item.claimType === "official-fact" || item.claimType === "experiment") &&
      !item.source?.trim()
    ) {
      errors.push(`${label}: ${item.claimType} requires a source`);
    }
    if (
      (item.productionStatus === "qualify" ||
        item.claimType === "experiment" ||
        item.claimType === "inference" ||
        item.claimType === "metaphor") &&
      !item.qualification?.trim()
    ) {
      errors.push(`${label}: claim requires qualification wording`);
    }
    const sourceError = verifyTraceableSource(item, options);
    if (sourceError) errors.push(sourceError);
    if (item.criticality === "core" && !referencedClaimIds.has(item.claimId)) {
      errors.push(`${label}: core claim is not referenced by any coverageMap evidenceIds`);
    }
  }

  const readiness = brief.preProductionReadiness;
  if (readiness?.status !== "ready-for-review") {
    errors.push(
      `contentBrief.preProductionReadiness.status=${readiness?.status ?? "missing"}`,
    );
  }
  if (!Array.isArray(readiness?.blockingReasons)) {
    errors.push("contentBrief.preProductionReadiness.blockingReasons is missing");
  } else if (readiness.blockingReasons.length > 0) {
    errors.push(
      `contentBrief has blocking reasons: ${readiness.blockingReasons.join("; ")}`,
    );
  }

  return errors;
}
