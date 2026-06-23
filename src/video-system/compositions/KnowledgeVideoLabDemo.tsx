/**
 * KnowledgeVideoLabDemo — 知识实验台 P0 示例
 *
 * 5-scene demo，验证"知识实验台"呈现法：
 * 痛点放大页 → 错误现场页 → 对照实验页 → 阶段钉子页 → 方法模板页
 *
 * 使用独立的 videoSpec-lab-demo.json，不依赖音频。
 */

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { getTheme } from "../themes";
import { SceneRenderer, type SceneData } from "../scenes/SceneRenderer";
import type { VideoTheme } from "../themes/types";

import videoSpec from "../data/videoSpec-lab-demo.json";

interface VideoSpecMeta {
  title: string;
  fps: number;
  theme: string;
  [key: string]: unknown;
}

interface VideoSpecScene {
  id: string;
  type: string;
  durationEstimate?: number;
  visualRole?: string;
  [key: string]: unknown;
}

const spec = videoSpec as unknown as {
  meta: VideoSpecMeta;
  scenes: VideoSpecScene[];
};

// 固定每 scene 时长（无音频，用 durationEstimate）
const FPS = 30;
const TRANSITION_FRAMES = 15;

const sceneFrames = spec.scenes.map((s) => ({
  id: s.id,
  durationFrames: Math.round((s.durationEstimate ?? 10) * FPS),
}));

// 总帧数扣除过渡重叠帧
const TOTAL_FRAMES =
  sceneFrames.reduce((sum, s) => sum + s.durationFrames, 0) -
  (spec.scenes.length - 1) * TRANSITION_FRAMES;

export const KNOWLEDGE_VIDEO_LAB_DEMO_FRAMES = TOTAL_FRAMES;

export const KnowledgeVideoLabDemo: React.FC = () => {
  const baseTheme = getTheme(spec.meta.theme);
  // 注入 knowledge-lab 呈现模式
  const theme: VideoTheme = { ...baseTheme, presentationMode: "knowledge-lab" };

  return (
    <AbsoluteFill style={{ background: theme.background }}>
      <TransitionSeries>
        {spec.scenes.flatMap((s, i) => {
          const scene = s as unknown as SceneData;
          const sf = sceneFrames[i];

          const items: React.ReactNode[] = [
            <TransitionSeries.Sequence
              key={s.id}
              durationInFrames={sf.durationFrames}
              premountFor={30}
            >
              <SceneRenderer
                scene={scene}
                theme={theme}
                totalFrames={sf.durationFrames}
                current={i + 1}
                total={spec.scenes.length}
                sceneStartFrame={0}
                presentationMode="knowledge-lab"
              />
            </TransitionSeries.Sequence>,
          ];

          if (i < spec.scenes.length - 1) {
            items.push(
              <TransitionSeries.Transition
                key={`t-${s.id}`}
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />,
            );
          }

          return items;
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
