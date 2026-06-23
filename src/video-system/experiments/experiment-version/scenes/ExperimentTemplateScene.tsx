import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { TemplateShot } from "../components/TemplateShot";
import {
  getSceneCues,
  resolveActiveTarget,
  DECAY_FRAMES,
} from "../experimentDirectorCues";
import type { ExperimentSceneData } from "../experimentContent";

/**
 * S07 Template Shot
 *
 * 可截图保存模板。
 * 四行逐步 active，使用 progressive-retain。
 * 最后阶段全体稳定，适合截图保存。
 */
export const ExperimentTemplateScene: React.FC<{
  scene: ExperimentSceneData;
  totalFrames: number;
}> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = scene.templateItems ?? [];

  // Director cue 驱动 active（progressive-retain 模式）
  const sceneCues = getSceneCues("S07");
  const { targetOpacity } = sceneCues
    ? resolveActiveTarget(
        frame,
        sceneCues.cues,
        DECAY_FRAMES,
        "progressive-retain",
      )
    : { targetOpacity: () => 1 };

  // 计算每项的 opacity
  const itemOpacities = items.map((_, i) => targetOpacity(`item-${i}`));

  return (
    <TemplateShot
      title={scene.title ?? ""}
      items={items}
      itemOpacities={itemOpacities}
    />
  );
};
