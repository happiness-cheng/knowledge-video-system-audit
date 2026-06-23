# P1 Execution Handoff for Agent A V2

> **本文件是当前唯一有效的 P1 执行交接版本。**
> **旧版 `P1_EXECUTION_HANDOFF_FOR_AGENT_A.md` 只作为历史记录，不得执行。如果旧版与本文件冲突，以本文件为准。**
> **本文件不得在 P0 Landing 完成前执行。**
> **执行前必须由用户和 ChatGPT 审查 P0_LANDING_REPORT。**
> **执行时一次只执行一个包。**

---

## 推荐执行顺序

```
包一：AGENTS 与回归契约校准包（P1-1）
包二：QA / visualMetrics 增强包（P1-2）
包三：音频清晰度微增强包（P1-3）
包四：spring / TransitionSeries 小范围实验包（P1-4）— 不在前三包
```

---

## 包一：AGENTS 与回归契约校准包

### 目标

审查并增强现有 AGENTS.md，合并 P0 新能力边界，补充 Remotion 执行硬约束。

### 禁止事项

- 不修改 `src/video-system/` 下任何文件
- 不修改 `package.json` / `package-lock.json`
- 不修改 `videoSpec.json` / `coverSpec.json` / `audioTiming.json` / `subtitles.json`
- **不覆盖已有 AGENTS.md，只能 patch / merge**
- 不创建重复的 AGENTS.md

### 需要修改的文件

| 文件                                                                      | 操作               |
| ------------------------------------------------------------------------- | ------------------ |
| `AGENTS.md`（根目录，已存在 360 行）                                      | patch / merge 增强 |
| `knowledge-video-system/prompts/02_ARTICLE_TO_CONTENT_BRIEF_PROMPT.md`    | 编辑               |
| `knowledge-video-system/prompts/03_CONTENT_BRIEF_TO_VIDEO_SPEC_PROMPT.md` | 编辑               |

### 不允许修改的文件

- `src/video-system/**`
- `package.json`
- `*.json`（data 目录下）

### AGENTS.md 增强内容

需要补充的内容（不覆盖已有内容，只追加/合并）：

1. **P0 新增能力边界**：
   - `toStaticFilePath()` 路径转换工具
   - 字幕版/无字幕版双预览产物
   - renderManifest 渲染清单机制
   - 字幕版脚本命令（capture:keyframes:subs、contact:sheet:subs）

2. **mobile_scaled 定义强化**：
   - mobile_scaled_contact_sheet 只是 16:9 横版等比缩小到手机信息流模拟画布的 QA 产物
   - 不是 9:16 竖屏重排
   - 不能裁切左右内容或改变 scene 布局

3. **能力边界硬约束**：
   - 未在代码中实现的能力不得写成"已支持"
   - videoSpec 不得引用代码未实现的字段
   - 不确定的能力必须标注"待实现"

4. **对比度参考**：
   - 正文/普通文字 WCAG 4.5:1
   - 大字 WCAG 3:1
   - 实现前提：必须能从 theme token 中可靠读取 foreground/background

### 提示词升级内容

在 02_ARTICLE_TO_CONTENT_BRIEF_PROMPT 中添加：

```
## 内容策划质量约束

1. contentBrief 必须判断内容是否具备可复制模板、流程、清单、规则片段或明确行动。
2. 如果缺少可执行方法，不得虚构；必须写入 qualityGate.keyRisks，并建议补充、缩短、拆分或放弃。
3. 标题优先命中用户痛点、结果承诺或反差，不优先堆工具内部术语。
4. Rules / Hook / Prompt / Skill / Plan 等词尽量不要作为标题第一信息。
5. 标题前半句应尽快出现用户能理解的痛点、对象或结果，但不机械要求"前 5 个字必须包含关键词"。
```

### 测试命令

```bash
# 检查 AGENTS.md 包含新增规则
grep "toStaticFilePath" AGENTS.md
grep "mobile_scaled" AGENTS.md
grep "renderManifest" AGENTS.md

# 检查提示词更新
grep "内容策划质量约束" knowledge-video-system/prompts/02_ARTICLE_TO_CONTENT_BRIEF_PROMPT.md

# 不需要渲染，但可以要求 P0 回归产物已存在
ls out/runs/*/renderManifest.json
```

### 回归样例

用当前 videoSpec.json 运行 `npm run validate:all`，确认不影响现有验证。

### 验收标准

