# 输出格式合约索引

## 目标

定义各阶段交付格式。详细 schema 见 `contracts/` 目录。

## 合约版本

主链路统一使用 `contractVersion: "4.0"`。

## 内容阶段合约

| 合约                  | 文件                                                                                 | 说明                                                                  |
| --------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| researchSynthesis     | (见 02B 内联)                                                                        | 研究输出摘要                                                          |
| contentBrief          | [contracts/contentBrief.schema.json](contracts/contentBrief.schema.json)             | 从已批准母稿派生的结构化交接摘要                                      |
| contentMasterDraft    | [contracts/contentMasterDraft.schema.json](contracts/contentMasterDraft.schema.json) | 内容母稿，含 viewerStateChange、contentDesignRationale、visualHandoff |
| beatSheet             | [contracts/beatSheet.schema.json](contracts/beatSheet.schema.json)                   | Beat 结构，含 contentFunction、viewerStateChange、informationDelta    |
| contentSegmentPlan    | [contracts/contentSegmentPlan.schema.json](contracts/contentSegmentPlan.schema.json) | 内容分段计划，不含视觉实现细节                                        |
| humanExpressionReview | (见下方内联)                                                                         | 人类表达检查                                                          |
| coverBrief            | [contracts/coverBrief.schema.json](contracts/coverBrief.schema.json)                 | 封面方向，含 coverViewerStateChange                                   |

## 快照与审批合约

| 合约                    | 文件                                                                                           | 说明                     |
| ----------------------- | ---------------------------------------------------------------------------------------------- | ------------------------ |
| approvedContentSnapshot | [contracts/approvedContentSnapshot.schema.json](contracts/approvedContentSnapshot.schema.json) | 内容快照，只含内容产物（sources: contentMasterDraft, beatSheet, contentSegmentPlan, scopeContract, evidenceNotes；不含 shotDirectorSpec 或 coverBrief） |
| visualSnapshot          | [contracts/visualSnapshot.schema.json](contracts/visualSnapshot.schema.json)                   | 视觉产物汇总快照         |
| preProductionReview     | [contracts/preProductionReview.schema.json](contracts/preProductionReview.schema.json)         | 四角色独立审查           |
| userApproval            | [contracts/userApproval.schema.json](contracts/userApproval.schema.json)                       | 用户批准，独立于 AI 审查 |

## 视觉阶段合约

| 合约                            | 文件                                                                                                           | 说明               |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------ |
| visualPhilosophyAcknowledgement | [contracts/visualPhilosophyAcknowledgement.schema.json](contracts/visualPhilosophyAcknowledgement.schema.json) | Agent 设计哲学确认 |
| visualDirectionSpec             | [contracts/visualDirectionSpec.schema.json](contracts/visualDirectionSpec.schema.json)                         | 视觉方向规格       |
| shotDirectorSpec                | [contracts/shotDirectorSpec.schema.json](contracts/shotDirectorSpec.schema.json)                               | 单 Shot 导演卡     |
| capabilityPreflight             | [contracts/capabilityPreflight.schema.json](contracts/capabilityPreflight.schema.json)                         | 能力预检           |
| capabilityNegotiation           | [contracts/capabilityNegotiation.schema.json](contracts/capabilityNegotiation.schema.json)                     | 能力谈判           |

## 编译与对齐合约

| 合约                             | 文件                                                                                     | 说明                                 |
| -------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------ |
| semanticVoiceoverVisualAlignment | (见 05 内联)                                                                             | TTS 前语义声画对齐，只锁含义不锁帧数 |
| timedVisualAlignment             | [contracts/timedVisualAlignment.schema.json](contracts/timedVisualAlignment.schema.json) | TTS 后时序对齐                       |
| shotSceneCompileMap              | [contracts/shotSceneCompileMap.schema.json](contracts/shotSceneCompileMap.schema.json)   | Shot 到 Scene 编译映射               |

## 验证合约

| 合约                     | 文件                                                                                             | 说明           |
| ------------------------ | ------------------------------------------------------------------------------------------------ | -------------- |
| visualSpikeResult        | [contracts/visualSpikeResult.schema.json](contracts/visualSpikeResult.schema.json)               | 原型验证结果   |
| visualVerificationBundle | [contracts/visualVerificationBundle.schema.json](contracts/visualVerificationBundle.schema.json) | 完整视觉验证包 |
| viewerAcceptanceReview   | [contracts/viewerAcceptanceReview.schema.json](contracts/viewerAcceptanceReview.schema.json)     | 观众验收审查   |

---

## humanExpressionReview

```json
{
  "soundsHuman": true,
  "lectureLikeSections": ["像讲课的段落"],
  "abstractTermsNeedingExamples": ["需要具体例子的抽象术语"],
  "removableSections": ["删掉后不影响核心承诺的段落"],
  "revisionRequired": false
}
```

