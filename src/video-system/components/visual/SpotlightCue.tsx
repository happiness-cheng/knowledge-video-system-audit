/**
 * SpotlightCue
 *
 * 统一渲染 cue 驱动的白底高亮信号层。
 * 只负责视觉信号，不负责计算 activeTarget。
 */

import React from "react";
import type { CSSProperties } from "react";
import type { SpotlightVisualState } from "../../utils/directorCue";

const alphaHex = (opacity: number) =>
  Math.round(Math.max(0, Math.min(1, opacity)) * 255)
    .toString(16)
    .padStart(2, "0");

export const SpotlightCue: React.FC<{
  visual?: SpotlightVisualState | null;
  accentColor: string;
  tintColor?: string;
  borderRadius?: number;
  showChip?: boolean;
  chipLabel?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}> = ({
  visual,
  accentColor,
  tintColor = accentColor,
  borderRadius = 16,
  showChip = false,
  chipLabel = "当前",
  style,
  children,
}) => {
  const radius = `${borderRadius}px`;
  const shadow =
    visual && visual.shadowStrength > 0.1
      ? `0 ${visual.shadowStrength > 0.2 ? "8px 32px" : "4px 16px"} rgba(0,0,0,${visual.shadowStrength})`
      : (style?.boxShadow ?? "none");
  const border =
    visual && visual.borderOpacity > 0
      ? `${visual.borderOpacity > 0.5 ? "2.5px" : "1.5px"} solid ${accentColor}${alphaHex(visual.borderOpacity)}`
      : style?.border;

  return (
    <div
      style={{
        position: "relative",
        borderRadius,
        ...style,
        boxShadow: shadow,
        border,
      }}
    >
      {visual && visual.bgTintOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: radius,
            background: tintColor,
            opacity: visual.bgTintOpacity,
            pointerEvents: "none",
          }}
        />
      )}
      {visual && visual.sideRailOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 10,
            borderRadius: `${radius} 0 0 ${radius}`,
            background: accentColor,
            opacity: visual.sideRailOpacity,
            pointerEvents: "none",
          }}
        />
      )}
      {showChip && visual && visual.chipOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            fontSize: 22,
            fontWeight: 700,
            color: "#fff",
            background: accentColor,
            padding: "3px 10px",
            borderRadius: 6,
            opacity: visual.chipOpacity,
            pointerEvents: "none",
            zIndex: 5,
          }}
        >
          {chipLabel}
        </div>
      )}
      {children}
    </div>
  );
};
