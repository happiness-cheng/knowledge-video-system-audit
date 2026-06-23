/**
 * 连接箭头
 *
 * 用于流程图/步骤图中节点之间的连接线。
 * 精修：更精致的线条 + active 时发光。
 */

import React from "react";
import type { VideoTheme } from "../themes/types";

export interface ArrowProps {
  theme: VideoTheme;
  direction?: "right" | "down";
  size?: number;
  active?: boolean;
}

export const Arrow: React.FC<ArrowProps> = ({
  theme,
  direction = "right",
  size = 48,
  active = false,
}) => {
  const color = active ? theme.accentColor : theme.cardBorder;
  const isRight = direction === "right";
  const glowFilter = active
    ? `drop-shadow(0 0 4px ${theme.accentColor}66)`
    : "none";

  return (
    <div
      style={{
        width: isRight ? size : 24,
        height: isRight ? 24 : size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        filter: glowFilter,
      }}
    >
      <svg
        width={isRight ? size : 24}
        height={isRight ? 24 : size}
        viewBox={isRight ? "0 0 36 24" : "0 0 24 36"}
        fill="none"
      >
        {isRight ? (
          <>
            <line
              x1="0"
              y1="12"
              x2="26"
              y2="12"
              stroke={color}
              strokeWidth={active ? 2.5 : 1.5}
              strokeLinecap="round"
            />
            <polyline
              points="22,6 28,12 22,18"
              stroke={color}
              strokeWidth={active ? 2.5 : 1.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : (
          <>
            <line
              x1="12"
              y1="0"
              x2="12"
              y2="26"
              stroke={color}
              strokeWidth={active ? 2.5 : 1.5}
              strokeLinecap="round"
            />
            <polyline
              points="6,22 12,28 18,22"
              stroke={color}
              strokeWidth={active ? 2.5 : 1.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
      </svg>
    </div>
  );
};
