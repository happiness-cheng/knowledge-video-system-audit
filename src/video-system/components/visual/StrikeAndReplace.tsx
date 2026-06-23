/**
 * StrikeAndReplace
 *
 * 用于表达“旧判断被划掉，再替换成新判断”的纠偏动作。
 */

import React from "react";
import { interpolate } from "remotion";
import type { VideoTheme } from "../../themes/types";

export const StrikeAndReplace: React.FC<{
  frame: number;
  wrongText: string;
  leadText?: string;
  replacementText: string;
  theme: VideoTheme;
  wrongFontSize?: number;
  replacementFontSize?: number;
  minHeight?: number;
}> = ({
  frame,
  wrongText,
  leadText = "是",
  replacementText,
  theme,
  wrongFontSize = 104,
  replacementFontSize = 112,
  minHeight = 310,
}) => {
  const wrongIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const strikeProgress = interpolate(frame, [18, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wrongOut = interpolate(frame, [44, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const answerIn = interpolate(frame, [52, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 1180,
        minHeight,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "inline-block",
          fontSize: wrongFontSize,
          fontWeight: 900,
          lineHeight: 1,
          color: theme.secondaryText,
          opacity: wrongIn * wrongOut,
          transform: `translateY(${interpolate(wrongIn, [0, 1], [20, 0])}px) scale(${interpolate(
            strikeProgress,
            [0, 1],
            [1, 0.98],
          )})`,
        }}
      >
        {wrongText}
        <div
          style={{
            position: "absolute",
            left: "-4%",
            top: "52%",
            width: `${strikeProgress * 108}%`,
            height: Math.max(8, wrongFontSize * 0.096),
            borderRadius: 999,
            background: theme.danger,
            transform: "rotate(-2deg)",
            boxShadow: `0 0 14px ${theme.danger}44`,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          opacity: answerIn,
          transform: `translateY(${interpolate(answerIn, [0, 1], [24, 0])}px) scale(${interpolate(
            answerIn,
            [0, 1],
            [0.96, 1],
          )})`,
        }}
      >
        {leadText && (
          <span
            style={{
              fontSize: Math.max(42, replacementFontSize * 0.66),
              fontWeight: 800,
              color: theme.primaryText,
            }}
          >
            {leadText}
          </span>
        )}
        <span
          style={{
            fontSize: replacementFontSize,
            fontWeight: 950,
            lineHeight: 1.05,
            background: theme.accentGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            paddingBottom: 8,
          }}
        >
          {replacementText}
        </span>
      </div>
    </div>
  );
};
