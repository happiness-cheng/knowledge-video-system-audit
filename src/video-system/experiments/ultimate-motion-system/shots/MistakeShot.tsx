import React from "react";
import { useCurrentFrame } from "remotion";
import { CueActiveCard } from "../components/CueActiveCard";
import { SceneHeader } from "../components/SceneHeader";
import { getLabSceneCues, DECAY_FRAMES } from "../labDirectorCues";
import { resolveActiveTarget } from "../utils/resolveActiveTarget";
import type { LabScene } from "../labContent";

export const MistakeShot: React.FC<{ scene: LabScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const cues = getLabSceneCues("S02");
  const { targetOpacity } = cues ? resolveActiveTarget(frame, cues.cues, DECAY_FRAMES, "strict-switch") : { targetOpacity: () => 1 };
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "56px 120px" }}>
      <SceneHeader title={scene.title as string} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <CueActiveCard title={(scene as any).leftTitle} items={(scene as any).leftItems} accent="#f87171" activeOpacity={targetOpacity("left")} delay={8} />
        <CueActiveCard title={(scene as any).rightTitle} items={(scene as any).rightItems} accent="#a0a0b8" activeOpacity={targetOpacity("right")} delay={16} />
      </div>
    </div>
  );
};
