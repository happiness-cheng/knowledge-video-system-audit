import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { springEnter, fadeSlide, breathe } from "../labMotionPrimitives";

interface InsightPanelProps {
  quote: string;
  subtitle?: string;
  label?: string;
  accentColor?: string;
}

/** InsightPanel — 结论聚焦面板 */
export const InsightPanel: React.FC<InsightPanelProps> = ({
  quote, subtitle, label = "实验结论", accentColor = "#6366f1",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const qP = springEnter(frame, fps, 0);
  const subAnim = fadeSlide(frame, fps, 18);
  const labelAnim = fadeSlide(frame, fps, 0);
  const labelScale = breathe(frame, 0.04, 1.0, 1.006);
  const labelOp = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.97, 1.0]);
  const lines = quote.split("\n");

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "80px 120px", textAlign: "center" }}>
      <div style={{ fontSize: 50, fontWeight: 700, color: accentColor, letterSpacing: 4, textTransform: "uppercase" as const, marginBottom: 24, opacity: labelAnim.opacity * labelOp, transform: `scale(${labelScale})` }}>{label}</div>
      <div style={{ opacity: qP, transform: `translateY(${(1 - qP) * 15}px)` }}>
        {lines.map((line, i) => {
          const isLast = i === lines.length - 1;
          return <div key={i} style={{ fontSize: isLast ? 156 : 88, fontWeight: isLast ? 900 : 700, lineHeight: isLast ? 1.05 : 1.16, background: isLast ? `linear-gradient(135deg, ${accentColor}, #a78bfa)` : "none", WebkitBackgroundClip: isLast ? "text" : "unset", backgroundClip: isLast ? "text" : "unset", color: isLast ? "transparent" : "#a0a0b8", opacity: isLast ? 1 : 0.75 }}>{line}</div>;
        })}
      </div>
      {subtitle && <div style={{ fontSize: 88, fontWeight: 650, color: "#6a6a80", marginTop: 20, opacity: subAnim.opacity, transform: `translateY(${subAnim.translateY}px)` }}>{subtitle}</div>}
    </div>
  );
};
