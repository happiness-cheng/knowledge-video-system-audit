/**
 * V4 Contract Schema Validator
 *
 * 对 contracts/*.schema.json 进行实例验证。
 * 用法: npx tsx contracts/validate.ts <json-file> <schema-name>
 * 示例: npx tsx contracts/validate.ts fixtures/valid/complete-v4-beat-sheet.json beatSheet
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ─── 9 维度定义（与 preProductionGate.ts 一致）────────────

const REQUIRED_DIMENSIONS: Record<string, number> = {
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

const REQUIRED_ROLES = [
  "cold-viewer",
  "content-editor",
  "fact-evidence",
  "visual-audio-director",
] as const;

const VISUAL_MODES = [
  "visual-narrative",
  "visual-explanation",
  "editorial-design",
  "typographic-performance",
  "real-evidence",
] as const;

const AV_RELATIONS = [
  "reinforce",
  "complement",
  "contrast",
  "evidence",
  "typographic-performance",
] as const;

// ─── 验证结果 ────────────────────────────────────────────

interface ValidationResult {
  schema: string;
  file: string;
  passed: boolean;
  errors: string[];
}

// ─── 各 Schema 验证器 ───────────────────────────────────

function validateViewerStateChange(obj: unknown, label: string): string[] {
  const errors: string[] = [];
  if (!obj || typeof obj !== "object") {
    errors.push(`${label}: viewerStateChange is missing`);
    return errors;
  }
  const v = obj as Record<string, unknown>;
  if (typeof v.viewerStateBefore !== "string" || !v.viewerStateBefore.trim())
    errors.push(`${label}: viewerStateBefore must be non-empty string`);
  if (typeof v.viewerStateAfter !== "string" || !v.viewerStateAfter.trim())
    errors.push(`${label}: viewerStateAfter must be non-empty string`);
  if (typeof v.stateChangeReason !== "string" || !v.stateChangeReason.trim())
    errors.push(`${label}: stateChangeReason must be non-empty string`);
  return errors;
}

function validateContentMasterDraft(data: unknown): string[] {
  const errors: string[] = [];
  if (!data || typeof data !== "object")
    return ["contentMasterDraft is not an object"];
  const d = data as Record<string, unknown>;

  // 必填文本字段
  for (const key of [
    "coreQuestion",
    "viewerSituation",
    "openingTension",
    "personalCase",
    "draftBody",
    "finalTakeaway",
  ]) {
    if (typeof d[key] !== "string" || !(d[key] as string).trim())
      errors.push(`contentMasterDraft.${key} must be non-empty string`);
  }

  // viewerStateChange
  errors.push(
    ...validateViewerStateChange(d.viewerStateChange, "contentMasterDraft"),
  );

  // contentDesignRationale
  if (
    !d.contentDesignRationale ||
    typeof d.contentDesignRationale !== "object"
  ) {
    errors.push("contentMasterDraft.contentDesignRationale is missing");
  } else {
    const r = d.contentDesignRationale as Record<string, unknown>;
    for (const key of [
      "whyThisOpening",
      "whyThisCase",
      "whyThisEvidenceOrder",
      "whyThisRevealOrder",
      "whyThisBoundary",
    ]) {
      if (typeof r[key] !== "string" || !(r[key] as string).trim())
        errors.push(`contentDesignRationale.${key} must be non-empty string`);
    }
  }

  // visualHandoff (array)
  if (!Array.isArray(d.visualHandoff)) {
    errors.push("contentMasterDraft.visualHandoff must be an array");
  } else {
    for (const [i, item] of d.visualHandoff.entries()) {
      if (!item || typeof item !== "object") {
        errors.push(`visualHandoff[${i}] is not an object`);
        continue;
      }
      const h = item as Record<string, unknown>;
      // 字段应为字符串数组，不是布尔值
      for (const field of [
        "mustBeSeen",
        "canBeSpoken",
        "mustUseEvidence",
        "needsVisualProcess",
        "needsEmotionalExperience",
      ]) {
        if (h[field] !== undefined && !Array.isArray(h[field])) {
          errors.push(
            `visualHandoff[${i}].${field} must be array of strings, not ${typeof h[field]}`,
          );
        }
      }
      if (
        h.whyThisNeedsVisualSupport !== undefined &&
        typeof h.whyThisNeedsVisualSupport !== "string"
      ) {
        errors.push(
          `visualHandoff[${i}].whyThisNeedsVisualSupport must be string`,
        );
      }
    }
  }

  return errors;
}

function validateBeatSheet(data: unknown): string[] {
  const errors: string[] = [];
  if (!data || typeof data !== "object") return ["beatSheet is not an object"];
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.beatSheet))
    return ["beatSheet.beatSheet must be an array"];

  for (const [i, beat] of d.beatSheet.entries()) {
    if (!beat || typeof beat !== "object") {
      errors.push(`beatSheet[${i}] is not an object`);
      continue;
    }
    const b = beat as Record<string, unknown>;
    const label = `beatSheet[${i}]`;

    // 必填字段
    for (const key of [
      "beatId",
      "timeRange",
      "contentFunction",
      "summary",
      "viewerStateBefore",
      "viewerStateAfter",
      "informationDelta",
      "emotionalShift",
      "whyThisBeatExists",
    ]) {
      if (typeof b[key] !== "string" || !(b[key] as string).trim())
        errors.push(`${label}.${key} must be non-empty string`);
    }

    // 不应包含视觉字段
    for (const forbidden of [
      "visualFocus",
      "visualState",
      "transition",
      "assetStrategy",
    ]) {
      if (forbidden in b)
        errors.push(
          `${label} should NOT contain visual field "${forbidden}" — belongs in shotDirectorSpec`,
        );
    }
  }
  return errors;
}

function validateReviewDimensions(
  dimensions: unknown,
  reviewerId: string,
): string[] {
  const errors: string[] = [];
  if (!Array.isArray(dimensions)) {
    errors.push(`${reviewerId}: dimensions must be an array`);
    return errors;
  }

  const dimMap = new Map<string, unknown>();
  for (const [i, dim] of dimensions.entries()) {
    if (!dim || typeof dim !== "object") {
      errors.push(`${reviewerId}.dimensions[${i}] is not an object`);
      continue;
    }
    const d = dim as Record<string, unknown>;
    const id = d.id as string;
    if (!id) {
      errors.push(`${reviewerId}.dimensions[${i}].id is missing`);
      continue;
    }
    if (dimMap.has(id)) {
      errors.push(`${reviewerId}: duplicate dimension id "${id}"`);
    }
    dimMap.set(id, dim);

    const expectedMax = REQUIRED_DIMENSIONS[id];
    if (expectedMax === undefined) {
      errors.push(`${reviewerId}: unknown dimension "${id}"`);
      continue;
    }
    if (d.maxScore !== expectedMax) {
      errors.push(
        `${reviewerId}.${id}.maxScore must be ${expectedMax}, got ${d.maxScore}`,
      );
    }
    if (typeof d.score !== "number" || d.score < 0 || d.score > expectedMax) {
      errors.push(`${reviewerId}.${id}.score must be 0-${expectedMax}`);
    }
    if (!Array.isArray(d.evidence) || (d.evidence as unknown[]).length === 0) {
      errors.push(`${reviewerId}.${id}.evidence must be non-empty array`);
    }
    if (!Array.isArray(d.gaps)) {
      errors.push(`${reviewerId}.${id}.gaps must be array`);
    }
    if (typeof d.action !== "string" || !(d.action as string).trim()) {
      errors.push(`${reviewerId}.${id}.action must be non-empty string`);
    }
  }

  // 检查是否缺少必填维度
  for (const id of Object.keys(REQUIRED_DIMENSIONS)) {
    if (!dimMap.has(id)) {
      errors.push(`${reviewerId}: missing required dimension "${id}"`);
    }
  }

  return errors;
}

function validateFourReviewGate(data: unknown): string[] {
  const errors: string[] = [];
  if (!data || typeof data !== "object")
    return ["preProductionReview is not an object"];
  const d = data as Record<string, unknown>;

  if (d.contractVersion !== "4.0")
    errors.push(`contractVersion must be "4.0", got "${d.contractVersion}"`);
  if (!["quick", "standard", "deep"].includes(d.mode as string))
    errors.push(`mode must be quick/standard/deep`);

  // Reviews
  if (!Array.isArray(d.reviews)) {
    errors.push("reviews must be an array");
    return errors;
  }

  const reviews = d.reviews as Record<string, unknown>[];
  const reviewerIds = new Set<string>();
  const roles = new Set<string>();
  const systems = new Set<string>();
  const scores: number[] = [];

  for (const [i, review] of reviews.entries()) {
    const label = `reviews[${i}]`;

    if (!review.reviewerId || typeof review.reviewerId !== "string") {
      errors.push(`${label}.reviewerId is missing`);
    } else {
      if (reviewerIds.has(review.reviewerId))
        errors.push(`duplicate reviewerId: ${review.reviewerId}`);
      reviewerIds.add(review.reviewerId);
    }

    if (
      !REQUIRED_ROLES.includes(review.role as (typeof REQUIRED_ROLES)[number])
    ) {
      errors.push(
        `${label}.role must be one of ${REQUIRED_ROLES.join(", ")}, got "${review.role}"`,
      );
    } else {
      if (roles.has(review.role as string))
        errors.push(`duplicate role: ${review.role}`);
      roles.add(review.role as string);
    }

    if (typeof review.reviewerSystem === "string")
      systems.add(review.reviewerSystem);

    if (review.independent !== true)
      errors.push(`${label}.independent must be true`);

    if (typeof review.score === "number") scores.push(review.score);

    // 维度验证
    errors.push(
      ...validateReviewDimensions(
        review.dimensions,
        (review.reviewerId as string) || `review[${i}]`,
      ),
    );

    // 分数一致性
    if (Array.isArray(review.dimensions)) {
      const dimSum = (review.dimensions as Record<string, unknown>[]).reduce(
        (sum, dim) => sum + ((dim.score as number) || 0),
        0,
      );
      if (
        typeof review.score === "number" &&
        Math.abs(review.score - dimSum) > 0.01
      ) {
        errors.push(
          `${label}.score=${review.score} does not equal dimension sum=${dimSum}`,
        );
      }
    }

    // hardVetoes
    if (!Array.isArray(review.hardVetoes))
      errors.push(`${label}.hardVetoes must be array`);
    else if ((review.hardVetoes as unknown[]).length > 0)
      errors.push(`${label} has hard vetoes: ${review.hardVetoes}`);

    // recommendation
    if (review.recommendation !== "pass")
      errors.push(`${label}.recommendation must be "pass"`);
  }

  // 角色唯一性
  if (roles.size !== reviews.length)
    errors.push(`expected ${reviews.length} unique roles, got ${roles.size}`);

  // 至少两个 reviewerSystem
  if (systems.size < 2)
    errors.push(
      `at least 2 distinct reviewerSystem required, got ${systems.size}`,
    );

  // Aggregate
  if (d.consensus && typeof d.consensus === "object") {
    const c = d.consensus as Record<string, unknown>;
    const mean = scores.reduce((s, v) => s + v, 0) / (scores.length || 1);
    if (typeof c.meanScore === "number" && Math.abs(c.meanScore - mean) > 0.01)
      errors.push(
        `consensus.meanScore=${c.meanScore} does not match calculated=${mean.toFixed(2)}`,
      );
  }

  return errors;
}

function validateContentSnapshot(data: unknown): string[] {
  const errors: string[] = [];
  if (!data || typeof data !== "object")
    return ["approvedContentSnapshot is not an object"];
  const d = data as Record<string, unknown>;

  if (d.contractVersion !== "4.0") errors.push(`contractVersion must be "4.0"`);

  if (
    typeof d.contentSnapshotId !== "string" ||
    !/^CS-\d{8}-[a-f0-9]{4}$/.test(d.contentSnapshotId)
  )
    errors.push("contentSnapshotId must match CS-YYYYMMDD-xxxx pattern");

  // sources 不得包含 shotDirectorSpec / coverBrief / visualDirectionSpec
  if (d.sources && typeof d.sources === "object") {
    const s = d.sources as Record<string, unknown>;
    for (const forbidden of [
      "shotDirectorSpec",
      "coverBrief",
      "visualDirectionSpec",
    ]) {
      if (forbidden in s)
        errors.push(`sources must NOT contain "${forbidden}"`);
    }
    // 应包含内容产物
    for (const required of ["contentMasterDraft", "beatSheet"]) {
      if (!(required in s)) errors.push(`sources should contain "${required}"`);
    }
  }

  return errors;
}

function validateShotDirectorSpec(data: unknown): string[] {
  const errors: string[] = [];
  if (!data || typeof data !== "object")
    return ["shotDirectorSpec is not an object"];
  const d = data as Record<string, unknown>;

  if (d.contractVersion !== "4.0") errors.push(`contractVersion must be "4.0"`);

  // 必填字段
  for (const key of [
    "shotId",
    "beatId",
    "contentSourceRef",
    "spokenClause",
    "explanationGoal",
  ]) {
    if (typeof d[key] !== "string" || !(d[key] as string).trim())
      errors.push(`shotDirectorSpec.${key} must be non-empty string`);
  }

  // V4 字段
  for (const key of [
    "viewerStateBefore",
    "viewerStateAfter",
    "designRationale",
    "lockedMeaning",
  ]) {
    if (typeof d[key] !== "string" || !(d[key] as string).trim())
      errors.push(`shotDirectorSpec.${key} must be non-empty string`);
  }

  // 视觉模式枚举
  if (
    !VISUAL_MODES.includes(d.primaryVisualMode as (typeof VISUAL_MODES)[number])
  ) {
    errors.push(`primaryVisualMode must be one of ${VISUAL_MODES.join(", ")}`);
  }

  // 声画关系枚举
  if (
    !AV_RELATIONS.includes(
      d.audioVisualRelation as (typeof AV_RELATIONS)[number],
    )
  ) {
    errors.push(
      `audioVisualRelation must be one of ${AV_RELATIONS.join(", ")}`,
    );
  }

  // 三类贡献
  for (const key of [
    "explanationContribution",
    "comprehensionContribution",
    "attentionContribution",
  ]) {
    if (typeof d[key] !== "string" || !(d[key] as string).trim())
      errors.push(`shotDirectorSpec.${key} must be non-empty string`);
  }

  return errors;
}

// ─── 主入口 ──────────────────────────────────────────────

const SCHEMA_VALIDATORS: Record<string, (data: unknown) => string[]> = {
  contentMasterDraft: validateContentMasterDraft,
  beatSheet: validateBeatSheet,
  preProductionReview: validateFourReviewGate,
  approvedContentSnapshot: validateContentSnapshot,
  shotDirectorSpec: validateShotDirectorSpec,
};

function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: npx tsx validate.ts <json-file> <schema-name>");
    console.error(
      `Available schemas: ${Object.keys(SCHEMA_VALIDATORS).join(", ")}`,
    );
    process.exit(1);
  }

  const [jsonFile, schemaName] = args;
  const validator = SCHEMA_VALIDATORS[schemaName];
  if (!validator) {
    console.error(`Unknown schema: ${schemaName}`);
    console.error(
      `Available schemas: ${Object.keys(SCHEMA_VALIDATORS).join(", ")}`,
    );
    process.exit(1);
  }

  let data: unknown;
  try {
    data = JSON.parse(fs.readFileSync(jsonFile, "utf-8"));
  } catch (e) {
    console.error(`Cannot parse JSON: ${e}`);
    process.exit(1);
  }

  const errors = validator(data);
  const result: ValidationResult = {
    schema: schemaName,
    file: path.basename(jsonFile),
    passed: errors.length === 0,
    errors,
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(errors.length === 0 ? 0 : 1);
}

main();
