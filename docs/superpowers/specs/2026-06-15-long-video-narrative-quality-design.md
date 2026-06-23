# 长视频叙事质量规范设计

## 目标

在不扩展当前 Remotion 渲染能力的前提下，让网页版 ChatGPT 能稳定策划和审查“有人感、有章节、有案例、有迁移、有模板行动、有阶段小结”的优质知识视频。

## 范围

- 为 `contentBrief.json` 增加 `narrativeDesign`。
- 为 `videoSpec.json` 的 scene 增加叙事策划字段。
- 更新内容策划、分镜、审片、样式和最终评分提示词。
- 明确截图、模板卡和视频内小尘的当前能力边界。
- 不修改 Remotion 组件、scene type、主题或动画能力。

## 数据设计

`contentBrief.narrativeDesign` 负责全片叙事：

- `personalAnchor`：第一人称经历、判断变化或失败过程。
- `chapters`：章节 ID、标题和作用。
- `caseStructure`：真实案例的原状态、改变、结果、结论及证据来源。
- `transferScenarios`：方法可迁移到的场景及适用理由。
- `recapPoints`：主要章节后的必要小结。
- `finalAction`：用户看完可以立刻执行的动作或模板。

scene 策划字段负责单页叙事职责：

- `chapterId`
- `humanPresence`
- `caseStage`
- `evidencePurpose`
- `recapOf`
- `transferScenario`

这些字段与 `visualRole` 一样，只用于策划、审查和质量门禁。当前渲染器忽略它们。

## 能力边界

- 当前截图能力：左右截图对比、裁剪后的重点截图、标签和说明文字。
- 待开发截图能力：通用高亮框、局部放大、任意箭头标注。
- 当前模板表达：`todo-checklist`、`process-steps`、`bullets`。
- 待开发模板能力：真正的文档模板卡或专用模板组件。
- 封面可以使用小尘素材；视频内统一小尘人物层尚未实现，只能作为未来规划。

## 人感规则

真人出镜和视频内人物都不是硬要求。必须审查的是第一人称经历、真实判断、失败过程、证据解释和明确行动建议。人物不能替代案例证据。

## 验收

1. 七份指定提示词对叙事结构和能力边界表述一致。
2. 当前 `contentBrief.json` 和 `videoSpec.json` 包含合法的新策划字段。
3. 不出现把待开发组件写成当前可用能力的表述。
4. JSON 可解析，TypeScript 检查和 Remotion composition 加载不受影响。
