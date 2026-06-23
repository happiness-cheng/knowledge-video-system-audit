#!/usr/bin/env npx tsx
/**
 * videoSpec 结构验证脚本
 *
 * 检查 videoSpec.json 是否符合 Knowledge Lab P1 规范：
 * 1. scene type 必须在 22 种允许类型内
 * 2. 拦截未解锁 locked candidate 类型（当前无）
 * 3. visualRole 必须在允许列表内
 * 4. Knowledge Lab P1 组合规则（visualRole → type）
 * 5. 禁止 PromptTemplateCard（仅为内部组件）
 * 6. 禁止未实现字段（highlightBox, zoomFrame, freeArrowAnnotation, characterLayer）
 * 7. 静态展示场景占比不超过 40%
 * 8. 不超过 2 个连续静态展示场景
 * 9. 超过 12s 的场景必须有 progressive-reveal / highlight-current 动画或内部时序标注
 *
 * 用法：npx tsx src/video-system/scripts/validate-video-spec.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";
import {
  productionSceneTypes,
  productionSemanticPatterns,
  semanticPatternHostTypes,
} from "../visual/capabilityRegistry";

// ─── 路径 ─────────────────────────────────────────
const VIDEO_SPEC_PATH = path.resolve(__dirname, "../data/videoSpec.json");

// ─── 常量 ─────────────────────────────────────────

const ALLOWED_TYPES = new Set(productionSceneTypes);

const LOCKED_CANDIDATE_TYPES = new Set<string>();

const ALLOWED_VISUAL_ROLES = new Set([
  "hook",
  "conflict",
  "story",
  "evidence",
  "insight",
  "method",
  "example",
  "template",
  "recap",
  "cta",
]);

/** Knowledge Lab P1: visualRole → 必须匹配的 type */
const P1_ROLE_TYPE_MAP: Record<string, Set<string>> = {
  hook: new Set(["cover"]),
  conflict: new Set(["two-column"]),
  evidence: new Set(["comparison", "image-hero"]),
  insight: new Set(["big-quote"]),
  recap: new Set(["big-quote"]),
  template: new Set(["todo-checklist"]),
};

const STATIC_DISPLAY_TYPES = new Set([
  "title-subtitle",
  "big-quote",
  "bullets",
]);

const BANNED_FIELDS = [
  "highlightBox",
  "zoomFrame",
  "freeArrowAnnotation",
  "characterLayer",
];

const PROGRESSIVE_ANIMATIONS = new Set([
  "progressive-reveal",
  "highlight-current",
]);

const ASSET_LAYOUT_ALLOWED_TYPES = new Set(["comparison", "two-column"]);

const ALLOWED_SEMANTIC_PATTERNS = new Set(productionSemanticPatterns);

const SEMANTIC_PATTERN_ALLOWED_TYPES: Record<string, Set<string>> =
  Object.entries(semanticPatternHostTypes).reduce<Record<string, Set<string>>>(
    (acc, [pattern, hostTypes]) => {
      acc[pattern] = new Set(hostTypes);
      return acc;
    },
    {},
  );

const LAB_VISUAL_ROLES = new Set([
  "hook",
  "conflict",
  "evidence",
  "insight",
  "recap",
  "template",
]);

const LAB_THEMES = new Set(["xhs-white-editorial", "knowledge-blueprint"]);

// ─── 类型 ─────────────────────────────────────────

interface HighlightBox {
  top?: number;
  left?: number;
  width?: number;
  height?: number;
}

interface AssetLayoutSide {
  highlight?: HighlightBox;
  [key: string]: unknown;
}

interface AssetLayout {
  left?: AssetLayoutSide;
  right?: AssetLayoutSide;
  [key: string]: unknown;
}

interface VideoScene {
  id: string;
  type: string;
  animation?: string;
  semanticPattern?: string;
  visualRole?: string;
  durationEstimate?: number;
  assetLayout?: AssetLayout;
  lines?: Array<{ text?: unknown; annotation?: unknown }>;
  changes?: Array<{ kind?: unknown; text?: unknown; note?: unknown }>;
  command?: unknown;
  result?: { status?: unknown; label?: unknown; detail?: unknown };
  assetId?: unknown;
  imagePath?: unknown;
  imageAlt?: unknown;
  imageFit?: unknown;
  objectPosition?: unknown;
  caption?: unknown;
  points?: unknown;
  callouts?: Array<{
    label?: unknown;
    x?: unknown;
    y?: unknown;
    tone?: unknown;
  }>;
  annotations?: Array<{
    kind?: unknown;
    label?: unknown;
    x?: unknown;
    y?: unknown;
    width?: unknown;
    height?: unknown;
    tone?: unknown;
    labelX?: unknown;
    labelY?: unknown;
    zoom?: unknown;
  }>;
  lanes?: Array<{
    label?: unknown;
    tasks?: Array<{
      label?: unknown;
      start?: unknown;
      end?: unknown;
      status?: unknown;
      note?: unknown;
    }>;
  }>;
  markers?: Array<{
    at?: unknown;
    label?: unknown;
    tone?: unknown;
  }>;
  focusSequence?: unknown;
  [key: string]: unknown;
}

