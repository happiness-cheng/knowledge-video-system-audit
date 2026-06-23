/**
 * 新野蛮主义主题
 *
 * 视觉特征：厚描边 + 硬阴影 + 明黄强调 + 黑白高对比
 * 来源：html-ppt-skill 的 neo-brutalism 主题
 */

import type { VideoTheme } from "./types";

export const neoBrutalism: VideoTheme = {
  id: "neo-brutalism",
  name: "新野蛮主义",

  background: "#FFFEF0",
  backgroundAlt: "#FFFBD0",
  primaryText: "#000000",
  secondaryText: "#222222",
  accentColor: "#FFD400",
  accentGradient: "linear-gradient(135deg, #FFD400 0%, #FF5CA8 100%)",
  cardBackground: "#FFFFFF",
  cardBorder: "#000000",
  success: "#00B36B",
  warning: "#FF9900",
  danger: "#FF3A30",

  shadow: "6px 6px 0 #000",
  shadowLg: "10px 10px 0 #000",

  fontFamily: "'Space Grotesk','Inter','Noto Sans SC',sans-serif",
  monoFont: "'JetBrains Mono','Courier New',monospace",

  titleStyle: {
    fontSize: 80,
    fontWeight: 900,
    lineHeight: 1.0,
    letterSpacing: -2,
  },

  subtitleStyle: {
    fontSize: 26,
    fontWeight: 600,
    lineHeight: 1.4,
  },

  tagStyle: {
    fontSize: 14,
    fontWeight: 800,
    padding: "8px 18px",
    borderRadius: 6,
    border: "2px solid #000",
    background: "#FFD400",
    color: "#000",
  },

  cardStyle: {
    borderRadius: 6,
    padding: "28px 32px",
    border: "3px solid #000",
    background: "#FFFFFF",
  },

  spacing: {
    page: "60px 88px",
    section: 28,
    item: 18,
    element: 12,
  },

  radius: {
    sm: 4,
    md: 6,
    lg: 10,
    full: 999,
  },

  toplineGradient: "linear-gradient(90deg, #FFD400, #FF5CA8, #3A7CFF)",
};
