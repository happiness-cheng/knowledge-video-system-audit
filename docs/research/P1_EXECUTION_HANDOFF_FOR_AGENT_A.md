# P1 执行交接包 — Agent A 专用

> 本文件供 Agent A 直接使用。每个升级包独立可执行，不需要一次性做完所有 P1。

---

## 执行顺序

1. **升级包 3**（AGENTS.md + 提示词）— 纯文档，零风险，先建立约束
2. **升级包 1**（QA 检查项扩展）— 核心质量提升
3. **升级包 2**（BGM + 动画）— 视听体验提升

---

## 升级包 3：AGENTS.md + 提示词升级

### 目标

建立 Agent 执行约束，提升 contentBrief 质量门槛。

### 禁止事项

- 不修改任何 .tsx / .ts 代码文件
- 不修改 videoSpec.json / coverSpec.json
- 不修改 package.json

### 需要修改的文件

| 文件                                                                      | 操作 |
| ------------------------------------------------------------------------- | ---- |
| `knowledge-video-system/AGENTS.md`                                        | 新建 |
| `knowledge-video-system/prompts/02_ARTICLE_TO_CONTENT_BRIEF_PROMPT.md`    | 编辑 |
| `knowledge-video-system/prompts/03_CONTENT_BRIEF_TO_VIDEO_SPEC_PROMPT.md` | 编辑 |

### 不允许修改的文件

所有 `src/video-system/` 下的代码文件。

### AGENTS.md 内容要求

必须包含以下硬约束：

```
# Agent 执行约束

## 执行前必读
1. `.claude/skills/remotion-best-practices/SKILL.md`
2. `knowledge-video-system/AGENTS.md`（本文件）

## CSS 禁令
- 禁止 CSS transitions / animations
- 禁止 Tailwind 动画类名
- 必须用 interpolate() / spring()

## 能力边界
- 禁止 videoSpec 引用代码未实现的字段
- 禁止宣称"已支持"未在代码中实现的能力
- 不确定的能力必须标注"待实现"

## 质量门禁
- `npm run validate:all` 必须通过
- `npm run preview:visual` 必须通过（visualGateStatus ≠ blocked）
- 渲染前必须先 Studio 预览确认

## 路径协议
- staticFile() 路径不带 public/ 前缀
- 音频路径格式：audio/voiceover/S01-xxx.mp3
- 使用 toStaticFilePath() 工具函数

## 中文断行
- 标题使用显式 \n 语义断行
- whiteSpace: "pre-line" 配合 \n
- 不依赖 CSS 自动换行
```

### 提示词升级要求

在 02_ARTICLE_TO_CONTENT_BRIEF_PROMPT 中添加：

```
## 硬约束
1. 每个 contentBrief 必须包含至少 1 个可复制模板或行动清单
2. 标题禁止使用内部术语：Rules / Hook / Prompt / Skill / Agent
3. 标题必须在前 5 个字包含核心关键词
4. 标题句式优先：数字+痛点、疑问+方案、反差+结果
5. 封面主标题 ≤10 个中文字
```

### 测试命令

```bash
# 检查 AGENTS.md 存在
cat knowledge-video-system/AGENTS.md

# 检查提示词更新
grep "硬约束" knowledge-video-system/prompts/02_ARTICLE_TO_CONTENT_BRIEF_PROMPT.md
```

### 回归样例

用当前 videoSpec.json 运行 `npm run validate:all`，确认不影响现有验证。

### 验收标准

- AGENTS.md 存在且包含 CSS 禁令、能力边界、质量门禁
- 提示词包含硬约束段落
- 现有 validate:all 不受影响

### 如果失败如何回滚

删除 AGENTS.md，还原提示词文件。纯文档改动，无代码影响。

---

## 升级包 1：QA 检查项扩展

### 目标

将 visualMetrics 从 6 项检查扩展到 12 项检查。

### 禁止事项

- 不修改 scene 组件（.tsx）
- 不修改 theme 文件
- 不修改 videoSpec.json / coverSpec.json
- 不修改 KnowledgeVideo.tsx / CoverComposition.tsx

### 需要修改的文件

