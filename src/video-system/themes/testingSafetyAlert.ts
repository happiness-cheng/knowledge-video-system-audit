/**
 * 测试安全警示主题
 *
 * 视觉特征：白底 + 红/琥珀警示色 + 条纹装饰 + 高对比
 * 来源：html-ppt-skill 的 testing-safety-alert 模板
 */

import type { VideoTheme } from "./types";

export const testingSafetyAlert: VideoTheme = {
  id: "testing-safety-alert",
  name: "测试安全警示",

  background: "#FFFAF7",
  backgroundAlt: "#FFF5EE",
  primaryText: "#14141A",
  secondaryText: "#4A4955",
  accentColor: "#E0314A",
  accentGradient: "linear-gradient(135deg, #E0314A 0%, #D97706 100%)",
  cardBackground: "#FFFFFF",
  cardBorder: "rgba(20,20,26,0.08)",
  success: "#067647",
  warning: "#D97706",
  danger: "#E0314A",

  shadow: "0 8px 24px rgba(20,20,26,0.06)",
  shadowLg: "0 18px 48px rgba(20,20,26,0.1)",

  fontFamily: "'Inter','Noto Sans SC','PingFang SC',sans-serif",
  monoFont: "'JetBrains Mono','Courier New',monospace",

  titleStyle: {
    fontSize: 88,
    fontWeight: 850,
    lineHeight: 1.02,
    letterSpacing: -2,
  },

  subtitleStyle: {
    fontSize: 26,
    fontWeight: 400,
    lineHeight: 1.45,
  },

  tagStyle: {
    fontSize: 13,
    fontWeight: 800,
    padding: "8px 18px",
    borderRadius: 10,
    border: "none",
    background: "#E0314A",
    color: "#FFFFFF",
  },

  cardStyle: {
    borderRadius: 16,
    padding: "28px 32px",
    border: "1px solid rgba(20,20,26,0.08)",
    background: "#FFFFFF",
  },

  spacing: {
    page: "64px 84px",
    section: 28,
    item: 18,
    element: 12,
  },

  radius: {
    sm: 10,
    md: 16,
    lg: 24,
    full: 999,
  },

  toplineGradient:
    "repeating-linear-gradient(45deg, #E0314A 0 18px, #14141A 18px 36px)",

  softColors: {
    redSoft: "#FFECEE",
    amberSoft: "#FFF5E6",
    greenSoft: "#E8F8EE",
  },
};
