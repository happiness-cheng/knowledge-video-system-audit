import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { springEnter, fadeSlide, staggerReveal, breathe, pulse, cardLift, focusGlow } from "../labMotionPrimitives";
import { SceneHeader } from "../components/SceneHeader";

/** Motion Primitive Gallery — 展示 16 种动效原语 */
export const MotionPrimitiveGallery: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { name: "springEnter", val: springEnter(frame, fps, 0) },
    { name: "fadeSlide", val: fadeSlide(frame, fps, 5).opacity },
    { name: "breathe", val: breathe(frame) },
    { name: "pulse", val: pulse(frame) },
    { name: "cardLift(1.0)", val: cardLift(1) },
    { name: "cardLift(0.4)", val: cardLift(0.4) },
    { name: "focusGlow", val: focusGlow(frame) },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "60px 80px" }}>
      <SceneHeader title="Motion Primitives" subtitle="16 种动效原语" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
        {items.map((item, i) => {
          const s = staggerReveal(frame, fps, i, 12, 15);
          return (
            <div key={item.name} style={{ opacity: s.opacity, transform: `translateY(${s.translateY}px) scale(${typeof item.val === "number" ? item.val : 1})`, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, textAlign: "center" as const }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#6366f1", marginBottom: 8 }}>{item.name}</div>
              <div style={{ fontSize: 28, color: "#a0a0b8" }}>{typeof item.val === "number" ? item.val.toFixed(3) : "—"}</div>
            </div>
          );
        })}
      </div>
      {/* StaggerReveal demo */}
      <div style={{ marginTop: 32, display: "flex", gap: 16 }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const s = staggerReveal(frame, fps, i, 15, 15);
          return <div key={i} style={{ opacity: s.opacity, transform: `translateY(${s.translateY}px)`, width: 80, height: 80, borderRadius: 12, background: `rgba(99,102,241,${0.15 + i * 0.1})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700, color: "#f0f0f5" }}>{i + 1}</div>;
        })}
      </div>
    </div>
  );
};
