// ─── 中文文本布局工具 ─────────────────────────────────

/** 检查是否有单字孤行 */
export function hasSingleCharLine(text: string): boolean {
  const lines = text.split("\n");
  return lines.some((l) => l.trim().length === 1);
}

/** 检查尾行是否过短 */
export function hasShortTail(text: string, minChars = 3): boolean {
  const lines = text.split("\n");
  const last = lines[lines.length - 1]?.trim() ?? "";
  return last.length > 0 && last.length < minChars;
}

/** 按最大字符数断行 */
export function breakByChars(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  const mid = Math.ceil(text.length / 2);
  // 找中间附近的断点
  for (let i = mid; i < Math.min(mid + 3, text.length); i++) {
    if ("，。、；：！？）】".includes(text[i])) {
      return text.slice(0, i + 1) + "\n" + text.slice(i + 1);
    }
  }
  return text.slice(0, mid) + "\n" + text.slice(mid);
}

/** 手机端投影字号 */
export function projectedMobilePx(
  sourcePx: number,
  canvasWidth = 1920,
  mobileWidth = 390,
): number {
  return Math.round((sourcePx * mobileWidth) / canvasWidth);
}
