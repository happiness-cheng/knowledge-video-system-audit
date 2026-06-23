/**
 * 步骤流程场景
 *
 * 标题 + 步骤节点列表，支持 progressive-reveal 和 highlight-current。
 * progressive 模式使用 Sequence 内部时间轴；highlight 模式保持原逻辑。
 */

import React from "react";
import { useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import type { VideoTheme } from "../themes/types";
import {
  fadeSlideIn,
  progressiveReveal,
  highlightCurrent,
  sequenceHighlight,
} from "../utils/animation";
import { Arrow } from "../components/Arrow";
import { BackgroundLayer } from "../components/BackgroundLayer";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";
import { MotionListItem } from "../components/motion/MotionListItem";

export interface ProcessStepsSceneData {
  type: "process-steps";
  title: string;
  steps: string[];
  revealMode?: "progressive" | "highlight";
  animation?: string;
}

/** 标题子组件（Sequence 内调用 useCurrentFrame） */
const ProcessTitle: React.FC<{
  title: string;
  theme: VideoTheme;
  titleScale: number;
  sectionGap: number;
}> = ({ title, theme, titleScale, sectionGap }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlideIn({ frame, fps, delay: 0 });
  return (
    <h2
      style={{
        fontSize: Math.max(theme.titleStyle.fontSize * 0.88, 88) * titleScale,
        fontWeight: theme.titleStyle.fontWeight,
        color: theme.primaryText,
        marginBottom: sectionGap + 12,
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
        zIndex: 1,
      }}
    >
      {title}
    </h2>
  );
};

const ProcessStepItem: React.FC<{
  theme: VideoTheme;
  index: number;
  label: string;
  width: number;
  active: boolean;
  dimmed: boolean;
  progress: number;
  retainedProgress: number;
}> = ({
  theme,
  index,
  label,
  width,
  active,
  dimmed,
  progress,
  retainedProgress,
}) => {
  const focusProgress = active ? 1 : dimmed ? 0 : 0.28;

  return (
    <MotionListItem
      theme={theme}
      accent={theme.accentColor}
      progress={progress}
      focusProgress={focusProgress}
      retainedProgress={retainedProgress}
      borderRadius={theme.radius.md}
      padding="28px 34px"
      gap={22}
      translateY={22}
      translateX={8}
      style={{ width }}
    >
      <div
        style={{
          width: active ? 56 : 48,
          height: active ? 56 : 48,
          borderRadius: "50%",
          background: active
            ? theme.accentColor
            : dimmed
              ? theme.cardBorder
              : `${theme.accentColor}44`,
          color: active
            ? "#fff"
            : dimmed
              ? theme.secondaryText
              : theme.accentColor,
          display: "grid",
          placeItems: "center",
          fontSize: active ? 24 : 20,
          fontWeight: 800,
          fontFamily: theme.monoFont,
          flexShrink: 0,
          boxShadow: active ? `0 0 12px ${theme.accentColor}44` : "none",
        }}
      >
        {index + 1}
      </div>
      <div
        style={{
          fontSize: 46,
          fontWeight: active ? 850 : 720,
          color: active ? theme.primaryText : theme.secondaryText,
          fontFamily: theme.fontFamily,
          lineHeight: 1.18,
        }}
      >
        {label}
      </div>
    </MotionListItem>
  );
};

export const ProcessStepsScene: React.FC<{
  scene: ProcessStepsSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
}> = ({ scene, theme, totalFrames, layout = "landscape" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lc = useLayoutConfig(layout);

  const isHighlight = scene.revealMode === "highlight";
  const activeIdx = isHighlight
    ? highlightCurrent({ frame, fps, total: scene.steps.length, totalFrames })
    : -1;

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
        padding: lc.padding,
      }}
    >
      <BackgroundLayer theme={theme} mode="grid" sectionNumber="01" />

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

      {/* 标题 */}
      <Sequence from={0} layout="none">
        <ProcessTitle
          title={scene.title}
          theme={theme}
          titleScale={lc.titleScale}
          sectionGap={lc.sectionGap}
        />
      </Sequence>

      {/* 步骤节点 + 箭头 */}
      <div
        style={{
          display: "flex",
          flexDirection: layout === "portrait" ? "column" : "row",
          alignItems: "center",
          gap: lc.gap,
          flexWrap: layout === "portrait" ? "nowrap" : "wrap",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        {isHighlight
          ? // highlight 模式：保持原逻辑
            scene.steps.map((step, i) => {
              const anim = progressiveReveal({
                frame,
                fps,
                index: i,
                total: scene.steps.length,
                staggerDelay: 15,
              });
              const isActive = activeIdx === i;
              let nodeOpacity = 1;
              if (activeIdx >= 0) {
                if (isActive) nodeOpacity = 1;
                else if (Math.abs(i - activeIdx) === 1) nodeOpacity = 0.65;
                else nodeOpacity = 0.4;
              }

              return (
                <React.Fragment key={i}>
                  <ProcessStepItem
                    theme={theme}
                    index={i}
                    label={step}
                    active={isActive}
                    dimmed={!isActive && Math.abs(i - activeIdx) > 1}
                    width={lc.nodeWidth}
                    progress={anim.opacity}
                    retainedProgress={nodeOpacity}
                  />
                  {i < scene.steps.length - 1 && (
                    <div style={{ opacity: anim.opacity }}>
                      <Arrow
                        theme={theme}
                        direction={layout === "portrait" ? "down" : "right"}
                        active={isActive}
                        size={48}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })
          : // progressive 模式：sequenceHighlight
            scene.steps.map((step, i) => {
              const anim = sequenceHighlight({
                frame,
                fps,
                index: i,
                total: scene.steps.length,
                totalFrames,
                staggerDelay: 15,
              });
              if (!anim.visible) return null;
              return (
                <React.Fragment key={i}>
                  <ProcessStepItem
                    theme={theme}
                    index={i}
                    label={step}
                    active={anim.isCurrent}
                    dimmed={anim.dimmed}
                    width={lc.nodeWidth}
                    progress={anim.opacity}
                    retainedProgress={anim.dimmed ? 0.58 : 1}
                  />
                  {i < scene.steps.length - 1 && (
                    <div style={{ opacity: anim.opacity }}>
                      <Arrow
                        theme={theme}
                        direction={layout === "portrait" ? "down" : "right"}
                        active={anim.isCurrent}
                        size={48}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
      </div>
    </div>
  );
};