interface VideoSpec {
  meta: { title: string; [key: string]: unknown };
  scenes: VideoScene[];
}

interface CheckResult {
  level: "error" | "warning";
  rule: string;
  message: string;
  scenes?: string[];
}

// ─── 检查函数 ─────────────────────────────────────

function checkTypeAllowed(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  const bad = scenes.filter((s) => !ALLOWED_TYPES.has(s.type));

  if (bad.length > 0) {
    results.push({
      level: "error",
      rule: "invalid-type",
      message: `${bad.length} 个 scene 使用了不在允许列表中的 type`,
      scenes: bad.map((s) => `${s.id}(${s.type})`),
    });
  }

  return results;
}

function checkBannedTypes(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  const bad = scenes.filter((s) => LOCKED_CANDIDATE_TYPES.has(s.type));

  if (bad.length > 0) {
    results.push({
      level: "error",
      rule: "locked-candidate-type",
      message: `${bad.length} 个 scene 使用了尚未解锁的 locked candidate type`,
      scenes: bad.map((s) => `${s.id}(${s.type})`),
    });
  }

  return results;
}

function checkVisualRole(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  const bad = scenes.filter(
    (s) => s.visualRole && !ALLOWED_VISUAL_ROLES.has(s.visualRole),
  );

  if (bad.length > 0) {
    results.push({
      level: "error",
      rule: "invalid-visualRole",
      message: `${bad.length} 个 scene 的 visualRole 不在允许列表中`,
      scenes: bad.map((s) => `${s.id}(${s.visualRole})`),
    });
  }

  return results;
}

function checkP1Combinations(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  const violations: string[] = [];

  for (const s of scenes) {
    if (!s.visualRole) continue;
    const allowedTypes = P1_ROLE_TYPE_MAP[s.visualRole];
    if (allowedTypes && !allowedTypes.has(s.type)) {
      violations.push(
        `${s.id}: visualRole=${s.visualRole} 要求 type=${[...allowedTypes].join("/")}, 实际=${s.type}`,
      );
    }
  }

  if (violations.length > 0) {
    results.push({
      level: "error",
      rule: "p1-role-type-mismatch",
      message: `${violations.length} 个 scene 违反 Knowledge Lab P1 组合规则`,
      scenes: violations,
    });
  }

  return results;
}

function checkPromptTemplateCard(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  const bad = scenes.filter((s) => s.type === "PromptTemplateCard");

  if (bad.length > 0) {
    results.push({
      level: "error",
      rule: "prompt-template-card",
      message: `PromptTemplateCard 不是 scene type，仅为内部组件`,
      scenes: bad.map((s) => s.id),
    });
  }

  return results;
}

function checkBannedFields(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  const violations: string[] = [];

  for (const s of scenes) {
    for (const field of BANNED_FIELDS) {
      if (field in s) {
        violations.push(`${s.id}: 包含未实现字段 ${field}`);
      }
    }
  }

  if (violations.length > 0) {
    results.push({
      level: "error",
      rule: "banned-field",
      message: `${violations.length} 个 scene 包含未实现字段`,
      scenes: violations,
    });
  }

  return results;
}

function checkCodeSceneContract(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  const violations: string[] = [];

  for (const s of scenes) {
    if (s.type !== "code") continue;

    if (!Array.isArray(s.lines) || s.lines.length === 0) {
      violations.push(`${s.id}: code scene 必须提供 1-10 行 lines`);
      continue;
    }

    if (s.lines.length > 10) {
      violations.push(`${s.id}: code scene lines=${s.lines.length}，上限 10 行`);
    }

    for (const [index, line] of s.lines.entries()) {
      if (!line || typeof line.text !== "string" || line.text.trim() === "") {
        violations.push(`${s.id}.lines[${index}]: text 必须是非空字符串`);
        continue;
      }
      if (line.text.length > 84) {
        violations.push(
          `${s.id}.lines[${index}]: 单行 ${line.text.length} 字符，超过 84 字符上限`,
        );
      }
      if (
        line.annotation !== undefined &&
        typeof line.annotation !== "string"
      ) {
        violations.push(`${s.id}.lines[${index}].annotation: 必须是字符串`);
      }
    }

    if (s.focusSequence !== undefined) {
      if (!Array.isArray(s.focusSequence)) {
        violations.push(`${s.id}.focusSequence: 必须是数字数组`);
      } else {
        for (const [index, value] of s.focusSequence.entries()) {
          if (
            !Number.isInteger(value) ||
            value < 0 ||
            value >= s.lines.length
          ) {
            violations.push(
              `${s.id}.focusSequence[${index}]=${String(value)}，必须指向 lines 的有效下标`,
            );
          }
        }
      }
    }
  }

  if (violations.length > 0) {
    results.push({
      level: "error",
      rule: "invalid-code-scene",
      message: `${violations.length} 个 code scene 字段不符合已解锁能力边界`,
      scenes: violations,
    });
  }

  return results;
}

