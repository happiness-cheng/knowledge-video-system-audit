#!/usr/bin/env npx tsx
/**
 * TTS 音频生成脚本
 *
 * 读取 videoSpec.json，为每个 scene 的 spokenText 生成 mp3 文件，
 * 然后写入 audioTiming.json（音频时序数据）。
 *
 * 优先用 Azure Speech SSML（支持 <lang> 标签读英文词），
 * 未配置凭据时回退到 Edge TTS。
 *
 * 用法：npx tsx src/video-system/scripts/generate-audio.ts
 */

import "dotenv/config";
import * as fs from "node:fs";
import * as path from "node:path";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { EdgeTTS } from "node-edge-tts";
import { assertPreProductionGate } from "../utils/preProductionGate";

// ─── 路径 ─────────────────────────────────────────
const DATA_DIR = path.resolve(__dirname, "../data");
const VIDEO_SPEC_PATH = path.join(DATA_DIR, "videoSpec.json");
const AUDIO_TIMING_PATH = path.join(DATA_DIR, "audioTiming.json");
const GLOSSARY_PATH = path.join(DATA_DIR, "pronunciationGlossary.json");
const AUDIO_OUTPUT_DIR = path.resolve(
  __dirname,
  "../../../public/audio/voiceover",
);
const AUDIO_PUBLIC_DIR = "audio/voiceover";

// ─── Azure 凭据 ───────────────────────────────────
const AZURE_KEY = process.env.AZURE_SPEECH_KEY?.trim() ?? "";
const AZURE_REGION = process.env.AZURE_SPEECH_REGION?.trim() || "eastasia";
const hasAzure = AZURE_KEY.length > 0;

// ─── 类型 ─────────────────────────────────────────
interface TtsConfig {
  voice?: string;
  rate?: string;
  pitch?: string;
}

interface VideoScene {
  id: string;
  voiceover?: string;
  spokenText?: string;
  tts?: TtsConfig;
  [key: string]: unknown;
}

interface VideoSpec {
  meta: { title: string; fps: number; theme: string; [key: string]: unknown };
  scenes: VideoScene[];
}

interface AudioSegment {
  sceneId: string;
  text: string;
  start: number;
  end: number;
  duration: number;
  provider: string;
  voice: string;
  rate: string;
  pitch: string;
  hash: string;
  filePath: string;
}

interface AudioTiming {
  audioPath: string;
  provider: string;
  providerCapability: string;
  voice: string;
  totalDuration: number;
  segments: AudioSegment[];
}

interface GlossaryEntry {
  spokenDefault: string;
  spokenCasual?: string;
  rule?: string;
}

interface Glossary {
  terms: Record<string, GlossaryEntry>;
}

// ─── Hash 计算 ─────────────────────────────────────
import { createHash } from "node:crypto";

function computeHash(
  text: string,
  voice: string,
  rate: string,
  pitch: string,
): string {
  return createHash("md5")
    .update(`${text}|${voice}|${rate}|${pitch}`)
    .digest("hex")
    .slice(0, 8);
}

// ─── 加载词典 ─────────────────────────────────────
let glossary: Glossary = { terms: {} };
try {
  glossary = JSON.parse(fs.readFileSync(GLOSSARY_PATH, "utf-8"));
} catch {}

// ─── 文本预处理：用词典兜底 ───────────────────────
function applyGlossary(text: string): string {
  let result = text;
  for (const [term, entry] of Object.entries(glossary.terms)) {
    const regex = new RegExp(
      `(?<![\\w])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w])`,
      "g",
    );
    result = result.replace(regex, entry.spokenDefault);
  }
  return result;
}

// ─── 获取 TTS 文本 ────────────────────────────────
function getTtsText(scene: VideoScene): string | null {
  const raw = scene.spokenText || scene.voiceover;
  if (!raw) return null;
  if (scene.spokenText) return scene.spokenText;
  return applyGlossary(raw);
}

