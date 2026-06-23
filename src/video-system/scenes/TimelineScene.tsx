/**
 * 时间线场景
 *
 * 学习阶段、项目演进、流程变化。支持逐个出现/高亮。
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoTheme } from "../themes/types";
import {
  fadeSlideIn,
  progressiveReveal,
  highlightCurrent,
} from "../utils/animation";
import { Card } from "../components/Card";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";
import { MotionTimeline } from "../components/motion/MotionTimeline";

export interface TimelineSceneData {
  type: "timeline";
  title: string;
  items: Array<{ time: string; title: string; text?: string }>;
  revealMode?: "progressive" | "highlight";
  animation?: string;
}

export const TimelineScene: React.FC<{
  scene: TimelineSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
}> = ({ scene, theme, totalFrames, layout = "landscape" }) => {
  const frame = useCurrentFrame();
  const lc = useLayoutConfig(layout);
  const { fps } = useVideoConfig();

  const titleAnim = fadeSlideIn({ frame, fps, delay: 0 });
  const isHighlight = scene.revealMode === "highlight";
  const activeIdx = isHighlight
    ? highlightCurrent({ frame, fps, total: scene.items.length, totalFrames })
    : -1;
  const timelineProgress = interpolate(
    frame,
    [8, Math.min(totalFrames - 1, 8 + scene.items.length * 18)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

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
          fontSize: theme.titleStyle.fontSize * 0.65,
          fontWeight: theme.titleStyle.fontWeight,
          color: theme.primaryText,
          marginBottom: theme.spacing.section + 8,
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.translateY}px)`,
        }}
      >
        {scene.title}
      </h2>

      <div>
        <MotionTimeline
          theme={theme}
          count={scene.items.length}
          progress={timelineProgress}
          activeIndex={activeIdx}
        />

        <div
          style={{
            display: "flex",
            gap: theme.spacing.item,
            alignItems: "flex-start",
          }}
        >
          {scene.items.map((item, i) => {
            const anim = progressiveReveal({
              frame,
              fps,
              index: i,
              total: scene.items.length,
              staggerDelay: 15,
            });
            const isActive = activeIdx === i;
            const isDimmed = isHighlight && activeIdx >= 0 && !isActive;

            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  opacity: isHighlight
                    ? isActive
                      ? 1
                      : isDimmed
                        ? 0.35
                        : 1
                    : anim.opacity,
                  transform: `translateY(${anim.translateY}px)`,
                }}
              >
                <Card
                  theme={theme}
                  accent={isActive ? theme.accentColor : undefined}
                  style={
                    isActive
                      ? { boxShadow: `0 0 20px ${theme.accentColor}33` }
                      : undefined
                  }
                >
                  {/* 时间标签 */}
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: isActive ? theme.accentColor : theme.secondaryText,
                      fontFamily: theme.monoFont,
                      marginBottom: 8,
                      letterSpacing: 1,
                    }}
                  >
                    {item.time}
                  </div>
                  {/* 标题 */}
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: theme.primaryText,
                      lineHeight: 1.3,
                      marginBottom: item.text ? 8 : 0,
                    }}
                  >
                    {item.title}
                  </div>
                  {/* 描述 */}
                  {item.text && (
                    <div
                      style={{
                        fontSize: 22,
                        color: theme.secondaryText,
                        lineHeight: 1.5,
                      }}
                    >
                      {item.text}
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
