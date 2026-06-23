// ─── 试验版色彩 token ─────────────────────────────────
// 独立于正式 theme，用于 ExperimentVersionVideo

export const experimentColor = {
  // 背景
  bg: "#0c0c14",
  bgAlt: "#12121f",

  // 文字
  primaryText: "#f0f0f5",
  secondaryText: "#a0a0b8",
  mutedText: "#6a6a80",

  // 强调
  accent: "#6366f1",
  accentLight: "#818cf8",
  accentGradient: "linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)",

  // 语义色
  success: "#34d399",
  danger: "#f87171",
  warning: "#fbbf24",

  // 卡片
  cardBg: "rgba(255,255,255,0.04)",
  cardBorder: "rgba(255,255,255,0.08)",
  cardActiveBorder: "rgba(99,102,241,0.4)",
  cardActiveGlow: "rgba(99,102,241,0.12)",

  // 证据页
  evidenceLeft: "#f87171",
  evidenceRight: "#34d399",
  evidenceLabel: "#a78bfa",
  evidenceConclusion: "#f0f0f5",

  // 模板页
  templateBg: "rgba(255,255,255,0.03)",
  templateActiveBg: "rgba(99,102,241,0.08)",
  templateFillLine: "rgba(255,255,255,0.12)",

  // CTA
  ctaButtonBg: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  ctaButtonText: "#ffffff",
} as const;