| 文件                                                  | 修改内容                |
| ----------------------------------------------------- | ----------------------- |
| `src/video-system/scripts/generate-visual-metrics.ts` | 添加 6 项新检查         |
| `src/video-system/scripts/validate-video-spec.ts`     | 添加 Hook 时长检查      |
| `src/video-system/scripts/validate-cover-spec.ts`     | 添加封面标题字数检查    |
| `src/video-system/visual/sceneContracts.ts`           | 提升 minProjectedBodyPx |

### 不允许修改的文件

- `src/video-system/compositions/*.tsx`
- `src/video-system/scenes/*.tsx`
- `src/video-system/themes/*.ts`
- `src/video-system/data/*.json`（data 目录下的 JSON）

### 新增检查项详细规格

#### 1. 连续 scene 类型重复检测（generate-visual-metrics.ts）

```
逻辑：遍历 scenes 数组，如果 scenes[i].type === scenes[i-1].type
  且 type 属于静态类（bullets / title-subtitle / three-column / pros-cons）
  → 标记 scenes[i].recommendation = "inspect"
  → 添加 risk: "连续出现相同类型 scene，可能像 PPT 轮播"
```

#### 2. screenText 字数检查（generate-visual-metrics.ts）

```
逻辑：对每个 scene 的 screenText 计算字数
  > 50 字 → recommendation = "revise"
  > 30 字 → recommendation = "inspect"
  → 添加 risk: "screenText 超过 30 字，可能挤占视觉通道"
```

#### 3. 静态页占比检查（generate-visual-metrics.ts）

```
逻辑：统计无 Sequence 内部时间轴的 scene 占比
  静态类 scene：title-subtitle / section-divider / stat-highlight（无 items 时）
  占比 > 40% → 在 summary 中添加 risk: "静态页占比超过 40%"
```

#### 4. primaryAreaRatio 简化估算（generate-visual-metrics.ts）

```
逻辑：基于 scene type 估算（不追求精确，只做粗筛）
  cover / big-quote / section-divider / cta → 0.35
  bullets / comparison / two-column / three-column / pros-cons → 0.3 + items.length * 0.05（上限 0.55）
  todo-checklist → 0.3 + items.length * 0.03（上限 0.5）
  process-steps / flow-diagram / roadmap / timeline / mindmap → 0.35
  与 sceneContract.minPrimaryAreaRatio 比较，低于阈值 → inspect
```

#### 5. 对比度检查（generate-visual-metrics.ts）

```
逻辑：读取 theme 的 primaryText 和 background 颜色
  计算 WCAG 对比度（相对亮度公式）
  < 4.5:1 → inspect
  < 3:1 → revise
  需要一个 calculateContrastRatio(hex1, hex2) 工具函数
```

#### 6. Hook 时长检查（validate-video-spec.ts）

```
逻辑：检查 scenes[0] 的 durationEstimate
  > 3 秒（90 帧 @30fps）→ 警告 "Hook scene 超过 3 秒，可能影响完播率"
  注意：durationEstimate 是秒数，需要乘以 fps 得到帧数
```

#### 7. 封面标题字数检查（validate-cover-spec.ts）

```
逻辑：检查 coverSpec.title 的字数
  > 10 个中文字 → 警告 "封面主标题超过 10 字，在缩略图尺寸下可能不可辨认"
  > 15 个中文字 → 错误 "封面主标题过长"
```

### 测试命令

```bash
# 类型检查
npx tsc --noEmit

# 运行 visual metrics
npm run visual:metrics

# 运行完整 preview
npm run preview:visual

# 运行 spec 验证
npm run validate:spec

# 运行 cover 验证
npm run validate:cover
```

### 回归样例

用当前 videoSpec.json + coverSpec.json 运行所有验证命令，确认：

1. 现有检查项不受影响
2. 新增检查项正确输出
3. 如果有 inspect，inspectItems 列表正确

### 预期产物

- `src/video-system/data/visualMetrics.json`：新增字段
- `src/video-system/data/previewVisualReport.json`：inspectItems 可能增加

### 验收标准

- `npx tsc --noEmit` 通过
- `npm run visual:metrics` 输出新增检查项
- `npm run preview:visual` 正常完成
- 新增检查项的 risk 描述清晰可理解

### 如果失败如何回滚

`git checkout -- src/video-system/scripts/generate-visual-metrics.ts src/video-system/scripts/validate-video-spec.ts src/video-system/scripts/validate-cover-spec.ts src/video-system/visual/sceneContracts.ts`

