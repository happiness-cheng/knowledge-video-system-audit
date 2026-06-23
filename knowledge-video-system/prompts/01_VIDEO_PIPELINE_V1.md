# Knowledge Video Quality Pipeline

## 这是什么

优质知识视频制作管线。从文章到成品视频的完整流程。

核心不是自动生成或追求固定时长，而是逐层打磨并通过质量门禁。

## 流程

```
文章输入
↓
观众研究（16_AUDIENCE_RESEARCH_AND_RETENTION_LOOP）
→ audienceResearchBrief（对话内确认，压缩写入 contentBrief.audienceStrategy）
→ 先判断谁会看、为什么停、为什么继续看、为什么收藏或评论
↓
编辑意图访谈（02B_VISUAL_EXPLANATION_BRIEF_PROMPT）
→ editorIntentBrief（对话内确认，不必落盘）
→ 先向用户追问“到底想要什么”，不得直接替用户生成方向
↓
视觉解释判断（02B_VISUAL_EXPLANATION_BRIEF_PROMPT）
→ visualExplanationBrief（导演中间层，不是 videoSpec schema）
→ 判断抽象知识如何变成对象、关系、状态、过程和运动
↓
内容取舍（02_ARTICLE_TO_CONTENT_BRIEF_PROMPT）
→ contentBrief.json
→ 第一次质量门禁：值不值得做
↓
视觉调度计划（03_CONTENT_BRIEF_TO_VIDEO_SPEC_PROMPT，参考 02B）
→ visualStagingPlan（导演中间层，不是 videoSpec schema）
→ 决定关键对象在哪里出现、如何出现、多大、停多久、出现后改变什么
↓
画面分镜（03_CONTENT_BRIEF_TO_VIDEO_SPEC_PROMPT）
→ videoSpec.json（基本定稿后分两路）
→ 第二次质量门禁：结构、案例、信息增量是否成立
↓
visualDirectionSpec.md（由 ChatGPT 根据 14_VISUAL_DESIGN_SYSTEM_V1_ALPHA.md 生成）

        ┌─────────────────────┬─────────────────────┐
        │ A. 视频路线          │ B. 封面路线          │
        ├─────────────────────┼─────────────────────┤
        │ 素材接入（04）       │ 封面讨论（08）       │
        │ → assetManifest     │ → coverBrief.json    │
        │                     │                      │
        │ TTS 文本处理（05）   │ 封面规格（09）       │
        │ → spokenText 汇总确认 │ → coverSpec.json     │
        │                     │                      │
        │ TTS 音频生成         │                      │
        │ → audioTiming.json  │                      │
        │                     │                      │
        │ Studio 预览 / 视觉预览 │ 双封面渲染           │
        │ → Remotion Studio + contact sheet │ → cover-3x4.png      │
        │                     │ → cover-4x3.png      │
        └─────────────────────┴─────────────────────┘

↓
审片（06_PREVIEW_REVIEW_PROMPT）
→ 第三次质量门禁：视听、字幕、节奏是否成立
→ 修改指令
↓
最终审片
↓
Release Package
→ 最终评分（11_QUALITY_SCORE_AND_RELEASE_GATE）
→ qualityScore.json（唯一完整评分源）
→ 第四次质量门禁：评分与硬门槛决定能否发布
```

两条路线并行，互不依赖。封面不需要等 TTS 和音频生成。

## 各方职责

| 角色                       | 职责                                                                                                      |
| -------------------------- | --------------------------------------------------------------------------------------------------------- |
| 用户（主编）               | 审核建议并作出继续、修改、拆分、停止或发布的唯一最终决定                                                  |
| 网页版 ChatGPT（策划总监） | 生成 contentBrief / videoSpec / 封面与发布元数据，执行内容审查并给出 recommendation、证据、风险和修改建议 |
| Agent (Codex)（执行员）    | 做机械完整性检查，按用户已记录的授权修改文件、生成音频字幕、渲染视频与封面；不得替用户作内容或发布决定    |
| Remotion                   | 读取 videoSpec + audioTiming 渲染视频，读取 coverSpec 渲染封面 PNG                                        |

### 授权规则