// ─── Azure SSML：给英文词加 <lang> 标签 ──────────
function wrapEnglishWords(text: string): string {
  return text.replace(
    /\b([A-Za-z][A-Za-z0-9]*(?:\s+[A-Za-z][A-Za-z0-9]*)*)\b/g,
    (match) => {
      const wordCount = match.trim().split(/\s+/).length;
      if (wordCount <= 3) {
        return `<lang xml:lang="en-US">${match}</lang>`;
      }
      return match;
    },
  );
}

// ─── 构建 Azure SSML ─────────────────────────────
function buildAzureSSML(
  text: string,
  voice: string,
  rate: string,
  pitch: string,
): string {
  const processedText = wrapEnglishWords(text);
  return [
    '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN">',
    `<voice name="${voice}">`,
    `<prosody rate="${rate}" pitch="${pitch}">`,
    processedText,
    "</prosody>",
    "</voice>",
    "</speak>",
  ].join("");
}

// ─── Azure TTS 生成 ───────────────────────────────
function azureSynthesize(ssml: string, outFile: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      AZURE_KEY,
      AZURE_REGION,
    );
    speechConfig.speechSynthesisOutputFormat =
      sdk.SpeechSynthesisOutputFormat.Audio48Khz96KBitRateMonoMp3;

    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(outFile);
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakSsmlAsync(
      ssml,
      (result) => {
        synthesizer.close();
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          // 从音频数据计算时长
          const duration = result.audioDuration
            ? result.audioDuration / 10000000 // 100ns ticks → seconds
            : 0;
          resolve(duration);
        } else {
          reject(new Error(`Azure TTS failed: ${result.errorDetails}`));
        }
      },
      (err) => {
        synthesizer.close();
        reject(err);
      },
    );
  });
}

// ─── Edge TTS 生成 ────────────────────────────────
async function edgeSynthesize(
  text: string,
  voice: string,
  rate: string,
  pitch: string,
  outFile: string,
): Promise<void> {
  const tts = new EdgeTTS({ voice, lang: "zh-CN", rate, pitch });
  await tts.ttsPromise(text, outFile);
}

// ─── 获取音频时长 ─────────────────────────────────
function getAudioDuration(filePath: string): number {
  try {
    const { execFileSync } = require("node:child_process");
    const result = execFileSync(
      "ffprobe",
      [
        "-v",
        "quiet",
        "-show_entries",
        "format=duration",
        "-of",
        "csv=p=0",
        filePath,
      ],
      { encoding: "utf-8", timeout: 5000 },
    );
    return parseFloat(result.trim()) || 0;
  } catch {
    // Edge TTS 默认输出 48kbps MP3 (6000 bytes/sec)
    const stats = fs.statSync(filePath);
    return Math.round((stats.size / 6000) * 10) / 10;
  }
}

