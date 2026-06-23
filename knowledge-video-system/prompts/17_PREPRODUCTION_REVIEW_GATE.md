# 17 — 制作前多方审查与 90 分门禁

## 目标

在 Agent 生成 TTS、字幕、Studio 预览或正式视频之前，先证明这条内容值得制作。

本门禁解决四个问题：

1. 观众为什么愿意点开并继续看。
2. 标题承诺的问题是否讲全、讲好、讲透。
3. 核心命题是否经得住官方资料、真实实验和反例检查。
4. 现有 Remotion 能力是否能把关键理解过程表达出来。

`qualityScore.json` 仍是成片后的最终发布评分；本文件定义的是制作前门禁，二者不能混用。

---

## 一、工作模式

每条内容先选择模式，不再默认展开全部中间层。

### quick（默认）

适合：普通单点知识、90 秒至 5 分钟、证据和方法边界清楚的内容。

默认只保留：

```text
contentBrief（包含 Scope Contract / Coverage Map / Fact Evidence Map）
→ videoSpec.review-candidate + coverBrief.review-candidate
→ 多方审查同一 SHA-256 快照
→ promotion 为正式执行稿
→ Agent 执行
```

`audienceResearchBrief`、`editorIntentBrief`、`visualExplanationBrief`、`visualStagingPlan` 默认作为 ChatGPT 内部导演判断，只向用户展示关键摘要。用户明确要求时才输出完整 JSON。

### standard

适合：有真实案例、多个章节、5–10 分钟、需要方法模板或迁移场景的内容。

在 quick 基础上增加：

- 轻量竞品 / 评论 / 历史数据证据；
- 完整 Coverage Map；
- 真实案例四段式；
- 每个关键 scene 的执行级 visualDirection；
- 四角色独立审查。

### deep

适合：旗舰视频、复杂机制、系统拆解、争议命题、事实风险高或预期投入较大的内容。

在 standard 基础上增加：

- 官方资料与原始研究核验；
- 反证实验；
- 竞品与评论样本；
- 系列拆分判断；
- 完整视觉解释与能力预检；
- 审查分歧仲裁记录。

**升级规则**：发现事实争议、核心证据不足、范围过大或审查分差超过 8 分时，自动升级模式，不得在 quick 中硬做。

---

## 二、Scope Contract：先决定本条究竟讲到哪

在写完整口播前，必须明确：

```json
{
  "corePromise": "标题、封面和开场共同承诺回答的问题",
  "targetDepth": "discovery | decision | execution | complete-guide",
  "mustAnswer": ["不回答就无法兑现承诺的问题"],
  "shouldAnswer": ["显著提升理解和行动的问题"],
  "explicitlyOutOfScope": ["本条明确不展开的内容"],
  "followUpDestination": ["下一条视频 / 文章 / 评论区资料"],
  "splitDecision": "single | series | stop"
}
```

### 讲全、讲好、讲透

- **讲全**：承诺范围完整，不是把整个领域都塞进一条视频。
- **讲好**：结构清楚、案例具体、口播自然、持续有信息增量。
- **讲透**：说明为什么、怎么做、适用边界、失败条件和常见误解。

若时长、证据或观众负荷无法支撑 `mustAnswer`，必须缩小标题承诺或拆成系列。

---

## 三、Coverage Map：检查观众看完还缺什么

每个核心问题必须进入覆盖表：

```json
{
  "questionId": "Q01",
  "question": "观众必然会追问的问题",
  "priority": "must | should | optional",
  "answerSummary": "本条给出的答案",
  "evidenceIds": ["E01"],
  "plannedScenes": ["S03", "S04"],
  "status": "covered | partial | missing",
  "gapAction": "补证据 / 改写 / 拆分 / 删除承诺"
}
```

制作前所有 `must` 项必须为 `covered`。存在 `partial` 或 `missing` 时，门禁不得通过。

`evidenceIds` 必须引用 `Fact Evidence Map` 中真实存在的 `claimId`；`plannedScenes` 必须引用 review candidate 中真实存在的 scene。机器门禁会做跨文件检查，不能写一个不存在的证据或未来可能补的场景来凑“covered”。

---

## 四、Fact Evidence Map：核心命题先过反证

每个可核验主张必须分类：

```json
{
  "claimId": "C01",
  "claim": "具体主张",
  "claimType": "official-fact | experiment | inference | opinion | metaphor",
  "source": "官方链接、真实实验记录或用户提供材料",
  "confidence": "high | medium | low",
  "counterexampleChecked": true,
  "qualification": "必须使用的限定词",
  "productionStatus": "allowed | qualify | remove"
}
```

### 事实硬门禁

出现任一情况直接 veto：

- 核心结论被一个真实反例推翻；
- 把“可能、经常、容易”写成“必然、完全、每次”；
- 把类比当成技术机制；
- 关键数字没有可靠来源；
- 真实案例无法核验；
- 忽略了会改变结论的其他信息来源；
- 关键边界缺失会让观众采取错误行动。

官方事实、实验观察、推断、个人判断和比喻必须在口播中保持同一证据等级，不得互相伪装。

---

## 五、独立多方审查

审查者必须独立完成，不先阅读其他审查意见。

每份审查必须记录 `reviewerId`、`reviewerSystem`（服务商 + 模型名）和合法 `reviewedAt`。同一门禁至少包含两个不同的 `reviewerSystem`，并且每个必需角色恰好一位审查者；同一个 AI 不能同时占多个角色来伪装“多方审查”。

### quick 必需三角色

