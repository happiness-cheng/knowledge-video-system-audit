/**
 * 行动号召场景
 *
 * 标题 + 副标题 + 行动按钮文字。
 * 精修：背景光晕 + 按钮放大 + 标题增强
 */

import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { VideoTheme } from "../themes/types";
import { fadeSlideIn } from "../utils/animation";
import { SafeTitleText } from "../components/SafeTitleText";
import { BackgroundLayer } from "../components/BackgroundLayer";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";

export interface CtaSceneData {
  id?: string;
  type: "cta";
  title: string;
  subtitle?: string;
  actionText?: string;
  keywords?: string[];
  animation?: string;
}

export const CtaScene: React.FC<{
  scene: CtaSceneData;
  theme: VideoTheme;
  totalFrames: number;
  sceneStartFrame?: number;
  layout?: LayoutMode;
}> = ({ scene, theme, totalFrames, sceneStartFrame = 0, layout = "landscape" }) => {
  const frame = useCurrentFrame();
  const localFrame = frame;
  const { fps } = useVideoConfig();
  const lc = useLayoutConfig(layout);

  const titleAnim = fadeSlideIn({ frame, fps, delay: 0 });
  const subAnim = fadeSlideIn({ frame, fps, delay: 10 });
  const btnAnim = fadeSlideIn({ frame, fps, delay: 18 });
  const showActionPath =
    scene.title.includes("CLAUDE.md") || scene.actionText?.includes("入职");
  const settleProgress = interpolate(
    localFrame,
    [Math.max(0, totalFrames - 36), Math.max(1, totalFrames - 12)],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // CTA 按钮 pulse：入场完成后开始 breathing
  const btnPulseScale =
    1 +
    interpolate(Math.sin(localFrame * 0.05), [-1, 1], [0, 0.015]) *
      settleProgress;
  const btnPulseShadow =
    interpolate(Math.sin(localFrame * 0.05), [-1, 1], [0.2, 0.35]) *
    settleProgress;
  const actionSteps = ["打开项目", "新建 CLAUDE.md", "写下规则"];

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
      <BackgroundLayer theme={theme} mode="glow" frame={frame} enableDrift />

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

      {/* 标题：渐变色 + 放大到 110% */}
      <h1
        style={{
          fontSize: theme.titleStyle.fontSize * 1.3,
          fontWeight: theme.titleStyle.fontWeight,
          lineHeight: theme.titleStyle.lineHeight,
          letterSpacing: theme.titleStyle.letterSpacing,
          background: theme.accentGradient,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          maxWidth: 1000,
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.translateY}px)`,
        }}
      >
        <SafeTitleText text={scene.title} maxCharsPerLine={12} />
      </h1>

      {scene.subtitle && (
        <p
          style={{
            ...theme.subtitleStyle,
            color: theme.secondaryText,
            maxWidth: 700,
            marginTop: theme.spacing.section + 4,
            opacity: subAnim.opacity,
            transform: `translateY(${subAnim.translateY}px)`,
          }}
        >
          <SafeTitleText text={scene.subtitle} maxCharsPerLine={18} />
        </p>
      )}

      {showActionPath && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginTop: theme.spacing.section + 10,
          }}
        >
          {actionSteps.map((step, index) => {
            const progress = interpolate(
              localFrame,
              [22 + index * 12, 42 + index * 12],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );
            const isLast = index === actionSteps.length - 1;

            return (
              <React.Fragment key={step}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 22px",
                    borderRadius: theme.radius.md,
                    border: `2px solid ${
                      isLast ? theme.accentColor : theme.cardBorder
                    }`,
                    background: isLast
                      ? `${theme.accentColor}12`
                      : theme.cardBackground,
                    opacity: progress,
                    transform: `translateY(${interpolate(
                      progress,
                      [0, 1],
                      [16, 0],
                    )}px)`,
                    boxShadow: isLast
                      ? `0 8px 24px ${theme.accentColor}22`
                      : "none",
                  }}
                >
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      background: isLast
                        ? theme.accentColor
                        : `${theme.accentColor}22`,
                      color: isLast ? "#fff" : theme.accentColor,
                      fontSize: 18,
                      fontWeight: 800,
                      fontFamily: theme.monoFont,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </span>
                  <span
                    style={{
                      fontSize: 28,
                      fontWeight: 760,
                      color: theme.primaryText,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {step}
                  </span>
                </div>
                {!isLast && (
                  <div
                    style={{
                      width: 42,
                      height: 3,
                      borderRadius: 999,
                      background: theme.accentColor,
                      opacity: progress * 0.7,
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {scene.actionText && (
        <div
          style={{
            marginTop: showActionPath
              ? theme.spacing.section
              : theme.spacing.section + 16,
            opacity: btnAnim.opacity,
            transform: `translateY(${btnAnim.translateY}px)`,
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "18px 52px",
              borderRadius: theme.radius.full,
              background: theme.accentGradient,
              color: "#fff",
              fontSize: 40,
              fontWeight: 700,
              transform: `scale(${btnPulseScale})`,
              boxShadow: `0 8px 32px ${theme.accentColor}${Math.round(
                btnPulseShadow * 255,
              )
                .toString(16)
                .padStart(2, "0")}`,
            }}
          >
            <SafeTitleText text={scene.actionText} maxCharsPerLine={18} />
          </span>
        </div>
      )}
    </div>
  );
};
