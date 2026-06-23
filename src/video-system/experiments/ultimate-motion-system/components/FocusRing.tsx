import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface FocusRingProps {
  active: boolean;
  color?: string;
  size?: number;
  children: React.ReactNode;
}

/** FocusRing — 聚焦光环 */
export const FocusRing: React.FC<FocusRingProps> = ({
  active, color = "rgba(99,102,241,0.3)", size = 200, children,
}) => {
  const frame = useCurrentFrame();
  const glowOp = active ? interpolate(Math.sin(frame * 0.05), [-1, 1], [0.15, 0.3]) : 0;
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {active && (
        <div style={{ position: "absolute", inset: -16, borderRadius: "50%", background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, opacity: glowOp, pointerEvents: "none" }} />
      )}
      {children}
    </div>
  );
};
