/**
 * 待办清单场景
 *
 * 行动清单、检查项。逐条出现，每条文字大而清楚。
 */

import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  interpolate,
} from "remotion";
import type { VideoTheme } from "../themes/types";
import { fadeSlideIn, progressiveReveal } from "../utils/animation";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";
import type { PresentationMode } from "../themes/types";
import { directorCuesDraft } from "../data/directorCuesDraft";
import {
  resolveActiveTarget,
  getSpotlightVisualState,
} from "../utils/directorCue";
import { MotionListItem } from "../components/motion/MotionListItem";

/** lab-template 标题子组件（Sequence 内调用 useCurrentFrame） */
const LabTemplateTitle: React.FC<{
  title: string;
  theme: VideoTheme;
  titleScale: number;
}> = ({ title, theme, titleScale }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlideIn({ frame, fps });
  return (
    <h2
      style={{
        fontSize: Math.max(theme.titleStyle.fontSize * 0.88, 88) * titleScale,
        fontWeight: theme.titleStyle.fontWeight,
        color: theme.primaryText,
        marginBottom: 24,
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
        textAlign: "center",
      }}
    >
      {title}
    </h2>
  );
};

export interface TodoChecklistSceneData {
  type: "todo-checklist";
  id?: string;
  title: string;
  items: string[];
  keywords?: string[];
  animation?: string;
  visualRole?: string;
}

