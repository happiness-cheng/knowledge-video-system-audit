// ─── 布局 token ─────────────────────────────────────
// 基于 1920×1080 源画布

export const layout = {
  // 安全区边距
  padding: {
    x: 120, // 左右边距 (~6.25%)
    y: 80, // 上下边距 (~7.4%)
  },
  // 工作区比例
  workZone: {
    widthMin: 0.72,
    widthMax: 0.84,
    heightMin: 0.68,
    heightMax: 0.82,
  },
  // 双栏布局
  twoColumn: {
    columnWidth: 0.39, // 每栏宽度
    gutter: 0.05, // 间距
  },
  // 主体最小面积占比
  minPrimaryAreaRatio: 0.35,
  // 卡片样式
  card: {
    borderRadius: 16,
    padding: 40,
    shadowColor: "rgba(0, 0, 0, 0.08)",
    shadowBlur: 24,
  },
  // 证据卡样式
  evidenceCard: {
    borderRadius: 12,
    padding: 24,
    highlightBorderWidth: 3,
    highlightBorderRadius: 4,
  },
  // 模板卡样式
  templateCard: {
    borderRadius: 20,
    padding: 48,
    stepGap: 16,
  },
} as const;

// ─── 尺寸计算工具 ───────────────────────────────────

/** 计算主工作区宽度 */
export function workZoneWidth(canvasWidth = 1920): number {
  return (
    (canvasWidth * (layout.workZone.widthMin + layout.workZone.widthMax)) / 2
  );
}

/** 计算主工作区高度 */
export function workZoneHeight(canvasHeight = 1080): number {
  return (
    (canvasHeight * (layout.workZone.heightMin + layout.workZone.heightMax)) / 2
  );
}

/** 双栏：左栏起始 x */
export function leftColumnX(canvasWidth = 1920): number {
  const totalWidth = layout.twoColumn.columnWidth * 2 + layout.twoColumn.gutter;
  return (canvasWidth - canvasWidth * totalWidth) / 2;
}

/** 双栏：右栏起始 x */
export function rightColumnX(canvasWidth = 1920): number {
  const leftX = leftColumnX(canvasWidth);
  return (
    leftX +
    canvasWidth * (layout.twoColumn.columnWidth + layout.twoColumn.gutter)
  );
}
