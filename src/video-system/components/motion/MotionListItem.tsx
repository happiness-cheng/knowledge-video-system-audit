import React from "react";
import { interpolate } from "remotion";
import type { VideoTheme } from "../../themes/types";

export interface MotionListItemProps {
  theme: VideoTheme;
  children: React.ReactNode;
  accent?: string;
  progress?: number;
  focusProgress?: number;
  retainedProgress?: number;
  borderRadius?: number;
  padding?: string;
  gap?: number;
  translateY?: number;
  translateX?: number;
  style?: React.CSSProperties;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const MotionListItem: React.FC<MotionListItemProps> = ({
  theme,
  children,
  accent,
  progress = 1,
  focusProgress = 0,
  retainedProgress = 1,
  borderRadius = theme.radius.md,
  padding = "24px 32px",
  gap = 20,
  translateY = 20,
  translateX = 10,
  style,
}) => {
  const tone = accent ?? theme.accentColor;
  const reveal = clamp01(progress);
  const focus = clamp01(focusProgress);
  const retained = clamp01(retainedProgress);
  const borderOpacity = interpolate(focus, [0, 1], [0.18, 1]);
  const sideRailOpacity = interpolate(focus, [0, 1], [0, 1]);
  const bgTintOpacity = interpolate(focus, [0, 1], [0, 0.12]);
  const shadowOpacity = interpolate(focus, [0, 1], [0.04, 0.24]);
  const scale = interpolate(focus, [0, 1], [0.99, 1.01]);
  const opacity = reveal * interpolate(retained, [0, 1], [0.56, 1]);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap,
        padding,
        borderRadius,
        border: `2px solid ${tone}${Math.round(borderOpacity * 255)
          .toString(16)
          .padStart(2, "0")}`,
        background: theme.cardBackground,
        boxShadow: `0 8px 32px rgba(15, 23, 42, ${shadowOpacity})`,
        opacity,
        transform: `translateX(${focus * translateX}px) translateY(${interpolate(
          reveal,
          [0, 1],
          [translateY, 0],
        )}px) scale(${scale})`,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: tone,
          opacity: bgTintOpacity,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 8,
          background: tone,
          opacity: sideRailOpacity,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          gap,
          width: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
};
