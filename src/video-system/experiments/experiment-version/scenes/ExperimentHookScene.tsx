import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { experimentColor } from "../tokens/experimentColor";
import { experimentType } from "../tokens/experimentTypography";
import { expSpringIn, expFadeSlideIn } from "../tokens/experimentMotion";
import type { ExperimentSceneData } from "../experimentContent";

/**
 * S01 Hook Shot
 *
 * 真实误判开场。不是 PPT 标题页。
 * 标题分层入场，背景有轻微生命力。
 */
export const ExperimentHookScene: React.FC<{
  scene: ExperimentSceneData;
  totalFrames: number;
}> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 主标题分层入场：第一行先到，第二行后到
  const line1Progress = expSpringIn(frame, fps, 0);
  const line2Progress = expSpringIn(frame, fps, 10);

  const titleLines = (scene.title ?? "").split("\n");

  // 轻微 scale breathing
  const breathe = interpolate(Math.sin(frame * 0.03), [-1, 1], [1.0, 1.005]);

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
      {/* 第一行：我一开始以为 */}
      {titleLines[0] && (
        <div
          style={{
            fontSize: experimentType.headingM.size,
            fontWeight: experimentType.headingM.weight,
            color: experimentColor.secondaryText,
            opacity: line1Progress,
            transform: `translateY(${(1 - line1Progress) * 20}px) scale(${breathe})`,
            marginBottom: 8,
          }}
        >
          {titleLines[0]}
        </div>
      )}

      {/* 第二行：是 AI 不够聪明 */}
      {titleLines[1] && (
        <div
          style={{
            fontSize: experimentType.displayXL.size,
            fontWeight: experimentType.displayXL.weight,
            lineHeight: experimentType.displayXL.lineHeight,
            background: experimentColor.accentGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            opacity: line2Progress,
            transform: `translateY(${(1 - line2Progress) * 25}px) scale(${breathe})`,
          }}
        >
          {titleLines[1]}
        </div>
      )}

      {/* 副标题 */}
      {scene.subtitle && (
        <div
          style={{
            ...expFadeSlideIn(frame, fps, 20),
            marginTop: 20,
            fontSize: experimentType.headingM.size,
            fontWeight: experimentType.headingM.weight,
            color: experimentColor.mutedText,
          }}
        >
          {scene.subtitle}
        </div>
      )}
    </div>
  );
};
