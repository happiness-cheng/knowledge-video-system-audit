// ─── V2 布局 token 系统 ─────────────────────────────────

export const layout = {
  padX: 120,
  padY: 80,
  workZoneW: [0.72, 0.84] as const,
  workZoneH: [0.68, 0.82] as const,
  twoCol: { col: 0.39, gutter: 0.05 },
  threeCol: { col: 0.28, gutter: 0.04 },
  card: { radius: 20, padding: 40 },
  evidence: { radius: 16, padding: 28, viewportH: 400 },
  template: { radius: 24, padding: 52, itemGap: 20 },
  titleAreaRatio: 0.18,
  minPrimaryArea: 0.35,
} as const;
