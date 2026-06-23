import React from "react";
import { AbsoluteFill } from "remotion";
import { TemplateCard } from "../components/TemplateCard";
import { labContent } from "../labContent";

/**
 * S05 LabTemplateScene — 方法模板页
 * - 像工具卡，不像 bullet list
 * - 四步逐个点亮
 * - 当前步骤突出，其他保留上下文
 * - 有截图保存价值
 */
export const LabTemplateScene: React.FC = () => {
  const scene = labContent.scenes[4]; // S05

  return (
    <AbsoluteFill>
      <TemplateCard title={scene.title!} steps={scene.steps!} delay={0} />
    </AbsoluteFill>
  );
};
