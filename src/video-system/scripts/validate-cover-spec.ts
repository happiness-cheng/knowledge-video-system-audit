#!/usr/bin/env npx tsx
/**
 * coverSpec 校验脚本
 *
 * 检查 coverSpec.json 是否完整、字段是否合法、素材是否存在。
 *
 * 用法：npx tsx src/video-system/scripts/validate-cover-spec.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ─── 路径 ─────────────────────────────────────────
const COVER_SPEC_PATH = path.resolve(__dirname, "../data/coverSpec.json");
const ASSETS_DIR = path.resolve(__dirname, "../../../public/assets/processed");

// ─── 允许的主题 ID ────────────────────────────────
const ALLOWED_THEMES = new Set([
  "xhs-white-editorial",
  "knowledge-blueprint",
  "minimal-white",
  "neo-brutalism",
  "aurora",
  "obsidian-claude-gradient",
  "testing-safety-alert",
  "xhs-pastel-card",
]);

const IMPLEMENTED_TEMPLATES = new Set([
  "big-title",
  "big-title-character",
  "split-left-right",
]);

const VALID_PLACEMENTS = new Set(["left", "right", "center"]);

// ─── 类型 ─────────────────────────────────────────
interface CoverSpec {
  theme?: string;
  template?: string;
  title?: string;
  subtitle?: string;
  keywords?: string[];
  coverType?: string;
  badge?: string;
  brandName?: string;
  character?: {
    show?: boolean;
    assetId?: string | null;
    placement?: string;
    pose?: string;
  };
  cards?: Array<{ text: string; style?: string; position?: string }>;
  layout?: {
    titleFontSize?: number;
    subtitleFontSize?: number;
    keywordFontSize?: number;
  };
  variants?: Record<string, { titleFontSize?: number; [key: string]: unknown }>;
  approval?: {
    userDecision?: string;
    approvedByUser?: boolean;
  };
  [key: string]: unknown;
}

interface CheckResult {
  level: "error" | "warning";
  rule: string;
  message: string;
  details?: string[];
}

// ─── 检查函数 ─────────────────────────────────────

function checkRequiredFields(spec: CoverSpec): CheckResult[] {
  const results: CheckResult[] = [];
  const missing: string[] = [];

  if (!spec.title) missing.push("title");
  if (!spec.theme) missing.push("theme");
  if (!spec.brandName) missing.push("brandName");

  if (missing.length > 0) {
    results.push({
      level: "error",
      rule: "missing-required-fields",
      message: `缺少必填字段`,
      details: missing,
    });
  }

  return results;
}

function checkTheme(spec: CoverSpec): CheckResult[] {
  const results: CheckResult[] = [];

  if (spec.theme && !ALLOWED_THEMES.has(spec.theme)) {
    results.push({
      level: "error",
      rule: "invalid-theme",
      message: `主题 "${spec.theme}" 不在注册表中`,
      details: [...ALLOWED_THEMES],
    });
  }

  return results;
}

function checkCharacter(spec: CoverSpec): CheckResult[] {
  const results: CheckResult[] = [];

  if (spec.character?.show && spec.character?.assetId) {
    const assetPath = path.join(ASSETS_DIR, `${spec.character.assetId}.png`);
    if (!fs.existsSync(assetPath)) {
      results.push({
        level: "error",
        rule: "character-asset-missing",
        message: `角色素材文件不存在: ${assetPath}`,
      });
    }
  }

  return results;
}

function checkVariants(spec: CoverSpec): CheckResult[] {
  const results: CheckResult[] = [];

  if (!spec.variants) {
    results.push({
      level: "warning",
      rule: "missing-variants",
      message: `缺少 variants 字段，无法覆盖双比例字号`,
    });
  } else {
    if (!spec.variants["3x4"]) {
      results.push({
        level: "warning",
        rule: "missing-variant-3x4",
        message: `缺少 variants["3x4"] 配置`,
      });
    }
    if (!spec.variants["4x3"]) {
      results.push({
        level: "warning",
        rule: "missing-variant-4x3",
        message: `缺少 variants["4x3"] 配置`,
      });
    }
  }

  return results;
}

function checkTitle(spec: CoverSpec): CheckResult[] {
  const results: CheckResult[] = [];

  if (spec.title && spec.title.length > 30) {
    results.push({
      level: "warning",
      rule: "title-too-long",
      message: `标题 ${spec.title.length} 字，可能在封面显示不全（建议 ≤ 20 字）`,
    });
  }

  return results;
}

function checkTemplate(spec: CoverSpec): CheckResult[] {
  const results: CheckResult[] = [];

  if (spec.template && !IMPLEMENTED_TEMPLATES.has(spec.template)) {
    results.push({
      level: "warning",
      rule: "template-not-implemented",
      message: `template "${spec.template}" 尚未实现（已实现: big-title / big-title-character / split-left-right；card-stack / data-hero 为 planned）`,
    });
  }

  return results;
}

function checkCharacterPlacement(spec: CoverSpec): CheckResult[] {
  const results: CheckResult[] = [];

  if (spec.character?.placement !== undefined) {
    if (!VALID_PLACEMENTS.has(spec.character.placement)) {
      results.push({
        level: "error",
        rule: "invalid-character-placement",
        message: `character.placement "${spec.character.placement}" 不合法（允许: left / right / center）`,
      });
    }
  }

  return results;
}

// ─── 主流程 ───────────────────────────────────────
function main() {
  let spec: CoverSpec;
  try {
    spec = JSON.parse(fs.readFileSync(COVER_SPEC_PATH, "utf-8"));
  } catch (err) {
    console.log(`\n❌ 无法读取 coverSpec.json: ${err}`);
    process.exit(1);
  }

  console.log(`\ncoverSpec 校验`);
  console.log(`${"═".repeat(60)}`);
  console.log(`主题: ${spec.theme ?? "未设置"}`);
  console.log(`标题: ${spec.title ?? "未设置"}`);
  console.log(`角色: ${spec.character?.show ? spec.character.assetId : "无"}`);

  const allResults: CheckResult[] = [
    ...checkRequiredFields(spec),
    ...checkTheme(spec),
    ...checkCharacter(spec),
    ...checkVariants(spec),
    ...checkTitle(spec),
    ...checkTemplate(spec),
    ...checkCharacterPlacement(spec),
  ];

  const errors = allResults.filter((r) => r.level === "error");
  const warnings = allResults.filter((r) => r.level === "warning");

  for (const result of allResults) {
    const icon = result.level === "error" ? "❌" : "⚠️";
    console.log(`\n${icon} [${result.rule}] ${result.message}`);
    if (result.details) {
      console.log(`   ${result.details.join(", ")}`);
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  if (errors.length > 0) {
    console.log(
      `\n结论: 发现 ${errors.length} 个错误，${warnings.length} 个警告`,
    );
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log(`\n结论: 发现 ${warnings.length} 个警告`);
    process.exit(0);
  } else {
    console.log("\n结论: coverSpec 校验通过");
    process.exit(0);
  }
}

main();
