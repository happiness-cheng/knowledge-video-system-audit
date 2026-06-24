# 视觉方向与交接

## 目标

回答两个问题：

1. 画面要表达什么——视觉意图是否清晰、不可替代？
2. 画面怎么做——能力映射是否诚实、可执行？

## 核心原则

- 画面不是内容包装，而是与口播并行的视觉表达线
- 抽象概念转化为可见对象
- 关系转化为空间结构
- 变化转化为运动或状态转换
- 结论从前面的因果关系中浮现

---

## 阶段一：Intent-First Visual Design

此阶段不得选择具体组件。先定义视觉意图。

### 1.1 视觉意图定义

每个关键 Shot 必须先回答：

```text
viewerStateBefore: [进入本 Shot 前观众的状态]
viewerStateAfter: [离开本 Shot 后观众的状态]
designRationale: [为什么需要这个画面——想改变什么认知]
```

### 1.2 五类视觉模式

每个关键 Shot 一个主模式，最多一个辅助模式。不得把模式名称直接绑定成唯一 Scene 组件。

#### visual-narrative（视觉叙事）

让观众经历一个过程。

适用：Hook、案例展示、状态变化、冲突与解决。
选型条件：内容有时间线、因果链或状态变化。

#### visual-explanation（视觉解释）

让观众看懂一个关系或机制。

适用：流程、对比、结构、原理。
选型条件：内容有空间关系、层次结构或并行对比。

#### editorial-design（编辑设计）

让观众看清信息结构。

适用：列表、要点、数据、总结。
选型条件：内容是信息集合，需要清晰组织。

#### typographic-performance（文字表演）

让观众感受到语气和节奏。

适用：关键判断、反转、情绪强调。
选型条件：内容的情感重量需要通过文字的空间运动来传达。

#### real-evidence（真实证据）

让观众相信事实。

适用：截图、代码、数据、实验结果。
选型条件：内容需要真实材料支撑，不能用抽象图形替代。

### 1.3 三类贡献

每个关键 Shot 必须明确主贡献：

```text
explanationContribution: [画面让观众看到口播无法单独传达的什么]
comprehensionContribution: [画面降低什么认知负荷]
attentionContribution: [画面产生什么继续观看的意愿]
```

三项都弱的画面应删除、合并或重写。

### 1.4 声画关系

枚举：

```text
reinforce: 画面让口播信息更具体
complement: 画面承担口播无法传达的部分
contrast: 画面与口播形成张力
evidence: 画面展示口播所引用的真实材料
typographic-performance: 文字按语气进行空间运动
```

必须说明声画各自承担什么。禁止理由只写"为了让观众看到口播内容"。

### 1.5 连续性定义

关键 Shot 必须说明：

```text
carryIn: [从上一个 Shot 带入什么——对象、状态、问题、情绪]
stateChange: [本 Shot 改变什么]
carryOut: [传递给下一个 Shot 什么]
persistentObjects: [哪些对象持续存在]
resetJustification: [如果重置，理由是什么——叙事、认知或节奏理由，不能因为组件无法继承状态]
```

画面清空必须有叙事、认知或节奏理由，不能因为组件无法继承状态而默认重置。

### 1.6 不可丢失意义

```text
lockedMeaning: [锁定时 Agent 不得改变什么]
flexibleImplementation: [Agent 可以自由决定什么]
forbiddenDowngrade: [哪些降级是禁止的]
```

---

## 阶段二：Capability Mapping

视觉意图锁定后，才允许读取能力信息。

### 2.1 能力查询

读取：

- capabilityRegistry
- Scene 类型
- 现有组件
- 素材能力
- Remotion 实现约束

### 2.2 能力决策

选择：

- 直接复用
- 组合现有原语
- 扩展能力
- 新建通用能力
- 使用外部素材
- 发起能力谈判（见 capabilityNegotiation 合约）

### 2.3 能力状态

```text
capabilityStatus: [confirmed | needs-preflight | gap]
capabilityGap: [具体缺什么]
negotiationLevel: [L0 | L1 | L2 | L3]
```

---

## GPT 与 Agent 的实现边界

- GPT 锁定：explanationGoal、知识对象、初始状态、状态变化、最终结论、证据、验收标准、视觉模式、声画关系、连续性
- GPT 推荐：scene host 和 semantic pattern
- Agent 决定：实际组件、props、布局、时间轴、动效和代码实现
- Agent 不得静默改变 lockedMeaning
- capability gap 必须返回用户确认，不得强行降级成文字卡片

## 内容快照与视觉快照

### contentSnapshotId

内容进入画面系统前必须生成 approvedContentSnapshot：

```text
contractVersion: "4.0"
contentSnapshotId: CS-YYYYMMDD-xxxx
sourceDigest: sha256
approvedAt: ISO date | null
userDecision: approved | pending
sources: { topicDecision, contentMasterDraft, beatSheet, contentSegmentPlan, scopeContract, evidenceNotes }
```

