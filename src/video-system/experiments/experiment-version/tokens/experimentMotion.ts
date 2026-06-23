import { Easing, spring, interpolate } from "remotion";

// ─── 试验版动效 token ─────────────────────────────────
// frame-driven only, 禁止 CSS transition/animation

export const EASE_OUT_CRISP = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT_EDITORIAL = Easing.bezier(0.45, 0, 0.55, 1);
export const EASE_OVERSHOOT = Easing.bezier(0.34, 1.56, 0.64, 1);

export const expMotion = {
  enter: { durationFrames: 15, translateY: 30, easing: EASE_OUT_CRISP },
  emphasis: { durationFrames: 9, scale: 1.02, easing: EASE_OVERSHOOT },
  fade: { durationFrames: 18, easing: EASE_IN_OUT_EDITORIAL },
  stagger: { delayFrames: 15, durationFrames: 15 },
  spring: { damping: 12, stiffness: 100, mass: 0.5 },
  transition: { durationFrames: 12 },
} as const;

/** fadeSlideIn: 组合 fade + slide-up */
export function expFadeSlideIn(
  frame: number,
  fps: number,
  delay: number = 0,
  durationFrames: number = expMotion.enter.durationFrames,
): { opacity: number; translateY: number } {
  const progress = interpolate(frame - delay, [0, durationFrames], [0, 1], {
    easing: EASE_OUT_CRISP,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return {
    opacity: progress,
    translateY: interpolate(progress, [0, 1], [expMotion.enter.translateY, 0]),
  };
}

/** spring 入场（返回 0-1 进度） */
export function expSpringIn(frame: number, fps: number, delay = 0): number {
  return spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: expMotion.spring,
  });
}

/** progressiveReveal: 逐个出现 */
export function expProgressiveReveal(
  frame: number,
  fps: number,
  index: number,
  delayFrames: number = expMotion.stagger.delayFrames,
  durationFrames: number = expMotion.stagger.durationFrames,
): { visible: boolean; opacity: number; translateY: number } {
  const delay = index * delayFrames;
  const progress = interpolate(frame - delay, [0, durationFrames], [0, 1], {
    easing: EASE_OUT_CRISP,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return {
    visible: progress > 0.01,
    opacity: progress,
    translateY: interpolate(progress, [0, 1], [20, 0]),
  };
}

/** 三档可见性 */
export function expHighlightOpacity(
  index: number,
  currentIndex: number,
): number {
  const distance = Math.abs(index - currentIndex);
  if (distance === 0) return 1;
  if (distance === 1) return 0.65;
  return 0.4;
}

/** 轻微脉冲缩放 */
export function expGentlePulse(
  frame: number,
  min = 1.0,
  max = 1.03,
  speed = 0.05,
): number {
  const pulse = (Math.sin(frame * speed) + 1) / 2;
  return interpolate(pulse, [0, 1], [min, max]);
}

/** 平滑 active 切换 */
export function expActiveTransition(
  frame: number,
  switchFrame: number,
  decayFrames: number,
): number {
  return interpolate(
    frame,
    [switchFrame, switchFrame + decayFrames],
    [0.4, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
}