- `recommendation` 是 ChatGPT 的审查建议，不是流程授权。
- 用户的决定必须持久化为 `userDecision`、`approvedByUser`、`decisionNote`、`decidedAt`。
- `approvedByUser: false` 时，Agent 不得进入下一阶段。
- `approvedByUser: true` 时，Agent 仍只能执行 `userDecision` 指定的动作：
  - `continue`：进入下一阶段。
  - `revise`：执行确认的修改，之后返回审查。
  - `split`：执行确认的拆分方案。
  - `stop`：停止。
  - `publish`：仅最终门禁有效，且 `hardGatePassed` 必须为 true。
- Agent 不得从自然语言中的模糊肯定、用户沉默或 ChatGPT 的 `pass` 建议推断授权。

## 核心原则

1. 先研究观众，再研究技术
2. 视频不是文章的压缩版，而是知识的视觉解释
3. 先找可视化解释核心，再决定 scene type
4. 声音是时间轴，画面必须参与讲解
5. 动画服务理解，不单独炫技
6. 一个 scene 只表达一个核心点
7. 不要把口播全文显示在画面中
8. 先打磨观众承诺、意图和视觉解释，再打磨内容结构和视觉样式
9. 时长由内容证据和信息增量决定，不为 5-8 分钟目标灌水
10. 同一版 16:9 主视频默认多平台复用；封面单独做 3:4 和 4:3 双比例适配
11. 人感优先但不强制人物，第一人称经历、真实判断和失败过程必须接受审查
12. 长视频先做叙事设计，再选择现有 scene type，不用不存在的组件倒推内容
13. 长视频需要章节级节奏起伏，高密度讲解、低密度消化、过渡和阶段小结交替出现

系统的理论依据、官方指引和最佳实践统一记录在 `13_REFERENCE_BASIS_AND_BEST_PRACTICES.md`。该文件只指导设计和优化，不定义新的交付 JSON，也不扩展当前渲染能力。

## 视觉系统层

02B_VISUAL_EXPLANATION_BRIEF_PROMPT 负责上游视觉解释判断：这条内容的抽象概念如何变成对象、状态、关系、过程和运动。
contentBrief 负责内容取舍、叙事结构和质量门禁。
visualStagingPlan 负责关键对象如何出现：位置、大小、入场方式、注意力优先级、出现后改变什么，以及理论依据。
videoSpec 负责内容和 scene 类型选择。
visualDirectionSpec 负责画面导演要求（字号、布局、截图策略、动画节奏）。
14_VISUAL_DESIGN_SYSTEM_V1_ALPHA.md 负责长期视觉规则（字体系统、中文排版、布局比例、scene pattern、motion rules、visual QA）。

Agent 不得只根据 videoSpec 自由发挥画面。必须同时参照 visualDirectionSpec 和 14 Visual Design System。若存在 visualExplanationBrief 或 visualStagingPlan，Agent 只能把它们当作导演意图和审片依据，不得据此创造未实现的 scene type 或正式 schema 字段。

## Remotion 能力判断层

判断“这个画面能不能做”时，必须区分四层：

1. **当前组件已支持**：可以直接用现有 scene type、animation、visualRole、assetLayout 表达。
2. **Remotion 可以做，但当前组件未封装**：例如地图点亮等仍未正式开放的能力。这类属于组件升级任务，不能假装现有 videoSpec 已支持。
3. **用生图或静态素材补足更合适**：复杂场景、人物姿态、氛围背景或一次性示意图可以生成图片，进入 assetManifest 后由现有组件展示。
4. **暂不进入本轮执行**：标记为 shot-lab / backlog / reference-only。

ChatGPT 生成 visualDirectionSpec 或 Execution Handoff Package 前，必须对每个关键视觉要求做能力分类。不能笼统说“Remotion 做不到”。Remotion 是动画引擎，很多复杂画面可以通过新增组件、SVG path、frame-driven object motion、静态图层和素材组合实现；真正的问题通常是“当前组件系统是否已封装”。

当前能力状态以机器可读注册表为准：

```text
src/video-system/visual/capabilityRegistry.ts
```

文档、交接包和 videoSpec 发生冲突时，Agent 必须以该注册表、validator 和实际源码为准。能力状态含义：

