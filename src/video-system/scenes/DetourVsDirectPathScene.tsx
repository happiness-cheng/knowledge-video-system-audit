import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { VideoTheme } from "../themes/types";
import { BackgroundLayer } from "../components/BackgroundLayer";
import { SafeTitleText } from "../components/SafeTitleText";
import { MotionPath } from "../components/motion/MotionPath";
import { EASE_OUT_CRISP, fadeSlideIn } from "../utils/animation";
import type { LayoutMode } from "../utils/useLayoutConfig";

export interface DetourVsDirectPathSceneData {
  type: "comparison";
  semanticPattern: "detour-vs-direct-path";
  pathVariant?: "detour" | "direct" | "combined";
  title: string;
  leftTitle: string;
  leftItems: string[];
  rightTitle: string;
  rightItems: string[];
  keywords?: string[];
  animation?: string;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const makeDraw = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    easing: EASE_OUT_CRISP,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const NodeBubble: React.FC<{
  x: number;
  y: number;
  label: string;
  active: number;
  tone: "neutral" | "danger" | "success" | "accent";
  theme: VideoTheme;
  width?: number;
  visible?: number;
}> = ({ x, y, label, active, tone, theme, width = 190, visible = 1 }) => {
  const toneColor =
    tone === "danger"
      ? theme.danger
      : tone === "success"
        ? theme.success
        : tone === "accent"
          ? theme.accentColor
          : theme.secondaryText;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: visible,
        width,
        minHeight: 82,
        transform: `translate(-50%, -50%) scale(${1 + active * 0.04})`,
        borderRadius: 14,
        background: theme.cardBackground,
        border: `2.5px solid ${toneColor}`,
        boxShadow: `0 16px 38px rgba(15,23,42,${0.08 + active * 0.12})`,
        color: active > 0.45 ? toneColor : theme.primaryText,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontSize: 31,
        fontWeight: 850,
        lineHeight: 1.15,
        padding: "12px 16px",
        whiteSpace: "pre-line",
      }}
    >
      {label}
    </div>
  );
};

const DetailList: React.FC<{
  x: number;
  y: number;
  title: string;
  items: string[];
  color: string;
  progress: number;
  theme: VideoTheme;
}> = ({ x, y, title, items, color, progress, theme }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 420,
      padding: "24px 28px",
      borderRadius: 16,
      background: `${theme.cardBackground}f2`,
      border: `2px solid ${color}`,
      boxShadow: "0 18px 50px rgba(15, 23, 42, 0.10)",
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
    }}
  >
    <div
      style={{
        fontSize: 34,
        fontWeight: 900,
        color,
        marginBottom: 14,
      }}
    >
      {title}
    </div>
    {items.slice(0, 3).map((item, i) => {
      const itemProgress = clamp01(progress * 1.4 - i * 0.22);
      return (
        <div
          key={item}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 10,
            color: theme.primaryText,
            fontSize: 29,
            fontWeight: 700,
            opacity: itemProgress,
            transform: `translateX(${interpolate(itemProgress, [0, 1], [14, 0])}px)`,
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: color,
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          {item}
        </div>
      );
    })}
  </div>
);

