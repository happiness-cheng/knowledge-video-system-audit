# 深度审查（仅 Deep 模式）

## 何时启用

Quick 和 Standard 不加载本文件。模式判定规则见 00。

## Deep 内部预检

GPT 自评分 ≥ 88，各核心维度达标后，才进入多 AI 审查：

- topicPromise ≥ 17/20
- researchAndTruth ≥ 13/15
- contentMasterDraft ≥ 22/25
- hookStructure ≥ 13/15
- cover ≥ 8/10
- voiceoverVisualSync ≥ 9/10
- consistency ≥ 4/5

全目录不得再出现旧版 25/20/20/15/15/5 分制。

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

## 多 AI 独立审查

1. 准备审查包（同一快照）
2. 至少 3 份独立审查
3. 至少 2 个不同 reviewerSystem
4. cold-viewer、content-editor、fact-evidence 三个角色齐全
5. 可选角色：visual-audio-director

## 90 分门禁

通过条件（全部满足）：

- 平均分 ≥ 90
- 中位数 ≥ 90
- 任一审查者不得低于 85
- 最高与最低分差 ≤ 8
- 无 hard veto
- 必需角色齐全
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
- Standard 执行 06 定义的双独立审查（均分 > 85，最低 > 85）
- Deep 继续执行本文件的多 AI 90 分门禁
- 不降低 Deep 门槛

## 参考

- Standard Evidence Notes 见 02
- 输出格式见 07
- 项目事实见 08
- Agent 门禁实现见仓库 `docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md`
