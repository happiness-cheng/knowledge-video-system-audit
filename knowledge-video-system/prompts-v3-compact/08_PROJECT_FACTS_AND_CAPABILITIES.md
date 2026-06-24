# 项目事实与能力

## 账号定位

"世间一点尘"：一个普通大学生用 AI 做各种实验，把真实过程记录下来。不是"我教你"，而是"我试给你看"。

- 不是单纯讲 Claude Code 的账号
- 记录如何把 AI 从陪聊工具变成学习、写作、开发和成长系统
- 详细策略见仓库 `15_CONTENT_STRATEGY_AND_CREATOR_POSITIONING.md`

## 三方职责

| 角色           | 职责                                                                                                                 |
| -------------- | -------------------------------------------------------------------------------------------------------------------- |
| 网页版 ChatGPT | 内容策划、质量审查、给出 recommendation                                                                              |
| 用户           | 最终决策者，决定继续、修改、拆分、停止或发布                                                                         |
| Agent          | 工程执行：负责能力预检、素材登记、补齐类型字段、实现画面、验证和渲染；不得重新决定内容、事实结论、用户批准或发布授权 |

- `recommendation: pass` 不等于用户批准
- Agent 不得自行写入 userDecision、approvedByUser 等字段

## 默认视频规格

- 帧率：30fps
- 分辨率：1920×1080（16:9）
- 封面：3:4（抖音）+ 4:3（B站/小红书）
- 字号下限：正文 28px、卡片 26px、标签 18px
- 每页最多 3 个核心信息点

## 品牌

- 水印：世间一点尘
- 风格：真实、不装专家、有具体案例
- 封面默认由 GPT Image 生成，Remotion cover 只做 fallback

## 封面风格：warm-editorial-comic

适合：真实经历、方法分享、个人实验类内容。

- 暖白/米白底
- 黑色粗标题
- 橙、红、黄强调色
- 卡通品牌人物
- 人物动作、表情和衣服随内容变化
- 大标题 2—4 行
- 最多 1 个证据提示
- 可使用 Vol./系列标签
- 编辑感、漫画感、高对比
- 不使用大量手机端不可读的小字

## 当前视觉方向

- 画面必须参与讲解，不能只是给旁白配文字
- 抽象概念转化为可见对象
- 关系转化为空间结构
- 变化转化为运动或状态转换

## 能力真源

能力是否存在，以仓库源码为准：

| 项目       | 真源路径                                        |
| ---------- | ----------------------------------------------- |
| Scene 能力 | `src/video-system/visual/capabilityRegistry.ts` |
| 主题注册   | `src/video-system/themes/index.ts`              |
| Scene 渲染 | `src/video-system/scenes/SceneRenderer.tsx`     |

Prompt 只提供索引，不复制完整能力表。不确定时查源码或由 Agent 做 capability preflight。

### 能力快照

```text
capabilitySnapshotVersion: unverified
capabilitySnapshotDate: 2026-06-23
```

快照维护规则：

- 只有 registry、scene、theme、semantic pattern 或关键视觉能力变化时更新
- 快照只供 GPT 做导演建议，正式交付前由 Agent 对当前源码执行 capability preflight
- 所有 `capabilityStatus` 默认使用 `needs-preflight`，不得自行写 `confirmed`

## 已验证 Semantic Patterns

| Pattern               | 用途             |
| --------------------- | ---------------- |
| pressure-build        | Hook 压力构建    |
| fragment-to-manual    | 碎片汇聚成手册   |
| detour-vs-direct-path | 绕路与直达对比   |
| wrong-to-correct      | 错误到正确的纠正 |
| confused-to-guided    | 困惑到被引导     |

## 正式实现 vs 导演参考

- 正式实现能力：已在 capabilityRegistry 注册，Agent 可直接使用
- 导演参考模式：仅供 GPT 导演判断，Agent 无同名正式组件，需做 capability preflight

## 能力预检状态（capabilityPreflight）

