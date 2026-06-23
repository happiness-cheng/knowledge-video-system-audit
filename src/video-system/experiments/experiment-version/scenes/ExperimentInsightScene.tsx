import React from "react";
import { InsightShot } from "../components/InsightShot";
import type { ExperimentSceneData } from "../experimentContent";

/**
 * S05 Insight Shot
 *
 * 从 S04 收束出来的结论页。
 * 不是普通标题页，要有聚焦感。
 */
export const ExperimentInsightScene: React.FC<{
  scene: ExperimentSceneData;
  totalFrames: number;
}> = ({ scene }) => {
  return (
    <InsightShot
      quote={scene.quote ?? ""}
      subtitle={scene.subtitle}
      label="实验结论"
    />
  );
};
