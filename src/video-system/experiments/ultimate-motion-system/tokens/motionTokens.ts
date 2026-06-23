import { Easing } from "remotion";

// ─── V2 Motion Token 系统 ─────────────────────────────

export const EASE_OUT_CRISP = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT_EDITORIAL = Easing.bezier(0.45, 0, 0.55, 1);
export const EASE_OVERSHOOT = Easing.bezier(0.34, 1.56, 0.64, 1);
export const EASE_SPRING = Easing.bezier(0.22, 1.2, 0.36, 1);

export const motionTokens = {
  enter: { duration: 15, translateY: 30, easing: EASE_OUT_CRISP },
  exit: { duration: 12, translateY: -15, easing: EASE_IN_OUT_EDITORIAL },
  emphasis: { duration: 9, scale: 1.02, easing: EASE_OVERSHOOT },
  fade: { duration: 18, easing: EASE_IN_OUT_EDITORIAL },
  stagger: { delay: 15, duration: 15 },
  spring: { damping: 12, stiffness: 100, mass: 0.5 },
  springBouncy: { damping: 8, stiffness: 120, mass: 0.4 },
  springCalm: { damping: 18, stiffness: 80, mass: 0.6 },
  transition: { duration: 12 },
  breathe: { speed: 0.04, minScale: 1.0, maxScale: 1.006 },
  pulse: { speed: 0.05, minScale: 1.0, maxScale: 1.03 },
  focusGlow: { speed: 0.03, minOpacity: 0.08, maxOpacity: 0.15 },
  backgroundDrift: { speed: 0.02, range: 20 },
} as const;