export const DetourVsDirectPathScene: React.FC<{
  scene: DetourVsDirectPathSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
}> = ({ scene, theme, totalFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleAnim = fadeSlideIn({ frame, fps, delay: 0 });

  const variant = scene.pathVariant ?? "detour";
  const isDirect = variant === "direct";
  const isCombined = variant === "combined";
  const pathStart = Math.min(isDirect ? 38 : 58, totalFrames * 0.18);
  const detourAEnd = isCombined ? totalFrames * 0.22 : pathStart + 70;
  const detourBEnd = isCombined ? totalFrames * 0.35 : pathStart + 140;
  const detourCEnd = isCombined ? totalFrames * 0.48 : pathStart + 240;
  const directStartFrame = isCombined ? totalFrames * 0.52 : pathStart + 10;
  const directEndFrame = isCombined ? totalFrames * 0.68 : pathStart + 74;
  const detourA = makeDraw(frame, pathStart, detourAEnd);
  const detourB = makeDraw(frame, detourAEnd, detourBEnd);
  const detourC = makeDraw(frame, detourBEnd, detourCEnd);
  const directActive = makeDraw(frame, directStartFrame, directEndFrame);
  const directCompare = isDirect
    ? directActive
    : isCombined
      ? directActive
      : makeDraw(frame, pathStart + 250, pathStart + 305);
  const detourCompare = isDirect
    ? makeDraw(frame, pathStart + 86, pathStart + 138)
    : 1;
  const detourResultProgress = isDirect
    ? detourCompare * 0.35
    : makeDraw(frame, detourBEnd, detourCEnd + 18);
  const directResultProgress = isDirect
    ? makeDraw(frame, directEndFrame - 10, directEndFrame + 24)
    : isCombined
      ? makeDraw(frame, directEndFrame - 8, directEndFrame + 28)
      : directCompare * 0.5;
  const mapPulse = spring({
    frame: frame - directStartFrame - 10,
    fps,
    config: { damping: 16, stiffness: 90, mass: 0.9 },
  });

  const detourStart = { x: 260, y: 430 };
  const wrong = { x: 720, y: 615 };
  const ask = { x: 1080, y: 355 };
  const detourGoal = { x: 1545, y: 430 };
  const directStart = { x: 260, y: 685 };
  const map = { x: 720, y: 700 };
  const directGoal = { x: 1545, y: 685 };

  const detourPathA = `M ${detourStart.x} ${detourStart.y} C 390 600, 535 690, ${wrong.x} ${wrong.y}`;
  const detourPathB = `M ${wrong.x} ${wrong.y} C 915 735, 855 295, ${ask.x} ${ask.y}`;
  const detourPathC = `M ${ask.x} ${ask.y} C 1330 210, 1475 310, 1390 505 C 1290 730, 1465 785, ${detourGoal.x} ${detourGoal.y}`;
  const directPath = `M ${directStart.x} ${directStart.y} C 520 705, 610 720, ${map.x} ${map.y} C 900 705, 1185 705, ${directGoal.x} ${directGoal.y}`;
  const detourLength = 1800;
  const directLength = 2400;
  const wrongFlash = makeDraw(frame, pathStart + 70, pathStart + 98);
  const mapActive = isDirect
    ? clamp01(mapPulse)
    : isCombined
      ? clamp01(mapPulse)
      : makeDraw(frame, pathStart + 250, pathStart + 282) * 0.7;
  const correctState = isDirect || directResultProgress > 0.92;
  const leftDetailTitle = correctState ? "有了 CLAUDE.md" : scene.leftTitle;
  const leftDetailItems = correctState
    ? ["先读项目手册", "目录职责清楚", "风险提前避开"]
    : scene.leftItems;
  const rightDetailTitle = correctState ? "用户只需" : scene.rightTitle;
  const rightDetailItems = correctState
    ? ["给出目标", "确认边界", "检查结果"]
    : scene.rightItems;

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
      <BackgroundLayer theme={theme} mode="grid" sectionNumber="04" />

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
            fontSize: 84,
            fontWeight: 900,
            color: theme.primaryText,
            lineHeight: 1.12,
          }}
        >
          <SafeTitleText text={scene.title} maxCharsPerLine={15} />
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 34,
            fontWeight: 650,
            color: theme.secondaryText,
          }}
        >
          {isDirect ? "项目地图先亮起来，任务路径自然变短" : "没有项目手册，任务会绕进重复解释和误判"}
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
        <svg
          width={1920}
          height={1080}
          viewBox="0 0 1920 1080"
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <MotionPath
            d={detourPathA}
            color={theme.danger}
            progress={isDirect ? detourCompare : detourA}
            length={detourLength}
            strokeWidth={isDirect ? 6 : 9}
            ghostOpacity={isDirect ? 0.06 : 0.18}
            activeOpacity={isDirect ? 0.26 : 1}
          />
          <MotionPath
            d={detourPathB}
            color={theme.danger}
            progress={isDirect ? detourCompare : detourB}
            length={detourLength}
            strokeWidth={isDirect ? 6 : 9}
            ghostOpacity={isDirect ? 0.06 : 0.18}
            activeOpacity={isDirect ? 0.26 : 1}
          />
          <MotionPath
            d={detourPathC}
            color={theme.danger}
            progress={isDirect ? detourCompare : detourC}
            length={detourLength}
            strokeWidth={isDirect ? 6 : 9}
            ghostOpacity={isDirect ? 0.06 : 0.18}
            activeOpacity={isDirect ? 0.26 : 1}
          />
          <MotionPath
            d={directPath}
            color={theme.success}
            progress={directCompare}
            length={directLength}
            strokeWidth={isDirect ? 10 : 6}
            ghostOpacity={isDirect ? 0.18 : 0.06}
            activeOpacity={isDirect ? 1 : 0.34}
          />
        </svg>

        <NodeBubble
          x={detourStart.x}
          y={detourStart.y}
          label="新任务"
          tone="accent"
          active={makeDraw(frame, 22, 48)}
          theme={theme}
        />
        <NodeBubble
          x={directStart.x}
          y={directStart.y}
          label="同一任务"
          tone={isDirect ? "accent" : "neutral"}
          active={isDirect ? makeDraw(frame, 22, 48) : directCompare * 0.4}
          theme={theme}
          visible={isDirect ? 1 : directCompare}
        />
        <NodeBubble
          x={map.x}
          y={map.y}
          label="CLAUDE.md 已读"
          tone="success"
          active={mapActive}
          theme={theme}
          width={230}
          visible={isDirect ? 1 : directCompare}
        />
        <NodeBubble
          x={wrong.x}
          y={wrong.y}
          label="误判目录"
          tone="danger"
          active={isDirect ? detourCompare * 0.35 : wrongFlash}
          theme={theme}
        />
        <NodeBubble
          x={ask.x}
          y={ask.y}
          label="反复确认"
          tone="danger"
          active={
            isDirect
              ? detourCompare * 0.35
              : makeDraw(frame, pathStart + 138, pathStart + 170)
          }
          theme={theme}
        />
        <NodeBubble
          x={detourGoal.x}
          y={detourGoal.y}
          label="终于到任务"
          tone="accent"
          active={detourResultProgress}
          theme={theme}
          width={224}
        />
        <NodeBubble
          x={directGoal.x}
          y={directGoal.y}
          label="直接进入任务"
          tone="success"
          active={directResultProgress}
          theme={theme}
          width={260}
          visible={isDirect ? 1 : directCompare}
        />

        <DetailList
          x={120}
          y={740}
          title={leftDetailTitle}
          items={leftDetailItems}
          color={correctState ? theme.success : theme.danger}
          progress={makeDraw(frame, pathStart + 6, pathStart + 46)}
          theme={theme}
        />
        <DetailList
          x={1380}
          y={740}
          title={rightDetailTitle}
          items={rightDetailItems}
          color={correctState ? theme.success : theme.accentColor}
          progress={
            correctState
              ? directResultProgress
              : makeDraw(frame, detourBEnd - 18, detourBEnd + 34)
          }
          theme={theme}
        />

        <div
          style={{
            position: "absolute",
            left: 722,
            top: 772,
            width: 500,
            padding: "22px 28px",
            borderRadius: 16,
            background: isDirect ? `${theme.success}18` : `${theme.danger}14`,
            border: `2px solid ${isDirect ? theme.success : theme.danger}`,
            color: theme.primaryText,
            fontSize: 38,
            fontWeight: 900,
            lineHeight: 1.18,
            textAlign: "center",
            opacity: directResultProgress,
          }}
        >
          {isDirect ? "同样的任务，少走一大圈" : "不是任务难，是上下文没沉淀"}
        </div>
      </div>
    </div>
  );
};
