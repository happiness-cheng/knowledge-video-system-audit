const WEAK_LINE_START_CHARS = new Set([
  "的",
  "了",
  "与",
  "和",
  "或",
  "等",
  "及",
]);

const PUNCTUATION_CHARS = new Set(["，", "。", "！", "？", "、", "；", "："]);

export interface FormatTitleLinesOptions {
  maxCharsPerLine?: number;
}

function visualLength(text: string): number {
  return Array.from(text).reduce((sum, ch) => {
    if (/[\x00-\x7F]/.test(ch)) return sum + 0.55;
    return sum + 1;
  }, 0);
}

function isBadLineStart(ch: string): boolean {
  return WEAK_LINE_START_CHARS.has(ch) || PUNCTUATION_CHARS.has(ch);
}

function trimLines(lines: string[]): string[] {
  return lines.map((line) => line.trim()).filter(Boolean);
}

function candidateBreaks(text: string): number[] {
  const breaks: number[] = [];
  for (let i = 1; i < text.length; i++) {
    const prev = text[i - 1];
    const curr = text[i];
    if (["，", "、", "；", "："].includes(prev)) breaks.push(i);
    if (/\s/.test(prev) || /\s/.test(curr)) breaks.push(i);
  }
  for (let i = 2; i < text.length - 1; i++) {
    const prev = text[i - 1];
    const curr = text[i];
    if (/[A-Za-z0-9]/.test(prev) && /[A-Za-z0-9]/.test(curr)) continue;
    breaks.push(i);
  }
  return [...new Set(breaks)].filter((idx) => idx > 0 && idx < text.length);
}

function scoreBreak(text: string, index: number, targetWidth: number): number {
  const left = text.slice(0, index).trim();
  const right = text.slice(index).trim();
  let score = Math.abs(visualLength(left) - targetWidth);

  if (right.length <= 2) score += 100;
  if (left.length <= 2) score += 60;
  if (isBadLineStart(right[0] ?? "")) score += 80;
  if (PUNCTUATION_CHARS.has(right)) score += 100;
  if (left.endsWith("像拆") && right === "家") score += 100;
  if (left.endsWith("，") || left.endsWith("、")) score -= 8;
  return score;
}

function splitBalancedTwoLines(text: string, maxCharsPerLine: number): string[] {
  const targetWidth = Math.min(visualLength(text) / 2, maxCharsPerLine);
  let bestIndex = -1;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const index of candidateBreaks(text)) {
    const left = text.slice(0, index).trim();
    const right = text.slice(index).trim();
    if (!left || !right) continue;
    if (visualLength(left) > maxCharsPerLine + 2) continue;
    if (visualLength(right) > maxCharsPerLine + 2) continue;

    const score = scoreBreak(text, index, targetWidth);
    if (score < bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  }

  if (bestIndex === -1) return [text];
  return trimLines([text.slice(0, bestIndex), text.slice(bestIndex)]);
}

export function formatTitleLines(
  title: string,
  options: FormatTitleLinesOptions = {},
): string[] {
  const explicitLines = trimLines(title.split("\n"));
  if (explicitLines.length > 1) return explicitLines;

  const normalizedTitle = title.trim();
  const maxCharsPerLine = options.maxCharsPerLine ?? 12;
  if (
    normalizedTitle.length < maxCharsPerLine &&
    visualLength(normalizedTitle) < maxCharsPerLine
  ) {
    return [normalizedTitle];
  }

  return splitBalancedTwoLines(normalizedTitle, maxCharsPerLine);
}