export const TodoChecklistScene: React.FC<{
  scene: TodoChecklistSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
  presentationMode?: PresentationMode;
}> = ({ scene, theme, layout = "landscape", presentationMode = "default" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lc = useLayoutConfig(layout);
  const isLab = presentationMode === "knowledge-lab";
  const isLabTemplate = isLab && scene.visualRole === "template";

  const titleAnim = fadeSlideIn({ frame, fps, delay: 0 });

  // Director cue progressive-retain 叠加层（仅 visualRole=template 且有 cue 数据时启用）
  const cueData = scene.id ? directorCuesDraft[scene.id] : undefined;
  const useCueRetain = scene.visualRole === "template" && !!cueData;
  const cueState = useCueRetain ? resolveActiveTarget(frame, cueData!) : null;

  // 实验台模式：模板卡样式，更大更集中
  const labCardStyle = isLabTemplate
    ? {
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8F9FF 100%)",
        border: `2px solid ${theme.accentColor}33`,
        borderRadius: 24,
        padding: "36px 40px",
        boxShadow: `0 16px 48px ${theme.accentColor}18`,
      }
    : {};

  // lab-template 模式：模板卡整体进入，四项等权，稳定可截图
  if (isLabTemplate) {
    const cardAnim = fadeSlideIn({ frame, fps, delay: 8 });
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: theme.background,
          fontFamily: theme.fontFamily,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 48px",
        }}
      >
        {theme.toplineGradient && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: theme.toplineGradient,
            }}
          />
        )}
        <Sequence from={0} layout="none">
          <LabTemplateTitle
            title={scene.title}
            theme={theme}
            titleScale={lc.titleScale}
          />
        </Sequence>
        <div
          style={{
            background: "linear-gradient(180deg, #FFFFFF 0%, #F8F9FF 100%)",
            border: `2px solid ${theme.accentColor}33`,
            borderRadius: 24,
            padding: "36px 40px",
            boxShadow: `0 16px 48px ${theme.accentColor}18`,
            maxWidth: 1200,
            width: "100%",
            opacity: cardAnim.opacity,
            transform: `translateY(${cardAnim.translateY}px)`,
          }}
        >
          {scene.items.map((item, i) => (
            <MotionListItem
              key={i}
              theme={theme}
              accent={theme.accentColor}
              progress={1}
              focusProgress={0}
              borderRadius={14}
              padding="18px 24px"
              gap={18}
              translateY={0}
              translateX={0}
              style={{ boxShadow: "none" }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: `2px solid ${theme.accentColor}`,
                  background: theme.accentColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "#fff",
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                {i + 1}
              </div>
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  color: theme.primaryText,
                  lineHeight: 1.4,
                }}
              >
                {item}
              </div>
            </MotionListItem>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: theme.background,
        fontFamily: theme.fontFamily,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: lc.padding,
      }}
    >
      {theme.toplineGradient && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: theme.toplineGradient,
          }}
        />
      )}

      <h2
        style={{
          fontSize:
            Math.max(theme.titleStyle.fontSize * 0.88, 88) * lc.titleScale,
          fontWeight: theme.titleStyle.fontWeight,
          color: theme.primaryText,
          marginBottom: lc.sectionGap + 8,
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.translateY}px)`,
          textAlign: "left",
        }}
      >
        {scene.title}
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: lc.gap,
          maxWidth: 1400,
          width: "auto",
        }}
      >
        {scene.items.map((item, i) => {
          const anim = progressiveReveal({
            frame,
            fps,
            index: i,
            total: scene.items.length,
            staggerDelay: isLabTemplate ? 20 : 15,
          });

          // cue-driven progressive-retain spotlight 叠加
          const itemCueTarget = `item-${i}`;
          const itemVisual = cueState
            ? getSpotlightVisualState(
                itemCueTarget,
                cueState.activeTarget,
                cueState.targetOpacity,
                "progressive-retain",
                0,
              )
            : null;
          const cueBorderOp = itemVisual ? itemVisual.borderOpacity : 0;
          const cueTextOp = itemVisual ? itemVisual.textOpacity : 1;
          const cueTitleOp = itemVisual ? itemVisual.titleOpacity : 1;
          const cueTranslateX = itemVisual ? itemVisual.translateX : 0;
          const cueShadow = itemVisual ? itemVisual.shadowStrength : 0;

          return (
            <MotionListItem
              key={i}
              theme={theme}
              accent={theme.accentColor}
              progress={anim.opacity}
              focusProgress={cueBorderOp}
              retainedProgress={cueTextOp}
              borderRadius={isLabTemplate ? 14 : theme.radius.md}
              padding={isLabTemplate ? "18px 24px" : "28px 36px"}
              gap={isLabTemplate ? 18 : 20}
              translateX={cueTranslateX}
              translateY={24}
              style={{
                background: isLabTemplate ? "#FFFFFF" : theme.cardBackground,
                boxShadow:
                  cueShadow > 0.15
                    ? `0 8px 32px rgba(0,0,0,${cueShadow})`
                    : isLabTemplate
                      ? "none"
                      : theme.shadow,
              }}
            >
              {/* 编号 */}
              <div
                style={{
                  width: isLabTemplate ? 48 : 52,
                  height: isLabTemplate ? 48 : 52,
                  borderRadius: isLabTemplate ? "50%" : 8,
                  border: `2px solid ${theme.accentColor}${cueTitleOp > 0.7 ? "" : "66"}`,
                  background:
                    cueTitleOp > 0.7
                      ? theme.accentColor
                      : isLabTemplate
                        ? theme.accentColor
                        : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: cueTitleOp > 0.7 ? "#fff" : theme.accentColor,
                  fontSize: isLabTemplate ? 22 : 28,
                  fontWeight: 700,
                  opacity: cueTitleOp,
                }}
              >
                {isLabTemplate ? i + 1 : "✓"}
              </div>
              <div
                style={{
                  fontSize: isLabTemplate ? 48 : 44,
                  fontWeight: cueTitleOp > 0.7 ? 700 : 600,
                  color:
                    cueTitleOp > 0.7 ? theme.primaryText : theme.secondaryText,
                  lineHeight: 1.4,
                  opacity: cueTextOp,
                }}
              >
                {item}
              </div>
            </MotionListItem>
          );
        })}
      </div>
    </div>
  );
};
