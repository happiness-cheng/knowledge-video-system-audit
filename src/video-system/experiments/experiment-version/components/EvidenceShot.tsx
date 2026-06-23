import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { experimentColor } from "../tokens/experimentColor";
import { experimentLayout } from "../tokens/experimentLayout";
import { experimentType } from "../tokens/experimentTypography";
import { expFadeSlideIn } from "../tokens/experimentMotion";

interface EvidenceShotProps {
  label: string;
  caption: string;
  accent: string;
  activeOpacity: number;
  delay?: number;
}

/**
 * EvidenceShot — 证据卡片（纯文字版）
 *
 * 试验版不使用截图，用文字证据 + 标签 + 结论结构。
 * activeOpacity 由外部 director cue 控制。
 */
export const EvidenceShot: React.FC<EvidenceShotProps> = ({
  label,
  caption,
  accent,
  activeOpacity,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = expFadeSlideIn(frame, fps, delay);

  const scale = interpolate(activeOpacity, [0.4, 1], [0.97, 1.01], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity: anim.opacity * activeOpacity,
        transform: `translateY(${anim.translateY}px) scale(${scale})`,
        background: `linear-gradient(180deg, ${experimentColor.bg} 0%, ${experimentColor.bgAlt} 100%)`,
        border: `1.5px solid ${activeOpacity > 0.8 ? accent + "55" : experimentColor.cardBorder}`,
        borderRadius: experimentLayout.evidence.borderRadius,
        padding: experimentLayout.evidence.padding,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        boxShadow:
          activeOpacity > 0.8
            ? `0 0 24px ${accent}18`
            : "none",
      }}
    >
      {/* 大标签 */}
      <div
        style={{
          fontSize: experimentType.label.size,
          fontWeight: experimentType.label.weight,
          color: accent,
          textTransform: "uppercase",
          letterSpacing: 2,
          textAlign: "center",
        }}
      >
        {label}
      </div>

      {/* 证据文字区域（模拟截图位置） */}
      <div
        style={{
          width: "100%",
          height: 280,
          borderRadius: 12,
          background: experimentColor.cardBg,
          border: `1px solid ${experimentColor.cardBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            fontSize: experimentType.bodyM.size,
            fontWeight: 500,
            color: experimentColor.secondaryText,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          {caption}
        </div>
      </div>

      {/* 结论 */}
      <div
        style={{
          fontSize: experimentType.captionL.size,
          fontWeight: 600,
          color: experimentColor.primaryText,
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {caption}
      </div>
    </div>
  );
};
