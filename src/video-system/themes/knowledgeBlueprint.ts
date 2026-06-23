/**
 * 知识架构蓝图主题
 *
 * 视觉特征：奶油纸底 + 铁锈红强调 + 建筑蓝图网格 + 黑色粗边框卡片
 * 来源：html-ppt-skill 的 knowledge-arch-blueprint 模板
 */

import type { VideoTheme } from "./types";

export const knowledgeBlueprint: VideoTheme = {
  id: "knowledge-blueprint",
  name: "知识架构蓝图",
  presentationMode: "knowledge-lab",

  background: "#F0EAE0",
  backgroundAlt: "#E8E2D8",
  primaryText: "#1A1A1A",
  secondaryText: "#555555",
  accentColor: "#B5392A",
  accentGradient: "linear-gradient(135deg, #B5392A 0%, #D4564A 100%)",
  cardBackground: "#FFFFFF",
  cardBorder: "#1A1A1A",
  success: "#2E7D32",
  warning: "#F57C00",
  danger: "#B5392A",

  shadow: "0 8px 24px rgba(26,26,26,0.08)",
  shadowLg: "0 16px 48px rgba(26,26,26,0.12)",

  fontFamily: "'Inter','Noto Sans SC',-apple-system,sans-serif",
  monoFont: "'JetBrains Mono','Courier New',monospace",

  titleStyle: {
    fontSize: 80,
    fontWeight: 900,
    lineHeight: 1.08,
    letterSpacing: -1.5,
  },

  subtitleStyle: {
    fontSize: 32,
    fontWeight: 400,
    lineHeight: 1.55,
  },

  tagStyle: {
    fontSize: 28,
    fontWeight: 800,
    padding: "10px 22px",
    borderRadius: 999,
    border: "none",
    background: "rgba(181,57,42,0.08)",
    color: "#B5392A",
  },

  bodyStyle: {
    fontSize: 40,
    fontWeight: 700,
    lineHeight: 1.4,
  },

  captionStyle: {
    fontSize: 34,
    fontWeight: 600,
    lineHeight: 1.4,
  },

  labelStyle: {
    fontSize: 38,
    fontWeight: 800,
    lineHeight: 1.2,
  },

  cardStyle: {
    borderRadius: 12,
    padding: "22px 24px",
    border: "2px solid #1A1A1A",
    background: "#FFFFFF",
  },

  spacing: {
    page: "64px 80px",
    section: 24,
    item: 16,
    element: 10,
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 18,
    full: 999,
  },

  toplineGradient: "linear-gradient(90deg, #B5392A, #D4564A, #B5392A)",

  softColors: {
    rustSoft: "rgba(181,57,42,0.08)",
    line: "#CEC8BE",
    gridLine: "rgba(26,26,26,0.06)",
  },
};
