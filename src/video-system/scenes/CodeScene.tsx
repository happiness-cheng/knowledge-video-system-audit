/**
 * 代码 / 配置 / 文档步骤可视化场景
 *
 * 用于 CLAUDE.md、JSON、prompt、配置片段等知识讲解。
 * 画面重点不是“展示很多代码”，而是让观众看到：当前讲到哪一行，哪一行就被点亮。
 */

import React from "react";
import { interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoTheme } from "../themes/types";
import { fadeSlideIn, EASE_OUT_CRISP } from "../utils/animation";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";

export interface CodeLine {
  text: string;
  annotation?: string;
}

export interface CodeSceneData {
  id?: string;
  type: "code";
  title: string;
  subtitle?: string;
  filename?: string;
  language?: string;
  lines: CodeLine[];
  focusSequence?: number[];
  callouts?: string[];
  keywords?: string[];
  showActiveLineInExplanation?: boolean;
  animation?: string;
  visualRole?: string;
}

const clampIndex = (value: number, max: number) =>
  Math.max(0, Math.min(value, Math.max(0, max)));

const Header: React.FC<{
  scene: CodeSceneData;
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
        marginBottom: 34,
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
          fontWeight: 800,
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
        {scene.language ?? "document"}
      </div>
      <h2
        style={{
          fontSize: Math.max(theme.titleStyle.fontSize * 0.72, 72),
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
            marginTop: 16,
            fontSize: 34,
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

const CodePanel: React.FC<{
  scene: CodeSceneData;
  theme: VideoTheme;
  totalFrames: number;
}> = ({ scene, theme, totalFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlideIn({ frame, fps, delay: 8 });
  const focusSequence =
    scene.focusSequence && scene.focusSequence.length > 0
      ? scene.focusSequence
      : scene.lines.map((_, index) => index);
  const activeSlot = clampIndex(
    Math.floor(
      interpolate(frame, [28, Math.max(32, totalFrames - 28)], [0, focusSequence.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
    focusSequence.length - 1,
  );
  const activeIndex = clampIndex(focusSequence[activeSlot] ?? 0, scene.lines.length - 1);

  return (
    <div
      style={{
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
        borderRadius: 22,
        border: `1px solid ${theme.cardBorder}`,
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFF 100%)",
        boxShadow: theme.shadowLg,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 58,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderBottom: `1px solid ${theme.cardBorder}`,
          background: `${theme.accentColor}08`,
        }}
      >
        <div style={{ display: "flex", gap: 9 }}>
          {[theme.danger, theme.warning, theme.success].map((color) => (
            <span
              key={color}
              style={{
                width: 13,
                height: 13,
                borderRadius: 999,
                background: color,
              }}
            />
          ))}
        </div>
        <div
          style={{
            fontFamily: theme.monoFont,
            fontSize: 22,
            fontWeight: 800,
            color: theme.secondaryText,
          }}
        >
          {scene.filename ?? "knowledge-note.md"}
        </div>
      </div>

      <div
        style={{
          padding: "26px 0",
          fontFamily: theme.monoFont,
          fontSize: 31,
          lineHeight: 1.45,
        }}
      >
        {scene.lines.map((line, index) => {
          const isActive = index === activeIndex;
          const distance = Math.abs(index - activeIndex);
          const focusProgress = interpolate(distance, [0, 2], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE_OUT_CRISP,
          });
          const rowOpacity = distance === 0 ? 1 : distance === 1 ? 0.72 : 0.44;

          return (
            <div
              key={`${index}-${line.text}`}
              style={{
                display: "grid",
                gridTemplateColumns: "64px 1fr",
                alignItems: "center",
                minHeight: 54,
                padding: "0 28px 0 0",
                background: isActive ? `${theme.accentColor}16` : "transparent",
                borderLeft: `7px solid ${isActive ? theme.accentColor : "transparent"}`,
                opacity: rowOpacity,
                transform: `scale(${1 + focusProgress * 0.01})`,
                transformOrigin: "left center",
              }}
            >
              <div
                style={{
                  textAlign: "right",
                  paddingRight: 18,
                  color: isActive ? theme.accentColor : `${theme.secondaryText}88`,
                  fontSize: 22,
                  fontWeight: 800,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  color: isActive ? theme.primaryText : theme.secondaryText,
                  fontWeight: isActive ? 850 : 650,
                }}
              >
                {line.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ExplanationPanel: React.FC<{
  scene: CodeSceneData;
  theme: VideoTheme;
  totalFrames: number;
}> = ({ scene, theme, totalFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlideIn({ frame, fps, delay: 18 });
  const focusSequence =
    scene.focusSequence && scene.focusSequence.length > 0
      ? scene.focusSequence
      : scene.lines.map((_, index) => index);
  const activeSlot = clampIndex(
    Math.floor(
      interpolate(frame, [28, Math.max(32, totalFrames - 28)], [0, focusSequence.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
    focusSequence.length - 1,
  );
  const activeIndex = clampIndex(focusSequence[activeSlot] ?? 0, scene.lines.length - 1);
  const activeLine = scene.lines[activeIndex];
  const callout = scene.callouts?.[activeSlot] ?? activeLine?.annotation;

  return (
    <div
      style={{
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
        borderRadius: 22,
        border: `2px solid ${theme.accentColor}35`,
        background: theme.cardBackground,
        boxShadow: theme.shadow,
        padding: "34px 36px",
        minHeight: 310,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 14px",
          borderRadius: 999,
          background: `${theme.accentColor}14`,
          color: theme.accentColor,
          fontSize: 22,
          fontWeight: 900,
          marginBottom: 26,
        }}
      >
        <span>当前解释</span>
        <span style={{ fontFamily: theme.monoFont }}>L{activeIndex + 1}</span>
      </div>
      <div
        style={{
          fontSize: 46,
          lineHeight: 1.25,
          fontWeight: 900,
          color: theme.primaryText,
          marginBottom: 22,
        }}
      >
        {callout ?? "这一行是当前讲解重点"}
      </div>
      {scene.showActiveLineInExplanation !== false && (
        <div
          style={{
            fontSize: 27,
            lineHeight: 1.45,
            color: theme.secondaryText,
            fontFamily: theme.monoFont,
            wordBreak: "break-word",
          }}
        >
          {activeLine?.text}
        </div>
      )}
    </div>
  );
};

export const CodeScene: React.FC<{
  scene: CodeSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
}> = ({ scene, theme, totalFrames, layout = "landscape" }) => {
  const lc = useLayoutConfig(layout);
  const safeLines = scene.lines.slice(0, 10);
  const normalizedScene = { ...scene, lines: safeLines };

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

      <Sequence from={0} layout="none">
        <Header scene={normalizedScene} theme={theme} />
      </Sequence>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.55fr 0.95fr",
          gap: 34,
          maxWidth: lc.maxWidth,
          width: "100%",
          alignItems: "center",
        }}
      >
        <CodePanel scene={normalizedScene} theme={theme} totalFrames={totalFrames} />
        <ExplanationPanel
          scene={normalizedScene}
          theme={theme}
          totalFrames={totalFrames}
        />
      </div>
    </div>
  );
};
