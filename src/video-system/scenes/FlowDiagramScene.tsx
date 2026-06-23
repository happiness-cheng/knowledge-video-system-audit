/**
 * 流程图场景
 *
 * 标题 + 节点链，支持 progressive-reveal 和 highlight-current。
 * 精修：背景网格 + 章节编号 + 3 级可见性 + 节点放大
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
import { StepNode } from "../components/StepNode";
import { BlueprintNode } from "../components/BlueprintNode";
import { BackgroundLayer } from "../components/BackgroundLayer";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";
import { MotionConnector } from "../components/motion/MotionConnector";

export interface FlowDiagramSceneData {
  type: "flow-diagram";
  title: string;
  nodes: string[];
  semanticPattern?: "fragment-to-manual";
  fragmentLabels?: string[];
  manualTitle?: string;
  manualSubtitle?: string;
  outputLabels?: string[];
  revealMode?: "progressive" | "highlight";
  animation?: string;
}

export const FlowDiagramScene: React.FC<{
  scene: FlowDiagramSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
}> = ({ scene, theme, totalFrames, layout = "landscape" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lc = useLayoutConfig(layout);

  const titleAnim = fadeSlideIn({ frame, fps, delay: 0 });
  const isHighlight = scene.revealMode === "highlight";
  const isBlueprint = theme.id === "knowledge-blueprint";
  const activeIdx = isHighlight
    ? highlightCurrent({ frame, fps, total: scene.nodes.length, totalFrames })
    : -1;

  const NodeComponent = isBlueprint ? BlueprintNode : StepNode;

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
        padding: theme.spacing.page,
      }}
    >
      <BackgroundLayer theme={theme} mode="grid" sectionNumber="02" />

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
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        {isHighlight
          ? // highlight 模式：保持原逻辑
            scene.nodes.map((node, i) => {
              const anim = progressiveReveal({
                frame,
                fps,
                index: i,
                total: scene.nodes.length,
                staggerDelay: 15,
              });
              const isActive = activeIdx === i;
              // 3 级可见性
              let nodeOpacity = 1;
              if (activeIdx >= 0) {
                if (isActive) nodeOpacity = 1;
                else if (Math.abs(i - activeIdx) === 1) nodeOpacity = 0.65;
                else nodeOpacity = 0.4;
              }

              return (
                <React.Fragment key={i}>
                  <div
                    style={{
                      opacity: nodeOpacity,
                      transform: `translateY(${anim.translateY}px)`,
                    }}
                  >
                    <NodeComponent
                      theme={theme}
                      index={i}
                      label={node}
                      active={isActive}
                      dimmed={!isActive && Math.abs(i - activeIdx) > 1}
                      width={200}
                    />
                  </div>
                  {i < scene.nodes.length - 1 && (
                    <div style={{ opacity: anim.opacity }}>
                      <MotionConnector
                        theme={theme}
                        direction="right"
                        progress={anim.opacity}
                        active={isActive}
                        size={64}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })
          : // progressive 模式：sequenceHighlight
            scene.nodes.map((node, i) => {
              const anim = sequenceHighlight({
                frame,
                fps,
                index: i,
                total: scene.nodes.length,
                totalFrames,
                staggerDelay: 15,
              });
              if (!anim.visible) return null;
              return (
                <React.Fragment key={i}>
                  <div
                    style={{
                      opacity: anim.opacity,
                      transform: `translateY(${anim.translateY}px)`,
                    }}
                  >
                    <NodeComponent
                      theme={theme}
                      index={i}
                      label={node}
                      active={anim.isCurrent}
                      dimmed={anim.dimmed}
                      width={200}
                    />
                  </div>
                  {i < scene.nodes.length - 1 && (
                    <div style={{ opacity: anim.opacity }}>
                      <MotionConnector
                        theme={theme}
                        direction="right"
                        progress={anim.opacity}
                        active={anim.isCurrent}
                        size={64}
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
