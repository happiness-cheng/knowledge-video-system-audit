/**
 * 章节分隔场景
 *
 * 视频分章节、结构型内容的阶段切换。简洁、节奏快。
 */

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoTheme } from "../themes/types";
import { fadeSlideIn } from "../utils/animation";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";
import { SafeTitleText } from "../components/SafeTitleText";

export interface SectionDividerSceneData {
  type: "section-divider";
  sectionNumber?: string;
  title: string;
  subtitle?: string;
  animation?: string;
}

export const SectionDividerScene: React.FC<{
  scene: SectionDividerSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
}> = ({ scene, theme, layout = "landscape" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lc = useLayoutConfig(layout);

  const numAnim = fadeSlideIn({ frame, fps, delay: 0 });
  const titleAnim = fadeSlideIn({ frame, fps, delay: 8 });
  const subAnim = fadeSlideIn({ frame, fps, delay: 15 });

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

      {/* 章节编号 */}
      {scene.sectionNumber && (
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: theme.accentColor,
            fontFamily: theme.monoFont,
            letterSpacing: 3,
            marginBottom: 16,
            opacity: numAnim.opacity,
            transform: `translateY(${numAnim.translateY}px)`,
          }}
        >
          CHAPTER {scene.sectionNumber}
        </div>
      )}

      {/* 标题 */}
      <h1
        style={{
          fontSize: theme.titleStyle.fontSize * 0.9,
          fontWeight: theme.titleStyle.fontWeight,
          color: theme.primaryText,
          lineHeight: theme.titleStyle.lineHeight,
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.translateY}px)`,
        }}
      >
        {scene.title}
      </h1>

      {/* 副标题 */}
      {scene.subtitle && (
        <p
          style={{
            ...theme.subtitleStyle,
            color: theme.secondaryText,
            maxWidth: 700,
            marginTop: theme.spacing.section,
            opacity: subAnim.opacity,
            transform: `translateY(${subAnim.translateY}px)`,
          }}
        >
          <SafeTitleText text={scene.subtitle} maxCharsPerLine={18} />
        </p>
      )}
    </div>
  );
};