---

## 升级包 2：BGM Ducking + 动画增强

### 目标

BGM 在 voiceover 播放时自动降低；big-quote 和 bullets 场景用 spring() 替代 linear。

### 禁止事项

- 不修改 videoSpec.json / coverSpec.json / audioTiming.json
- 不修改 subtitle 相关文件
- 不新增 scene type
- 不修改 theme 文件

### 需要修改的文件

| 文件                                               | 修改内容             |
| -------------------------------------------------- | -------------------- |
| `src/video-system/compositions/KnowledgeVideo.tsx` | BGM volume 回调      |
| `src/video-system/scenes/BigQuoteScene.tsx`        | spring() 替代 linear |
| `src/video-system/scenes/BulletsScene.tsx`         | spring() 替代 linear |

### 不允许修改的文件

- `src/video-system/data/*.json`
- `src/video-system/scripts/*.ts`
- `src/video-system/themes/*.ts`
- `src/video-system/compositions/CoverComposition.tsx`

### BGM Ducking 详细规格

```tsx
// 在 KnowledgeVideo.tsx 中
// 1. 计算每个 scene 的 voiceover 时间区间（从 audioTiming）
// 2. BGM Audio 组件使用 volume 回调：
const bgmVolume = (frame: number) => {
  // 检查当前帧是否在某个 voiceover 区间内
  const isInVoiceover = sceneFrameRanges.some(
    (range) => frame >= range.start && frame <= range.end,
  );
  return isInVoiceover ? 0.15 : 0.6; // voiceover 时 -20dB，间隔时 60%
};
// 3. <Audio src={staticFile("audio/bgm.m4a")} volume={bgmVolume} />
```

**注意**：bgmVolume 阈值（0.15 和 0.6）做成顶部常量，方便调参。

### spring() 动画增强规格

```tsx
// 在 BigQuoteScene.tsx 中
// 原来：const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
// 改为：
const { fps } = useVideoConfig();
const opacity = spring({ frame, fps, config: { damping: 15, mass: 0.8 } });

// 在 BulletsScene.tsx 中
// 逐条出现的 stagger 用 spring：
const itemSpring = spring({
  frame: frame - i * 8, // 每条延迟 8 帧
  fps,
  config: { damping: 12, mass: 0.6 },
  durationInFrames: 20,
});
```

**注意**：spring 参数先在一个 scene 试用，确认效果后再推广到其他 scene。

### 测试命令

```bash
# 类型检查
npx tsc --noEmit

# Studio 预览（关键！）
npx remotion studio src/index.ts

# 渲染测试
npx remotion render src/index.ts KnowledgeVideo --output=out/test-bgm-ducking.mp4 --codec=h264
```

### 回归样例

1. 渲染视频，手动检查：
   - voiceover 播放时 BGM 是否降低
   - voiceover 间隔时 BGM 是否回升
   - big-quote 动画是否有弹性回弹感
   - bullets 逐条出现是否更自然
2. 运行 `npm run preview:visual`，确认视觉门禁不受影响

### 验收标准

- 口播段 BGM 音量明显低于间隔段
- big-quote 动画有 spring 弹性感（不是线性过渡）
- bullets 逐条出现有回弹效果
- `npm run preview:visual` 正常通过
- 视频总时长不变（spring 不影响帧数）

### 如果失败如何回滚

`git checkout -- src/video-system/compositions/KnowledgeVideo.tsx src/video-system/scenes/BigQuoteScene.tsx src/video-system/scenes/BulletsScene.tsx`

---

## 只写 Backlog 不要实现的能力

以下能力在 P1_BACKLOG.md 中有记录，但**本轮不要实现**：

| ID                 | 标题                             | 原因                              |
| ------------------ | -------------------------------- | --------------------------------- |
| P1-BL-13           | TransitionSeries 扩展 fade/slide | 需要测试音频同步影响，风险 medium |
| @remotion/captions | 逐词字幕迁移                     | 成本 L，P2 再做                   |
| Lottie             | Lottie 动画                      | 不适合知识视频                    |
| light leaks        | 光效叠加                         | 炫技不提升理解                    |
| 3D                 | 3D 内容                          | 完全不适用                        |
| Lambda             | 云渲染                           | 当前够用                          |
| 9:16               | 竖屏重排                         | 与定位冲突                        |