- `legacy-support`：旧 PPT scene / 主题保留为辅助表达或渲染外壳。
- `semantic-enabled`：可作为语义镜头宿主，但需要明确 pattern、cue 或内部时序。
- `production-validated`：已有正式入口、validator/fixture/视觉边界。
- `internal-wired`：内部组件或特定分支已接入，但不是通用 schema 能力。
- `fixture-only`：有 fixture，未接正式 renderer。
- `experimental`：实验区能力。
- `backlog`：待开发能力。

生成前必须执行 Capability Preflight：

```text
visualExplanationBrief / visualStagingPlan
↓
Capability Preflight
├─ production-validated / supported → 可以进入 videoSpec
├─ semantic-enabled → 必须声明 host scene、pattern、fallback 和 QA
├─ internal-wired / fixture-only → 只能进入组件升级包或特定已接入分支
├─ needs-generated-asset → 进入素材流程
└─ backlog / experimental → 改写导演方案或停止，不得伪装成可执行能力
```

旧 `cover / bullets / big-quote / three-column` 等页面型 scene 属于 presentation layer。它们可用于呼吸、小结、辅助说明和行动号召，但不能替代关键视觉解释。关键解释页优先使用 semantic shot pattern，例如 `fragment-to-manual`、`detour-vs-direct`、`wrong-to-correct`、`map-light-up` 等；只有 `production-validated` 的 pattern 能直接进入正式 videoSpec。

典型分类示例：

| 视觉要求 | Remotion 是否可做 | 当前稳定组件是否支持 | 推荐处理 |
| --- | --- | --- | --- |
| 便签碎片吸入 CLAUDE.md | 可以 | 已支持：`flow-diagram + semanticPattern=fragment-to-manual` | 直接使用 semanticPattern |
| 路径绕远 / 路径变短 | 可以 | 已支持：`comparison + semanticPattern=detour-vs-direct-path` | 直接使用 semanticPattern |
| 项目地图点亮 | 可以 | `MapLightUp` 为 internal-wired，不是通用 scene type | 只用已接入分支，或进入组件升级包 |
| 旧判断划掉再浮现新判断 | 可以 | `big-quote + semanticPattern=wrong-to-correct` | 只用于短判断纠偏，不新增 `strike-replace` type |

## 视觉预览门禁

`npm run preview:visual` 是真实 preview 的标准视觉检查入口。每次 preview 固定产出：

- video-preview.mp4（仅用户明确要求导出 mp4 时适用；P1 默认用 Studio 和 contact sheet 审片）
- visualMetrics.json
- previewVisualReport.json
- contact_sheet.jpg
- contact_sheet_no_subtitles.jpg
- contact_sheet_with_subtitles.jpg
- mobile_scaled_contact_sheet.jpg
- renderManifest.json（写入 out/runs/<runId>/，记录输入 hash、命令、composition 与输出产物）
- visual:check 控制台摘要

previewVisualReport 必须区分：

- `commandStatus`: pass | failed（命令是否跑通）
- `visualGateStatus`: pass | inspect | revise（视觉门禁结论）
- `manualReviewRequired`: boolean
- `hasReviseRisk`: boolean
- `inspectItems`: scene 级 inspect 列表
- `reviseItems`: scene 级 revise 列表
- `inputs.keyframeComposition`: 关键帧截图使用的 Composition，默认应使用带字幕版本
- `summary.subtitleOverlapRisk`: 字幕遮挡风险摘要

硬规则：

- COMMAND PASS 不等于 VISUAL GATE PASS。
- 有任意 inspect 时：visualGateStatus = inspect，manualReviewRequired = true，不得自动进入最终通过。
- 有任意 revise 时：visualGateStatus = revise，manualReviewRequired = true，不得误报 pass。
- 缺少 mobile_scaled_contact_sheet.jpg 时：preview gate 不得 pass。
- Agent 不得根据 preview:visual 的 commandStatus=pass 自动修改 userDecision 或 approvedByUser。
- inspect 项必须交给用户和 ChatGPT 人工审片确认。
- Agent 默认不直接渲染正式 mp4。除非用户明确说“导出视频 / render mp4 / 生成 mp4”，否则只提供 Remotion Studio 入口、视觉预览报告和 contact sheet。

