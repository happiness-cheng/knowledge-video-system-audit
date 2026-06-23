import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { fadeSlide, cardLift } from "../labMotionPrimitives";

interface MotionCardProps {
  children: React.ReactNode;
  activeOpacity?: number;
  delay?: number;
  borderRadius?: number;
  padding?: number;
  bg?: string;
  border?: string;
  style?: React.CSSProperties;
}

/** MotionCard — 带 active 状态的卡片 */
export const MotionCard: React.FC<MotionCardProps> = ({
  children,
  activeOpacity = 1,
  delay = 0,
  borderRadius = 20,
  padding = 40,
  bg = "rgba(255,255,255,0.04)",
  border = "rgba(255,255,255,0.08)",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlide(frame, fps, delay);
  const scale = cardLift(activeOpacity);
  const borderOp = interpolate(activeOpacity, [0.4, 1], [0.08, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: anim.opacity * activeOpacity,
        transform: `translateY(${anim.translateY}px) scale(${scale})`,
        background: bg,
        border: `1.5px solid rgba(255,255,255,${borderOp})`,
        borderRadius,
        padding,
        boxShadow:
          activeOpacity > 0.8
            ? "0 0 24px rgba(99,102,241,0.12)"
            : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
