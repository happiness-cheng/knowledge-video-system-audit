# LOOP_PROGRESS_LOG — ExperimentVersionVideo

## Phase 0: 理解项目 + 建目录

- [x] 读取 AGENTS.md
- [x] 读取 remotion-best-practices SKILL.md
- [x] 读取 13_REFERENCE_BASIS_AND_BEST_PRACTICES.md
- [x] 读取 14_VISUAL_DESIGN_SYSTEM_V1_ALPHA.md
- [x] 读取 07_STYLE_THEME_LAYOUT_RULES.md
- [x] 读取 06_PREVIEW_REVIEW_PROMPT.md
- [x] 读取 videoSpec.json
- [x] 读取 KnowledgeVideo.tsx
- [x] 读取 SceneRenderer.tsx
- [x] 读取 ComparisonScene.tsx
- [x] 读取 BigQuoteScene.tsx
- [x] 读取 EvidenceBlock.tsx
- [x] 读取 premium-motion-lab/ 全部文件
- [x] 读取 P1_2I_DIRECTOR_CUES_DRAFT.json
- [x] 读取 P1_2I_CUE_TIMING_NOTES.md
- [x] 建目录结构
- [x] 输出 Project Understanding Report

## Phase 1: Tokens + Director Cues + Content

- [x] experimentColor.ts — 色彩 token
- [x] experimentTypography.ts — 字体 token
- [x] experimentLayout.ts — 布局 token
- [x] experimentMotion.ts — 动效 token（fadeSlideIn / springIn / progressiveReveal / highlightOpacity / gentlePulse）
- [x] experimentContent.ts — 8 scene 内容数据 + 帧数计算
- [x] experimentDirectorCues.ts — S02/S04/S06/S07 cue 数据 + resolveActiveTarget()

## Phase 2: Components

- [x] ExperimentBackground.tsx — 动态背景（glow 漂移 + 轻网格）
- [x] KineticTitle.tsx — 动感标题（spring 入场 + 关键词高亮）
- [x] ActiveCard.tsx — cue 驱动的卡片（opacity + scale + border）
- [x] EvidenceShot.tsx — 证据卡片（标签 + 证据区 + 结论）
- [x] InsightShot.tsx — 结论聚焦（标签 breathing + 渐变色引言）
- [x] TemplateShot.tsx — 模板页（progressive-retain + 填空线）
- [x] MotionButton.tsx — CTA 按钮（呼吸脉冲）

## Phase 3: Scenes

- [x] ExperimentHookScene.tsx — S01 Hook Shot（标题分层入场）
- [x] ExperimentMistakeScene.tsx — S02 Mistake Shot（cue 驱动 active）
- [x] ExperimentSetupScene.tsx — S03 Setup Shot（步骤逐步出现）
- [x] ExperimentEvidenceScene.tsx — S04 Evidence Shot（cue 驱动证据 active）
- [x] ExperimentInsightScene.tsx — S05 Insight Shot（聚焦结论）
- [x] ExperimentTransferScene.tsx — S06 Transfer Shot（cue 驱动三栏 active）
- [x] ExperimentTemplateScene.tsx — S07 Template Shot（progressive-retain）
- [x] ExperimentCtaScene.tsx — S08 CTA Shot

## Phase 4: Composition + Registration

- [x] ExperimentSceneRenderer.tsx — 场景分发器
- [x] ExperimentVersionComposition.tsx — 主 Composition（TransitionSeries）
- [x] Root.tsx — 新增 ExperimentVersionVideo Composition 注册

## Phase 5: Verification

- [x] `npx tsc --noEmit` — 通过
- [x] `npm run validate:all` — 通过（警告是已有字幕问题，非本轮引入）
- [x] 实践版文件未被修改 — `git diff -- src/video-system/data/ src/video-system/compositions/ src/video-system/scenes/ src/video-system/themes/ src/video-system/components/` 输出为空
- [x] 未渲染 mp4 — 确认

## Phase 6: Docs

- [x] EXPERIMENT_VERSION_README.md
- [x] STUDIO_REVIEW_GUIDE.md
- [x] MIGRATION_CANDIDATES.md
- [x] LOOP_PROGRESS_LOG.md

## 最终报告

### 完成的阶段

Phase 0-6 全部完成。

### 新增文件列表

共 22 个文件，全部在 `src/video-system/experiments/experiment-version/` 下：

- `ExperimentVersionComposition.tsx`
- `ExperimentSceneRenderer.tsx`
- `experimentContent.ts`
- `experimentDirectorCues.ts`
- `tokens/experimentColor.ts`
- `tokens/experimentTypography.ts`
- `tokens/experimentLayout.ts`
- `tokens/experimentMotion.ts`
- `components/ExperimentBackground.tsx`
- `components/KineticTitle.tsx`
- `components/ActiveCard.tsx`
- `components/EvidenceShot.tsx`
- `components/InsightShot.tsx`
- `components/TemplateShot.tsx`
- `components/MotionButton.tsx`
- `scenes/ExperimentHookScene.tsx`
- `scenes/ExperimentMistakeScene.tsx`
- `scenes/ExperimentSetupScene.tsx`
- `scenes/ExperimentEvidenceScene.tsx`
- `scenes/ExperimentInsightScene.tsx`
- `scenes/ExperimentTransferScene.tsx`
- `scenes/ExperimentTemplateScene.tsx`
- `scenes/ExperimentCtaScene.tsx`
- `docs/EXPERIMENT_VERSION_README.md`
- `docs/STUDIO_REVIEW_GUIDE.md`
- `docs/MIGRATION_CANDIDATES.md`
- `docs/LOOP_PROGRESS_LOG.md`

### 修改文件列表

- `src/Root.tsx` — 新增 1 个 Composition 注册（ExperimentVersionVideo）

### Studio Composition 名称

`ExperimentVersionVideo`

### 如何启动 Studio

```bash
npx remotion studio src/index.ts
```

### 验证结果

- typecheck: 通过
- validate:all: 通过（警告是已有字幕问题，非本轮引入）
- git diff: 生产文件零修改

### 试验版实现了哪些理想能力

1. Director Cue Timing（独立 cue 数据 + resolveActiveTarget）
2. Shot Grammar（5 种镜头模式）
3. Frame-driven Motion System（spring / interpolate / Sequence / TransitionSeries）
4. Cue-driven Active State（S02/S04/S06/S07）
5. Progressive-retain（S07 模板页）
6. Premium Visual（克制的背景漂移、active lift、breathing）

### 哪些能力建议迁回实践版

1. resolveActiveTarget() — 核心能力
2. Director Cue 数据结构 — 基础设施
3. ActiveCard 思路 — 提升视觉质量
4. progressive-retain — 模板页价值

### 哪些能力不建议迁回

1. ShotType 命名 — 与实践版 type + visualRole 体系冲突
2. 实验内容数据 — 正式数据必须走 contentBrief → videoSpec 流程
3. 深色调色板 — 与实践版白底风格差异大

### 仍需人工 Studio 审片的问题

1. 字号是否在手机端足够可读
2. cue 切换时机是否与口播预期匹配
3. progressive-retain 的可见性梯度是否合适
4. 动态背景是否过于抢眼
