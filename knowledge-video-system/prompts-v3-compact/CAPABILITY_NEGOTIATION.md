# 能力谈判合约

> 当视觉意图无法用现有组件直接实现时，启动本合约。

## 目标

在不降低表达目标的前提下，诚实评估能力差距，选择最佳实现路径。

## 核心原则

- 现有组件可以决定怎么做，不能决定做什么
- 能力可以限制实现方式，不能擅自改写表达目标
- 做不到可以谈，偷偷降级不可以

## 启动条件

以下任一出现时启动：

- capabilityStatus = gap
- 现有组件无法承载视觉意图
- 需要删除或降级关键视觉事件
- 一个画面是否只是占位页存在争议

## 谈判流程

### Step 1：确认原始意图

```text
originalIntent: [原始视觉意图]
viewerCognitiveGoal: [观众认知目标]
coreVisualEvent: [核心视觉事件]
lockedMeaning: [锁定意义]
```

### Step 2：识别能力差距

```text
capabilityGap: [具体缺什么]
whyExistingComponentsFail: [现有组件为何无法满足]
silentDowngradeRisk: [如果静默降级会损失什么]
```

### Step 3：提出降级选项

每个选项必须包含：

```text
options:
  - optionId: OPT-01
    implementationApproach: [实现方式]
    explanationLoss: [解释贡献损失——无 / 轻微 / 明显 / 严重]
    comprehensionLoss: [理解贡献损失——无 / 轻微 / 明显 / 严重]
    attentionLoss: [吸引贡献损失——无 / 轻微 / 明显 / 严重]
    truthRisk: [事实风险——无 / 可能 / 会]
    estimatedCost: [预估工作量]
    reusableValue: [可复用价值——无 / 低 / 中 / 高]
    downgradeLevel: [L0 | L1 | L2 | L3]
```

### Step 4：选择方案

```text
recommendedOption: [推荐的 optionId]
reason: [为什么推荐]
requiresUserApproval: [true | false]
```

## 降级等级

### L0：仅形式变化，无实质损失

- 无需启动 capabilityNegotiation
- 但必须在 implementation decision 或 shotSceneCompileMap 中留下简短记录
- 例子：换一个同等功能的组件、调整颜色和间距

### L1：轻微表现力损失，必须记录

- 可自行决定但必须记录
- 例子：动效简化为静态、入场方式改变但语义不变

### L2：解释、理解或吸引明显下降，必须获得用户批准

- Agent 无权自行批准
- 必须提交用户确认
- 例子：核心视觉事件被简化为文字说明、状态变化被省略

### L3：语义或事实损失，禁止执行

- 不得作为可执行方案
- 例子：因果方向错误、证据被改变、核心信息不可见

## 审批规则

- L0：自行决定，留简短记录
- L1：自行决定，记录到 capabilityNegotiation
- L2：必须获得用户批准，记录到 capabilityNegotiation
- L3：禁止执行，不得出现在推荐方案中

## 输出格式

```text
capabilityNegotiation:
  negotiationId: NEG-YYYYMMDD-xxxx
  contentSnapshotId: CS-...
  shotId: [涉及的 Shot]
  originalIntent: [原始意图]
  viewerCognitiveGoal: [观众认知目标]
  coreVisualEvent: [核心视觉事件]
  lockedMeaning: [锁定意义]
  capabilityGap: [能力差距]
  whyExistingComponentsFail: [为何现有组件不够]
  silentDowngradeRisk: [静默降级风险]
  options:
    - optionId: OPT-01
      implementationApproach: [实现方式]
      explanationLoss: [解释损失]
      comprehensionLoss: [理解损失]
      attentionLoss: [吸引损失]
      truthRisk: [事实风险]
      estimatedCost: [工作量]
      reusableValue: [可复用价值]
      downgradeLevel: [L0 | L1 | L2 | L3]
    - optionId: OPT-02
      ...
  recommendedOption: [推荐方案]
  reason: [推荐理由]
  requiresUserApproval: [true | false]
  userDecision: [approved | rejected | pending]
  decidedAt: [ISO date | null]
```

## 禁止事项

- Agent 无权自行批准 L2
- L3 不得作为可执行方案
- 不得静默降级——任何降级（含 L0）必须留有记录
- 不得为了兼容现有组件弱化表达目标
- 不得把 L3 包装成 L2 提交审批

## 参考

- 视觉设计哲学见 11（核心）、12（完整版）
- 视觉方向见 05
- 质量门禁见 06
