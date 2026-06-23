import React from "react";
import { interpolate } from "remotion";
import type { VideoTheme } from "../../themes/types";
import { SafeTitleText } from "../SafeTitleText";

const clampProgress = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const ConfusedToGuided: React.FC<{
  frame: number;
  theme: VideoTheme;
  title: string;
  confusionItems: string[];
  guideSteps: string[];
  resultTitle: string;
  resultSubtitle?: string;
}> = ({
  frame,
  theme,
  title,
  confusionItems,
  guideSteps,
  resultTitle,
  resultSubtitle,
}) => {
  const visibleConfusionItems =
    confusionItems.length > 0 ? confusionItems.slice(0, 5) : ["入口太多"];
  const visibleGuideSteps =
    guideSteps.length > 0 ? guideSteps.slice(0, 4) : ["问题", "路线", "结果"];
  const titleIn = clampProgress(frame, 0, 24);
  const guideIn = clampProgress(frame, 36, 78);
  const resultIn = clampProgress(frame, 104, 132);
  const confusionFade = clampProgress(frame, 62, 126);
  const activeStep = Math.max(
    -1,
    Math.min(visibleGuideSteps.length - 1, Math.floor((frame - 42) / 18)),
  );
  const cursorTravel = clampProgress(frame, 14, 116);
  const cursorLeft = interpolate(cursorTravel, [0, 0.34, 0.72, 1], [24, 28, 52, 76]);
  const cursorTop = interpolate(cursorTravel, [0, 0.34, 0.72, 1], [56, 43, 48, 50]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: theme.background,
        fontFamily: theme.fontFamily,
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

      <div
        style={{
          position: "absolute",
          top: 112,
          left: 120,
          right: 120,
          textAlign: "center",
          opacity: titleIn,
          transform: `translateY(${interpolate(titleIn, [0, 1], [24, 0])}px)`,
        }}
      >
        <h2
          style={{
            margin: 0,
            color: theme.primaryText,
            fontSize: 84,
            lineHeight: 1.12,
            fontWeight: theme.titleStyle.fontWeight,
            letterSpacing: 0,
          }}
        >
          <SafeTitleText text={title} maxCharsPerLine={15} />
        </h2>
      </div>

      <div
        style={{
          position: "absolute",
          left: 112,
          top: 270,
          width: 470,
          height: 560,
        }}
      >
        <div
          style={{
            color: theme.secondaryText,
            fontSize: 28,
            fontWeight: 800,
            marginBottom: 18,
            opacity: interpolate(confusionFade, [0, 1], [0.9, 0.34]),
          }}
        >
          入口太多
        </div>
        {visibleConfusionItems.map((item, index) => {
          const enter = clampProgress(frame, 8 + index * 6, 28 + index * 6);
          const opacity =
            enter * interpolate(confusionFade, [0, 1], [0.9, 0.22]);
          const xOffset = [-14, 28, -2, 42, 12][index] ?? 0;
          const yOffset = [0, 74, 148, 222, 296][index] ?? index * 72;
          const rotate = [-4, 3, -2, 4, -3][index] ?? 0;

          return (
            <div
              key={`${item}-${index}`}
              style={{
                position: "absolute",
                left: xOffset,
                top: 52 + yOffset,
                width: 320,
                minHeight: 68,
                padding: "16px 22px",
                borderRadius: 16,
                border: `2px solid ${theme.cardBorder}`,
                background: theme.cardBackground,
                color: theme.primaryText,
                fontSize: 32,
                fontWeight: 750,
                opacity,
                boxShadow: "0 16px 36px rgba(15, 23, 42, 0.08)",
                transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px) rotate(${rotate}deg)`,
              }}
            >
              {item}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: `${cursorLeft}%`,
          top: `${cursorTop}%`,
          width: 28,
          height: 28,
          borderRadius: 999,
          background: theme.accentColor,
          boxShadow: `0 0 0 12px ${theme.accentColor}22, 0 16px 36px rgba(15, 23, 42, 0.18)`,
          opacity: interpolate(resultIn, [0, 1], [1, 0.18]),
          transform: "translate(-50%, -50%)",
          zIndex: 20,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 352,
          width: 560,
          transform: "translateX(-50%)",
          opacity: guideIn,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 42,
            right: 42,
            top: 35,
            height: 4,
            borderRadius: 999,
            background: theme.cardBorder,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 42,
            top: 35,
            width: `${Math.max(0, ((activeStep + 1) / visibleGuideSteps.length) * 470)}px`,
            height: 4,
            borderRadius: 999,
            background: theme.accentColor,
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${visibleGuideSteps.length}, 1fr)`,
            gap: 14,
          }}
        >
          {visibleGuideSteps.map((step, index) => {
            const stepIn = clampProgress(frame, 42 + index * 18, 58 + index * 18);
            const isActive = index <= activeStep;
            return (
              <div
                key={`${step}-${index}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                  opacity: stepIn,
                  transform: `translateY(${interpolate(stepIn, [0, 1], [18, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isActive ? "#fff" : theme.secondaryText,
                    background: isActive ? theme.accentColor : theme.cardBackground,
                    border: `2px solid ${isActive ? theme.accentColor : theme.cardBorder}`,
                    boxShadow: isActive
                      ? `0 18px 38px ${theme.accentColor}28`
                      : "0 12px 28px rgba(15, 23, 42, 0.06)",
                    fontSize: 30,
                    fontWeight: 900,
                  }}
                >
                  {index + 1}
                </div>
                <div
                  style={{
                    minHeight: 70,
                    color: isActive ? theme.primaryText : theme.secondaryText,
                    fontSize: 28,
                    lineHeight: 1.18,
                    fontWeight: isActive ? 850 : 650,
                    textAlign: "center",
                  }}
                >
                  {step}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 118,
          top: 338,
          width: 430,
          minHeight: 300,
          padding: "38px 42px",
          borderRadius: 28,
          background: theme.cardBackground,
          border: `3px solid ${theme.success}`,
          boxShadow: "0 26px 70px rgba(15, 23, 42, 0.12)",
          opacity: resultIn,
          transform: `translateY(${interpolate(resultIn, [0, 1], [28, 0])}px) scale(${interpolate(resultIn, [0, 1], [0.96, 1])})`,
        }}
      >
        <div
          style={{
            color: theme.success,
            fontSize: 28,
            fontWeight: 900,
            marginBottom: 18,
          }}
        >
          路线清楚了
        </div>
        <div
          style={{
            color: theme.primaryText,
            fontSize: 52,
            lineHeight: 1.12,
            fontWeight: 900,
            letterSpacing: 0,
            marginBottom: 18,
          }}
        >
          <SafeTitleText text={resultTitle} maxCharsPerLine={7} />
        </div>
        {resultSubtitle && (
          <div
            style={{
              color: theme.secondaryText,
              fontSize: 31,
              lineHeight: 1.28,
              fontWeight: 650,
            }}
          >
            <SafeTitleText text={resultSubtitle} maxCharsPerLine={11} />
          </div>
        )}
      </div>
    </div>
  );
};