## 观众与叙事设计层

`contentBrief.json` 的 `audienceStrategy` 负责观众研究和留存承诺：

- `primaryViewer` / `potentialViewer`：目标观众和潜在观众。
- `viewerPain` / `whyWatchNow`：观众为什么觉得和自己有关，为什么现在要看。
- `viewerPromise` / `first15sPlan`：前 15 秒停留、承诺、筛选和第一个证据。
- `expectedComment` / `saveOrShareReason`：预期评论、收藏或分享理由。
- `audienceEvidence`：平台、竞品、评论、创作者假设及其置信度。

`contentBrief.json` 的 `narrativeDesign` 负责全片叙事结构：

- `personalAnchor`：真实经历、判断变化或失败过程。
- `chapters`：章节 ID、标题和叙事作用。
- `caseStructure`：案例的原状态、改变、结果、结论和证据素材。
- `transferScenarios`：方法迁移场景及适用理由。
- `recapPoints`：主要阶段后的必要小结。
- `finalAction`：用户可以立即执行的动作或模板。

`videoSpec.json` 中的 `chapterId`、`humanPresence`、`caseStage`、`evidencePurpose`、`recapOf`、`transferScenario` 只用于策划、审查和质量门禁，当前渲染器忽略。它们不能代表章节标题、截图标注、模板卡或视频内人物层已经实现。

方法论类视频默认检查：

1. 至少一个真实案例。
2. 案例至少覆盖“原状态、改变、结果、结论”中的三项。
3. 通常有 2-3 个迁移场景；不适合时写明理由。
4. 至少一个可复制模板或明确行动。
5. 较长视频在主要认知阶段后考虑小结，不机械要求每章都有。

## 核心数据结构

| 文件                                | 职责                                                    | 谁写               |
| ----------------------------------- | ------------------------------------------------------- | ------------------ |
| 16_AUDIENCE_RESEARCH_AND_RETENTION_LOOP.md | 观众研究与留存闭环提示词：目标观众 / 前 15 秒 / 竞品评论 / 发布后复盘 | 项目文档           |
| audienceResearchBrief               | 开工前确认观众为什么会看、继续看、收藏或评论            | ChatGPT + 你       |
| 02B_VISUAL_EXPLANATION_BRIEF_PROMPT.md | 视觉解释上游提示词：Editor Intent / Visual Explanation / Visual Staging | 项目文档           |
| editorIntentBrief                   | 开工前确认用户到底想让观众看见什么变化                  | 你 + ChatGPT       |
| visualExplanationBrief              | 判断抽象知识如何被看见                                  | ChatGPT + 你       |
| visualStagingPlan                   | 规划关键对象如何出现、在哪里出现、出现后改变什么        | ChatGPT            |
| contentBrief.json                   | 内容取舍 + 节拍设计 + 全片叙事设计                      | 你 + ChatGPT       |
| videoSpec.json                      | 画面内容 + 口播文本 + scene 叙事职责                    | ChatGPT            |
| assetManifest.json                  | 素材登记 + 素材用途                                     | ChatGPT + 你       |
| pronunciationGlossary.json          | 发音词典 + 坏词修正                                     | ChatGPT + TTS 试听 |
| audioTiming.json                    | TTS 音频时序（生成物）                                  | generate-audio.ts  |
| coverBrief.json                     | 封面讨论稿                                              | ChatGPT + 你       |
| coverSpec.json                      | 封面渲染数据                                            | ChatGPT            |
| subtitles.json                      | 口播同步字幕                                            | generate-subtitles |
| publishMetadata.json                | 双标题、双简介、通用标签                                | ChatGPT            |
| qualityScore.json                   | 唯一完整质量评分                                        | ChatGPT + 审片确认 |
| 14_VISUAL_DESIGN_SYSTEM_V1_ALPHA.md | 视觉系统底座（字体、布局、scene pattern、motion rules） | 项目文档           |
| visualDirectionSpec.md              | 本条视频的视觉导演要求                                  | ChatGPT            |
| visualAcceptanceChecklist.md        | 视觉验收清单                                            | ChatGPT            |
| AGENTS.md                           | Agent 执行约束                                          | 你                 |

