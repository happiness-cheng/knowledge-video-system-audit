/**
 * KnowledgeVideoWithSubtitles — 带口播同步字幕的视频 Composition
 *
 * 在 KnowledgeVideo 基础上叠加 SubtitleOverlay 字幕层。
 * 字幕文本优先使用 spokenText，逐句对应口播。
 */

import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import { getTheme } from "../themes";
import { SceneRenderer, type SceneData } from "../scenes/SceneRenderer";
import {
  SubtitleOverlay,
  type SubtitleItem,
} from "../components/SubtitleOverlay";
import {
  spec,
  sceneFrames,
  TOTAL_FRAMES,
  TRANSITION_FRAMES,
  type LayoutMode,
} from "../utils/videoData";
import { AudioTrackLayer } from "../components/AudioTrackLayer";

// 导入字幕数据
import subtitlesData from "../data/subtitles.json";

const subtitles = subtitlesData as unknown as SubtitleItem[];

/**
 * 总帧数（扣除场景间过渡重叠帧）
 */
export const KNOWLEDGE_VIDEO_WITH_SUBTITLES_FRAMES = TOTAL_FRAMES;

// ─── 主组件 Props ─────────────────────────────────

/**
 * 使用 type 而非 interface，确保 defaultProps 类型安全（官方 compositions.md）
 */
export type KnowledgeVideoWithSubtitlesProps = {
  /** 布局模式：landscape（16:9）或 portrait（9:16），默认 landscape */
  layout?: LayoutMode;
};

// ─── 主组件 ─────────────────────────────────────

export const KnowledgeVideoWithSubtitles: React.FC<
  KnowledgeVideoWithSubtitlesProps
> = ({ layout = "landscape" }) => {
  const theme = getTheme(spec.meta.theme);

  return (
    <AbsoluteFill style={{ background: theme.background }}>
      <TransitionSeries>
        {spec.scenes.flatMap((s, i) => {
          const sf = sceneFrames[i];
          const scene = s as unknown as SceneData;

          const items: React.ReactNode[] = [
            <TransitionSeries.Sequence
              key={s.id}
              durationInFrames={sf.durationFrames}
              premountFor={30}
            >
              <SceneRenderer
                scene={scene}
                theme={theme}
                totalFrames={sf.durationFrames}
                current={i + 1}
                total={spec.scenes.length}
                sceneStartFrame={sf.startFrame}
                layout={layout}
                presentationMode={theme.presentationMode ?? "default"}
                brand={spec.brand}
                showProgress={spec.background?.showProgress ?? true}
              />
            </TransitionSeries.Sequence>,
          ];

          if (i < spec.scenes.length - 1) {
            items.push(
              <TransitionSeries.Transition
                key={`t-${s.id}`}
                presentation={wipe()}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />,
            );
          }

          return items;
        })}
      </TransitionSeries>
      <AudioTrackLayer />
      {/* 字幕用独立 Sequence，from 需扣除过渡重叠帧 */}
      {spec.scenes.map((s, i) => {
        const sf = sceneFrames[i];
        const adjustedFrom = sf.startFrame - i * TRANSITION_FRAMES;
        return (
          <Sequence
            key={`sub-${s.id}`}
            from={adjustedFrom}
            durationInFrames={sf.durationFrames}
          >
            <SubtitleOverlay
              subtitles={subtitles}
              sceneId={s.id}
              sceneIds={s.audioSegmentIds ?? [s.id]}
              sceneStartFrame={sf.startFrame}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
