// ─── 试验版布局 token ─────────────────────────────────
// 基于 1920×1080 源画布

export const experimentLayout = {
  // 安全区边距
  padX: 120,
  padY: 80,

  // 工作区比例
  workZoneW: [0.72, 0.84] as const,
  workZoneH: [0.68, 0.82] as const,

  // 双栏
  twoCol: { col: 0.39, gutter: 0.05 },

  // 三栏
  threeCol: { col: 0.28, gutter: 0.04 },

  // 卡片
  card: {
    borderRadius: 20,
    padding: 40,
  },

  // 证据卡
  evidence: {
    borderRadius: 16,
    padding: 28,
    viewportHeight: 400,
  },

  // 模板卡
  template: {
    borderRadius: 24,
    padding: 52,
    itemGap: 20,
  },

  // 标题区域高度比例
  titleAreaRatio: 0.18,

  // 主体最小面积占比
  minPrimaryArea: 0.35,
} as const;