- AGENTS.md 包含 P0 新能力边界
- AGENTS.md 包含 mobile_scaled 非 9:16 定义
- AGENTS.md 包含能力边界硬约束
- 提示词包含内容策划质量约束段落
- 现有 validate:all 不受影响

### 失败回滚

`git checkout -- AGENTS.md knowledge-video-system/prompts/02_ARTICLE_TO_CONTENT_BRIEF_PROMPT.md`

---

## 包二：QA / visualMetrics 增强包

### 目标

将 visualMetrics 从 6 项检查扩展到 12 项检查。新增检查项默认 inspect，不自动 revise。

### 禁止事项

- 不修改 scene 组件（`.tsx`）
- 不修改 theme 文件（`themes/*.ts`）
- 不修改 `videoSpec.json` / `coverSpec.json`
- 不修改 `KnowledgeVideo.tsx` / `CoverComposition.tsx`
- 不修改 schema（不新增 videoSpec 字段）

### 需要修改的文件

| 文件                                                  | 修改内容               |
| ----------------------------------------------------- | ---------------------- |
| `src/video-system/scripts/generate-visual-metrics.ts` | 添加 6 项新检查        |
| `src/video-system/scripts/validate-video-spec.ts`     | 添加 Hook 价值承诺检查 |
| `src/video-system/scripts/validate-cover-spec.ts`     | 添加封面标题字数检查   |
| `src/video-system/visual/sceneContracts.ts`           | 参考值调整（可选）     |

### 不允许修改的文件

- `src/video-system/compositions/*.tsx`
- `src/video-system/scenes/*.tsx`
- `src/video-system/themes/*.ts`
- `src/video-system/data/*.json`

### 新增检查项规格

#### 1. 连续 scene 类型重复（inspect）

```
遍历 scenes，如果 scenes[i].type === scenes[i-1].type
  且 type 属于静态类（bullets/title-subtitle/three-column/pros-cons）
  → recommendation = "inspect"
  → risk: "连续出现相同类型 scene，可能像 PPT 轮播"
```

#### 2. screenText 字数分级（inspect）

```
>15 字 → inspect
>30 字 → high inspect / revise candidate（结合 scene type/字号/行数/停留时长/mobile_scaled 判断）
不得写成 hard error
```

#### 3. 静态页占比（inspect）

```
无 Sequence 内部时间轴的 scene 占比 >40% → summary risk
不自动 revise
```

#### 4. primaryAreaRatio 粗估（heuristic inspect）

```
基于 scene type 估算（不追求精确）：
  cover/big-quote/section-divider/cta → 0.35
  bullets/comparison/two-column → 0.3 + items.length * 0.05（上限 0.55）
  todo-checklist → 0.3 + items.length * 0.03（上限 0.5）
与 sceneContract.minPrimaryAreaRatio 比较，低于阈值 → inspect
不得把粗估值写成精确视觉指标
```

#### 5. 对比度 WCAG（hard-rule if measurable, 否则 inspect）

```
读取 theme 的 primaryText 和 background 颜色
计算 WCAG 对比度（相对亮度公式）
正文 <4.5:1 → inspect
大字 <3:1 → inspect
实现前提：必须能从 theme token 中可靠读取。无法识别背景时不应误报
```

#### 6. Hook 价值承诺（inspect）

```
检查 S01 的 durationEstimate 和 content
不机械报错 S01 ≤3s
检查前 3-5 秒是否完成痛点与承诺
S01 是否 0-2 秒让用户知道痛点
S02 是否 2-5 秒给继续理由
```

#### 7. 封面标题字数（inspect）

```
检查 coverSpec.title 字数
硬规则：不语义断裂、不孤行、手机可读、双封面都成立
字数超长只 inspect，不 revise
```

### 测试命令

```bash
npx tsc --noEmit
npm run visual:metrics
npm run preview:visual
npm run validate:spec
npm run validate:cover
```

### 回归样例

用当前 videoSpec.json + coverSpec.json 运行所有验证：

1. 现有检查项不受影响
2. 新增检查项正确输出
3. inspectItems 列表合理
4. mobile_scaled_contact_sheet 仍生成

### 验收标准

- `npx tsc --noEmit` 通过
- `npm run visual:metrics` 输出新增检查项
- `npm run preview:visual` 正常完成
- 新增检查项 risk 描述清晰
- 所有新增项默认 inspect，不自动 revise
- mobile_scaled_contact_sheet 正常生成

### 失败回滚

`git checkout -- src/video-system/scripts/generate-visual-metrics.ts src/video-system/scripts/validate-video-spec.ts src/video-system/scripts/validate-cover-spec.ts src/video-system/visual/sceneContracts.ts`

