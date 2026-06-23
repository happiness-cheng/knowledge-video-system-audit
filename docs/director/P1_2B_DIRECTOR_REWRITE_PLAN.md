# P1-2B Director Rewrite Plan

## 目标

本轮只产出实验过程版导演稿，不替换正式 `videoSpec.json`，不迁移 PremiumMotionLab，不修改 renderer，不渲染 mp4。

目标是把当前主线从“信息页序列”改成“实验过程”：

```text
痛点现场 -> 我的误判 -> 同题实验 -> 变量改变 -> 结果证据 -> 规律迁移 -> 可复制模板 -> 下一集钩子
```

## 为什么当前视频像 PPT

当前正式 `videoSpec.json` 的标题是 `Renderer Upgrade 能力验证`，实际更像一组能力演示页。它已经使用了 `cover`、`two-column`、`big-quote`、`bullets`、`process-steps`、`comparison`、`todo-checklist` 和 `cta`，但叙事上仍是“观点 -> 方法 -> 步骤 -> 模板”的展示顺序。

主要问题：

- `contentBrief.json` 里的第一人称误判、同题实验、写文章和学 TCP 的迁移场景，被压缩成了方法页和模板页。
- S03/S04 形成连续静态展示风险：金句页后接四步法页，观众感受接近翻 PPT。
- 截图证据出现了，但没有先交代“变量怎么改变”，导致证据页更像结论展示，而不是实验结果。
- 视觉动作主要是逐项出现，缺少“观众先看哪里、后看哪里、为什么现在看这里”的导演说明。

## 新 8 scene 如何变成实验过程

| Scene | 新功能 | 对应内容来源 | 改写重点 |
|---|---|---|---|
| S01 | 冷开场 / 痛点现场 | personalAnchor + B01/B02 | 先进入“我误判了”的真实起点 |
| S02 | 我的误判 / 错误现场 | caseStructure.original + B02 | 展示错误问法和抽象结果 |
| S03 | 同题实验 / 变量改变 | caseStructure.change + B03 | 逐条展示新增变量，不直接给结论 |
| S04 | 结果证据 | caseStructure.result + evidenceAssetIds | 用截图证明结果变化 |
| S05 | 核心结论 | caseStructure.conclusion + B04 | 实验证据后再钉住判断 |
| S06 | 规律迁移 | transferScenarios + B05/B06/B07 | 证明规律不只适用于一个例子 |
| S07 | 可复制模板 | finalAction + B08/B09 | 三步上下文 + 一个输出要求 |
| S08 | CTA / 下一集钩子 | B10 | 收束本集并接到规则执行篇 |

## 每个 scene 的导演任务

| Scene | 导演任务 | 当前 renderer 支持判断 |
|---|---|---|
| S01 | 用第一人称误判抓住观众 | supported：`cover + hook` 可承载 |
| S02 | 让观众看见错误问法导致抽象结果 | supported：`two-column + conflict` 可承载 |
| S03 | 展示变量逐条加入 | partial：`process-steps` 可逐条展示，不能做 prompt morph |
| S04 | 证明同题实验结果改变 | partial：`comparison + evidence + assetLayout` 可承载，精确高亮需人工 inspect |
| S05 | 用低密度金句收束实验 | supported：`big-quote + insight` 可承载 |
| S06 | 把规律迁移到写作和学习技术 | supported：`three-column` 可承载 |
| S07 | 产出可截图保存的 prompt 模板 | supported：`todo-checklist + template` 可触发模板卡 |
| S08 | 复述收益并引出下一篇 | supported：`cta` 可承载 |

## 来自 contentBrief 的内容

- 真实误判：我一开始把回答不到点上归因于 AI 不够聪明。
- 案例原状态：直接问“什么是大语言模型”，得到标准但难理解的回答。
- 变量改变：补充“我完全不了解，请用生活例子解释”的背景和表达要求。
- 结果：回答更具体、更像人话，并使用生活例子帮助理解。
- 迁移场景：写文章、学习技术/TCP。
- 最终行动：问 AI 前写清楚卡点、目标和限制。
- 下一篇钩子：不只是让 AI 理解你，还要让它按规则执行。

## 需要用户或 ChatGPT 后续确认的点

1. S04 的截图高亮区域必须人工确认。当前 draft 不写具体坐标，避免假装精准。
2. S03 的“变量加入”本轮只用 `process-steps` 表达。若要做 prompt 卡逐步补全，需要后续 renderer 能力。
3. S06 的迁移场景口播需要确认是否保留 TCP，还是换成更大众的“学一个新概念”。
4. S07 的方法命名建议固定为“三步上下文 + 一个输出要求”，避免和 contentBrief 的“三步提问法”冲突。
5. 根目录 `VISUAL_DIRECTION_SPEC.md` 与脚本读取的 `src/video-system/data/visualDirectionSpec.md` 路径不一致。本轮只新增导演文档，不激活 QA 路径。

## 为什么本轮不迁移 PremiumMotionLab

本轮要先确认叙事结构成立。若先迁移动效和背景，容易把问题误判成“画面不够炫”，但真正风险是“实验过程没有被讲出来”。

PremiumMotionLab 的能力仍保留为 C 阶段候选，优先级建议：

1. KineticTitle 分层标题
2. GlassCard / 卡片轻微 lift
3. staggered reveal 优化
4. EvidenceCard 高亮 reveal
5. 简化动态背景

## 下一步如何进入 C 阶段

1. 用户和 ChatGPT 先审查本轮 DirectorSpec 与 `videoSpec.director-draft.json`。
2. 确认 8 scene 的叙事顺序、口播和证据职责。
3. 用户明确批准后，再决定是否把 director draft 替换为正式 `videoSpec.json`。
4. 进入 Studio 检阅，而不是直接渲染 mp4。
5. Studio 确认“实验过程”成立后，再进入 C 阶段迁移 PremiumMotionLab 的低风险能力。
