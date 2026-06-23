/**
 * PathComparison
 *
 * 表达“同一目标，两条路径”：先看到绕路，再看到直达。
 */

import React from "react";
import { interpolate, spring } from "remotion";
import type { VideoTheme } from "../../themes/types";
import { EASE_OUT_CRISP } from "../../utils/animation";
import { MotionPath } from "../motion/MotionPath";

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const draw = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    easing: EASE_OUT_CRISP,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

type Point = {
  x: number;
  y: number;
};

type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const centerOf = (rect: Rect): Point => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2,
});

const rightMiddle = (rect: Rect): Point => ({
  x: rect.left + rect.width,
  y: rect.top + rect.height / 2,
});

const leftMiddle = (rect: Rect): Point => ({
  x: rect.left,
  y: rect.top + rect.height / 2,
});

const topMiddle = (rect: Rect): Point => ({
  x: rect.left + rect.width / 2,
  y: rect.top,
});

const bottomMiddle = (rect: Rect): Point => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height,
});

const edgeCurve = (from: Point, to: Point, bend = 0) => {
  const distance = Math.max(80, Math.abs(to.x - from.x));
  const controlOffset = distance * 0.46;
  return `M ${from.x} ${from.y} C ${from.x + controlOffset} ${
    from.y + bend
  }, ${to.x - controlOffset} ${to.y - bend}, ${to.x} ${to.y}`;
};

const NodeCard: React.FC<{
  rect: Rect;
  label: string;
  detail?: string;
  color: string;
  active: number;
  theme: VideoTheme;
  visible?: number;
}> = ({
  rect,
  label,
  detail,
  color,
  active,
  theme,
  visible = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      transform: `scale(${1 + active * 0.045})`,
      transformOrigin: "center",
      opacity: visible,
      borderRadius: 16,
      background: active > 0.5 ? `${color}12` : theme.cardBackground,
      border: `3px solid ${active > 0.5 ? color : theme.cardBorder}`,
      boxShadow: `0 16px 42px rgba(15,23,42,${0.07 + active * 0.11})`,
      color: theme.primaryText,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "12px 16px",
      boxSizing: "border-box",
      zIndex: 4,
    }}
  >
    <div
      style={{
        fontSize: 30,
        fontWeight: 950,
        lineHeight: 1.08,
        color: active > 0.65 ? color : theme.primaryText,
      }}
    >
      {label}
    </div>
    {detail && (
      <div
        style={{
          marginTop: 8,
          fontSize: 21,
          fontWeight: 720,
          lineHeight: 1.18,
          color: theme.secondaryText,
        }}
      >
        {detail}
      </div>
    )}
  </div>
);

