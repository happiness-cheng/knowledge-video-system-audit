/**
 * Obsidian 渐变主题
 *
 * 视觉特征：深紫暗底 + GitHub 风格渐变卡 + 网格底纹
 * 来源：html-ppt-skill 的 obsidian-claude-gradient 模板
 */

import type { VideoTheme } from "./types";

export const obsidianClaudeGradient: VideoTheme = {
  id: "obsidian-claude-gradient",
  name: "Obsidian 渐变",

  background: "#0D1117",
  backgroundAlt: "#161B22",
  primaryText: "#E6EDF3",
  secondaryText: "#8B949E",
  accentColor: "#7C3AED",
  accentGradient:
    "linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #C084FC 100%)",
  cardBackground: "#161B22",
  cardBorder: "#30363D",
  success: "#3FB950",
  warning: "#FBBF24",
  danger: "#F87171",

  shadow: "0 10px 30px rgba(0,0,0,0.4)",
  shadowLg: "0 22px 58px rgba(0,0,0,0.55)",

  fontFamily: "'Inter','Noto Sans SC','PingFang SC',sans-serif",
  monoFont: "'JetBrains Mono','Courier New',monospace",

  titleStyle: {
    fontSize: 72,
    fontWeight: 800,
    lineHeight: 1.08,
    letterSpacing: -1.5,
  },

  subtitleStyle: {
    fontSize: 26,
    fontWeight: 400,
    lineHeight: 1.5,
  },

  tagStyle: {
    fontSize: 12,
    fontWeight: 700,
    padding: "5px 16px",
    borderRadius: 999,
    border: "1px solid rgba(168,85,247,0.3)",
    background: "rgba(124,58,237,0.14)",
    color: "#C084FC",
  },

  cardStyle: {
    borderRadius: 14,
    padding: "22px 26px",
    border: "1px solid #30363D",
    background: "#161B22",
  },

  spacing: {
    page: "64px 88px",
    section: 24,
    item: 16,
    element: 10,
  },

  radius: {
    sm: 8,
    md: 14,
    lg: 22,
    full: 999,
  },

  toplineGradient: "linear-gradient(90deg, #7C3AED, #A855F7, #C084FC)",

  softColors: {
    gridLine: "rgba(48,54,61,0.4)",
    glow1: "rgba(124,58,237,0.25)",
    glow2: "rgba(88,166,255,0.18)",
  },
};
