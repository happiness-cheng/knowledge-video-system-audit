# Knowledge Video System — 技术模块说明

本文件是 `src/video-system/` 目录的技术参考，不定义生产流程。

生产流程、门禁、权限模型和修改路由以以下文件为准：

- 根入口：`CLAUDE.md` / `AGENTS.md`
- 详细契约：`docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md`
- 制作前门禁：`knowledge-video-system/prompts/17_PREPRODUCTION_REVIEW_GATE.md`
- 修改路由：`knowledge-video-system/prompts/18_REVISION_ROUTER.md`

## 模块结构

```
src/video-system/
├── compositions/     # Remotion Composition（正式 + fixture）
├── scenes/           # Scene 组件与 SceneRenderer
├── themes/           # 8 个主题注册表
├── components/       # 共享 UI 组件
├── utils/            # 工具函数、门禁、schema
├── scripts/          # 验证、生成、门禁脚本
├── visual/           # 能力注册表、scene contracts
├── data/             # JSON 数据文件
├── fixtures/         # 测试 fixture
├── experiments/      # 实验组件（不经过生产门禁）
└── labs/             # 实验室组件（不经过生产门禁）
```

## 正式能力

以 `src/video-system/visual/capabilityRegistry.ts` 为唯一真源。

- 22 个 scene type
- 8 个主题
- 5 个 semantic patterns

## 核心文件

| 文件 | 职责 |
|------|------|
| `compositions/KnowledgeVideo.tsx` | 主视频 Composition |
| `compositions/KnowledgeVideoWithSubtitles.tsx` | 带字幕版 Composition |
| `compositions/CoverComposition.tsx` | 封面 Composition |
| `scenes/SceneRenderer.tsx` | 场景分发器 |
| `themes/index.ts` | 主题注册表 |
| `visual/capabilityRegistry.ts` | 能力注册表 |
| `utils/preProductionGate.ts` | 制作前机器门禁 |
| `utils/qualityScoreGate.ts` | 发布门禁 |
| `scripts/generate-audio.ts` | TTS 音频生成 |
| `scripts/generate-subtitles.ts` | 字幕生成 |

## 实验与生产隔离

- `experiments/` 和 `labs/` 中的组件不经过制作前门禁
- `npm run studio:lab` 使用独立 entry（`src/lab.ts`），只注册实验 Composition
- 实验入口不得作为正式生产门禁的绕过路径

## 数据文件

| 文件 | 说明 |
|------|------|
| `data/videoSpec.json` | 正式场景定义 |
| `data/contentBrief.json` | 内容策划 |
| `data/audioTiming.json` | TTS 时序（自动生成） |
| `data/subtitles.json` | 字幕（自动生成） |
| `data/coverSpec.json` | 封面渲染数据 |
| `data/preProductionReview.json` | 制作前审查状态 |
| `data/qualityScore.json` | 发布评分 |
