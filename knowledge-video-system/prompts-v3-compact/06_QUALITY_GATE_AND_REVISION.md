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

### Standard 门禁

Standard 执行双独立审查：

- 至少 2 份 review
- 至少 2 个不同 reviewerSystem
- 其中一份必须是 GPT 自检
- 另一份必须来自独立 AI
- averageScore > 85
- minimumScore > 85
- 所有 recommendation = pass
- 所有 vetoes 为空
- candidateDigest 完全相同

评分为 85 不通过。

单份自评分维度门槛：

- topicPromise ≥ 16/20
- researchAndTruth ≥ 12/15
- contentMasterDraft ≥ 20/25
- hookStructure ≥ 12/15
- cover ≥ 8/10
- voiceoverVisualSync ≥ 8/10
- consistency ≥ 4/5
- 无事实、承诺或可执行性 veto

### Deep 内部预检

- GPT 自评分 ≥ 88
- 选题 ≥ 17/20，研究事实 ≥ 13/15，内容母稿 ≥ 22/25
- Hook ≥ 13/15，封面 ≥ 8/10，声画同步 ≥ 9/10，一致性 ≥ 4/5
- 通过后才进入多 AI 审查（见 09）

### 输出（V3.1 Standard 双审查）

```text
preProductionReview：
  contractVersion: "3.1"
  contentSnapshotId: CS-...
  visualSnapshotId: VS-...
  candidateDigest: sha256
  mode: standard
  reviews:
    - reviewId: R01
      reviewerSystem: gpt
      contentSnapshotId: CS-...
      visualSnapshotId: VS-...
      candidateDigest: sha256
      scores: { ... }
      totalScore: 0-100
      recommendation: pass / revise / stop
      vetoes: []
    - reviewId: R02
      reviewerSystem: external-ai
      contentSnapshotId: CS-...
      visualSnapshotId: VS-...
      candidateDigest: sha256
      scores: { ... }
      totalScore: 0-100
      recommendation: pass / revise / stop
      vetoes: []
  aggregate:
    averageScore: 0
    minimumScore: 0
    pass: false
  approval:
    userDecision: pending
    approvedByUser: false
```

两份审查的 contentSnapshotId、visualSnapshotId、candidateDigest 必须与顶层完全一致。

### 输出（Quick / Deep / Legacy）

Quick 和 Deep 使用旧单审查格式，见 07 legacy 小节。

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
