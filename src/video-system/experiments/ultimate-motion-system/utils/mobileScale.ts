// ─── 手机端缩放工具 ─────────────────────────────────

export const mobileScale = {
  canvas: { width: 1920, height: 1080 },
  mobile: { width: 390, height: 844 },

  /** 源字号 → 手机端投影字号 */
  projectedPx(sourcePx: number): number {
    return Math.round(
      (sourcePx * this.mobile.width) / this.canvas.width,
    );
  },

  /** 源尺寸 → 手机端投影尺寸 */
  projectedSize(
    sourceW: number,
    sourceH: number,
  ): { width: number; height: number } {
    const scale = this.mobile.width / this.canvas.width;
    return {
      width: Math.round(sourceW * scale),
      height: Math.round(sourceH * scale),
    };
  },

  /** 判断字号是否手机端可读 */
  isReadable(sourcePx: number, minMobilePx = 10): boolean {
    return this.projectedPx(sourcePx) >= minMobilePx;
  },
};
