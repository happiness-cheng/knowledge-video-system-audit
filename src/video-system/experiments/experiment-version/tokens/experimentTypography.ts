// ─── 试验版字体 token ─────────────────────────────────
// 基于 1920×1080 源画布，参考 14_VISUAL_DESIGN_SYSTEM

export const experimentType = {
  displayXL: { size: 156, lineHeight: 1.05, weight: 780 },
  displayL: { size: 132, lineHeight: 1.08, weight: 720 },
  headingL: { size: 104, lineHeight: 1.12, weight: 700 },
  headingM: { size: 88, lineHeight: 1.16, weight: 650 },
  bodyL: { size: 76, lineHeight: 1.4, weight: 550 },
  bodyM: { size: 68, lineHeight: 1.44, weight: 550 },
  captionL: { size: 58, lineHeight: 1.34, weight: 550 },
  label: { size: 50, lineHeight: 1.2, weight: 650 },
  meta: { size: 42, lineHeight: 1.15, weight: 500 },
} as const;

export type ExperimentTypeToken = keyof typeof experimentType;

export function expFont(token: ExperimentTypeToken): React.CSSProperties {
  const t = experimentType[token];
  return {
    fontSize: t.size,
    lineHeight: t.lineHeight,
    fontWeight: t.weight,
  };
}
