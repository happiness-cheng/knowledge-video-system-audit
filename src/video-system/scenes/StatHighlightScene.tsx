/**
 * 数据高亮场景
 *
 * 一个页面只突出一个数字/比例/关键结果。
 */

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoTheme } from "../themes/types";
import { fadeSlideIn } from "../utils/animation";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";

export interface StatHighlightSceneData {
  type: "stat-highlight";
  title?: string;
  stat: string;
  label: string;
  description?: string;
  animation?: string;
}

export const StatHighlightScene: React.FC<{
  scene: StatHighlightSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
}> = ({ scene, theme, layout = "landscape" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lc = useLayoutConfig(layout);

  const titleAnim = fadeSlideIn({ frame, fps, delay: 0 });
  const statAnim = fadeSlideIn({ frame, fps, delay: 8 });
  const labelAnim = fadeSlideIn({ frame, fps, delay: 15 });
  const descAnim = fadeSlideIn({ frame, fps, delay: 22 });

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
        textAlign: "center",
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
        <div
          style={{
            fontSize: theme.subtitleStyle.fontSize,
            color: theme.secondaryText,
            marginBottom: theme.spacing.section,
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.translateY}px)`,
          }}
        >
          {scene.title}
        </div>
      )}

      {/* 大数字 */}
      <div
        style={{
          fontSize: 140,
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: -4,
          background: theme.accentGradient,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          opacity: statAnim.opacity,
          transform: `scale(${0.8 + statAnim.opacity * 0.2})`,
        }}
      >
        {scene.stat}
      </div>

      {/* 标签 */}
      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: theme.primaryText,
          marginTop: theme.spacing.item,
          opacity: labelAnim.opacity,
          transform: `translateY(${labelAnim.translateY}px)`,
        }}
      >
        {scene.label}
      </div>

      {/* 描述 */}
      {scene.description && (
        <div
          style={{
            fontSize: theme.subtitleStyle.fontSize,
            color: theme.secondaryText,
            maxWidth: 700,
            marginTop: theme.spacing.section,
            opacity: descAnim.opacity,
            transform: `translateY(${descAnim.translateY}px)`,
          }}
        >
          {scene.description}
        </div>
      )}
    </div>
  );
};
