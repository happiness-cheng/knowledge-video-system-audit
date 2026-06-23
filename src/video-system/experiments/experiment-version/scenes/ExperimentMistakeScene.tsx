import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { experimentColor } from "../tokens/experimentColor";
import { experimentType } from "../tokens/experimentTypography";
import { expFadeSlideIn } from "../tokens/experimentMotion";
import { ActiveCard } from "../components/ActiveCard";
import {
  getSceneCues,
  resolveActiveTarget,
  DECAY_FRAMES,
} from "../experimentDirectorCues";
import type { ExperimentSceneData } from "../experimentContent";

/**
 * S02 Mistake Shot
 *
 * 错误现场。
 * 左侧错误输入先成为焦点，右侧结果后成为焦点。
 * active timing 跟 director cue 走。
 */
export const ExperimentMistakeScene: React.FC<{
  scene: ExperimentSceneData;
  totalFrames: number;
}> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = expFadeSlideIn(frame, fps, 0);

  // Director cue 驱动 active
  const sceneCues = getSceneCues("S02");
  const { activeTarget, targetOpacity } = sceneCues
    ? resolveActiveTarget(frame, sceneCues.cues, DECAY_FRAMES, "strict-switch")
    : { activeTarget: "left", targetOpacity: () => 1 };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "56px 120px",
        fontFamily: "sans-serif",
      }}
    >
      {/* 顶部标题 */}
      {scene.title && (
        <div
          style={{
            fontSize: experimentType.headingL.size,
            fontWeight: experimentType.headingL.weight,
            color: experimentColor.primaryText,
            marginBottom: 32,
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.translateY}px)`,
          }}
        >
          {scene.title}
        </div>
      )}

      {/* 双栏 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
        }}
      >
        <ActiveCard
          title={scene.leftTitle ?? ""}
          items={scene.leftItems ?? []}
          accent={experimentColor.danger}
          activeOpacity={targetOpacity("left")}
          delay={8}
        />
        <ActiveCard
          title={scene.rightTitle ?? ""}
          items={scene.rightItems ?? []}
          accent={experimentColor.secondaryText}
          activeOpacity={targetOpacity("right")}
          delay={16}
        />
      </div>
    </div>
  );
};
