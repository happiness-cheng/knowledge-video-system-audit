/**
 * 小红书白底编辑主题
 *
 * 视觉特征：白底 + 杂志排版 + 渐变重点色 + 大圆角卡片
 * 来源：html-ppt-skill 的 xhs-white-editorial 模板
 */

import type { VideoTheme } from "./types";

export const xhsWhiteEditorial: VideoTheme = {
  id: "xhs-white-editorial",
  name: "白底杂志风",
  presentationMode: "knowledge-lab",

  // ─── 色彩 ─────────────────────────────────────
  background: "#FFFFFF",
  backgroundAlt: "#F9FAFB",
  primaryText: "#111318",
  secondaryText: "#475467",
  accentColor: "#7B61FF",
  accentGradient:
    "linear-gradient(90deg, #7B61FF 0%, #4E8CFF 25%, #17B26A 48%, #FF9D42 72%, #FF5FA2 100%)",
  cardBackground: "#FFFFFF",
  cardBorder: "#EAECF3",
  success: "#17B26A",
  warning: "#FF9D42",
  danger: "#FF5FA2",

  // ─── 阴影 ─────────────────────────────────────
  shadow: "0 10px 24px rgba(17,19,24,0.04)",
  shadowLg: "0 18px 48px rgba(17,19,24,0.08)",

  // ─── 字体 ─────────────────────────────────────
  fontFamily: "'Inter','Noto Sans SC','PingFang SC',sans-serif",
  monoFont: "'JetBrains Mono','Courier New',monospace",

  // ─── 标题样式 ─────────────────────────────────
  titleStyle: {
    fontSize: 100,
    fontWeight: 850,
    lineHeight: 1.02,
    letterSpacing: -2,
  },

  // ─── 副标题样式 ───────────────────────────────
  subtitleStyle: {
    fontSize: 40,
    fontWeight: 400,
    lineHeight: 1.45,
  },

  // ─── 标签样式 ─────────────────────────────────
  tagStyle: {
    fontSize: 36,
    fontWeight: 600,
    padding: "14px 24px",
    borderRadius: 999,
    border: "1px solid #EAECF3",
    background: "#FFFFFF",
    color: "#475467",
  },

  // ─── 正文样式 ─────────────────────────────────
  bodyStyle: {
    fontSize: 44,
    fontWeight: 600,
    lineHeight: 1.4,
  },

  // ─── 说明文字样式 ─────────────────────────────
  captionStyle: {
    fontSize: 36,
    fontWeight: 600,
    lineHeight: 1.4,
  },

  // ─── 标签/标注样式 ─────────────────────────────
  labelStyle: {
    fontSize: 42,
    fontWeight: 800,
    lineHeight: 1.2,
  },

  // ─── 卡片样式 ─────────────────────────────────
  cardStyle: {
    borderRadius: 24,
    padding: "28px 32px",
    border: "1px solid #EAECF3",
    background: "linear-gradient(180deg, #FFFFFF 0%, #FCFCFF 100%)",
  },

  // ─── 间距 ─────────────────────────────────────
  spacing: {
    page: "48px 64px",
    section: 24,
    item: 16,
    element: 10,
  },

  // ─── 圆角 ─────────────────────────────────────
  radius: {
    sm: 14,
    md: 24,
    lg: 28,
    full: 999,
  },

  // ─── 装饰 ─────────────────────────────────────
  toplineGradient:
    "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7, #ec4899, #f43f5e, #f97316, #eab308, #22c55e, #06b6d4, #6366f1)",

  // ─── 特殊色块（用于对比/分类）────────────────
  softColors: {
    purple: "#F4EFFF",
    pink: "#FFF0F6",
    blue: "#EEF4FF",
    green: "#EDFDF3",
    orange: "#FFF5EA",
  },
};
