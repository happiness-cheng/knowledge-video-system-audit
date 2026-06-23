/**
 * TerminalSceneFixture
 *
 * 用于验证 terminal scene 的命令和结果可视化效果，不参与正式视频数据流。
 */

import React from "react";
import { SceneRenderer } from "../scenes/SceneRenderer";
import type { TerminalSceneData } from "../scenes/TerminalScene";
import { getTheme } from "../themes";

export const TERMINAL_SCENE_FIXTURE_FRAMES = 240;

const scene: TerminalSceneData = {
  id: "S_TERMINAL_FIXTURE",
  type: "terminal",
  visualRole: "evidence",
  title: "跑完验证，结果不是靠感觉",
  subtitle: "命令、过程、结果都在画面里",
  command: "npm run validate:all",
  animation: "progressive-reveal",
  lines: [
    {
      kind: "running",
      text: "videoSpec 结构验证...",
    },
    {
      kind: "success",
      text: "videoSpec 结构验证通过",
    },
    {
      kind: "success",
      text: "渲染代码验证通过",
    },
    {
      kind: "warning",
      text: "仍有 1 个审片项需要人工确认",
    },
  ],
  result: {
    status: "warning",
    label: "INSPECT",
    detail: "命令跑通，不等于视觉自动通过",
  },
  focusSequence: [0, 1, 2, 3],
};

export const TerminalSceneFixture: React.FC = () => {
  const theme = getTheme("xhs-white-editorial");

  return (
    <SceneRenderer
      scene={scene}
      theme={theme}
      totalFrames={TERMINAL_SCENE_FIXTURE_FRAMES}
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
