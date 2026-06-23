/**
 * 要点列表场景
 *
 * 标题 + 多个要点卡片，逐个入场（Sequence 内部时间轴）。
 */

import React from "react";
import { useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import type { VideoTheme } from "../themes/types";
import { fadeSlideIn, sequenceHighlight } from "../utils/animation";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";
import { MotionCard } from "../components/motion/MotionCard";
import { OperationTrace } from "../components/human/OperationTrace";

export interface BulletsSceneData {
  type: "bullets";
  title: string;
  bullets: Array<{ text: string; accent?: string }>;
  keywords?: string[];
  animation?: string;
}

/** 标题子组件（Sequence 内调用 useCurrentFrame） */
const BulletsTitle: React.FC<{
  title: string;
  theme: VideoTheme;
}> = ({ title, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlideIn({ frame, fps, delay: 0 });
  return (
    <h2
      style={{
        fontSize: Math.max(theme.titleStyle.fontSize * 0.88, 88),
        fontWeight: theme.titleStyle.fontWeight,
        lineHeight: theme.titleStyle.lineHeight,
        letterSpacing: theme.titleStyle.letterSpacing,
        color: theme.primaryText,
        marginBottom: theme.spacing.section,
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
      }}
    >
      {title}
    </h2>
  );
};

/** 单个要点卡片子组件（Sequence 内调用 useCurrentFrame） */
const BulletItem: React.FC<{
  bullet: { text: string; accent?: string };
  theme: VideoTheme;
  index: number;
  progress: number;
  active: boolean;
  retained: boolean;
}> = ({ bullet, theme, index, progress, active, retained }) => {
  const accent = bullet.accent || theme.accentColor;
  return (
    <MotionCard
      theme={theme}
      accent={accent}
      progress={progress}
      active={active}
      retained={retained}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: 190,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 999,
            background: active ? accent : `${accent}18`,
            color: active ? theme.background : accent,
            fontSize: 22,
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: theme.monoFont,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
        <div
          style={{
            height: 4,
            flex: 1,
            borderRadius: 999,
            background: active ? accent : `${accent}22`,
          }}
        />
      </div>
      <div
        style={{
          fontSize: 44,
          fontWeight: active ? 850 : 700,
          color: active ? theme.primaryText : theme.secondaryText,
          lineHeight: 1.35,
        }}
      >
        {bullet.text}
      </div>
    </MotionCard>
  );
};

export const BulletsScene: React.FC<{
  scene: BulletsSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
}> = ({ scene, theme, totalFrames, layout = "landscape" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lc = useLayoutConfig(layout);
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
        padding: theme.spacing.page,
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

      <OperationTrace
        theme={theme}
        label="正在整理判断"
        x={112}
        y={96}
        delay={8}
        tone="accent"
      />

      {/* 标题 */}
      <Sequence from={0} layout="none">
        <BulletsTitle title={scene.title} theme={theme} />
      </Sequence>

      {/* 要点卡片：稳定 2x2 布局 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            scene.bullets.length <= 2
              ? `repeat(${scene.bullets.length}, 1fr)`
              : "repeat(2, 1fr)",
          gap: theme.spacing.section,
          maxWidth: lc.maxWidth,
        }}
      >
        {scene.bullets.map((b, i) => {
          const state = sequenceHighlight({
            frame,
            fps,
            index: i,
            total: scene.bullets.length,
            totalFrames,
            staggerDelay: 15,
          });
          return (
            <BulletItem
              key={i}
              bullet={b}
              theme={theme}
              index={i}
              progress={state.opacity}
              active={state.isCurrent}
              retained
            />
          );
        })}
      </div>
    </div>
  );
};
