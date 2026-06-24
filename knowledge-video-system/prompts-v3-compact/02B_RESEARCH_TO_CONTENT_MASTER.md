# 研究到内容母稿

## 目标

搜索资料后不直接进入 Scene 结构，先形成可被真人自然讲述的内容母稿。

## 适用范围

- Quick：可跳过研究，直接从素材到内容母稿
- Standard / Deep：必须完成研究，再写内容母稿

---

## A. 研究检查（Standard / Deep）

正式内容草案前，至少检查四类资料：

1. 官方或一手来源
2. 用户真实痛点、评论、问题与社区表达
3. 高表现同类内容的标题、开头、结构、评论追问
4. 反例、不同观点和能力边界

### 高表现内容的使用边界

只用于：

- 理解受众
- 提炼痛点
- 研究结构
- 寻找观众尚未被回答的问题

其中的数字、技术结论和因果主张必须回到官方或一手来源核验。

### 研究输出

只保留以下字段，不得把搜索结果直接堆进脚本：

```text
researchSynthesis:
  recurringViewerPain: [反复出现的观众痛点]
  strongAngles: [有力的切入角度]
  loadBearingFacts: [支撑叙事的关键事实]
  counterArguments: [反例与不同观点]
  unreliableClaims: [未验证或不可靠的主张]
  underAnsweredQuestions: [观众尚未被回答的问题]
  recommendedScope: [建议的内容范围]
  contentToDefer: [建议延后或不讲的内容]
```

---

## B. 内容母稿

研究完成后，先生成自然语言内容母稿，不生成 Scene JSON。

### 必须包含的要素

```text
contentMasterDraft:
  coreQuestion: [这条视频回答什么核心问题]
  viewerSituation: [观众在什么处境下会看]
  openingTension: [开场用什么张力抓住人]
  personalCase: [用哪个真实案例贯穿]
  keyEvidence: [支撑结论的关键证据]
  progressiveReveals: [逐步揭示的信息层次]
  mustAnswer: [必须回答的问题，一般 4—6 项]
  examplesAndAnalogies: [例子与类比]
  boundaries: [不讲什么、为什么]
  finalTakeaway: [观众离开时带走什么]
  immediateAction: [看完可以立刻做什么]
  contentToDefer: [超出承诺范围的内容]
  toneReference: [语气参考]
  draftBody: [连续自然的内容母稿正文]

  viewerStateChange:
    viewerStateBefore: [观众观看前怎么想]
    viewerStateAfter: [观看后应该怎么想]
    stateChangeReason: [依靠什么完成变化]

  contentDesignRationale:
    whyThisOpening: [为什么选这个开场]
    whyThisCase: [为什么用这个案例]
    whyThisEvidenceOrder: [为什么这样排列证据]
    whyThisRevealOrder: [为什么这样安排揭示顺序]
    whyThisBoundary: [为什么这样划定边界]
```

### 内容向画面的交接标注

内容母稿必须为每个主要段落标注表达任务，供画面系统使用：

```text
visualHandoff:
  - beatId: [所属 Beat]
    contentSourceRef: [对应 draftBody 段落]
    mustBeSeen: [必须被观众看见的关系、过程或证据]
    canBeSpoken: [可以只由口播承担的部分]
    mustUseEvidence: [必须展示真实材料的部分]
    needsVisualProcess: [需要视觉表现过程的部分]
    needsEmotionalExperience: [需要情绪体验的部分]
    whyThisNeedsVisualSupport: [为什么需要画面支持]
```

visualHandoff 是数组，每个主要 Beat 或内容段落一条。

内容系统不能替画面系统指定组件，但要说清表达任务与原因。

`draftBody` 是作品内容真源：一篇连续、自然、未切 Beat/Shot/Scene 的内容母稿正文。后续 Beat、口播和画面必须从 draftBody 派生。不得只输出字段提纲代替母稿正文。

### 写作要求

- 围绕一个核心问题
- 使用一个主要真实案例贯穿
- mustAnswer 一般控制在 4—6 项
- 超出承诺范围的内容进入 contentToDefer
- 不得因为资料丰富而自动扩展成完整百科
- 先写成真人可以自然讲述的连续内容
- 不使用 Scene 编号和组件名
- 不默认使用"第一、第二、第三"的授课结构

---

## C. 人类表达检查

内容母稿进入 Beat 之前，必须进行朗读式检查。

### 检查项

- 真人现实中会这样说吗？
- 是否连续出现抽象名词？
- 是否每个术语都有具体例子或大白话解释？
- 是否存在知识清单连续堆叠？
- 是否有"我原本以为—后来发现"的真实认知变化？
- 是否为了讲全而失去核心主线？
- 删除某一段后，核心承诺是否仍然成立？

### 输出

```text
humanExpressionReview:
  soundsHuman: true/false
  lectureLikeSections: [像讲课的段落]
  abstractTermsNeedingExamples: [需要具体例子的抽象术语]
  removableSections: [删掉后不影响核心承诺的段落]
  revisionRequired: true/false
```

未通过时先修改内容母稿，不进入 Beat。

---

## 参考

- 选题与承诺见 01
- 事实与深度见 02
- Hook 与结构见 03
- 输出格式见 07
