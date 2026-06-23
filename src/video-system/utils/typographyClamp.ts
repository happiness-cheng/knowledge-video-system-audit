/**
 * 字号约束系统
 *
 * 为不同 scene type 定义字号上下限，防止字号失控。
 * 所有 scene 组件应使用 clampFontSize 替代直接硬编码字号。
 */

export interface FontSizeClamp {
  min: number;
  max: number;
}

/** 各元素类型的字号约束 */
export const FONT_CLAMP: Record<string, FontSizeClamp> = {
  hookTitle: { min: 112, max: 156 },
  sceneTitle: { min: 88, max: 116 },
  bigQuote: { min: 80, max: 148 },
  comparisonTitle: { min: 72, max: 96 },
  evidenceConclusion: { min: 72, max: 92 },
  caption: { min: 36, max: 60 },
  cardBody: { min: 36, max: 52 },
  label: { min: 36, max: 52 },
  processStep: { min: 42, max: 56 },
  templateItem: { min: 38, max: 52 },
  ctaTitle: { min: 112, max: 132 },
  ctaButton: { min: 36, max: 44 },
  highlightLabel: { min: 24, max: 30 },
};

/**
 * 将字号约束到指定范围内
 */
export function clampFontSize(
  size: number,
  type: keyof typeof FONT_CLAMP,
): number {
  const clamp = FONT_CLAMP[type];
  if (!clamp) return size;
  return Math.max(clamp.min, Math.min(clamp.max, size));
}

/**
 * 中文换行保护：检测并限制最大行数
 * 返回适合 WebkitLineClamp 的 CSS 值
 */
export function lineClampProtection(maxLines: number): React.CSSProperties {
  return {
    display: "-webkit-box",
    WebkitLineClamp: maxLines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };
}
