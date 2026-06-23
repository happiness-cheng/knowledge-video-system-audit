import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from "remotion";

type BgVariant = "dark-glow" | "white-drift" | "blueprint-grid";

interface BackgroundSystemProps {
  variant?: BgVariant;
  showGrid?: boolean;
  maxOpacity?: number;
}

/** BackgroundSystem — 3 种低风险动态背景 */
export const BackgroundSystem: React.FC<BackgroundSystemProps> = ({
  variant = "dark-glow",
  showGrid = true,
  maxOpacity = 0.06,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const glowX = interpolate(frame, [0, durationInFrames], [30, 70], { extrapolateRight: "clamp" });
  const glowY = interpolate(frame, [0, durationInFrames], [40, 60], { extrapolateRight: "clamp" });
  const glowSize = interpolate(frame, [0, durationInFrames / 2, durationInFrames], [40, 55, 40], { extrapolateRight: "clamp" });
  const glowOp = interpolate(Math.sin(frame * 0.03), [-1, 1], [maxOpacity * 0.5, maxOpacity]);
  const angle = interpolate(frame, [0, durationInFrames], [135, 225], { extrapolateRight: "clamp" });

  if (variant === "white-drift") {
    return (
      <AbsoluteFill style={{ backgroundColor: "#fafafa" }}>
        <AbsoluteFill style={{ background: `linear-gradient(${angle}deg, #fafafa 0%, #f0f0f0 100%)` }} />
        <AbsoluteFill style={{ background: `radial-gradient(circle ${glowSize}% at ${glowX}% ${glowY}%, #6366f1 0%, transparent 70%)`, opacity: glowOp * 0.3 }} />
        {showGrid && <AbsoluteFill style={{ opacity: 0.015, backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />}
      </AbsoluteFill>
    );
  }

  if (variant === "blueprint-grid") {
    return (
      <AbsoluteFill style={{ backgroundColor: "#f5f0e8" }}>
        <AbsoluteFill style={{ background: `linear-gradient(${angle}deg, #f5f0e8 0%, #ebe6de 100%)` }} />
        <AbsoluteFill style={{ opacity: 0.06, backgroundImage: "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <AbsoluteFill style={{ background: `radial-gradient(circle ${glowSize}% at ${glowX}% ${glowY}%, #be503c 0%, transparent 70%)`, opacity: glowOp * 0.4 }} />
      </AbsoluteFill>
    );
  }

  // dark-glow (default)
  return (
    <AbsoluteFill style={{ backgroundColor: "#0c0c14" }}>
      <AbsoluteFill style={{ background: `linear-gradient(${angle}deg, #0c0c14 0%, #12121f 100%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle ${glowSize}% at ${glowX}% ${glowY}%, #6366f1 0%, transparent 70%)`, opacity: glowOp }} />
      {showGrid && <AbsoluteFill style={{ opacity: 0.025, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />}
    </AbsoluteFill>
  );
};
