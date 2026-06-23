/**
 * 封面场景
 *
 * 标题 + 副标题 + 关键词。视频的第一个画面。
 * 精修：背景光晕层 + 标题放大 + 间距优化
 */

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoTheme } from "../themes/types";
import { fadeSlideIn, slowZoom } from "../utils/animation";
import { KeywordTags } from "../components/KeywordTag";
import { BackgroundLayer } from "../components/BackgroundLayer";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";
import type { PresentationMode } from "../themes/types";
import { SafeTitleText } from "../components/SafeTitleText";
import {
  PressureBuild,
  type PressureBuildItem,
} from "../components/visual/PressureBuild";
import { RepeatedProjectRulesChat } from "../components/visual/RepeatedProjectRulesChat";

export interface CoverSceneData {
  id?: string;
  type: "cover";
  title: string;
  subtitle?: string;
  keywords?: string[];
  animation?: string;
  visualRole?: string;
  semanticPattern?: "pressure-build";
  hookVariant?: "repeated-project-rules-chat";
  pressureItems?: PressureBuildItem[];
}

export const CoverScene: React.FC<{
  scene: CoverSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
  presentationMode?: PresentationMode;
}> = ({
  scene,
  theme,
  totalFrames,
  layout = "landscape",
  presentationMode = "default",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lc = useLayoutConfig(layout);
  const isLab = presentationMode === "knowledge-lab";
  const isLabHook = isLab && scene.visualRole === "hook";

  if (
    scene.semanticPattern === "pressure-build" &&
    scene.hookVariant === "repeated-project-rules-chat"
  ) {
    return (
      <RepeatedProjectRulesChat
        frame={frame}
        theme={theme}
        title={scene.title}
        subtitle={scene.subtitle}
      />
    );
  }

  if (scene.semanticPattern === "pressure-build") {
    return (
      <PressureBuild
        frame={frame}
        theme={theme}
        title={scene.title}
        subtitle={scene.subtitle}
        items={scene.pressureItems}
      />
    );
  }

  const titleAnim = fadeSlideIn({ frame, fps, delay: 0 });
  const subAnim = fadeSlideIn({ frame, fps, delay: 10 });
  const kwAnim = fadeSlideIn({ frame, fps, delay: 18 });

  // lab-hook 模式禁用 slow-zoom
  const effectiveAnimation = isLabHook ? "fade-in" : scene.animation;
  const scale =
    effectiveAnimation === "slow-zoom" ? slowZoom(frame, totalFrames) : 1;

  // 实验台模式：标题更大、更顶脸，减少留白
  const labTitleScale = isLabHook ? 1.35 : isLab ? 1.2 : 1.2;
  const labPadding = isLab ? "40px 48px" : lc.padding;
  const labMaxWidth = isLab ? 1600 : Math.min(lc.maxWidth * 1.15, 1600);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: theme.background,
        fontFamily: theme.fontFamily,
        display: "flex",
        flexDirection: "column",
        justifyContent: isLab ? "center" : "center",
        alignItems: "center",
        padding: labPadding,
        textAlign: "center",
        transform: `scale(${scale})`,
      }}
    >
      <BackgroundLayer theme={theme} mode="glow" frame={frame} enableDrift />

      {/* 顶部装饰线 */}
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

      {/* 标题：渐变色 + 放大，frame 0 立即可见 */}
      <h1
        style={{
          fontSize: Math.max(
            theme.titleStyle.fontSize * labTitleScale * lc.titleScale,
            112,
          ),
          fontWeight: theme.titleStyle.fontWeight,
          lineHeight: Math.max(
            isLab ? 1.12 : Number(theme.titleStyle.lineHeight),
            1.1,
          ),
          letterSpacing: theme.titleStyle.letterSpacing,
          background: theme.accentGradient,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          maxWidth: labMaxWidth,
          overflow: "visible",
          paddingBottom: 18,
          margin: 0,
          opacity: frame <= 1 ? 1 : titleAnim.opacity,
          transform:
            frame <= 1
              ? "translateY(0)"
              : `translateY(${titleAnim.translateY}px)`,
          whiteSpace: "pre-line",
        }}
      >
        <SafeTitleText
          text={scene.title}
          maxCharsPerLine={18}
          gradient={theme.accentGradient}
        />
      </h1>

      {/* 副标题：实验台模式下弱化 */}
      {scene.subtitle && (
        <p
          style={{
            ...theme.subtitleStyle,
            fontSize: theme.subtitleStyle.fontSize * lc.subtitleScale,
            color: isLab ? theme.secondaryText : theme.secondaryText,
            opacity: isLab ? 0.7 : subAnim.opacity,
            maxWidth: labMaxWidth * 0.75,
            marginTop: isLab ? 4 : Math.max(lc.sectionGap - 4, 12),
            transform: `translateY(${subAnim.translateY}px)`,
          }}
        >
          <SafeTitleText text={scene.subtitle} maxCharsPerLine={18} />
        </p>
      )}

      {/* 关键词：实验台模式下不显示 */}
      {!isLab && scene.keywords && scene.keywords.length > 0 && (
        <div
          style={{
            marginTop: lc.sectionGap + 12,
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
