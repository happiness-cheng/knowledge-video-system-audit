import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
} from "remotion";

interface AnimatedBackgroundProps {
  /** 背景基调色 */
  baseColor?: string;
  /** glow 颜色 */
  glowColor?: string;
  /** 网格是否显示 */
  showGrid?: boolean;
  /** 最大 opacity */
  maxOpacity?: number;
}

/**
 * 动态背景
 * - 轻微动态渐变
 * - subtle glow
 * - 轻网格
 * - 不抢主体
 */
export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  baseColor = "#0a0a0f",
  glowColor = "#3b82f6",
  showGrid = true,
  maxOpacity = 0.06,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // glow 位置缓慢移动
  const glowX = interpolate(frame, [0, durationInFrames], [30, 70], {
    extrapolateRight: "clamp",
  });
  const glowY = interpolate(frame, [0, durationInFrames], [40, 60], {
    extrapolateRight: "clamp",
  });

  // glow 大小缓慢变化
  const glowSize = interpolate(
    frame,
    [0, durationInFrames / 2, durationInFrames],
    [40, 55, 40],
    { extrapolateRight: "clamp" },
  );

  // glow opacity 缓慢脉冲
  const glowOpacity = interpolate(
    Math.sin(frame * 0.03),
    [-1, 1],
    [maxOpacity * 0.5, maxOpacity],
  );

  // 渐变角度缓慢旋转
  const gradientAngle = interpolate(frame, [0, durationInFrames], [135, 225], {
    extrapolateRight: "clamp",
  });

  // 网格 opacity
  const gridOpacity = maxOpacity * 0.4;

  return (
    <AbsoluteFill style={{ backgroundColor: baseColor }}>
      {/* 动态渐变层 */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${gradientAngle}deg, ${baseColor} 0%, ${baseColor} 100%)`,
        }}
      />

      {/* Subtle glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle ${glowSize}% at ${glowX}% ${glowY}%, ${glowColor} 0%, transparent 70%)`,
          opacity: glowOpacity,
        }}
      />

      {/* 轻网格 */}
      {showGrid && (
        <AbsoluteFill
          style={{
            opacity: gridOpacity,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
