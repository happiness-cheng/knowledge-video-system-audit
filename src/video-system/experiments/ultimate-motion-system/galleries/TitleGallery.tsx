import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { KineticTitleSystem } from "../components/KineticTitleSystem";
import { staggerReveal } from "../labMotionPrimitives";

/** Title Variants Gallery — 4+ 种标题变体 */
export const TitleGallery: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const variants = [
    { name: "Split", variant: "split" as const, line1: "我一开始以为", line2: "是 AI 不够聪明" },
    { name: "Contrast", variant: "contrast" as const, line1: "AI 没变", line2: "变的是你给的信息" },
    { name: "Pain-point", variant: "pain-point" as const, line1: "你用 AI 的方式", line2: "可能一直在浪费" },
    { name: "Conclusion", variant: "conclusion" as const, line2: "补背景后\n回答变具体了" },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "60px 80px" }}>
      <div style={{ fontSize: 104, fontWeight: 700, color: "#f0f0f5", textAlign: "center", marginBottom: 40 }}>Title Variants</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, flex: 1 }}>
        {variants.map((v, i) => {
          const s = staggerReveal(frame, fps, i, 25, 15);
          return (
            <div key={v.name} style={{ opacity: s.opacity, transform: `translateY(${s.translateY}px)`, background: "rgba(255,255,255,0.03)", borderRadius: 20, padding: 32, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 650, color: "#6366f1", marginBottom: 16 }}>{v.name}</div>
              <KineticTitleSystem variant={v.variant} line1={v.line1} line2={v.line2} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
