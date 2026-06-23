# Migration Candidates — 试验版 → 实践版

## 可以直接迁回实践版

### 1. Director Cue 数据结构

`experimentDirectorCues.ts` 的 cue 数据结构（`DirectorCue` interface、`SceneCueData` interface）可以直接作为实践版 cue 数据的参考。

**条件**：cue 数据需要等 TTS 重新生成后，用 subtitles.json 的实际时间戳替换 `startFrameEstimate`。

### 2. resolveActiveTarget() 函数

cue 解析逻辑可以提取为 `src/video-system/utils/directorCue.ts`，供正式 scene 使用。

**条件**：
- 需要支持正式 videoSpec 的 sceneId 命名
- 需要处理无 cue 时的 fallback（退化为现有 progressiveReveal 逻辑）

### 3. 三档可见性 token

`expHighlightOpacity()` 的三档逻辑（1.0 / 0.65 / 0.4）与实践版一致，可以统一为共享工具函数。

---

## 需要小改后迁回

### 4. ActiveCard 组件思路

ActiveCard 的 cue-driven opacity 逻辑可以应用到正式 TwoColumnScene / ComparisonScene。

**需要改**：
- 接入正式 theme token（当前用 experimentColor）
- 处理 assetLayout 截图模式
- fallback 到现有 progressiveReveal

### 5. TemplateShot 的 progressive-retain 逻辑

S07 的 progressive-retain 模式对正式 todo-checklist 有价值。

**需要改**：
- 接入正式 theme
- 处理正式 videoSpec 的 items 字段
- 确保与 PromptTemplateCard 兼容

### 6. InsightShot 的聚焦设计

"实验结论" 标签 + breathing + 渐变色引言，可以应用到正式 big-quote + visualRole=insight。

**需要改**：
- 接入正式 theme 的 accentGradient
- 处理正式 scene 的 quote/subtitle 字段

---

## 只作为参考

### 7. 动态背景（ExperimentBackground）

试验版的深色动态背景与实践版的白底风格差异大，不建议直接迁回。

**参考价值**：glow 漂移、轻网格的 frame-driven 实现方式可以应用到其他深色主题。

### 8. 色彩 token（experimentColor）

试验版的深色调色板与实践版 xhs-white-editorial 差异大。

**参考价值**：色彩命名体系（primaryText / secondaryText / mutedText / accent）可以作为正式 theme token 的参考。

### 9. 字体 token（experimentTypography）

试验版字号普遍偏大（displayXL = 156px），与实践版经验值（96-104px）差距大。

**参考价值**：14_VISUAL_DESIGN_SYSTEM 的作品级字号目标可以作为长期升级方向。

---

## 不建议迁回

### 10. Shot Grammar 的 shotType 命名

试验版使用独立的 shotType（hook/mistake/setup/evidence/insight/transfer/template/cta），与实践版的 visualRole + type 组合不同。

**原因**：实践版已经有成熟的 type + visualRole + presentationMode 体系，引入新命名会造成混乱。

### 11. 实验内容数据（experimentContent）

试验版的 8 scene 内容是独立数据，不基于正式 videoSpec.json。

**原因**：正式视频数据必须走 contentBrief → videoSpec 流程，不能用硬编码数据。

---

## 迁移优先级

| 优先级 | 能力 | 理由 |
|--------|------|------|
| P0 | resolveActiveTarget() | 核心能力，多处复用 |
| P0 | Director Cue 数据结构 | 基础设施 |
| P1 | ActiveCard 思路 | 提升 S02/S04 视觉质量 |
| P1 | progressive-retain | 提升 S07 模板页价值 |
| P2 | InsightShot 聚焦设计 | 提升 S05 视觉质量 |
| P2 | 三档可见性统一 | 代码复用 |
| P3 | 动态背景参考 | 仅深色主题 |
