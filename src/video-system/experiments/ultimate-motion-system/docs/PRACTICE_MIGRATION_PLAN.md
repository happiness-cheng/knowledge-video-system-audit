# Practice Migration Plan

## P0: 只迁 cue system / resolveActiveTarget

- 提取 `resolveActiveTarget()` 到 `src/video-system/utils/directorCue.ts`
- 提取 `LabCue` / `LabSceneCueData` 类型定义
- 不改任何 scene 组件
- 预计改动：2 个新文件

## P1: 迁 progressive-retain / ActiveCard

- 在 TodoChecklistScene 中接入 progressive-retain
- 在 TwoColumnScene 中接入 CueActiveCard 思路
- 预计改动：2 个 scene 文件

## P2: 迁 EvidencePanel / TemplatePanel

- 在 ComparisonScene 中使用 EvidencePanel 变体
- 在 TodoChecklistScene 中使用 TemplatePanel 变体
- 预计改动：2 个 scene 文件

## P3: 迁 KineticTitle / TransitionGallery

- 在 CoverScene / BigQuoteScene 中使用 KineticTitleSystem
- 在 KnowledgeVideo.tsx 中尝试更多转场
- 预计改动：3 个文件

## P4: 迁 BackgroundSystem theme variants

- 为 8 个正式 theme 创建对应的 BackgroundSystem 变体
- 预计改动：1 个新文件 + theme 配置
