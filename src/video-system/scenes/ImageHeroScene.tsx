/**
 * 大图讲解场景
 *
 * 用于截图、生成图、真实界面和复杂隐喻图。
 * 标注层只能辅助指向，不应遮挡人物脸、产品主体、截图关键内容。
 * 不是长图滚动器，也不是任意箭头标注编辑器。
 */

import React from "react";
import {
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { VideoTheme } from "../themes/types";
import {
  VisualAnnotations,
  type VisualAnnotation,
} from "../components/visual/VisualAnnotations";
import { fadeSlideIn, EASE_OUT_CRISP } from "../utils/animation";
import { assetIdToProcessedPath, toPublicStaticFilePath } from "../utils/mediaPaths";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";

export interface ImageHeroCallout {
  label: string;
  x: number;
  y: number;
  tone?: "accent" | "success" | "warning" | "danger";
}

export interface ImageHeroSceneData {
  id?: string;
  type: "image-hero";
  title: string;
  subtitle?: string;
  assetId?: string;
  imagePath?: string;
  imageAlt?: string;
  imageFit?: "contain" | "cover";
  objectPosition?: string;
  caption?: string;
  points?: string[];
  callouts?: ImageHeroCallout[];
  annotations?: VisualAnnotation[];
  focusSequence?: number[];
  keywords?: string[];
  animation?: string;
  visualRole?: string;
}

const clampIndex = (value: number, max: number) =>
  Math.max(0, Math.min(value, Math.max(0, max)));

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

const toneColor = (
  tone: ImageHeroCallout["tone"] | undefined,
  theme: VideoTheme,
) => {
  if (tone === "success") return theme.success;
  if (tone === "warning") return theme.warning;
  if (tone === "danger") return theme.danger;
  return theme.accentColor;
};

const imageSource = (scene: ImageHeroSceneData) => {
  if (scene.assetId) return staticFile(assetIdToProcessedPath(scene.assetId));
  return staticFile(toPublicStaticFilePath(scene.imagePath ?? "assets/avatar.png"));
};

const Header: React.FC<{
  scene: ImageHeroSceneData;
  theme: VideoTheme;
}> = ({ scene, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlideIn({ frame, fps, delay: 0 });

  return (
    <div
      style={{
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
        marginBottom: 26,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 18px",
          borderRadius: 999,
          border: `1px solid ${theme.accentColor}33`,
          background: `${theme.accentColor}10`,
          color: theme.accentColor,
          fontSize: 22,
          fontWeight: 850,
          fontFamily: theme.monoFont,
          marginBottom: 18,
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: theme.accentColor,
          }}
        />
        image hero
      </div>
      <h2
        style={{
          fontSize: Math.max(theme.titleStyle.fontSize * 0.68, 68),
          fontWeight: theme.titleStyle.fontWeight,
          lineHeight: 1.05,
          color: theme.primaryText,
          margin: 0,
          letterSpacing: 0,
        }}
      >
        {scene.title}
      </h2>
      {scene.subtitle && (
        <div
          style={{
            marginTop: 14,
            fontSize: 32,
            lineHeight: 1.35,
            color: theme.secondaryText,
            fontWeight: 650,
          }}
        >
          {scene.subtitle}
        </div>
      )}
    </div>
  );
};

const ImagePanel: React.FC<{
  scene: ImageHeroSceneData;
  theme: VideoTheme;
  activeIndex: number;
}> = ({ scene, theme, activeIndex }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlideIn({ frame, fps, delay: 8 });
  const callouts = (scene.callouts ?? []).slice(0, 3);
  const src = imageSource(scene);

  return (
    <div
      style={{
        position: "relative",
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
        borderRadius: 26,
        border: `1px solid ${theme.cardBorder}`,
        background: "#FFFFFF",
        boxShadow: theme.shadowLg,
        overflow: "hidden",
        height: 650,
      }}
    >
      <Img
        src={src}
        alt={scene.imageAlt ?? scene.title}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: scene.imageFit ?? "contain",
          objectPosition: scene.objectPosition ?? "center center",
          background: "#F8FAFC",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.0) 55%, rgba(255,255,255,0.82) 100%)",
          pointerEvents: "none",
        }}
      />

      <VisualAnnotations
        annotations={scene.annotations}
        activeIndex={activeIndex}
        imageSrc={src}
        theme={theme}
      />

      {callouts.map((callout, index) => {
        const color = toneColor(callout.tone, theme);
        const calloutAnim = fadeSlideIn({
          frame,
          fps,
          delay: 22 + index * 12,
        });
        const isActive = index === activeIndex;
        const pulse = interpolate(
          Math.sin((frame - index * 8) / 7),
          [-1, 1],
          [0.92, 1.08],
          { easing: EASE_OUT_CRISP },
        );

        return (
          <div
            key={`${index}-${callout.label}`}
            style={{
              position: "absolute",
              left: `${clampPercent(callout.x)}%`,
              top: `${clampPercent(callout.y)}%`,
              opacity: calloutAnim.opacity * (isActive ? 1 : 0.78),
              transform: `translate(-50%, -50%) translateY(${calloutAnim.translateY}px) scale(${isActive ? pulse : 1})`,
              transformOrigin: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: isActive ? 74 : 56,
                height: isActive ? 74 : 56,
                borderRadius: 999,
                transform: "translate(-50%, -50%)",
                background: `${color}18`,
                border: `2px solid ${color}60`,
              }}
            />
            <div
              style={{
                position: "relative",
                minWidth: 230,
                maxWidth: 330,
                marginLeft: 44,
                padding: "12px 16px",
                borderRadius: 16,
                background: "#FFFFFFEE",
                border: `2px solid ${color}${isActive ? "CC" : "66"}`,
                boxShadow: `0 16px 34px ${color}22`,
                color: theme.primaryText,
                fontSize: 25,
                lineHeight: 1.25,
                fontWeight: isActive ? 900 : 760,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  background: color,
                  marginRight: 10,
                }}
              />
              {callout.label}
            </div>
          </div>
        );
      })}

      {scene.caption && (
        <div
          style={{
            position: "absolute",
            left: 26,
            right: 26,
            bottom: 22,
            padding: "13px 18px",
            borderRadius: 18,
            background: "#FFFFFFE8",
            border: `1px solid ${theme.cardBorder}`,
            color: theme.secondaryText,
            fontSize: 26,
            lineHeight: 1.3,
            fontWeight: 700,
          }}
        >
          {scene.caption}
        </div>
      )}
    </div>
  );
};

