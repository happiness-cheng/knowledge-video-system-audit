# 输出格式合约

## 目标

定义各阶段需要交付的格式，不重复内容判断规则。

## contentBrief

从已批准的母稿、Beat 和 Scope 中派生的结构化交接摘要。不得添加母稿中不存在的新结论、改变核心案例、改变内容范围、与 draftBody 形成竞争真源。

```json
{
  "title": "视频标题",
  "targetAudience": "谁会看",
  "coreThesis": "核心结论",
  "contentType": "类型",
  "tone": "语气",
  "audienceStrategy": {
    "viewerPain": "痛点",
    "whyWatchNow": "为什么现在看",
    "primaryViewer": "主要观众",
    "potentialViewer": "潜在观众"
  },
  "narrativeDesign": {
    "hook": "开场事件",
    "turningPoints": ["转折点"],
    "conclusion": "结论"
  },
  "scopeContract": {
    "mustAnswer": ["必须回答的问题"],
    "mustNotExceed": "范围边界",
    "outOfScope": ["不讲的内容"]
  }
}
```

## researchSynthesis

```json
{
  "recurringViewerPain": "反复出现的观众痛点",
  "strongAngles": ["有力的切入角度"],
  "loadBearingFacts": ["支撑叙事的关键事实"],
  "counterArguments": ["反例与不同观点"],
  "unreliableClaims": ["未验证或不可靠的主张"],
  "underAnsweredQuestions": ["观众尚未被回答的问题"],
  "recommendedScope": "建议的内容范围",
  "contentToDefer": ["建议延后或不讲的内容"]
}
```

## contentMasterDraft

```json
{
  "coreQuestion": "这条视频回答什么核心问题",
  "viewerSituation": "观众在什么处境下会看",
  "openingTension": "开场用什么张力抓住人",
  "personalCase": "用哪个真实案例贯穿",
  "keyEvidence": ["支撑结论的关键证据"],
  "progressiveReveals": ["逐步揭示的信息层次"],
  "mustAnswer": ["必须回答的问题，一般 4—6 项"],
  "examplesAndAnalogies": ["例子与类比"],
  "boundaries": "不讲什么、为什么",
  "finalTakeaway": "观众离开时带走什么",
  "immediateAction": "看完可以立刻做什么",
  "contentToDefer": ["超出承诺范围的内容"],
  "toneReference": "语气参考",
  "draftBody": "连续自然的内容母稿正文，是作品内容真源"
}
```

`draftBody` 是作品内容真源。后续 Beat、口播和画面必须从 draftBody 派生。不得只输出字段提纲代替母稿正文。

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

## beatSheet + shotPlan

```json
{
  "beatSheet": [
    {
      "beatId": "B01",
      "timeRange": "0-5s",
      "role": "hook",
      "content": "具体痛点/现场 + 反差"
    }
  ],
  "shotPlan": [
    {
      "beatId": "B01",
      "shots": [
        {
          "shotId": "B01-S01",
          "duration": 3,
          "visualFocus": "观众第一眼看到什么",
          "visualState": "画面状态",
          "transition": "变化",
          "assetStrategy": "generated-static | screenshot-led-raw | screenshot-led-prepared | component-only | hybrid",
          "motionLevel": "none | light | medium",
          "legibilityRisk": "low | medium | high",
          "voiceoverMustVerbalizeEvidence": false
        }
      ]
    }
  ]
}
```

默认 1 Shot = 1 Scene。Agent 合并相邻 Shot 为同一 Scene 内多个 Sequence 时，不得改变 Shot 顺序、spokenClause、证据、视觉状态变化或已批准时长意图。

## voiceoverVisualAlignment

```json
{
  "alignment": [
    {
      "alignmentId": "A01",
      "beatId": "B01",
      "shotId": "B01-S01",
      "sceneId": null,
      "spokenClause": "口播分句",
      "visualSource": "generated-static | screenshot-led-raw | screenshot-led-prepared | component-only | hybrid",
      "visualState": "画面当前状态",
      "visualAction": "画面执行的动作",
      "onScreenText": "画面上显示的文字",
      "durationEstimate": 3,
      "evidenceAnchor": "使用哪份证据",
      "whyThisVisual": "为什么在这个时间点用这个画面",
      "motionLevel": "none | light | medium",
      "legibilityRisk": "low | medium | high",
      "voiceoverMustVerbalizeEvidence": true
    }
  ]
}
```

`sceneId` 在 GPT 候选阶段可以为 null，Agent 编译为 videoSpec 后回填。不得仅靠 spokenClause 文本匹配。

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

## coverBrief

```json
{
  "directions": [
    {
      "mainTitle": "主标题",
      "visualEvent": "封面展示什么具体场景",
      "firstVisualCenter": "观众第一眼看到什么",
      "emotion": "情绪",
      "style": "warm-editorial-comic",
      "evidenceHint": "最多一个证据提示，可为 null"
    }
  ],
  "recommended": 0,
  "mobileReadable": true,
  "consistentWithHook": true,
  "thumbnailCompetitive": "评价"
}
```

