# Hook、结构与留存

## 目标

回答一个问题：观众能否从第一秒看到最后一秒？

## 揭示者叙事基础结构

不默认从定义、知识列表或教程开始。推荐基础结构（非机械模板）：

```text
痛点或现场 → 异常与反差 → 核心问题 → 证据 → 揭示原因 → 机制和边界 → 可执行收获
```

- 先让观众看到自己熟悉的痛点
- 再出现异常、冲突、真实结果或悬念
- 优先展示证据和现场，再解释机制
- 行动建议应在观众理解原因之后出现

## Beat Milestones（适配不同视频长度）

```text
0—2 秒：痛点、损失、自我代入或异常
2—5 秒：反差与观看收益
5—15 秒：证据、结果或第一次兑现
15—30 秒：真正问题或第一次阶段结论
30—90 秒：每 10—20 秒产生认知增量
90 秒后：每 20—40 秒产生新证据、转折或阶段总结
```

"刷新"必须是信息、证据、认知或状态变化，不是单纯切换画面。

## Hook 承诺偿还规则

Hook 提出的痛点、损失或反差，必须在前 15—30 秒得到第一次真实兑现，不能长时间只吊胃口。

## 核心判断

### 1. 前 2 秒

- 观众在前 2 秒看到什么？
- 能否立即认出自己的处境或痛点？
- 评分规则见 01

### 2. 前 5 秒

- 前 5 秒是否建立了"继续看能得到什么"的预期？
- 是否出现了承诺、反差或悬念？
- 避免：自我介绍、背景铺垫、"大家好"

### 3. 信息推进

- 每个 scene 是否带来新的信息增量？
- 是否有重复说明同一个观点的情况？
- 信息密度是否适中？

### 4. 中段注意力

- 30—90 秒区间：每 10—20 秒是否有认知增量？
- 90 秒后：每 20—40 秒是否有新证据或转折？
- 避免：连续多个 scene 说同一件事

### 5. 重复与拖沓

- 哪些内容可以合并或删除？
- 哪些 scene 停留时间过长？
- 删除后是否损失核心信息？

### 6. 结论和行动

- 结论是否从前面的因果关系中自然浮现？
- 行动建议是否具体、可执行？
- 避免：突然切到全屏大字结论页

## Beat / Shot / Scene 编译关系

```text
Beat = 叙事推进单位
Shot = 已批准的声画同步单位
Scene = Remotion 执行单位
```

默认：1 Shot = 1 Scene。

只有在相邻 Shot 使用同一视觉宿主、同一素材且状态连续时，Agent 才可合并为同一 Scene 内的多个 Sequence。

合并条件（全部满足）：

- 同一视觉宿主
- 同一核心素材
- 状态连续
- 不改变 Shot 顺序
- 不改变 spokenClause
- 不改变证据和信息结论
- 保留每个 sourceShotIds 和 alignmentIds

### Shot 运动规则

任何超过 1.2 秒的 Shot 必须满足其一：

- 存在有意义的 holdMotion
- holdMotion.type = none，并明确 noneReason

合理的静止原因：

- 真实证据需要阅读
- 情绪停顿
- 结论需要短暂停留
- 运动会干扰理解

每个 Shot 最多允许：

- 1 个主讲解动作
- 1 个辅助生命动作

不得同时让多个对象无关运动。

### 分层规则

- 一个 Beat 可以包含 2—6 个 Shot
- 不得把一分钟以上的教学章节当成一个 Scene
- Shot 一般为 2—10 秒，证据阅读或刻意停顿可更长
- Scene/Shot 的数量由信息变化决定，不由章节数量决定

## Beat 增量要求

每个主要 Beat 必须明确以下字段，没有明确增量的 Beat 不得进入 Shot 设计：

```text
beat:
  contentFunction: [本 Beat 在叙事中的功能——建立处境 / 制造冲突 / 提供证据 / 揭示原因 / 给出边界 / 推动行动]
  viewerStateBefore: [进入本 Beat 前观众的状态]
  viewerStateAfter: [离开本 Beat 后观众的状态]
  informationDelta: [本 Beat 产生的新信息——新事实 / 新证据 / 新问题 / 新理解]
  emotionalShift: [情绪变化——从什么到什么]
  whyThisBeatExists: [为什么需要这个 Beat——删除后损失什么]
```

没有变化的 Beat 应删除、合并或重写。

## 输出：Beat Sheet + Content Segment Plan

```text
beatSheet:
  - beatId: B01
    timeRange: [0-5s]
    contentFunction: [建立处境]
    summary: [具体痛点/现场 + 反差]
    viewerStateBefore: [进入前状态]
    viewerStateAfter: [离开后状态]
    informationDelta: [新信息]
    emotionalShift: [情绪变化]
    whyThisBeatExists: [为什么需要]

  - beatId: B02
    timeRange: [5-15s]
    contentFunction: [提供证据]
    summary: [证据或结果]
    ...

contentSegmentPlan:
  - beatId: B01
    segmentId: SEG-01
    spokenUnit: [口播分句或段落含义]
    mustBeSeen: [必须被看见的内容]
    evidenceRequirement: [需要什么证据]
    emotionalRequirement: [情绪要求]
    semanticRelationship: [与上一段的语义关系]

注意：内容阶段不输出视觉实现细节（visualFocus、visualState、transition、assetStrategy）。
这些在读取视觉哲学后，由 Intent-First Shot Design 阶段输出到 shotDirectorSpec。
```

## 参考

- 2 秒 Hook 评分见 01
- 画面交接见 05
- 审片见 06
