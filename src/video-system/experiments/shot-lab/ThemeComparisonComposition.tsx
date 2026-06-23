import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PromptCompletionExplainerWhite } from "./PromptCompletionExplainerWhite";
import { PromptCompletionDarkExplainerLab } from "./themes/PromptCompletionDarkExplainerLab";
import { PromptCompletionLightExplainerLab } from "./themes/PromptCompletionLightExplainerLab";
import { PromptCompletionKnowledgeBlueprint } from "./themes/PromptCompletionKnowledgeBlueprint";

/**
 * ThemeComparisonComposition — 四主题对照
 *
 * 在一个 Composition 中展示四个主题版本的同一帧
 * 用于 Studio 对照审查
 */

const FRAME_PER_SECTION = 630; // 每个主题 21s

export const TOTAL_FRAMES = FRAME_PER_SECTION * 4;

export const ThemeComparisonComposition: React.FC = () => {
  const frame = useCurrentFrame();

  // 确定当前显示哪个主题
  const sectionIndex = Math.floor(frame / FRAME_PER_SECTION);
  const localFrame = frame % FRAME_PER_SECTION;

  // 主题标签
  const labels = [
    "1/4 · white-editorial (白底杂志风)",
    "2/4 · dark-explainer-lab (暗色解释实验室)",
    "3/4 · light-explainer-lab (浅色实验室风)",
    "4/4 · knowledge-blueprint (知识架构蓝图)",
  ];

  return (
    <AbsoluteFill>
      {/* 当前主题 */}
      {sectionIndex === 0 && <PromptCompletionExplainerWhite />}
      {sectionIndex === 1 && <PromptCompletionDarkExplainerLab />}
      {sectionIndex === 2 && <PromptCompletionLightExplainerLab />}
      {sectionIndex === 3 && <PromptCompletionKnowledgeBlueprint />}

      {/* 主题标签 */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 100,
        }}
      >
        <div
          style={{
            padding: "12px 32px",
            background: "rgba(0,0,0,0.7)",
            borderRadius: 8,
            fontSize: 18,
            color: "#FFFFFF",
            fontFamily: "monospace",
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          {labels[sectionIndex] || labels[0]}
        </div>
      </div>

      {/* 帧数指示 */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 100,
        }}
      >
        <div
          style={{
            padding: "8px 24px",
            background: "rgba(0,0,0,0.5)",
            borderRadius: 6,
            fontSize: 14,
            color: "rgba(255,255,255,0.7)",
            fontFamily: "monospace",
          }}
        >
          frame {localFrame} / {FRAME_PER_SECTION} · total {frame} / {TOTAL_FRAMES}
        </div>
      </div>
    </AbsoluteFill>
  );
};
