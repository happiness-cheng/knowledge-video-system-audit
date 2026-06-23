import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_OUT_CRISP } from "../../utils/animation";

export interface MotionBoxProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  progress?: number;
  translateY?: number;
  scaleFrom?: number;
  scaleTo?: number;
  style?: React.CSSProperties;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const MotionBox: React.FC<MotionBoxProps> = ({
  children,
  delay = 0,
  duration,
  progress,
  translateY = 22,
  scaleFrom = 0.985,
  scaleTo = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const durationFrames = duration ?? Math.round(0.5 * fps);
  const resolvedProgress =
    progress ??
    interpolate(frame - delay, [0, durationFrames], [0, 1], {
      easing: EASE_OUT_CRISP,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const p = clamp01(resolvedProgress);
  const y = interpolate(p, [0, 1], [translateY, 0]);
  const scale = interpolate(p, [0, 1], [scaleFrom, scaleTo]);

  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${y}px) scale(${scale})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
