import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { LabCue } from "../labDirectorCues";

interface TimelineCueBarProps {
  cues: LabCue[];
  totalFrames: number;
  style?: React.CSSProperties;
}

/** TimelineCueBar — cue 时间轴可视化 */
export const TimelineCueBar: React.FC<TimelineCueBarProps> = ({
  cues, totalFrames, style,
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: "100%", height: 60, position: "relative", background: "rgba(255,255,255,0.04)", borderRadius: 8, overflow: "hidden", ...style }}>
      {cues.map((cue, i) => {
        const left = (cue.startFrameEstimate / totalFrames) * 100;
        const width = (cue.holdFrames / totalFrames) * 100;
        const isActive = frame >= cue.startFrameEstimate - cue.leadFrames && frame < cue.startFrameEstimate + cue.holdFrames;
        return (
          <div key={cue.cueId} style={{ position: "absolute", left: `${left}%`, top: 8, width: `${width}%`, height: 44, borderRadius: 6, background: isActive ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.1)", border: isActive ? "1.5px solid rgba(99,102,241,0.6)" : "1px solid rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", transition: "none" }}>
            <span style={{ fontSize: 28, fontWeight: 600, color: isActive ? "#f0f0f5" : "#6a6a80", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "0 8px" }}>{cue.target}</span>
          </div>
        );
      })}
      {/* 播放头 */}
      <div style={{ position: "absolute", left: `${(frame / totalFrames) * 100}%`, top: 0, width: 2, height: "100%", background: "#6366f1", zIndex: 10 }} />
    </div>
  );
};
