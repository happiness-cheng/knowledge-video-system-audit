import React from "react";

interface MotionGridProps {
  columns: number;
  gap?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/** MotionGrid — 网格布局容器 */
export const MotionGrid: React.FC<MotionGridProps> = ({
  columns,
  gap = 28,
  children,
  style,
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap,
      ...style,
    }}
  >
    {children}
  </div>
);
