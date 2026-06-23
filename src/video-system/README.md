# Knowledge Video System

新会话入口文件。读完这个文件就能执行任务。

## 这是什么

知识短视频制作系统。用 Remotion 从 videoSpec.json 数据驱动渲染视频。

不是 HTML PPT 截图，是 Remotion 原生组件 + 主题 token + 动画系统。

## 快速开始

```bash
# 启动 Studio 预览
npx remotion studio src/index.ts

# 找到 KnowledgeVideo Composition，切换主题改 videoSpec.json 的 theme 字段

# 生成 TTS 音频
npx tsx src/video-system/scripts/generate-audio.ts
```

## 数据流

```
contentBrief.json（内容取舍 + 节拍设计）
    ↓
videoSpec.json（画面 + 口播 + 布局 + 动画）
    ↓
generate-audio.ts → audioTiming.json（TTS 音频时序）
    ↓
KnowledgeVideo.tsx 合并读取 videoSpec + audioTiming
    ↓
SceneRenderer 根据 scene.type 分发到对应组件
    ↓
Remotion 渲染 → MP4
```

## 核心文件

| 文件                                | 干什么                 |
| ----------------------------------- | ---------------------- |
| `data/videoSpec.json`               | 改这个文件来制作新视频 |
| `data/contentBrief.json`            | 内容策划（不进渲染）   |
| `data/audioTiming.json`             | TTS 生成物（自动生成） |
| `data/pronunciationGlossary.json`   | TTS 发音词典           |
| `data/coverBrief.json`              | 封面讨论稿（不进渲染） |
| `data/coverSpec.json`               | 封面渲染数据           |
| `data/assetManifest.json`           | 截图、角色等素材登记   |
| `data/subtitles.json`               | 口播同步字幕           |
| `data/publishMetadata.json`         | 双标题、双简介、标签   |
| `data/qualityScore.json`            | 唯一完整质量评分       |
| `compositions/KnowledgeVideo.tsx`   | 主 Composition         |
| `compositions/CoverComposition.tsx` | 封面 Composition       |
| `scenes/SceneRenderer.tsx`          | 场景分发器             |
| `themes/index.ts`                   | 8 个主题注册表         |
| `scripts/generate-audio.ts`         | TTS 音频生成           |

## 8 个主题

在 videoSpec.json 的 `meta.theme` 字段切换：

| ID                       | 名称               |
| ------------------------ | ------------------ |
| xhs-white-editorial      | 白底杂志风（默认） |
| knowledge-blueprint      | 知识架构蓝图       |
| minimal-white            | 极简白             |
| neo-brutalism            | 新野蛮主义         |
| aurora                   | 极光               |
| obsidian-claude-gradient | Obsidian 渐变      |
| testing-safety-alert     | 测试安全警示       |
| xhs-pastel-card          | 小红书粉彩卡       |

## 22 个场景类型

在 videoSpec.json 的 `scenes[].type` 字段选择：

cover, big-quote, title-subtitle, bullets, comparison, two-column, three-column, pros-cons, todo-checklist, stat-highlight, process-steps, flow-diagram, roadmap, timeline, mindmap, section-divider, cta, code, diff, terminal, image-hero, gantt

**Locked candidate（未实现前仍不可用于正式 videoSpec）**：当前无

这些类型不是永久禁用，而是能力门控候选。只有对应组件、SceneRenderer 接线、scene contract、fixture / still 验证、提示词能力清单和 validator 都完成后，才允许逐个解锁。未解锁前仍用现有 scene type 转译表达。

能力状态以机器可读注册表为准：

```text
src/video-system/visual/capabilityRegistry.ts
```

22 个 scene type 不是同等级导演核心。旧页面型 scene 多数属于 `legacy-support`，适合作为呼吸、小结、辅助说明和行动号召；核心解释优先使用 `production-validated` 的 semantic shot pattern 或知识对象 scene。不要继续把“优化每个 PPT scene”当作系统升级方向。

`code`、`diff`、`terminal`、`image-hero`、`gantt` 已解锁为正式 scene type，但都有能力边界：短代码逐行讲解、短前后变化、短命令结果、一张主图讲解、轻量执行链路。`image-hero` 内部支持最多 3 个受控区域框 / 指向线 / 局部放大窗；不要把它们误用成长文档、长日志、长图滚动、交互式 IDE、任意标注编辑器或复杂项目管理甘特图。