每个 Shot 必须输出能力预检状态：

| 状态                  | 含义                         | 处理               |
| --------------------- | ---------------------------- | ------------------ |
| supported             | 能力已注册，可直接进入 Scene | 进入 Scene 编译    |
| hold-motion-patch     | 需要补丁 holdMotion          | 完成并验证后才进入 |
| new-component-gap     | 当前无对应组件               | 返回用户决定       |
| fallback-unacceptable | 退化为文字卡不可接受         | 阻断生产           |

判断标准不是"能否渲染"，而是：能否在不退化为静态文字卡或高级 PPT 的前提下，完成该 Shot 的解释目标。

规则：

- supported：可以进入 Scene 编译
- hold-motion-patch：完成并验证补丁后才进入
- new-component-gap：返回用户决定补组件、改视觉方案或延后
- fallback-unacceptable：阻断生产
- 不得静默降级为文字卡

能力是否存在仍以源码 capabilityRegistry 为准。

## 能力不足时的处理

- 发现能力不够：标注"需要新组件"或"需要生成素材"
- 不要强行用现有组件凑合
- 不要让 Agent 猜测如何实现

## 素材策略

```text
assetStrategy 枚举：
  generated-static
  screenshot-led-raw
  screenshot-led-prepared
  component-only
  hybrid

motionLevel 枚举：
  none
  light
  medium

legibilityRisk 枚举：
  low
  medium
  high

voiceoverMustVerbalizeEvidence：
  true | false
```

### generated-static 适用条件

- 情绪 Hook 和类比关键画面
- 静态完整呈现
- 不依赖人物连续动画
- 关键文字不生成在图内
- 风格与封面和视频色板一致
- 生图负责画面感，Remotion 负责时间线与必要文字层

### screenshot-led-raw 适用条件

- 允许当前视频使用原始截图
- 必须同时标记 legibilityRisk
- voiceoverMustVerbalizeEvidence: true
- 不得依赖观众自行阅读密集截图
- 手机端审片不清楚时，通过 Revision Router 返回素材呈现层

## V4 能力扩展字段

capabilityRegistry V4 为每项能力新增语义描述：

| 字段                  | 含义                     |
| --------------------- | ------------------------ |
| semanticAffordances   | 该能力能承载哪些语义目标 |
| supportedStateChanges | 支持的状态变化类型       |
| continuitySupport     | 跨 Shot 状态继承支持程度 |
| evidenceSupport       | 证据展示支持程度         |
| knownLimitations      | 已知限制                 |
| mobileRisk            | 手机端风险等级           |
| validatedExamples     | 已验证的使用示例         |
| semanticGoal          | 语义模式的核心目标       |
| initialState          | 语义模式的初始状态       |
| coreChange            | 语义模式的核心变化       |
| finalState            | 语义模式的最终状态       |
| forbiddenDowngrade    | 禁止的降级方式           |
| acceptanceCriteria    | 验收标准                 |

语义模式的 V4 字段用于 Intent-First 设计阶段，不绑定具体组件。

## 设计哲学文件

| 文件 | 用途         |
| ---- | ------------ |
| 10   | 内容设计核心 |
| 11   | 视觉设计核心 |
| 12   | 视觉设计完整 |

## 参考文档索引

| 主题         | 仓库文件                                                                        |
| ------------ | ------------------------------------------------------------------------------- |
| 视觉设计系统 | `knowledge-video-system/prompts/14_VISUAL_DESIGN_SYSTEM_V1_ALPHA.md`            |
| 内容策略     | `knowledge-video-system/prompts/15_CONTENT_STRATEGY_AND_CREATOR_POSITIONING.md` |
| 观众研究     | `knowledge-video-system/prompts/16_AUDIENCE_RESEARCH_AND_RETENTION_LOOP.md`     |
| Agent 契约   | `docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md`                                     |
| 能力谈判     | `knowledge-video-system/prompts-v3-compact/CAPABILITY_NEGOTIATION.md`           |
