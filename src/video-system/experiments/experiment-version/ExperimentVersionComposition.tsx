import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { ExperimentBackground } from "./components/ExperimentBackground";
import { ExperimentSceneRenderer } from "./ExperimentSceneRenderer";
import {
  experimentContent,
  getSceneFrames,
  TRANSITION_FRAMES,
  getTotalFrames,
} from "./experimentContent";

/**
 * ExperimentVersionVideo — 试验版 Composition
 *
 * 独立于正式 KnowledgeVideo。
 * 使用自有 content 数据、director cues、motion tokens。
 * 不读取 videoSpec.json / audioTiming.json / subtitles.json。
 */
export const ExperimentVersionComposition: React.FC = () => {
  const transitionTiming = linearTiming({
    durationInFrames: TRANSITION_FRAMES,
  });
  const transitionPresentation = fade();

  return (
    <AbsoluteFill>
      {/* 动态背景：贯穿全程 */}
      <ExperimentBackground showGrid={true} />

      {/* 8 个 scene，按时间顺序排列 */}
      <TransitionSeries>
        {experimentContent.scenes.map((scene, i) => {
          const sceneFrames = getSceneFrames(scene.id);
          const items: React.ReactNode[] = [
            <TransitionSeries.Sequence
              key={scene.id}
              durationInFrames={sceneFrames}
            >
              <ExperimentSceneRenderer
                scene={scene}
                totalFrames={sceneFrames}
              />
            </TransitionSeries.Sequence>,
          ];

          // 最后一个 scene 不加转场
          if (i < experimentContent.scenes.length - 1) {
            items.push(
              <TransitionSeries.Transition
                key={`t-${scene.id}`}
                timing={transitionTiming}
                presentation={transitionPresentation}
              />,
            );
          }

          return items;
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

/** 总帧数（供 Root.tsx 使用） */
export const EXPERIMENT_VERSION_FRAMES = getTotalFrames();
