import React from "react";

export interface MotionPathProps {
  d: string;
  color: string;
  progress: number;
  length: number;
  strokeWidth: number;
  ghostOpacity?: number;
  activeOpacity?: number;
  lineCap?: "butt" | "round" | "square";
  dashPattern?: string;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const MotionPath: React.FC<MotionPathProps> = ({
  d,
  color,
  progress,
  length,
  strokeWidth,
  ghostOpacity = 0.16,
  activeOpacity = 1,
  lineCap = "round",
  dashPattern,
}) => {
  const drawProgress = clamp01(progress);
  const dashArray = dashPattern ?? length;
  const dashOffset = length * (1 - drawProgress);

  return (
    <>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth * 2.7}
        strokeLinecap={lineCap}
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset}
        opacity={ghostOpacity * drawProgress}
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap={lineCap}
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset}
        opacity={activeOpacity}
      />
    </>
  );
};
