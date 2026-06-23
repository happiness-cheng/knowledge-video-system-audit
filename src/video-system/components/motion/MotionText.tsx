import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_OUT_CRISP } from "../../utils/animation";

export interface MotionTextProps {
  text: string;
  mode?: "line" | "word";
  delay?: number;
  stagger?: number;
  style?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
}

export const MotionText: React.FC<MotionTextProps> = ({
  text,
  mode = "line",
  delay = 0,
  stagger = 5,
  style,
  itemStyle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const parts = mode === "word" ? text.split(/(\s+)/) : text.split("\n");

  return (
    <span style={style}>
      {parts.map((part, index) => {
        const isSpace = mode === "word" && /^\s+$/.test(part);
        if (isSpace) {
          return part;
        }

        const progress = interpolate(
          frame - delay - index * stagger,
          [0, 0.42 * fps],
          [0, 1],
          {
            easing: EASE_OUT_CRISP,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );
        const y = interpolate(progress, [0, 1], [18, 0]);

        return (
          <span
            key={`${part}-${index}`}
            style={{
              display: mode === "line" ? "block" : "inline-block",
              opacity: progress,
              transform: `translateY(${y}px)`,
              ...itemStyle,
            }}
          >
            {part}
          </span>
        );
      })}
    </span>
  );
};
