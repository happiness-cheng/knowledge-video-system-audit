/**
 * 前后变化可视化场景
 *
 * 用于 prompt 改写、配置调整、错误做法到正确做法的短对比。
 * 不是 Git diff、不是终端日志，也不是长代码审查页。
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoTheme } from "../themes/types";
import { fadeSlideIn, EASE_OUT_CRISP } from "../utils/animation";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";

export interface DiffChange {
  kind: "removed" | "added";
  text: string;
  note?: string;
}

export interface DiffSceneData {
  id?: string;
  type: "diff";
  title: string;
  subtitle?: string;
  beforeTitle: string;
  afterTitle: string;
  changes: DiffChange[];
  focusSequence?: number[];
  keywords?: string[];
  animation?: string;
  visualRole?: string;
}

const clampIndex = (value: number, max: number) =>
  Math.max(0, Math.min(value, Math.max(0, max)));

const Header: React.FC<{
  scene: DiffSceneData;
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
        diff explainer
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

const DiffRow: React.FC<{
  change: DiffChange;
  sourceIndex: number;
  isActive: boolean;
  theme: VideoTheme;
  activeColor: string;
}> = ({ change, sourceIndex, isActive, theme, activeColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rowAnim = fadeSlideIn({ frame, fps, delay: 12 + sourceIndex * 7 });
  const strikeProgress = interpolate(frame - (20 + sourceIndex * 6), [0, 18], [0, 1], {
    easing: EASE_OUT_CRISP,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isRemoved = change.kind === "removed";

  return (
    <div
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "42px 1fr",
        alignItems: "center",
        minHeight: 66,
        gap: 12,
        padding: "13px 18px",
        borderRadius: 16,
        border: `2px solid ${isActive ? activeColor : "transparent"}`,
        background: isActive ? `${activeColor}18` : "#FFFFFFA8",
        boxShadow: isActive ? `0 18px 38px ${activeColor}20` : "none",
        opacity: rowAnim.opacity * (isActive ? 1 : 0.72),
        transform: `translateY(${rowAnim.translateY}px) scale(${isActive ? 1.02 : 1})`,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          background: activeColor,
          fontSize: 24,
          fontWeight: 950,
          fontFamily: theme.monoFont,
        }}
      >
        {isRemoved ? "-" : "+"}
      </div>
      <div
        style={{
          position: "relative",
          fontSize: 31,
          lineHeight: 1.28,
          fontWeight: isActive ? 850 : 700,
          color: isActive ? theme.primaryText : theme.secondaryText,
        }}
      >
        {change.text}
        {isRemoved && (
          <span
            style={{
              position: "absolute",
              left: 0,
              right: `${100 - strikeProgress * 100}%`,
              top: "52%",
              height: 5,
              borderRadius: 999,
              background: activeColor,
              opacity: 0.78,
            }}
          />
        )}
      </div>
    </div>
  );
};

const DiffPanel: React.FC<{
  title: string;
  changes: Array<DiffChange & { sourceIndex: number }>;
  activeIndex: number;
  color: string;
  theme: VideoTheme;
}> = ({ title, changes, activeIndex, color, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlideIn({ frame, fps, delay: 8 });

  return (
    <div
      style={{
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
        borderRadius: 24,
        border: `2px solid ${color}35`,
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFF 100%)",
        boxShadow: theme.shadowLg,
        padding: "28px 30px 32px",
        minHeight: 415,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 22,
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 950,
            color,
          }}
        >
          {title}
        </div>
        <div
          style={{
            padding: "8px 13px",
            borderRadius: 999,
            background: `${color}14`,
            color,
            fontFamily: theme.monoFont,
            fontWeight: 850,
            fontSize: 20,
          }}
        >
          {changes.length} lines
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {changes.map((change) => (
          <DiffRow
            key={`${change.sourceIndex}-${change.text}`}
            change={change}
            sourceIndex={change.sourceIndex}
            isActive={activeIndex === change.sourceIndex}
            theme={theme}
            activeColor={color}
          />
        ))}
      </div>
    </div>
  );
};

export const DiffScene: React.FC<{
  scene: DiffSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
}> = ({ scene, theme, totalFrames, layout = "landscape" }) => {
  const frame = useCurrentFrame();
  const lc = useLayoutConfig(layout);
  const changes = scene.changes.slice(0, 8);
  const focusSequence =
    scene.focusSequence && scene.focusSequence.length > 0
      ? scene.focusSequence
      : changes.map((_, index) => index);
  const activeSlot = clampIndex(
    Math.floor(
      interpolate(frame, [24, Math.max(36, totalFrames - 24)], [0, focusSequence.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
    focusSequence.length - 1,
  );
  const activeIndex = clampIndex(focusSequence[activeSlot] ?? 0, changes.length - 1);
  const removed = changes
    .map((change, sourceIndex) => ({ ...change, sourceIndex }))
    .filter((change) => change.kind === "removed");
  const added = changes
    .map((change, sourceIndex) => ({ ...change, sourceIndex }))
    .filter((change) => change.kind === "added");

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
          gridTemplateColumns: lc.gridColumns.two,
          gap: 34,
          maxWidth: lc.maxWidth,
          width: "100%",
          alignItems: "stretch",
        }}
      >
        <DiffPanel
          title={scene.beforeTitle}
          changes={removed}
          activeIndex={activeIndex}
          color={theme.danger}
          theme={theme}
        />
        <DiffPanel
          title={scene.afterTitle}
          changes={added}
          activeIndex={activeIndex}
          color={theme.success}
          theme={theme}
        />
      </div>
    </div>
  );
};