const TrackLabel: React.FC<{
  left: number;
  top: number;
  title: string;
  detail: string;
  color: string;
  progress: number;
  theme: VideoTheme;
}> = ({ left, top, title, detail, color, progress, theme }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width: 300,
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [14, 0])}px)`,
      zIndex: 5,
    }}
  >
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 13px",
        borderRadius: 10,
        background: `${color}12`,
        border: `2px solid ${color}`,
        color,
        fontSize: 24,
        fontWeight: 900,
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: 999,
          background: color,
          display: "inline-block",
        }}
      />
      {title}
    </div>
    <div
      style={{
        marginTop: 9,
        fontSize: 22,
        fontWeight: 720,
        lineHeight: 1.2,
        color: theme.secondaryText,
      }}
    >
      {detail}
    </div>
  </div>
);

export const PathComparison: React.FC<{
  frame: number;
  fps: number;
  theme: VideoTheme;
  title: string;
  subtitle?: string;
  startLabel?: string;
  goalLabel?: string;
  manualLabel?: string;
  detourTitle?: string;
  directTitle?: string;
  detourNodes?: Array<{ label: string; detail?: string }>;
  conclusion?: string;
}> = ({
  frame,
  fps,
  theme,
  title,
  subtitle = "同一目标，路径成本完全不同",
  startLabel = "同一任务",
  goalLabel = "完成交付",
  manualLabel = "CLAUDE.md",
  detourTitle = "先绕路",
  directTitle = "再直达",
  detourNodes = [
    { label: "重新摸结构", detail: "先找项目在哪" },
    { label: "误判职责", detail: "改错目录" },
    { label: "反复确认", detail: "再问一遍背景" },
  ],
  conclusion = "不是突然变聪明，而是少走一大圈",
}) => {
  const titleIn = draw(frame, 0, 18);
  const detourProgress = draw(frame, 28, 88);
  const detourNodeIn = detourNodes.map((_, index) =>
    draw(frame, 48 + index * 14, 72 + index * 14),
  );
  const directProgress = draw(frame, 100, 142);
  const directIn = draw(frame, 92, 116);
  const conclusionIn = draw(frame, 138, 160);
  const manualPulse = spring({
    frame: frame - 96,
    fps,
    config: { damping: 15, stiffness: 96, mass: 0.85 },
  });

  const startRect: Rect = { left: 20, top: 360, width: 220, height: 80 };
  const goalRect: Rect = { left: 1290, top: 360, width: 240, height: 80 };
  const detourRects: Rect[] = [
    { left: 330, top: 178, width: 240, height: 98 },
    { left: 690, top: 330, width: 240, height: 98 },
    { left: 1044, top: 198, width: 240, height: 98 },
  ];
  const manualRect: Rect = { left: 390, top: 488, width: 250, height: 98 };

  const detourSegments = [
    edgeCurve(rightMiddle(startRect), leftMiddle(detourRects[0]), -96),
    edgeCurve(rightMiddle(detourRects[0]), leftMiddle(detourRects[1]), 70),
    edgeCurve(rightMiddle(detourRects[1]), leftMiddle(detourRects[2]), -78),
    edgeCurve(rightMiddle(detourRects[2]), leftMiddle(goalRect), 72),
  ];
  const directSegments = [
    edgeCurve(bottomMiddle(startRect), leftMiddle(manualRect), 92),
    edgeCurve(rightMiddle(manualRect), leftMiddle(goalRect), 76),
  ];
  const detourDim = interpolate(directProgress, [0, 1], [1, 0.3]);
  const detourSegmentProgress = [
    draw(frame, 28, 48),
    draw(frame, 48, 66),
    draw(frame, 66, 80),
    draw(frame, 80, 96),
  ];
  const directSegmentProgress = [draw(frame, 100, 120), draw(frame, 120, 144)];

  return (
    <div
      style={{
        position: "relative",
        width: 1540,
        height: 690,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          textAlign: "center",
          opacity: titleIn,
          transform: `translateY(${interpolate(titleIn, [0, 1], [18, 0])}px)`,
          zIndex: 8,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 950,
            lineHeight: 1.08,
            color: theme.primaryText,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 28,
            fontWeight: 720,
            color: theme.secondaryText,
          }}
        >
          {subtitle}
        </div>
      </div>

      <TrackLabel
        left={18}
        top={158}
        title={detourTitle}
        detail="上下文没沉淀，任务先花时间找路"
        color={theme.danger}
        progress={detourProgress}
        theme={theme}
      />
      <TrackLabel
        left={18}
        top={548}
        title={directTitle}
        detail="先读手册，项目地图提前亮起来"
        color={theme.success}
        progress={directIn}
        theme={theme}
      />

      <svg
        width="1540"
        height="690"
        viewBox="0 0 1540 690"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <g opacity={detourDim}>
          {detourSegments.map((segment, index) => (
            <MotionPath
              key={`detour-${index}`}
              d={segment}
              color={theme.danger}
              progress={detourSegmentProgress[index]}
              length={520}
              strokeWidth={9}
              ghostOpacity={0.16}
              activeOpacity={0.95}
            />
          ))}
        </g>
        {directSegments.map((segment, index) => (
          <MotionPath
            key={`direct-${index}`}
            d={segment}
            color={theme.success}
            progress={directSegmentProgress[index]}
            length={index === 0 ? 460 : 890}
            strokeWidth={10}
            ghostOpacity={0.12}
            activeOpacity={1}
          />
        ))}
      </svg>

      <NodeCard
        rect={startRect}
        label={startLabel}
        color={theme.accentColor}
        active={draw(frame, 16, 36)}
        theme={theme}
      />
      {detourNodes.slice(0, 3).map((node, index) => (
        <NodeCard
          key={node.label}
          rect={detourRects[index]}
          label={node.label}
          detail={node.detail}
          color={theme.danger}
          active={detourNodeIn[index]}
          visible={interpolate(detourProgress, [0, 1], [0.6, 1])}
          theme={theme}
        />
      ))}
      <NodeCard
        rect={manualRect}
        label={manualLabel}
        detail="项目员工手册"
        color={theme.success}
        active={clamp01(manualPulse)}
        visible={directIn}
        theme={theme}
      />
      <NodeCard
        rect={goalRect}
        label={goalLabel}
        color={directProgress > 0.8 ? theme.success : theme.accentColor}
        active={Math.max(detourProgress * 0.5, directProgress)}
        theme={theme}
      />

      <div
        style={{
          position: "absolute",
          left: 1020,
          top: 514,
          width: 360,
          padding: "20px 24px",
          borderRadius: 18,
          background: `${theme.success}14`,
          border: `3px solid ${theme.success}`,
          boxShadow: `0 18px 48px ${theme.success}22`,
          color: theme.primaryText,
          fontSize: 30,
          fontWeight: 900,
          lineHeight: 1.18,
          textAlign: "center",
          opacity: conclusionIn,
          transform: `translateY(${interpolate(conclusionIn, [0, 1], [18, 0])}px)`,
          zIndex: 7,
        }}
      >
        {conclusion}
      </div>
    </div>
  );
};
