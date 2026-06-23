import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { experimentColor } from "../tokens/experimentColor";
import { experimentType } from "../tokens/experimentTypography";
import { expFadeSlideIn } from "../tokens/experimentMotion";
import { EvidenceShot } from "../components/EvidenceShot";
import {
  getSceneCues,
  resolveActiveTarget,
  DECAY_FRAMES,
} from "../experimentDirectorCues";
import type { ExperimentSceneData } from "../experimentContent";

/**
 * S04 Evidence Shot
 *
 * 证据页。使用语义裁剪后的证据。
 * 左证据 active → 右证据 active → 对比结论 active。
 * active timing 跟 director cue 走。
 */
export const ExperimentEvidenceScene: React.FC<{
  scene: ExperimentSceneData;
  totalFrames: number;
}> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = expFadeSlideIn(frame, fps, 0);

  // Director cue 驱动 active
  const sceneCues = getSceneCues("S04");
  const { activeTarget, targetOpacity } = sceneCues
    ? resolveActiveTarget(frame, sceneCues.cues, DECAY_FRAMES, "strict-switch")
    : { activeTarget: "left-evidence", targetOpacity: () => 1 };

  // 对比结论在最后阶段出现
  const conclusionOpacity = targetOpacity("contrast-conclusion");

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "56px 120px",
      }}
    >
      {/* 顶部标题 */}
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

      {/* 大结论 */}
      {scene.conclusion && (
        <div
          style={{
            fontSize: experimentType.headingM.size,
            fontWeight: 900,
            color: experimentColor.accent,
            marginBottom: 28,
            textAlign: "center",
            opacity: interpolate(conclusionOpacity, [0.4, 1], [0.5, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          {scene.conclusion}
        </div>
      )}

      {/* 左右证据 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
        }}
      >
        <EvidenceShot
          label={scene.leftLabel ?? "直接问"}
          caption={scene.leftCaption ?? ""}
          accent={experimentColor.evidenceLeft}
          activeOpacity={targetOpacity("left-evidence")}
          delay={10}
        />
        <EvidenceShot
          label={scene.rightLabel ?? "补背景后"}
          caption={scene.rightCaption ?? ""}
          accent={experimentColor.evidenceRight}
          activeOpacity={targetOpacity("right-evidence")}
          delay={18}
        />
      </div>
    </div>
  );
};
