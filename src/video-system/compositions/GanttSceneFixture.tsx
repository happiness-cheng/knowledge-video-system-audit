/**
 * GanttSceneFixture
 *
 * 用于验证 gantt scene 的并行任务、阻塞点和人工确认点可视化效果。
 */

import React from "react";
import { SceneRenderer } from "../scenes/SceneRenderer";
import type { GanttSceneData } from "../scenes/GanttScene";
import { getTheme } from "../themes";

export const GANTT_SCENE_FIXTURE_FRAMES = 270;

const scene: GanttSceneData = {
  id: "S_GANTT_FIXTURE",
  type: "gantt",
  visualRole: "method",
  title: "一次交付，不是一步完成",
  subtitle: "策划、素材、配音、预览、审片各有先后和依赖",
  animation: "highlight-current",
  lanes: [
    {
      label: "内容策划",
      tasks: [
        {
          label: "想清目标",
          start: 0,
          end: 18,
          status: "done",
          note: "先确认视频到底要让观众看懂什么。",
        },
        {
          label: "写规格",
          start: 20,
          end: 38,
          status: "done",
          note: "把内容目标翻译成画面规格。",
        },
      ],
    },
    {
      label: "画面执行",
      tasks: [
        {
          label: "组件表达",
          start: 32,
          end: 62,
          status: "active",
          note: "Remotion 负责能动起来的结构画面。",
        },
        {
          label: "补图",
          start: 48,
          end: 70,
          status: "waiting",
          note: "复杂隐喻可用生成图补足。",
        },
      ],
    },
    {
      label: "音频字幕",
      tasks: [
        {
          label: "TTS",
          start: 58,
          end: 78,
          status: "waiting",
          note: "口播定稿后再生成音频和字幕。",
        },
      ],
    },
    {
      label: "人工审片",
      tasks: [
        {
          label: "Studio 预览",
          start: 68,
          end: 84,
          status: "blocked",
          note: "必须先看预览，不能直接导出成片。",
        },
        {
          label: "确认修改",
          start: 86,
          end: 100,
          status: "active",
          note: "人工确认后才进入下一阶段。",
        },
      ],
    },
  ],
  markers: [
    {
      at: 72,
      label: "预览门禁",
      tone: "warning",
    },
    {
      at: 90,
      label: "用户确认",
      tone: "success",
    },
  ],
  focusSequence: [0, 2, 3, 5, 6],
  keywords: ["并行", "阻塞", "确认"],
};

export const GanttSceneFixture: React.FC = () => {
  const theme = getTheme("xhs-white-editorial");

  return (
    <SceneRenderer
      scene={scene}
      theme={theme}
      totalFrames={GANTT_SCENE_FIXTURE_FRAMES}
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