---

## 包三：音频清晰度微增强包

### 目标

BGM 在 voiceover 播放时自动降低，提升口播清晰度。

### 禁止事项

- 不迁移 @remotion/captions
- 不修改 TTS 服务
- 不修改 subtitles 主链
- 不新增复杂多轨混音
- 不引入音频可视化
- 不修改 `videoSpec.json` / `audioTiming.json`
- 不修改 scene 组件

### 需要修改的文件

| 文件                                               | 修改内容              |
| -------------------------------------------------- | --------------------- |
| `src/video-system/compositions/KnowledgeVideo.tsx` | BGM Audio volume 回调 |

### 不允许修改的文件

- `src/video-system/data/*.json`
- `src/video-system/scripts/*.ts`
- `src/video-system/scenes/*.tsx`
- `src/video-system/themes/*.ts`
- `src/video-system/compositions/CoverComposition.tsx`

### BGM Ducking 规格

```tsx
// 顶部常量（可配置）
const BGM_VOLUME_DURING_VO = 0.15; // voiceover 在场时（约 -20dB）
const BGM_VOLUME_DEFAULT = 0.6; // 无 voiceover 时

// volume 回调
const bgmVolume = (frame: number) => {
  const isInVoiceover = audioTiming.segments.some(
    (seg) => frame >= seg.startFrame && frame <= seg.endFrame,
  );
  return isInVoiceover ? BGM_VOLUME_DURING_VO : BGM_VOLUME_DEFAULT;
};

// 使用
<Audio src={staticFile("audio/bgm.m4a")} volume={bgmVolume} />;
```

**注意**：阈值做成顶部常量，方便调参。

### 测试命令

```bash
npx tsc --noEmit
npx remotion studio src/index.ts  # Studio 预览
npx remotion render src/index.ts KnowledgeVideo --output=out/test-bgm-ducking.mp4 --codec=h264
npm run render:manifest
```

### 回归样例

1. 渲染视频，手动检查：
   - voiceover 播放时 BGM 是否降低
   - voiceover 间隔时 BGM 是否回升
   - 视频总时长不变
2. 运行 `npm run preview:visual`，确认视觉门禁不受影响
3. renderManifest 正常记录

### 验收标准

- 口播段 BGM 音量明显低于间隔段
- `npm run preview:visual` 正常通过
- 视频总时长不变
- BGM 阈值可配置（顶部常量）
- renderManifest 正常记录

### 失败回滚

`git checkout -- src/video-system/compositions/KnowledgeVideo.tsx`

---

## 包四：spring / TransitionSeries 小范围实验包

> **不在前三包。需在包一～三稳定后再做。**

### 目标

在 big-quote 场景小范围试用 spring()，确认效果后再考虑推广。

### 禁止事项

- 不全局替换动画
- 不修改 videoSpec schema
- 不影响音频同步
- 不新增复杂转场库

### 需要修改的文件

| 文件                                        | 修改内容                     |
| ------------------------------------------- | ---------------------------- |
| `src/video-system/scenes/BigQuoteScene.tsx` | spring() 替代 linear（试用） |

### 不允许修改的文件

- `src/video-system/data/*.json`
- `src/video-system/themes/*.ts`
- `src/video-system/compositions/KnowledgeVideo.tsx`（TransitionSeries 不在此包改）

### 测试命令

```bash
npx tsc --noEmit
npx remotion studio src/index.ts
# 对比 spring vs linear 效果
```

### 验收标准

- big-quote 动画有弹性回弹感
- 不影响其他 scene
- spring 参数可调

### 失败回滚

`git checkout -- src/video-system/scenes/BigQuoteScene.tsx`

---

## 只写 Backlog 不要实现的能力

| ID    | 标题                       | 原因                           |
| ----- | -------------------------- | ------------------------------ |
| P2-01 | @remotion/captions 迁移    | 成本 L，当前够用               |
| P2-02 | calculateMetadata 动态时长 | 需改造 KnowledgeVideo.tsx 结构 |
| P2-03 | 逐词高亮字幕               | 依赖 P2-01                     |
| P2-04 | typewriter 文本动画        | P2                             |
| P2-05 | word-highlight 关键词高亮  | P2                             |
| R-01  | Lottie                     | reject                         |
| R-02  | 3D                         | reject                         |
| R-03  | light leaks                | reference-only                 |
| R-05  | 自动 9:16 重排             | reject                         |
