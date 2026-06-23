# V2 Build Report — Ultimate Motion System Lab

## 一、项目概述

### 1.1 定位

在主项目内建立的隔离"试验版"系统，用来最大化探索 Remotion 在知识短视频中的能力边界，并沉淀未来可以迁回实践版的组件、镜头语法、动效系统、资产库和 QA 体系。

### 1.2 与实践版的关系

| 维度 | 实践版 | V2 |
|------|--------|-----|
| 路径 | `src/video-system/` 主线 | `src/video-system/experiments/ultimate-motion-system/` |
| 定位 | 正式生产系统 | 工程级实验室 |
| 数据 | videoSpec.json 驱动 | labContent.ts 硬编码 |
| 隔离 | 不可修改 | 独立目录，不污染实践版 |

### 1.3 隔离保证

- 仅修改 `src/Root.tsx`（新增一行 Composition 注册）
- 不修改任何正式 data / scene / component / theme 文件
- 不渲染 mp4
- 不生成 TTS / 字幕 / 封面

---

## 二、Remotion 能力使用清单

### 2.1 核心 API（全部使用）

| API | 用途 | 使用位置 |
|-----|------|---------|
| `useCurrentFrame()` | 获取当前帧 | 全部组件 |
| `useVideoConfig()` | 获取 fps / 尺寸 | 全部组件 |
| `interpolate()` | 数值映射 | 动效原语 / 组件 |
| `spring()` | 弹性动画 | springEnter / 标题入场 |
| `Easing.bezier()` | 自定义缓动 | 4 条缓动曲线 |
| `Sequence` | 时间轴控制 | 音频定位 / 子组件帧 |
| `AbsoluteFill` | 全屏容器 | Composition / Background |
| `TransitionSeries` | 场景间转场 | 15 个 scene |
| `staticFile()` | 引用 public 资源 | 图片 / 音频 |
| `<Img>` | 图片组件 | 截图 / 角色 / 头像 |
| `<Audio>` | 音频组件 | S01-S08 口播 |

### 2.2 扩展包（已集成）

| 包名 | 用途 | 集成状态 |
|------|------|---------|
| `@remotion/google-fonts` | NotoSansSC 中文字体 | ✅ 已集成 |
| `@remotion/transitions` | fade / slide / wipe 转场 | ✅ 已集成 |
| `@remotion/media-utils` | 音频工具 | 已安装，可用 |
| `@remotion/zod-types` | Zod schema 类型 | 已安装，可用 |
| `@remotion/shapes` | SVG 形状 | 已安装，可用 |
| `@remotion/paths` | SVG 路径动画 | 已安装，可用 |
| `@remotion/player` | 嵌入式播放器 | 已安装，可用 |

### 2.3 转场系统

使用 `@remotion/transitions` 的多种转场：

```typescript
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
```

15 个 scene 交替使用不同转场：
- fade（安全默认）
- slide（from-left / from-right / from-bottom）
- wipe（from-left / from-right）

### 2.4 字体系统

使用 `@remotion/google-fonts` 加载 NotoSansSC：

```typescript
import { loadFont as loadNotoSansSC } from "@remotion/google-fonts/NotoSansSC";
const { fontFamily } = loadNotoSansSC();
```

应用到整个 Composition 的 `style={{ fontFamily }}`。

### 2.5 音频系统

S01-S08 各有独立口播音频：

```typescript
<Audio src={staticFile("audio/voiceover/S01.mp3")} volume={0.9} />
```

通过 `<Sequence from={startFrame}>` 精确定位每个 scene 的音频起始帧。

### 2.6 字幕系统

自研 `SubtitleOverlay` 组件：

- 从 spokenText 按中文标点分割
- 按 scene 时长均匀分配字幕段
- 淡入淡出动画（5 帧）
- 半透明毛玻璃背景
- 底部安全区定位

### 2.7 图片素材

使用真实素材：

