/**
 * 通用卡片组件
 *
 * 根据主题 token 渲染卡片，支持可选的强调色边框。
 */

import React from "react";
import type { VideoTheme } from "../themes/types";

export interface CardProps {
  theme: VideoTheme;
  children: React.ReactNode;
  accent?: string; // 左边框强调色
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  theme,
  children,
  accent,
  style,
}) => (
  <div
    style={{
      background: theme.cardStyle.background,
      border: accent ? `3px solid ${accent}` : theme.cardStyle.border,
      borderRadius: theme.cardStyle.borderRadius,
      padding: theme.cardStyle.padding,
      boxShadow: theme.shadow,
      ...style,
    }}
  >
    {children}
  </div>
);
