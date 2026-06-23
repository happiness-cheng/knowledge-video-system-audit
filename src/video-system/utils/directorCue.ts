// ─── Director Cue 工具函数 ─────────────────────────────
// 根据当前帧计算 active 目标和视觉状态
// 全部 frame-driven，禁止 CSS transition/animation

import { interpolate } from "remotion";
import type { DirectorCue, SceneDirectorCues } from "../data/directorCuesDraft";

/** 白底 spotlight 视觉状态 */
export type SpotlightVisualState = {
  /** 卡片整体 opacity（白底下保持 1，靠其他属性区分） */
  cardOpacity: number;
  scale: number;
  translateY: number;
  /** 左侧色条 opacity */
  sideRailOpacity: number;
  /** "当前" chip opacity */
  chipOpacity: number;
  /** 标题文字 opacity */
  titleOpacity: number;
  /** 正文文字 opacity */
  textOpacity: number;
  /** 背景 tint opacity */
  bgTintOpacity: number;
  /** 边框 opacity */
  borderOpacity: number;
  /** 阴影强度 */
  shadowStrength: number;
  /** 水平位移（S07 item 用） */
  translateX: number;
};

// ─── White Theme Spotlight Tokens ─────────────────────
// 白底主题专用：不靠整卡透明度，靠色块、色条、chip、文字权重形成状态差异

const WHITE_SPOTLIGHT_STRICT = {
  active: {
    cardOpacity: 1,
    scale: 1.018,
    translateY: -8,
    sideRailOpacity: 1,
    chipOpacity: 1,
    titleOpacity: 1,
    textOpacity: 1,
    bgTintOpacity: 0.13,
    borderOpacity: 1,
    shadowStrength: 0.34,
    translateX: 0,
  },
  inactive: {
    cardOpacity: 1,
    scale: 0.985,
    translateY: 0,
    sideRailOpacity: 0,
    chipOpacity: 0,
    titleOpacity: 0.5,
    textOpacity: 0.52,
    bgTintOpacity: 0,
    borderOpacity: 0.08,
    shadowStrength: 0.03,
    translateX: 0,
  },
};

const WHITE_SPOTLIGHT_PROGRESSIVE = {
  current: {
    cardOpacity: 1,
    scale: 1.018,
    translateY: 0,
    sideRailOpacity: 1,
    chipOpacity: 1,
    titleOpacity: 1,
    textOpacity: 1,
    bgTintOpacity: 0.12,
    borderOpacity: 1,
    shadowStrength: 0.28,
    translateX: 12,
  },
  activated: {
    cardOpacity: 1,
    scale: 1.0,
    translateY: 0,
    sideRailOpacity: 0.35,
    chipOpacity: 0,
    titleOpacity: 0.82,
    textOpacity: 0.82,
    bgTintOpacity: 0.03,
    borderOpacity: 0.35,
    shadowStrength: 0.06,
    translateX: 0,
  },
  unactivated: {
    cardOpacity: 1,
    scale: 0.99,
    translateY: 0,
    sideRailOpacity: 0,
    chipOpacity: 0,
    titleOpacity: 0.48,
    textOpacity: 0.48,
    bgTintOpacity: 0,
    borderOpacity: 0.12,
    shadowStrength: 0.02,
    translateX: 0,
  },
  stable: {
    cardOpacity: 1,
    scale: 1.0,
    translateY: 0,
    sideRailOpacity: 0.2,
    chipOpacity: 0,
    titleOpacity: 0.92,
    textOpacity: 0.92,
    bgTintOpacity: 0.04,
    borderOpacity: 0.4,
    shadowStrength: 0.08,
    translateX: 0,
  },
};

/**
 * resolveActiveTarget: 根据当前帧计算 active 目标
 */
