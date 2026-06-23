# 画面方向与交接

## 目标

回答一个问题：给 Agent 的画面描述是否清晰、可执行、不需要猜？

## 核心原则

- 画面必须参与讲解，不能只是给旁白配文字
- 抽象概念转化为可见对象
- 关系转化为空间结构
- 变化转化为运动或状态转换
- 结论从前面的因果关系中浮现

## GPT 与 Agent 的实现边界

- GPT 锁定：explanationGoal、知识对象、初始状态、状态变化、最终结论、证据和验收标准
- GPT 推荐：scene host 和 semantic pattern
- Agent 决定：实际组件、props、布局、时间轴、动效和代码实现
- Agent 不得静默改变 lockedMeaning
- capability gap 必须返回用户确认，不得强行降级成文字卡片

## 内容快照与视觉快照

### contentSnapshotId

内容进入画面系统前必须生成 approvedContentSnapshot：

```text
contractVersion: "3.1"
contentSnapshotId: CS-YYYYMMDD-xxxx
sourceDigest: sha256
approvedAt: ISO date | null
userDecision: approved | pending
sources: { contentMasterDraft, beatSheet, shotPlan, coverBrief }
```

所有视觉产物必须携带同一个 contentSnapshotId。draftBody、Beat 顺序、核心证据、口播含义或标题承诺发生实质修改时，旧视觉产物全部失效。

### visualSnapshotId

视觉产物汇总快照：

```text
contractVersion: "3.1"
visualSnapshotId: VS-YYYYMMDD-xxxx
contentSnapshotId: CS-...
candidateDigest: sha256
shotDirectorSpecs: [路径列表]
semanticAlignments: [路径列表]
```

## 关键 scene 导演卡

```text
sceneId: [S01, S02, ...]
explanationGoal: [这个 scene 要解释什么]
firstVisualFocus: [观众第一眼看到什么]
objects: [出现哪些对象]
initialState: [对象的初始状态]
transition: [对象发生什么变化]
voiceoverSync: [口播说到哪里时画面变化]
finalState: [对象的最终状态]
informationDelta: [比上一 scene 新增什么认知]
evidenceAnchor: [使用哪份截图、数据或事实作为证据]
mustShow: [必须显示的文字或元素]
mustAvoid: [不要出现什么]
assetStrategy: [generated-static | screenshot-led-raw | screenshot-led-prepared | component-only | hybrid]
acceptanceCriteria: [怎么判断画面成功]
preferredSceneHost: [推荐的 scene type]
preferredSemanticPattern: [推荐的 semantic pattern]
implementationLock: [locked | preferred | open]
lockedMeaning: [锁定时 Agent 不得改变什么]
flexibleImplementation: [Agent 可以自由决定什么]
fallbackPlan: [能力不足时的降级方案]
capabilityStatus: [confirmed | needs-preflight | gap]
```

### implementationLock 定义

- `locked`：视觉变化本身承载核心解释，Agent 不得改变状态变化和最终结论
- `preferred`（默认）：GPT 推荐实现方式，Agent 可在不改变解释目标的前提下调整
- `open`：Agent 自由实现，但不得改变解释目标

### capabilityStatus 定义

- `confirmed`：capabilityRegistry 中已注册，Agent 可直接使用
- `needs-preflight`：GPT 不确定，Agent 需查源码确认
- `gap`：当前无对应组件，需返回用户确认是否新建

## Shot Director Spec

每个 Shot 必须生成 shotDirectorSpec：

```text
contractVersion: "3.1"
contentSnapshotId: CS-...
beatId: B01
shotId: B01-S01
contentSourceRef: draftBody paragraph / claim id
spokenClause: 该 Shot 对应的口播含义
explanationGoal: 该 Shot 必须让观众理解什么
informationDelta: 相比上一个 Shot 新增什么认知
primaryAttentionTarget: 此刻观众首先看哪里
objects: [画面知识对象]
initialState: 初始状态
semanticAction: 核心解释动作
finalState: 最终状态
enterMotion: { type, purpose }
holdMotion: { type, purpose, noneReason? }
exitOrCarryMotion: { type, carryObject }
continuityAnchor: 与前后 Shot 保持连续的对象
ambientMotion: { type: none|drift|pulse|flow|breathe, purpose }
assetStrategy: generated-static | screenshot-led-raw | screenshot-led-prepared | component-only | hybrid
evidenceAnchor: 证据引用或 null
implementationLock: locked | preferred | open
capabilityStatus: supported | hold-motion-patch | new-component-gap | fallback-unacceptable
fallbackPolicy: return-gap
acceptanceCriteria: [验收标准]
```

### enterMotion / holdMotion / exitOrCarryMotion

- enterMotion：对象如何进入画面，为什么这样进入
- holdMotion：停留阶段怎样继续讲解。type=none 时必须说明 noneReason
- exitOrCarryMotion：退出方式，或带入下一 Shot 的对象
- ambientMotion：只负责生命感，不承担核心结论

