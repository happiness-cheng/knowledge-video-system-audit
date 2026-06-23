import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fadeSlide } from "../labMotionPrimitives";

interface MotionBadgeProps {
  text: string;
  color?: string;
  bg?: string;
  delay?: number;
  style?: React.CSSProperties;
}

/** MotionBadge — 标签/徽章 */
export const MotionBadge: React.FC<MotionBadgeProps> = ({
  text,
  color = "#6366f1",
  bg = "rgba(99,102,241,0.1)",
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlide(frame, fps, delay);
  return (
    <div
      style={{
        display: "inline-block",
        fontSize: 36,
        fontWeight: 650,
        color,
        background: bg,
        padding: "8px 20px",
        borderRadius: 8,
        letterSpacing: 2,
        textTransform: "uppercase" as const,
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
