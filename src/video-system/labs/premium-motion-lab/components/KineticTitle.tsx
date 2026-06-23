import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { fadeSlideIn, springIn, motion } from "../tokens/motion";
import { fontSize, fontWeight, typeScale } from "../tokens/typography";

interface KineticTitleProps {
  /** 主标题（支持 \n 换行） */
  title: string;
  /** 副标题 */
  subtitle?: string;
  /** 需要强调的关键词 */
  keywords?: string[];
  /** 入场延迟帧数 */
  delay?: number;
  /** 使用 spring 入场（否则用 fadeSlide） */
  useSpring?: boolean;
}

/**
 * 动感标题组件
 * - 主标题 spring 入场
 * - 副标题延迟 fadeSlide
 * - 关键词高亮
 * - 支持显式中文换行
 */
export const KineticTitle: React.FC<KineticTitleProps> = ({
  title,
  subtitle,
  keywords = [],
  delay = 0,
  useSpring = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 主标题入场
  const titleProgress = useSpring
    ? springIn(frame, fps, delay)
    : fadeSlideIn(frame, fps, delay, motion.enter.durationFrames).opacity;

  // 副标题入场（延迟 15 帧）
  const subtitleAnim = fadeSlideIn(frame, fps, delay + 15);

  // 按 \n 拆分标题行
  const titleLines = title.split("\n");

  // 高亮关键词
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
                background: "linear-gradient(120deg, #f59e0b 0%, #f97316 100%)",
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
      {/* 主标题 */}
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
              fontSize: fontSize("displayL"),
              fontWeight: fontWeight("displayL"),
              lineHeight: typeScale.displayL.lineHeight,
              color: "#ffffff",
              letterSpacing: "-0.01em",
            }}
          >
            {highlightKeyword(line)}
          </div>
        ))}
      </div>

      {/* 副标题 */}
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
              fontSize: fontSize("headingM"),
              fontWeight: fontWeight("headingM"),
              lineHeight: typeScale.headingM.lineHeight,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
};
