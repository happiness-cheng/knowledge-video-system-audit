import React from "react";
import { interpolate } from "remotion";
import type { VideoTheme } from "../../themes/types";
import { MotionBox } from "./MotionBox";

export interface MotionCardProps {
  theme: VideoTheme;
  children: React.ReactNode;
  accent?: string;
  progress?: number;
  active?: boolean;
  retained?: boolean;
  style?: React.CSSProperties;
}

export const MotionCard: React.FC<MotionCardProps> = ({
  theme,
  children,
  accent,
  progress = 1,
  active = false,
  retained = true,
  style,
}) => {
  const tone = accent ?? theme.accentColor;
  const activeScale = active ? 1.025 : 1;
  const opacity = retained ? interpolate(progress, [0, 1], [0, active ? 1 : 0.82]) : progress;

  return (
    <MotionBox
      progress={progress}
      translateY={26}
      scaleFrom={0.98}
      scaleTo={activeScale}
      style={{
        opacity,
        height: "100%",
      }}
    >
      <div
        style={{
          height: "100%",
          background: active ? `${tone}12` : theme.cardStyle.background,
          border: active ? `3px solid ${tone}` : theme.cardStyle.border,
          borderRadius: theme.cardStyle.borderRadius,
          padding: theme.cardStyle.padding,
          boxShadow: active ? theme.shadowLg : theme.shadow,
          ...style,
        }}
      >
        {children}
      </div>
    </MotionBox>
  );
};