## visualDirectionSpec

按 05 导演卡格式输出关键 scene。

## preProductionReview（Legacy 单审查，仅 Quick / Deep 使用）

V3.1 Standard 使用双审查格式，见下方 `V3.1 preProductionReview` 小节。Quick 和 Deep 仍使用本格式。

```json
{
  "contractVersion": "2.0",
  "scores": {
    "topicPromise": 0,
    "researchAndTruth": 0,
    "contentMasterDraft": 0,
    "hookStructure": 0,
    "cover": 0,
    "voiceoverVisualSync": 0,
    "consistency": 0
  },
  "totalScore": 0,
  "issues": [
    {
      "type": "问题类型",
      "scene": "sceneId",
      "description": "描述",
      "rootCause": "根因真源"
    }
  ],
  "recommendation": "pass / revise / stop"
}
```

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

通过规则：平均分 ≥ 4.0，promiseDelivery / firstFiveSeconds / visualExplanation / mobileReadability 均 ≥ 4，无 blocker。

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

## approvedContentSnapshot

内容进入画面系统前的锁定快照。所有视觉产物必须携带同一个 contentSnapshotId。

```json
{
  "contractVersion": "3.1",
  "contentSnapshotId": "CS-YYYYMMDD-xxxx",
  "sourceDigest": "sha256",
  "approvedAt": "ISO date | null",
  "userDecision": "approved | pending",
  "sources": {
    "contentMasterDraft": "path-or-id",
    "beatSheet": "path-or-id",
    "shotPlan": "path-or-id",
    "coverBrief": "path-or-id"
  }
}
```

draftBody、Beat 顺序、核心证据、口播含义或标题承诺发生实质修改时，旧视觉产物全部失效。修改字幕错字、格式或不改变含义的小修，可保留快照，但必须记录 patch。

## shotDirectorSpec

每个 Shot 一份，是内容与画面的唯一交接规格。

```json
{
  "contractVersion": "3.1",
  "contentSnapshotId": "CS-...",
  "beatId": "B01",
  "shotId": "B01-S01",
  "contentSourceRef": "draftBody paragraph / claim id",
  "spokenClause": "该 Shot 对应的口播含义",
  "explanationGoal": "该 Shot 必须让观众理解什么",
  "informationDelta": "相比上一个 Shot 新增什么认知",
  "primaryAttentionTarget": "此刻观众首先看哪里",
  "objects": ["画面知识对象"],
  "initialState": "初始状态",
  "semanticAction": "核心解释动作",
  "finalState": "最终状态",
  "enterMotion": { "type": "类型", "purpose": "为什么这样进入" },
  "holdMotion": {
    "type": "类型或 none",
    "purpose": "停留阶段怎样继续讲解",
    "noneReason": null
  },
  "exitOrCarryMotion": {
    "type": "退出或延续方式",
    "carryObject": "带入下一 Shot 的对象或 null"
  },
  "continuityAnchor": "与前后 Shot 保持连续的对象",
  "ambientMotion": {
    "type": "none | drift | pulse | flow | breathe",
    "purpose": "只负责生命感"
  },
  "assetStrategy": "generated-static | screenshot-led-raw | screenshot-led-prepared | component-only | hybrid",
  "evidenceAnchor": "证据引用或 null",
  "implementationLock": "locked | preferred | open",
  "capabilityStatus": "supported | hold-motion-patch | new-component-gap | fallback-unacceptable",
  "fallbackPolicy": "return-gap",
  "acceptanceCriteria": ["验收标准"]
}
```

## semanticVoiceoverVisualAlignment

TTS 前的语义对齐，只锁定含义，不锁定帧数。

```json
{
  "alignment": [
    {
      "alignmentId": "A01",
      "contentSnapshotId": "CS-...",
      "beatId": "B01",
      "shotId": "B01-S01",
      "spokenClause": "口播含义",
      "visualMeaning": "对应视觉含义",
      "evidenceAnchor": null
    }
  ]
}
```

## capabilityPreflight

每个 Shot 的能力预检结果。

```json
{
  "items": [
    {
      "shotId": "B01-S01",
      "capabilityStatus": "supported | hold-motion-patch | new-component-gap | fallback-unacceptable",
      "recommendedHost": "组件或 Scene",
      "requiredCapabilities": ["能力"],
      "missingCapabilities": [],
      "implementationPlan": "实现摘要"
    }
  ]
}
```

## timedVisualAlignment

TTS 后的时序对齐，由 Agent 根据真实 audioTiming.json 编译。

