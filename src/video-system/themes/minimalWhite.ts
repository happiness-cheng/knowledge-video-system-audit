/**
 * 极简白主题
 *
 * 视觉特征：纯白底 + 黑色强调 + 克制高级感
 * 来源：html-ppt-skill 的 minimal-white 主题
 */

import type { VideoTheme } from "./types";

export const minimalWhite: VideoTheme = {
  id: "minimal-white",
  name: "极简白",

  background: "#FFFFFF",
  backgroundAlt: "#FAFAFA",
  primaryText: "#0C0D10",
  secondaryText: "#55596A",
  accentColor: "#111216",
  accentGradient: "linear-gradient(135deg, #111216 0%, #3B3F4A 100%)",
  cardBackground: "#FFFFFF",
  cardBorder: "rgba(17,18,22,0.08)",
  success: "#1AAF6C",
  warning: "#C98500",
  danger: "#C13A3A",

  shadow: "0 1px 2px rgba(17,18,22,0.04), 0 8px 24px rgba(17,18,22,0.06)",
  shadowLg: "0 20px 60px rgba(17,18,22,0.1)",

  fontFamily: "'Inter','Noto Sans SC',sans-serif",
  monoFont: "'JetBrains Mono','Courier New',monospace",

  titleStyle: {
    fontSize: 84,
    fontWeight: 850,
    lineHeight: 1.02,
    letterSpacing: -3,
  },

  subtitleStyle: {
    fontSize: 28,
    fontWeight: 400,
    lineHeight: 1.45,
  },

  tagStyle: {
    fontSize: 14,
    fontWeight: 600,
    padding: "8px 16px",
    borderRadius: 999,
    border: "1px solid rgba(17,18,22,0.08)",
    background: "#F5F5F6",
    color: "#55596A",
  },

  cardStyle: {
    borderRadius: 14,
    padding: "28px 32px",
    border: "1px solid rgba(17,18,22,0.08)",
    background: "#FFFFFF",
  },

  spacing: {
    page: "60px 88px",
    section: 28,
    item: 18,
    element: 12,
  },

  radius: {
    sm: 8,
    md: 14,
    lg: 22,
    full: 999,
  },

  toplineGradient: "linear-gradient(90deg, #111216, #3B3F4A, #6B6F7A)",
};
