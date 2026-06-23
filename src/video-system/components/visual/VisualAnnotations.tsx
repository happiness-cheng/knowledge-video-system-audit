/**
 * 图片标注层
 *
 * 用于 image-hero 内部的截图区域框、指向说明和局部放大。
 * 坐标均为相对于图片面板的百分比，保持 videoSpec 可读、可控。
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoTheme } from "../../themes/types";
import { EASE_OUT_CRISP, fadeSlideIn } from "../../utils/animation";

export type VisualAnnotationTone = "accent" | "success" | "warning" | "danger";
export type VisualAnnotationKind = "box" | "arrow" | "magnify";

export interface VisualAnnotation {
  kind?: VisualAnnotationKind;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tone?: VisualAnnotationTone;
  labelX?: number;
  labelY?: number;
  zoom?: number;
}

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));
const clampToRange = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

interface RectPercent {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PointPercent {
  x: number;
  y: number;
}

const toneColor = (tone: VisualAnnotationTone | undefined, theme: VideoTheme) => {
  if (tone === "success") return theme.success;
  if (tone === "warning") return theme.warning;
  if (tone === "danger") return theme.danger;
  return theme.accentColor;
};

const rectCenter = (rect: RectPercent): PointPercent => ({
  x: clampPercent(rect.x + rect.width / 2),
  y: clampPercent(rect.y + rect.height / 2),
});

const annotationCenter = (annotation: VisualAnnotation): PointPercent => ({
  x: clampPercent(annotation.x + annotation.width / 2),
  y: clampPercent(annotation.y + annotation.height / 2),
});

const labelAnchor = (annotation: VisualAnnotation) => {
  const center = annotationCenter(annotation);
  return {
    x: clampPercent(annotation.labelX ?? center.x + 13),
    y: clampPercent(annotation.labelY ?? Math.max(8, center.y - 17)),
  };
};

const targetEdgePoint = (
  rect: RectPercent,
  from: PointPercent,
): PointPercent => {
  const center = rectCenter(rect);
  const dx = from.x - center.x;
  const dy = from.y - center.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    return {
      x: dx > 0 ? rect.x + rect.width : rect.x,
      y: clampToRange(from.y, rect.y, rect.y + rect.height),
    };
  }

  return {
    x: clampToRange(from.x, rect.x, rect.x + rect.width),
    y: dy > 0 ? rect.y + rect.height : rect.y,
  };
};

const labelEdgePoint = (
  label: PointPercent,
  target: PointPercent,
): PointPercent => {
  const dx = target.x - label.x;
  const dy = target.y - label.y;
  const length = Math.max(1, Math.sqrt(dx * dx + dy * dy));
  const offset = 3.2;

  return {
    x: clampPercent(label.x + (dx / length) * offset),
    y: clampPercent(label.y + (dy / length) * offset),
  };
};

export const VisualAnnotations: React.FC<{
  annotations?: VisualAnnotation[];
  activeIndex: number;
  imageSrc: string;
  theme: VideoTheme;
}> = ({ annotations, activeIndex, imageSrc, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const safeAnnotations = (annotations ?? []).slice(0, 3);

  if (safeAnnotations.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      {safeAnnotations.map((annotation, index) => {
        const color = toneColor(annotation.tone, theme);
        const kind = annotation.kind ?? "box";
        const rect = {
          x: clampPercent(annotation.x),
          y: clampPercent(annotation.y),
          width: clampPercent(annotation.width),
          height: clampPercent(annotation.height),
        };
        const center = annotationCenter(annotation);
        const label = labelAnchor(annotation);
        const targetPoint = targetEdgePoint(rect, label);
        const startPoint = labelEdgePoint(label, targetPoint);
        const isActive = index === activeIndex;
        const anim = fadeSlideIn({ frame, fps, delay: 18 + index * 10 });
        const draw = interpolate(frame, [24 + index * 8, 42 + index * 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_OUT_CRISP,
        });
        const opacity = anim.opacity * (isActive ? 1 : 0.64);

        return (
          <React.Fragment key={`${index}-${annotation.label}`}>
            {(kind === "arrow" || kind === "magnify") && (
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity,
                }}
              >
                <line
                  x1={startPoint.x}
                  y1={startPoint.y}
                  x2={targetPoint.x}
                  y2={targetPoint.y}
                  stroke={color}
                  strokeWidth={isActive ? 0.35 : 0.24}
                  strokeLinecap="round"
                  strokeDasharray={`${draw * 100} 100`}
                />
                <circle cx={targetPoint.x} cy={targetPoint.y} r={0.65} fill={color} />
              </svg>
            )}

            <div
              style={{
                position: "absolute",
                left: `${rect.x}%`,
                top: `${rect.y}%`,
                width: `${rect.width}%`,
                height: `${rect.height}%`,
                borderRadius: 16,
                border: `${isActive ? 4 : 3}px solid ${color}${isActive ? "E6" : "88"}`,
                background: `${color}10`,
                boxShadow: isActive ? `0 0 0 9px ${color}14` : "none",
                opacity,
                transform: `translateY(${anim.translateY}px)`,
              }}
            />

            {kind === "magnify" ? (
              <div
                style={{
                  position: "absolute",
                  left: `${label.x}%`,
                  top: `${label.y}%`,
                  width: 245,
                  height: 150,
                  borderRadius: 20,
                  transform: "translate(-50%, -50%)",
                  border: `3px solid ${color}D8`,
                  backgroundColor: "#FFFFFF",
                  backgroundImage: `url(${imageSrc})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: `${(annotation.zoom ?? 2.2) * 100}%`,
                  backgroundPosition: `${center.x}% ${center.y}%`,
                  boxShadow: `0 20px 46px ${color}28`,
                  opacity,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 10,
                    right: 10,
                    bottom: 9,
                    padding: "7px 10px",
                    borderRadius: 999,
                    background: "#FFFFFFE8",
                    color,
                    fontSize: 18,
                    fontWeight: 900,
                    textAlign: "center",
                  }}
                >
                  {annotation.label}
                </div>
              </div>
            ) : (
              <div
                style={{
                  position: "absolute",
                  left: `${label.x}%`,
                  top: `${label.y}%`,
                  transform: "translate(-50%, -50%)",
                  padding: "10px 14px",
                  borderRadius: 999,
                  background: "#FFFFFFF2",
                  border: `2px solid ${color}99`,
                  color,
                  fontSize: 21,
                  lineHeight: 1.2,
                  fontWeight: 900,
                  boxShadow: `0 14px 32px ${color}20`,
                  whiteSpace: "nowrap",
                  opacity,
                }}
              >
                {annotation.label}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
