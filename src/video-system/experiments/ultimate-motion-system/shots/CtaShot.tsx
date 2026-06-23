import React from "react";
import { Img, staticFile } from "remotion";
import { SceneHeader } from "../components/SceneHeader";
import { MotionButton } from "../components/MotionButton";
import type { LabScene } from "../labContent";

export const CtaShot: React.FC<{ scene: LabScene }> = ({ scene }) => {
  const s = scene as any;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "80px 120px", gap: 24 }}>
      <Img
        src={staticFile("assets/avatar.png")}
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          objectFit: "cover",
          border: "3px solid rgba(99,102,241,0.3)",
          boxShadow: "0 0 32px rgba(99,102,241,0.2)",
        }}
      />
      <SceneHeader title={s.title} subtitle={s.subtitle} />
      {s.actionText && <div style={{ marginTop: 32 }}><MotionButton text={s.actionText} /></div>}
    </div>
  );
};
