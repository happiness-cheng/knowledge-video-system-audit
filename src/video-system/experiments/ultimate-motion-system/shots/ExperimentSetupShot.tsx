import React from "react";
import { SceneHeader } from "../components/SceneHeader";
import { PromptBuildCard } from "../components/PromptBuildCard";
import type { LabScene } from "../labContent";

export const ExperimentSetupShot: React.FC<{ scene: LabScene }> = ({ scene }) => {
  const steps = (scene as any).steps as string[] ?? [];
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "80px 120px" }}>
      <SceneHeader title={scene.title as string} subtitle={(scene as any).subtitle} />
      <PromptBuildCard steps={steps} activeStep={steps.length - 1} />
    </div>
  );
};
