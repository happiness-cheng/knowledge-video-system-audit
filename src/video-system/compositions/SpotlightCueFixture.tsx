/**
 * SpotlightCueFixture
 *
 * 用于验证 cue 驱动的白底 spotlight 多信号高亮。
 */

import React from "react";
import { SceneRenderer } from "../scenes/SceneRenderer";
import type { TwoColumnSceneData } from "../scenes/TwoColumnScene";
import { getTheme } from "../themes";

export const SPOTLIGHT_CUE_FIXTURE_FRAMES = 220;

const scene: TwoColumnSceneData = {
  id: "S02",
  type: "two-column",
  visualRole: "conflict",
  title: "说到哪里，就看哪里",
  leftTitle: "直接问",
  leftItems: ["帮我解释一下", "背景缺失", "回答很标准"],
  rightTitle: "补上下文",
  rightItems: ["我现在是新手", "目标是能照做", "限制条件先说清"],
  keywords: ["spotlight", "cue", "白底多信号"],
  animation: "progressive-reveal",
};

export const SpotlightCueFixture: React.FC = () => {
  const theme = getTheme("xhs-white-editorial");

  return (
    <SceneRenderer
      scene={scene}
      theme={theme}
      totalFrames={SPOTLIGHT_CUE_FIXTURE_FRAMES}
      current={1}
      total={1}
      sceneStartFrame={0}
      layout="landscape"
      presentationMode="default"
      brand={{
        watermarkText: "世间一点尘",
        handle: "shijianyidianchen",
        logoAssetId: null,
      }}
      showProgress
    />
  );
};