function checkDiffSceneContract(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  const violations: string[] = [];

  for (const s of scenes) {
    if (s.type !== "diff") continue;

    if (typeof s.beforeTitle !== "string" || s.beforeTitle.trim() === "") {
      violations.push(`${s.id}: diff scene 必须提供 beforeTitle`);
    }

    if (typeof s.afterTitle !== "string" || s.afterTitle.trim() === "") {
      violations.push(`${s.id}: diff scene 必须提供 afterTitle`);
    }

    if (!Array.isArray(s.changes) || s.changes.length < 2) {
      violations.push(`${s.id}: diff scene 必须提供 2-8 条 changes`);
      continue;
    }

    if (s.changes.length > 8) {
      violations.push(`${s.id}: diff scene changes=${s.changes.length}，上限 8 条`);
    }

    let removedCount = 0;
    let addedCount = 0;

    for (const [index, change] of s.changes.entries()) {
      if (
        !change ||
        (change.kind !== "removed" && change.kind !== "added")
      ) {
        violations.push(
          `${s.id}.changes[${index}].kind: 必须是 removed 或 added`,
        );
      }

      if (change?.kind === "removed") removedCount++;
      if (change?.kind === "added") addedCount++;

      if (
        !change ||
        typeof change.text !== "string" ||
        change.text.trim() === ""
      ) {
        violations.push(`${s.id}.changes[${index}].text: 必须是非空字符串`);
        continue;
      }

      if (change.text.length > 48) {
        violations.push(
          `${s.id}.changes[${index}]: 单行 ${change.text.length} 字符，超过 48 字符上限`,
        );
      }

      if (change.note !== undefined && typeof change.note !== "string") {
        violations.push(`${s.id}.changes[${index}].note: 必须是字符串`);
      }
    }

    if (removedCount === 0 || addedCount === 0) {
      violations.push(`${s.id}: diff scene 至少需要 1 条 removed 和 1 条 added`);
    }

    if (s.focusSequence !== undefined) {
      if (!Array.isArray(s.focusSequence)) {
        violations.push(`${s.id}.focusSequence: 必须是数字数组`);
      } else {
        for (const [index, value] of s.focusSequence.entries()) {
          if (
            !Number.isInteger(value) ||
            value < 0 ||
            value >= s.changes.length
          ) {
            violations.push(
              `${s.id}.focusSequence[${index}]=${String(value)}，必须指向 changes 的有效下标`,
            );
          }
        }
      }
    }
  }

  if (violations.length > 0) {
    results.push({
      level: "error",
      rule: "invalid-diff-scene",
      message: `${violations.length} 个 diff scene 字段不符合已解锁能力边界`,
      scenes: violations,
    });
  }

  return results;
}

