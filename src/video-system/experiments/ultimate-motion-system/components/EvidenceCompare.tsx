import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fadeSlide } from "../labMotionPrimitives";
import { EvidencePanel } from "./EvidencePanel";

interface EvidenceCompareProps {
  leftLabel: string;
  leftCaption: string;
  rightLabel: string;
  rightCaption: string;
  conclusion: string;
  leftActive: number;
  rightActive: number;
}

/** EvidenceCompare — 左右证据对比 */
export const EvidenceCompare: React.FC<EvidenceCompareProps> = ({
  leftLabel, leftCaption, rightLabel, rightCaption, conclusion,
  leftActive, rightActive,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleAnim = fadeSlide(frame, fps, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "56px 120px" }}>
      {conclusion && (
        <div style={{ fontSize: 88, fontWeight: 900, color: "#6366f1", marginBottom: 28, textAlign: "center", opacity: titleAnim.opacity, transform: `translateY(${titleAnim.translateY}px)` }}>{conclusion}</div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <EvidencePanel label={leftLabel} conclusion={leftCaption} activeOpacity={leftActive} accent="#f87171" delay={10} />
        <EvidencePanel label={rightLabel} conclusion={rightCaption} activeOpacity={rightActive} accent="#34d399" delay={18} />
      </div>
    </div>
  );
};
