import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { experimentColor } from "../tokens/experimentColor";
import { experimentType } from "../tokens/experimentTypography";
import { expFadeSlideIn, expSpringIn } from "../tokens/experimentMotion";
import { MotionButton } from "../components/MotionButton";
import type { ExperimentSceneData } from "../experimentContent";

/**
 * S08 CTA / Next Hook
 *
 * 收束本集，钩住下一篇。
 * 按钮有轻微行动感，但不广告化。
 */
export const ExperimentCtaScene: React.FC<{
  scene: ExperimentSceneData;
  totalFrames: number;
}> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = expSpringIn(frame, fps, 0);
  const subtitleAnim = expFadeSlideIn(frame, fps, 10);

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
        gap: 24,
      }}
    >
      {/* 主标题 */}
      {scene.title && (
        <div
          style={{
            fontSize: experimentType.headingL.size,
            fontWeight: experimentType.headingL.weight,
            color: experimentColor.primaryText,
            opacity: titleProgress,
            transform: `translateY(${(1 - titleProgress) * 15}px)`,
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
            opacity: subtitleAnim.opacity,
            transform: `translateY(${subtitleAnim.translateY}px)`,
          }}
        >
          {scene.subtitle}
        </div>
      )}

      {/* 按钮 */}
      {scene.actionText && (
        <div style={{ marginTop: 32 }}>
          <MotionButton text={scene.actionText} />
        </div>
      )}
    </div>
  );
};
