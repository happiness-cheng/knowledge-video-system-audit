/**
 * 中文标题断行风险评分
 *
 * 启发式评分，不做复杂排版引擎。
 * 用于 visualMetrics 风险判断。
 */

/** 弱词列表：不应出现在行首 */
const WEAK_WORDS = new Set([
  "的",
  "了",
  "与",
  "和",
  "或",
  "等",
  "及",
  "是",
  "在",
  "把",
  "被",
  "让",
  "对",
  "从",
  "到",
  "为",
  "以",
  "而",
  "但",
  "也",
  "就",
  "都",
  "又",
  "还",
]);

/** 标点符号 */
const PUNCTUATION = new Set([
  "。",
  "，",
  "、",
  "；",
  "：",
  "？",
  "！",
  "……",
  "——",
  '"',
  '"',
  "「",
  "」",
  "（",
  "）",
  "《",
  "》",
]);

export interface TitleBreakRisk {
  text: string;
  charCount: number;
  estimatedLines: number;
  hasSingleCharLineRisk: boolean;
  hasBadTailRisk: boolean;
  hasWeakWordLineStartRisk: boolean;
  hasPunctuationLineRisk: boolean;
  recommendedStrategy:
    | "single-line"
    | "balanced-two-line"
    | "split-title-subtitle"
    | "rewrite";
  riskLevel: "low" | "medium" | "high";
  notes: string[];
}

/**
 * 估算标题在给定宽度下会占几行
 * 粗略估算：中文字符约等于字号宽度，一行约能放 titleMaxChars 个字
 */
function estimateLines(text: string, maxCharsPerLine: number): number {
  if (text.length <= maxCharsPerLine) return 1;
  return Math.ceil(text.length / maxCharsPerLine);
}

function splitExplicitLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function explicitLineRisk(
  text: string,
  maxCharsPerLine: number,
): TitleBreakRisk | null {
  const explicitLines = splitExplicitLines(text);
  if (explicitLines.length <= 1) return null;

  const notes: string[] = [];
  const hasSingleCharLineRisk = explicitLines.some((line) => line.length <= 1);
  const hasBadTailRisk = explicitLines.some(
    (line) => line.length > maxCharsPerLine + 2,
  );
  const hasWeakWord = false;
  const hasPunctuation = explicitLines.some((line) =>
    PUNCTUATION.has(line.charAt(0)),
  );

  if (hasSingleCharLineRisk) notes.push("显式断行中存在单字孤行");
  if (hasBadTailRisk) notes.push("显式断行后仍可能超出安全行宽");
  if (hasWeakWord) notes.push("弱词出现在显式行首");
  if (hasPunctuation) notes.push("标点出现在显式行首");
  if (explicitLines.length > 2)
    notes.push(`标题显式分为 ${explicitLines.length} 行，超过 2 行上限`);

  let riskLevel: TitleBreakRisk["riskLevel"] = "low";
  if (explicitLines.length > 2 || hasSingleCharLineRisk || hasBadTailRisk) {
    riskLevel = "high";
  } else if (hasWeakWord || hasPunctuation) {
    riskLevel = "medium";
  }

  return {
    text,
    charCount: Array.from(text.replace(/\n/g, "")).length,
    estimatedLines: explicitLines.length,
    hasSingleCharLineRisk,
    hasBadTailRisk,
    hasWeakWordLineStartRisk: hasWeakWord,
    hasPunctuationLineRisk: hasPunctuation,
    recommendedStrategy:
      explicitLines.length <= 2 ? "balanced-two-line" : "rewrite",
    riskLevel,
    notes,
  };
}

/**
 * 检查所有可能断行位置后的首字符是否是弱词
 */
function hasWeakWordLineStartRisk(
  text: string,
  maxCharsPerLine: number,
): boolean {
  // 检查全文首字符
  if (WEAK_WORDS.has(text.charAt(0))) return true;
  // 检查每个可能断行位置后的首字符
  for (let i = maxCharsPerLine; i < text.length; i += maxCharsPerLine) {
    if (WEAK_WORDS.has(text.charAt(i))) return true;
  }
  return false;
}

/**
 * 检查所有可能断行位置后的首字符是否是标点（标点单独成行风险）
 */
function hasPunctuationLineRisk(
  text: string,
  maxCharsPerLine: number,
): boolean {
  for (let i = maxCharsPerLine; i < text.length; i += maxCharsPerLine) {
    if (PUNCTUATION.has(text.charAt(i))) return true;
  }
  return false;
}

/**
 * 对中文标题进行断行风险评分
 * @param text 标题文本
 * @param maxCharsPerLine 每行最大字符数，默认 14（适合主标题）
 */
export function chineseTitleBreakRisk(
  text: string,
  maxCharsPerLine = 14,
): TitleBreakRisk {
  const explicitRisk = explicitLineRisk(text, maxCharsPerLine);
  if (explicitRisk) return explicitRisk;

  const charCount = text.length;
  const estimatedLines = estimateLines(text, maxCharsPerLine);
  const notes: string[] = [];

  // 策略推荐
  let recommendedStrategy: TitleBreakRisk["recommendedStrategy"];
  if (charCount <= 10) {
    recommendedStrategy = "single-line";
  } else if (charCount <= 18) {
    recommendedStrategy = "balanced-two-line";
  } else if (charCount <= 30) {
    recommendedStrategy = "split-title-subtitle";
  } else {
    recommendedStrategy = "rewrite";
    notes.push(`标题 ${charCount} 字，超过 30 字，建议改写`);
  }

  // 风险项检查
  const hasSingleCharLineRisk = charCount > 10 && estimatedLines >= 2;
  const hasBadTailRisk =
    charCount > 10 &&
    charCount % maxCharsPerLine <= 2 &&
    charCount % maxCharsPerLine > 0;
  const hasWeakWord = hasWeakWordLineStartRisk(text, maxCharsPerLine);
  const hasPunctuation = hasPunctuationLineRisk(text, maxCharsPerLine);

  if (hasSingleCharLineRisk) notes.push("可能存在单字孤行风险");
  if (hasBadTailRisk) notes.push("尾行可能只有 1-2 个字");
  if (hasWeakWord) notes.push("弱词可能出现在行首");
  if (hasPunctuation) notes.push("标点可能单独成行");
  if (estimatedLines > 2)
    notes.push(`标题可能占 ${estimatedLines} 行，超过 2 行上限`);

  // 风险等级
  let riskLevel: TitleBreakRisk["riskLevel"] = "low";
  if (estimatedLines > 2 || charCount > 30) {
    riskLevel = "high";
  } else if (
    hasSingleCharLineRisk ||
    hasBadTailRisk ||
    hasWeakWord ||
    recommendedStrategy === "split-title-subtitle"
  ) {
    riskLevel = "medium";
  }

  return {
    text,
    charCount,
    estimatedLines,
    hasSingleCharLineRisk,
    hasBadTailRisk,
    hasWeakWordLineStartRisk: hasWeakWord,
    hasPunctuationLineRisk: hasPunctuation,
    recommendedStrategy,
    riskLevel,
    notes,
  };
}
