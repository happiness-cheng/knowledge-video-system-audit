/**
 * 标题副标题场景
 *
 * 通用观点页：标题 + 副标题 + 可选关键词。
 */

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoTheme } from "../themes/types";
import { fadeSlideIn, slowZoom } from "../utils/animation";
import { KeywordTags } from "../components/KeywordTag";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";
import { SafeTitleText } from "../components/SafeTitleText";

export interface TitleSubtitleSceneData {
  type: "title-subtitle";
  title: string;
  subtitle?: string;
  keywords?: string[];
  animation?: string;
}

export const TitleSubtitleScene: React.FC<{
  scene: TitleSubtitleSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
}> = ({ scene, theme, totalFrames, layout = "landscape" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lc = useLayoutConfig(layout);

  const titleAnim = fadeSlideIn({ frame, fps, delay: 0 });
  const subAnim = fadeSlideIn({ frame, fps, delay: 10 });
  const kwAnim = fadeSlideIn({ frame, fps, delay: 18 });

  const scale =
    scene.animation === "slow-zoom" ? slowZoom(frame, totalFrames) : 1;

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
        transform: `scale(${scale})`,
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

      <h1
        style={{
          ...theme.titleStyle,
          background: theme.accentGradient,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          maxWidth: 1100,
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.translateY}px)`,
        }}
      >
        {scene.title}
      </h1>

      {scene.subtitle && (
        <p
          style={{
            ...theme.subtitleStyle,
            color: theme.secondaryText,
            maxWidth: 800,
            marginTop: theme.spacing.section,
            opacity: subAnim.opacity,
            transform: `translateY(${subAnim.translateY}px)`,
          }}
        >
          <SafeTitleText text={scene.subtitle} maxCharsPerLine={18} />
        </p>
      )}

      {scene.keywords && scene.keywords.length > 0 && (
        <div
          style={{
            marginTop: theme.spacing.section + 8,
            opacity: kwAnim.opacity,
            transform: `translateY(${kwAnim.translateY}px)`,
          }}
        >
          <KeywordTags theme={theme} keywords={scene.keywords} />
        </div>
      )}
    </div>
  );
};