未通过时不进入 Beat。

---

## videoSpec review candidate

GPT 批准的语义执行候选稿。Agent 根据当前 schema、capabilityRegistry 和 visualDirectionSpec 补齐 type-specific props，再经过 validator 执行。

Agent 可以机械补齐类型字段，但不得改变：

- scene 顺序
- voiceover / spokenText 的含义
- 核心证据
- visualDirection 的状态变化
- 用户批准的标题、封面承诺和结论

```json
{
  "meta": {
    "title": "标题",
    "platform": "multi-platform",
    "aspectRatio": "project-default",
    "fps": 30,
    "theme": "主题ID"
  },
  "brand": {
    "show": true,
    "watermarkText": "世间一点尘"
  },
  "scenes": [
    {
      "id": "S01",
      "beatId": "B01",
      "beatRole": "hook",
      "visualRole": "hook",
      "chapterId": "CH01",
      "humanPresence": "personal-judgment",
      "caseStage": null,
      "evidencePurpose": null,
      "recapOf": null,
      "transferScenario": null,
      "attentionTrigger": "困惑回声",
      "type": "cover",
      "semanticPattern": "pressure-build",
      "durationEstimate": 5,
      "title": "场景标题",
      "screenText": "画面主文案",
      "voiceover": "口播文本（给人看）",
      "spokenText": "TTS文本（给人听）",
      "deliveryHint": "导演备注（代码忽略）",
      "animation": "progressive-reveal"
    }
  ]
}
```

字段说明：

- `voiceover` 给人看，`spokenText` 给 TTS 读
- `deliveryHint` 是审稿备注，代码层忽略
- 不适用的语义字段写 `null`，不要省略
- `audioSegmentIds` 可选，用于一个 scene 包含多段音频时

---

## finalVideoReview

5 分制：1=失败 2=明显问题 3=基本可用但需修改 4=达到发布标准 5=优秀

```json
{
  "scores": {
    "promiseDelivery": 0,
    "firstFiveSeconds": 0,
    "midVideoPacing": 0,
    "visualExplanation": 0,
    "evidenceClarity": 0,
    "mobileReadability": 0,
    "motionAndInformationProgress": 0,
    "subtitlesAndAudio": 0,
    "overallFinish": 0
  },
  "averageScore": 0,
  "issues": ["逐项列出"],
  "blockers": ["阻断项"],
  "recommendation": "pass / revise / stop"
}
```

通过规则：平均分 >= 4.0，promiseDelivery / firstFiveSeconds / visualExplanation / mobileReadability 均 >= 4，无 blocker。

---

## revisionDecision

```json
{
  "issues": ["问题列表"],
  "rootCauses": { "issue1": "真源文件" },
  "changes": ["修改计划"],
  "approval": {
    "userDecision": "pending",
    "approvedByUser": false
  }
}
```

---

## publishMetadata

```json
{
  "titles": ["标题A", "标题B"],
  "recommendedTitle": "推荐标题",
  "descriptions": ["简介A", "简介B"],
  "tags": ["标签"]
}
```

---

## 口播规则

- voiceover 必须自然、适合说出来
- spokenText 是实际朗读文本，不是书面文章
- 字幕忠实跟随 spokenText
- 画面文字不显示口播全文
- 技术英文词按自然语境保留
- 口播变更后，原字幕和音频时序失效

---

## preProductionReview 四角色门禁

V4 审查使用四个独立角色，每个角色独立评分：

| 角色                  | 职责                                   |
| --------------------- | -------------------------------------- |
| cold-viewer           | 冷观众视角：是否愿意看、能否看懂       |
| content-editor        | 内容编辑：结构、逻辑、信息密度         |
| fact-evidence         | 事实证据：准确性、来源、边界           |
| visual-audio-director | 视听导演：画面语义、节奏、音频视觉同步 |

通过条件（全部满足）：

- 4 份独立审查，role 各不相同
- meanScore >= 90
- medianScore >= 90
- minimumScore >= 85
- max - min <= 8
- 无 hard veto
- 三个标识（contentSnapshotId、visualSnapshotId、candidateDigest）全部一致
- scores 七个维度总分等于 totalScore

---

## Legacy 结构

以下结构仅用于 V3.1 数据迁移，新流程不得使用：

- preProductionReview (V3.1 Standard dual-review) -> 已合并入四角色门禁
- shotPlan (含 visualFocus / visualState / transition) -> 已拆分为 contentSegmentPlan + shotDirectorSpec

---

## 参考

- 内容判断规则见 01--06
- 能力与项目事实见 08
- 能力谈判见 CAPABILITY_NEGOTIATION.md
