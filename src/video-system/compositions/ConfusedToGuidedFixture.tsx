/**
 * ConfusedToGuidedFixture
 *
 * 用于验证“困惑入口 -> 明确路线 -> 稳定结果”的 semantic shot。
 */

import React from "react";
import { SceneRenderer } from "../scenes/SceneRenderer";
import type { TwoColumnSceneData } from "../scenes/TwoColumnScene";
import { getTheme } from "../themes";

export const CONFUSED_TO_GUIDED_FIXTURE_FRAMES = 156;

const scene: TwoColumnSceneData = {
  id: "S_CONFUSED_TO_GUIDED_FIXTURE",
  type: "two-column",
  visualRole: "explain",
  semanticPattern: "confused-to-guided",
  title: "不是让你自己猜入口",
  leftTitle: "困惑入口",
  leftItems: ["问 AI", "翻代码", "看报错", "找配置", "查文档"],
  rightTitle: "知道先看哪里",
  rightItems: ["问题", "职责目录", "CLAUDE.md", "验证命令"],
  resultSubtitle: "不是自己摸索，是路径被写清楚了",
  animation: "progressive-reveal",
};

export const ConfusedToGuidedFixture: React.FC = () => {
  const theme = getTheme("xhs-white-editorial");

  return (
    <SceneRenderer
      scene={scene}
      theme={theme}
      totalFrames={CONFUSED_TO_GUIDED_FIXTURE_FRAMES}
      current={1}
      total={1}
      presentationMode="knowledge-lab"
    />
  );
};
