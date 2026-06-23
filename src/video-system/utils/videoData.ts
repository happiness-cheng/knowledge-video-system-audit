/**
 * 视频数据共享模块
 *
 * KnowledgeVideo 和 KnowledgeVideoWithSubtitles 共用的类型、常量和帧计算逻辑。
 * 消除两个 Composition 之间的代码重复。
 */

import type { LayoutMode } from "./useLayoutConfig";

// 导入数据
import videoSpec from "../data/videoSpec.json";
import audioTiming from "../data/audioTiming.json";

// ─── 类型定义 ─────────────────────────────────────

export interface VideoSpecMeta {
  title: string;
  platform: string;
  aspectRatio: string;
  fps: number;
  theme: string;
}

export interface VideoSpecBrand {
  show: boolean;
  watermarkText: string;
  handle: string;
  logoAssetId: string | null;
}

export interface VideoSpecScene {
  id: string;
  audioSegmentIds?: string[];
  beatId?: string;
  beatRole?: string;
  visualRole?: string;
  chapterId?: string;
  humanPresence?: string;
  caseStage?: string | null;
  evidencePurpose?: string | null;
  recapOf?: string | null;
  transferScenario?: string | null;
  attentionTrigger?: string;
  type: string;
  durationEstimate?: number;
  voiceover?: string;
  spokenText?: string;
  screenText?: string;
  deliveryHint?: string;
  animation?: string;
  tts?: { voice?: string; rate?: string; pitch?: string };
  [key: string]: unknown;
}

export interface AudioSegment {
  sceneId: string;
  text: string;
  start: number;
  end: number;
  duration: number;
  filePath?: string;
}

export interface AudioTiming {
  audioPath: string;
  provider: string;
  voice: string;
  totalDuration: number;
  segments: AudioSegment[];
}

// ─── 数据加载 ─────────────────────────────────────

export const spec = videoSpec as unknown as {
  meta: VideoSpecMeta;
  brand?: VideoSpecBrand;
  background?: { show?: boolean; variant?: string; showProgress?: boolean };
  scenes: VideoSpecScene[];
};

export const timing = audioTiming as unknown as AudioTiming;

// ─── 常量 ─────────────────────────────────────────

/** 场景间过渡时长（帧数） */
export const TRANSITION_FRAMES = 15;

// ─── 帧计算 ─────────────────────────────────────

/**
 * 计算每个场景的帧数：
 * 优先用 audioTiming 的 duration，否则用 videoSpec 的 durationEstimate
 */
export function computeSceneFrames(
  scenes: VideoSpecScene[],
  segments: AudioSegment[],
  fps: number,
): Array<{ id: string; startFrame: number; durationFrames: number }> {
  let currentFrame = 0;
  return scenes.map((s) => {
    const segmentIds = s.audioSegmentIds ?? [s.id];
    const matchedSegments = segmentIds
      .map((id) => segments.find((a) => a.sceneId === id))
      .filter((seg): seg is AudioSegment => !!seg && seg.duration > 0);
    const durationSec =
      matchedSegments.length > 0
        ? matchedSegments.reduce((sum, seg) => sum + seg.duration, 0)
        : (s.durationEstimate ?? 5);
    const durationFrames = Math.round(durationSec * fps);
    const result = {
      id: s.id,
      startFrame: currentFrame,
      durationFrames,
    };
    currentFrame += durationFrames;
    return result;
  });
}

/**
 * 根据 sceneId 查找音频时序
 */
export function findAudioSegment(sceneId: string): AudioSegment | undefined {
  return timing.segments.find((s) => s.sceneId === sceneId);
}

/**
 * 计算总帧数（扣除场景间过渡重叠帧）
 */
export function computeTotalFrames(
  sceneFrames: Array<{ durationFrames: number }>,
  sceneCount: number,
): number {
  return (
    sceneFrames.reduce((sum, s) => sum + s.durationFrames, 0) -
    (sceneCount - 1) * TRANSITION_FRAMES
  );
}

// ─── 预计算 ─────────────────────────────────────

export const sceneFrames = computeSceneFrames(
  spec.scenes,
  timing.segments,
  spec.meta.fps,
);

export const TOTAL_FRAMES = computeTotalFrames(sceneFrames, spec.scenes.length);

// ─── 类型导出 ─────────────────────────────────────

export type { LayoutMode };
