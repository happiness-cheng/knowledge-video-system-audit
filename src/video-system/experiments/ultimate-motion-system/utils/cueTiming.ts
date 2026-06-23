// ─── Cue Timing 工具 ─────────────────────────────────

export interface CueTimingConfig {
  leadFrames: number;
  decayFrames: number;
  minHoldFrames: number;
}

export const defaultCueTiming: CueTimingConfig = {
  leadFrames: 10,
  decayFrames: 15,
  minHoldFrames: 45,
};

/** 语义段比例 → 帧数分配 */
export function distributeFrames(
  totalFrames: number,
  ratios: number[],
): number[] {
  const sum = ratios.reduce((a, b) => a + b, 0);
  return ratios.map((r) => Math.round((r / sum) * totalFrames));
}

/** 从 spokenText 估算语义段比例 */
export function estimateSemanticRatios(segments: string[]): number[] {
  const lengths = segments.map((s) => s.length);
  const total = lengths.reduce((a, b) => a + b, 0);
  return lengths.map((l) => l / total);
}
