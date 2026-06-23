import React from "react";
import { interpolate } from "remotion";
import type { VideoTheme } from "../../themes/types";
import { SafeTitleText } from "../SafeTitleText";

export interface PressureBuildItem {
  text: string;
  tone?: "neutral" | "warning" | "accent";
}

interface PositionedItem extends PressureBuildItem {
  x: number;
  y: number;
  rotate: number;
  fromX: number;
  fromY: number;
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));

const progress = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const basePositions: Array<Omit<PositionedItem, "text" | "tone">> = [
  { x: -54, y: 0, rotate: -4, fromX: 90, fromY: -170 },
  { x: 10, y: 32, rotate: 3, fromX: 120, fromY: -160 },
  { x: -24, y: 64, rotate: -2, fromX: 110, fromY: -150 },
  { x: 42, y: 96, rotate: 4, fromX: 130, fromY: -140 },
  { x: -8, y: 128, rotate: -3, fromX: 115, fromY: -130 },
  { x: 28, y: 160, rotate: 2, fromX: 125, fromY: -120 },
  { x: -38, y: 192, rotate: -2, fromX: 105, fromY: -110 },
];

function normalizeItems(items: PressureBuildItem[] | undefined): PositionedItem[] {
  const fallback: PressureBuildItem[] = [
    "项目背景又要解释",
    "目录职责又要说明",
    "测试命令又要提醒",
    "别动密钥又要强调",
    "交付前怎么查",
    "它为什么又忘了",
  ].map((text) => ({ text }));
  const source = items && items.length > 0 ? items : fallback;

  return source.slice(0, basePositions.length).map((item, index) => ({
    ...basePositions[index],
    text: item.text,
    tone: item.tone ?? (index % 3 === 1 ? "warning" : index % 3 === 2 ? "accent" : "neutral"),
  }));
}

export const PressureBuild: React.FC<{
  frame: number;
  theme: VideoTheme;
  title: string;
  subtitle?: string;
  items?: PressureBuildItem[];
}> = ({ frame, theme, title, subtitle, items }) => {
  const positionedItems = normalizeItems(items);
  const titleIn = 1;
  const subtitleIn = progress(frame, 48, 78);
  const pressure = progress(frame, 0, 70);
  const dimOldItems = progress(frame, 82, 118);
  const stackRetreat = progress(frame, 68, 104);
  const ringPulse = Math.sin(frame * 0.06) * 0.5 + 0.5;
  const activeIndex = Math.max(
    0,
    Math.min(positionedItems.length - 1, Math.floor((frame - 26) / 9)),
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: theme.background,
        fontFamily: theme.fontFamily,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "7% 6%",
          borderRadius: 40,
          border: `1px solid ${theme.cardBorder}`,
          opacity: 0.22,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 760 + pressure * 90,
          height: 330 + pressure * 48,
          transform: "translate(-50%, -50%)",
          borderRadius: 36,
          background: theme.cardBackground,
          boxShadow: `0 24px 70px rgba(15, 23, 42, ${0.08 + pressure * 0.06})`,
          border: `2px solid ${theme.cardBorder}`,
          opacity: 0.28 + pressure * 0.2,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 880 + ringPulse * 24,
          height: 430 + ringPulse * 20,
          transform: "translate(-50%, -50%)",
          borderRadius: 44,
          border: `3px solid ${theme.accentColor}`,
          opacity: 0.05 + pressure * 0.08,
        }}
      />

      {positionedItems.map((item, index) => {
        const enter =
          index === 0
            ? 1
            : progress(frame, 6 + index * 9, 26 + index * 9);
        const settle = progress(frame, 30 + index * 9, 52 + index * 9);
        const isCurrent = index === activeIndex;
        const opacity = enter * interpolate(dimOldItems, [0, 1], [0.98, 0.42]);
        const textOpacity =
          enter *
          interpolate(stackRetreat, [0, 1], [isCurrent ? 1 : 0.1, 0.18]);
        const translateX =
          interpolate(enter, [0, 1], [item.fromX, item.x]) +
          interpolate(stackRetreat, [0, 1], [0, -30]);
        const translateY =
          interpolate(enter, [0, 1], [item.fromY, item.y]) +
          interpolate(settle, [0, 1], [0, -4]) +
          interpolate(stackRetreat, [0, 1], [0, -132]);
        const scale =
          interpolate(enter, [0, 1], [0.9, 1]) *
          interpolate(stackRetreat, [0, 1], [1, 0.82]);
        const bg =
          item.tone === "warning"
            ? "rgba(245, 158, 11, 0.12)"
            : item.tone === "accent"
              ? `${theme.accentColor}1f`
              : theme.cardBackground;
        const border =
          item.tone === "warning"
            ? "rgba(245, 158, 11, 0.45)"
            : item.tone === "accent"
              ? theme.accentColor
              : theme.cardBorder;

        return (
          <div
            key={`${item.text}-${index}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "25%",
              width: 540,
              minHeight: 76,
              padding: "18px 22px",
              borderRadius: 18,
              background: bg,
              border: `2px solid ${border}`,
              color: theme.primaryText,
              fontSize: 34,
              lineHeight: 1.18,
              fontWeight: 700,
              boxShadow: "0 18px 42px rgba(15, 23, 42, 0.10)",
              opacity,
              zIndex: 10 + index,
              transform: `translate(calc(-50% + ${translateX}px), ${translateY}px) rotate(${item.rotate}deg) scale(${scale})`,
            }}
          >
            <span style={{ opacity: textOpacity }}>{item.text}</span>
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 980,
          transform: `translate(-50%, -50%) scale(${interpolate(titleIn, [0, 1], [0.94, 1])})`,
          opacity: titleIn,
          textAlign: "center",
          zIndex: 30,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
            padding: "10px 18px",
            borderRadius: 999,
            background: `${theme.accentColor}18`,
            color: theme.accentColor,
            fontSize: 30,
            fontWeight: 800,
            border: `1px solid ${theme.accentColor}44`,
          }}
        >
          <span>问题不是它忘了</span>
        </div>
        <h1
          style={{
            margin: 0,
            paddingBottom: 20,
            fontSize: 138,
            lineHeight: 1.08,
            fontWeight: theme.titleStyle.fontWeight,
            letterSpacing: 0,
            background: theme.accentGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textShadow: "0 22px 48px rgba(15, 23, 42, 0.10)",
          }}
        >
          <SafeTitleText text={title} maxCharsPerLine={10} gradient={theme.accentGradient} />
        </h1>
        {subtitle && (
          <p
            style={{
              margin: "4px auto 0",
              maxWidth: 800,
              color: theme.secondaryText,
              fontSize: 46,
              lineHeight: 1.22,
              fontWeight: 650,
              opacity: subtitleIn,
              transform: `translateY(${interpolate(subtitleIn, [0, 1], [18, 0])}px)`,
            }}
          >
            <SafeTitleText text={subtitle} maxCharsPerLine={14} />
          </p>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 88,
          transform: "translateX(-50%)",
          width: 560,
          height: 8,
          borderRadius: 999,
          background: `linear-gradient(90deg, transparent, ${theme.accentColor}, transparent)`,
          opacity: clamp(progress(frame, 90, 116)) * 0.45,
        }}
      />
    </div>
  );
};
