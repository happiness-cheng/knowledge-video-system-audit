/**
 * 时间工具
 *
 * 从 videoSpec.json 计算每个场景的帧数和起止帧。
 */

export interface SceneTiming {
  id: string;
  startFrame: number;
  durationFrames: number;
  endFrame: number;
}

/**
 * 根据 videoSpec 的 scenes 数组计算时间轴
 */
export function computeTimeline(
  scenes: Array<{ id: string; duration: number }>,
  fps: number,
): SceneTiming[] {
  let currentFrame = 0;
  return scenes.map((s) => {
    const durationFrames = Math.round(s.duration * fps);
    const timing: SceneTiming = {
      id: s.id,
      startFrame: currentFrame,
      durationFrames,
      endFrame: currentFrame + durationFrames,
    };
    currentFrame += durationFrames;
    return timing;
  });
}

/**
 * 计算总帧数
 */
export function computeTotalFrames(
  scenes: Array<{ duration: number }>,
  fps: number,
): number {
  return scenes.reduce((sum, s) => sum + Math.round(s.duration * fps), 0);
}

/**
 * 根据当前帧找到对应的场景索引
 */
export function findSceneIndex(frame: number, timings: SceneTiming[]): number {
  for (let i = timings.length - 1; i >= 0; i--) {
    if (frame >= timings[i].startFrame) return i;
  }
  return 0;
}
