import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
} from "remotion";
import { experimentColor } from "../tokens/experimentColor";

/**
 * 试验版动态背景
 * - 深色基调
 * - 极低 opacity glow 缓慢漂移
 * - 轻网格
 * - 不抢主体
 */
export const ExperimentBackground: React.FC<{
  showGrid?: boolean;
}> = ({ showGrid = true }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const glowX = interpolate(frame, [0, durationInFrames], [30, 70], {
    extrapolateRight: "clamp",
  });
  const glowY = interpolate(frame, [0, durationInFrames], [40, 60], {
    extrapolateRight: "clamp",
  });
  const glowSize = interpolate(
    frame,
    [0, durationInFrames / 2, durationInFrames],
    [40, 55, 40],
    { extrapolateRight: "clamp" },
  );
  const glowOpacity = interpolate(
    Math.sin(frame * 0.03),
    [-1, 1],
    [0.03, 0.06],
  );
  const gradientAngle = interpolate(
    frame,
    [0, durationInFrames],
    [135, 225],
    { extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: experimentColor.bg }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(${gradientAngle}deg, ${experimentColor.bg} 0%, ${experimentColor.bgAlt} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle ${glowSize}% at ${glowX}% ${glowY}%, ${experimentColor.accent} 0%, transparent 70%)`,
          opacity: glowOpacity,
        }}
      />
      {showGrid && (
        <AbsoluteFill
          style={{
            opacity: 0.025,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