function checkTerminalSceneContract(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  const violations: string[] = [];
  const allowedKinds = new Set(["running", "success", "warning", "error", "info"]);
  const allowedStatuses = new Set(["success", "warning", "error", "info"]);
  const sensitivePattern =
    /(sk-[a-z0-9_-]{10,}|api[_-]?key|secret|password|token\s*[:=])/i;

  for (const s of scenes) {
    if (s.type !== "terminal") continue;

    if (typeof s.command !== "string" || s.command.trim() === "") {
      violations.push(`${s.id}: terminal scene 必须提供 command`);
    } else {
      if (s.command.length > 72) {
        violations.push(`${s.id}.command: ${s.command.length} 字符，超过 72 字符上限`);
      }
      if (sensitivePattern.test(s.command)) {
        violations.push(`${s.id}.command: 疑似包含敏感字段，不能写入终端画面`);
      }
    }

    if (!Array.isArray(s.lines) || s.lines.length === 0) {
      violations.push(`${s.id}: terminal scene 必须提供 1-8 行 lines`);
      continue;
    }

    if (s.lines.length > 8) {
      violations.push(`${s.id}: terminal scene lines=${s.lines.length}，上限 8 行`);
    }

    for (const [index, line] of s.lines.entries()) {
      const kind = (line as { kind?: unknown }).kind;
      if (typeof kind !== "string" || !allowedKinds.has(kind)) {
        violations.push(
          `${s.id}.lines[${index}].kind: 必须是 running/success/warning/error/info`,
        );
      }

      if (!line || typeof line.text !== "string" || line.text.trim() === "") {
        violations.push(`${s.id}.lines[${index}].text: 必须是非空字符串`);
        continue;
      }

      if (line.text.length > 58) {
        violations.push(
          `${s.id}.lines[${index}]: 单行 ${line.text.length} 字符，超过 58 字符上限`,
        );
      }

      if (sensitivePattern.test(line.text)) {
        violations.push(`${s.id}.lines[${index}]: 疑似包含敏感字段，不能写入终端画面`);
      }
    }

    if (!s.result || typeof s.result !== "object") {
      violations.push(`${s.id}: terminal scene 必须提供 result`);
    } else {
      if (
        typeof s.result.status !== "string" ||
        !allowedStatuses.has(s.result.status)
      ) {
        violations.push(`${s.id}.result.status: 必须是 success/warning/error/info`);
      }
      if (
        typeof s.result.label !== "string" ||
        s.result.label.trim() === ""
      ) {
        violations.push(`${s.id}.result.label: 必须是非空字符串`);
      } else if (s.result.label.length > 18) {
        violations.push(`${s.id}.result.label: ${s.result.label.length} 字符，超过 18 字符上限`);
      }
      if (
        s.result.detail !== undefined &&
        typeof s.result.detail !== "string"
      ) {
        violations.push(`${s.id}.result.detail: 必须是字符串`);
      } else if (
        typeof s.result.detail === "string" &&
        s.result.detail.length > 40
      ) {
        violations.push(`${s.id}.result.detail: ${s.result.detail.length} 字符，超过 40 字符上限`);
      }
    }

    if (s.focusSequence !== undefined) {
      if (!Array.isArray(s.focusSequence)) {
        violations.push(`${s.id}.focusSequence: 必须是数字数组`);
      } else {
        for (const [index, value] of s.focusSequence.entries()) {
          if (
            !Number.isInteger(value) ||
            value < 0 ||
            value >= s.lines.length
          ) {
            violations.push(
              `${s.id}.focusSequence[${index}]=${String(value)}，必须指向 lines 的有效下标`,
            );
          }
        }
      }
    }
  }

  if (violations.length > 0) {
    results.push({
      level: "error",
      rule: "invalid-terminal-scene",
      message: `${violations.length} 个 terminal scene 字段不符合已解锁能力边界`,
      scenes: violations,
    });
  }

  return results;
}

