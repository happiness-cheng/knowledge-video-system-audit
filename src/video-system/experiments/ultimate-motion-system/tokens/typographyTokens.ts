// ─── V2 字体 token 系统 ─────────────────────────────────
// 基于 1920×1080 源画布

export const typeScale = {
  displayXL: { size: 156, lineHeight: 1.05, weight: 780 },
  displayL: { size: 132, lineHeight: 1.08, weight: 720 },
  headingL: { size: 104, lineHeight: 1.12, weight: 700 },
  headingM: { size: 88, lineHeight: 1.16, weight: 650 },
  bodyL: { size: 76, lineHeight: 1.4, weight: 550 },
  bodyM: { size: 68, lineHeight: 1.44, weight: 550 },
  captionL: { size: 58, lineHeight: 1.34, weight: 550 },
  label: { size: 50, lineHeight: 1.2, weight: 650 },
  meta: { size: 42, lineHeight: 1.15, weight: 500 },
  chip: { size: 36, lineHeight: 1.2, weight: 600 },
} as const;

export type TypeToken = keyof typeof typeScale;

export function tSize(token: TypeToken): number {
  return typeScale[token].size;
}

export function tWeight(token: TypeToken): number {
  return typeScale[token].weight;
}

export function tLineHeight(token: TypeToken): number {
  return typeScale[token].lineHeight;
}

export function tStyle(token: TypeToken): React.CSSProperties {
  const t = typeScale[token];
  return { fontSize: t.size, lineHeight: t.lineHeight, fontWeight: t.weight };
}
