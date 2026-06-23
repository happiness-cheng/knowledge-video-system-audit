import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { LabHookScene } from "./scenes/LabHookScene";
import { LabMistakeScene } from "./scenes/LabMistakeScene";
import { LabEvidenceScene } from "./scenes/LabEvidenceScene";
import { LabInsightScene } from "./scenes/LabInsightScene";
import { LabTemplateScene } from "./scenes/LabTemplateScene";
import { LabCtaScene } from "./scenes/LabCtaScene";
import { labContent, getSceneFrames, TRANSITION_FRAMES } from "./labContent";

/**
 * PremiumMotionLabComposition
 *
 * 6 个独立 scene，6 个独立时间段。
 * 使用 TransitionSeries 确保同一时间只有一个 scene 在主舞台。
 * AnimatedBackground 贯穿全程但不抢主体。
 */
export const PremiumMotionLabComposition: React.FC = () => {
  const s01Frames = getSceneFrames("S01"); // 2.5s = 75 frames
  const s02Frames = getSceneFrames("S02"); // 3.5s = 105 frames
  const s03Frames = getSceneFrames("S03"); // 3.5s = 105 frames
  const s04Frames = getSceneFrames("S04"); // 3.5s = 105 frames
  const s05Frames = getSceneFrames("S05"); // 6s = 180 frames
  const s06Frames = getSceneFrames("S06"); // 3s = 90 frames

  const transitionTiming = linearTiming({
    durationInFrames: TRANSITION_FRAMES,
  });
  const transitionPresentation = fade();

  return (
    <AbsoluteFill>
      {/* 动态背景：贯穿全程，opacity 极低，不抢主体 */}
      <AnimatedBackground
        baseColor="#0a0a0f"
        glowColor="#3b82f6"
        showGrid={true}
        maxOpacity={0.06}
      />

      {/* 6 个独立 scene，按时间顺序排列 */}
      <TransitionSeries>
        {/* S01 Hook — 痛点放大页 */}
        <TransitionSeries.Sequence durationInFrames={s01Frames}>
          <LabHookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={transitionTiming}
          presentation={transitionPresentation}
        />

        {/* S02 Mistake — 错误现场页 */}
        <TransitionSeries.Sequence durationInFrames={s02Frames}>
          <LabMistakeScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={transitionTiming}
          presentation={transitionPresentation}
        />

        {/* S03 Evidence — 对照实验页 */}
        <TransitionSeries.Sequence durationInFrames={s03Frames}>
          <LabEvidenceScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={transitionTiming}
          presentation={transitionPresentation}
        />

        {/* S04 Insight — 阶段钉子页 */}
        <TransitionSeries.Sequence durationInFrames={s04Frames}>
          <LabInsightScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={transitionTiming}
          presentation={transitionPresentation}
        />

        {/* S05 Template — 方法模板页 */}
        <TransitionSeries.Sequence durationInFrames={s05Frames}>
          <LabTemplateScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={transitionTiming}
          presentation={transitionPresentation}
        />

        {/* S06 CTA — 行动号召页 */}
        <TransitionSeries.Sequence durationInFrames={s06Frames}>
          <LabCtaScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

/** 总帧数（供 Root.tsx 使用） */
export const PREMIUM_MOTION_LAB_FRAMES =
  getSceneFrames("S01") +
  getSceneFrames("S02") +
  getSceneFrames("S03") +
  getSceneFrames("S04") +
  getSceneFrames("S05") +
  getSceneFrames("S06") +
  TRANSITION_FRAMES * 5; // 5 个转场
