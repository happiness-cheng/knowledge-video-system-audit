/**
 * PressureBuildFixture
 *
 * 用于验证 pressure-build 动态 Hook，不参与正式视频数据流。
 */

import React from "react";
import { SceneRenderer } from "../scenes/SceneRenderer";
import type { CoverSceneData } from "../scenes/CoverScene";
import { getTheme } from "../themes";

export const PRESSURE_BUILD_FIXTURE_FRAMES = 150;

const scene: CoverSceneData = {
  id: "S_PRESSURE_BUILD_FIXTURE",
  type: "cover",
  visualRole: "hook",
  semanticPattern: "pressure-build",
  title: "不是失忆",
  subtitle: "是你没给它办入职",
  animation: "slide-up",
  pressureItems: [
    { text: "项目背景又要解释", tone: "neutral" },
    { text: "目录职责又要说明", tone: "accent" },
    { text: "测试命令又要提醒", tone: "neutral" },
    { text: "敏感字段不能乱动", tone: "warning" },
    { text: "交付前怎么验证", tone: "accent" },
    { text: "为什么又要重讲", tone: "warning" },
  ],
};

export const PressureBuildFixture: React.FC = () => {
  const theme = getTheme("xhs-white-editorial");

  return (
    <SceneRenderer
      scene={scene}
      theme={theme}
      totalFrames={PRESSURE_BUILD_FIXTURE_FRAMES}
      current={1}
      total={1}
      sceneStartFrame={0}
      layout="landscape"
      presentationMode="knowledge-lab"
      brand={{
        watermarkText: "世间一点尘",
        handle: "shijianyidianchen",
        logoAssetId: null,
      }}
      showProgress
    />
  );
};
