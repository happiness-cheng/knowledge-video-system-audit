import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SceneHeader } from "../components/SceneHeader";
import { TemplatePanel } from "../components/TemplatePanel";
import { PromptBuildCard } from "../components/PromptBuildCard";
import { staggerReveal } from "../labMotionPrimitives";

/** Template Variants Gallery — 3 种模板页变体 */
export const TemplateGallery: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "60px 80px" }}>
      <SceneHeader title="Template Variants" subtitle="3 种模板页变体" />
      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        {/* Variant 1: Progressive Checklist */}
        <div>
          <div style={{ fontSize: 32, fontWeight: 650, color: "#6366f1", marginBottom: 12 }}>1. Progressive Checklist</div>
          <div style={{ display: "flex", gap: 16 }}>
            {["步骤一", "步骤二", "步骤三", "步骤四"].map((item, i) => {
              const s = staggerReveal(frame, fps, i, 15, 15);
              return <div key={i} style={{ opacity: s.opacity, transform: `translateY(${s.translateY}px)`, flex: 1, padding: 16, borderRadius: 12, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", fontSize: 36, fontWeight: 500, color: "#f0f0f5", textAlign: "center" as const }}>{item}</div>;
            })}
          </div>
        </div>
        {/* Variant 2: Fill-in-the-blank */}
        <div>
          <div style={{ fontSize: 32, fontWeight: 650, color: "#34d399", marginBottom: 12 }}>2. Fill-in-the-blank Template</div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
            {["我的情况是：____", "我想要：____", "限制条件：____"].map((line, i) => {
              const s = staggerReveal(frame, fps, i, 18, 15);
              return <div key={i} style={{ opacity: s.opacity, transform: `translateY(${s.translateY}px)`, fontSize: 40, color: "#a0a0b8", padding: "8px 0" }}>{line}</div>;
            })}
          </div>
        </div>
        {/* Variant 3: Prompt Card Builder */}
        <div>
          <div style={{ fontSize: 32, fontWeight: 650, color: "#fbbf24", marginBottom: 12 }}>3. Prompt Card Builder</div>
          <PromptBuildCard steps={["说明背景", "说明目标", "加限制条件", "要求方案"]} activeStep={2} />
        </div>
      </div>
    </div>
  );
};
