import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface MotionProgressProps {
  current: number;
  total: number;
  color?: string;
  trackColor?: string;
  height?: number;
  style?: React.CSSProperties;
}

/** MotionProgress — 进度条 */
export const MotionProgress: React.FC<MotionProgressProps> = ({
  current,
  total,
  color = "#6366f1",
  trackColor = "rgba(255,255,255,0.06)",
  height = 4,
  style,
}) => {
  const progress = total > 0 ? current / total : 0;
  return (
    <div
      style={{
        width: "100%",
        height,
        background: trackColor,
        borderRadius: height / 2,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: "100%",
          background: color,
          borderRadius: height / 2,
        }}
      />
    </div>
  );
};
