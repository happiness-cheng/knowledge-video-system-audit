import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { fadeSlideIn, springIn } from "../tokens/motion";
import { fontSize, fontWeight, typeScale } from "../tokens/typography";
import { labContent } from "../labContent";

/**
 * S04 LabInsightScene — 阶段钉子页
 * - 两行语义完整
 * - 不出现单字孤行
 * - 字号比 Hook 小一档
 * - 背景聚焦，文字钉住
 * - 不堆卡片
 */
export const LabInsightScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scene = labContent.scenes[3]; // S04

  // 大字 spring 入场
  const quoteProgress = springIn(frame, fps, 0);

  // 副句 fade 入场（延迟 20 帧）
  const subtitleAnim = fadeSlideIn(frame, fps, 20);

  // 按 \n 拆分引言行
  const quoteLines = scene.quote!.split("\n");

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 核心判断 */}
      <div
        style={{
          opacity: quoteProgress,
          transform: `translateY(${(1 - quoteProgress) * 15}px)`,
          textAlign: "center",
        }}
      >
        {quoteLines.map((line, i) => (
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
            {line}
          </div>
        ))}
      </div>

      {/* 副句 */}
      {scene.subtitle && (
        <div
          style={{
            opacity: subtitleAnim.opacity,
            transform: `translateY(${subtitleAnim.translateY}px)`,
            marginTop: 32,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: fontSize("headingM"),
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.6)",
              lineHeight: typeScale.headingM.lineHeight,
            }}
          >
            {scene.subtitle}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
