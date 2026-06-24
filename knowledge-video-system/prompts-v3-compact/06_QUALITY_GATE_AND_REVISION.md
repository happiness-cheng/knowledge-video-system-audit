# 质量门禁与修改

## 目标

三个独立阶段，不得混用：制作前自审、成片审查、问题路由。

---

## A. Pre-production Self Review

评审交付包（不是成片）。

### 评分维度

| 维度                 |    分值 |
| -------------------- | ------: |
| 选题、痛点与内容承诺 |      20 |
| 研究、事实与证据     |      15 |
| 内容母稿与人类表达   |      25 |
| Hook、结构与留存     |      15 |
| 封面方向             |      10 |
| 声画导演与同步       |      10 |
| 交付包一致性         |       5 |
| **总分**             | **100** |

### Quick 门禁

- 总分 ≥ 80
- topicPromise ≥ 14/20
- researchAndTruth ≥ 10/15
- contentMasterDraft ≥ 18/25
- hookStructure ≥ 11/15
- cover ≥ 7/10
- voiceoverVisualSync ≥ 7/10
- consistency ≥ 3/5
- 无 veto

### Standard / Deep 门禁（V4 统一 4-role gate）

Standard 和 Deep 均使用统一的 4-role gate。4 个独立浏览器 AI 会话，冻结同一 candidateDigest。

Deep 进入 4-role gate 前需通过自检 >= 88 分。

4 个角色：

| 角色                  | 职责                                 |
| --------------------- | ------------------------------------ |
| cold-viewer           | 模拟首次观众，检查理解和参与度       |
| content-editor        | 检查内容质量、结构、完整性           |
| fact-evidence         | 检查事实准确性、证据充分性、真值边界 |
| visual-audio-director | 检查视觉解释、声画同步、动效质量     |

要求：

- 4 份独立 review，每份 independent: true
- 至少 2 个不同 reviewerSystem
- 所有 review 使用相同 candidateDigest
- 无 hard veto

通过条件：

- meanScore >= 90
- medianScore >= 90
- minimumScore >= 85
- max-min <= 8

不允许 Agent 模拟审查。必须是真实、独立的浏览器 AI 会话。

### 输出（V4 4-role gate）

```text
preProductionReview：
  contractVersion: "4.0"
  mode: standard | deep
  contentSnapshotId: CS-...
  visualSnapshotId: VS-...
  candidateDigest: sha256
  reviews:
    - reviewId: R01
      reviewerRole: cold-viewer
      reviewerSystem: openai-gpt
      reviewerId: unique-id
      independent: true
      contentSnapshotId: CS-...
      visualSnapshotId: VS-...
      candidateDigest: sha256
      scores: { topicPromise, researchAndTruth, contentMasterDraft, hookStructure, cover, voiceoverVisualSync, consistency }
      totalScore: 0-100
      issues: []
      recommendation: pass / revise / stop
      reviewedAt: ISO date
    - reviewId: R02
      reviewerRole: content-editor
      reviewerSystem: anthropic-claude
      reviewerId: unique-id
      independent: true
      contentSnapshotId: CS-...
      visualSnapshotId: VS-...
      candidateDigest: sha256
      scores: { ... }
      totalScore: 0-100
      issues: []
      recommendation: pass / revise / stop
      reviewedAt: ISO date
    - reviewId: R03
      reviewerRole: fact-evidence
      reviewerSystem: google-gemini
      reviewerId: unique-id
      independent: true
      contentSnapshotId: CS-...
      visualSnapshotId: VS-...
      candidateDigest: sha256
      scores: { ... }
      totalScore: 0-100
      issues: []
      recommendation: pass / revise / stop
      reviewedAt: ISO date
    - reviewId: R04
      reviewerRole: visual-audio-director
      reviewerSystem: openai-gpt
      reviewerId: unique-id
      independent: true
      contentSnapshotId: CS-...
      visualSnapshotId: VS-...
      candidateDigest: sha256
      scores: { ... }
      totalScore: 0-100
      issues: []
      recommendation: pass / revise / stop
      reviewedAt: ISO date
  aggregate:
    meanScore: 0
    medianScore: 0
    minimumScore: 0
    maxMinSpread: 0
    pass: false
```

