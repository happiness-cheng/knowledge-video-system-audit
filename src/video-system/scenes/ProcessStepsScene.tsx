/**
 * 步骤流程场景
 *
 * 标题 + 步骤节点列表，支持 progressive-reveal 和 highlight-current。
 * progressive 模式使用 Sequence 内部时间轴；highlight 模式保持原逻辑。
 */

import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  interpolate,
} from "remotion";
import type { VideoTheme } from "../themes/types";
import {
  fadeSlideIn,
  progressiveReveal,
  highlightCurrent,
  sequenceHighlight,
} from "../utils/animation";
import { Arrow } from "../components/Arrow";
import { BackgroundLayer } from "../components/BackgroundLayer";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";
import { MotionListItem } from "../components/motion/MotionListItem";

export interface ProcessStepsSceneData {
  type: "process-steps";
  title: string;
  steps: string[];
  revealMode?: "progressive" | "highlight";
  animation?: string;
  /**
   * 阻断索引：该步骤及其后续步骤显示为"被阻断"状态（红色锁图标、不可进入）。
   * 用于表达"审查未通过→停止生产"等语义。
   * 值为步骤索引（0-based），例如 1 表示第2步开始被阻断。
   */
  blockedAfter?: number;
  /**
   * V4 时序阻断：在指定帧激活阻断。
   * 阻断前步骤正常推进；到达该帧后 blockedAfter 生效，下游冻结。
   * 用于 Spike 原型和需要"正常流动→突然阻断"语义的场景。
   */
  blockAtFrame?: number;
  /**
   * 阻断原因标签，显示在被阻断步骤上方。
   */
  blockedReason?: string;
}

/** 标题子组件（Sequence 内调用 useCurrentFrame） */
const ProcessTitle: React.FC<{
  title: string;
  theme: VideoTheme;
  titleScale: number;
  sectionGap: number;
}> = ({ title, theme, titleScale, sectionGap }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlideIn({ frame, fps, delay: 0 });
  return (
    <h2
      style={{
        fontSize: Math.max(theme.titleStyle.fontSize * 0.88, 88) * titleScale,
        fontWeight: theme.titleStyle.fontWeight,
        color: theme.primaryText,
        marginBottom: sectionGap + 12,
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
        zIndex: 1,
      }}
    >
      {title}
    </h2>
  );
};

const ProcessStepItem: React.FC<{
  theme: VideoTheme;
  index: number;
  label: string;
  width: number;
  active: boolean;
  dimmed: boolean;
  progress: number;
  retainedProgress: number;
  blocked?: boolean;
}> = ({
  theme,
  index,
  label,
  width,
  active,
  dimmed,
  progress,
  retainedProgress,
  blocked = false,
}) => {
  const focusProgress = active ? 1 : dimmed ? 0 : 0.28;

  return (
    <MotionListItem
      theme={theme}
      accent={blocked ? theme.danger : theme.accentColor}
      progress={progress}
      focusProgress={focusProgress}
      retainedProgress={blocked ? 0.45 : retainedProgress}
      borderRadius={theme.radius.md}
      padding="28px 34px"
      gap={22}
      translateY={22}
      translateX={8}
      style={{
        width,
        opacity: blocked ? 0.6 : undefined,
        filter: blocked ? "grayscale(0.6)" : undefined,
      }}
    >
      <div
        style={{
          width: active ? 56 : 48,
          height: active ? 56 : 48,
          borderRadius: "50%",
          background: blocked
            ? theme.danger
            : active
              ? theme.accentColor
              : dimmed
                ? theme.cardBorder
                : `${theme.accentColor}44`,
          color: blocked
            ? "#fff"
            : active
              ? "#fff"
              : dimmed
                ? theme.secondaryText
                : theme.accentColor,
          display: "grid",
          placeItems: "center",
          fontSize: active ? 24 : 20,
          fontWeight: 800,
          fontFamily: theme.monoFont,
          flexShrink: 0,
          boxShadow: blocked
            ? `0 0 14px ${theme.danger}55`
            : active
              ? `0 0 12px ${theme.accentColor}44`
              : "none",
        }}
      >
        {blocked ? "✕" : index + 1}
      </div>
      <div
        style={{
          fontSize: 46,
          fontWeight: active ? 850 : 720,
          color: blocked
            ? theme.danger
            : active
              ? theme.primaryText
              : theme.secondaryText,
          fontFamily: theme.fontFamily,
          lineHeight: 1.18,
          textDecoration: blocked ? "line-through" : "none",
          textDecorationThickness: blocked ? "3px" : undefined,
          textDecorationColor: blocked ? theme.danger : undefined,
        }}
      >
        {label}
      </div>
    </MotionListItem>
  );
};

