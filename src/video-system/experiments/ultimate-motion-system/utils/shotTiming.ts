// ─── Shot 时序工具 ─────────────────────────────────

export interface ShotTiming {
  sceneId: string;
  durationFrames: number;
  startFrame: number;
  endFrame: number;
}

/** 计算每个 scene 的起止帧 */
export function computeShotTimings(
  durations: number[],
  transitionFrames: number,
): ShotTiming[] {
  const shots: ShotTiming[] = [];
  let currentFrame = 0;
  for (let i = 0; i < durations.length; i++) {
    const start = currentFrame;
    const end = start + durations[i];
    shots.push({
      sceneId: `S${String(i + 1).padStart(2, "0")}`,
      durationFrames: durations[i],
      startFrame: start,
      endFrame: end,
    });
    currentFrame = end;
    if (i < durations.length - 1) {
      currentFrame += transitionFrames;
    }
  }
  return shots;
}
