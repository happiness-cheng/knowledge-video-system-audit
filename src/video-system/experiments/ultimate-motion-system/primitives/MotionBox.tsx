import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { fadeSlide } from "../labMotionPrimitives";

interface MotionBoxProps {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}

/** MotionBox — 带 fadeSlide 入场的容器 */
export const MotionBox: React.FC<MotionBoxProps> = ({
  children,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlide(frame, fps, delay);
  return (
    <div
      style={{
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
