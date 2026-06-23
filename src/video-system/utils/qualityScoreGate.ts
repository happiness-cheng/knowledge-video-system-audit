export const QUALITY_DIMENSIONS: Record<string, { name: string; category: "content" | "packaging"; maxScore: number }> = {
  "topic-promise": { name: "选题承诺", category: "content", maxScore: 8 },
  "pain-hit": { name: "痛点命中", category: "content", maxScore: 12 },
  "first15-retention": { name: "前 15 秒留存链路", category: "content", maxScore: 12 },
  "gain-value": { name: "获得感", category: "content", maxScore: 13 },
  "surprise-value": { name: "惊喜感 / 认知反差", category: "content", maxScore: 8 },
  "real-case": { name: "真实案例 / 实验", category: "content", maxScore: 12 },
  "structure-progression": { name: "结构递进", category: "content", maxScore: 8 },
  "actionable-method": { name: "可执行方法 / 模板", category: "content", maxScore: 8 },
  "expression-emotion": { name: "表达力 / 感染力", category: "content", maxScore: 4 },
  "dual-covers": { name: "3:4 + 4:3 双封面", category: "packaging", maxScore: 4 },
  "title-clickability": { name: "标题清楚有点击欲", category: "packaging", maxScore: 5 },
  "subtitle-completeness": { name: "同步字幕完整", category: "packaging", maxScore: 3 },
  "reusable-metadata": { name: "简介和标签可复用", category: "packaging", maxScore: 3 },
};

export const REQUIRED_RELEASE_HARD_GATES = [
  "subtitles-complete",
  "dual-covers-complete",
  "real-case-present",
  "actionable-method-present",
  "gain-value-threshold",
  "first15-threshold",
  "real-case-threshold",
  "actionable-threshold",
  "title-threshold",
  "visual-explanation-present",
  "scope-fulfilled",
  "facts-consistent",
  "review-snapshot-current",
  "score-90",
] as const;

export interface QualityDimension {
  id: string;
  name: string;
  category: "content" | "packaging";
  score: number;
  maxScore: number;
  evidence: string[];
  gaps: string[];
  action: string;
}

export interface ReleaseHardGate {
  id: string;
  name: string;
  passed: boolean;
  evidence: string[];
  action: string;
}

interface DecisionBlock {
  userDecision: string;
  approvedByUser: boolean;
  decisionNote: string;
  decidedAt: string | null;
}

export interface QualityScoreV2 extends DecisionBlock {
  schemaVersion: "2.0";
  stage: "release";
  preProductionSnapshotDigest: string;
  previewGate: DecisionBlock & {
    reviewer: string;
    recommendation: "pass" | "revise" | "split" | "stop";
    keyRisks: string[];
  };
  scoreRecommendation: "excellent" | "revise" | "major-revise" | "reject";
  totalScore: number;
  contentScore: number;
  packagingScore: number;
  hardGatePassed: boolean;
  dimensions: QualityDimension[];
  hardGates: ReleaseHardGate[];
  reviewSummary: {
    level: string;
    nextAction: string;
  };
}

function validDate(value: string | null): boolean {
  return typeof value === "string" && value.length > 0 && !Number.isNaN(Date.parse(value));
}

function validateDecision(
  block: DecisionBlock | undefined,
  label: string,
  allowed: string[],
): string[] {
  const errors: string[] = [];
  if (!block) return [`${label} is missing`];
  if (!allowed.includes(block.userDecision)) {
    errors.push(`${label}.userDecision is invalid: ${String(block.userDecision)}`);
  }
  if (block.userDecision === "pending") {
    if (block.approvedByUser !== false) {
      errors.push(`${label}: pending must use approvedByUser=false`);
    }
    if (block.decidedAt !== null) errors.push(`${label}: pending decidedAt must be null`);
  } else {
    if (block.approvedByUser !== true) {
      errors.push(`${label}: non-pending requires approvedByUser=true`);
    }
    if (!block.decisionNote?.trim()) errors.push(`${label}.decisionNote is empty`);
    if (!validDate(block.decidedAt)) errors.push(`${label}.decidedAt is invalid`);
  }
  return errors;
}

