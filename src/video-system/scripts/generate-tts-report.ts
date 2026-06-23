#!/usr/bin/env npx tsx
/**
 * TTS 试听报告生成脚本
 *
 * 读取 audioTiming.json，输出 ttsReview.md 试听报告。
 * 每个 scene 列出：文本、时长、语速、provider、需要检查的发音点。
 *
 * 用法：npx tsx src/video-system/scripts/generate-tts-report.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ─── 路径 ─────────────────────────────────────────
const DATA_DIR = path.resolve(__dirname, "../data");
const AUDIO_TIMING_PATH = path.join(DATA_DIR, "audioTiming.json");
const VIDEO_SPEC_PATH = path.join(DATA_DIR, "videoSpec.json");
const REPORT_PATH = path.resolve(__dirname, "../../../out/ttsReview.md");

// ─── 类型 ─────────────────────────────────────────
interface AudioSegment {
  sceneId: string;
  text: string;
  start: number;
  end: number;
  duration: number;
  provider?: string;
  voice?: string;
  rate?: string;
  pitch?: string;
  hash?: string;
}

interface AudioTiming {
  audioPath: string;
  provider: string;
  providerCapability?: string;
  voice: string;
  totalDuration: number;
  segments: AudioSegment[];
}

interface VideoScene {
  id: string;
  type?: string;
  beatRole?: string;
  spokenText?: string;
  voiceover?: string;
  tts?: { voice?: string; rate?: string; pitch?: string };
  [key: string]: unknown;
}

interface VideoSpec {
  meta: { title: string; [key: string]: unknown };
  scenes: VideoScene[];
}

// ─── 常见发音问题词 ───────────────────────────────
const PRONUNCIATION_WATCH = [
  "AI",
  "API",
  "JSON",
  "Token",
  "Bug",
  "prompt",
  "ChatGPT",
  "GPT",
  "LLM",
  "SQL",
  "HTTP",
  "URL",
  "CSS",
  "HTML",
  "JS",
  "React",
  "Vue",
  "Docker",
  "Kubernetes",
  "Git",
  "GitHub",
  "npm",
  "yarn",
  "TypeScript",
  "JavaScript",
  "Python",
  "Node",
  "Remotion",
  "Azure",
  "Edge",
];

// ─── 辅助函数 ─────────────────────────────────────
function countChineseChars(text: string): number {
  return (text.match(/[一-鿿]/g) || []).length;
}

function estimateSpeechRate(text: string, duration: number): number {
  const chineseChars = countChineseChars(text);
  return duration > 0 ? Math.round((chineseChars / duration) * 10) / 10 : 0;
}

function findWatchWords(text: string): string[] {
  return PRONUNCIATION_WATCH.filter((w) =>
    text.toLowerCase().includes(w.toLowerCase()),
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── 主流程 ───────────────────────────────────────
function main() {
  const timing: AudioTiming = JSON.parse(
    fs.readFileSync(AUDIO_TIMING_PATH, "utf-8"),
  );

  let scenes: VideoScene[] = [];
  try {
    const spec: VideoSpec = JSON.parse(
      fs.readFileSync(VIDEO_SPEC_PATH, "utf-8"),
    );
    scenes = spec.scenes;
  } catch {}

  const sceneMap = new Map(scenes.map((s) => [s.id, s]));

  const lines: string[] = [];
  lines.push("# TTS 试听报告");
  lines.push("");
  lines.push(
    `**视频**: ${scenes[0] ? sceneMap.get(scenes[0].id)?.spokenText?.slice(0, 30) : "未知"}...`,
  );
  lines.push(`**Provider**: ${timing.provider}`);
  lines.push(
    `**Provider Capability**: ${timing.providerCapability || "未记录"}`,
  );
  lines.push(`**默认声音**: ${timing.voice}`);
  lines.push(
    `**总时长**: ${formatTime(timing.totalDuration)} (${timing.totalDuration.toFixed(2)}s)`,
  );
  lines.push(`**场景数**: ${timing.segments.length}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // 逐 scene 检查
  let totalIssues = 0;

  for (const seg of timing.segments) {
    if (seg.duration === 0) continue;

    const scene = sceneMap.get(seg.sceneId);
    const rate = estimateSpeechRate(seg.text, seg.duration);
    const watchWords = findWatchWords(seg.text);

    // 语速判断（中文正常语速 3-5 字/秒）
    const rateWarning = rate > 6 ? "⚠️ 偏快" : rate < 2 ? "⚠️ 偏慢" : "✅ 正常";

    lines.push(`## ${seg.sceneId} ${scene?.type ? `(${scene.type})` : ""}`);
    lines.push("");
    lines.push(`| 项目 | 值 |`);
    lines.push(`|------|-----|`);
    lines.push(
      `| 时间 | ${formatTime(seg.start)} → ${formatTime(seg.end)} (${seg.duration.toFixed(2)}s) |`,
    );
    lines.push(`| 声音 | ${seg.voice || timing.voice} |`);
    lines.push(`| 语速 | ${seg.rate || "+0%"} |`);
    lines.push(`| 音高 | ${seg.pitch || "+0Hz"} |`);
    lines.push(`| 估算语速 | ${rate} 字/秒 ${rateWarning} |`);
    lines.push(`| Hash | ${seg.hash || "未记录"} |`);
    lines.push("");

    lines.push("**spokenText**:");
    lines.push(`> ${seg.text}`);
    lines.push("");

    if (scene?.voiceover && scene.voiceover !== seg.text) {
      lines.push("**voiceover**（给人看，可能与 spokenText 不同）:");
      lines.push(`> ${scene.voiceover}`);
      lines.push("");
    }

    // 发音检查点
    if (watchWords.length > 0) {
      lines.push(`**发音检查**: ${watchWords.join(", ")}`);
      lines.push("");
      totalIssues++;
    }

    // TTS 配置
    if (scene?.tts) {
      lines.push(
        `**Scene TTS 配置**: voice=${scene.tts.voice || "默认"}, rate=${scene.tts.rate || "+0%"}, pitch=${scene.tts.pitch || "+0Hz"}`,
      );
      lines.push("");
    }

    lines.push("---");
    lines.push("");
  }

  // 汇总
  lines.push("## 汇总");
  lines.push("");
  lines.push(`| 指标 | 值 |`);
  lines.push(`|------|-----|`);
  lines.push(
    `| 总场景 | ${timing.segments.filter((s) => s.duration > 0).length} |`,
  );
  lines.push(`| 总时长 | ${formatTime(timing.totalDuration)} |`);
  lines.push(`| Provider | ${timing.provider} |`);
  lines.push(`| 有发音检查点 | ${totalIssues} 个 scene |`);
  lines.push("");

  lines.push("## 试听检查清单");
  lines.push("");
  lines.push("- [ ] 每个 scene 是否读音正确");
  lines.push("- [ ] 英文词发音是否自然（AI、API、JSON 等）");
  lines.push("- [ ] 停顿是否足够（句号、逗号处）");
  lines.push("- [ ] 语速是否合适（不赶不拖）");
  lines.push("- [ ] 音量是否一致");
  lines.push("- [ ] 是否有 AI 念稿感");
  lines.push("- [ ] 标点处的停顿是否自然");
  lines.push("");

  // 写入文件
  const outDir = path.dirname(REPORT_PATH);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(REPORT_PATH, lines.join("\n"));

  console.log(`\nTTS 试听报告已生成`);
  console.log(`文件: ${REPORT_PATH}`);
  console.log(
    `场景数: ${timing.segments.filter((s) => s.duration > 0).length}`,
  );
  console.log(`总时长: ${formatTime(timing.totalDuration)}`);
  console.log(`发音检查点: ${totalIssues} 个 scene`);
}

main();
