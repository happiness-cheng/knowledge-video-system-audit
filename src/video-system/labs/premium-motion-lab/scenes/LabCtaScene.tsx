import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { fadeSlideIn } from "../tokens/motion";
import { MotionButton } from "../components/MotionButton";
import { fontSize, fontWeight, typeScale } from "../tokens/typography";
import { labContent } from "../labContent";

/**
 * S06 LabCtaScene — 行动号召页
 * - 收束 S05 的模板
 * - 按钮 spring 入场
 * - 按钮可以轻微呼吸，但不能闪烁
 * - 不像营销海报
 * - 不出现多个按钮
 */
export const LabCtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scene = labContent.scenes[5]; // S06

  // 标题入场
  const titleAnim = fadeSlideIn(frame, fps, 0);
  // 副标题入场（延迟 10 帧）
  const subtitleAnim = fadeSlideIn(frame, fps, 10);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 标题 */}
      <div
        style={{
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.translateY}px)`,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: fontSize("headingL"),
            fontWeight: fontWeight("headingL"),
            color: "#ffffff",
            lineHeight: typeScale.headingL.lineHeight,
          }}
        >
          {scene.title}
        </span>
      </div>

      {/* 副标题 */}
      {scene.subtitle && (
        <div
          style={{
            opacity: subtitleAnim.opacity,
            transform: `translateY(${subtitleAnim.translateY}px)`,
            marginTop: 16,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: fontSize("headingM"),
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: typeScale.headingM.lineHeight,
            }}
          >
            {scene.subtitle}
          </span>
        </div>
      )}

      {/* 按钮 */}
      <div style={{ marginTop: 48 }}>
        <MotionButton text="收藏这个模板" delay={20} breathe={true} />
      </div>
    </AbsoluteFill>
  );
};
