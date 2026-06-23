// ─── V2 平台 token ─────────────────────────────────────
// 手机端投影、安全区

export const platform = {
  canvas: { width: 1920, height: 1080 },
  mobile: { width: 390, height: 844 },
  fps: 30,

  /** 手机端投影字号 */
  projectedPx: (sourcePx: number) =>
    Math.round((sourcePx * platform.mobile.width) / platform.canvas.width),

  /** 安全区 */
  safeArea: {
    top: 80,
    bottom: 100, // 给字幕留空间
    left: 60,
    right: 60,
  },

  /** 品牌水印安全区 */
  brandSafe: {
    top: 24,
    right: 24,
    width: 200,
    height: 60,
  },

  /** 进度条安全区 */
  progressSafe: {
    top: 60,
    left: 120,
    right: 120,
    height: 4,
  },
} as const;
