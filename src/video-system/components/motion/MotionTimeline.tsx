import React from "react";
import { interpolate } from "remotion";
import type { VideoTheme } from "../../themes/types";

export interface MotionTimelineProps {
  theme: VideoTheme;
  count: number;
  progress: number;
  activeIndex?: number;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const MotionTimeline: React.FC<MotionTimelineProps> = ({
  theme,
  count,
  progress,
  activeIndex = -1,
}) => {
  if (count <= 0) {
    return null;
  }

  const draw = clamp01(progress);
  const safeCount = count;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 54,
        marginBottom: 18,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 25,
          height: 4,
          borderRadius: 999,
          background: theme.cardBorder,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 25,
          height: 4,
          width: `${draw * 100}%`,
          borderRadius: 999,
          background: theme.accentColor,
          boxShadow: `0 0 12px ${theme.accentColor}44`,
        }}
      />
      {Array.from({ length: safeCount }).map((_, index) => {
        const pointProgress = interpolate(
          draw,
          [index / safeCount, (index + 0.55) / safeCount],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );
        const isActive = index === activeIndex;
        const size = isActive ? 24 : 18;

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left:
                safeCount === 1
                  ? "50%"
                  : `${(index / (safeCount - 1)) * 100}%`,
              top: 27,
              width: size,
              height: size,
              borderRadius: "50%",
              border: `3px solid ${isActive ? theme.accentColor : theme.cardBorder}`,
              background: isActive ? theme.accentColor : theme.background,
              opacity: interpolate(pointProgress, [0, 1], [0.35, 1]),
              transform: `translate(-50%, -50%) scale(${interpolate(
                pointProgress,
                [0, 1],
                [0.72, 1],
              )})`,
              boxShadow: isActive
                ? `0 0 18px ${theme.accentColor}66`
                : "none",
            }}
          />
        );
      })}
    </div>
  );
};
