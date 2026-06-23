/**
 * 路线图场景
 *
 * 标题 + 多阶段卡片，支持 progressive-reveal 和 highlight-current。
 * 精修：背景网格 + 章节编号 + 3 级可见性 + 卡片放大
 */

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoTheme } from "../themes/types";
import {
  fadeSlideIn,
  progressiveReveal,
  highlightCurrent,
  sequenceHighlight,
} from "../utils/animation";
import { Card } from "../components/Card";
import { BackgroundLayer } from "../components/BackgroundLayer";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";
import { MotionConnector } from "../components/motion/MotionConnector";

export interface RoadmapSceneData {
  type: "roadmap";
  title: string;
  stages: Array<{ label: string; description?: string }>;
  revealMode?: "progressive" | "highlight";
  animation?: string;
}

export const RoadmapScene: React.FC<{
  scene: RoadmapSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
}> = ({ scene, theme, totalFrames, layout = "landscape" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lc = useLayoutConfig(layout);

  const titleAnim = fadeSlideIn({ frame, fps, delay: 0 });
  const isHighlight = scene.revealMode === "highlight";
  const activeIdx = isHighlight
    ? highlightCurrent({ frame, fps, total: scene.stages.length, totalFrames })
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
        padding: theme.spacing.page,
      }}
    >
      <BackgroundLayer theme={theme} mode="grid" sectionNumber="03" />

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
          fontSize: Math.max(theme.titleStyle.fontSize * 0.88, 88),
          fontWeight: theme.titleStyle.fontWeight,
          color: theme.primaryText,
          marginBottom: theme.spacing.section + 12,
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.translateY}px)`,
          zIndex: 1,
        }}
      >
        {scene.title}
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: theme.spacing.item,
          zIndex: 1,
        }}
      >
        {isHighlight
          ? // highlight 模式：保持原逻辑
            scene.stages.map((stage, i) => {
              const anim = progressiveReveal({
                frame,
                fps,
                index: i,
                total: scene.stages.length,
                staggerDelay: 15,
              });
              const isActive = activeIdx === i;
              // 3 级可见性
              let cardOpacity = 1;
              if (activeIdx >= 0) {
                if (isActive) cardOpacity = 1;
                else if (Math.abs(i - activeIdx) === 1) cardOpacity = 0.65;
                else cardOpacity = 0.4;
              }

              return (
                <React.Fragment key={i}>
                  <div
                    style={
                      {
                        flex: 1,
                        minWidth: 0,
                        opacity: cardOpacity,
                        transform: `translateY(${anim.translateY}px)`,
                      } as React.CSSProperties
                    }
                  >
                    <Card
                      theme={theme}
                      accent={isActive ? theme.accentColor : undefined}
                      style={
                        isActive
                          ? {
                              boxShadow: `0 0 24px ${theme.accentColor}33`,
                              borderWidth: 2,
                            }
                          : undefined
                      }
                    >
                      <div
                        style={{
                          fontSize: 30,
                          fontWeight: 700,
                          color: isActive
                            ? theme.accentColor
                            : theme.secondaryText,
                          fontFamily: theme.monoFont,
                          marginBottom: 10,
                          letterSpacing: 1,
                        }}
                      >
                        阶段 {String(i + 1).padStart(2, "0")}
                      </div>
                      <div
                        style={{
                          fontSize: 42,
                          fontWeight: 700,
                          color: theme.primaryText,
                          lineHeight: 1.3,
                        }}
                      >
                        {stage.label}
                      </div>
                      {stage.description && (
                        <div
                          style={{
                            fontSize: 34,
                            color: theme.secondaryText,
                            marginTop: 10,
                            lineHeight: 1.5,
                          }}
                        >
                          {stage.description}
                        </div>
                      )}
                    </Card>
                  </div>
                  {i < scene.stages.length - 1 && (
                    <MotionConnector
                      theme={theme}
                      progress={anim.opacity}
                      active={isActive}
                      size={72}
                      style={{ alignSelf: "center" }}
                    />
                  )}
                </React.Fragment>
              );
            })
          : // progressive 模式：sequenceHighlight
            scene.stages.map((stage, i) => {
              const anim = sequenceHighlight({
                frame,
                fps,
                index: i,
                total: scene.stages.length,
                totalFrames,
                staggerDelay: 15,
              });
              if (!anim.visible) return null;
              return (
                <React.Fragment key={i}>
                  <div
                    style={
                      {
                        flex: 1,
                        minWidth: 0,
                        opacity: anim.opacity,
                        transform: `translateY(${anim.translateY}px)`,
                      } as React.CSSProperties
                    }
                  >
                    <Card
                      theme={theme}
                      accent={anim.isCurrent ? theme.accentColor : undefined}
                      style={
                        anim.isCurrent
                          ? {
                              boxShadow: `0 0 24px ${theme.accentColor}33`,
                              borderWidth: 2,
                            }
                          : undefined
                      }
                    >
                      <div
                        style={{
                          fontSize: 30,
                          fontWeight: 700,
                          color: anim.isCurrent
                            ? theme.accentColor
                            : theme.secondaryText,
                          fontFamily: theme.monoFont,
                          marginBottom: 10,
                          letterSpacing: 1,
                        }}
                      >
                        阶段 {String(i + 1).padStart(2, "0")}
                      </div>
                      <div
                        style={{
                          fontSize: 42,
                          fontWeight: 700,
                          color: theme.primaryText,
                          lineHeight: 1.3,
                        }}
                      >
                        {stage.label}
                      </div>
                      {stage.description && (
                        <div
                          style={{
                            fontSize: 34,
                            color: theme.secondaryText,
                            marginTop: 10,
                            lineHeight: 1.5,
                          }}
                        >
                          {stage.description}
                        </div>
                      )}
                    </Card>
                  </div>
                  {i < scene.stages.length - 1 && (
                    <MotionConnector
                      theme={theme}
                      progress={anim.opacity}
                      active={anim.isCurrent}
                      size={72}
                      style={{ alignSelf: "center" }}
                    />
                  )}
                </React.Fragment>
              );
            })}
      </div>
    </div>
  );
};
