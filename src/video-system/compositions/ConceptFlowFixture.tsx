/**
 * ConceptFlowFixture
 *
 * 用于验证“散落知识 -> 汇聚进手册 -> 稳定输出”的概念流动。
 */

import React from "react";
import { SceneRenderer } from "../scenes/SceneRenderer";
import type { FlowDiagramSceneData } from "../scenes/FlowDiagramScene";
import { getTheme } from "../themes";

export const CONCEPT_FLOW_FIXTURE_FRAMES = 150;

const scene: FlowDiagramSceneData = {
  type: "flow-diagram",
  title: "沉淀成手册",
  nodes: ["项目背景", "开发规范", "禁改区域", "验证方式"],
  semanticPattern: "fragment-to-manual",
  fragmentLabels: ["项目背景", "开发规范", "禁改区域", "验证方式"],
  manualTitle: "CLAUDE.md",
  manualSubtitle: "项目员工手册",
  outputLabels: ["默认共识", "少绕路", "可交接"],
  animation: "fragment-to-manual",
};

export const ConceptFlowFixture: React.FC = () => {
  const theme = getTheme("xhs-white-editorial");

  return (
    <SceneRenderer
      scene={scene}
      theme={theme}
      totalFrames={CONCEPT_FLOW_FIXTURE_FRAMES}
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
