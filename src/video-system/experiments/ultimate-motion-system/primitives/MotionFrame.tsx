import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { fadeSlide } from "../labMotionPrimitives";

interface MotionFrameProps {
  children: React.ReactNode;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  delay?: number;
  active?: boolean;
  style?: React.CSSProperties;
}

/** MotionFrame — 带边框的框架容器 */
export const MotionFrame: React.FC<MotionFrameProps> = ({
  children,
  borderColor = "rgba(255,255,255,0.12)",
  borderWidth = 1.5,
  borderRadius = 16,
  delay = 0,
  active = false,
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
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius,
        boxShadow: active ? `0 0 16px ${borderColor}` : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
