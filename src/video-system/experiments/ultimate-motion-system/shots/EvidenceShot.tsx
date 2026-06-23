import React from "react";
import { useCurrentFrame } from "remotion";
import { SceneHeader } from "../components/SceneHeader";
import { EvidencePanel } from "../components/EvidencePanel";
import { getLabSceneCues, DECAY_FRAMES } from "../labDirectorCues";
import { resolveActiveTarget } from "../utils/resolveActiveTarget";
import type { LabScene } from "../labContent";

export const EvidenceShot: React.FC<{ scene: LabScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const cues = getLabSceneCues("S04");
  const { targetOpacity } = cues ? resolveActiveTarget(frame, cues.cues, DECAY_FRAMES, "strict-switch") : { targetOpacity: () => 1 };
  const s = scene as any;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "56px 120px" }}>
      <SceneHeader title={s.title} />
      {s.conclusion && <div style={{ fontSize: 88, fontWeight: 900, color: "#6366f1", marginBottom: 28, textAlign: "center" }}>{s.conclusion}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <EvidencePanel label={s.leftLabel} conclusion={s.leftCaption} activeOpacity={targetOpacity("left-evidence")} accent="#f87171" screenshotSrc="assets/processed/chatgpt-before-evidence-focus.png" delay={10} />
        <EvidencePanel label={s.rightLabel} conclusion={s.rightCaption} activeOpacity={targetOpacity("right-evidence")} accent="#34d399" screenshotSrc="assets/processed/chatgpt-after-evidence-focus.png" delay={18} />
      </div>
    </div>
  );
};
