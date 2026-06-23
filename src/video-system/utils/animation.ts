/**
 * 动画工具
 *
 * 统一管理入场动画和进度计算。
 * 所有动画基于 Remotion 的 interpolate + spring + Easing，不使用 CSS 动画。
 *
 * 官方最佳实践（timing.md）：
 * - Easing.bezier(x1, y1, x2, y2) 用于自定义缓动曲线
 * - Easing.out 用于入场动画（先快后慢）
 * - Easing.in 用于退场动画（先慢后快）
 */

import { spring, interpolate, Easing } from "remotion";

// ─── 动画模式类型 ─────────────────────────────────
export type AnimationMode =
  | "none"
  | "fade-in"
  | "slow-zoom"
  | "slide-up"
  | "progressive-reveal"
  | "highlight-current";

// ─── 入场动画参数 ─────────────────────────────────
export interface AnimateInParams {
  frame: number;
  fps: number;
  delay?: number; // 帧数
  duration?: number; // 帧数
}

// ─── 官方推荐缓动曲线（timing.md）────────────────
/** Crisp UI entrance — 强 ease-out，无过冲，适合入场 */
export const EASE_OUT_CRISP = Easing.bezier(0.16, 1, 0.3, 1);
/** Editorial slow fade — 平衡 ease-in-out，适合渐变 */
export const EASE_IN_OUT_EDITORIAL = Easing.bezier(0.45, 0, 0.55, 1);
/** Playful overshoot — 略微过冲再回弹，适合强调 */
export const EASE_OVERSHOOT = Easing.bezier(0.34, 1.56, 0.64, 1);

/**
 * 计算 fade-in 动画的 opacity（使用 Easing.bezier）
 */
export function fadeIn({ frame, fps, delay = 0 }: AnimateInParams): number {
  const duration = 0.6 * fps; // 0.6 秒
  return interpolate(frame - delay, [0, duration], [0, 1], {
    easing: EASE_OUT_CRISP,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/**
 * 计算 slide-up 动画的 translateY（从 30px → 0，使用 Easing.bezier）
 */
export function slideUp({ frame, fps, delay = 0 }: AnimateInParams): number {
  const duration = 0.5 * fps; // 0.5 秒
  const progress = interpolate(frame - delay, [0, duration], [0, 1], {
    easing: EASE_OUT_CRISP,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return interpolate(progress, [0, 1], [30, 0]);
}

/**
 * 计算 slow-zoom 动画的 scale（从 1.0 → 1.04）
 */
export function slowZoom(frame: number, totalFrames: number): number {
  return interpolate(frame, [0, totalFrames], [1.0, 1.04], {
    extrapolateRight: "clamp",
  });
}

/**
 * 组合 fade-in + slide-up
 */
export function fadeSlideIn(params: AnimateInParams): {
  opacity: number;
  translateY: number;
} {
  return {
    opacity: fadeIn(params),
    translateY: slideUp(params),
  };
}

/**
 * 渐进式揭示：计算第 index 个元素是否可见，以及其 opacity
 * 用于 flow-diagram / process-steps / roadmap
 */
export function progressiveReveal({
  frame,
  fps,
  index,
  total,
  staggerDelay = 12,
}: {
  frame: number;
  fps: number;
  index: number;
  total: number;
  staggerDelay?: number;
}): { visible: boolean; opacity: number; translateY: number } {
  const delay = index * staggerDelay;
  const duration = 0.5 * fps;
  const progress = interpolate(frame - delay, [0, duration], [0, 1], {
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

/**
 * 高亮当前节点：根据帧数计算当前活跃节点索引
 * 用于 flow-diagram / process-steps / roadmap 的 highlight-current 模式
 */
export function highlightCurrent({
  frame,
  fps,
  total,
  totalFrames,
}: {
  frame: number;
  fps: number;
  total: number;
  totalFrames: number;
}): number {
  const segmentFrames = totalFrames / total;
  return Math.min(Math.floor(frame / segmentFrames), total - 1);
}

/**
 * 逐字出现动画（typewriter effect）
 * 官方推荐：用字符串切片，不用逐字符 opacity
 */
export function typewriter(
  frame: number,
  fps: number,
  text: string,
  delay = 0,
): string {
  const charsPerSecond = 15;
  const elapsed = Math.max(0, frame - delay);
  const charCount = Math.min(
    Math.floor((elapsed / fps) * charsPerSecond),
    text.length,
  );
  return text.slice(0, charCount);
}

/**
 * 关键词高亮动画（word highlight effect）
 * 返回高亮进度 0-1，用于背景色渐变
 */
export function wordHighlight({
  frame,
  fps,
  delay = 0,
  duration = 0.4,
}: {
  frame: number;
  fps: number;
  delay?: number;
  duration?: number;
}): number {
  return interpolate(frame - delay, [0, duration * fps], [0, 1], {
    easing: EASE_OUT_CRISP,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/**
 * 脉冲光晕：入场完成后持续脉冲 box-shadow
 * 用于 HighlightBox 入场后引导视线
 */
export function pulseGlow(
  frame: number,
  fps: number,
  color: string,
  delay = 0,
): string {
  const elapsed = Math.max(0, frame - delay);
  const frequency = 0.08;
  const pulse = (Math.sin(elapsed * frequency) + 1) / 2;
  const opacity = interpolate(pulse, [0, 1], [0.3, 0.7]);
  return `0 0 12px 3px ${color}${Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0")}`;
}

/**
 * 渐进入场 + 后续高亮当前项
 * 入场阶段：逐个出现（progressiveReveal）
 * 入场后：当前项更亮，相邻弱化，远距更弱
 */
export function sequenceHighlight({
  frame,
  fps,
  index,
  total,
  totalFrames,
  staggerDelay = 15,
}: {
  frame: number;
  fps: number;
  index: number;
  total: number;
  totalFrames: number;
  staggerDelay?: number;
}): {
  visible: boolean;
  opacity: number;
  translateY: number;
  isCurrent: boolean;
  dimmed: boolean;
} {
  const entranceDuration = 0.5 * fps;
  const delay = index * staggerDelay;
  const entranceEnd = (total - 1) * staggerDelay + entranceDuration;

  // 入场阶段
  if (frame < entranceEnd) {
    const progress = interpolate(frame - delay, [0, entranceDuration], [0, 1], {
      easing: EASE_OUT_CRISP,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return {
      visible: progress > 0.01,
      opacity: progress,
      translateY: interpolate(progress, [0, 1], [20, 0]),
      isCurrent: false,
      dimmed: false,
    };
  }

  // 入场后：高亮当前项
  const activeIdx = highlightCurrent({
    frame,
    fps,
    total,
    totalFrames,
  });
  const distance = Math.abs(index - activeIdx);
  let highlightOpacity: number;
  if (distance === 0) {
    highlightOpacity = 1;
  } else if (distance === 1) {
    highlightOpacity = 0.65;
  } else {
    highlightOpacity = 0.4;
  }

  return {
    visible: true,
    opacity: highlightOpacity,
    translateY: 0,
    isCurrent: index === activeIdx,
    dimmed: distance > 1,
  };
}
