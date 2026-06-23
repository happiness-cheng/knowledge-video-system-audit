/**
 * HighlightBox — 截图高亮框
 *
 * 在截图证据上叠加绝对定位的矩形边框，用于标注重点区域。
 * 使用 frame-driven 动画（fadeSlideIn）做入场效果。
 */

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fadeSlideIn, pulseGlow } from "../utils/animation";

export interface HighlightBoxConfig {
  /** 顶部偏移百分比 0-100 */
  top: number;
  /** 左侧偏移百分比 0-100 */
  left: number;
  /** 宽度百分比 0-100 */
  width: number;
  /** 高度百分比 0-100 */
  height: number;
  /** 边框颜色，默认红色 */
  color?: string;
  /** 可选标注文字 */
  label?: string;
}

interface HighlightBoxProps extends HighlightBoxConfig {
  /** 入场动画延迟（帧数） */
  delay?: number;
}

export const HighlightBox: React.FC<HighlightBoxProps> = ({
  top,
  left,
  width,
  height,
  color = "#ef4444",
  label,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlideIn({ frame, fps, delay });

  return (
    <div
      style={{
        position: "absolute",
        top: `${top}%`,
        left: `${left}%`,
        width: `${width}%`,
        height: `${height}%`,
        border: `2.5px solid ${color}`,
        borderRadius: 4,
        boxShadow:
          anim.opacity >= 0.95
            ? pulseGlow(frame, fps, color, delay)
            : `0 0 0 1px ${color}33, 0 0 8px ${color}22`,
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
        pointerEvents: "none",
      }}
    >
      {label && (
        <div
          style={{
            position: "absolute",
            top: -34,
            left: 0,
            fontSize: 28,
            fontWeight: 700,
            color: "#fff",
            background: color,
            padding: "4px 10px",
            borderRadius: 3,
            whiteSpace: "nowrap",
            lineHeight: 1.3,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
