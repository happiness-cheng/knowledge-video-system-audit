/**
 * DiffSceneFixture
 *
 * 用于验证 diff scene 的前后变化解释效果，不参与正式视频数据流。
 */

import React from "react";
import { SceneRenderer } from "../scenes/SceneRenderer";
import type { DiffSceneData } from "../scenes/DiffScene";
import { getTheme } from "../themes";

export const DIFF_SCENE_FIXTURE_FRAMES = 240;

const scene: DiffSceneData = {
  id: "S_DIFF_FIXTURE",
  type: "diff",
  visualRole: "method",
  title: "同一个问题，前后写法不一样",
  subtitle: "红色删掉误区，绿色补上方法",
  beforeTitle: "之前：只靠聊天",
  afterTitle: "之后：写进手册",
  animation: "highlight-current",
  changes: [
    {
      kind: "removed",
      text: "每次新会话都重新解释项目背景",
    },
    {
      kind: "removed",
      text: "把规则留在聊天记录里",
    },
    {
      kind: "added",
      text: "把项目背景写进 CLAUDE.md",
    },
    {
      kind: "added",
      text: "把禁改区域写成明确指令",
    },
  ],
  focusSequence: [0, 1, 2, 3],
};

export const DiffSceneFixture: React.FC = () => {
  const theme = getTheme("xhs-white-editorial");

  return (
    <SceneRenderer
      scene={scene}
      theme={theme}
      totalFrames={DIFF_SCENE_FIXTURE_FRAMES}
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
