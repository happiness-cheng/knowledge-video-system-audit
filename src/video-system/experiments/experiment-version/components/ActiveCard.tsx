import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { experimentColor } from "../tokens/experimentColor";
import { experimentLayout } from "../tokens/experimentLayout";
import { expFadeSlideIn } from "../tokens/experimentMotion";

interface ActiveCardProps {
  title: string;
  items: string[];
  accent: string;
  activeOpacity: number;
  delay?: number;
}

/**
 * ActiveCard — 可被 cue 驱动 active 的卡片
 *
 * activeOpacity 由外部 director cue 控制：
 * - 1.0 = 当前 active
 * - 0.65 = 相邻
 * - 0.4 = 弱化
 */
export const ActiveCard: React.FC<ActiveCardProps> = ({
  title,
  items,
  accent,
  activeOpacity,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = expFadeSlideIn(frame, fps, delay);

  // active 时轻微放大
  const scale = interpolate(activeOpacity, [0.4, 1], [0.98, 1.01], {
    extrapolateRight: "clamp",
  });

  // active 时边框更亮
  const borderOpacity = interpolate(activeOpacity, [0.4, 1], [0.08, 0.25], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity: anim.opacity * activeOpacity,
        transform: `translateY(${anim.translateY}px) scale(${scale})`,
        background: experimentColor.cardBg,
        border: `1.5px solid rgba(255,255,255,${borderOpacity})`,
        borderRadius: experimentLayout.card.borderRadius,
        padding: experimentLayout.card.padding,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow:
          activeOpacity > 0.8
            ? `0 0 30px ${experimentColor.cardActiveGlow}`
            : "none",
        transition: "none", // 禁止 CSS transition
      }}
    >
      <div
        style={{
          fontSize: 52,
          fontWeight: 800,
          color: accent,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {title}
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            fontSize: 44,
            fontWeight: 600,
            color: experimentColor.primaryText,
            padding: "4px 0",
            opacity: interpolate(
              frame,
              [delay + 10 + i * 8, delay + 18 + i * 8],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};
