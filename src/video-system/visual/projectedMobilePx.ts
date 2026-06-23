/**
 * 手机端投影字号计算
 *
 * 将 1920x1080 源画布的字号投影到手机端实际观看尺寸。
 * 用于 visualMetrics 风险判断和 sceneContracts 检查。
 */

/**
 * 计算源字号在手机端的投影像素值
 * @param sourcePx 源画布字号（1920x1080 下的 px）
 * @param compositionWidth 源画布宽度，默认 1920
 * @param mobileWidth 手机端宽度，默认 390（iPhone 14）
 * @returns 投影后的像素值，保留 1 位小数
 */
export function projectedMobilePx(
  sourcePx: number,
  compositionWidth = 1920,
  mobileWidth = 390,
): number {
  return Math.round(((sourcePx * mobileWidth) / compositionWidth) * 10) / 10;
}
