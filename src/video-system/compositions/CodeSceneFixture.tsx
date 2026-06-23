/**
 * CodeSceneFixture
 *
 * 用于验证 code scene 的行高亮效果，不参与正式视频数据流。
 */

import React from "react";
import { SceneRenderer } from "../scenes/SceneRenderer";
import type { CodeSceneData } from "../scenes/CodeScene";
import { getTheme } from "../themes";

export const CODE_SCENE_FIXTURE_FRAMES = 240;

const scene: CodeSceneData = {
  id: "S_CODE_FIXTURE",
  type: "code",
  visualRole: "method",
  title: "CLAUDE.md 四层结构",
  subtitle: "说到哪一层，哪一行亮起来",
  filename: "CLAUDE.md",
  language: "markdown",
  animation: "highlight-current",
  showActiveLineInExplanation: false,
  lines: [
    {
      text: "项目背景：这是一个 Remotion 知识视频生成系统",
      annotation: "官方指引：用 CLAUDE.md 提供项目持久上下文",
    },
    {
      text: "开发规范：动画只用 frame / interpolate，不用 CSS transition",
      annotation: "官方指引：写入代码风格和项目约定",
    },
    {
      text: "禁改区域：不要改 .env，不要代填用户确认字段",
      annotation: "官方指引：把项目约束写成明确指令",
    },
    {
      text: "常用命令：npm run validate:all；npx remotion studio src/index.ts",
      annotation: "官方指引：写入常用命令和工作流",
    },
  ],
  focusSequence: [0, 1, 2, 3],
};

export const CodeSceneFixture: React.FC = () => {
  const theme = getTheme("xhs-white-editorial");

  return (
    <SceneRenderer
      scene={scene}
      theme={theme}
      totalFrames={CODE_SCENE_FIXTURE_FRAMES}
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
