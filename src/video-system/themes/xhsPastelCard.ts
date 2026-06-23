/**
 * 小红书粉彩卡主题
 *
 * 视觉特征：暖米底 + 马卡龙色块 + 圆润卡片 + 衬线字体
 * 来源：html-ppt-skill 的 xhs-pastel-card 模板
 */

import type { VideoTheme } from "./types";

export const xhsPastelCard: VideoTheme = {
  id: "xhs-pastel-card",
  name: "小红书粉彩卡",

  background: "#FEF8F1",
  backgroundAlt: "#FDF2E9",
  primaryText: "#2A2340",
  secondaryText: "#5B5470",
  accentColor: "#7B5DC4",
  accentGradient:
    "linear-gradient(135deg, #FFD8C2 0%, #C9DCFB 35%, #DDD0F5 65%, #FCD0DD 100%)",
  cardBackground: "#FFFFFF",
  cardBorder: "rgba(42,35,64,0.1)",
  success: "#2E9D70",
  warning: "#C8910A",
  danger: "#C94673",

  shadow: "0 14px 40px rgba(42,35,64,0.08)",
  shadowLg: "0 24px 70px rgba(181,213,240,0.3)",

  fontFamily:
    "'Playfair Display','Noto Serif SC','Inter','Noto Sans SC',Georgia,serif",
  monoFont: "'JetBrains Mono','Courier New',monospace",

  titleStyle: {
    fontSize: 96,
    fontWeight: 850,
    lineHeight: 1.05,
    letterSpacing: -2,
  },

  subtitleStyle: {
    fontSize: 26,
    fontWeight: 400,
    lineHeight: 1.5,
  },

  tagStyle: {
    fontSize: 14,
    fontWeight: 600,
    padding: "8px 16px",
    borderRadius: 999,
    border: "1px solid rgba(42,35,64,0.08)",
    background: "#FFF0F6",
    color: "#C94673",
  },

  cardStyle: {
    borderRadius: 24,
    padding: "28px 32px",
    border: "1px solid rgba(42,35,64,0.08)",
    background: "#FFFFFF",
  },

  spacing: {
    page: "76px 90px",
    section: 28,
    item: 18,
    element: 12,
  },

  radius: {
    sm: 16,
    md: 24,
    lg: 32,
    full: 999,
  },

  toplineGradient: "linear-gradient(90deg, #FFD8C2, #C9DCFB, #DDD0F5, #FCD0DD)",

  softColors: {
    peach: "#FFD8C2",
    mint: "#C8ECD8",
    sky: "#C9DCFB",
    lilac: "#DDD0F5",
    lemon: "#FDF0B2",
    rose: "#FCD0DD",
  },
};
