/**
 * generate-subtitles.ts
 *
 * 读取 videoSpec.json（spokenText）+ audioTiming.json（scene 级时间），
 * 输出 subtitles.json（口播同步字幕）。
 *
 * 用法：npx tsx src/video-system/scripts/generate-subtitles.ts
 */

import * as fs from "fs";
import * as path from "path";
import { assertPreProductionReviewReady } from "../utils/preProductionGate";

// ─── 类型 ─────────────────────────────────────────

export interface SubtitleItem {
  sceneId: string;
  start: number;
  end: number;
  text: string;
}

interface AudioSegment {
  sceneId: string;
  start: number;
  end: number;
  duration: number;
}

interface VideoScene {
  id: string;
  spokenText?: string;
  voiceover?: string;
  audioSegmentIds?: string[];
  [key: string]: unknown;
}

// ─── 拆分 spokenText 为字幕句子 ───────────────────

export function splitIntoSubtitles(text: string): string[] {
  const sentences = text
    .split(/(?<=[。？！])/)
    .map((s) => s.trim())
    .filter(Boolean);

  const result: string[] = [];

  for (const sentence of sentences) {
    if (sentence.length <= 22) {
      result.push(sentence);
      continue;
    }

    const clauses = sentence
      .split(/(?<=[，、])/)
      .map((s) => s.trim())
      .filter(Boolean);

    let buffer = "";
    for (const clause of clauses) {
      if (buffer.length + clause.length <= 22) {
        buffer += clause;
      } else {
        if (buffer) result.push(buffer);
        buffer = clause;
      }
    }
    if (buffer) result.push(buffer);
  }

  return result;
}

// ─── 依赖注入接口 ─────────────────────────────────

export interface SubtitleGenerationDeps {
  dataDir: string;
  readFile: (path: string) => string;
  writeFile: (path: string, content: string) => void;
}

const DEFAULT_DEPS: SubtitleGenerationDeps = {
  dataDir: path.resolve(__dirname, "../data"),
  readFile: (p: string) => fs.readFileSync(p, "utf-8"),
  writeFile: (p: string, c: string) => fs.writeFileSync(p, c, "utf-8"),
};

// ─── 核心逻辑（可注入依赖） ───────────────────────

export function runSubtitleGeneration(
  deps: SubtitleGenerationDeps = DEFAULT_DEPS,
): SubtitleItem[] {
  const videoSpec = JSON.parse(
    deps.readFile(path.join(deps.dataDir, "videoSpec.json")),
  );
  const audioTiming = JSON.parse(
    deps.readFile(path.join(deps.dataDir, "audioTiming.json")),
  );

  const subtitles: SubtitleItem[] = [];

  for (const segment of audioTiming.segments) {
    const scene =
      videoSpec.scenes.find((s: VideoScene) => s.id === segment.sceneId) ??
      videoSpec.scenes.find((s: VideoScene) =>
        s.audioSegmentIds?.includes(segment.sceneId),
      );
    if (!scene) continue;

    const text = scene.spokenText || scene.voiceover;
    if (!text) continue;

    const lines = splitIntoSubtitles(text);
    const totalChars = lines.reduce((sum, line) => sum + line.length, 0);

    let currentStart = segment.start;
    for (const line of lines) {
      const lineDuration = (line.length / totalChars) * segment.duration;
      subtitles.push({
        sceneId: segment.sceneId,
        start: currentStart,
        end: currentStart + lineDuration,
        text: line,
      });
      currentStart += lineDuration;
    }
  }

  return subtitles;
}

// ─── CLI wrapper（门禁 → 执行） ───────────────────

// 门禁必须在读取任何生产数据前执行
assertPreProductionReviewReady();

const subtitles = runSubtitleGeneration();
const outputPath = path.resolve(__dirname, "../data/subtitles.json");
fs.writeFileSync(outputPath, JSON.stringify(subtitles, null, 2), "utf-8");

console.log(`Generated ${subtitles.length} subtitle items → ${outputPath}`);
console.log(`\nPreview (first 5):`);
for (const item of subtitles.slice(0, 5)) {
  console.log(
    `  [${item.start.toFixed(2)}s - ${item.end.toFixed(2)}s] ${item.sceneId}: ${item.text}`,
  );
}
