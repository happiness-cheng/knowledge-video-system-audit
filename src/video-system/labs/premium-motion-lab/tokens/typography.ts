// ─── 字体 token ─────────────────────────────────────
// 基于 1920×1080 源画布
// 参考 14_VISUAL_DESIGN_SYSTEM_V1_ALPHA.md

export const typeScale = {
  /** Hook 第一击、封面主标题 */
  displayXL: { min: 148, max: 176, lineHeight: 1.05, weight: 750 },
  /** Cover / Big-quote 主标题 */
  displayL: { min: 120, max: 148, lineHeight: 1.08, weight: 700 },
  /** Scene title / 对比页总标题 */
  headingL: { min: 96, max: 116, lineHeight: 1.12, weight: 700 },
  /** 副标题 / 阶段钉子副句 */
  headingM: { min: 80, max: 96, lineHeight: 1.16, weight: 650 },
  /** 关键正文 / 核心步骤 */
  bodyL: { min: 72, max: 84, lineHeight: 1.4, weight: 550 },
  /** 次正文 / checklist 项 */
  bodyM: { min: 64, max: 72, lineHeight: 1.44, weight: 550 },
  /** 强相关 caption / 图解说明 */
  captionL: { min: 56, max: 64, lineHeight: 1.34, weight: 550 },
  /** 标签、chip */
  label: { min: 48, max: 56, lineHeight: 1.2, weight: 650 },
} as const;

export type TypeToken = keyof typeof typeScale;

/** 获取 token 的中间值字号 */
export function fontSize(token: TypeToken): number {
  const t = typeScale[token];
  return Math.round((t.min + t.max) / 2);
}

/** 获取 token 的行高 */
export function lineHeight(token: TypeToken): number {
  return typeScale[token].lineHeight;
}

/** 获取 token 的字重 */
export function fontWeight(token: TypeToken): number {
  return typeScale[token].weight;
}

/** 生成完整的文字样式对象 */
export function textStyle(token: TypeToken): React.CSSProperties {
  return {
    fontSize: fontSize(token),
    lineHeight: lineHeight(token),
    fontWeight: fontWeight(token),
  };
}
