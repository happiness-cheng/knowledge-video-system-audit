import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoTheme } from "../../themes/types";
import { EASE_OUT_CRISP } from "../../utils/animation";

export interface OperationTraceProps {
  theme: VideoTheme;
  label: string;
  x?: number;
  y?: number;
  delay?: number;
  tone?: "accent" | "success" | "warning";
}

export const OperationTrace: React.FC<OperationTraceProps> = ({
  theme,
  label,
  x = 0,
  y = 0,
  delay = 0,
  tone = "accent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const color =
    tone === "success"
      ? theme.success
      : tone === "warning"
        ? theme.warning
        : theme.accentColor;
  const progress = interpolate(frame - delay, [0, 0.45 * fps], [0, 1], {
    easing: EASE_OUT_CRISP,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.72, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: progress,
        transform: `translate(${interpolate(progress, [0, 1], [14, 0])}px, ${interpolate(progress, [0, 1], [10, 0])}px)`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 999,
        border: `2px solid ${color}`,
        background: `${theme.cardBackground}e8`,
        boxShadow: theme.shadow,
        color: theme.primaryText,
        fontSize: 22,
        fontWeight: 800,
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 999,
          background: color,
          opacity: pulse,
          display: "inline-block",
        }}
      />
      <span>{label}</span>
    </div>
  );
};