// ─── 主流程 ───────────────────────────────────────
async function main() {
  assertPreProductionGate();
  const spec: VideoSpec = JSON.parse(fs.readFileSync(VIDEO_SPEC_PATH, "utf-8"));
  console.log(`视频: ${spec.meta.title}`);
  console.log(`场景数: ${spec.scenes.length}`);
  console.log(`TTS 引擎: ${hasAzure ? "Azure Speech SSML" : "Edge TTS"}`);
  console.log(`词典词条: ${Object.keys(glossary.terms).length}`);

  fs.mkdirSync(AUDIO_OUTPUT_DIR, { recursive: true });

  // 读取现有 audioTiming（用于缓存判断）
  let existingTiming: AudioTiming | null = null;
  try {
    existingTiming = JSON.parse(fs.readFileSync(AUDIO_TIMING_PATH, "utf-8"));
  } catch {}

  const defaultVoice = hasAzure ? "zh-CN-YunxiNeural" : "zh-CN-YunxiNeural";
  const segments: AudioSegment[] = [];
  let currentTime = 0;

  for (const scene of spec.scenes) {
    const ttsText = getTtsText(scene);
    if (!ttsText) {
      console.log(`  [${scene.id}] 无文本，跳过`);
      segments.push({
        sceneId: scene.id,
        text: "",
        start: currentTime,
        end: currentTime,
        duration: 0,
        provider: hasAzure ? "azure-ssml" : "edge-tts",
        voice: defaultVoice,
        rate: "+0%",
        pitch: "+0Hz",
        hash: "",
        filePath: "",
      });
      continue;
    }

    const sceneVoice = scene.tts?.voice || defaultVoice;
    const sceneRate = scene.tts?.rate || "+0%";
    const scenePitch = scene.tts?.pitch || "+0Hz";
    const textHash = computeHash(ttsText, sceneVoice, sceneRate, scenePitch);
    const outFile = path.join(AUDIO_OUTPUT_DIR, `${scene.id}-${textHash}.mp3`);
    const publicFilePath = `${AUDIO_PUBLIC_DIR}/${scene.id}-${textHash}.mp3`;
    const provider = hasAzure ? "azure-ssml" : "edge-tts";

    // 缓存：hash 匹配 + 文件存在 → 跳过
    const existingSeg = existingTiming?.segments.find(
      (s) => s.sceneId === scene.id,
    );
    if (
      existingSeg &&
      existingSeg.hash === textHash &&
      fs.existsSync(outFile)
    ) {
      console.log(`  [${scene.id}] 缓存命中 (hash=${textHash})，跳过`);
      segments.push({
        ...existingSeg,
        start: currentTime,
        end: currentTime + existingSeg.duration,
        filePath: publicFilePath,
      });
      currentTime += existingSeg.duration;
      continue;
    }

    // 生成 TTS
    console.log(`  [${scene.id}] 生成: "${ttsText.substring(0, 40)}..."`);

    let duration: number;
    if (hasAzure) {
      // Azure SSML：自动给英文词加 <lang> 标签
      const ssml = buildAzureSSML(ttsText, sceneVoice, sceneRate, scenePitch);
      console.log(`         [Azure] rate=${sceneRate} pitch=${scenePitch}`);
      duration = await azureSynthesize(ssml, outFile);
    } else {
      // Edge TTS fallback
      console.log(
        `         [Edge] voice=${sceneVoice} rate=${sceneRate} pitch=${scenePitch}`,
      );
      await edgeSynthesize(ttsText, sceneVoice, sceneRate, scenePitch, outFile);
      duration = getAudioDuration(outFile);
    }

    console.log(`  [${scene.id}] 时长: ${duration.toFixed(2)}s`);

    segments.push({
      sceneId: scene.id,
      text: ttsText,
      start: currentTime,
      end: currentTime + duration,
      duration,
      provider,
      voice: sceneVoice,
      rate: sceneRate,
      pitch: scenePitch,
      hash: textHash,
      filePath: publicFilePath,
    });
    currentTime += duration;
  }

  const providerCapability = hasAzure ? "azure/full-ssml" : "edge/prosody-only";

  const audioTiming: AudioTiming = {
    audioPath: AUDIO_PUBLIC_DIR,
    provider: hasAzure ? "azure-ssml" : "edge-tts",
    providerCapability,
    voice: defaultVoice,
    totalDuration: Math.round(currentTime * 100) / 100,
    segments,
  };

  fs.writeFileSync(AUDIO_TIMING_PATH, JSON.stringify(audioTiming, null, 2));
  console.log(`\n完成！总时长: ${audioTiming.totalDuration}s`);
  console.log(`TTS 引擎: ${audioTiming.provider}`);
  console.log(`音频文件: ${AUDIO_OUTPUT_DIR}/`);
  console.log(`时序数据: ${AUDIO_TIMING_PATH}`);
}

main().catch((err) => {
  console.error("生成失败:", err);
  process.exit(1);
});