除 `qualityScore.json` 外，其他 JSON 不得保存完整评分。`contentBrief.json` 和 `videoSpec.json` 只保存显式权限门禁（阶段、审查者、建议、风险和用户决定）。

## 迭代规则

- 改内容 → 改 videoSpec
- 重新配音 → 生成 audioTiming
- 画面渲染 → Remotion 合并两者
- 某一句读得怪 → 改 spokenText，重新生成该段音频
- 某个画面太空 → 改 scene type 或调整布局参数
- 用户要求改某个 scene → 只改那个 scene，不重写整个文件

## 共同打磨制流程

本流程不是自动流水线，而是用户和 ChatGPT 共同打磨。

### 核心草案与确认点

以下核心文件可以先生成草案：

1. **contentBrief.json**
   作用：确认内容方向。
   用户重点看：
   - coreThesis 是否准确
   - targetAudience 是否准确
   - audienceStrategy 是否说明目标观众、痛点、前 15 秒承诺、预期评论和收藏理由
   - mustKeep / canCut 是否合理
   - durationStrategy 是否合适
   - attentionBeats 是否有节奏和冲突
   - narrativeDesign 是否有真实的人感、章节、案例、迁移、小结和结尾行动

2. **videoSpec.json**
   作用：确认口播和画面。
   用户重点看：
   - voiceover 是否像自己会说的话
   - spokenText 是否适合配音
   - screenText 是否短、有冲击力
   - scene type 是否合适
   - 哪些地方需要素材或截图
   - chapterId、humanPresence 和证据职责是否与内容一致

3. **coverBrief.json**
   作用：确认封面角度和标题。
   用户重点看：
   - coverAngle 是否有点击欲
   - titleCandidates 哪个最想点
   - recommendedTitle 是否标题党
   - subtitle 是否补充标题
   - visualDirection 是否符合账号风格

4. **coverSpec.json**
   作用：确认封面渲染方案。
   用户重点看：
   - template 是否合适
   - title / subtitle 是否确认
   - 是否需要人物 IP
   - character / cards / decorations 是否合理
   - theme / badge / layout 是否符合长期风格

5. **publishMetadata.json**
   作用：确认双标题、双简介和通用标签。

6. **qualityScore.json**
   作用：确认最终评分证据、缺口、硬门槛和评分建议。

草案生成后必须暂停，展示关键摘要给用户。只有用户明确决定 `continue`，且对应阶段记录为 `approvedByUser: true`，才能进入下一阶段。最终发布阶段使用 `publish`，不使用 `continue`。

### 可选确认点

以下文件不是每条视频都必须单独确认，条件触发：

- **assetManifest.json**：用户提供素材、ChatGPT 生成素材或 videoSpec 明确引用素材时触发。
- **pronunciationGlossary.json**：只有发现 TTS 读音问题时触发。
- **Execution Handoff Package**：用于执行阶段，不要求 `qualityScore.json` 已存在：
  - 视频执行要求 `videoSpec.qualityGate.userDecision = "continue"` 且 `approvedByUser = true`
  - 封面执行额外要求 `coverSpec.approval.userDecision = "continue"` 且 `approvedByUser = true`

  用于：
  - 生成 TTS 和 `audioTiming.json`
  - 生成 `subtitles.json`
  - 启动 Remotion Studio 可检阅入口，生成 visual preview、contact sheet 和 mobile_scaled_contact_sheet
  - 仅在用户明确要求时渲染 `video-preview.mp4`
  - 渲染 `cover-3x4.png` 和 `cover-4x3.png`
  - 登记、复制和引用已由 ChatGPT 生成或用户提供的小尘素材

  Execution Handoff 通常包含已确认的 `contentBrief.json`、`videoSpec.json`、`coverBrief.json`、`coverSpec.json`，以及实际存在的素材与 `assetManifest.json`。

  视觉系统文件（必须包含）：
  - `14_VISUAL_DESIGN_SYSTEM_V1_ALPHA.md`（视觉系统底座）
  - `visualDirectionSpec.md`（本条视频的视觉导演要求）
  - `visualAcceptanceChecklist.md`（视觉验收清单）