所有视觉产物必须携带同一个 contentSnapshotId。draftBody、Beat 顺序、核心证据、口播含义或标题承诺发生实质修改时，旧视觉产物全部失效。

### visualSnapshotId

视觉产物汇总快照：

```text
contractVersion: "4.0"
visualSnapshotId: VS-YYYYMMDD-xxxx
contentSnapshotId: CS-...
visualDigest: sha256
shotDirectorSpecs: [路径列表]
semanticAlignments: [路径列表]
```

> candidateDigest 在 visualSnapshot 和 coverBrief 完成后单独生成，覆盖全部正式 reviewedInputs。

## 关键 Shot 导演卡

```text
shotId: [B01-S01]
beatId: [B01]

viewerStateBefore: [进入前状态]
viewerStateAfter: [离开后状态]
designRationale: [为什么需要这个画面]

primaryVisualMode: [visual-narrative | visual-explanation | editorial-design | typographic-performance | real-evidence]
secondaryVisualMode: [可选]

explanationContribution: [解释贡献]
comprehensionContribution: [理解贡献]
attentionContribution: [吸引贡献]

audioVisualRelation: [reinforce | complement | contrast | evidence | typographic-performance]
spokenResponsibility: [口播承担什么]
visualResponsibility: [画面承担什么]
onScreenTextPurpose: [画面上的文字为什么存在]

semanticEvent: [核心语义事件]
objects: [出现哪些对象]
initialState: [对象的初始状态]
stateChange: [对象发生什么变化]
finalState: [对象的最终状态]

carryIn: [带入什么]
carryOut: [带出什么]
persistentObjects: [持续存在的对象]
resetJustification: [重置理由或 null]

truthMode: [fact | experiment | inference | opinion | analogy]
evidenceAnchor: [使用哪份证据]
evidenceBoundary: [证据不得被怎样改变]

lockedMeaning: [锁定意义]
flexibleImplementation: [可自由决定的部分]
forbiddenDowngrade: [禁止的降级]

capabilityStatus: [confirmed | needs-preflight | gap]
capabilityGap: [具体缺什么]
negotiationLevel: [L0 | L1 | L2 | L3]

acceptanceCriteria: [验收标准]
requiredRenderEvidence: [需要什么渲染证据]
```

### implementationLock 定义

- `locked`：视觉变化本身承载核心解释，Agent 不得改变状态变化和最终结论
- `preferred`（默认）：GPT 推荐实现方式，Agent 可在不改变解释目标的前提下调整
- `open`：Agent 自由实现，但不得改变解释目标

## Shot Director Spec

每个 Shot 必须生成 shotDirectorSpec（详细 JSON Schema 见 `contracts/` 目录）：

```text
contractVersion: "4.0"
contentSnapshotId: CS-...
beatId: B01
shotId: B01-S01
contentSourceRef: draftBody paragraph / claim id
spokenClause: 该 Shot 对应的口播含义
explanationGoal: 该 Shot 必须让观众理解什么
informationDelta: 相比上一个 Shot 新增什么认知
primaryAttentionTarget: 此刻观众首先看哪里

primaryVisualMode: [主视觉模式]
secondaryVisualMode: [辅助视觉模式]
audioVisualRelation: [声画关系]

objects: [画面知识对象]
initialState: 初始状态
semanticAction: 核心解释动作
finalState: 最终状态

carryIn: [带入]
carryOut: [带出]
persistentObjects: [持续对象]

enterMotion: { type, purpose }
holdMotion: { type, purpose, noneReason? }
exitOrCarryMotion: { type, carryObject }
continuityAnchor: 与前后 Shot 保持连续的对象
ambientMotion: { type: none|drift|pulse|flow|breathe, purpose }

assetStrategy: generated-static | screenshot-led-raw | screenshot-led-prepared | component-only | hybrid
evidenceAnchor: 证据引用或 null
truthMode: fact | experiment | inference | opinion | analogy
evidenceBoundary: [证据不得被怎样改变]

implementationLock: locked | preferred | open
lockedMeaning: [锁定意义]
capabilityStatus: supported | hold-motion-patch | new-component-gap | fallback-unacceptable
fallbackPolicy: return-gap
acceptanceCriteria: [验收标准]
requiredRenderEvidence: [需要什么渲染证据]
```

### enterMotion / holdMotion / exitOrCarryMotion

- enterMotion：对象如何进入画面，为什么这样进入
- holdMotion：停留阶段怎样继续讲解。type=none 时必须说明 noneReason
- exitOrCarryMotion：退出方式，或带入下一 Shot 的对象
- ambientMotion：只负责生命感，不承担核心结论

## 非关键 Shot 最低要求

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

- 设计哲学见 11（核心）、12（完整版）
- 能力真源见 08
- 能力谈判见 capabilityNegotiation 合约
- 输出格式见 07
