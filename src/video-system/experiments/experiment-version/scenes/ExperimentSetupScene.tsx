import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { experimentColor } from "../tokens/experimentColor";
import { experimentType } from "../tokens/experimentTypography";
import { expFadeSlideIn, expProgressiveReveal } from "../tokens/experimentMotion";
import type { ExperimentSceneData } from "../experimentContent";

/**
 * S03 Experiment Setup Shot
 *
 * 实验变量逐步加入。
 * 三个步骤逐个出现，有 prompt 卡逐步补全感。
 * 标注：这是试验能力，不代表实践版已支持。
 */
export const ExperimentSetupScene: React.FC<{
  scene: ExperimentSceneData;
  totalFrames: number;
}> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = expFadeSlideIn(frame, fps, 0);
  const subtitleAnim = expFadeSlideIn(frame, fps, 8);

  const steps = scene.steps ?? [];

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
      {/* 标题 */}
      {scene.title && (
        <div
          style={{
            fontSize: experimentType.headingL.size,
            fontWeight: experimentType.headingL.weight,
            color: experimentColor.primaryText,
            marginBottom: 12,
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.translateY}px)`,
          }}
        >
          {scene.title}
        </div>
      )}

      {/* 副标题 */}
      {scene.subtitle && (
        <div
          style={{
            fontSize: experimentType.headingM.size,
            fontWeight: experimentType.headingM.weight,
            color: experimentColor.secondaryText,
            marginBottom: 48,
            opacity: subtitleAnim.opacity,
            transform: `translateY(${subtitleAnim.translateY}px)`,
          }}
        >
          {scene.subtitle}
        </div>
      )}

      {/* 步骤逐个出现 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          width: "70%",
          maxWidth: 1000,
        }}
      >
        {steps.map((step, i) => {
          const stepAnim = expProgressiveReveal(frame, fps, i, 18, 15);
          // 当前步骤高亮
          const isActive = stepAnim.visible && stepAnim.opacity > 0.8;
          const activeBg = isActive
            ? `rgba(99,102,241,0.08)`
            : "transparent";
          const borderLeft = isActive
            ? `3px solid ${experimentColor.accent}`
            : "3px solid transparent";

          return (
            <div
              key={i}
              style={{
                opacity: stepAnim.opacity,
                transform: `translateY(${stepAnim.translateY}px)`,
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "20px 32px",
                borderRadius: 16,
                background: activeBg,
                borderLeft,
                textAlign: "left",
              }}
            >
              {/* 步骤编号 */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: isActive
                    ? experimentColor.accent
                    : experimentColor.cardBorder,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: experimentType.meta.size,
                  fontWeight: 700,
                  color: isActive
                    ? experimentColor.primaryText
                    : experimentColor.mutedText,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>

              {/* 步骤文字 */}
              <div
                style={{
                  fontSize: experimentType.bodyL.size,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive
                    ? experimentColor.primaryText
                    : experimentColor.secondaryText,
                  lineHeight: experimentType.bodyL.lineHeight,
                }}
              >
                {step}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
