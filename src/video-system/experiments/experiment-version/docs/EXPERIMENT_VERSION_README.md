# ExperimentVersionVideo — 试验版系统

## 定位

在主项目内建立的隔离"试验版"系统，验证理想 Remotion 视频生产系统应该长什么样。

- **不是正式实践版**，不替换正式 KnowledgeVideo
- **不修改正式数据**（videoSpec.json / audioTiming.json / subtitles.json / contentBrief.json / coverSpec.json）
- **不渲染 mp4**，仅在 Studio 中检阅

## 启动方式

```bash
npx remotion studio src/index.ts
```

在 Studio 中选择 `ExperimentVersionVideo` Composition。

## 实现的理想能力

### 1. Director Cue Timing

独立 cue 数据，不依赖旧 audioTiming。基于 `durationEstimate` + `spokenText` 语义段估算。

- `experimentDirectorCues.ts` — S02/S04/S06/S07 的 cue 设计
- `resolveActiveTarget()` — 根据当前帧计算 active 目标
- `leadFrames: 10`（0.33 秒 @ 30fps）
- `decayFrames: 15`

### 2. Shot Grammar

5 种镜头模式：

| Shot Type | 视觉中心 | 入场方式 | active state |
|-----------|---------|---------|-------------|
| Hook Shot | 主标题分层 | spring 入场 | 标题 breathing |
| Mistake Shot | 左右卡片 | fadeSlide + cue 切换 | director cue 驱动 |
| Evidence Shot | 左右证据 | fadeSlide + cue 切换 | director cue 驱动 |
| Insight Shot | 结论聚焦 | spring + breathing | 标签 breathing |
| Template Shot | 模板项 | progressive-retain | cue 驱动，最终稳定 |

### 3. Frame-driven Motion System

全部使用 Remotion 官方 API：

- `useCurrentFrame()`
- `interpolate()`
- `spring()`
- `Sequence`
- `TransitionSeries`

禁止：CSS transition, CSS animation, @keyframes, Tailwind animate-*

### 4. Premium Visual（克制）

- subtle background drift（glow 缓慢漂移）
- low-opacity glow（最大 0.06 opacity）
- active card lift（cue 驱动时轻微放大）
- staggered reveal（步骤/清单逐个出现）
- cue-driven active state（S02/S04/S06/S07）
- progressive-retain（S07 模板页）
- button pulse（CTA 呼吸效果）

### 5. Cue-driven Active State

S02/S04/S06/S07 的 active timing 由 director cue 驱动：

- S02：左卡先 active → 右卡接管
- S04：左证据 active → 右证据 active → 对比结论
- S06：第一栏 → 第二栏 → 第三栏收束
- S07：progressive-retain 模式，最终全体稳定

## 文件结构

```
src/video-system/experiments/experiment-version/
├── ExperimentVersionComposition.tsx    # 主 Composition
├── ExperimentSceneRenderer.tsx         # 场景分发器
├── experimentContent.ts                # 8 scene 内容数据
├── experimentDirectorCues.ts           # director cue + resolveActiveTarget
├── tokens/
│   ├── experimentColor.ts              # 色彩 token
│   ├── experimentTypography.ts         # 字体 token
│   ├── experimentLayout.ts             # 布局 token
│   └── experimentMotion.ts             # 动效 token
├── components/
│   ├── ExperimentBackground.tsx        # 动态背景
│   ├── KineticTitle.tsx                # 动感标题
│   ├── ActiveCard.tsx                  # cue 驱动的卡片
│   ├── EvidenceShot.tsx                # 证据卡片
│   ├── InsightShot.tsx                 # 结论聚焦
│   ├── TemplateShot.tsx                # 模板页
│   └── MotionButton.tsx               # CTA 按钮
├── scenes/
│   ├── ExperimentHookScene.tsx         # S01
│   ├── ExperimentMistakeScene.tsx      # S02
│   ├── ExperimentSetupScene.tsx        # S03
│   ├── ExperimentEvidenceScene.tsx     # S04
│   ├── ExperimentInsightScene.tsx      # S05
│   ├── ExperimentTransferScene.tsx     # S06
│   ├── ExperimentTemplateScene.tsx     # S07
│   └── ExperimentCtaScene.tsx          # S08
└── docs/
    ├── EXPERIMENT_VERSION_README.md
    ├── STUDIO_REVIEW_GUIDE.md
    ├── MIGRATION_CANDIDATES.md
    └── LOOP_PROGRESS_LOG.md
```

## 隔离保证

- 仅修改 `src/Root.tsx`（新增一行 Composition 注册）
- 不修改任何正式 scene / component / theme / data 文件
- 不渲染 mp4
- 不生成 TTS / 字幕 / 封面
