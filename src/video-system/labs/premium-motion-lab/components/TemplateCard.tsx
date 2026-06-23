import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fadeSlideIn, progressiveReveal, motion } from "../tokens/motion";
import { fontSize, fontWeight, typeScale } from "../tokens/typography";
import { layout } from "../tokens/layout";

interface TemplateCardProps {
  /** 标题 */
  title: string;
  /** 步骤列表 */
  steps: string[];
  /** 入场延迟 */
  delay?: number;
}

/**
 * 模板卡组件
 * - 像工具卡，不像 bullet list
 * - 四步逐个点亮
 * - 当前步骤突出，其他保留上下文
 * - 有截图保存价值
 */
export const TemplateCard: React.FC<TemplateCardProps> = ({
  title,
  steps,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 标题入场
  const titleAnim = fadeSlideIn(frame, fps, delay);

  // 保存提示入场（延迟 90 帧）
  const saveHintAnim = fadeSlideIn(frame, fps, delay + 90);

  const renderStep = (step: string, index: number) => {
    const reveal = progressiveReveal(
      frame,
      fps,
      index,
      motion.stagger.delayFrames,
      motion.stagger.durationFrames,
    );

    // 计算当前活跃步骤（基于帧数）
    const entranceEnd =
      steps.length * motion.stagger.delayFrames + motion.enter.durationFrames;
    const isActive =
      frame > entranceEnd
        ? Math.floor(((frame - entranceEnd) / (fps * 0.5)) % steps.length) ===
          index
        : index ===
          Math.min(
            Math.floor(frame / motion.stagger.delayFrames),
            steps.length - 1,
          );

    return (
      <div
        key={index}
        style={{
          opacity: reveal.visible ? reveal.opacity : 0,
          transform: `translateY(${reveal.translateY}px)`,
          display: "flex",
          alignItems: "flex-start",
          gap: 20,
          padding: "20px 24px",
          borderRadius: 12,
          backgroundColor: isActive
            ? "rgba(245, 158, 11, 0.1)"
            : "rgba(255, 255, 255, 0.03)",
          border: isActive
            ? "1px solid rgba(245, 158, 11, 0.3)"
            : "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* 步骤编号 */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: isActive ? "#f59e0b" : "rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: isActive ? "#000000" : "rgba(255, 255, 255, 0.5)",
            }}
          >
            {index + 1}
          </span>
        </div>

        {/* 步骤内容 */}
        <div
          style={{
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: fontSize("bodyM"),
              fontWeight: isActive ? 600 : 500,
              color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
              lineHeight: typeScale.bodyM.lineHeight,
            }}
          >
            {step}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: layout.padding.y,
        alignItems: "center",
      }}
    >
      {/* 标题 */}
      <div
        style={{
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.translateY}px)`,
          marginBottom: 48,
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
          {title}
        </span>
      </div>

      {/* 模板卡主体 */}
      <div
        style={{
          width: "80%",
          maxWidth: 800,
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          borderRadius: layout.templateCard.borderRadius,
          padding: layout.templateCard.padding,
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: layout.templateCard.stepGap,
          }}
        >
          {steps.map((step, i) => renderStep(step, i))}
        </div>
      </div>

      {/* 保存提示 */}
      <div
        style={{
          opacity: saveHintAnim.opacity,
          transform: `translateY(${saveHintAnim.translateY}px)`,
          marginTop: 32,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: fontSize("label"),
            fontWeight: 500,
            color: "rgba(255, 255, 255, 0.4)",
          }}
        >
          截图保存，随时可用
        </span>
      </div>
    </div>
  );
};
