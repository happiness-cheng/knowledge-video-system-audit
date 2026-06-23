import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceCard } from "../components/EvidenceCard";
import { labContent } from "../labContent";

/**
 * S03 LabEvidenceScene — 对照实验页
 * - 证据卡/模拟截图必须是主体
 * - 左右证据按顺序进入
 * - 高亮框用 frame-driven reveal
 * - caption 不能比证据卡更抢眼
 * - 用户不读小字也能懂差异
 */
export const LabEvidenceScene: React.FC = () => {
  const scene = labContent.scenes[2]; // S03

  return (
    <AbsoluteFill>
      <EvidenceCard
        title={scene.title!}
        left={{
          title: scene.leftTitle!,
          items: scene.leftItems!,
          highlight: { top: 30, left: 20, width: 60, height: 25 },
          mockContent: "泛泛的解释，缺乏具体场景...",
        }}
        right={{
          title: scene.rightTitle!,
          items: scene.rightItems!,
          highlight: { top: 25, left: 15, width: 70, height: 30 },
          mockContent: "具体方案，包含场景和限制...",
        }}
        conclusion={scene.conclusion}
        delay={0}
      />
    </AbsoluteFill>
  );
};
