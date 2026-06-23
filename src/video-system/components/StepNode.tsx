/**
 * 步骤节点
 *
 * 用于流程图、步骤图、路线图中的节点。
 * 精修：3 级可见性、发光边框、编号圆点放大、更好的层级感。
 */

import React from "react";
import type { VideoTheme } from "../themes/types";

export interface StepNodeProps {
  theme: VideoTheme;
  index: number;
  label: string;
  description?: string;
  active?: boolean;
  dimmed?: boolean;
  width?: number;
}

export const StepNode: React.FC<StepNodeProps> = ({
  theme,
  index,
  label,
  description,
  active = false,
  dimmed = false,
  width = 200,
}) => {
  const borderColor = active ? theme.accentColor : theme.cardBorder;
  const glow = active
    ? `0 0 24px ${theme.accentColor}33, 0 0 8px ${theme.accentColor}22`
    : "none";

  return (
    <div
      style={{
        width,
        padding: "32px 36px",
        borderRadius: theme.radius.md,
        border: active
          ? `3px solid ${borderColor}`
          : `1.5px solid ${borderColor}`,
        background: active ? `${theme.accentColor}0D` : theme.cardBackground,
        boxShadow: glow,
        display: "flex",
        alignItems: "center",
        gap: 24,
      }}
    >
      {/* 编号圆点：active 时更大更亮 */}
      <div
        style={{
          width: active ? 56 : 48,
          height: active ? 56 : 48,
          borderRadius: "50%",
          background: active
            ? theme.accentColor
            : dimmed
              ? theme.cardBorder
              : `${theme.accentColor}44`,
          color: active
            ? "#fff"
            : dimmed
              ? theme.secondaryText
              : theme.accentColor,
          display: "grid",
          placeItems: "center",
          fontSize: active ? 24 : 20,
          fontWeight: 800,
          fontFamily: theme.monoFont,
          flexShrink: 0,
          boxShadow: active ? `0 0 12px ${theme.accentColor}44` : "none",
        }}
      >
        {index + 1}
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: active ? 800 : 700,
          color: active ? theme.primaryText : theme.secondaryText,
          fontFamily: theme.fontFamily,
        }}
      >
        {label}
      </div>
      {description && (
        <div
          style={{
            fontSize: 32,
            color: theme.secondaryText,
            fontFamily: theme.fontFamily,
            marginTop: 4,
          }}
        >
          {description}
        </div>
      )}
    </div>
  );
};
