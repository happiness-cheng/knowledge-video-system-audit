import { Easing, spring, interpolate } from "remotion";

// ─── 缓动曲线（来自官方 timing.md）──────────────────
/** Crisp UI entrance — 强 ease-out，无过冲，适合入场 */
export const EASE_OUT_CRISP = Easing.bezier(0.16, 1, 0.3, 1);
/** Editorial slow fade — 平衡 ease-in-out，适合渐变 */
export const EASE_IN_OUT_EDITORIAL = Easing.bezier(0.45, 0, 0.55, 1);
/** Playful overshoot — 略微过冲再回弹，适合强调 */
export const EASE_OVERSHOOT = Easing.bezier(0.34, 1.56, 0.64, 1);

// ─── 动效 token ─────────────────────────────────────
export const motion = {
  // 入场动画
  enter: {
    durationFrames: 15, // 0.5s @ 30fps
    translateY: 30,
    easing: EASE_OUT_CRISP,
  },
  // 强调动画
  emphasis: {
    durationFrames: 9, // 0.3s @ 30fps
    scale: 1.02,
    easing: EASE_OVERSHOOT,
  },
  // 渐变动画
  fade: {
    durationFrames: 18, // 0.6s @ 30fps
    easing: EASE_IN_OUT_EDITORIAL,
  },
  // progressive-reveal 间隔
  stagger: {
    delayFrames: 15,
    durationFrames: 15,
  },
  // spring 配置（用于标题弹性入场）
  spring: {
    damping: 12,
    stiffness: 100,
    mass: 0.5,
  },
  // TransitionSeries 转场
  transition: {
    durationFrames: 12, // 0.4s @ 30fps
  },
} as const;

// ─── 动画工具函数 ───────────────────────────────────

/** fadeSlideIn：组合 fade + slide-up */
export function fadeSlideIn(
  frame: number,
  fps: number,
  delay = 0,
  durationFrames: number = motion.enter.durationFrames,
): { opacity: number; translateY: number } {
  const progress = interpolate(frame - delay, [0, durationFrames], [0, 1], {
    easing: EASE_OUT_CRISP,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return {
    opacity: progress,
    translateY: interpolate(progress, [0, 1], [motion.enter.translateY, 0]),
  };
}

/** spring 入场（返回 0-1 进度） */
export function springIn(frame: number, fps: number, delay = 0): number {
  return spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: motion.spring,
  });
}

/** progressiveReveal：逐个出现 */
export function progressiveReveal(
  frame: number,
  fps: number,
  index: number,
  delayFrames: number = motion.stagger.delayFrames,
  durationFrames: number = motion.stagger.durationFrames,
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

/** 高亮当前项（三档可见性） */
export function highlightOpacity(index: number, currentIndex: number): number {
  const distance = Math.abs(index - currentIndex);
  if (distance === 0) return 1;
  if (distance === 1) return 0.65;
  return 0.4;
}

/** 轻微脉冲缩放（用于 CTA 按钮呼吸效果） */
export function gentlePulse(
  frame: number,
  fps: number,
  min = 1.0,
  max = 1.03,
  speed = 0.05,
): number {
  const pulse = (Math.sin(frame * speed) + 1) / 2;
  return interpolate(pulse, [0, 1], [min, max]);
}