- **Release Package**：用于最终发布归档。必须包含 `qualityScore.json`、`publishMetadata.json`、`subtitles.json`、`audioTiming.json`、正式视频（`video-main.mp4`，16:9）和双比例封面。只有同时满足以下条件，Agent 才能生成：
  - `qualityScore.json.previewGate.userDecision = "continue"`
  - `qualityScore.json.previewGate.approvedByUser = true`
  - `publishMetadata.json.approval.userDecision = "continue"`
  - `publishMetadata.json.approval.approvedByUser = true`
  - `qualityScore.json.userDecision = "publish"`
  - `qualityScore.json.approvedByUser = true`
  - `qualityScore.json.hardGatePassed = true`

  发布包装只生成一个主标题、一个备用标题、一版短简介、一版 B站长简介和一组通用标签。
  如果封面使用小尘人物 IP，Execution Handoff 和 Release Package 必须包含：
  - 小尘角色 PNG（例如 `xiaochen-thinking.png`）
  - `characterImagePrompt.md`（如果生成时已记录则一并归档，不作为强制门槛）
  - `assetManifest.json` 中的小尘素材登记
  - `coverSpec.json` 中引用该角色 assetId，且 image2Needed = false

  封面默认输出两个版本，Release Package 应包含：
  - `cover-3x4.png`（竖版，抖音/快手）
  - `cover-4x3.png`（横版，B站/小红书）
  - `coverSpec.json` 中包含 `variants` 字段（3x4 和 4x3 各自的字号覆盖）

### 交付包格式规则

交付包格式按是否包含实际素材决定：

1. 如果交付包包含封面人物图、图片、截图、音频、视频或其他二进制素材，必须以 zip 文件形式交付。
2. zip 内必须真实包含素材文件，不能只写 `/mnt/data/...` 这类当前会话路径。Markdown 中写图片路径不等于 Agent 能访问图片。Agent 只能依赖 zip 包内实际存在的文件，或用户明确上传到 Agent 会话的文件。
3. 如果交付包是纯文本内容（如 contentBrief、videoSpec、coverBrief、coverSpec、visualDirectionSpec、visualAcceptanceChecklist、Agent 执行提示词或系统更新提示词），则默认直接在 ChatGPT 对话框中输出 Markdown / JSON / 提示词，不需要生成下载文件。

不要把"所有交付包都必须 zip"写成规则。不要把"纯文本交付包也要生成文件下载"写成规则。

### Execution Handoff 自审清单

ChatGPT 在输出 Execution Handoff Package 前，必须先做一次自审，并把结果写入交付说明。自审不是可选项。

必须逐项检查：

```text
[ ] Editor Intent Interview 已完成，用户不是只默认同意 AI 代写方向。
[ ] audienceResearchBrief / contentBrief.audienceStrategy 已完成，前 15 秒观看承诺不是空泛假设。
[ ] contentBrief 已生成并经过用户明确决定。
[ ] videoSpec 已生成并经过用户明确决定。
[ ] spokenText / voiceover 汇总已给用户看过，未跳过口播确认。
[ ] coverBrief 已生成；如果本轮不做封面，已明确说明原因。
[ ] coverSpec.json 已生成且可被当前 CoverComposition 读取；不能只给 coverSpec.md 冒充可渲染数据。
[ ] assetManifest 中所有 assetId 都有真实素材或明确生成/补足计划。
[ ] visualDirectionSpec 覆盖关键 scene，且与 videoSpec sceneId 一一对应。
[ ] 每个关键视觉要求已完成 Remotion 能力分类：当前支持 / 需组件升级 / 生图补足 / backlog。
[ ] 能力状态已对照 `capabilityRegistry.ts`，没有把 legacy scene、内部组件、fixture 或实验能力写成 production-validated。
[ ] 没有把 deliveryHint、visualDirectionSpec 或理论依据误写成已实现渲染能力。
[ ] Agent 执行边界明确：默认 Studio 预览和 contact sheet；mp4 需要用户明确授权。
[ ] 如果包含二进制素材，zip 内真实包含文件，不只引用临时路径。
[ ] 如果交付包缺少任何关键流程，已在 keyRisks 中标注，不得写成 ready-to-run。
```

自审结论必须包含：

