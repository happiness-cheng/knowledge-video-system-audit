// ─── resolveActiveTarget: 根据当前帧计算 active 目标 ───

export interface DirectorCue {
  cueId: string;
  target: string;
  startFrameEstimate: number;
  holdFrames: number;
  leadFrames: number;
}

export type HighlightMode = "strict-switch" | "progressive-retain";

/**
 * resolveActiveTarget
 *
 * @param frame 当前帧（scene 内相对帧）
 * @param cues 该 scene 的 cue 列表
 * @param decayFrames 切换衰减帧数
 * @param mode strict-switch 或 progressive-retain
 */
export function resolveActiveTarget(
  frame: number,
  cues: DirectorCue[],
  decayFrames: number,
  mode: HighlightMode = "strict-switch",
): {
  activeTarget: string;
  targetOpacity: (target: string) => number;
} {
  // 找当前 active cue
  let activeCue: DirectorCue | null = null;
  for (let i = cues.length - 1; i >= 0; i--) {
    if (frame >= cues[i].startFrameEstimate - cues[i].leadFrames) {
      activeCue = cues[i];
      break;
    }
  }

  const activeTarget = activeCue?.target ?? cues[0]?.target ?? "";

  if (mode === "progressive-retain") {
    const activated = new Set<string>();
    for (const cue of cues) {
      if (frame >= cue.startFrameEstimate - cue.leadFrames) {
        activated.add(cue.target);
      }
    }
    return {
      activeTarget,
      targetOpacity: (target: string) => {
        if (target === activeTarget) return 1;
        if (activated.has(target)) {
          const ai = cues.findIndex((c) => c.target === target);
          const ci = cues.findIndex((c) => c.target === activeTarget);
          return Math.max(0.7, 1 - Math.abs(ci - ai) * 0.08);
        }
        return 0.4;
      },
    };
  }

  // strict-switch
  return {
    activeTarget,
    targetOpacity: (target: string) => {
      if (target === activeTarget) return 1;
      const ti = cues.findIndex((c) => c.target === target);
      const ai = cues.findIndex((c) => c.target === activeTarget);
      if (ti < 0 || ai < 0) return 0.4;
      return Math.abs(ti - ai) === 1 ? 0.65 : 0.4;
    },
  };
}
