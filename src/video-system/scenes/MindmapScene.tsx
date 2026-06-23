/**
 * 思维导图场景
 *
 * 中心概念 + 分支展开。简单结构，支持逐步高亮。
 * 分支最多 4 个，每个分支最多 3 个子项。
 */

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoTheme } from "../themes/types";
import {
  fadeSlideIn,
  progressiveReveal,
  highlightCurrent,
} from "../utils/animation";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";
import { MotionBranch } from "../components/motion/MotionBranch";

export interface MindmapSceneData {
  type: "mindmap";
  title?: string;
  center: string;
  branches: Array<{ title: string; items?: string[] }>;
  revealMode?: "progressive" | "highlight";
  animation?: string;
}

export const MindmapScene: React.FC<{
  scene: MindmapSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
}> = ({ scene, theme, totalFrames, layout = "landscape" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lc = useLayoutConfig(layout);

  const titleAnim = fadeSlideIn({ frame, fps, delay: 0 });
  const centerAnim = fadeSlideIn({ frame, fps, delay: 5 });
  const isHighlight = scene.revealMode === "highlight";
  const activeIdx = isHighlight
    ? highlightCurrent({
        frame,
        fps,
        total: scene.branches.length,
        totalFrames,
      })
    : -1;

  const branchColors = [
    theme.accentColor,
    theme.success,
    theme.warning,
    theme.danger,
  ];
  const branches = scene.branches.slice(0, 4);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: theme.background,
        fontFamily: theme.fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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

      {scene.title && (
        <h2
          style={{
            fontSize: theme.titleStyle.fontSize * 0.55,
            fontWeight: theme.titleStyle.fontWeight,
            color: theme.primaryText,
            marginBottom: theme.spacing.section,
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.translateY}px)`,
          }}
        >
          {scene.title}
        </h2>
      )}

      {/* 中心节点 */}
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: "50%",
          border: `3px solid ${theme.accentColor}`,
          background: `${theme.accentColor}11`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          fontWeight: 800,
          color: theme.accentColor,
          boxShadow: `0 0 30px ${theme.accentColor}22`,
          opacity: centerAnim.opacity,
          zIndex: 2,
        }}
      >
        {scene.center}
      </div>

      {/* 分支 */}
      <div
        style={{
          display: "flex",
          gap: theme.spacing.section,
          marginTop: theme.spacing.section + 8,
          zIndex: 2,
        }}
      >
        {branches.map((branch, i) => {
          const anim = progressiveReveal({
            frame,
            fps,
            index: i,
            total: branches.length,
            staggerDelay: 18,
          });
          const isActive = activeIdx === i;
          const isDimmed = isHighlight && activeIdx >= 0 && !isActive;
          const color = branchColors[i];
          const branchOpacity = isHighlight
            ? isActive
              ? 1
              : isDimmed
                ? 0.3
                : 1
            : anim.opacity;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                opacity: branchOpacity,
                transform: `translateY(${anim.translateY}px)`,
              }}
            >
              {/* 连接线 */}
              <MotionBranch
                color={color}
                progress={anim.opacity}
                active={isActive}
              />
              {/* 分支标题 */}
              <div
                style={{
                  padding: "12px 24px",
                  borderRadius: theme.radius.md,
                  border: `2px solid ${color}`,
                  background: isActive ? `${color}15` : theme.cardBackground,
                  fontSize: 22,
                  fontWeight: 700,
                  color: isActive ? color : theme.primaryText,
                  textAlign: "center",
                  minWidth: 140,
                }}
              >
                {branch.title}
              </div>
              {/* 子项 */}
              {branch.items && branch.items.length > 0 && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  {branch.items.slice(0, 3).map((item, j) => (
                    <div
                      key={j}
                      style={{
                        fontSize: 18,
                        color: theme.secondaryText,
                        padding: "4px 12px",
                        borderRadius: theme.radius.sm,
                        background: theme.cardBackground,
                        border: `1px solid ${theme.cardBorder}`,
                        textAlign: "center",
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
