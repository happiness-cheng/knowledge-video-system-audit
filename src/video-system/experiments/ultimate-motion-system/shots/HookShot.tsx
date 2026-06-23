import React from "react";
import { Img, staticFile } from "remotion";
import { KineticTitleSystem } from "../components/KineticTitleSystem";
import type { LabScene } from "../labContent";

export const HookShot: React.FC<{ scene: LabScene }> = ({ scene }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "80px 120px" }}>
    {/* 角色图片 */}
    <Img
      src={staticFile("assets/processed/xiaochen-thinking.png")}
      style={{
        width: 160,
        height: 160,
        borderRadius: "50%",
        objectFit: "cover",
        marginBottom: 24,
        border: "3px solid rgba(99,102,241,0.3)",
        boxShadow: "0 0 24px rgba(99,102,241,0.15)",
      }}
    />
    <KineticTitleSystem variant="split" line1={scene.title as string} line2={scene.subtitle as string} />
  </div>
);
