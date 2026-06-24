# 深度审查（仅 Deep 模式）

## 何时启用

Quick 和 Standard 不加载本文件。模式判定规则见 00。

## Deep 内部预检

Deep 模式使用与 Standard 相同的两阶段门禁架构。流程：自检 >= 88 -> 4-role review-ready -> 用户批准。

GPT 自评分 >= 88（9 维度总分 100），各核心维度达标后，才进入 4 角色门禁（`evaluatePreProductionReviewReady`）：

| 维度                  | 满分 |
| --------------------- | ---- |
| audience-pain         | 12   |
| title-cover-promise   | 8    |
| first15-retention     | 15   |
| scope-completeness    | 15   |
| explanation-depth     | 15   |
| fact-evidence         | 15   |
| actionable-value      | 10   |
| voiceover-expression  | 5    |
| visual-explainability | 5    |
| **合计**              | 100  |

## Scope Contract

明确这条视频承诺回答什么、不回答什么：

```json
{
  "mustAnswer": ["必须回答的问题"],
  "mustNotExceed": "范围边界",
  "outOfScope": ["明确不讲的内容"]
}
```

- mustAnswer 中的问题必须在正文中完整回答
- outOfScope 的内容不得出现在正文中
- 范围过大时建议拆分

## Coverage Map

每个 mustAnswer 问题由哪个 claim 和哪个 scene 负责：

```json
{
  "question": "问题",
  "claim": "回答",
  "sceneId": "S0X",
  "evidenceType": "official / experiment / inference / opinion / analogy"
}
```

## Fact Evidence Map

标注每条核心主张的证据类型：

| 类型       | 要求                                 |
| ---------- | ------------------------------------ |
| official   | 引用官方文档 URL，标注来源日期       |
| experiment | 描述真实实验步骤和结果               |
| inference  | 明确标注为推断，说明推理依据和置信度 |
| opinion    | 明确标注为个人观点                   |
| analogy    | 明确标注为类比，说明类比边界         |

## 高风险事实审查

对以下内容做额外检查：

- 涉及数字、比例、时间的主张
- 涉及"所有人都""永远""从不"的绝对表述
- 涉及官方立场、法律、安全的主张
- 涉及竞品对比的主张
- 涉及技术原理的主张

## 4 角色独立审查

1. 准备审查包（同一快照）
2. 4 份独立审查，role 各不相同
3. 至少 2 个不同 reviewerSystem
4. 四个角色齐全：cold-viewer、content-editor、fact-evidence、visual-audio-director

## 90 分门禁（Stage 1: `evaluatePreProductionReviewReady`）

4 角色门禁是 Stage 1（review-ready），仅验证审查数据完整性，不检查用户批准。通过条件（全部满足）：

- meanScore >= 90
- medianScore >= 90
- minReviewerScore >= 85
- scoreSpread <= 8（最高与最低分差）
- 无 hard veto
- 四个角色齐全（cold-viewer、content-editor、fact-evidence、visual-audio-director）
- 至少 2 个不同 reviewerSystem

## Veto 规则

以下情况必须 veto：

- 核心事实错误
- 标题承诺无法兑现
- 存在安全隐患
- 存在法律风险
- 内容严重抄袭

veto 后必须修改并重新审查。

## 修改后重新审查

- 候选稿变化后，旧审查和 digest 失效
- 必须重新走审查流程
- 不得手工修改评分来绕过门禁

## 模式边界

- Quick 和 Standard 不加载本文件
- Standard 执行 06 定义的两阶段门禁（review-ready + 用户批准）
- Deep 先通过自检 >= 88，再执行本文件的 4 角色 90 分门禁（`evaluatePreProductionReviewReady`）
- review-ready 通过后，用户批准通过 `evaluatePreProductionGate` 单独检查
- 不降低 Deep 门槛

## 参考

- Standard Evidence Notes 见 02
- 输出格式见 07
- 项目事实见 08
- Agent 门禁实现见仓库 `docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md`
