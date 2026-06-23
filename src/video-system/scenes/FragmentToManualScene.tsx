import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { VideoTheme } from "../themes/types";
import { BackgroundLayer } from "../components/BackgroundLayer";
import { MotionObject } from "../components/MotionObject";
import { SafeTitleText } from "../components/SafeTitleText";
import { fadeSlideIn, EASE_OUT_CRISP } from "../utils/animation";
import type { LayoutMode } from "../utils/useLayoutConfig";

export interface FragmentToManualSceneData {
  type: "flow-diagram";
  semanticPattern: "fragment-to-manual";
  title: string;
  nodes: string[];
  fragmentLabels?: string[];
  manualTitle?: string;
  manualSubtitle?: string;
  outputLabels?: string[];
  revealMode?: "progressive" | "highlight";
  animation?: string;
}

const fragmentPositions = [
  { x: 190, y: 255, rotate: -8 },
  { x: 375, y: 360, rotate: 5 },
  { x: 230, y: 520, rotate: 7 },
  { x: 470, y: 610, rotate: -5 },
  { x: 330, y: 720, rotate: 3 },
];

const manualCenter = { x: 748, y: 340 };

const noteColors = ["#fff7ed", "#eff6ff", "#fef9c3", "#ecfdf5", "#f5f3ff"];

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const FragmentToManualScene: React.FC<{
  scene: FragmentToManualSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
}> = ({ scene, theme, totalFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleAnim = fadeSlideIn({ frame, fps, delay: 0 });

  const fragmentLabels =
    scene.fragmentLabels ??
    ["项目背景", "目录职责", "历史坑", "测试规则", "禁改模块"];
  const outputLabels = scene.outputLabels ?? ["项目手册", "默认共识"];
  const manualTitle = scene.manualTitle ?? "CLAUDE.md";
  const manualSubtitle = scene.manualSubtitle ?? "项目员工手册";

  const gatherStart = Math.min(70, totalFrames * 0.22);
  const gatherEnd = Math.min(150, totalFrames * 0.48);
  const manualPulse = spring({
    frame: frame - gatherEnd + 12,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.8 },
  });
  const manualScale = 1 + manualPulse * 0.06;
  const manualGlow = interpolate(manualPulse, [0, 1], [0.12, 0.28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const beamProgress = interpolate(frame, [gatherStart, gatherEnd], [0, 1], {
    easing: EASE_OUT_CRISP,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightProgress = interpolate(
    frame,
    [gatherEnd + 12, gatherEnd + 52],
    [0, 1],
    {
      easing: EASE_OUT_CRISP,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: theme.background,
        fontFamily: theme.fontFamily,
        overflow: "hidden",
      }}
    >
      <BackgroundLayer theme={theme} mode="grid" sectionNumber="03" />

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

      <div
        style={{
          position: "absolute",
          top: 58,
          left: 120,
          right: 120,
          textAlign: "center",
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.translateY}px)`,
          zIndex: 5,
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 800,
            lineHeight: 1.12,
            color: theme.primaryText,
          }}
        >
          <SafeTitleText text={scene.title} maxCharsPerLine={14} />
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 34,
            fontWeight: 600,
            color: theme.secondaryText,
          }}
        >
          散落在聊天里的知识，沉淀进项目本身
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 150,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 170,
            top: 195,
            fontSize: 42,
            fontWeight: 800,
            color: theme.secondaryText,
          }}
        >
          聊天记录里的碎片
        </div>

        <svg
          width={1920}
          height={1080}
          viewBox="0 0 1920 1080"
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          {fragmentPositions.map((pos, i) => {
            const dash = 360;
            const opacity = clamp01(beamProgress - i * 0.08);
            return (
              <path
                key={i}
                d={`M ${pos.x + 95} ${pos.y + 52} C 585 ${pos.y - 40}, 690 460, 830 500`}
                fill="none"
                stroke={theme.accentColor}
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={dash}
                strokeDashoffset={dash * (1 - opacity)}
                opacity={opacity * 0.32}
              />
            );
          })}
        </svg>

        {fragmentLabels.slice(0, 5).map((label, i) => {
          const pos = fragmentPositions[i];
          const delay = gatherStart + i * 8;
          return (
            <MotionObject
              key={label}
              frame={frame}
              fromFrame={delay}
              toFrame={gatherEnd}
              from={{
                x: pos.x,
                y: pos.y,
                rotate: pos.rotate,
                scale: 1,
                opacity: 1,
              }}
              to={{
                x: manualCenter.x + 132 + i * 4,
                y: manualCenter.y + 118 + i * 3,
                rotate: 0,
                scale: 0.18,
                opacity: 0,
              }}
              style={{ zIndex: 3 }}
            >
              <div
                style={{
                  width: 170,
                  minHeight: 92,
                  padding: "18px 20px",
                  borderRadius: 8,
                  background: noteColors[i % noteColors.length],
                  border: `2px solid ${theme.cardBorder}`,
                  boxShadow: "0 16px 36px rgba(15, 23, 42, 0.12)",
                  color: theme.primaryText,
                  fontSize: 34,
                  fontWeight: 800,
                  lineHeight: 1.18,
                  textAlign: "center",
                }}
              >
                {label}
              </div>
            </MotionObject>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: manualCenter.x,
            top: manualCenter.y,
            width: 440,
            height: 410,
            borderRadius: 18,
            background: theme.cardBackground,
            border: `3px solid ${theme.accentColor}`,
            boxShadow: `0 22px 70px rgba(15,23,42,${manualGlow})`,
            transform: `scale(${manualScale})`,
            transformOrigin: "center",
            zIndex: 4,
            padding: 34,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              height: 54,
              borderRadius: 10,
              background: theme.accentGradient,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 900,
              fontFamily: theme.monoFont,
              marginBottom: 24,
            }}
          >
            {manualTitle}
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: theme.primaryText,
              lineHeight: 1.08,
              marginBottom: 20,
              whiteSpace: "nowrap",
            }}
          >
            {manualSubtitle}
          </div>
          {["项目定位", "目录职责", "开发原则", "验证要求"].map((line, i) => {
            const rowOpacity = interpolate(
              frame,
              [gatherEnd + 6 + i * 6, gatherEnd + 20 + i * 6],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );
            return (
              <div
                key={line}
                style={{
                  opacity: rowOpacity,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 27,
                  fontWeight: 700,
                  color: theme.secondaryText,
                  marginTop: 8,
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    background: theme.success,
                    display: "inline-block",
                  }}
                />
                {line}
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            left: 1290,
            top: 325,
            display: "flex",
            flexDirection: "column",
            gap: 26,
            opacity: rightProgress,
            transform: `translateX(${interpolate(rightProgress, [0, 1], [34, 0])}px)`,
            zIndex: 3,
          }}
        >
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: theme.secondaryText,
              marginBottom: 4,
            }}
          >
            项目里的稳定共识
          </div>
          {outputLabels.map((label, i) => (
            <div
              key={label}
              style={{
                width: 360,
                minHeight: 118,
                borderRadius: 14,
                padding: "26px 30px",
                background:
                  i === 0
                    ? `${theme.accentColor}18`
                    : `${theme.success}18`,
                border: `2.5px solid ${i === 0 ? theme.accentColor : theme.success}`,
                boxShadow: "0 18px 46px rgba(15, 23, 42, 0.10)",
                color: theme.primaryText,
                fontSize: 44,
                fontWeight: 900,
                lineHeight: 1.16,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
