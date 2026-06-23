// ─── V2 色彩 token 系统 ─────────────────────────────────
// 三套主题色：dark-premium / white-editorial / blueprint

export const darkPremium = {
  bg: "#0c0c14",
  bgAlt: "#12121f",
  bgCard: "rgba(255,255,255,0.04)",
  bgCardActive: "rgba(99,102,241,0.08)",
  border: "rgba(255,255,255,0.08)",
  borderActive: "rgba(99,102,241,0.4)",
  textPrimary: "#f0f0f5",
  textSecondary: "#a0a0b8",
  textMuted: "#6a6a80",
  accent: "#6366f1",
  accentLight: "#818cf8",
  accentGradient: "linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)",
  success: "#34d399",
  danger: "#f87171",
  warning: "#fbbf24",
  glow: "rgba(99,102,241,0.12)",
  shadow: "0 4px 24px rgba(0,0,0,0.2)",
} as const;

export const whiteEditorial = {
  bg: "#fafafa",
  bgAlt: "#f0f0f0",
  bgCard: "rgba(0,0,0,0.03)",
  bgCardActive: "rgba(99,102,241,0.06)",
  border: "rgba(0,0,0,0.08)",
  borderActive: "rgba(99,102,241,0.3)",
  textPrimary: "#1a1a2e",
  textSecondary: "#4a4a60",
  textMuted: "#8a8aa0",
  accent: "#6366f1",
  accentLight: "#818cf8",
  accentGradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  success: "#10b981",
  danger: "#ef4444",
  warning: "#f59e0b",
  glow: "rgba(99,102,241,0.08)",
  shadow: "0 2px 16px rgba(0,0,0,0.06)",
} as const;

export const blueprintGrid = {
  bg: "#f5f0e8",
  bgAlt: "#ebe6de",
  bgCard: "rgba(0,0,0,0.04)",
  bgCardActive: "rgba(190,80,60,0.06)",
  border: "rgba(0,0,0,0.12)",
  borderActive: "rgba(190,80,60,0.4)",
  textPrimary: "#2a2a3a",
  textSecondary: "#5a5a70",
  textMuted: "#8a8a9a",
  accent: "#be503c",
  accentLight: "#d97757",
  accentGradient: "linear-gradient(135deg, #be503c 0%, #d97757 100%)",
  success: "#059669",
  danger: "#dc2626",
  warning: "#d97706",
  glow: "rgba(190,80,60,0.08)",
  shadow: "0 2px 16px rgba(0,0,0,0.08)",
} as const;

export type ColorTheme = typeof darkPremium;

export const themes = {
  "dark-premium": darkPremium,
  "white-editorial": whiteEditorial,
  "blueprint-grid": blueprintGrid,
} as const;

export type ThemeId = keyof typeof themes;
