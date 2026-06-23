/**
 * 场景渲染器
 *
 * 根据 scene.type 分发到对应的场景组件。
 * 所有场景组件共享统一的 props 接口。
 */

import React from "react";
import type { VideoTheme, PresentationMode } from "../themes/types";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { SceneChrome } from "../components/SceneChrome";
import { CoverScene, type CoverSceneData } from "./CoverScene";
import { BigQuoteScene, type BigQuoteSceneData } from "./BigQuoteScene";
import {
  TitleSubtitleScene,
  type TitleSubtitleSceneData,
} from "./TitleSubtitleScene";
import { BulletsScene, type BulletsSceneData } from "./BulletsScene";
import { ComparisonScene, type ComparisonSceneData } from "./ComparisonScene";
import {
  DetourVsDirectPathScene,
  type DetourVsDirectPathSceneData,
} from "./DetourVsDirectPathScene";
import {
  ProcessStepsScene,
  type ProcessStepsSceneData,
} from "./ProcessStepsScene";
import {
  FlowDiagramScene,
  type FlowDiagramSceneData,
} from "./FlowDiagramScene";
import {
  FragmentToManualScene,
  type FragmentToManualSceneData,
} from "./FragmentToManualScene";
import { RoadmapScene, type RoadmapSceneData } from "./RoadmapScene";
import { CtaScene, type CtaSceneData } from "./CtaScene";
import { TwoColumnScene, type TwoColumnSceneData } from "./TwoColumnScene";
import {
  ThreeColumnScene,
  type ThreeColumnSceneData,
} from "./ThreeColumnScene";
import { ProsConsScene, type ProsConsSceneData } from "./ProsConsScene";
import {
  TodoChecklistScene,
  type TodoChecklistSceneData,
} from "./TodoChecklistScene";
import {
  StatHighlightScene,
  type StatHighlightSceneData,
} from "./StatHighlightScene";
import { TimelineScene, type TimelineSceneData } from "./TimelineScene";
import { MindmapScene, type MindmapSceneData } from "./MindmapScene";
import {
  SectionDividerScene,
  type SectionDividerSceneData,
} from "./SectionDividerScene";
import { CodeScene, type CodeSceneData } from "./CodeScene";
import { DiffScene, type DiffSceneData } from "./DiffScene";
import {
  TerminalScene,
  type TerminalSceneData,
} from "./TerminalScene";
import {
  ImageHeroScene,
  type ImageHeroSceneData,
} from "./ImageHeroScene";
import { GanttScene, type GanttSceneData } from "./GanttScene";

// ─── 场景数据联合类型 ─────────────────────────────
export type SceneData =
  | CoverSceneData
  | BigQuoteSceneData
  | TitleSubtitleSceneData
  | BulletsSceneData
  | ComparisonSceneData
  | ProcessStepsSceneData
  | FlowDiagramSceneData
  | RoadmapSceneData
  | CtaSceneData
  | TwoColumnSceneData
  | ThreeColumnSceneData
  | ProsConsSceneData
  | TodoChecklistSceneData
  | StatHighlightSceneData
  | TimelineSceneData
  | MindmapSceneData
  | SectionDividerSceneData
  | CodeSceneData
  | DiffSceneData
  | TerminalSceneData
  | ImageHeroSceneData
  | GanttSceneData;

// ─── SceneRenderer Props ──────────────────────────
export interface SceneRendererProps {
  scene: SceneData;
  theme: VideoTheme;
  totalFrames: number;
  /** 当前场景序号（从 1 开始），用于进度显示 */
  current?: number;
  /** 总场景数，用于进度显示 */
  total?: number;
  /** 当前场景起始帧 */
  sceneStartFrame?: number;
  /** 布局模式：landscape（16:9）或 portrait（9:16） */
  layout?: LayoutMode;
  /** 呈现模式：default=标准白底，knowledge-lab=知识实验台 */
  presentationMode?: PresentationMode;
  /** 品牌信息（来自 videoSpec.brand） */
  brand?: { watermarkText: string; handle: string; logoAssetId: string | null };
  /** 是否显示进度条（来自 videoSpec.background.showProgress） */
  showProgress?: boolean;
}

