import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { experimentColor } from "../tokens/experimentColor";
import { experimentType } from "../tokens/experimentTypography";
import { expFadeSlideIn, expGentlePulse } from "../tokens/experimentMotion";

interface MotionButtonProps {
  text: string;
  subtitle?: string;
}

/**
 * MotionButton — CTA 按钮
 *
 * 轻微行动感，不广告化。
 * 有呼吸脉冲但非常克制。
 */
export const MotionButton: React.FC<MotionButtonProps> = ({
  text,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anim = expFadeSlideIn(frame, fps, 10);
  const pulse = expGentlePulse(frame, 1.0, 1.02, 0.04);

  return (
    <div
      style={{
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px) scale(${pulse})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          fontSize: experimentType.bodyL.size,
          fontWeight: 700,
          color: experimentColor.ctaButtonText,
          background: experimentColor.ctaButtonBg,
          padding: "20px 60px",
          borderRadius: 16,
          textAlign: "center",
        }}
      >
        {text}
      </div>
      {subtitle && (
        <div
          style={{
            fontSize: experimentType.meta.size,
            color: experimentColor.mutedText,
            textAlign: "center",
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};
