/**
 * 终端结果可视化场景
 *
 * 用于短命令、测试结果、构建结果和实验执行现场。
 * 不是交互式终端，也不是长日志阅读器。
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoTheme } from "../themes/types";
import { fadeSlideIn, EASE_OUT_CRISP } from "../utils/animation";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";

export type TerminalLineKind =
  | "running"
  | "success"
  | "warning"
  | "error"
  | "info";

export interface TerminalLine {
  kind: TerminalLineKind;
  text: string;
}

export interface TerminalResult {
  status: "success" | "warning" | "error" | "info";
  label: string;
  detail?: string;
}

export interface TerminalSceneData {
  id?: string;
  type: "terminal";
  title: string;
  subtitle?: string;
  command: string;
  lines: TerminalLine[];
  result: TerminalResult;
  focusSequence?: number[];
  keywords?: string[];
  animation?: string;
  visualRole?: string;
}

const clampIndex = (value: number, max: number) =>
  Math.max(0, Math.min(value, Math.max(0, max)));

const colorForKind = (kind: TerminalLineKind, theme: VideoTheme) => {
  if (kind === "success") return theme.success;
  if (kind === "warning") return theme.warning;
  if (kind === "error") return theme.danger;
  if (kind === "running") return theme.accentColor;
  return theme.secondaryText;
};

const colorForStatus = (status: TerminalResult["status"], theme: VideoTheme) => {
  if (status === "success") return theme.success;
  if (status === "warning") return theme.warning;
  if (status === "error") return theme.danger;
  return theme.accentColor;
};

const symbolForKind = (kind: TerminalLineKind) => {
  if (kind === "success") return "ok";
  if (kind === "warning") return "!";
  if (kind === "error") return "x";
  if (kind === "running") return ">";
  return "i";
};

const Header: React.FC<{
  scene: TerminalSceneData;
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
        terminal result
      </div>
      <h2
        style={{
          fontSize: Math.max(theme.titleStyle.fontSize * 0.74, 74),
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

const TerminalPanel: React.FC<{
  scene: TerminalSceneData;
  theme: VideoTheme;
  activeIndex: number;
}> = ({ scene, theme, activeIndex }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlideIn({ frame, fps, delay: 8 });

  return (
    <div
      style={{
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
        borderRadius: 24,
        border: `1px solid ${theme.cardBorder}`,
        background: "#111827",
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
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.06)",
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
            color: "rgba(255,255,255,0.74)",
          }}
        >
          local shell
        </div>
      </div>

      <div
        style={{
          padding: "28px 30px 34px",
          fontFamily: theme.monoFont,
          minHeight: 390,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 18px",
            borderRadius: 16,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#F9FAFB",
            fontSize: 32,
            fontWeight: 850,
            marginBottom: 20,
          }}
        >
          <span style={{ color: theme.accentColor }}>$</span>
          <span>{scene.command}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {scene.lines.map((line, index) => {
            const rowAnim = fadeSlideIn({ frame, fps, delay: 22 + index * 9 });
            const isActive = index === activeIndex;
            const color = colorForKind(line.kind, theme);
            const focus = interpolate(Math.abs(index - activeIndex), [0, 2], [1, 0], {
              easing: EASE_OUT_CRISP,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={`${index}-${line.text}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "56px 1fr",
                  alignItems: "center",
                  minHeight: 54,
                  padding: "10px 14px",
                  borderRadius: 15,
                  background: isActive ? `${color}24` : "transparent",
                  border: `1px solid ${isActive ? `${color}88` : "transparent"}`,
                  opacity: rowAnim.opacity * (isActive ? 1 : 0.62),
                  transform: `translateY(${rowAnim.translateY}px) scale(${1 + focus * 0.012})`,
                  transformOrigin: "left center",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: color,
                    color: "#FFFFFF",
                    fontSize: 18,
                    fontWeight: 950,
                  }}
                >
                  {symbolForKind(line.kind)}
                </div>
                <div
                  style={{
                    color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.72)",
                    fontSize: 28,
                    lineHeight: 1.35,
                    fontWeight: isActive ? 850 : 650,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {line.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ResultPanel: React.FC<{
  scene: TerminalSceneData;
  theme: VideoTheme;
}> = ({ scene, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlideIn({ frame, fps, delay: 22 });
  const color = colorForStatus(scene.result.status, theme);

  return (
    <div
      style={{
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
        borderRadius: 24,
        border: `2px solid ${color}40`,
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFF 100%)",
        boxShadow: theme.shadowLg,
        padding: "38px 40px",
        minHeight: 390,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 82,
          height: 82,
          borderRadius: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${color}18`,
          color,
          fontSize: 42,
          fontWeight: 950,
          fontFamily: theme.monoFont,
          marginBottom: 28,
        }}
      >
        {scene.result.status === "success"
          ? "OK"
          : scene.result.status === "error"
            ? "X"
            : scene.result.status === "warning"
              ? "!"
              : "i"}
      </div>
      <div
        style={{
          fontSize: 62,
          lineHeight: 1.05,
          fontWeight: 950,
          color: theme.primaryText,
          marginBottom: 20,
        }}
      >
        {scene.result.label}
      </div>
      {scene.result.detail && (
        <div
          style={{
            fontSize: 31,
            lineHeight: 1.42,
            fontWeight: 700,
            color: theme.secondaryText,
          }}
        >
          {scene.result.detail}
        </div>
      )}
    </div>
  );
};

export const TerminalScene: React.FC<{
  scene: TerminalSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
}> = ({ scene, theme, totalFrames, layout = "landscape" }) => {
  const frame = useCurrentFrame();
  const lc = useLayoutConfig(layout);
  const lines = scene.lines.slice(0, 8);
  const normalizedScene = { ...scene, lines };
  const focusSequence =
    scene.focusSequence && scene.focusSequence.length > 0
      ? scene.focusSequence
      : lines.map((_, index) => index);
  const activeSlot = clampIndex(
    Math.floor(
      interpolate(frame, [30, Math.max(42, totalFrames - 28)], [0, focusSequence.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
    focusSequence.length - 1,
  );
  const activeIndex = clampIndex(focusSequence[activeSlot] ?? 0, lines.length - 1);

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

      <Header scene={normalizedScene} theme={theme} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.45fr 0.85fr",
          gap: 34,
          maxWidth: lc.maxWidth,
          width: "100%",
          alignItems: "center",
        }}
      >
        <TerminalPanel
          scene={normalizedScene}
          theme={theme}
          activeIndex={activeIndex}
        />
        <ResultPanel scene={normalizedScene} theme={theme} />
      </div>
    </div>
  );
};