export function validateQualityScoreV2(
  input: unknown,
  options: { requirePublish?: boolean; expectedPreProductionDigest?: string } = {},
): string[] {
  const errors: string[] = [];
  if (!input || typeof input !== "object") return ["qualityScore is not an object"];
  const score = input as Partial<QualityScoreV2>;
  if (score.schemaVersion !== "2.0") errors.push("qualityScore.schemaVersion must be 2.0");
  if (score.stage !== "release") errors.push("qualityScore.stage must be release");
  if (!/^[a-f0-9]{64}$/i.test(score.preProductionSnapshotDigest ?? "")) {
    errors.push("preProductionSnapshotDigest must be a 64-character SHA-256 digest");
  }
  if (
    options.expectedPreProductionDigest &&
    score.preProductionSnapshotDigest !== options.expectedPreProductionDigest
  ) {
    errors.push("preProductionSnapshotDigest does not match the current approved review snapshot");
  }

  const dimensions = Array.isArray(score.dimensions) ? score.dimensions : [];
  const ids = dimensions.map((item) => item.id);
  if (new Set(ids).size !== ids.length) errors.push("qualityScore dimension ids must be unique");
  for (const [id, expected] of Object.entries(QUALITY_DIMENSIONS)) {
    const item = dimensions.find((dimension) => dimension.id === id);
    if (!item) {
      errors.push(`missing quality dimension: ${id}`);
      continue;
    }
    if (item.maxScore !== expected.maxScore) {
      errors.push(`${id}.maxScore must be ${expected.maxScore}`);
    }
    if (item.category !== expected.category) {
      errors.push(`${id}.category must be ${expected.category}`);
    }
    if (!Number.isFinite(item.score) || item.score < 0 || item.score > item.maxScore) {
      errors.push(`${id}.score must be within 0-${item.maxScore}`);
    }
    if (!Array.isArray(item.evidence) || item.evidence.length === 0) {
      errors.push(`${id}.evidence must not be empty`);
    }
    if (!Array.isArray(item.gaps)) errors.push(`${id}.gaps must be an array`);
    if (!item.action?.trim()) errors.push(`${id}.action is empty`);
  }
  for (const id of ids) {
    if (!(id in QUALITY_DIMENSIONS)) errors.push(`unknown quality dimension: ${id}`);
  }

  const contentScore = dimensions
    .filter((item) => item.category === "content")
    .reduce((sum, item) => sum + item.score, 0);
  const packagingScore = dimensions
    .filter((item) => item.category === "packaging")
    .reduce((sum, item) => sum + item.score, 0);
  const totalScore = contentScore + packagingScore;
  if (score.contentScore !== contentScore) errors.push("contentScore does not equal content dimension sum");
  if (score.packagingScore !== packagingScore) errors.push("packagingScore does not equal packaging dimension sum");
  if (score.totalScore !== totalScore) errors.push("totalScore does not equal contentScore + packagingScore");

  const hardGates = Array.isArray(score.hardGates) ? score.hardGates : [];
  const hardGateIds = hardGates.map((item) => item.id);
  if (new Set(hardGateIds).size !== hardGateIds.length) errors.push("hardGate ids must be unique");
  for (const id of REQUIRED_RELEASE_HARD_GATES) {
    const gate = hardGates.find((item) => item.id === id);
    if (!gate) {
      errors.push(`missing release hard gate: ${id}`);
      continue;
    }
    if (!Array.isArray(gate.evidence) || gate.evidence.length === 0) {
      errors.push(`${id}.evidence must not be empty`);
    }
    if (!gate.action?.trim()) errors.push(`${id}.action is empty`);
  }
  const allHardGatesPassed =
    REQUIRED_RELEASE_HARD_GATES.every(
      (id) => hardGates.find((item) => item.id === id)?.passed === true,
    ) && totalScore >= 90;
  if (score.hardGatePassed !== allHardGatesPassed) {
    errors.push("hardGatePassed does not match required hard gates and score >= 90");
  }

  errors.push(
    ...validateDecision(
      score.previewGate,
      "previewGate",
      ["pending", "continue", "revise", "split", "stop"],
    ),
  );
  errors.push(
    ...validateDecision(
      score as DecisionBlock,
      "qualityScore",
      ["pending", "revise", "split", "stop", "publish"],
    ),
  );

  if (options.requirePublish) {
    if (score.totalScore !== undefined && score.totalScore < 90) {
      errors.push(`release totalScore ${score.totalScore} < 90`);
    }
    if (score.scoreRecommendation !== "excellent") {
      errors.push("release scoreRecommendation must be excellent");
    }
    if (score.hardGatePassed !== true) errors.push("release hardGatePassed is not true");
    if (
      score.previewGate?.userDecision !== "continue" ||
      score.previewGate?.approvedByUser !== true
    ) {
      errors.push("release previewGate is not continue + approvedByUser=true");
    }
    if (score.userDecision !== "publish" || score.approvedByUser !== true) {
      errors.push("release userDecision is not publish + approvedByUser=true");
    }
  }

  return errors;
}
