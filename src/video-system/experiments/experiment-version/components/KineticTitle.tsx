import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { expSpringIn, expFadeSlideIn } from "../tokens/experimentMotion";
import { experimentType } from "../tokens/experimentTypography";
import { experimentColor } from "../tokens/experimentColor";

interface KineticTitleProps {
  title: string;
  subtitle?: string;
  keywords?: string[];
  delay?: number;
  useSpring?: boolean;
  variant?: "display" | "heading";
}

/**
 * 动感标题组件
 * - 主标题 spring 入场
 * - 副标题延迟 fadeSlide
 * - 关键词高亮
 */
export const KineticTitle: React.FC<KineticTitleProps> = ({
  title,
  subtitle,
  keywords = [],
  delay = 0,
  useSpring = true,
  variant = "display",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = useSpring
    ? expSpringIn(frame, fps, delay)
    : expFadeSlideIn(frame, fps, delay, 15).opacity;

  const subtitleAnim = expFadeSlideIn(frame, fps, delay + 15);

  const titleLines = title.split("\n");
  const typeToken =
    variant === "display" ? experimentType.displayL : experimentType.headingL;

  const highlightKeyword = (text: string): React.ReactNode => {
    if (keywords.length === 0) return text;
    for (const kw of keywords) {
      const idx = text.indexOf(kw);
      if (idx >= 0) {
        const before = text.slice(0, idx);
        const after = text.slice(idx + kw.length);
        return (
          <>
            {before}
            <span
              style={{
                background: experimentColor.accentGradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {kw}
            </span>
            {after}
          </>
        );
      }
    }
    return text;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          opacity: titleProgress,
          transform: `translateY(${(1 - titleProgress) * 20}px)`,
          textAlign: "center",
        }}
      >
        {titleLines.map((line, i) => (
          <div
            key={i}
            style={{
              fontSize: typeToken.size,
              fontWeight: typeToken.weight,
              lineHeight: typeToken.lineHeight,
              color: experimentColor.primaryText,
              letterSpacing: "-0.01em",
            }}
          >
            {highlightKeyword(line)}
          </div>
        ))}
      </div>

      {subtitle && (
        <div
          style={{
            opacity: subtitleAnim.opacity,
            transform: `translateY(${subtitleAnim.translateY}px)`,
            marginTop: 24,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: experimentType.headingM.size,
              fontWeight: experimentType.headingM.weight,
              lineHeight: experimentType.headingM.lineHeight,
              color: experimentColor.secondaryText,
            }}
          >
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
};
