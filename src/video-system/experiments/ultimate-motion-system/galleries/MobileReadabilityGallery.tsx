import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { SceneHeader } from "../components/SceneHeader";
import { staggerReveal, fadeSlide } from "../labMotionPrimitives";
import { typeScale } from "../tokens/typographyTokens";

/** Mobile Readability Gallery — 手机端可读性展示 */
export const MobileReadabilityGallery: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mobileW = 390;
  const canvasW = 1920;
  const scale = mobileW / canvasW;

  const fontSamples = [
    { token: "displayXL", px: typeScale.displayXL.size },
    { token: "headingL", px: typeScale.headingL.size },
    { token: "bodyL", px: typeScale.bodyL.size },
    { token: "bodyM", px: typeScale.bodyM.size },
    { token: "captionL", px: typeScale.captionL.size },
    { token: "label", px: typeScale.label.size },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "60px 80px" }}>
      <SceneHeader title="Mobile Readability" subtitle="手机端字号投影" />
      <div style={{ display: "flex", gap: 40, flex: 1 }}>
        {/* Full canvas preview */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 32, fontWeight: 650, color: "#6366f1", marginBottom: 16 }}>16:9 完整画面 (1920×1080)</div>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 24, aspectRatio: "16/9" }}>
            {fontSamples.map((f, i) => {
              const s = staggerReveal(frame, fps, i, 10, 12);
              return <div key={f.token} style={{ opacity: s.opacity, fontSize: f.px, fontWeight: 500, color: "#f0f0f5", lineHeight: 1.3, marginBottom: 4 }}>{f.token}: {f.px}px</div>;
            })}
          </div>
        </div>
        {/* Mobile scaled preview */}
        <div style={{ width: mobileW + 40 }}>
          <div style={{ fontSize: 32, fontWeight: 650, color: "#34d399", marginBottom: 16 }}>手机端投影 ({mobileW}px)</div>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, width: mobileW }}>
            {fontSamples.map((f, i) => {
              const s = staggerReveal(frame, fps, i, 10, 12);
              const mobilePx = Math.round(f.px * scale);
              const readable = mobilePx >= 10;
              return (
                <div key={f.token} style={{ opacity: s.opacity, marginBottom: 4 }}>
                  <span style={{ fontSize: Math.max(10, mobilePx), fontWeight: 500, color: readable ? "#f0f0f5" : "#f87171", lineHeight: 1.3 }}>{f.token}: {mobilePx}px</span>
                  {!readable && <span style={{ fontSize: 10, color: "#f87171", marginLeft: 8 }}>⚠ 不可读</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Safe areas */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 28, fontWeight: 650, color: "#a0a0b8" }}>安全区：顶部 80px / 底部 100px（字幕）/ 左右 60px / 右上品牌 200×60px</div>
      </div>
    </div>
  );
};