```json
{
  "alignment": [
    {
      "alignmentId": "A01",
      "shotId": "B01-S01",
      "audioSegmentId": "AUD-001",
      "startMs": 0,
      "endMs": 4300,
      "startFrame": 0,
      "endFrame": 129,
      "sceneId": "S01"
    }
  ]
}
```

## shotSceneCompileMap

Shot 到 Scene 的编译映射。合并时保留所有 sourceShotIds 和 alignmentIds。

```json
{
  "entries": [
    {
      "sceneId": "S01",
      "sourceShotIds": ["B01-S01"],
      "alignmentIds": ["A01"]
    }
  ]
}
```

## visualSnapshot

视觉产物汇总快照。

```json
{
  "contractVersion": "3.1",
  "visualSnapshotId": "VS-YYYYMMDD-xxxx",
  "contentSnapshotId": "CS-...",
  "candidateDigest": "sha256",
  "shotDirectorSpecs": ["路径列表"],
  "semanticAlignments": ["路径列表"]
}
```

## V3.1 preProductionReview（Standard 双审查）

Standard 模式必须包含两份独立审查。用户批准不再嵌入本文件，见下方 `userApproval`。

```json
{
  "contractVersion": "3.1",
  "mode": "standard",
  "contentSnapshotId": "CS-...",
  "visualSnapshotId": "VS-...",
  "candidateDigest": "sha256",
  "reviews": [
    {
      "reviewId": "R01",
      "reviewerKind": "gpt-self",
      "reviewerSystem": "openai-gpt",
      "independent": true,
      "contentSnapshotId": "CS-...",
      "visualSnapshotId": "VS-...",
      "candidateDigest": "sha256",
      "scores": {
        "topicPromise": 0,
        "researchAndTruth": 0,
        "contentMasterDraft": 0,
        "hookStructure": 0,
        "cover": 0,
        "voiceoverVisualSync": 0,
        "consistency": 0
      },
      "totalScore": 0,
      "issues": [],
      "vetoes": [],
      "recommendation": "pass | revise | stop",
      "reviewedAt": "ISO date"
    },
    {
      "reviewId": "R02",
      "reviewerKind": "external-ai",
      "reviewerSystem": "anthropic-claude",
      "independent": true,
      "contentSnapshotId": "CS-...",
      "visualSnapshotId": "VS-...",
      "candidateDigest": "sha256",
      "scores": { ... },
      "totalScore": 0,
      "issues": [],
      "vetoes": [],
      "recommendation": "pass | revise | stop",
      "reviewedAt": "ISO date"
    }
  ],
  "aggregate": {
    "averageScore": 0,
    "minimumScore": 0,
    "pass": false
  }
}
```

字段规则：

- `reviewerKind`：`gpt-self` = GPT 自检，`external-ai` = 独立外部 AI。不再使用字符串包含判断。
- `reviewerSystem`：规范为小写枚举（`openai-gpt`、`anthropic-claude`、`google-gemini`、`other`）。trim + lowercase 后判断是否不同系统。
- 三个标识（`contentSnapshotId`、`visualSnapshotId`、`candidateDigest`）顶层和每份 review 全部必填，缺失或不一致均阻断。
- `scores` 七个维度总分必须等于 `totalScore`。
- `issues` 使用结构化 `ReviewIssue`（dimension / severity / description / evidence）。

Standard 通过条件：

- review 数量 ≥ 2
- 至少 2 个不同 reviewerSystem（规范化后比较）
- 至少 1 个 `reviewerKind = gpt-self`
- averageScore > 85
- minimumScore > 85
- 所有 recommendation = pass
- 所有 vetoes 为空
- 三个标识全部一致

评分为 85 不通过。Deep 仍按 90 分门禁执行。

## V3.1 userApproval（独立于审查）

用户批准独立于 AI 审查，不得嵌入 preProductionReview。

```json
{
  "contractVersion": "3.1",
  "contentSnapshotId": "CS-...",
  "visualSnapshotId": "VS-...",
  "candidateDigest": "sha256",
  "userDecision": "pending | continue | revise | stop",
  "approvedByUser": false,
  "decisionNote": "",
  "decidedAt": null
}
```

规则：

- AI review pass 不等于用户批准
- Agent 不得自行把 pending 改为 continue
- review-ready 阶段可以在用户批准前完成
- execution gate 同时要求 review 通过和 userApproval 明确通过（userDecision=continue, approvedByUser=true）

## publishMetadata

```json
{
  "titles": ["标题A", "标题B"],
  "recommendedTitle": "推荐标题",
  "descriptions": ["简介A", "简介B"],
  "tags": ["标签"]
}
```

## 口播规则

- voiceover 必须自然、适合说出来
- spokenText 是实际朗读文本，不是书面文章
- 字幕忠实跟随 spokenText
- 画面文字不显示口播全文
- 技术英文词按自然语境保留
- 口播变更后，原字幕和音频时序失效

## 参考

- 内容判断规则见 01—06
- 能力与项目事实见 08