/**
 * 根据 scene.type 分发渲染
 */
export const SceneRenderer: React.FC<SceneRendererProps> = ({
  scene,
  theme,
  totalFrames,
  current = 1,
  total = 1,
  sceneStartFrame = 0,
  layout = "landscape",
  presentationMode = "default",
  brand,
  showProgress,
}) => {
  const sceneContent = (() => {
    switch (scene.type) {
      case "cover":
        return (
          <CoverScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            layout={layout}
            presentationMode={presentationMode}
          />
        );
      case "big-quote":
        return (
          <BigQuoteScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            sceneStartFrame={sceneStartFrame}
            layout={layout}
            presentationMode={presentationMode}
          />
        );
      case "title-subtitle":
        return (
          <TitleSubtitleScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            layout={layout}
          />
        );
      case "bullets":
        return (
          <BulletsScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            layout={layout}
          />
        );
      case "comparison":
        if (scene.semanticPattern === "detour-vs-direct-path") {
          return (
            <DetourVsDirectPathScene
              scene={scene as DetourVsDirectPathSceneData}
              theme={theme}
              totalFrames={totalFrames}
              layout={layout}
            />
          );
        }
        return (
          <ComparisonScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            layout={layout}
            presentationMode={presentationMode}
          />
        );
      case "process-steps":
        return (
          <ProcessStepsScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            layout={layout}
          />
        );
      case "flow-diagram":
        if (scene.semanticPattern === "fragment-to-manual") {
          return (
            <FragmentToManualScene
              scene={scene as FragmentToManualSceneData}
              theme={theme}
              totalFrames={totalFrames}
              layout={layout}
            />
          );
        }
        return (
          <FlowDiagramScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            layout={layout}
          />
        );
      case "roadmap":
        return (
          <RoadmapScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            layout={layout}
          />
        );
      case "cta":
        return (
          <CtaScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            sceneStartFrame={sceneStartFrame}
            layout={layout}
          />
        );
      case "two-column":
        return (
          <TwoColumnScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            layout={layout}
            presentationMode={presentationMode}
          />
        );
      case "three-column":
        return (
          <ThreeColumnScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            layout={layout}
          />
        );
      case "pros-cons":
        return (
          <ProsConsScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            layout={layout}
          />
        );
      case "todo-checklist":
        return (
          <TodoChecklistScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            layout={layout}
            presentationMode={presentationMode}
          />
        );
      case "stat-highlight":
        return (
          <StatHighlightScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            layout={layout}
          />
        );
      case "timeline":
        return (
          <TimelineScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            layout={layout}
          />
        );
      case "mindmap":
        return (
          <MindmapScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            layout={layout}
          />
        );
      case "section-divider":
        return (
          <SectionDividerScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            layout={layout}
          />
        );
      case "code":
        return (
          <CodeScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            layout={layout}
          />
        );
      case "diff":
        return (
          <DiffScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            layout={layout}
          />
        );
      case "terminal":
        return (
          <TerminalScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            layout={layout}
          />
        );
      case "image-hero":
        return (
          <ImageHeroScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            layout={layout}
          />
        );
      case "gantt":
        return (
          <GanttScene
            scene={scene}
            theme={theme}
            totalFrames={totalFrames}
            layout={layout}
          />
        );
      default:
        return (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: theme.background,
              color: theme.danger,
              fontSize: 28,
              fontWeight: 700,
              fontFamily: theme.fontFamily,
            }}
          >
            未知场景类型: {(scene as { type: string }).type}
          </div>
        );
    }
  })();

  return (
    <>
      {sceneContent}
      <SceneChrome
        theme={theme}
        current={current}
        total={total}
        sceneStartFrame={sceneStartFrame}
        sceneDurationFrames={totalFrames}
        brand={brand?.watermarkText}
        brandLogoAssetId={brand?.logoAssetId}
        showProgress={showProgress}
      />
    </>
  );
};
