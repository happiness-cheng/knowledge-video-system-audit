/**
 * 极光主题
 *
 * 视觉特征：深色底 + 三色极光光晕 + 网格点
 * 来源：html-ppt-skill 的 aurora 主题
 */

import type { VideoTheme } from "./types";

export const auroraTheme: VideoTheme = {
  id: "aurora",
  name: "极光",

  background: "#06091C",
  backgroundAlt: "#0A1130",
  primaryText: "#E8F0FF",
  secondaryText: "#B4C4E4",
  accentColor: "#5EF2C6",
  accentGradient:
    "linear-gradient(135deg, #5EF2C6 0%, #7AA2FF 50%, #C984FF 100%)",
  cardBackground: "rgba(255,255,255,0.05)",
  cardBorder: "rgba(180,220,255,0.14)",
  success: "#5EF2C6",
  warning: "#FFD27A",
  danger: "#FF8AB0",

  shadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
  shadowLg: "0 30px 80px rgba(0,0,0,0.55)",

  fontFamily: "'Inter','Noto Sans SC',system-ui,sans-serif",
  monoFont: "'JetBrains Mono','Courier New',monospace",

  titleStyle: {
    fontSize: 84,
    fontWeight: 850,
    lineHeight: 1.02,
    letterSpacing: -2,
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
    border: "1px solid rgba(94,242,198,0.3)",
    background: "rgba(94,242,198,0.1)",
    color: "#5EF2C6",
  },

  cardStyle: {
    borderRadius: 20,
    padding: "28px 32px",
    border: "1px solid rgba(180,220,255,0.14)",
    background: "rgba(255,255,255,0.05)",
  },

  spacing: {
    page: "60px 88px",
    section: 28,
    item: 18,
    element: 12,
  },

  radius: {
    sm: 14,
    md: 20,
    lg: 28,
    full: 999,
  },

  toplineGradient: "linear-gradient(90deg, #5EF2C6, #7AA2FF, #C984FF)",
};
