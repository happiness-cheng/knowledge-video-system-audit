import { spring, interpolate } from "remotion";
import { motionTokens, EASE_OUT_CRISP } from "./tokens/motionTokens";

// ─── V2 Motion Primitives 注册表 ─────────────────────
// 16 个可复用动效原语

export interface MotionPrimitive {
  name: string;
  description: string;
  params: string;
  defaults: Record<string, number>;
  forbidden: string;
  migrability: "direct" | "minor-edit" | "reference-only";
}

export const primitiveRegistry: MotionPrimitive[] = [
  {
    name: "springEnter",
    description: "弹性入场，从下方弹入",
    params: "frame, fps, delay, config",
    defaults: { delay: 0, translateY: 30 },
    forbidden: "不适合连续快速切换的元素",
    migrability: "direct",
  },
  {
    name: "fadeSlide",
    description: "淡入+滑入组合",
    params: "frame, fps, delay, duration, translateY",
    defaults: { delay: 0, duration: 15, translateY: 30 },
    forbidden: "不适合需要弹性感的入场",
    migrability: "direct",
  },
  {
    name: "staggerReveal",
    description: "逐个出现，按 index 延迟",
    params: "frame, fps, index, delayPerItem, duration",
    defaults: { delayPerItem: 15, duration: 15 },
    forbidden: "不适合需要同时出现的元素",
    migrability: "direct",
  },
  {
    name: "cueActive",
    description: "cue 驱动的 active 状态切换",
    params: "frame, cues, leadFrames, decayFrames",
    defaults: { leadFrames: 10, decayFrames: 15 },
    forbidden: "不适合无时序关系的静态页面",
    migrability: "direct",
  },
  {
    name: "progressiveRetain",
    description: "逐步激活，已激活保持可见",
    params: "frame, cues, leadFrames",
    defaults: { leadFrames: 10 },
    forbidden: "不适合需要严格切换的场景",
    migrability: "direct",
  },
  {
    name: "breathe",
    description: "极轻微缩放呼吸",
    params: "frame, speed, minScale, maxScale",
    defaults: { speed: 0.04, minScale: 1.0, maxScale: 1.006 },
    forbidden: "不适合文字密集区域",
    migrability: "direct",
  },
  {
    name: "pulse",
    description: "脉冲缩放，用于按钮/强调",
    params: "frame, speed, minScale, maxScale",
    defaults: { speed: 0.05, minScale: 1.0, maxScale: 1.03 },
    forbidden: "不适合大面积背景",
    migrability: "direct",
  },
  {
    name: "focusGlow",
    description: "聚焦发光效果",
    params: "frame, color, speed",
    defaults: { speed: 0.03 },
    forbidden: "不适合无 active 状态的元素",
    migrability: "minor-edit",
  },
  {
    name: "cardLift",
    description: "active 时卡片轻微抬起",
    params: "activeOpacity, baseScale, activeScale",
    defaults: { baseScale: 0.98, activeScale: 1.01 },
    forbidden: "不适合不需要强调的卡片",
    migrability: "direct",
  },
  {
    name: "evidenceFocus",
    description: "证据卡片聚焦，带边框高亮",
    params: "activeOpacity, borderColor",
    defaults: {},
    forbidden: "不适合非证据类内容",
    migrability: "minor-edit",
  },
  {
    name: "textEmphasis",
    description: "文字强调，渐变色+字重变化",
    params: "text, keywords, gradient",
    defaults: {},
    forbidden: "不适合短文本（<4字）",
    migrability: "minor-edit",
  },
  {
    name: "backgroundDrift",
    description: "背景缓慢漂移",
    params: "frame, durationInFrames, speed",
    defaults: { speed: 0.02 },
    forbidden: "不适合浅色简约主题",
    migrability: "minor-edit",
  },
  {
    name: "semanticHighlight",
    description: "语义块高亮，底色条",
    params: "text, keywords, highlightColor",
    defaults: {},
    forbidden: "不适合截图标注（坐标不准）",
    migrability: "direct",
  },
  {
    name: "transitionFade",
    description: "场景间 fade 转场",
    params: "durationFrames",
    defaults: { duration: 12 },
    forbidden: "快节奏连续切换",
    migrability: "direct",
  },
  {
    name: "transitionSlide",
    description: "场景间 slide 转场",
    params: "durationFrames, direction",
    defaults: { duration: 15 },
    forbidden: "同方向连续使用",
    migrability: "minor-edit",
  },
  {
    name: "transitionWipe",
    description: "场景间 wipe 转场",
    params: "durationFrames, direction",
    defaults: { duration: 15 },
    forbidden: "不适合频繁使用",
    migrability: "reference-only",
  },
];

// ─── Primitive 实现函数 ─────────────────────────────

/** springEnter: 弹性入场 */
export function springEnter(
  frame: number,
  fps: number,
  delay = 0,
  config = motionTokens.spring,
): number {
  return spring({
    frame: Math.max(0, frame - delay),
    fps,
    config,
  });
}

/** fadeSlide: 淡入+滑入 */
export function fadeSlide(
  frame: number,
  fps: number,
  delay = 0,
  duration = motionTokens.enter.duration,
  translateY = motionTokens.enter.translateY,
): { opacity: number; translateY: number } {
  const p = interpolate(frame - delay, [0, duration], [0, 1], {
    easing: EASE_OUT_CRISP,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return {
    opacity: p,
    translateY: interpolate(p, [0, 1], [translateY, 0]),
  };
}

/** staggerReveal: 逐个出现 */
export function staggerReveal(
  frame: number,
  fps: number,
  index: number,
  delayPerItem: number = motionTokens.stagger.delay,
  duration: number = motionTokens.stagger.duration,
): { visible: boolean; opacity: number; translateY: number } {
  const delay = index * delayPerItem;
  const p = interpolate(frame - delay, [0, duration], [0, 1], {
    easing: EASE_OUT_CRISP,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return {
    visible: p > 0.01,
    opacity: p,
    translateY: interpolate(p, [0, 1], [20, 0]),
  };
}

/** breathe: 极轻微呼吸 */
export function breathe(
  frame: number,
  speed: number = motionTokens.breathe.speed,
  min: number = motionTokens.breathe.minScale,
  max: number = motionTokens.breathe.maxScale,
): number {
  return interpolate(Math.sin(frame * speed), [-1, 1], [min, max]);
}

/** pulse: 脉冲缩放 */
export function pulse(
  frame: number,
  speed: number = motionTokens.pulse.speed,
  min: number = motionTokens.pulse.minScale,
  max: number = motionTokens.pulse.maxScale,
): number {
  const t = (Math.sin(frame * speed) + 1) / 2;
  return interpolate(t, [0, 1], [min, max]);
}

/** cardLift: active 卡片抬起 */
export function cardLift(
  activeOpacity: number,
  baseScale = 0.98,
  activeScale = 1.01,
): number {
  return interpolate(activeOpacity, [0.4, 1], [baseScale, activeScale], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/** focusGlow: 聚焦发光 opacity */
export function focusGlow(
  frame: number,
  speed: number = motionTokens.focusGlow.speed,
  min: number = motionTokens.focusGlow.minOpacity,
  max: number = motionTokens.focusGlow.maxOpacity,
): number {
  return interpolate(Math.sin(frame * speed), [-1, 1], [min, max]);
}

/** highlightOpacity: 三档可见性 */
export function highlightOpacity(
  index: number,
  currentIndex: number,
): number {
  const d = Math.abs(index - currentIndex);
  if (d === 0) return 1;
  if (d === 1) return 0.65;
  return 0.4;
}
