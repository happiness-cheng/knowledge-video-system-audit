import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fadeSlide, breathe } from "../labMotionPrimitives";

interface MotionTextProps {
  text: string;
  fontSize: number;
  fontWeight?: number;
  color?: string;
  delay?: number;
  useBreathe?: boolean;
  style?: React.CSSProperties;
}

/** MotionText — 带入场动画的文字 */
export const MotionText: React.FC<MotionTextProps> = ({
  text,
  fontSize,
  fontWeight = 500,
  color = "#f0f0f5",
  delay = 0,
  useBreathe = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlide(frame, fps, delay);
  const scale = useBreathe ? breathe(frame) : 1;
  return (
    <div
      style={{
        fontSize,
        fontWeight,
        color,
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px) scale(${scale})`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
