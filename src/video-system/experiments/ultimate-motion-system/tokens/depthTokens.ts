// ─── V2 深度 token ─────────────────────────────────────
// z-index 层级、阴影、模糊

export const depth = {
  z: {
    background: 0,
    content: 10,
    card: 20,
    overlay: 30,
    focus: 40,
    badge: 50,
    modal: 60,
  },
  shadow: {
    none: "none",
    sm: "0 1px 4px rgba(0,0,0,0.06)",
    md: "0 4px 16px rgba(0,0,0,0.1)",
    lg: "0 8px 32px rgba(0,0,0,0.15)",
    xl: "0 16px 48px rgba(0,0,0,0.2)",
    glow: (color: string) => `0 0 24px ${color}`,
  },
  blur: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 16,
  },
} as const;
