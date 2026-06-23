import React from "react";
import { interpolate } from "remotion";

export interface MotionBranchProps {
  color: string;
  progress: number;
  active?: boolean;
  height?: number;
  width?: number;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const MotionBranch: React.FC<MotionBranchProps> = ({
  color,
  progress,
  active = false,
  height = 42,
  width = 28,
}) => {
  const draw = clamp01(progress);
  const pathLength = height + width;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      style={{
        overflow: "visible",
        filter: active ? `drop-shadow(0 0 5px ${color}66)` : "none",
      }}
    >
      <path
        d={`M${width / 2} 0 C${width / 2} ${height * 0.36}, ${width / 2} ${
          height * 0.64
        }, ${width / 2} ${height}`}
        stroke={color}
        strokeWidth={active ? 3.2 : 2.2}
        strokeLinecap="round"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength * (1 - draw)}
        opacity={interpolate(draw, [0, 0.15], [0, active ? 0.95 : 0.5], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />
    </svg>
  );
};
