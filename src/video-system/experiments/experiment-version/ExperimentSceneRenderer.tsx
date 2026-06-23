import React from "react";
import type { ExperimentSceneData } from "./experimentContent";
import { ExperimentHookScene } from "./scenes/ExperimentHookScene";
import { ExperimentMistakeScene } from "./scenes/ExperimentMistakeScene";
import { ExperimentSetupScene } from "./scenes/ExperimentSetupScene";
import { ExperimentEvidenceScene } from "./scenes/ExperimentEvidenceScene";
import { ExperimentInsightScene } from "./scenes/ExperimentInsightScene";
import { ExperimentTransferScene } from "./scenes/ExperimentTransferScene";
import { ExperimentTemplateScene } from "./scenes/ExperimentTemplateScene";
import { ExperimentCtaScene } from "./scenes/ExperimentCtaScene";

interface ExperimentSceneRendererProps {
  scene: ExperimentSceneData;
  totalFrames: number;
}

/**
 * 试验版场景分发器
 *
 * 根据 scene.shotType 分发到对应场景组件。
 */
export const ExperimentSceneRenderer: React.FC<
  ExperimentSceneRendererProps
> = ({ scene, totalFrames }) => {
  switch (scene.shotType) {
    case "hook":
      return (
        <ExperimentHookScene scene={scene} totalFrames={totalFrames} />
      );
    case "mistake":
      return (
        <ExperimentMistakeScene scene={scene} totalFrames={totalFrames} />
      );
    case "setup":
      return (
        <ExperimentSetupScene scene={scene} totalFrames={totalFrames} />
      );
    case "evidence":
      return (
        <ExperimentEvidenceScene scene={scene} totalFrames={totalFrames} />
      );
    case "insight":
      return (
        <ExperimentInsightScene scene={scene} totalFrames={totalFrames} />
      );
    case "transfer":
      return (
        <ExperimentTransferScene scene={scene} totalFrames={totalFrames} />
      );
    case "template":
      return (
        <ExperimentTemplateScene scene={scene} totalFrames={totalFrames} />
      );
    case "cta":
      return (
        <ExperimentCtaScene scene={scene} totalFrames={totalFrames} />
      );
    default:
      return (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0c0c14",
            color: "#f87171",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          未知 shotType: {scene.shotType}
        </div>
      );
  }
};