## 非关键 scene 最低要求

- visualRole：[支持 shot / 过渡 / 呼吸]
- firstVisualFocus：[观众第一眼看到什么]
- finalState：[最终状态]
- 静止或运动的理由

不得只写 scene type 和"大致内容"。

## 语义声画对齐（TTS 前）

TTS 前只锁定语义含义，不锁定帧数：

```text
alignmentId: A01
contentSnapshotId: CS-...
beatId: B01
shotId: B01-S01
spokenClause: 口播含义
visualMeaning: 对应视觉含义
evidenceAnchor: 证据引用或 null
```

此阶段的 durationEstimate 只是估算，不得作为最终帧数真源。

## 时序声画对齐（TTS 后）

Agent 根据真实 audioTiming.json 编译：

```text
alignmentId: A01
shotId: B01-S01
audioSegmentId: AUD-001
startMs: 0
endMs: 4300
startFrame: 0
endFrame: 129
sceneId: S01
```

规则：

- 真实音频时序覆盖估算时长
- Agent 可以调整动画速度和 Scene 时长
- 不得为了适配时长删改口播含义或视觉结论
- 口播变化后，原音频、字幕、timedVisualAlignment 全部失效

## 逐句声画同步

每个关键 Beat 增加 voiceoverVisualAlignment：

```text
voiceoverVisualAlignment:
  - alignmentId: [稳定 ID，如 A01]
    beatId: [所属 Beat]
    shotId: [所属 Shot]
    sceneId: [GPT 阶段可为 null，Agent 编译后回填]
    spokenClause: [口播分句]
    visualSource: [generated-static | screenshot-led-raw | screenshot-led-prepared | component-only | hybrid]
    visualState: [画面当前状态]
    visualAction: [画面执行的动作]
    onScreenText: [画面上显示的文字]
    durationEstimate: [秒]
    evidenceAnchor: [使用哪份证据]
    whyThisVisual: [为什么在这个时间点用这个画面]
    motionLevel: [none | light | medium]
    legibilityRisk: [low | medium | high]
    voiceoverMustVerbalizeEvidence: [true | false]
```

不得仅靠 spokenClause 文本匹配，必须通过 ID 关联。

### 声画同步硬规则

- 描述真实结果 → 展示对应证据
- 引用真实文件 → 展示原文或准确还原
- 解释抽象原因 → 使用关系、路径或状态变化
- 给操作步骤 → 操作随口播逐步出现
- 做类比 → 类比对象随口播推进
- 总结时才使用抽象结论画面

禁止：口播讲截图细节，画面已经切到流程图。

## 静态生图策略

```text
assetStrategy:
  generated-static: 情绪 Hook 和类比关键画面，静态完整呈现
  screenshot-led-raw: 原始截图直接使用
  screenshot-led-prepared: 截图预处理后使用
  component-only: 纯 Remotion 组件
  hybrid: 混合

motionLevel:
  none: 静态
  light: 轻微动效
  medium: 中等动效
```

### generated-static 规则

- 静态完整呈现
- 不依赖人物连续动画
- 关键文字不生成在图内
- 风格与封面和视频色板一致
- 生图负责画面感，Remotion 负责时间线与必要文字层

### screenshot-led-raw 规则

- 必须同时标记 legibilityRisk
- voiceoverMustVerbalizeEvidence: true
- 不得依赖观众自行阅读密集截图
- 手机端审片不清楚时，通过 Revision Router 返回素材呈现层

## 精简视觉模式参考

### pressure-build（production-validated）

- 适用：Hook 压力构建
- 初始状态：观众熟悉的场景
- 核心变化：压力逐步累积
- 最终状态：痛点被放大
- 禁止退化：不要变成纯文字列表

### fragment-to-manual（production-validated）

- 适用：碎片汇聚成手册
- 初始状态：散落的便签/知识点
- 核心变化：逐步汇聚
- 最终状态：形成结构化手册
- 禁止退化：不要一开始就展示最终形态

### detour-vs-direct-path（production-validated）

- 适用：绕路与直达对比
- 初始状态：两条路径并存
- 核心变化：同时展示绕路和直达
- 最终状态：对比清晰
- 禁止退化：不要只用文字说明

### wrong-to-correct（production-validated）

- 适用：错误到正确的纠正
- 初始状态：错误做法
- 核心变化：划掉错误，展示正确
- 最终状态：正确做法确立
- 禁止退化：不要只用文字对比

### confused-to-guided（production-validated）

- 适用：困惑到被引导
- 初始状态：困惑的人物/场景
- 核心变化：逐步获得指引
- 最终状态：方向明确
- 禁止退化：不要跳过困惑直接给答案

### evidence-comparison（director-reference-only）

- 适用：证据对比
- 初始状态：两组数据/案例并列
- 核心变化：高亮差异
- 最终状态：结论清晰
- 禁止退化：不要只用表格
- 注意：导演参考模式，Agent 无同名正式组件

## 参考

- 能力真源见 08
- 输出格式见 07
