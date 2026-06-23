import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { fadeSlide, cardLift, staggerReveal } from "../labMotionPrimitives";

interface CueActiveCardProps {
  title: string;
  items: string[];
  accent: string;
  activeOpacity: number;
  delay?: number;
}

/** CueActiveCard — cue 驱动 active 的卡片 */
export const CueActiveCard: React.FC<CueActiveCardProps> = ({
  title,
  items,
  accent,
  activeOpacity,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlide(frame, fps, delay);
  const scale = cardLift(activeOpacity);
  const borderOp = interpolate(activeOpacity, [0.4, 1], [0.08, 0.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ opacity: anim.opacity * activeOpacity, transform: `translateY(${anim.translateY}px) scale(${scale})`, background: "rgba(255,255,255,0.04)", border: `1.5px solid rgba(255,255,255,${borderOp})`, borderRadius: 20, padding: 40, display: "flex", flexDirection: "column", gap: 12, boxShadow: activeOpacity > 0.8 ? "0 0 24px rgba(99,102,241,0.12)" : "none" }}>
      <div style={{ fontSize: 52, fontWeight: 800, color: accent, textTransform: "uppercase" as const, letterSpacing: 1 }}>{title}</div>
      {items.map((item, i) => {
        const s = staggerReveal(frame, fps, i, 8, 12);
        return <div key={i} style={{ fontSize: 44, fontWeight: 600, color: "#f0f0f5", padding: "4px 0", opacity: s.opacity, transform: `translateY(${s.translateY}px)` }}>{item}</div>;
      })}
    </div>
  );
};
