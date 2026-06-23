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
import { assertPreProductionGate } from "../utils/preProductionGate";

assertPreProductionGate();

const DATA_DIR = path.resolve(__dirname, "../data");
const videoSpec = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, "videoSpec.json"), "utf-8"),
);
const audioTiming = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, "audioTiming.json"), "utf-8"),
);

interface SubtitleItem {
  sceneId: string;
  start: number;
  end: number;
  text: string;
}

/**
 * 拆分 spokenText 为字幕句子
 *
 * 规则：
 * 1. 按句号、问号、感叹号拆大句
 * 2. 大句内按逗号、顿号拆小句
 * 3. 每条字幕 12-22 字，超过则继续拆
 * 4. 不改变原意，不摘要改写
 */
function splitIntoSubtitles(text: string): string[] {
  // 第一步：按句号、问号、感叹号拆大句
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

    // 大句太长，按逗号、顿号拆小句
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

/**
 * 为每个 scene 生成字幕时间轴
 *
 * 按字数比例分配时间：
 * 句字数 / 总字数 × scene 时长
 */
function generateSubtitles(): SubtitleItem[] {
  const subtitles: SubtitleItem[] = [];

  for (const segment of audioTiming.segments) {
    // 先按 id 精确匹配，再按 audioSegmentIds 包含匹配
    const scene =
      videoSpec.scenes.find((s: { id: string }) => s.id === segment.sceneId) ??
      videoSpec.scenes.find((s: { id: string; audioSegmentIds?: string[] }) =>
        s.audioSegmentIds?.includes(segment.sceneId),
      );
    if (!scene) continue;

    // 优先 spokenText，fallback voiceover
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

const subtitles = generateSubtitles();
const outputPath = path.join(DATA_DIR, "subtitles.json");
fs.writeFileSync(outputPath, JSON.stringify(subtitles, null, 2), "utf-8");

console.log(`Generated ${subtitles.length} subtitle items → ${outputPath}`);
console.log(`\nPreview (first 5):`);
for (const item of subtitles.slice(0, 5)) {
  console.log(
    `  [${item.start.toFixed(2)}s - ${item.end.toFixed(2)}s] ${item.sceneId}: ${item.text}`,
  );
}
