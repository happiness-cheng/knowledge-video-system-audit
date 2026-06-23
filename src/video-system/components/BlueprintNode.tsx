/**
 * 蓝图节点
 *
 * 知识架构蓝图主题专用节点。
 * 深蓝底 + cyan 边框 + 发光效果。
 */

import React from "react";
import type { VideoTheme } from "../themes/types";

export interface BlueprintNodeProps {
  theme: VideoTheme;
  label: string;
  index: number;
  active?: boolean;
  dimmed?: boolean;
  width?: number;
}

export const BlueprintNode: React.FC<BlueprintNodeProps> = ({
  theme,
  label,
  index,
  active = false,
  dimmed = false,
  width = 200,
}) => {
  const opacity = dimmed ? 0.3 : 1;
  const borderColor = active ? theme.accentColor : theme.cardBorder;
  const glow = active
    ? `0 0 24px ${theme.accentColor}33, inset 0 0 12px ${theme.accentColor}11`
    : "none";

  return (
    <div
      style={{
        width,
        padding: "18px 22px",
        borderRadius: theme.radius.sm,
        border: `1.5px solid ${borderColor}`,
        background: active ? "rgba(0,212,255,0.08)" : theme.cardBackground,
        boxShadow: glow,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          border: `1.5px solid ${active ? theme.accentColor : theme.cardBorder}`,
          background: active ? `${theme.accentColor}22` : "transparent",
          color: active ? theme.accentColor : theme.secondaryText,
          display: "grid",
          placeItems: "center",
          fontSize: 14,
          fontWeight: 700,
          fontFamily: theme.monoFont,
          flexShrink: 0,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: active ? theme.primaryText : theme.secondaryText,
          fontFamily: theme.fontFamily,
        }}
      >
        {label}
      </div>
    </div>
  );
};
