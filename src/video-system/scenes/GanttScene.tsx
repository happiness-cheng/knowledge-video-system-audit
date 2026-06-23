/**
 * 执行链路可视化场景
 *
 * 用于并行任务、阶段依赖、阻塞点和人工确认点。
 * 不是完整项目管理甘特图，不做日期计算、拖拽或资源排期。
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoTheme } from "../themes/types";
import { fadeSlideIn, EASE_OUT_CRISP } from "../utils/animation";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";

export type GanttTaskStatus = "done" | "active" | "blocked" | "waiting";

export interface GanttTask {
  label: string;
  start: number;
  end: number;
  status: GanttTaskStatus;
  note?: string;
}

export interface GanttLane {
  label: string;
  tasks: GanttTask[];
}

export interface GanttMarker {
  at: number;
  label: string;
  tone?: "accent" | "success" | "warning" | "danger";
}

export interface GanttSceneData {
  id?: string;
  type: "gantt";
  title: string;
  subtitle?: string;
  lanes: GanttLane[];
  markers?: GanttMarker[];
  focusSequence?: number[];
  keywords?: string[];
  animation?: string;
  visualRole?: string;
}

interface FlatTask {
  laneIndex: number;
  taskIndex: number;
  task: GanttTask;
}

interface LaneStyle {
  color: string;
  tint: string;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

const clampIndex = (value: number, max: number) =>
  Math.max(0, Math.min(value, Math.max(0, max)));

const laneStyle = (laneIndex: number, theme: VideoTheme): LaneStyle => {
  const colors = [
    theme.success,
    theme.accentColor,
    theme.warning,
    theme.danger,
    "#0EA5E9",
  ];
  const color = colors[laneIndex % colors.length] ?? theme.accentColor;
  return {
    color,
    tint: `${color}12`,
  };
};

const markerColor = (
  tone: GanttMarker["tone"] | undefined,
  theme: VideoTheme,
) => {
  if (tone === "success") return theme.success;
  if (tone === "warning") return theme.warning;
  if (tone === "danger") return theme.danger;
  return theme.accentColor;
};

const statusLabel = (status: GanttTaskStatus) => {
  if (status === "done") return "完成";
  if (status === "active") return "进行中";
  if (status === "blocked") return "阻塞";
  return "等待";
};

const statusStyle = (status: GanttTaskStatus, lane: LaneStyle) => {
  if (status === "done") {
    return {
      opacity: 0.78,
      borderStyle: "solid" as const,
      railAlpha: "18",
      fillAlpha: "A6",
      labelColor: lane.color,
    };
  }
  if (status === "active") {
    return {
      opacity: 1,
      borderStyle: "solid" as const,
      railAlpha: "1F",
      fillAlpha: "C0",
      labelColor: lane.color,
    };
  }
  if (status === "blocked") {
    return {
      opacity: 1,
      borderStyle: "dashed" as const,
      railAlpha: "1B",
      fillAlpha: "A8",
      labelColor: lane.color,
    };
  }
  return {
    opacity: 0.68,
    borderStyle: "dashed" as const,
    railAlpha: "14",
    fillAlpha: "78",
    labelColor: lane.color,
  };
};

const flattenTasks = (lanes: GanttLane[]): FlatTask[] =>
  lanes.flatMap((lane, laneIndex) =>
    lane.tasks.map((task, taskIndex) => ({ laneIndex, taskIndex, task })),
  );

const Header: React.FC<{
  scene: GanttSceneData;
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
        marginBottom: 28,
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
        执行时间线
      </div>
      <h2
        style={{
          fontSize: Math.max(theme.titleStyle.fontSize * 0.7, 70),
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

const Axis: React.FC<{
  theme: VideoTheme;
}> = ({ theme }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "170px 1fr",
      gap: 20,
      alignItems: "center",
      marginBottom: 14,
      color: theme.secondaryText,
      fontSize: 18,
      fontWeight: 800,
    }}
  >
    <div>阶段</div>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 0,
      }}
    >
      {["开始", "策划", "执行", "确认"].map((label) => (
        <div
          key={label}
          style={{
            paddingLeft: 14,
            borderLeft: `1px solid ${theme.cardBorder}`,
          }}
        >
          {label}
        </div>
      ))}
    </div>
  </div>
);

const GanttChart: React.FC<{
  scene: GanttSceneData;
  theme: VideoTheme;
  activeFlatIndex: number;
  totalFrames: number;
}> = ({ scene, theme, activeFlatIndex, totalFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lanes = scene.lanes.slice(0, 5);
  const markers = (scene.markers ?? []).slice(0, 4);
  const flatTasks = flattenTasks(lanes);
  const axisLeft = 190;
  const markerLabelTop = 44;
  const chartAnim = fadeSlideIn({ frame, fps, delay: 8 });
  const chartProgress = interpolate(
    frame,
    [16, Math.max(40, totalFrames - 28)],
    [0, 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_CRISP,
    },
  );

  return (
    <div
      style={{
        opacity: chartAnim.opacity,
        transform: `translateY(${chartAnim.translateY}px)`,
        borderRadius: 26,
        border: `1px solid ${theme.cardBorder}`,
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFF 100%)",
        boxShadow: "0 22px 60px rgba(15, 23, 42, 0.08)",
        padding: "22px 30px 26px",
      }}
    >
      <Axis theme={theme} />

      <div style={{ position: "relative", paddingTop: markerLabelTop }}>
        {markers.map((marker, index) => {
          const color = markerColor(marker.tone, theme);
          const left = clamp(marker.at, 0, 100);
          const markerAnim = fadeSlideIn({
            frame,
            fps,
            delay: 26 + index * 10,
          });
          return (
            <div
              key={`${index}-${marker.label}`}
              style={{
                position: "absolute",
                left: `calc(${axisLeft}px + (100% - ${axisLeft}px) * ${left / 100})`,
                top: markerLabelTop,
                bottom: 0,
                width: 2,
                background: `${color}66`,
                opacity: markerAnim.opacity,
                transform: `translateY(${markerAnim.translateY}px)`,
                zIndex: 3,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -42,
                  left: 0,
                  transform: "translateX(-50%)",
                  padding: "7px 11px",
                  borderRadius: 999,
                  background: "#FFFFFF",
                  border: `1px solid ${color}77`,
                  color,
                  fontSize: 18,
                  fontWeight: 850,
                  whiteSpace: "nowrap",
                  boxShadow: `0 10px 24px ${color}18`,
                }}
              >
                {marker.label}
              </div>
            </div>
          );
        })}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {lanes.map((lane, laneIndex) => {
            const laneAnim = fadeSlideIn({
              frame,
              fps,
              delay: 14 + laneIndex * 6,
            });
            const laneVisual = laneStyle(laneIndex, theme);
            return (
              <div
                key={`${laneIndex}-${lane.label}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "170px 1fr",
                  gap: 20,
                  alignItems: "center",
                  minHeight: 70,
                  opacity: laneAnim.opacity,
                  transform: `translateY(${laneAnim.translateY}px)`,
                }}
              >
                <div
                  style={{
                    color: laneVisual.color,
                    fontSize: 26,
                    lineHeight: 1.22,
                    fontWeight: 850,
                    padding: "8px 0 8px 12px",
                    borderLeft: `3px solid ${laneVisual.color}`,
                  }}
                >
                  {lane.label}
                </div>

                <div
                  style={{
                    position: "relative",
                    height: 54,
                    borderRadius: 999,
                    background: laneVisual.tint,
                    border: `1px solid ${laneVisual.color}16`,
                    overflow: "visible",
                  }}
                >
                  {lane.tasks.map((task, taskIndex) => {
                    const flatIndex = flatTasks.findIndex(
                      (flat) =>
                        flat.laneIndex === laneIndex &&
                        flat.taskIndex === taskIndex,
                    );
                    const isActive = flatIndex === activeFlatIndex;
                    const color = laneVisual.color;
                    const taskStatusStyle = statusStyle(task.status, laneVisual);
                    const start = clamp(task.start, 0, 99);
                    const end = clamp(task.end, start + 1, 100);
                    const width = end - start;
                    const progressWidth = interpolate(
                      chartProgress,
                      [start, end],
                      [0, width],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: EASE_OUT_CRISP,
                      },
                    );
                    const inactiveOpacity =
                      activeFlatIndex >= 0 && !isActive
                        ? taskStatusStyle.opacity * 0.82
                        : taskStatusStyle.opacity;

                    return (
                      <div
                        key={`${taskIndex}-${task.label}`}
                        style={{
                          position: "absolute",
                          left: `${start}%`,
                          top: 8,
                          width: `${width}%`,
                          minWidth: 76,
                          height: 38,
                          borderRadius: 999,
                          background: `linear-gradient(90deg, ${color}${taskStatusStyle.railAlpha} 0%, #FFFFFF 100%)`,
                          border: `1.5px ${taskStatusStyle.borderStyle} ${
                            isActive ? color : `${color}66`
                          }`,
                          boxShadow: isActive
                            ? `0 14px 28px ${color}1F`
                            : "none",
                          opacity: inactiveOpacity,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: `${progressWidth === 0 ? 0 : clamp((progressWidth / width) * 100, 0, 100)}%`,
                            borderRadius: 999,
                            background: `${color}${taskStatusStyle.fillAlpha}`,
                          }}
                        />
                        {width > 7 && (
                          <div
                            style={{
                              position: "relative",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 8,
                              height: "100%",
                              padding: "0 13px",
                              color: taskStatusStyle.labelColor,
                              fontSize: 20,
                              lineHeight: 1,
                              fontWeight: 900,
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span>{task.label}</span>
                            <span
                              style={{
                                padding: "3px 7px",
                                borderRadius: 999,
                                background: "#FFFFFFC8",
                                color,
                                fontSize: 14,
                                fontWeight: 900,
                              }}
                            >
                              {statusLabel(task.status)}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const FocusPanel: React.FC<{
  task?: FlatTask;
  sequenceNumber: number;
  laneColor: string;
  theme: VideoTheme;
}> = ({ task, sequenceNumber, laneColor, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlideIn({ frame, fps, delay: 20 });
  const color = task ? laneColor : theme.accentColor;

  return (
    <div
      style={{
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
        borderRadius: 22,
        border: `1.5px solid ${color}28`,
        background: `linear-gradient(90deg, ${color}0F 0%, #FFFFFF 42%, #FFFFFF 100%)`,
        boxShadow: "0 16px 42px rgba(15, 23, 42, 0.06)",
        padding: "18px 28px",
        minHeight: 146,
        display: "grid",
        gridTemplateColumns: "74px 1fr",
        gap: 18,
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 66,
          height: 66,
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${color}16`,
          color,
          fontSize: 30,
          fontWeight: 950,
          fontFamily: theme.monoFont,
        }}
      >
        {task ? String(sequenceNumber + 1).padStart(2, "0") : "i"}
      </div>
      <div>
        <div
          style={{
            color,
            fontSize: 20,
            fontWeight: 900,
            marginBottom: 6,
          }}
        >
          {task ? statusLabel(task.task.status) : "执行链路"}
        </div>
        <div
          style={{
            color: theme.primaryText,
            fontSize: 34,
            lineHeight: 1.18,
            fontWeight: 950,
            marginBottom: task?.task.note ? 6 : 0,
          }}
        >
          {task?.task.label ?? "把并行和阻塞画出来"}
        </div>
        {task?.task.note && (
          <div
            style={{
              color: theme.secondaryText,
              fontSize: 24,
              lineHeight: 1.35,
              fontWeight: 700,
            }}
          >
            {task.task.note}
          </div>
        )}
      </div>
    </div>
  );
};

export const GanttScene: React.FC<{
  scene: GanttSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
}> = ({ scene, theme, totalFrames, layout = "landscape" }) => {
  const frame = useCurrentFrame();
  const lc = useLayoutConfig(layout);
  const lanes = scene.lanes.slice(0, 5).map((lane) => ({
    ...lane,
    tasks: lane.tasks.slice(0, 4),
  }));
  const normalizedScene = { ...scene, lanes };
  const flatTasks = flattenTasks(lanes).slice(0, 8);
  const focusSequence =
    scene.focusSequence && scene.focusSequence.length > 0
      ? scene.focusSequence
      : flatTasks.map((_, index) => index);
  const activeSlot = clampIndex(
    Math.floor(
      interpolate(frame, [32, Math.max(44, totalFrames - 30)], [0, focusSequence.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
    focusSequence.length - 1,
  );
  const activeFlatIndex = clampIndex(
    focusSequence[activeSlot] ?? 0,
    flatTasks.length - 1,
  );
  const activeTask = flatTasks[activeFlatIndex];
  const activeLaneColor = activeTask
    ? laneStyle(activeTask.laneIndex, theme).color
    : theme.accentColor;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: theme.background,
        fontFamily: theme.fontFamily,
        padding: layout === "portrait" ? "100px 48px 80px" : "84px 60px 48px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
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
          gridTemplateColumns: "1fr",
          gap: 18,
          maxWidth: lc.maxWidth,
          width: "100%",
        }}
      >
        <GanttChart
          scene={normalizedScene}
          theme={theme}
          activeFlatIndex={activeFlatIndex}
          totalFrames={totalFrames}
        />
        <FocusPanel
          task={activeTask}
          sequenceNumber={activeSlot}
          laneColor={activeLaneColor}
          theme={theme}
        />
      </div>
    </div>
  );
};
