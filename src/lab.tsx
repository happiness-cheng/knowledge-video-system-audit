/**
 * lab.ts — 实验 Composition 独立入口
 *
 * 只注册实验和实验室 Composition，不注册正式生产 Composition。
 * 用于 npm run studio:lab，与正式生产 Studio 隔离。
 */

import { Composition, registerRoot } from "remotion";
import React from "react";

// 实验 Composition imports
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

// Fixture Composition imports
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
  KnowledgeVideoLabDemo,
  KNOWLEDGE_VIDEO_LAB_DEMO_FRAMES,
} from "./video-system/compositions/KnowledgeVideoLabDemo";

const LabRoot: React.FC = () => (
  <>
    {/* 实验 Composition */}
    <Composition
      id="PremiumMotionLab"
      component={PremiumMotionLabComposition}
      durationInFrames={PREMIUM_MOTION_LAB_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="ExperimentVersionVideo"
      component={ExperimentVersionComposition}
      durationInFrames={EXPERIMENT_VERSION_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="UltimateMotionSystemLab"
      component={UltimateMotionSystemLab}
      durationInFrames={ULTIMATE_MOTION_SYSTEM_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="PromptCompletionExplainer"
      component={PromptCompletionExplainer}
      durationInFrames={PROMPT_COMPLETION_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="AiPromptWrongVisualExplanationSplice"
      component={AiPromptWrongVisualExplanationSplice}
      durationInFrames={AI_PROMPT_WRONG_SPLICE_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="ThemeComparison"
      component={ThemeComparisonComposition}
      durationInFrames={THEME_COMPARISON_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="KnowledgeVideoLabDemo"
      component={KnowledgeVideoLabDemo}
      durationInFrames={KNOWLEDGE_VIDEO_LAB_DEMO_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    {/* Audience validation */}
    <Composition
      id="AudienceValidationProjectResetShot"
      component={ProjectResetShot}
      durationInFrames={AUDIENCE_VALIDATION_PROJECT_RESET_SHOT_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="AudienceValidationRepeatedContextDumpShot"
      component={RepeatedContextDumpShot}
      durationInFrames={AUDIENCE_VALIDATION_REPEATED_CONTEXT_DUMP_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="TriggerFrameVariantA"
      component={TriggerFrame_VariantA}
      durationInFrames={TRIGGER_FRAME_VARIANT_A_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="TriggerFrameVariantB"
      component={TriggerFrame_VariantB}
      durationInFrames={TRIGGER_FRAME_VARIANT_B_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="TriggerFrameVariantC"
      component={TriggerFrame_VariantC}
      durationInFrames={TRIGGER_FRAME_VARIANT_C_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    {/* Fixture Compositions */}
    <Composition
      id="CodeSceneFixture"
      component={CodeSceneFixture}
      durationInFrames={CODE_SCENE_FIXTURE_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="DiffSceneFixture"
      component={DiffSceneFixture}
      durationInFrames={DIFF_SCENE_FIXTURE_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="TerminalSceneFixture"
      component={TerminalSceneFixture}
      durationInFrames={TERMINAL_SCENE_FIXTURE_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="ImageHeroSceneFixture"
      component={ImageHeroSceneFixture}
      durationInFrames={IMAGE_HERO_SCENE_FIXTURE_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="GanttSceneFixture"
      component={GanttSceneFixture}
      durationInFrames={GANTT_SCENE_FIXTURE_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="SpotlightCueFixture"
      component={SpotlightCueFixture}
      durationInFrames={SPOTLIGHT_CUE_FIXTURE_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="StrikeAndReplaceFixture"
      component={StrikeAndReplaceFixture}
      durationInFrames={STRIKE_AND_REPLACE_FIXTURE_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="ConceptFlowFixture"
      component={ConceptFlowFixture}
      durationInFrames={CONCEPT_FLOW_FIXTURE_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="StateTransitionFixture"
      component={StateTransitionFixture}
      durationInFrames={STATE_TRANSITION_FIXTURE_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="MapLightUpFixture"
      component={MapLightUpFixture}
      durationInFrames={MAP_LIGHT_UP_FIXTURE_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="PathComparisonFixture"
      component={PathComparisonFixture}
      durationInFrames={PATH_COMPARISON_FIXTURE_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="PressureBuildFixture"
      component={PressureBuildFixture}
      durationInFrames={PRESSURE_BUILD_FIXTURE_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="ConfusedToGuidedFixture"
      component={ConfusedToGuidedFixture}
      durationInFrames={CONFUSED_TO_GUIDED_FIXTURE_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  </>
);

registerRoot(LabRoot);
