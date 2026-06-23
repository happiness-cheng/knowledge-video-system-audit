import React from "react";
import { interpolate } from "remotion";
import { EASE_OUT_CRISP } from "../utils/animation";

export interface MotionPoint {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  opacity?: number;
}

export interface MotionObjectProps {
  frame: number;
  fromFrame: number;
  toFrame: number;
  from: MotionPoint;
  to: MotionPoint;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const MotionObject: React.FC<MotionObjectProps> = ({
  frame,
  fromFrame,
  toFrame,
  from,
  to,
  children,
  style,
}) => {
  const progress = interpolate(frame, [fromFrame, toFrame], [0, 1], {
    easing: EASE_OUT_CRISP,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const x = interpolate(progress, [0, 1], [from.x, to.x]);
  const y = interpolate(progress, [0, 1], [from.y, to.y]);
  const scale = interpolate(progress, [0, 1], [
    from.scale ?? 1,
    to.scale ?? 1,
  ]);
  const rotate = interpolate(progress, [0, 1], [
    from.rotate ?? 0,
    to.rotate ?? 0,
  ]);
  const opacity = interpolate(progress, [0, 1], [
    from.opacity ?? 1,
    to.opacity ?? 1,
  ]);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        opacity,
        transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`,
        transformOrigin: "center",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
