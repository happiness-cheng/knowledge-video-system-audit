/**
 * KnowledgeVideo — 数据驱动的视频 Composition
 *
 * 合并读取 videoSpec.json（画面内容）和 audioTiming.json（音频时序）。
 * videoSpec 决定画面和口播内容，audioTiming 决定真实时间轴。
 *
 * 后续新增视频只需修改 videoSpec.json 和 audioTiming.json。
 */

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import { getTheme } from "../themes";
import { SceneRenderer, type SceneData } from "../scenes/SceneRenderer";
import {
  spec,
  sceneFrames,
  TOTAL_FRAMES,
  TRANSITION_FRAMES,
  type LayoutMode,
} from "../utils/videoData";
import { AudioTrackLayer } from "../components/AudioTrackLayer";

/**
 * 总帧数（供 Root.tsx 的 durationInFrames 使用）
 */
export const KNOWLEDGE_VIDEO_FRAMES = TOTAL_FRAMES;

/**
 * 主视频组件 Props
 * 使用 type 而非 interface，确保 defaultProps 类型安全（官方 compositions.md）
 */
export type KnowledgeVideoProps = {
  /** 布局模式：landscape（16:9）或 portrait（9:16），默认 landscape */
  layout?: LayoutMode;
};

/**
 * 主视频组件
 */
export const KnowledgeVideo: React.FC<KnowledgeVideoProps> = ({
  layout = "landscape",
}) => {
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
                presentationMode={(() => {
                  const vr = (s as Record<string, unknown>).visualRole;
                  if (vr === "evidence" || vr === "insight" || vr === "recap")
                    return "knowledge-lab" as const;
                  return (theme.presentationMode ?? "default") as
                    | "default"
                    | "knowledge-lab";
                })()}
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
    </AbsoluteFill>
  );
};