1. `cold-viewer`：只判断想不想点、前 15 秒想不想继续看、是否听得懂。
2. `content-editor`：判断主题覆盖、结构、获得感、表达和是否讲透。
3. `fact-evidence`：判断事实准确、证据可靠、反例和边界。

### standard / deep 增加

4. `visual-audio-director`：判断画面能否参与解释、口播和画面如何同步、现有组件是否可执行。

### 统一 100 分量表

| id | 维度 | 分值 |
|---|---|---:|
| audience-pain | 观众认知阶段与痛点发现 | 12 |
| title-cover-promise | 标题和封面承诺 | 8 |
| first15-retention | 前 15 秒吸引力与兑现 | 15 |
| scope-completeness | 承诺范围完整度 | 15 |
| explanation-depth | 解释深度、边界和失败条件 | 15 |
| fact-evidence | 事实准确与证据可靠性 | 15 |
| actionable-value | 方法、模板和行动价值 | 10 |
| voiceover-expression | 口播自然与感染力 | 5 |
| visual-explainability | 画面解释可执行性 | 5 |
| **总计** |  | **100** |

每个维度必须给出 `evidence`、`gaps` 和 `action`，不允许只给印象分。

---

## 六、通过条件

必须同时满足：

```text
独立审查角色齐全
平均分 ≥ 90
中位数 ≥ 90
最低单个审查分 ≥ 85
first15-retention 均分 ≥ 13/15
scope-completeness 均分 ≥ 13/15
explanation-depth 均分 ≥ 13/15
fact-evidence 均分 ≥ 13/15
actionable-value 均分 ≥ 8/10
visual-explainability 均分 ≥ 4/5
所有 reviewer recommendation = pass
没有 hard veto
用户明确 continue + approvedByUser=true
```

平均分不能抵消事实错误、承诺未兑现、关键证据缺失或范围过载。

审查最高分与最低分相差超过 8 分时，机器门禁直接阻止，不得先平均，应先仲裁：

- 是目标观众假设不同；
- 是事实证据理解不同；
- 是评分尺度不同；
- 还是某位审查者遗漏了材料。

---

## 七、被审快照与 preProductionReview.json

多方审查不能只记录分数，还必须证明所有审查者看的是同一版材料。正式结构以 `src/video-system/utils/preProductionGate.ts` 为真源。

至少审查以下三项：

```json
"reviewedInputs": [
  {
    "id": "contentBrief",
    "path": "src/video-system/data/contentBrief.json",
    "sha256": "64位SHA-256"
  },
  {
    "id": "videoSpec",
    "path": "src/video-system/data/videoSpec.review-candidate.json",
    "executionPath": "src/video-system/data/videoSpec.json",
    "sha256": "64位SHA-256"
  },
  {
    "id": "coverBrief",
    "path": "src/video-system/data/coverBrief.review-candidate.json",
    "executionPath": "src/video-system/data/coverBrief.json",
    "sha256": "64位SHA-256"
  }
]
```

每位 reviewer 和 consensus 都必须记录同一个 `reviewedInputDigest`。任一候选文件在评分后被修改，哈希不匹配，门禁自动失败。

`contentBrief.json` 还必须通过 V2 结构检查：

- `workflowMode`；
- `scopeContract`；
- `coverageMap` 中所有 must 项为 covered，并有 evidenceIds 和 plannedScenes；
- `factEvidenceMap` 至少一个 core claim；
- core claim 已做反例检查；
- 官方事实和实验有来源；
- `preProductionReadiness.status = ready-for-review` 且无阻塞项。


候选稿完成后先生成快照和外部审查包：

```bash
npm run prepare:preproduction
npm run packet:preproduction
```

每位独立 AI 输出一个 JSON 后逐个导入：

```bash
npm run import:preproduction-review -- path/to/review.json
```

角色齐全后刷新共识，再审查：

```bash
npm run refresh:preproduction-consensus
npm run gate:preproduction:review
```

`prepare` 和 `refresh` 都不会生成用户批准，也不会替 reviewer 打分。

用户批准后，先 promotion，再执行正式门禁：

```bash
npm run promote:preproduction
npm run gate:preproduction
```

正式门禁会再次检查 `videoSpec.json` / `coverBrief.json` 是否与被审候选快照完全一致。任何命令失败时，禁止：

- 生成或重生成 TTS；
- 生成执行版字幕；
- 进入正式 Studio 预览；
- 生成 contact sheet；
- 渲染 MP4；
- 生成正式 Execution Handoff Package。

原型、shot lab 和纯组件测试不属于正式视频制作，但必须隔离目录，不能覆盖正式数据。

---

## 八、输出给用户的默认形式

默认只展示：

- 模式选择；
- 核心承诺；
- mustAnswer；
- 事实与证据风险；
- 各审查者总分；
- 共识分数与阻塞项；
- 修改后重新审查的位置。

不要默认把所有内部 JSON、视觉解释 brief 和逐项评分铺满对话。用户明确要求时再展示完整文件。


## 八、外部审查包与结果导入

```bash
npm run prepare:preproduction
npm run packet:preproduction
```

第二条命令会复制被审快照并生成 `REVIEW_PACKET.md`、`review-template.json` 与 manifest。各 AI 必须拿到同一份 packet。

每位 AI 的 JSON 结果通过：

```bash
npm run import:preproduction-review -- path/to/review.json
```

导入器验证 reviewerId、角色唯一性、九维评分、证据字段和快照 digest，但不会生成用户批准。完整协议见 `19_EXTERNAL_MULTI_AI_REVIEW.md`。
