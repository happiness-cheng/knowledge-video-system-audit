import React from "react";
import { interpolate } from "remotion";
import type { VideoTheme } from "../../themes/types";

export interface MotionConnectorProps {
  theme: VideoTheme;
  direction?: "right" | "down";
  progress?: number;
  active?: boolean;
  size?: number;
  thickness?: number;
  style?: React.CSSProperties;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const MotionConnector: React.FC<MotionConnectorProps> = ({
  theme,
  direction = "right",
  progress = 1,
  active = false,
  size = 84,
  thickness = 2.5,
  style,
}) => {
  const draw = clamp01(progress);
  const isRight = direction === "right";
  const color = active ? theme.accentColor : theme.cardBorder;
  const strokeWidth = active ? thickness + 0.8 : thickness;
  const pathLength = isRight ? 92 : 44;
  const arrowOpacity = interpolate(draw, [0.68, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: isRight ? size : 32,
        height: isRight ? 32 : size,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        opacity: interpolate(draw, [0, 0.12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        filter: active ? `drop-shadow(0 0 5px ${theme.accentColor}66)` : "none",
        ...style,
      }}
    >
      <svg
        width={isRight ? size : 32}
        height={isRight ? 32 : size}
        viewBox={isRight ? "0 0 104 32" : "0 0 32 64"}
        fill="none"
      >
        {isRight ? (
          <>
            <path
              d="M6 16 H88"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={pathLength * (1 - draw)}
            />
            <path
              d="M82 9 L91 16 L82 23"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={arrowOpacity}
            />
          </>
        ) : (
          <>
            <path
              d="M16 6 V48"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={pathLength * (1 - draw)}
            />
            <path
              d="M9 42 L16 51 L23 42"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={arrowOpacity}
            />
          </>
        )}
      </svg>
    </div>
  );
};