function checkImageHeroSceneContract(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  const violations: string[] = [];
  const allowedFits = new Set(["contain", "cover"]);
  const allowedTones = new Set(["accent", "success", "warning", "danger"]);
  const allowedAnnotationKinds = new Set(["box", "arrow", "magnify"]);

  for (const s of scenes) {
    if (s.type !== "image-hero") continue;

    const hasAssetId =
      typeof s.assetId === "string" && s.assetId.trim().length > 0;
    const hasImagePath =
      typeof s.imagePath === "string" && s.imagePath.trim().length > 0;

    if (hasAssetId === hasImagePath) {
      violations.push(`${s.id}: image-hero 必须且只能提供 assetId 或 imagePath 之一`);
    }

    if (hasAssetId && (s.assetId as string).length > 80) {
      violations.push(`${s.id}.assetId: 超过 80 字符上限`);
    }

    if (hasImagePath) {
      const imagePath = s.imagePath as string;
      if (imagePath.length > 140) {
        violations.push(`${s.id}.imagePath: 超过 140 字符上限`);
      }
      if (/^[a-z]+:\/\//i.test(imagePath)) {
        violations.push(`${s.id}.imagePath: 当前只允许 public 内相对路径，不允许远程 URL`);
      }
      if (path.isAbsolute(imagePath)) {
        violations.push(`${s.id}.imagePath: 当前只允许 public 内相对路径，不允许本地绝对路径`);
      }
    }

    if (s.imageFit !== undefined) {
      if (typeof s.imageFit !== "string" || !allowedFits.has(s.imageFit)) {
        violations.push(`${s.id}.imageFit: 必须是 contain 或 cover`);
      }
    }

    if (
      s.objectPosition !== undefined &&
      typeof s.objectPosition !== "string"
    ) {
      violations.push(`${s.id}.objectPosition: 必须是字符串`);
    }

    if (s.imageAlt !== undefined && typeof s.imageAlt !== "string") {
      violations.push(`${s.id}.imageAlt: 必须是字符串`);
    } else if (typeof s.imageAlt === "string" && s.imageAlt.length > 42) {
      violations.push(`${s.id}.imageAlt: ${s.imageAlt.length} 字，超过 42 字上限`);
    }

    if (s.caption !== undefined && typeof s.caption !== "string") {
      violations.push(`${s.id}.caption: 必须是字符串`);
    } else if (typeof s.caption === "string" && s.caption.length > 36) {
      violations.push(`${s.id}.caption: ${s.caption.length} 字，超过 36 字上限`);
    }

    if (s.points !== undefined) {
      if (!Array.isArray(s.points)) {
        violations.push(`${s.id}.points: 必须是字符串数组`);
      } else {
        if (s.points.length > 3) {
          violations.push(`${s.id}.points: ${s.points.length} 条，超过 3 条上限`);
        }
        for (const [index, point] of s.points.entries()) {
          if (typeof point !== "string" || point.trim() === "") {
            violations.push(`${s.id}.points[${index}]: 必须是非空字符串`);
            continue;
          }
          if (point.length > 24) {
            violations.push(`${s.id}.points[${index}]: ${point.length} 字，超过 24 字上限`);
          }
        }
      }
    }

    if (s.callouts !== undefined) {
      if (!Array.isArray(s.callouts)) {
        violations.push(`${s.id}.callouts: 必须是标注数组`);
      } else {
        if (s.callouts.length > 3) {
          violations.push(`${s.id}.callouts: ${s.callouts.length} 个，超过 3 个上限`);
        }
        for (const [index, callout] of s.callouts.entries()) {
          if (
            !callout ||
            typeof callout.label !== "string" ||
            callout.label.trim() === ""
          ) {
            violations.push(`${s.id}.callouts[${index}].label: 必须是非空字符串`);
          } else if (callout.label.length > 18) {
            violations.push(
              `${s.id}.callouts[${index}].label: ${callout.label.length} 字，超过 18 字上限`,
            );
          }

          for (const key of ["x", "y"] as const) {
            const value = callout?.[key];
            if (typeof value !== "number" || value < 0 || value > 100) {
              violations.push(`${s.id}.callouts[${index}].${key}: 必须是 0-100 的数字`);
            }
          }

          if (
            callout?.tone !== undefined &&
            (typeof callout.tone !== "string" || !allowedTones.has(callout.tone))
          ) {
            violations.push(
              `${s.id}.callouts[${index}].tone: 必须是 accent/success/warning/danger`,
            );
          }
        }
      }
    }

    if (s.annotations !== undefined) {
      if (!Array.isArray(s.annotations)) {
        violations.push(`${s.id}.annotations: 必须是标注数组`);
      } else {
        if (s.annotations.length > 3) {
          violations.push(`${s.id}.annotations: ${s.annotations.length} 个，超过 3 个上限`);
        }
        for (const [index, annotation] of s.annotations.entries()) {
          const annotationPath = `${s.id}.annotations[${index}]`;
          if (
            !annotation ||
            typeof annotation.label !== "string" ||
            annotation.label.trim() === ""
          ) {
            violations.push(`${annotationPath}.label: 必须是非空字符串`);
          } else if (annotation.label.length > 18) {
            violations.push(
              `${annotationPath}.label: ${annotation.label.length} 字，超过 18 字上限`,
            );
          }

          if (
            annotation?.kind !== undefined &&
            (typeof annotation.kind !== "string" ||
              !allowedAnnotationKinds.has(annotation.kind))
          ) {
            violations.push(`${annotationPath}.kind: 必须是 box/arrow/magnify`);
          }

          for (const key of ["x", "y", "width", "height"] as const) {
            const value = annotation?.[key];
            if (typeof value !== "number" || value < 0 || value > 100) {
              violations.push(`${annotationPath}.${key}: 必须是 0-100 的数字`);
            }
          }

          for (const key of ["labelX", "labelY"] as const) {
            const value = annotation?.[key];
            if (
              value !== undefined &&
              (typeof value !== "number" || value < 0 || value > 100)
            ) {
              violations.push(`${annotationPath}.${key}: 必须是 0-100 的数字`);
            }
          }

          if (
            annotation?.tone !== undefined &&
            (typeof annotation.tone !== "string" ||
              !allowedTones.has(annotation.tone))
          ) {
            violations.push(`${annotationPath}.tone: 必须是 accent/success/warning/danger`);
          }

          if (
            annotation?.zoom !== undefined &&
            (typeof annotation.zoom !== "number" ||
              annotation.zoom < 1.2 ||
              annotation.zoom > 4)
          ) {
            violations.push(`${annotationPath}.zoom: 必须是 1.2-4 的数字`);
          }
        }
      }
    }

    if (s.focusSequence !== undefined) {
      const focusMax = Math.max(
        Array.isArray(s.callouts) ? s.callouts.length : 0,
        Array.isArray(s.points) ? s.points.length : 0,
        Array.isArray(s.annotations) ? s.annotations.length : 0,
      );
      if (!Array.isArray(s.focusSequence)) {
        violations.push(`${s.id}.focusSequence: 必须是数字数组`);
      } else {
        for (const [index, value] of s.focusSequence.entries()) {
          if (!Number.isInteger(value) || value < 0 || value >= focusMax) {
            violations.push(
              `${s.id}.focusSequence[${index}]=${String(value)}，必须指向 callouts/points 的有效下标`,
            );
          }
        }
      }
    }
  }

  if (violations.length > 0) {
    results.push({
      level: "error",
      rule: "invalid-image-hero-scene",
      message: `${violations.length} 个 image-hero scene 字段不符合已解锁能力边界`,
      scenes: violations,
    });
  }

  return results;
}