| 素材 | 路径 | 使用位置 |
|------|------|---------|
| ChatGPT 对话截图（改前） | `assets/processed/chatgpt-before-evidence-focus.png` | EvidencePanel / EvidenceGallery |
| ChatGPT 对话截图（改后） | `assets/processed/chatgpt-after-evidence-focus.png` | EvidencePanel / EvidenceGallery |
| ChatGPT 对话截图（裁剪） | `assets/processed/chatgpt-before-crop.png` / `chatgpt-after-crop.png` | EvidenceGallery |
| 角色头像 | `assets/processed/xiaochen-thinking.png` | HookShot |
| 品牌头像 | `assets/avatar.png` | CtaShot / SceneHeader |

---

## 三、组件库

### 3.1 Motion Primitives（9 个）

底层动效原语，所有高级组件的基础：

| 组件 | 文件 | 用途 |
|------|------|------|
| MotionBox | `primitives/MotionBox.tsx` | 带 fadeSlide 入场的容器 |
| MotionText | `primitives/MotionText.tsx` | 带入场动画的文字 |
| MotionCard | `primitives/MotionCard.tsx` | 带 active 状态的卡片 |
| MotionImage | `primitives/MotionImage.tsx` | 图片容器（Img + staticFile） |
| MotionBadge | `primitives/MotionBadge.tsx` | 标签/徽章 |
| MotionProgress | `primitives/MotionProgress.tsx` | 进度条 |
| MotionFrame | `primitives/MotionFrame.tsx` | 带边框的框架容器 |
| MotionGrid | `primitives/MotionGrid.tsx` | 网格布局容器 |
| MotionDivider | `primitives/MotionDivider.tsx` | 分隔线 |

### 3.2 High-level Components（16 个）

高级业务组件：

| 组件 | 文件 | 用途 |
|------|------|------|
| BackgroundSystem | `components/BackgroundSystem.tsx` | 3 种动态背景（dark-glow / white-drift / blueprint-grid） |
| KineticTitleSystem | `components/KineticTitleSystem.tsx` | 4+ 种标题变体（split / contrast / kinetic / pain-point / conclusion） |
| CueActiveCard | `components/CueActiveCard.tsx` | cue 驱动 active 的卡片 |
| EvidencePanel | `components/EvidencePanel.tsx` | 证据面板（支持真实截图） |
| EvidenceCompare | `components/EvidenceCompare.tsx` | 左右证据对比 |
| InsightPanel | `components/InsightPanel.tsx` | 结论聚焦面板 |
| TemplatePanel | `components/TemplatePanel.tsx` | 模板页面板（progressive-retain） |
| PromptBuildCard | `components/PromptBuildCard.tsx` | prompt 卡逐步补全 |
| TimelineCueBar | `components/TimelineCueBar.tsx` | cue 时间轴可视化 |
| SemanticHighlight | `components/SemanticHighlight.tsx` | 语义块高亮 |
| FocusRing | `components/FocusRing.tsx` | 聚焦光环 |
| MotionButton | `components/MotionButton.tsx` | CTA 按钮（呼吸脉冲） |
| SceneHeader | `components/SceneHeader.tsx` | 场景标题区（可选品牌头像） |
| SubtitleOverlay | `components/SubtitleOverlay.tsx` | 口播同步字幕 |
| AudioVisualizer | `components/AudioVisualizer.tsx` | 音频波形可视化 |

### 3.3 工具函数（8 个）

| 工具 | 文件 | 用途 |
|------|------|------|
| resolveActiveTarget | `utils/resolveActiveTarget.ts` | cue 驱动 active 状态计算 |
| cueTiming | `utils/cueTiming.ts` | 语义段帧数分配 |
| motionCurves | `utils/motionCurves.ts` | 缓动曲线库 |
| textLayout | `utils/textLayout.ts` | 中文文本布局工具 |
| mobileScale | `utils/mobileScale.ts` | 手机端缩放工具 |
| shotTiming | `utils/shotTiming.ts` | Shot 时序计算 |
| fontLoader | `utils/fontLoader.ts` | Google Fonts 加载器 |

---

## 四、动效系统

### 4.1 16 种 Motion Primitives