当前第一批 Semantic Shot Core：

| semantic shot | 状态 | 正式落地方式 |
| --- | --- | --- |
| pressure-build | production-validated | cover + semanticPattern=pressure-build |
| fragment-to-manual | production-validated | flow-diagram + semanticPattern=fragment-to-manual |
| detour-vs-direct | production-validated | comparison + semanticPattern=detour-vs-direct-path |
| wrong-to-correct | production-validated | big-quote + semanticPattern=wrong-to-correct |
| confused-to-guided | production-validated | two-column + semanticPattern=confused-to-guided |
| map-light-up | internal-wired | MapLightUp 内部组件 / 特定分支 |

## 每个 scene 必须包含的字段

```json
{
  "id": "S01",
  "beatId": "B01",
  "beatRole": "hook",
  "visualRole": "hook",
  "attentionTrigger": "pain",
  "type": "cover",
  "durationEstimate": 5,
  "voiceover": "人看的口播",
  "spokenText": "TTS 读的口语化文本",
  "screenText": "画面主文案",
  "animation": "slow-zoom"
}
```

加上 type 特有字段（见 scenes/\*.tsx 的 interface）。

## TTS 流程

1. videoSpec.json 写好 spokenText
2. 运行 `npx tsx src/video-system/scripts/generate-audio.ts`
3. 自动读取 .env 中的 AZURE_SPEECH_KEY
4. 生成 mp3 到 public/audio/voiceover/
5. 写入 audioTiming.json（每段的 start/end/duration）
6. KnowledgeVideo.tsx 自动根据 audioTiming 控制场景时长

## 动画模式

| 模式               | 适合场景               |
| ------------------ | ---------------------- |
| fade-in            | 通用                   |
| slow-zoom          | 封面、数据高亮         |
| slide-up           | 要点列表               |
| progressive-reveal | 结构型页面（逐个出现） |
| highlight-current  | 结构型页面（当前高亮） |

## 给网页版 AI 的提示词

`knowledge-video-system/prompts/` 目录下有 13 个提示词文件，发给网页版 ChatGPT 即可：

- 00：系统能力清单（必读）
- 01：流程总览
- 02：文章 → contentBrief
- 03：contentBrief → videoSpec
- 04：素材接入
- 05：TTS 文本处理
- 06：审片指南
- 07：风格/主题/布局规则
- 08：videoSpec → coverBrief（封面讨论）
- 09：coverBrief → coverSpec（封面规格）
- 10：视频 → 通用发布元数据
- 11：最终评分与发布门禁
- 12：spokenText → 同步字幕

## 如何新增视频

1. 用网页版 AI 生成 contentBrief.json
2. 用网页版 AI 从 contentBrief 生成 videoSpec.json
3. 把 videoSpec.json 复制到 `data/videoSpec.json`
4. 用网页版 AI 从 contentBrief + videoSpec 生成 coverBrief.json
5. 用网页版 AI 从 coverBrief 生成 coverSpec.json
6. 运行 generate-audio.ts 生成音频
7. Studio 预览，调整
8. 渲染视频：`npx remotion render KnowledgeVideo --output=out/video.mp4 --codec=h264`
9. 渲染双封面：`npx remotion still CoverImage3x4 --output=out/cover-3x4.png` 和 `npx remotion still CoverImage4x3 --output=out/cover-4x3.png`

执行前必须读取结构化授权：

- TTS、字幕、视频预览：`videoSpec.qualityGate = continue + approvedByUser: true`
- 双封面：还要求 `coverSpec.approval = continue + approvedByUser: true`
- Release Package：要求 previewGate 已 `continue`、publishMetadata.approval 已 `continue`、qualityScore 已 `publish`，并且所有授权为 true、`hardGatePassed = true`

## 背景系统

每个场景自动带：

- 左上角：场景进度（玻璃质感卡片）
- 右上角：品牌头像 + 名称
- 进度条：badges 下方，跟着当前场景走
- 背景层：极浅光晕或网格

## 已知规则

- voiceover 给人看，spokenText 给 TTS 读
- 英文缩写优先自然避开（AI → 这些工具/它）
- 每页最多 3 个核心信息点
- 字号下限：正文 28px、卡片 26px、标签 18px
- 结构型页面用 3 级可见性：当前 1.0、相邻 0.65、其他 0.4