export function resolveActiveTarget(
  frame: number,
  cues: SceneDirectorCues,
): {
  activeTarget: string;
  targetOpacity: (target: string) => number;
} {
  const { cues: cueList, leadFrames, decayFrames, mode } = cues;

  let activeCue: DirectorCue | null = null;
  for (let i = cueList.length - 1; i >= 0; i--) {
    if (
      frame >=
      cueList[i].startFrameEstimate - (cueList[i].leadFrames ?? leadFrames)
    ) {
      activeCue = cueList[i];
      break;
    }
  }

  const activeTarget = activeCue?.target ?? cueList[0]?.target ?? "";

  if (mode === "progressive-retain") {
    const activated = new Set<string>();
    for (const cue of cueList) {
      if (frame >= cue.startFrameEstimate - (cue.leadFrames ?? leadFrames)) {
        activated.add(cue.target);
      }
    }

    const lastCue = cueList[cueList.length - 1];
    const lastCueStart = lastCue
      ? lastCue.startFrameEstimate - (lastCue.leadFrames ?? leadFrames)
      : 0;
    const stabilizeProgress = lastCue
      ? interpolate(frame, [lastCueStart, lastCueStart + 60], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

    return {
      activeTarget,
      targetOpacity: (target: string) => {
        if (target === activeTarget) return 1;
        if (activated.has(target)) {
          const ai = cueList.findIndex((c) => c.target === target);
          const ci = cueList.findIndex((c) => c.target === activeTarget);
          const base = Math.max(0.72, 1 - Math.abs(ci - ai) * 0.08);
          return interpolate(stabilizeProgress, [0, 1], [base, 0.92]);
        }
        return interpolate(stabilizeProgress, [0, 1], [0.42, 0.92]);
      },
    };
  }

  // strict-switch
  let switchFrame = 0;
  if (activeCue) {
    switchFrame =
      activeCue.startFrameEstimate - (activeCue.leadFrames ?? leadFrames);
  }

  return {
    activeTarget,
    targetOpacity: (target: string) => {
      if (target === activeTarget) {
        return interpolate(
          frame,
          [switchFrame, switchFrame + decayFrames],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
      }
      return interpolate(
        frame,
        [switchFrame, switchFrame + decayFrames],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );
    },
  };
}

/**
 * getSpotlightVisualState: 获取白底 spotlight 完整视觉状态
 */
export function getSpotlightVisualState(
  target: string,
  activeTarget: string,
  targetOpacity: (target: string) => number,
  mode: "strict-switch" | "progressive-retain" = "strict-switch",
  stabilizeProgress: number = 0,
): SpotlightVisualState {
  const op = targetOpacity(target);
  const isActive = target === activeTarget;

  if (mode === "progressive-retain") {
    const { current, activated, unactivated, stable } =
      WHITE_SPOTLIGHT_PROGRESSIVE;

    const lerp = (from: number, to: number) =>
      interpolate(op, [0, 1], [from, to], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

    const translateX = isActive
      ? interpolate(stabilizeProgress, [0, 1], [current.translateX, 0])
      : 0;
    const chipOp = isActive
      ? interpolate(stabilizeProgress, [0, 1], [1, 0])
      : 0;

    return {
      cardOpacity: 1,
      scale: lerp(unactivated.scale, current.scale),
      translateY: 0,
      sideRailOpacity: lerp(
        unactivated.sideRailOpacity,
        current.sideRailOpacity,
      ),
      chipOpacity: chipOp,
      titleOpacity: lerp(unactivated.titleOpacity, current.titleOpacity),
      textOpacity: lerp(unactivated.textOpacity, current.textOpacity),
      bgTintOpacity: lerp(unactivated.bgTintOpacity, current.bgTintOpacity),
      borderOpacity: lerp(unactivated.borderOpacity, current.borderOpacity),
      shadowStrength: lerp(unactivated.shadowStrength, current.shadowStrength),
      translateX,
    };
  }

  // strict-switch
  const { active, inactive } = WHITE_SPOTLIGHT_STRICT;

  const lerp = (from: number, to: number) =>
    interpolate(op, [0, 1], [from, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return {
    cardOpacity: 1,
    scale: lerp(inactive.scale, active.scale),
    translateY: isActive ? lerp(0, active.translateY) : 0,
    sideRailOpacity: lerp(0, active.sideRailOpacity),
    chipOpacity: isActive ? lerp(0, 1) : 0,
    titleOpacity: lerp(inactive.titleOpacity, active.titleOpacity),
    textOpacity: lerp(inactive.textOpacity, active.textOpacity),
    bgTintOpacity: lerp(0, active.bgTintOpacity),
    borderOpacity: lerp(inactive.borderOpacity, active.borderOpacity),
    shadowStrength: lerp(inactive.shadowStrength, active.shadowStrength),
    translateX: 0,
  };
}
