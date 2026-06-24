import { Composition, Still } from "remotion";
import {
  KnowledgeVideo,
  KNOWLEDGE_VIDEO_FRAMES,
} from "./video-system/compositions/KnowledgeVideo";
import {
  KnowledgeVideoWithSubtitles,
  KNOWLEDGE_VIDEO_WITH_SUBTITLES_FRAMES,
} from "./video-system/compositions/KnowledgeVideoWithSubtitles";
import {
  CoverComposition,
  type CoverProps,
} from "./video-system/compositions/CoverComposition";
import {
  KnowledgeVideoLabDemo,
  KNOWLEDGE_VIDEO_LAB_DEMO_FRAMES,
} from "./video-system/compositions/KnowledgeVideoLabDemo";
import {
  PremiumMotionLabComposition,
  PREMIUM_MOTION_LAB_FRAMES,
} from "./video-system/labs/premium-motion-lab/PremiumMotionLabComposition";
import {
  ExperimentVersionComposition,
  EXPERIMENT_VERSION_FRAMES,
} from "./video-system/experiments/experiment-version/ExperimentVersionComposition";
import {
  UltimateMotionSystemLab,
  ULTIMATE_MOTION_SYSTEM_FRAMES,
} from "./video-system/experiments/ultimate-motion-system/UltimateMotionSystemLab";
import {
  PromptCompletionExplainer,
  TOTAL_FRAMES as PROMPT_COMPLETION_FRAMES,
} from "./video-system/experiments/shot-lab/PromptCompletionExplainer";
import {
  AiPromptWrongVisualExplanationSplice,
  TOTAL_FRAMES as AI_PROMPT_WRONG_SPLICE_FRAMES,
} from "./video-system/experiments/shot-lab/AiPromptWrongVisualExplanationSplice";
import {
  ThemeComparisonComposition,
  TOTAL_FRAMES as THEME_COMPARISON_FRAMES,
} from "./video-system/experiments/shot-lab/ThemeComparisonComposition";
import {
  CodeSceneFixture,
  CODE_SCENE_FIXTURE_FRAMES,
} from "./video-system/compositions/CodeSceneFixture";
import {
  DiffSceneFixture,
  DIFF_SCENE_FIXTURE_FRAMES,
} from "./video-system/compositions/DiffSceneFixture";
import {
  TerminalSceneFixture,
  TERMINAL_SCENE_FIXTURE_FRAMES,
} from "./video-system/compositions/TerminalSceneFixture";
import {
  ImageHeroSceneFixture,
  IMAGE_HERO_SCENE_FIXTURE_FRAMES,
} from "./video-system/compositions/ImageHeroSceneFixture";
import {
  GanttSceneFixture,
  GANTT_SCENE_FIXTURE_FRAMES,
} from "./video-system/compositions/GanttSceneFixture";
import {
  SpotlightCueFixture,
  SPOTLIGHT_CUE_FIXTURE_FRAMES,
} from "./video-system/compositions/SpotlightCueFixture";
import {
  StrikeAndReplaceFixture,
  STRIKE_AND_REPLACE_FIXTURE_FRAMES,
} from "./video-system/compositions/StrikeAndReplaceFixture";
import {
  ConceptFlowFixture,
  CONCEPT_FLOW_FIXTURE_FRAMES,
} from "./video-system/compositions/ConceptFlowFixture";
import {
  StateTransitionFixture,
  STATE_TRANSITION_FIXTURE_FRAMES,
} from "./video-system/compositions/StateTransitionFixture";
import {
  MapLightUpFixture,
  MAP_LIGHT_UP_FIXTURE_FRAMES,
} from "./video-system/compositions/MapLightUpFixture";
import {
  PathComparisonFixture,
  PATH_COMPARISON_FIXTURE_FRAMES,
} from "./video-system/compositions/PathComparisonFixture";
import {
  PressureBuildFixture,
  PRESSURE_BUILD_FIXTURE_FRAMES,
} from "./video-system/compositions/PressureBuildFixture";
import {
  ConfusedToGuidedFixture,
  CONFUSED_TO_GUIDED_FIXTURE_FRAMES,
} from "./video-system/compositions/ConfusedToGuidedFixture";
import {
  ProjectResetShot,
  AUDIENCE_VALIDATION_PROJECT_RESET_SHOT_FRAMES,
} from "./video-system/experiments/visual-trigger/ProjectResetShot";
import {
  RepeatedContextDumpShot,
  AUDIENCE_VALIDATION_REPEATED_CONTEXT_DUMP_FRAMES,
} from "./video-system/experiments/visual-trigger/RepeatedContextDumpShot";
import {
  TriggerFrame_VariantA,
  TRIGGER_FRAME_VARIANT_A_FRAMES,
} from "./video-system/experiments/visual-trigger/TriggerFrame_VariantA";
import {
  TriggerFrame_VariantB,
  TRIGGER_FRAME_VARIANT_B_FRAMES,
} from "./video-system/experiments/visual-trigger/TriggerFrame_VariantB";
import {
  TriggerFrame_VariantC,
  TRIGGER_FRAME_VARIANT_C_FRAMES,
} from "./video-system/experiments/visual-trigger/TriggerFrame_VariantC";
import { StateBlockSpike } from "./video-system/compositions/StateBlockSpike";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="KnowledgeVideo"
        component={KnowledgeVideo}
        durationInFrames={KNOWLEDGE_VIDEO_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="KnowledgeVideoWithSubtitles"
        component={KnowledgeVideoWithSubtitles}
        durationInFrames={KNOWLEDGE_VIDEO_WITH_SUBTITLES_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* 知识实验台 Demo */}
      <Composition
        id="KnowledgeVideoLabDemo"
        component={KnowledgeVideoLabDemo}
        durationInFrames={KNOWLEDGE_VIDEO_LAB_DEMO_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* 9:16 竖版视频（抖音/快手/小红书） */}
      <Composition
        id="KnowledgeVideoPortrait"
        component={KnowledgeVideo}
        durationInFrames={KNOWLEDGE_VIDEO_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={
          { layout: "portrait" } as React.ComponentProps<typeof KnowledgeVideo>
        }
      />
      <Composition
        id="KnowledgeVideoWithSubtitlesPortrait"
        component={KnowledgeVideoWithSubtitles}
        durationInFrames={KNOWLEDGE_VIDEO_WITH_SUBTITLES_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={
          { layout: "portrait" } as React.ComponentProps<
            typeof KnowledgeVideoWithSubtitles
          >
        }
      />
      {/* 3:4 竖版封面（抖音/快手） */}
      <Still
        id="CoverImage3x4"
        component={CoverComposition}
        width={1080}
        height={1440}
        defaultProps={{ aspectRatio: "3:4" } as CoverProps}
      />
      {/* 4:3 横版封面（B站/小红书） */}
      <Still
        id="CoverImage4x3"
        component={CoverComposition}
        width={1440}
        height={1080}
        defaultProps={{ aspectRatio: "4:3" } as CoverProps}
      />
      {/* 16:9 兼容版（可选） */}
      <Still
        id="CoverImage"
        component={CoverComposition}
        width={1920}
        height={1080}
        defaultProps={{ aspectRatio: "4:3" } as CoverProps}
      />
      {/* Premium Motion Lab 实验 */}
      <Composition
        id="PremiumMotionLab"
        component={PremiumMotionLabComposition}
        durationInFrames={PREMIUM_MOTION_LAB_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Experiment Version 试验版 */}
      <Composition
        id="ExperimentVersionVideo"
        component={ExperimentVersionComposition}
        durationInFrames={EXPERIMENT_VERSION_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Ultimate Motion System Lab V2 */}
      <Composition
        id="UltimateMotionSystemLab"
        component={UltimateMotionSystemLab}
        durationInFrames={ULTIMATE_MOTION_SYSTEM_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Shot Lab 01: Prompt Completion Visual Explainer */}
      <Composition
        id="PromptCompletionExplainer"
        component={PromptCompletionExplainer}
        durationInFrames={PROMPT_COMPLETION_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Shot Lab 01 Splice: 实验版整段拼接预览 (白底杂志风) */}
      <Composition
        id="AiPromptWrongVisualExplanationSplice"
        component={AiPromptWrongVisualExplanationSplice}
        durationInFrames={AI_PROMPT_WRONG_SPLICE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Theme Comparison: 四主题对照 */}
      <Composition
        id="ThemeComparison"
        component={ThemeComparisonComposition}
        durationInFrames={THEME_COMPARISON_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Fixture: code scene 行高亮验收 */}
      <Composition
        id="CodeSceneFixture"
        component={CodeSceneFixture}
        durationInFrames={CODE_SCENE_FIXTURE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Fixture: diff scene 前后变化验收 */}
      <Composition
        id="DiffSceneFixture"
        component={DiffSceneFixture}
        durationInFrames={DIFF_SCENE_FIXTURE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Fixture: terminal scene 命令结果验收 */}
      <Composition
        id="TerminalSceneFixture"
        component={TerminalSceneFixture}
        durationInFrames={TERMINAL_SCENE_FIXTURE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Fixture: image-hero scene 大图讲解验收 */}
      <Composition
        id="ImageHeroSceneFixture"
        component={ImageHeroSceneFixture}
        durationInFrames={IMAGE_HERO_SCENE_FIXTURE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Fixture: gantt scene 执行链路验收 */}
      <Composition
        id="GanttSceneFixture"
        component={GanttSceneFixture}
        durationInFrames={GANTT_SCENE_FIXTURE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Fixture: spotlight cue 白底高亮验收 */}
      <Composition
        id="SpotlightCueFixture"
        component={SpotlightCueFixture}
        durationInFrames={SPOTLIGHT_CUE_FIXTURE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Fixture: strike and replace 纠偏动作验收 */}
      <Composition
        id="StrikeAndReplaceFixture"
        component={StrikeAndReplaceFixture}
        durationInFrames={STRIKE_AND_REPLACE_FIXTURE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Fixture: concept flow 知识汇聚验收 */}
      <Composition
        id="ConceptFlowFixture"
        component={ConceptFlowFixture}
        durationInFrames={CONCEPT_FLOW_FIXTURE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Fixture: state transition 入职状态转换验收 */}
      <Composition
        id="StateTransitionFixture"
        component={StateTransitionFixture}
        durationInFrames={STATE_TRANSITION_FIXTURE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Fixture: map light up 项目地图与硬拦截验收 */}
      <Composition
        id="MapLightUpFixture"
        component={MapLightUpFixture}
        durationInFrames={MAP_LIGHT_UP_FIXTURE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Fixture: path comparison 绕路与直达验收 */}
      <Composition
        id="PathComparisonFixture"
        component={PathComparisonFixture}
        durationInFrames={PATH_COMPARISON_FIXTURE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Fixture: pressure build 动态 Hook 验收 */}
      <Composition
        id="PressureBuildFixture"
        component={PressureBuildFixture}
        durationInFrames={PRESSURE_BUILD_FIXTURE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Fixture: confused to guided 困惑到被引导验收 */}
      <Composition
        id="ConfusedToGuidedFixture"
        component={ConfusedToGuidedFixture}
        durationInFrames={CONFUSED_TO_GUIDED_FIXTURE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Audience validation: Visual Trigger Shot A 项目认知重置 */}
      <Composition
        id="AudienceValidationProjectResetShot"
        component={ProjectResetShot}
        durationInFrames={AUDIENCE_VALIDATION_PROJECT_RESET_SHOT_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Audience validation: Visual Trigger Shot B 重复解释压迫 */}
      <Composition
        id="AudienceValidationRepeatedContextDumpShot"
        component={RepeatedContextDumpShot}
        durationInFrames={AUDIENCE_VALIDATION_REPEATED_CONTEXT_DUMP_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* 方案 A：大字排版 + 情绪色调 */}
      <Composition
        id="TriggerFrameVariantA"
        component={TriggerFrame_VariantA}
        durationInFrames={TRIGGER_FRAME_VARIANT_A_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* 方案 B：多画面蒙太奇 */}
      <Composition
        id="TriggerFrameVariantB"
        component={TriggerFrame_VariantB}
        durationInFrames={TRIGGER_FRAME_VARIANT_B_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* 方案 C：问号驱动节奏 */}
      <Composition
        id="TriggerFrameVariantC"
        component={TriggerFrame_VariantC}
        durationInFrames={TRIGGER_FRAME_VARIANT_C_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Visual Spike 01: 状态阻断 — 审查失败后下游真实停止 */}
      <Composition
        id="StateBlockSpike"
        component={StateBlockSpike}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