export const ProcessStepsScene: React.FC<{
  scene: ProcessStepsSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
}> = ({ scene, theme, totalFrames, layout = "landscape" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lc = useLayoutConfig(layout);

  const isHighlight = scene.revealMode === "highlight";
  const activeIdx = isHighlight
    ? highlightCurrent({ frame, fps, total: scene.steps.length, totalFrames })
    : -1;

  // V4 时序阻断：blockAtFrame 控制阻断激活时机
  const staticBlockedAfter = scene.blockedAfter ?? -1;
  const blockAtFrame = scene.blockAtFrame;
  const isTemporalBlock = blockAtFrame !== undefined && blockAtFrame >= 0;
  const blockActive = isTemporalBlock
    ? frame >= blockAtFrame
    : staticBlockedAfter >= 0;
  const blockedAfter =
    isTemporalBlock && blockActive
      ? staticBlockedAfter
      : isTemporalBlock
        ? -1
        : staticBlockedAfter;
  const hasBlocked =
    blockActive && blockedAfter >= 0 && blockedAfter < scene.steps.length - 1;

  // 阻断标签淡入：时序模式在 blockAtFrame 后淡入，静态模式按比例淡入
  const blockedLabelIn = hasBlocked
    ? isTemporalBlock
      ? interpolate(frame, [blockAtFrame, blockAtFrame + 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(frame, [totalFrames * 0.3, totalFrames * 0.5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
    : 0;

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
        padding: lc.padding,
      }}
    >
      <BackgroundLayer theme={theme} mode="grid" sectionNumber="01" />

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

      {/* 标题 */}
      <Sequence from={0} layout="none">
        <ProcessTitle
          title={scene.title}
          theme={theme}
          titleScale={lc.titleScale}
          sectionGap={lc.sectionGap}
        />
      </Sequence>

      {/* 阻断原因标签 */}
      {hasBlocked && scene.blockedReason && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "14px 28px",
            borderRadius: 14,
            background: `${theme.danger}14`,
            border: `2.5px solid ${theme.danger}`,
            color: theme.danger,
            fontSize: 32,
            fontWeight: 900,
            opacity: blockedLabelIn,
            zIndex: 10,
          }}
        >
          {scene.blockedReason}
        </div>
      )}

      {/* 步骤节点 + 箭头 */}
      <div
        style={{
          display: "flex",
          flexDirection: layout === "portrait" ? "column" : "row",
          alignItems: "center",
          gap: lc.gap,
          flexWrap: layout === "portrait" ? "nowrap" : "wrap",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        {isHighlight
          ? // highlight 模式：保持原逻辑 + 阻断支持
            scene.steps.map((step, i) => {
              const isBlocked = i > blockedAfter;
              const anim = progressiveReveal({
                frame,
                fps,
                index: i,
                total: scene.steps.length,
                staggerDelay: 15,
              });
              // 被阻断的步骤不参与高亮循环
              const isActive = isBlocked ? false : activeIdx === i;
              let nodeOpacity = 1;
              if (isBlocked) {
                nodeOpacity = 0.45;
              } else if (activeIdx >= 0) {
                if (isActive) nodeOpacity = 1;
                else if (Math.abs(i - activeIdx) === 1) nodeOpacity = 0.65;
                else nodeOpacity = 0.4;
              }

              return (
                <React.Fragment key={i}>
                  <ProcessStepItem
                    theme={theme}
                    index={i}
                    label={step}
                    active={isActive}
                    dimmed={
                      !isBlocked && !isActive && Math.abs(i - activeIdx) > 1
                    }
                    width={lc.nodeWidth}
                    progress={anim.opacity}
                    retainedProgress={nodeOpacity}
                    blocked={isBlocked}
                  />
                  {i < scene.steps.length - 1 && (
                    <div style={{ opacity: anim.opacity }}>
                      <Arrow
                        theme={theme}
                        direction={layout === "portrait" ? "down" : "right"}
                        active={isActive}
                        size={48}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })
          : // progressive 模式：sequenceHighlight + 阻断支持
            scene.steps.map((step, i) => {
              const isBlocked = i > blockedAfter;
              const anim = sequenceHighlight({
                frame,
                fps,
                index: i,
                total: scene.steps.length,
                totalFrames,
                staggerDelay: 15,
              });
              if (!anim.visible && !isBlocked) return null;
              // 被阻断的步骤在阻断点之后立即显示
              const visible = isBlocked
                ? anim.visible || i <= blockedAfter + 1
                : anim.visible;
              if (!visible) return null;
              return (
                <React.Fragment key={i}>
                  <ProcessStepItem
                    theme={theme}
                    index={i}
                    label={step}
                    active={isBlocked ? false : anim.isCurrent}
                    dimmed={isBlocked ? false : anim.dimmed}
                    width={lc.nodeWidth}
                    progress={anim.opacity}
                    retainedProgress={isBlocked ? 0.45 : anim.dimmed ? 0.58 : 1}
                    blocked={isBlocked}
                  />
                  {i < scene.steps.length - 1 && (
                    <div style={{ opacity: anim.opacity }}>
                      <Arrow
                        theme={theme}
                        direction={layout === "portrait" ? "down" : "right"}
                        active={isBlocked ? false : anim.isCurrent}
                        size={48}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
      </div>
    </div>
  );
};