- `handoffReadiness`: `ready | inspect | blocked`
- `missingSteps`: 缺少的流程项
- `implementationRisks`: 当前组件或素材风险
- `agentExecutionBoundary`: Agent 本轮允许做什么、不允许做什么

如果 `handoffReadiness` 不是 `ready`，不得让 Agent 直接跑完整流程；只能让 Agent 先检查、补齐或停在人工确认点。

### 确认时的展示规则

每个核心确认点必须把当前 JSON 内容贴给用户看。但不要一次性贴 200 行完整 JSON，改为贴关键摘要：

- contentBrief：贴 coreThesis、targetAudience、audienceStrategy、mustKeep、canCut、attentionBeats 摘要表
- videoSpec：贴 scene 摘要表（id / type / beatRole / screenText / animation）
- coverBrief：贴 titleCandidates、recommendedTitle、subtitle、coverType
- coverSpec：贴 template、title、subtitle、character、theme、badge
- publishMetadata：贴 primaryTitle、backupTitle、短版简介、长版简介、通用标签
- qualityScore：贴分数汇总、scoreRecommendation、失败硬门槛和下一步动作

用户想看细节再展开完整 JSON。

## 时长策略

| 类型       | 参考时长 | 适合内容                       |
| ---------- | -------- | ------------------------------ |
| 短快版     | 90-180s  | 单一观点、单一技巧、主视频切片 |
| 标准知识版 | 3-8min   | 有真实案例、方法步骤和迁移场景 |
| 深度知识版 | 8-12min  | 系统拆解、项目流程、复杂工具链 |
| 长讲版     | 12min+   | 课程化内容或系列专题           |

时长是内容成立后的结果。不能支撑 5 分钟时就缩短；有充分案例、实验、框架和应用场景时再自然延长。scene 数由注意力节拍决定，不设固定配额。

## 知识视频节奏模板

| 阶段     | 作用     | 小高潮类型 |
| -------- | -------- | ---------- |
| 开头 10% | hook     | 痛点命中   |
| 10-20%   | conflict | 反差       |
| 20-35%   | case     | 具体案例   |
| 35-45%   | thesis   | 核心金句   |
| 45-70%   | method   | 方法揭示   |
| 70-85%   | action   | 具体动作   |
| 最后 15% | cta      | 行动建议   |

这是比例参考，不是固定时间轴。每 20-40 秒至少出现一种信息增量：新问题、新证据、新反差、新结论、新方法或新应用。

章节不等于固定插入 `section-divider`。短视频可以只用 `chapterId` 做策划分组；中长视频在确有转折需要时才使用现有 `section-divider`。阶段小结可以使用 `big-quote`、`title-subtitle` 或 `section-divider`，前提是带来收束价值而不是重复上一页。

## 当前能力边界

- 截图可用：comparison / two-column + assetLayout，裁剪截图，标签说明文字，安全 HighlightBox。
- 截图待开发：局部放大、任意箭头标注、自由 zoomFrame。
- 模板可用：`todo-checklist`、`process-steps`、`bullets`。
- 模板增强可用：`PromptTemplateCard` 已实现，但只作为 `todo-checklist + visualRole=template` 的内部渲染组件使用。
- 模板待开发：通用文档模板卡、编辑器卡、prompt 编辑器界面，以及独立 `PromptTemplateCard` scene type。
- 小尘可用：封面角色素材。
- 小尘待开发：视频 scene 的统一人物层。当前不要求视频内出现小尘，不生成无法渲染的人物字段。

## 最终发布决策

| 分数   | scoreRecommendation | 审查建议             |
| ------ | ------------------- | -------------------- |
| 90-100 | excellent           | 可以发布，优先发布   |
| 85-89  | publish             | 可以发布             |
| 75-84  | revise              | 修改薄弱项后发布     |
| 60-74  | major-revise        | 重构部分内容         |
| 0-59   | reject              | 放弃、缩短或拆分选题 |

同步字幕、双比例封面、真实案例、可执行方法，以及三项核心指标 60% 门槛独立检查。任一硬门槛失败，无论总分多少都不能进入 `excellent` 或 `publish`。

表中的 `scoreRecommendation` 是评分档位建议，不代表用户授权。最终发布必须额外取得用户明确的 `publish` 决定。
