import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { SceneHeader } from "../components/SceneHeader";
import { fadeSlide, cardLift } from "../labMotionPrimitives";
import { getLabSceneCues, DECAY_FRAMES } from "../labDirectorCues";
import { resolveActiveTarget } from "../utils/resolveActiveTarget";
import type { LabScene } from "../labContent";

const accents = ["#6366f1", "#34d399", "#fbbf24"];

export const TransferShot: React.FC<{ scene: LabScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cues = getLabSceneCues("S06");
  const { targetOpacity } = cues ? resolveActiveTarget(frame, cues.cues, DECAY_FRAMES, "strict-switch") : { targetOpacity: (t: string) => t === "column-0" ? 1 : 0.4 };
  const s = scene as any;
  const cols = s.columns ?? [];
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "56px 120px" }}>
      <SceneHeader title={s.title} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 28 }}>
        {cols.map((col: any, i: number) => {
          const op = targetOpacity(`column-${i}`);
          const anim = fadeSlide(frame, fps, 10 + i * 12);
          const scale = cardLift(op);
          const bOp = interpolate(op, [0.4, 1], [0.06, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ opacity: anim.opacity * op, transform: `translateY(${anim.translateY}px) scale(${scale})`, background: "rgba(255,255,255,0.04)", border: `1.5px solid rgba(255,255,255,${bOp})`, borderRadius: 20, padding: 36, display: "flex", flexDirection: "column", gap: 16, boxShadow: op > 0.8 ? `0 0 24px ${accents[i]}15` : "none" }}>
              <div style={{ fontSize: 88, fontWeight: 700, color: accents[i], opacity: op > 0.8 ? 1 : 0.7 }}>{col.title}</div>
              <div style={{ fontSize: 68, fontWeight: 500, color: op > 0.8 ? "#f0f0f5" : "#a0a0b8", lineHeight: 1.4 }}>{col.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