| # | 名称 | 用途 | 迁移性 |
|---|------|------|--------|
| 1 | springEnter | 弹性入场 | direct |
| 2 | fadeSlide | 淡入+滑入 | direct |
| 3 | staggerReveal | 逐个出现 | direct |
| 4 | cueActive | cue 驱动 active | direct |
| 5 | progressiveRetain | 逐步激活保持 | direct |
| 6 | breathe | 极轻微呼吸 | direct |
| 7 | pulse | 脉冲缩放 | direct |
| 8 | focusGlow | 聚焦发光 | minor-edit |
| 9 | cardLift | 卡片抬起 | direct |
| 10 | evidenceFocus | 证据聚焦 | minor-edit |
| 11 | textEmphasis | 文字强调 | minor-edit |
| 12 | backgroundDrift | 背景漂移 | minor-edit |
| 13 | semanticHighlight | 语义块高亮 | direct |
| 14 | transitionFade | fade 转场 | direct |
| 15 | transitionSlide | slide 转场 | minor-edit |
| 16 | transitionWipe | wipe 转场 | reference-only |

### 4.2 缓动曲线

```typescript
EASE_OUT_CRISP      = Easing.bezier(0.16, 1, 0.3, 1)    // 入场
EASE_IN_OUT_EDITORIAL = Easing.bezier(0.45, 0, 0.55, 1)  // 渐变
EASE_OVERSHOOT      = Easing.bezier(0.34, 1.56, 0.64, 1) // 强调
EASE_SPRING         = Easing.bezier(0.22, 1.2, 0.36, 1)  // 弹性
```

### 4.3 Spring 配置

```typescript
spring:       { damping: 12, stiffness: 100, mass: 0.5 }
springBouncy: { damping: 8,  stiffness: 120, mass: 0.4 }
springCalm:   { damping: 18, stiffness: 80,  mass: 0.6 }
```

---

## 五、Director Cue System

### 5.1 Cue 数据结构

```typescript
interface LabCue {
  cueId: string;
  spokenAnchor: string;
  target: string;
  startFrameEstimate: number;
  holdFrames: number;
  leadFrames: number;
  support: "draft-estimate" | "draft-director" | "reference-only";
}
```

### 5.2 消费方式

```typescript
const cues = getLabSceneCues("S02");
const { activeTarget, targetOpacity } = resolveActiveTarget(
  frame, cues.cues, DECAY_FRAMES, "strict-switch"
);
// targetOpacity("left") → 0.4~1.0
```

### 5.3 支持的模式

- **strict-switch**: 当前 active 最亮（1.0），相邻 0.65，其他 0.4
- **progressive-retain**: 已激活保持较高可见性（0.7-1.0），最终全体稳定

### 5.4 Cue 配置

- leadFrames: 10（0.33 秒 @ 30fps）— 画面领先口播
- decayFrames: 15 — 切换衰减
- minHoldFrames: 45 — 最小保持

---

## 六、Shot Grammar（8 种）

| # | Shot Type | 视觉中心 | 入场策略 | active state |
|---|-----------|---------|---------|-------------|
| 1 | Hook | 标题分层 | spring 入场 | 标题 breathing |
| 2 | Mistake | 左右卡片 | fadeSlide + cue 切换 | director cue 驱动 |
| 3 | Setup | 步骤逐步 | staggerReveal | 当前步骤高亮 |
| 4 | Evidence | 左右证据 | fadeSlide + cue 切换 | director cue 驱动 |
| 5 | Insight | 结论聚焦 | spring + breathing | 标签 breathing |
| 6 | Transfer | 三栏切换 | fadeSlide + cue 切换 | director cue 驱动 |
| 7 | Template | 模板项 | fadeSlide 逐项 | progressive-retain |
| 8 | CTA | 按钮 pulse | spring + fadeSlide | 按钮脉冲 |

---

## 七、Gallery 系统（7 个）

