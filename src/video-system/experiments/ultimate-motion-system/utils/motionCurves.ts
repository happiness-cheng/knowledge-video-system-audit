import { Easing } from "remotion";

// ─── 缓动曲线库 ─────────────────────────────────────

export const curves = {
  easeOutCrisp: Easing.bezier(0.16, 1, 0.3, 1),
  easeInOutEditorial: Easing.bezier(0.45, 0, 0.55, 1),
  easeOvershoot: Easing.bezier(0.34, 1.56, 0.64, 1),
  easeSpring: Easing.bezier(0.22, 1.2, 0.36, 1),
  easeSmooth: Easing.bezier(0.25, 0.1, 0.25, 1),
  easeBounce: Easing.bezier(0.68, -0.55, 0.265, 1.55),
} as const;
