import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { SceneHeader } from "../components/SceneHeader";
import { EvidencePanel } from "../components/EvidencePanel";
import { fadeSlide, staggerReveal } from "../labMotionPrimitives";

/** Evidence Variants Gallery — 4 种证据页变体 */
export const EvidenceGallery: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const variants = [
    { name: "Side-by-Side", left: "直接问", right: "补背景后", leftSrc: "assets/processed/chatgpt-before-evidence-focus.png", rightSrc: "assets/processed/chatgpt-after-evidence-focus.png" },
    { name: "Before-After", left: "改之前", right: "改之后", leftSrc: "assets/processed/chatgpt-before-crop.png", rightSrc: "assets/processed/chatgpt-after-crop.png" },
    { name: "Evidence + Conclusion", left: "原始回答", right: "改进回答" },
    { name: "Focus Card", left: "核心问题", right: "解决方案" },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "60px 80px" }}>
      <SceneHeader title="Evidence Variants" subtitle="4 种证据页变体" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {variants.map((v, i) => {
          const s = staggerReveal(frame, fps, i, 20, 15);
          return (
            <div key={v.name} style={{ opacity: s.opacity, transform: `translateY(${s.translateY}px)` }}>
              <div style={{ fontSize: 32, fontWeight: 650, color: "#6366f1", marginBottom: 8 }}>{v.name}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <EvidencePanel label={v.left} conclusion="证据 A" activeOpacity={0.8} accent="#f87171" screenshotSrc={(v as any).leftSrc} delay={i * 20 + 10} />
                <EvidencePanel label={v.right} conclusion="证据 B" activeOpacity={0.8} accent="#34d399" screenshotSrc={(v as any).rightSrc} delay={i * 20 + 15} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