用户批准独立于审查，见 07 `userApproval` 小节。

三个标识（contentSnapshotId、visualSnapshotId、candidateDigest）顶层和每份 review 全部必填，缺失或不一致均阻断。

### 输出（Quick / Legacy）

Quick 使用轻量自检格式，不是正式门禁。Legacy 格式见 07 legacy 小节。

---

## A2. V4 Visual Gates

以下门禁在视觉设计和实现阶段执行，与 A 阶段的预制作审查互补。

### VisualContributionGate

分别判断关键 Shot 的三类贡献：

- explanationContribution：画面让观众看到口播无法单独传达的什么
- comprehensionContribution：画面降低什么认知负荷
- attentionContribution：画面产生什么继续观看的意愿

关键 Shot 不要求三项都最高，但必须有明确主贡献。

三项都弱，或删除后几乎无损失，判为无贡献占位画面。

### SemanticFidelityGate

检查：

- 实际画面是否表达了 lockedMeaning
- 因果方向是否正确
- 视觉事件是否真实发生
- 是否只用标签冒充事件
- 是否发生未经批准的语义降级

### VisualContinuityGate

检查：

- 对象身份是否连续
- 状态是否继承
- 因果是否承接
- Beat 状态弧线是否完整
- 全片视觉主线是否回收

### TruthBoundaryGate

检查：

- 戏剧化是否只放大体验，不放大结论
- 隐喻是否越界代替证据
- 证据是否被改变
- 个案是否被表现成普遍结论

### CapabilityNegotiationGate

检查：

- 是否先完成意图设计（Intent-First）
- 是否被现有组件反向锚定
- 能力不足是否报告
- L2 是否有用户批准
- 是否出现 L3

### RenderEvidenceGate

不同问题必须提交对应证据：

| 问题类型 | 证据形式                        |
| -------- | ------------------------------- |
| 裁切     | 实际帧截图 + 边界标注           |
| 动态事件 | 前、中、后三帧或短片段          |
| 状态继承 | 相邻 Shot 边界截图              |
| 可读性   | 手机端缩放截图 + 正常播放       |
| 节奏     | 连续片段播放                    |
| 全片重复 | contact sheet + 统计 + 完整观看 |

命令输出、测试报告、Agent 自报状态不构成视觉证据。

### ViewerAcceptanceGate

最终判断依据是：

- 实际画面
- 正常播放
- 手机端观看
- 冷观看
- 观众实际理解

---

## A3. 完成状态分级

正式采用六级完成状态：

```text
Not Implemented          → 代码未编写
Implemented, Unverified  → 代码存在但未验证
Technically Verified     → 代码运行无报错
Visually Verified        → 实际渲染画面符合设计意图
Semantically Verified    → 画面表达了正确的语义
Viewer Accepted          → 观众实际观看后确认理解
```

只有 `Viewer Accepted` 才能称为视觉完成。

命令成功不等于视觉通过。测试通过不等于语义正确。

---

## A4. 硬否决项

以下任一出现，禁止发布：

- 画面语义与口播相反
- 因果方向错误
- 核心视觉事件缺失
- 连续状态被重置冒充为持续变化
- 隐喻代替证据
- 修改证据原意
- 核心信息在实际设备不可见
- 未经批准的 L2 降级
- 任何 L3 降级
- Agent 以测试通过或渲染成功宣称视觉完成

---

## B. Final Video Review

评审实际成片（不是交付包）。

### 审查输入

- 完整视频
- 封面
- 字幕版
- 关键帧 / contact sheet
- 已批准交付包

### 9 个维度（1-5 分）

