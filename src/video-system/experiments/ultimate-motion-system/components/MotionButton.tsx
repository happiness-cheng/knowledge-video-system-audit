import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fadeSlide, pulse } from "../labMotionPrimitives";

interface MotionButtonProps {
  text: string;
  subtitle?: string;
  bg?: string;
  color?: string;
}

/** MotionButton — CTA 按钮 */
export const MotionButton: React.FC<MotionButtonProps> = ({
  text, subtitle, bg = "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", color = "#ffffff",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlide(frame, fps, 10);
  const p = pulse(frame, 0.04, 1.0, 1.02);
  return (
    <div style={{ opacity: anim.opacity, transform: `translateY(${anim.translateY}px) scale(${p})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ fontSize: 76, fontWeight: 700, color, background: bg, padding: "20px 60px", borderRadius: 16, textAlign: "center" }}>{text}</div>
      {subtitle && <div style={{ fontSize: 42, color: "#6a6a80", textAlign: "center" }}>{subtitle}</div>}
    </div>
  );
};