function checkGanttSceneContract(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  const violations: string[] = [];
  const allowedStatuses = new Set(["done", "active", "blocked", "waiting"]);
  const allowedTones = new Set(["accent", "success", "warning", "danger"]);

  for (const s of scenes) {
    if (s.type !== "gantt") continue;

    if (!Array.isArray(s.lanes) || s.lanes.length === 0) {
      violations.push(`${s.id}: gantt scene 必须提供 1-5 条 lanes`);
      continue;
    }

    if (s.lanes.length > 5) {
      violations.push(`${s.id}.lanes: ${s.lanes.length} 条，超过 5 条上限`);
    }

    let totalTasks = 0;

    for (const [laneIndex, lane] of s.lanes.entries()) {
      if (
        !lane ||
        typeof lane.label !== "string" ||
        lane.label.trim() === ""
      ) {
        violations.push(`${s.id}.lanes[${laneIndex}].label: 必须是非空字符串`);
      } else if (lane.label.length > 8) {
        violations.push(`${s.id}.lanes[${laneIndex}].label: ${lane.label.length} 字，超过 8 字上限`);
      }

      if (!Array.isArray(lane?.tasks) || lane.tasks.length === 0) {
        violations.push(`${s.id}.lanes[${laneIndex}].tasks: 必须提供 1-4 个 task`);
        continue;
      }

      if (lane.tasks.length > 4) {
        violations.push(`${s.id}.lanes[${laneIndex}].tasks: ${lane.tasks.length} 个，超过 4 个上限`);
      }

      totalTasks += lane.tasks.length;

      for (const [taskIndex, task] of lane.tasks.entries()) {
        const taskPath = `${s.id}.lanes[${laneIndex}].tasks[${taskIndex}]`;

        if (
          !task ||
          typeof task.label !== "string" ||
          task.label.trim() === ""
        ) {
          violations.push(`${taskPath}.label: 必须是非空字符串`);
        } else if (task.label.length > 10) {
          violations.push(`${taskPath}.label: ${task.label.length} 字，超过 10 字上限`);
        }

        if (typeof task.start !== "number" || task.start < 0 || task.start > 99) {
          violations.push(`${taskPath}.start: 必须是 0-99 的数字`);
        }

        if (typeof task.end !== "number" || task.end <= 0 || task.end > 100) {
          violations.push(`${taskPath}.end: 必须是 1-100 的数字`);
        }

        if (
          typeof task.start === "number" &&
          typeof task.end === "number" &&
          task.end <= task.start
        ) {
          violations.push(`${taskPath}: end 必须大于 start`);
        }

        if (
          typeof task.status !== "string" ||
          !allowedStatuses.has(task.status)
        ) {
          violations.push(`${taskPath}.status: 必须是 done/active/blocked/waiting`);
        }

        if (task.note !== undefined && typeof task.note !== "string") {
          violations.push(`${taskPath}.note: 必须是字符串`);
        } else if (typeof task.note === "string" && task.note.length > 24) {
          violations.push(`${taskPath}.note: ${task.note.length} 字，超过 24 字上限`);
        }
      }
    }

    if (totalTasks > 8) {
      violations.push(`${s.id}: gantt task 总数 ${totalTasks}，超过 8 个上限`);
    }

    if (s.markers !== undefined) {
      if (!Array.isArray(s.markers)) {
        violations.push(`${s.id}.markers: 必须是数组`);
      } else {
        if (s.markers.length > 4) {
          violations.push(`${s.id}.markers: ${s.markers.length} 个，超过 4 个上限`);
        }
        for (const [index, marker] of s.markers.entries()) {
          if (
            !marker ||
            typeof marker.label !== "string" ||
            marker.label.trim() === ""
          ) {
            violations.push(`${s.id}.markers[${index}].label: 必须是非空字符串`);
          } else if (marker.label.length > 8) {
            violations.push(`${s.id}.markers[${index}].label: ${marker.label.length} 字，超过 8 字上限`);
          }

          if (typeof marker?.at !== "number" || marker.at < 0 || marker.at > 100) {
            violations.push(`${s.id}.markers[${index}].at: 必须是 0-100 的数字`);
          }

          if (
            marker?.tone !== undefined &&
            (typeof marker.tone !== "string" || !allowedTones.has(marker.tone))
          ) {
            violations.push(
              `${s.id}.markers[${index}].tone: 必须是 accent/success/warning/danger`,
            );
          }
        }
      }
    }

    if (s.focusSequence !== undefined) {
      if (!Array.isArray(s.focusSequence)) {
        violations.push(`${s.id}.focusSequence: 必须是数字数组`);
      } else {
        for (const [index, value] of s.focusSequence.entries()) {
          if (!Number.isInteger(value) || value < 0 || value >= totalTasks) {
            violations.push(
              `${s.id}.focusSequence[${index}]=${String(value)}，必须指向 task 的有效下标`,
            );
          }
        }
      }
    }
  }

  if (violations.length > 0) {
    results.push({
      level: "error",
      rule: "invalid-gantt-scene",
      message: `${violations.length} 个 gantt scene 字段不符合已解锁能力边界`,
      scenes: violations,
    });
  }

  return results;
}

