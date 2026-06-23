import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { experimentColor } from "../tokens/experimentColor";
import { experimentType } from "../tokens/experimentTypography";
import { expFadeSlideIn, expSpringIn } from "../tokens/experimentMotion";

interface InsightShotProps {
  quote: string;
  subtitle?: string;
  label?: string;
}

/**
 * InsightShot — 实验结论聚焦页
 *
 * 不是普通标题页，要有聚焦感。
 * 一句结论钉住 + 轻微 breathing。
 */
export const InsightShot: React.FC<InsightShotProps> = ({
  quote,
  subtitle,
  label = "实验结论",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const quoteProgress = expSpringIn(frame, fps, 0);
  const subtitleAnim = expFadeSlideIn(frame, fps, 18);
  const labelAnim = expFadeSlideIn(frame, fps, 0);

  // 结论标签 breathing
  const labelScale = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [1.0, 1.006],
  );
  const labelOpacity = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [0.97, 1.0],
  );

  const quoteLines = quote.split("\n");

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px 120px",
        textAlign: "center",
      }}
    >
      {/* 实验结论标签 */}
      <div
        style={{
          fontSize: experimentType.label.size,
          fontWeight: 700,
          color: experimentColor.accent,
          letterSpacing: 4,
          textTransform: "uppercase",
          marginBottom: 24,
          opacity: labelAnim.opacity * labelOpacity,
          transform: `scale(${labelScale})`,
        }}
      >
        {label}
      </div>

      {/* 引言 */}
      <div
        style={{
          opacity: quoteProgress,
          transform: `translateY(${(1 - quoteProgress) * 15}px)`,
          textAlign: "center",
        }}
      >
        {quoteLines.map((line, i) => {
          const isLast = i === quoteLines.length - 1;
          return (
            <div
              key={i}
              style={{
                fontSize: isLast
                  ? experimentType.displayXL.size
                  : experimentType.headingM.size,
                fontWeight: isLast ? 900 : 700,
                lineHeight: isLast
                  ? experimentType.displayXL.lineHeight
                  : experimentType.headingM.lineHeight,
                background: isLast
                  ? experimentColor.accentGradient
                  : "none",
                WebkitBackgroundClip: isLast ? "text" : "unset",
                backgroundClip: isLast ? "text" : "unset",
                color: isLast ? "transparent" : experimentColor.secondaryText,
                maxWidth: 900,
                margin: "0 auto",
                opacity: isLast ? 1 : 0.75,
                overflow: "visible",
                paddingBottom: isLast ? 8 : 0,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>

      {/* 副标题 */}
      {subtitle && (
        <div
          style={{
            opacity: subtitleAnim.opacity,
            transform: `translateY(${subtitleAnim.translateY}px)`,
            marginTop: 20,
            fontSize: experimentType.headingM.size,
            fontWeight: experimentType.headingM.weight,
            color: experimentColor.mutedText,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};
