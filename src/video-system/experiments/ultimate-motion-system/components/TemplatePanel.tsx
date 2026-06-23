import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { fadeSlide } from "../labMotionPrimitives";

interface TemplatePanelProps {
  title: string;
  items: string[];
  itemOpacities: number[];
  accentColor?: string;
}

/** TemplatePanel — 模板页面板，支持 progressive-retain */
export const TemplatePanel: React.FC<TemplatePanelProps> = ({
  title, items, itemOpacities, accentColor = "#6366f1",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleAnim = fadeSlide(frame, fps, 0);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "80px 120px" }}>
      <div style={{ fontSize: 104, fontWeight: 700, color: "#f0f0f5", marginBottom: 40, opacity: titleAnim.opacity, transform: `translateY(${titleAnim.translateY}px)`, textAlign: "center" }}>{title}</div>
      <div style={{ width: "80%", maxWidth: 1400, background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 52, display: "flex", flexDirection: "column", gap: 20 }}>
        {items.map((item, i) => {
          const anim = fadeSlide(frame, fps, 10 + i * 12);
          const op = itemOpacities[i] ?? 0.4;
          const bgOp = interpolate(op, [0.4, 1], [0, 0.08], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const hasBlank = item.includes("____");
          return (
            <div key={i} style={{ opacity: anim.opacity * op, transform: `translateY(${anim.translateY}px)`, fontSize: 76, fontWeight: op > 0.8 ? 650 : 550, color: op > 0.8 ? "#f0f0f5" : "#a0a0b8", lineHeight: 1.4, padding: "16px 24px", borderRadius: 12, background: bgOp > 0 ? `rgba(99,102,241,${bgOp})` : "transparent", borderLeft: op > 0.8 ? `3px solid ${accentColor}` : "3px solid transparent" }}>
              {hasBlank ? <span>{item.replace("____", "")}<span style={{ display: "inline-block", width: 120, height: 3, background: "rgba(255,255,255,0.12)", verticalAlign: "middle", marginLeft: 4 }} /></span> : item}
            </div>
          );
        })}
      </div>
    </div>
  );
};