function checkStaticRatio(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  const staticCount = scenes.filter((s) =>
    STATIC_DISPLAY_TYPES.has(s.type),
  ).length;
  const ratio = staticCount / scenes.length;

  if (ratio > 0.4) {
    results.push({
      level: "warning",
      rule: "static-ratio-exceeded",
      message: `静态展示场景占比 ${Math.round(ratio * 100)}%（${staticCount}/${scenes.length}），超过 40% 上限`,
    });
  }

  return results;
}

function checkConsecutiveStatic(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  let count = 1;
  let startIdx = 0;

  for (let i = 1; i < scenes.length; i++) {
    if (
      STATIC_DISPLAY_TYPES.has(scenes[i].type) &&
      STATIC_DISPLAY_TYPES.has(scenes[i - 1].type)
    ) {
      count++;
    } else {
      if (count > 2) {
        const sceneIds = scenes.slice(startIdx, i).map((s) => s.id);
        results.push({
          level: "warning",
          rule: "consecutive-static",
          message: `连续 ${count} 个静态展示场景（上限 2 个）`,
          scenes: sceneIds,
        });
      }
      count = STATIC_DISPLAY_TYPES.has(scenes[i].type) ? 1 : 0;
      startIdx = STATIC_DISPLAY_TYPES.has(scenes[i].type) ? i : i;
    }
  }

  if (count > 2) {
    const sceneIds = scenes.slice(startIdx).map((s) => s.id);
    results.push({
      level: "warning",
      rule: "consecutive-static",
      message: `连续 ${count} 个静态展示场景（上限 2 个）`,
      scenes: sceneIds,
    });
  }

  return results;
}

function checkLongSceneAnimation(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  const violations: string[] = [];

  for (const s of scenes) {
    if ((s.durationEstimate ?? 0) <= 12) continue;

    const hasProgressiveAnim =
      s.animation && PROGRESSIVE_ANIMATIONS.has(s.animation);
    const hasInternalTiming =
      "revealMode" in s ||
      "timingNotes" in s ||
      "steps" in s ||
      "lines" in s ||
      "changes" in s ||
      "result" in s ||
      "callouts" in s ||
      "points" in s ||
      "lanes" in s ||
      "markers" in s ||
      "semanticPattern" in s;

    if (!hasProgressiveAnim && !hasInternalTiming) {
      violations.push(
        `${s.id}(${s.durationEstimate}s): 需要 progressive-reveal/highlight-current 动画或内部时序标注`,
      );
    }
  }

  if (violations.length > 0) {
    results.push({
      level: "warning",
      rule: "long-scene-no-animation",
      message: `${violations.length} 个超过 12s 的场景缺少渐进式动画或时序标注`,
      scenes: violations,
    });
  }

  return results;
}

function checkSemanticPatternUsage(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  const violations: string[] = [];

  for (const s of scenes) {
    if (!s.semanticPattern) continue;
    if (!ALLOWED_SEMANTIC_PATTERNS.has(s.semanticPattern)) {
      violations.push(`${s.id}: 未实现 semanticPattern=${s.semanticPattern}`);
      continue;
    }
    const allowedTypes = SEMANTIC_PATTERN_ALLOWED_TYPES[s.semanticPattern];
    if (allowedTypes && !allowedTypes.has(s.type)) {
      violations.push(
        `${s.id}: semanticPattern=${s.semanticPattern} 只支持 type=${[...allowedTypes].join("/")}, 实际=${s.type}`,
      );
    }
  }

  if (violations.length > 0) {
    results.push({
      level: "error",
      rule: "invalid-semantic-pattern",
      message: `${violations.length} 个 scene 使用了未实现或不匹配的 semanticPattern`,
      scenes: violations,
    });
  }

  return results;
}