| Gallery | 展示内容 |
|---------|---------|
| Component Gallery | 9 种 primitive 组件 |
| Motion Primitive Gallery | 7+ 种动效原语数值展示 |
| Evidence Variants Gallery | 4 种证据页变体（含真实截图） |
| Template Variants Gallery | 3 种模板页变体 |
| Title Variants Gallery | 4 种标题变体 |
| Transition Gallery | 4 种转场方式 |
| Mobile Readability Gallery | 手机端字号投影对比 |

---

## 八、Composition 结构

### 8.1 Part A: 成片实验（S01-S08）

8 个高质量 scene，使用 AI 提问主题：

1. Hook Shot — 痛点开场（角色头像 + 标题分层）
2. Mistake Shot — 错误现场（cue 驱动左右切换）
3. Experiment Setup — 变量改变（步骤逐步出现）
4. Evidence Shot — 证据对比（真实 ChatGPT 截图）
5. Insight Shot — 结论聚焦（breathing + 渐变色）
6. Transfer Shot — 迁移证明（三栏 cue 切换）
7. Template Shot — 可截图模板（progressive-retain）
8. CTA Shot — 行动号召（品牌头像 + 按钮 pulse）

### 8.2 Part B: Gallery 展示（G01-G07）

7 个 gallery scene，展示可复用能力。

### 8.3 音频层

S01-S08 各有独立口播音频，通过 `<Sequence>` 精确定位。

### 8.4 字幕层

`SubtitleOverlay` 从 spokenText 生成同步字幕，淡入淡出。

### 8.5 转场

15 个 scene 交替使用 fade / slide / wipe 转场。

---

## 九、工程验证

### 9.1 编译验证

```
typecheck: 通过
validate:all: 通过
```

### 9.2 CSS 违规扫描

```
@keyframes: 0 处
animation: 0 处
animate-*: 0 处
```

全部 frame-driven，无 CSS transition/animation。

### 9.3 生产文件隔离

```
git diff -- src/video-system/data: 空
git diff -- src/video-system/scenes: 空
git diff -- src/video-system/components: 空
git diff -- src/video-system/themes: 空
```

### 9.4 工程审查修复

| 问题 | 修复 |
|------|------|
| 未使用 import `Easing` | 移除 |
| `cardLift` 缺少 `extrapolateLeft` | 补上 |
| `CueActiveCard` borderOp 缺少 clamping | 补上 |
| `KineticTitleSystem` conclusion 硬编码标签 | 改用 prop |
| `MotionCard` borderOp 缺少 clamping | 补上 |
| `TemplatePanel` bgOp 缺少 clamping | 补上 |
| `TransferShot` 硬编码 `fps=30` | 改用 `useVideoConfig()` |
| `TransferShot` bOp 缺少 clamping | 补上 |
| `MotionPrimitiveGallery` 未使用 import | 移除 |
| `EvidencePanel` 结论文字重复 | 证据区改为占位文字 |
| `InsightShot` quote 可能 undefined | 加 `?? ""` 保护 |

---

## 十、文件清单

### 10.1 新增文件（56 个）