- 1 = 失败
- 2 = 明显问题
- 3 = 基本可用但需要修改
- 4 = 达到发布标准
- 5 = 优秀

| 字段                         | 含义               |
| ---------------------------- | ------------------ |
| promiseDelivery              | 封面与开场承诺兑现 |
| firstFiveSeconds             | 前 5 秒吸引力      |
| midVideoPacing               | 中段节奏           |
| visualExplanation            | 视觉解释效果       |
| evidenceClarity              | 证据与截图清晰度   |
| mobileReadability            | 手机可读性         |
| motionAndInformationProgress | 动画与信息推进     |
| subtitlesAndAudio            | 字幕与音频         |
| overallFinish                | 整体完成度         |

### 通过规则

- 平均分 ≥ 4.0
- promiseDelivery、firstFiveSeconds、visualExplanation、mobileReadability 均 ≥ 4
- 无 blocker

### 审查权限边界

ChatGPT / Agent 的审查不是最终发布判断。开场吸引力、节奏是否拖、细节是否粗糙，必须以用户人工连续观看为准。

### 输出

```text
finalVideoReview：
  scores: {
    promiseDelivery: 1-5,
    firstFiveSeconds: 1-5,
    midVideoPacing: 1-5,
    visualExplanation: 1-5,
    evidenceClarity: 1-5,
    mobileReadability: 1-5,
    motionAndInformationProgress: 1-5,
    subtitlesAndAudio: 1-5,
    overallFinish: 1-5
  }
  averageScore: 0-5
  issues: [逐项列出]
  blockers: [阻断项]
  recommendation: pass / revise / stop
```

---

## C. Revision Router

根据成片问题回到最小真源。

### 路由原则

```text
症状 → 根因层 → 唯一真源 → 最小修改范围 → 重新生成下游产物
```

### 问题路由表

| 问题类型                   | 首要修改真源                               | 不要先改       |
| -------------------------- | ------------------------------------------ | -------------- |
| 观众不关心                 | contentBrief / 选题角度                    | Remotion 组件  |
| 标题没兑现                 | Scope / 口播结构                           | 封面美术       |
| 事实错误                   | evidence / voiceover                       | 字幕措辞       |
| 开场无聊                   | openingTension / Hook Beat / 前几个 Shot   | 全局主题       |
| 中段拖沓                   | contentMasterDraft / Beat 删减与 Shot 重组 | 转场速度       |
| 口播像 AI                  | voiceover / spokenText                     | TTS 音色       |
| 画面没参与                 | visualDirection                            | 加装饰动画     |
| 组件做不到                 | capability preflight                       | 强行塞字段     |
| 图片裁切                   | assetManifest                              | contentBrief   |
| 字幕遮挡                   | spokenText / 布局                          | 口播观点       |
| 发音错误                   | spokenText / glossary                      | 画面时长       |
| 封面弱                     | coverBrief                                 | Remotion cover |
| 声画不同步                 | voiceoverVisualAlignment                   | 画面时长       |
| 内容正确但画面表达错误     | shotDirectorSpec                           | Remotion 组件  |
| 声画语义错位               | semanticVoiceoverVisualAlignment           | 画面时长       |
| TTS 后动作错位             | timedVisualAlignment                       | 画面时长       |
| 组件只能退化成文字卡       | capabilityPreflight                        | 强行塞字段     |
| 停留阶段完全静止且没有理由 | holdMotion                                 | 加装饰动画     |

### 强制诊断

每个问题必须先回答：

1. 这是内容、事实、结构、口播、视觉意图、实现、素材、音频还是字幕问题？
2. 问题第一次在哪个上游文件中出现？

### 输出

```text
revisionDecision：
  issues: [问题列表]
  rootCauses: { issue: 真源文件 }
  changes: [修改计划]
  approval:
    userDecision: pending
    approvedByUser: false
```

---

## 参考

- 画面交接见 05
- 输出格式见 07
- Deep 多 AI 审查见 09