function checkAssetLayoutUsage(
  scenes: VideoScene[],
  theme: string,
): CheckResult[] {
  const results: CheckResult[] = [];
  const bad = scenes.filter(
    (s) => s.assetLayout && !ASSET_LAYOUT_ALLOWED_TYPES.has(s.type),
  );

  if (bad.length > 0) {
    results.push({
      level: "warning",
      rule: "assetLayout-on-wrong-type",
      message: `${bad.length} 个非 comparison/two-column 的 scene 使用了 assetLayout（仅 comparison/two-column 支持）`,
      scenes: bad.map((s) => `${s.id}(${s.type})`),
    });
  }

  return results;
}

function checkHighlightBounds(scenes: VideoScene[]): CheckResult[] {
  const results: CheckResult[] = [];
  const violations: string[] = [];

  for (const s of scenes) {
    if (!s.assetLayout) continue;
    for (const side of ["left", "right"] as const) {
      const hl = s.assetLayout[side]?.highlight;
      if (!hl) continue;
      const fields: Array<[string, number | undefined]> = [
        ["top", hl.top],
        ["left", hl.left],
        ["width", hl.width],
        ["height", hl.height],
      ];
      for (const [name, val] of fields) {
        if (val !== undefined && (val < 0 || val > 100)) {
          violations.push(
            `${s.id}.assetLayout.${side}.highlight.${name}=${val}（必须在 0-100 范围内）`,
          );
        }
      }
    }
  }

  if (violations.length > 0) {
    results.push({
      level: "error",
      rule: "highlight-out-of-bounds",
      message: `${violations.length} 个 highlight 框坐标超出 0-100 范围`,
      scenes: violations,
    });
  }

  return results;
}

function checkLabThemeCompatibility(
  scenes: VideoScene[],
  theme: string,
): CheckResult[] {
  const results: CheckResult[] = [];

  if (LAB_THEMES.has(theme)) return results;

  const bad = scenes.filter(
    (s) => s.visualRole && LAB_VISUAL_ROLES.has(s.visualRole),
  );

  if (bad.length > 0) {
    results.push({
      level: "warning",
      rule: "lab-role-on-non-lab-theme",
      message: `${bad.length} 个 scene 使用了 Knowledge Lab visualRole（${[...new Set(bad.map((s) => s.visualRole))].join(", ")}），但主题 "${theme}" 不是 Lab 主题（仅 xhs-white-editorial / knowledge-blueprint 触发 Lab 变体）`,
      scenes: bad.map((s) => `${s.id}(visualRole=${s.visualRole})`),
    });
  }

  return results;
}

// ─── 主流程 ───────────────────────────────────────

function main() {
  const spec: VideoSpec = JSON.parse(fs.readFileSync(VIDEO_SPEC_PATH, "utf-8"));

  console.log(`\n视频: ${spec.meta.title}`);
  console.log(`场景数: ${spec.scenes.length}`);
  console.log(`\n${"═".repeat(60)}`);
  console.log("videoSpec 结构验证");
  console.log("═".repeat(60));

  const allResults: CheckResult[] = [
    ...checkTypeAllowed(spec.scenes),
    ...checkBannedTypes(spec.scenes),
    ...checkVisualRole(spec.scenes),
    ...checkP1Combinations(spec.scenes),
    ...checkPromptTemplateCard(spec.scenes),
    ...checkBannedFields(spec.scenes),
    ...checkCodeSceneContract(spec.scenes),
    ...checkDiffSceneContract(spec.scenes),
    ...checkTerminalSceneContract(spec.scenes),
    ...checkImageHeroSceneContract(spec.scenes),
    ...checkGanttSceneContract(spec.scenes),
    ...checkStaticRatio(spec.scenes),
    ...checkConsecutiveStatic(spec.scenes),
    ...checkLongSceneAnimation(spec.scenes),
    ...checkSemanticPatternUsage(spec.scenes),
    ...checkAssetLayoutUsage(spec.scenes, spec.meta.theme as string),
    ...checkHighlightBounds(spec.scenes),
    ...checkLabThemeCompatibility(spec.scenes, spec.meta.theme as string),
  ];

  const errors = allResults.filter((r) => r.level === "error");
  const warnings = allResults.filter((r) => r.level === "warning");

  for (const result of allResults) {
    const icon = result.level === "error" ? "❌" : "⚠️";
    console.log(`\n${icon} [${result.rule}] ${result.message}`);
    if (result.scenes) {
      console.log(`   涉及: ${result.scenes.join(", ")}`);
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  if (errors.length > 0) {
    console.log(
      `\n结论: 发现 ${errors.length} 个错误，${warnings.length} 个警告`,
    );
    console.log("建议: 回到 ChatGPT 修改 videoSpec 后再执行渲染");
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log(`\n结论: 发现 ${warnings.length} 个警告`);
    console.log("建议: 检查是否需要调整");
    process.exit(0);
  } else {
    console.log("\n结论: videoSpec 结构验证通过");
    process.exit(0);
  }
}

main();