```
src/video-system/experiments/ultimate-motion-system/
├── UltimateMotionSystemLab.tsx          # 主 Composition
├── UltimateSceneRenderer.tsx            # 场景分发器
├── labContent.ts                        # 内容数据（含 spokenText）
├── labDirectorCues.ts                   # Director cue 数据
├── labDirectorSpec.ts                   # 导演规格
├── labMotionPrimitives.ts               # 16 种动效原语
├── labRegistry.ts                       # 注册表
├── labShotGrammar.ts                    # 8 种 shot grammar
├── tokens/
│   ├── colorTokens.ts                   # 3 套主题色
│   ├── typographyTokens.ts              # 10 级字阶
│   ├── layoutTokens.ts                  # 布局 token
│   ├── motionTokens.ts                  # 动效 token + 缓动曲线
│   ├── depthTokens.ts                   # z-index / shadow / blur
│   └── platformTokens.ts               # 手机端投影 / 安全区
├── utils/
│   ├── resolveActiveTarget.ts           # cue active 计算
│   ├── cueTiming.ts                     # 语义段帧数分配
│   ├── motionCurves.ts                  # 缓动曲线库
│   ├── textLayout.ts                    # 中文文本布局
│   ├── mobileScale.ts                   # 手机端缩放
│   ├── shotTiming.ts                    # Shot 时序
│   └── fontLoader.ts                    # Google Fonts 加载
├── primitives/
│   ├── MotionBox.tsx
│   ├── MotionText.tsx
│   ├── MotionCard.tsx
│   ├── MotionImage.tsx
│   ├── MotionBadge.tsx
│   ├── MotionProgress.tsx
│   ├── MotionFrame.tsx
│   ├── MotionGrid.tsx
│   └── MotionDivider.tsx
├── components/
│   ├── BackgroundSystem.tsx             # 3 种动态背景
│   ├── KineticTitleSystem.tsx           # 4+ 种标题变体
│   ├── CueActiveCard.tsx                # cue 驱动卡片
│   ├── EvidencePanel.tsx                # 证据面板（真实截图）
│   ├── EvidenceCompare.tsx              # 左右证据对比
│   ├── InsightPanel.tsx                 # 结论聚焦
│   ├── TemplatePanel.tsx                # 模板页（progressive-retain）
│   ├── PromptBuildCard.tsx              # prompt 卡补全
│   ├── TimelineCueBar.tsx               # cue 时间轴
│   ├── SemanticHighlight.tsx            # 语义块高亮
│   ├── FocusRing.tsx                    # 聚焦光环
│   ├── MotionButton.tsx                 # CTA 按钮
│   ├── SceneHeader.tsx                  # 场景标题区
│   ├── SubtitleOverlay.tsx              # 口播同步字幕
│   └── AudioVisualizer.tsx              # 音频波形可视化
├── shots/
│   ├── HookShot.tsx
│   ├── MistakeShot.tsx
│   ├── ExperimentSetupShot.tsx
│   ├── EvidenceShot.tsx
│   ├── InsightShot.tsx
│   ├── TransferShot.tsx
│   ├── TemplateShot.tsx
│   └── CtaShot.tsx
├── galleries/
│   ├── ComponentGallery.tsx
│   ├── MotionPrimitiveGallery.tsx
│   ├── EvidenceGallery.tsx
│   ├── TemplateGallery.tsx
│   ├── TitleGallery.tsx
│   ├── TransitionGallery.tsx
│   └── MobileReadabilityGallery.tsx
└── docs/
    ├── ULTIMATE_MOTION_SYSTEM_README.md
    ├── COMPONENT_LIBRARY.md
    ├── SHOT_GRAMMAR.md
    ├── MOTION_PRIMITIVES.md
    ├── DIRECTOR_CUE_SYSTEM.md
    ├── STUDIO_REVIEW_GUIDE.md
    ├── MIGRATION_CANDIDATES_V2.md
    ├── PRACTICE_MIGRATION_PLAN.md
    ├── QUALITY_GATE.md
    ├── LOOP_PROGRESS_LOG_V2.md
    ├── FINAL_REPORT.md
    └── V2_BUILD_REPORT.md               # 本文件
```

### 10.2 修改文件（1 个）

- `src/Root.tsx` — 新增 1 行 Composition 注册

---

## 十一、启动方式

```bash
npx remotion studio src/index.ts
```

在 Studio 中选择 `UltimateMotionSystemLab` Composition。

---

## 十二、迁移建议

### P0: 直接迁回

- resolveActiveTarget() — 核心 cue 解析
- fadeSlide / springEnter / staggerReveal — 基础动效
- cardLift / highlightOpacity — active 状态
- semanticHighlight — 语义块高亮

### P1: 小改后迁回

- CueActiveCard — 需接入正式 theme
- TemplatePanel — 需接入正式 todo-checklist
- InsightPanel — 需接入正式 big-quote
- EvidencePanel — 需接入正式 assetLayout

### P2: 参考

- BackgroundSystem — 深色风格差异大
- TimelineCueBar — 开发调试工具
- SubtitleOverlay — 可作为字幕系统参考
