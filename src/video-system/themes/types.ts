/**
 * 视频主题 Token 类型定义
 *
 * 所有主题必须实现此接口，确保 Scene 组件可以安全读取任何主题的 token。
 */

export type ThemeId =
  | "xhs-white-editorial"
  | "knowledge-blueprint"
  | "minimal-white"
  | "neo-brutalism"
  | "aurora"
  | "obsidian-claude-gradient"
  | "testing-safety-alert"
  | "xhs-pastel-card";

export type PresentationMode = "default" | "knowledge-lab";

export interface VideoTheme {
  id: ThemeId;
  name: string;
  /** 呈现模式：default=标准白底，knowledge-lab=知识实验台 */
  presentationMode?: PresentationMode;

  // ─── 色彩 ─────────────────────────────────────
  background: string;
  backgroundAlt: string;
  primaryText: string;
  secondaryText: string;
  accentColor: string;
  accentGradient: string;
  cardBackground: string;
  cardBorder: string;
  success: string;
  warning: string;
  danger: string;

  // ─── 阴影 ─────────────────────────────────────
  shadow: string;
  shadowLg: string;

  // ─── 字体 ─────────────────────────────────────
  fontFamily: string;
  monoFont: string;

  // ─── 标题样式 ─────────────────────────────────
  titleStyle: {
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: number;
  };

  // ─── 副标题样式 ───────────────────────────────
  subtitleStyle: {
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
  };

  // ─── 标签样式 ─────────────────────────────────
  tagStyle: {
    fontSize: number;
    fontWeight: number;
    padding: string;
    borderRadius: number;
    border: string;
    background: string;
    color: string;
  };

  // ─── 正文样式 ─────────────────────────────────
  bodyStyle?: {
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
  };

  // ─── 说明文字样式 ─────────────────────────────
  captionStyle?: {
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
  };

  // ─── 标签/标注样式 ─────────────────────────────
  labelStyle?: {
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
    textTransform?: string;
    letterSpacing?: number;
  };

  // ─── 卡片样式 ─────────────────────────────────
  cardStyle: {
    borderRadius: number;
    padding: string;
    border: string;
    background: string;
  };

  // ─── 间距 ─────────────────────────────────────
  spacing: {
    page: string;
    section: number;
    item: number;
    element: number;
  };

  // ─── 圆角 ─────────────────────────────────────
  radius: {
    sm: number;
    md: number;
    lg: number;
    full: number;
  };

  // ─── 装饰线 ───────────────────────────────────
  toplineGradient?: string;

  // ─── 特殊色块 ─────────────────────────────────
  softColors?: Record<string, string>;
}
