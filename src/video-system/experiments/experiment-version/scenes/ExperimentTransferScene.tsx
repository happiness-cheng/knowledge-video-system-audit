import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { experimentColor } from "../tokens/experimentColor";
import { experimentType } from "../tokens/experimentTypography";
import { expFadeSlideIn } from "../tokens/experimentMotion";
import {
  getSceneCues,
  resolveActiveTarget,
  DECAY_FRAMES,
} from "../experimentDirectorCues";
import type { ExperimentSceneData } from "../experimentContent";

/**
 * S06 Transfer Shot
 *
 * 迁移证明。三栏依次成为视觉中心。
 * 旧栏降权但保持可读。active timing 跟 director cue 走。
 */
export const ExperimentTransferScene: React.FC<{
  scene: ExperimentSceneData;
  totalFrames: number;
}> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = expFadeSlideIn(frame, fps, 0);
  const columns = scene.columns ?? [];

  // Director cue 驱动 active
  const sceneCues = getSceneCues("S06");
  const { activeTarget, targetOpacity } = sceneCues
    ? resolveActiveTarget(frame, sceneCues.cues, DECAY_FRAMES, "strict-switch")
    : {
        activeTarget: "column-0",
        targetOpacity: (t: string) => {
          const idx = parseInt(t.replace("column-", ""), 10);
          return idx === 0 ? 1 : 0.4;
        },
      };

  const columnAccents = [
    experimentColor.accent,
    experimentColor.success,
    experimentColor.warning,
  ];

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
      {/* 标题 */}
      {scene.title && (
        <div
          style={{
            fontSize: experimentType.headingL.size,
            fontWeight: experimentType.headingL.weight,
            color: experimentColor.primaryText,
            marginBottom: 40,
            textAlign: "center",
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.translateY}px)`,
          }}
        >
          {scene.title}
        </div>
      )}

      {/* 三栏 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 28,
        }}
      >
        {columns.map((col, i) => {
          const colTarget = `column-${i}`;
          const activeOpacity = targetOpacity(colTarget);
          const colAnim = expFadeSlideIn(frame, fps, 10 + i * 12);
          const accent = columnAccents[i] ?? experimentColor.accent;

          const scale = interpolate(
            activeOpacity,
            [0.4, 1],
            [0.97, 1.01],
            { extrapolateRight: "clamp" },
          );
          const borderOpacity = interpolate(
            activeOpacity,
            [0.4, 1],
            [0.06, 0.2],
            { extrapolateRight: "clamp" },
          );

          return (
            <div
              key={i}
              style={{
                opacity: colAnim.opacity * activeOpacity,
                transform: `translateY(${colAnim.translateY}px) scale(${scale})`,
                background: experimentColor.cardBg,
                border: `1.5px solid rgba(255,255,255,${borderOpacity})`,
                borderRadius: 20,
                padding: 36,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                boxShadow:
                  activeOpacity > 0.8
                    ? `0 0 24px ${accent}15`
                    : "none",
              }}
            >
              {/* 栏标题 */}
              <div
                style={{
                  fontSize: experimentType.headingM.size,
                  fontWeight: 700,
                  color: accent,
                  opacity: activeOpacity > 0.8 ? 1 : 0.7,
                }}
              >
                {col.title}
              </div>
              {/* 栏文字 */}
              <div
                style={{
                  fontSize: experimentType.bodyM.size,
                  fontWeight: 500,
                  color:
                    activeOpacity > 0.8
                      ? experimentColor.primaryText
                      : experimentColor.secondaryText,
                  lineHeight: experimentType.bodyM.lineHeight,
                }}
              >
                {col.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
