/**
 * 主题注册表
 *
 * 通过 theme ID 获取主题 token。
 * 新增主题时只需在这里注册即可。
 */

import type { VideoTheme, ThemeId } from "./types";
import { xhsWhiteEditorial } from "./xhsWhiteEditorial";
import { knowledgeBlueprint } from "./knowledgeBlueprint";
import { minimalWhite } from "./minimalWhite";
import { neoBrutalism } from "./neoBrutalism";
import { auroraTheme } from "./auroraTheme";
import { obsidianClaudeGradient } from "./obsidianClaudeGradient";
import { testingSafetyAlert } from "./testingSafetyAlert";
import { xhsPastelCard } from "./xhsPastelCard";

export type { VideoTheme, ThemeId };

const THEMES: Record<ThemeId, VideoTheme> = {
  "xhs-white-editorial": xhsWhiteEditorial,
  "knowledge-blueprint": knowledgeBlueprint,
  "minimal-white": minimalWhite,
  "neo-brutalism": neoBrutalism,
  aurora: auroraTheme,
  "obsidian-claude-gradient": obsidianClaudeGradient,
  "testing-safety-alert": testingSafetyAlert,
  "xhs-pastel-card": xhsPastelCard,
};

export function getTheme(id: string): VideoTheme {
  const theme = THEMES[id as ThemeId];
  if (!theme) {
    // 回退时清除 presentationMode，避免非法 theme ID 静默触发 lab 变体
    return { ...xhsWhiteEditorial, presentationMode: "default" };
  }
  return theme;
}

export function listThemes(): VideoTheme[] {
  return Object.values(THEMES);
}

export {
  xhsWhiteEditorial,
  knowledgeBlueprint,
  minimalWhite,
  neoBrutalism,
  auroraTheme,
  obsidianClaudeGradient,
  testingSafetyAlert,
  xhsPastelCard,
};
