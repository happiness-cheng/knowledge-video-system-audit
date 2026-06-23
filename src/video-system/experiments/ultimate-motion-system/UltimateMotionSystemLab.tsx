import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { BackgroundSystem } from "./components/BackgroundSystem";
import { SubtitleOverlay, generateSubtitleSegments } from "./components/SubtitleOverlay";
import { UltimateSceneRenderer } from "./UltimateSceneRenderer";
import { getChineseFontFamily } from "./utils/fontLoader";
import { labContent, getSceneFrames, TRANSITION_FRAMES, getTotalFrames } from "./labContent";

/** 口播音频文件映射（S01-S08 有音频） */
const voiceoverFiles: Record<string, string> = {
  S01: "audio/voiceover/S01.mp3",
  S02: "audio/voiceover/S02.mp3",
  S03: "audio/voiceover/S03.mp3",
  S04: "audio/voiceover/S04.mp3",
  S05: "audio/voiceover/S05.mp3",
  S06: "audio/voiceover/S06.mp3",
  S07: "audio/voiceover/S07.mp3",
  S08: "audio/voiceover/S08.mp3",
};

/** 转场模式循环 */
const transitionPresentations = [
  fade(),
  slide({ direction: "from-left" }),
  wipe({ direction: "from-left" }),
  fade(),
  slide({ direction: "from-right" }),
  wipe({ direction: "from-right" }),
  fade(),
  slide({ direction: "from-bottom" }),
  fade(),
  slide({ direction: "from-left" }),
  fade(),
  wipe({ direction: "from-left" }),
  fade(),
  slide({ direction: "from-right" }),
];

export const UltimateMotionSystemLab: React.FC = () => {
  const transitionTiming = linearTiming({ durationInFrames: TRANSITION_FRAMES });
  const fontFamily = getChineseFontFamily();

  // 计算每个 scene 的起始帧（用于音频和字幕定位）
  const sceneStartFrames: number[] = [];
  let accFrame = 0;
  for (let i = 0; i < labContent.scenes.length; i++) {
    sceneStartFrames.push(accFrame);
    accFrame += getSceneFrames(labContent.scenes[i].id);
    if (i < labContent.scenes.length - 1) {
      accFrame += TRANSITION_FRAMES;
    }
  }

  // 为 S01-S08 生成字幕段
  const subtitleSegments = labContent.scenes
    .filter((s) => s.spokenText && voiceoverFiles[s.id])
    .flatMap((scene, i) => {
      const sceneIdx = labContent.scenes.findIndex((s) => s.id === scene.id);
      const sceneFrames = getSceneFrames(scene.id);
      const startFrame = sceneStartFrames[sceneIdx];
      const segments = generateSubtitleSegments(
        scene.spokenText as string,
        sceneFrames,
        30,
      );
      return segments.map((seg) => ({
        text: seg.text,
        startFrame: startFrame + seg.startFrame,
        endFrame: startFrame + seg.endFrame,
      }));
    });

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <BackgroundSystem variant="dark-glow" showGrid={true} maxOpacity={0.06} />

      {/* 口播音频层：S01-S08 */}
      {labContent.scenes.map((scene, i) => {
        const audioFile = voiceoverFiles[scene.id];
        if (!audioFile) return null;
        return (
          <Sequence key={`audio-${scene.id}`} from={sceneStartFrames[i]} layout="none">
            <Audio src={staticFile(audioFile)} volume={0.9} />
          </Sequence>
        );
      })}

      {/* 字幕层 */}
      <SubtitleOverlay segments={subtitleSegments} fontSize={48} bottomMargin={60} />

      {/* 视频场景层 */}
      <TransitionSeries>
        {labContent.scenes.map((scene, i) => {
          const sceneFrames = getSceneFrames(scene.id);
          const presentation = transitionPresentations[i % transitionPresentations.length];
          const items: React.ReactNode[] = [
            <TransitionSeries.Sequence key={scene.id} durationInFrames={sceneFrames}>
              <UltimateSceneRenderer scene={scene} totalFrames={sceneFrames} />
            </TransitionSeries.Sequence>,
          ];
          if (i < labContent.scenes.length - 1) {
            items.push(
              <TransitionSeries.Transition key={`t-${scene.id}`} timing={transitionTiming} presentation={presentation as any} />,
            );
          }
          return items;
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export const ULTIMATE_MOTION_SYSTEM_FRAMES = getTotalFrames();
