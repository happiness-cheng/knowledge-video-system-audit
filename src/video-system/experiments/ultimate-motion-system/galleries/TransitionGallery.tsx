import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { SceneHeader } from "../components/SceneHeader";
import { staggerReveal } from "../labMotionPrimitives";

/** Transition Gallery — 4 种转场展示 */
export const TransitionGallery: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const transitions = [
    { name: "Hard Cut", desc: "直接切换，无过渡", color: "#f87171" },
    { name: "Fade", desc: "淡入淡出，最安全", color: "#6366f1" },
    { name: "Slide", desc: "滑入滑出，有方向感", color: "#34d399" },
    { name: "Wipe", desc: "擦除过渡，有层次感", color: "#fbbf24" },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "60px 80px" }}>
      <SceneHeader title="Transition Gallery" subtitle="4 种转场方式" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        {transitions.map((t, i) => {
          const s = staggerReveal(frame, fps, i, 20, 15);
          // 模拟转场动画
          const cycle = frame % 120;
          const progress = interpolate(cycle, [0, 30, 90, 120], [0, 1, 1, 0], { extrapolateRight: "clamp" });
          return (
            <div key={t.name} style={{ opacity: s.opacity, transform: `translateY(${s.translateY}px)`, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32, overflow: "hidden" }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: t.color, marginBottom: 8 }}>{t.name}</div>
              <div style={{ fontSize: 28, color: "#a0a0b8", marginBottom: 16 }}>{t.desc}</div>
              {/* 模拟动画 */}
              <div style={{ height: 100, borderRadius: 12, background: `linear-gradient(90deg, ${t.color}22 0%, ${t.color}44 ${progress * 100}%, transparent ${progress * 100}%)`, position: "relative" }}>
                <div style={{ position: "absolute", left: `${progress * 80}%`, top: 20, width: 60, height: 60, borderRadius: 8, background: t.color, opacity: 0.6 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
