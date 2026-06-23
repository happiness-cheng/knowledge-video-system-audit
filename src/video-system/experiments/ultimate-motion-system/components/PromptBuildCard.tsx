import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { fadeSlide, staggerReveal } from "../labMotionPrimitives";

interface PromptBuildCardProps {
  steps: string[];
  activeStep: number;
  accentColor?: string;
}

/** PromptBuildCard — prompt 卡逐步补全 */
export const PromptBuildCard: React.FC<PromptBuildCardProps> = ({
  steps, activeStep, accentColor = "#6366f1",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "70%", maxWidth: 1000 }}>
      {steps.map((step, i) => {
        const anim = staggerReveal(frame, fps, i, 18, 15);
        const isActive = i === activeStep;
        return (
          <div key={i} style={{ opacity: anim.opacity, transform: `translateY(${anim.translateY}px)`, display: "flex", alignItems: "center", gap: 20, padding: "20px 32px", borderRadius: 16, background: isActive ? "rgba(99,102,241,0.08)" : "transparent", borderLeft: isActive ? `3px solid ${accentColor}` : "3px solid transparent", textAlign: "left" as const }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: isActive ? accentColor : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, fontWeight: 700, color: isActive ? "#f0f0f5" : "#6a6a80", flexShrink: 0 }}>{i + 1}</div>
            <div style={{ fontSize: 76, fontWeight: isActive ? 700 : 500, color: isActive ? "#f0f0f5" : "#a0a0b8", lineHeight: 1.4 }}>{step}</div>
          </div>
        );
      })}
    </div>
  );
};