const ExplanationPanel: React.FC<{
  scene: ImageHeroSceneData;
  theme: VideoTheme;
  activeIndex: number;
}> = ({ scene, theme, activeIndex }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlideIn({ frame, fps, delay: 16 });
  const points = (scene.points ?? []).slice(0, 3);

  return (
    <div
      style={{
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
        borderRadius: 24,
        border: `1px solid ${theme.cardBorder}`,
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFF 100%)",
        boxShadow: theme.shadow,
        padding: "34px 34px",
        minHeight: 650,
        display: "flex",
        flexDirection: "column",
        justifyContent: points.length > 0 ? "center" : "flex-end",
      }}
    >
      {points.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {points.map((point, index) => {
            const rowAnim = fadeSlideIn({
              frame,
              fps,
              delay: 26 + index * 10,
            });
            const isActive = index === activeIndex;
            return (
              <div
                key={`${index}-${point}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 1fr",
                  alignItems: "start",
                  gap: 14,
                  padding: "18px 18px",
                  borderRadius: 18,
                  border: `2px solid ${isActive ? `${theme.accentColor}99` : "transparent"}`,
                  background: isActive ? `${theme.accentColor}12` : "#FFFFFFB8",
                  opacity: rowAnim.opacity * (isActive ? 1 : 0.72),
                  transform: `translateY(${rowAnim.translateY}px) scale(${isActive ? 1.018 : 1})`,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    background: isActive
                      ? theme.accentColor
                      : `${theme.accentColor}22`,
                    color: isActive ? "#FFFFFF" : theme.accentColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: theme.monoFont,
                    fontSize: 22,
                    fontWeight: 950,
                  }}
                >
                  {index + 1}
                </div>
                <div
                  style={{
                    color: isActive ? theme.primaryText : theme.secondaryText,
                    fontSize: 31,
                    lineHeight: 1.34,
                    fontWeight: isActive ? 850 : 680,
                  }}
                >
                  {point}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {scene.keywords && scene.keywords.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginTop: points.length > 0 ? 28 : 0,
          }}
        >
          {scene.keywords.slice(0, 4).map((keyword) => (
            <div
              key={keyword}
              style={{
                padding: "8px 13px",
                borderRadius: 999,
                background: `${theme.accentColor}10`,
                color: theme.accentColor,
                fontSize: 21,
                fontWeight: 800,
              }}
            >
              {keyword}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ImageHeroScene: React.FC<{
  scene: ImageHeroSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
}> = ({ scene, theme, totalFrames, layout = "landscape" }) => {
  const frame = useCurrentFrame();
  const lc = useLayoutConfig(layout);
  const calloutCount = Math.max(
    scene.callouts?.length ?? 0,
    scene.points?.length ?? 0,
    scene.annotations?.length ?? 0,
  );
  const focusSequence =
    scene.focusSequence && scene.focusSequence.length > 0
      ? scene.focusSequence
      : Array.from({ length: Math.max(calloutCount, 1) }, (_, index) => index);
  const activeSlot = clampIndex(
    Math.floor(
      interpolate(frame, [30, Math.max(42, totalFrames - 30)], [0, focusSequence.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
    focusSequence.length - 1,
  );
  const activeIndex = clampIndex(focusSequence[activeSlot] ?? 0, Math.max(calloutCount - 1, 0));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: theme.background,
        fontFamily: theme.fontFamily,
        padding: lc.padding,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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

      <Header scene={scene} theme={theme} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.42fr 0.78fr",
          gap: 30,
          maxWidth: lc.maxWidth,
          width: "100%",
          alignItems: "stretch",
        }}
      >
        <ImagePanel scene={scene} theme={theme} activeIndex={activeIndex} />
        <ExplanationPanel scene={scene} theme={theme} activeIndex={activeIndex} />
      </div>
    </div>
  );
};
