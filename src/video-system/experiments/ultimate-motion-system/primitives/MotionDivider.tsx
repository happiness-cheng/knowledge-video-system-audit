import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface MotionDividerProps {
  color?: string;
  height?: number;
  delay?: number;
  style?: React.CSSProperties;
}

/** MotionDivider — 分隔线 */
export const MotionDivider: React.FC<MotionDividerProps> = ({
  color = "rgba(255,255,255,0.08)",
  height = 1,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const width = interpolate(
    frame - delay,
    [0, 15],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div
      style={{
        width: `${width}%`,
        height,
        background: color,
        margin: "16px 0",
        ...style,
      }}
    />
  );
};
