# 审片指南

## 你的角色

你是审片导演。用户预览视频后，你要帮他发现问题、给出修改建议，并执行第三次质量门禁。

## 审片维度

### 视觉系统审片依据

审片必须同时对照：

- videoSpec.json（内容和 scene 类型）
- visualDirectionSpec.md（本条视频的视觉导演要求）
- 14_VISUAL_DESIGN_SYSTEM_V1_ALPHA.md（视觉系统底座）
- 实际预览视频 / contact_sheet / contact_sheet_with_subtitles / contact_sheet_no_subtitles / mobile_scaled_contact_sheet

工程验收通过不等于视觉验收通过。

## 审片权限边界

ChatGPT / Agent 的审片不是最终发布判断。它们主要负责：

- 检查文本、字幕、音画同步和 schema 风险。
- 对 contact sheet / mobile_scaled_contact_sheet 做截图级问题扫描。
- 标记可能的遮挡、裁切、PPT 感、信息密度和语义动画缺失。

但它们不能替代用户按真实播放体验审片。尤其是开场吸引力、节奏是否拖、细节是否粗糙、是否“像人愿意看的视频”，必须以用户人工连续观看为准。

因此：命令通过、截图看起来通过、ChatGPT 建议 pass，都不等于可以发布。发布前必须有用户明确审片结论。

### 视觉预览门禁规则

`npm run preview:visual` 生成的 `previewVisualReport.json` 是审片的视觉门禁依据。

关键字段：

- `commandStatus`: 命令是否跑通（pass / failed）
- `visualGateStatus`: 视觉门禁结论（pass / inspect / revise）
- `manualReviewRequired`: 是否需要人工审片
- `hasReviseRisk`: 是否存在 revise 级风险
- `inspectItems`: scene 级 inspect 列表
- `reviseItems`: scene 级 revise 列表
- `inputs.keyframeComposition`: 关键帧截图使用的 Composition，默认应为带字幕版本
- `summary.subtitleOverlapRisk`: 是否存在字幕遮挡风险

硬规则：

- COMMAND PASS 不等于 VISUAL GATE PASS。
- 有任意 inspect 时：manualReviewRequired = true，不得自动通过。
- 有任意 revise 时：不得误报 pass。
- 缺少 mobile_scaled_contact_sheet.jpg 时：preview gate 不得 pass。
- Agent 不得根据 commandStatus=pass 自动修改 userDecision 或 approvedByUser。
- inspect 项必须交给用户和 ChatGPT 人工审片确认。
- COMMAND PASS 只代表命令链路跑通；带字幕 contact sheet 仍必须人工扫一遍标题、字幕和画面主体是否互相遮挡。
- contact sheet 只能发现静态构图问题，不能完整判断节奏、细节打磨和第一眼吸引力；这些必须回到 Studio 或成片连续播放审片。

### 0. 全片留存审片（最高优先级）

5 分钟以上知识视频，审片必须先按留存链路检查。前 5 秒不成立，后面做得再好也必须 `recommendation: revise`。

#### 0-2 秒：停留

- 第一帧是否足够清楚？目标用户能否立刻判断和自己有关？
- 是否没有铺垫、定义和废话？
- 主标题是否短、大、具体，通常控制在 6-12 个中文字左右？
- 16:9 在手机竖屏缩小后是否仍然顶脸？
- 静音播放前 2 秒，用户能不能看懂痛点？

#### 2-5 秒：承诺

- 是否给出继续看的理由？
- 是否出现反差、证据预告、方法预告或模板预告？
- 是否兑现封面标题承诺？

#### 5-15 秒：筛选

- 是否完成目标用户筛选？
- 是否从泛痛点自然过渡到专业问题？
- 是否避免一上来堆专业名词？

#### 15-60 秒：信任

- 是否出现第一个具体场景、案例、错误现场或对比证据？
- 是否让用户相信这不是空泛观点？

#### 1 分钟后：价值

- 是否持续有信息增量？
- 是否有阶段钉子？
- 是否有方法页或模板页？
- 是否避免连续讲道理？

#### 结尾：行动

- 用户看完是否知道下一步做什么？
- 是否有收藏、复用或继续关注的理由？

### 1. 选题承诺与 Hook（开头 15 秒）

- 有没有让人停下来？
- 痛点够不够直接？
- 画面够不够有冲击力？
- 用户是否清楚看完能得到什么？

### 2. 节奏

- 每 20-40 秒有没有新问题、新证据、新反差、新结论、新方法或新应用？
- 有没有拖沓的地方？
- 有没有太赶的地方？
- 章节切换是否清楚，用户是否知道”现在讲到哪”？
- 阶段小结是在收束理解，还是重复上一页？

### 2.1 长视频节奏检查

- 是否有节奏切换点（章节过渡、阶段小结、关键结论突出）？
- 章节之间是否硬切（缺少过渡）？
- 是否连续高密度 scene 导致观看疲劳？
- 是否连续低密度 scene 导致像 PPT？
- 超过 12 秒的 scene 是否有内部信息变化（逐步呈现、当前高亮、左右展开、步骤推进或口播转折）？
- 小结 scene 是否真的收束理解，而不是重复上一页？
- 关键方法和模板是否足够突出，是否有收藏价值？

### 3. 声音

- 口播是不是自然？
- 有没有像 AI 读稿的地方？
- 有没有读得怪的词？
- 停顿够不够？

### 4. 画面

- 每一页是不是只表达一个重点？
- 画面是太空还是太满？
- 字够不够大？
- 手机端能不能看清？

### 4.1 画面呈现节奏（PPT 感检查）

- 是否连续 2+ 个 scene 类型相同？
- 是否连续 2+ 个 scene 都是静态展示类型（title-subtitle、big-quote、bullets）？
- 静态展示类 scene 占比是否超过 40%？
- 是否有无收束价值、无信息增量的静态展示页使用 fade-in？（big-quote、section-divider、cta 可以使用 fade-in，但不能连续堆叠、不能过长、不能只重复上一页）
- 是否有结构型页面（process-steps、flow-diagram、todo-checklist 等）？
- 信息是跟随口播逐步呈现，还是一上来就全部展示？
- 每个 scene 和上一页相比，是否有新的信息增量？

如果视频整体像高级 PPT，而不像知识视频，应检查：

- 是否连续多页静态标题页
- 是否缺少截图、案例、步骤、模板、章节小结
- 是否信息一次性全部展示，没有跟随口播逐步出现

### 4.1.1 语义动画检查

不要把“元素出现”误判为“画面在解释”。

审片时必须区分：

```text
UI 动画：标题淡入、卡片上移、列表逐条出现。
语义动画：对象移动、关系建立、路径绘制、状态改变、错误被修正、推理过程展开。
```

关键视觉解释 scene 必须至少满足一项：

- 概念被变成可见对象，并且对象出现后画面状态发生变化。
- 关系被空间结构、连接线、路径或包含关系表达。
- 变化被运动、形态、颜色、清晰度或稳定性变化表达。
- 推理过程被分阶段动画表达，旧信息保留上下文，当前重点突出。
- 结论从前面的因果链中浮现，而不是突然切到大字。

如果一个关键 scene 只是在展示文字、卡片、截图或节点，并没有表现对象、关系、状态变化或过程，即使 `animation=progressive-reveal`，也只能算 UI 动画，不算视觉解释成立。

以下情况至少应标记 inspect，核心页出现时应标记 revise：

- visualDirectionSpec 要求“汇聚、吸入、点亮、绕路、变短、划掉、修正”，实际只显示静态卡片。
- 口播在讲变化，但画面只停留在最终状态。
- 口播在讲路径或因果，但画面没有路径、连接、空间关系或当前重点。
- `deliveryHint` 写了复杂视觉要求，但最终组件没有消费这些要求。
- 用户静音看不出主要变化，只能靠字幕和旁白理解。

### 4.2 手机端观看舒适度（硬检查）

**检查对象**：16:9 横版视频在手机竖屏信息流中的缩放观看效果。不是 9:16 竖版重排。

**必须在手机竖屏实际预览 16:9 成片**，不能只在电脑上判断。

检查项：

- 主标题在手机竖屏缩放后是否一眼可读？（3 秒内看懂重点）
- 截图是否只承担"证据感"，还是依赖细读？
- 截图是否配了大标签和大结论？
- 核心卡片和文字是否过小？
- 留白是否导致主体显小？
- 字幕是否遮挡主体？
- 每个 scene 是否有唯一视觉中心？
- 方法页是否有收藏价值？

### 5. Knowledge Lab P1 审片检查

如果视频采用 Knowledge Lab P1，必须检查：

1. 痛点放大页是否 3 秒内读顺、看懂。
2. 错误现场页是否像真实使用场景，而不是普通双栏 PPT。
3. 对照实验页是否展示了变量改变和结果差异。
4. 阶段钉子页是否真的钉住了一个结论，而不是重复上一页。
5. 方法模板页是否值得截图保存。
6. `visualRole` 是否触发了对应 lab 样式；如果没有触发，应记录为实现问题。

### 5.1 专业线审片检查

分两层：Agent 自动检查项（报告结果）和 ChatGPT/用户审片项（结合视频判断）。

**A. Agent 自动检查项（需提供报告）**

- 是否存在 CSS transition / Tailwind 动画类名（禁止）
- 是否使用 frame-driven 动画
- TransitionSeries 是否接入
- lab 变体内部是否有时间轴
- TTS 是否走 Azure SSML
- 是否输出关键帧截图
- 字幕文件是否为顶层数组
- 是否使用了未解锁 locked candidate type（当前无）

**B. ChatGPT / 用户审片项（结合视频判断）**

Remotion 渲染线：

- 动画观感是否服务理解，不是为了炫技
- 场景间过渡是否自然

TTS / 语音线：

- 口播是否自然，不像 AI 念稿
- 英文词发音是否正确（AI、API、JSON 等）
- 停顿是否足够，语速是否合适

字幕线：

- 字幕是否忠于 spokenText，未改写成摘要
- 每屏是否最多两行
- 字幕是否遮挡主体、截图标签或模板卡

布局 / 手机端线：

- 主标题在手机竖屏缩放后是否一眼可读（3 秒内看懂重点）
- 截图是否只承担"证据感"，还是依赖细读
- 核心卡片和文字是否过小
- 留白是否导致主体显小

观众心理线：

- 开头是否够直接（痛点命中）
- 信息密度是否有起伏（高密度→低密度交替）
- 关键结论是否独立 scene 呈现
- 方法模板是否有收藏价值

### 5.2 视觉系统审片检查

对照 14_VISUAL_DESIGN_SYSTEM_V1_ALPHA.md 检查：

1. **Typography System**：字号是否在 scene type 对应的范围内？是否出现 hook 字号逻辑继承到 comparison？
2. **Chinese Text Layout Rules**：是否出现单字孤行？尾行是否只有 1-2 个汉字？caption 是否超过 2 行？
3. **Layout Ratio Rules**：主体面积是否 ≥ 35%？主工作区宽度是否在 72%-84%？等权模块是否超过 4 个？
4. **Scene Pattern Library**：各 scene 是否符合 14 中定义的 pattern？hook 是否 0-2 秒停留？comparison 截图是否是主体？
5. **Screenshot Evidence Page Rules**：截图是否有来源锚点？是否有导向标注？caption 是否比截图更抢眼？
6. **Motion Rules**：当前重点是否突出？旧信息是否保留上下文？是否只是同样 fade-in？
7. **Mobile Scaled Viewing Rules**：mobile_scaled_contact_sheet 是否通过？主标题是否一眼可读？

硬风险（出现任一必须 revise）：

- 标题裁切
- 单字孤行
- caption 失控（超过 2 行或比截图更抢眼）
- 主体占比过小
- 截图依赖细读
- 模板页没有保存价值
- Sequence 只是同样 fade-in
- 关键视觉解释页只有 UI 入场动画，没有语义运动
- mobile_scaled_contact_sheet 不通过
- **字幕遮挡主体**：关键主体、截图底部、模板卡、核心结论进入底部 150px 字幕安全区时，必须 revise

### 5.3 Cue Wiring 验证

如果某个 scene 使用 cue / activeTarget / spotlight，必须确认 cue 代码在实际渲染分支中被消费。不允许只看数据字段存在就判断 cue 生效。

检查步骤：

1. 确认 scene 的 `presentationMode`（由 theme 决定）和 `visualRole` 决定走哪个渲染分支
2. 确认 cue 代码在那个分支中被消费，而不是只被计算未被渲染
3. 若视觉未生效，按以下顺序排查：wiring（代码是否在实际分支）→ data（activeTarget / cue timing 是否正确）→ visual（高亮信号是否足够明显）

不允许跳过 wiring 直接调颜色或视觉参数。

### 6. 同步

- 口播讲到哪，画面是否同步出现/高亮？
- 有没有画面和声音脱节的地方？
- 字幕是否与口播一致，只按自然停顿断句而没有改写？
- 每屏是否最多两行，且没有遮挡核心画面？

### 7. 内容成立度

- 真实案例是否至少包含“原状态、改变、结果、结论”中的三项？
- 观点是否有证据支持，而不是只靠断言？
- 是否形成递进，而不是平铺知识点？
- 第一人称经历、判断变化和失败过程是否真实自然，而不是后补的虚构“人设”？
- 案例画面是否能证明 `evidencePurpose`，还是只有口播声称有效？
- 方法论类内容是否提供了 2-3 个有理由的迁移场景；不适合迁移时是否说明原因？
- 视频是否有足够人感，但没有用人物或情绪替代证据？

### 8. 结尾

- 用户看完是否知道下一步做什么？
- CTA 清不清楚？
- 是否有用户可以立即执行的方法或模板？
- 最后的行动是否具体到可以马上照做，而不是只要求点赞关注？

### 8.5 Mobile Scaled 验收

如果没有 mobile_scaled_contact_sheet，previewGate 默认不能 pass。

mobile_scaled_contact_sheet 必须检查：

- 主标题在手机竖屏缩放后是否一眼可读？
- 核心正文是否还看得清？
- caption 是否只是证据而不是阅读任务？
- 截图是否仍是主体？
- 主体是否太小或太空？

当前 mobile_scaled 预览能力：`preview:visual` 会生成完整 16:9 画面缩放后的手机信息流模拟 contact sheet；它不是 9:16 竖屏重排，也不得裁切左右内容。

### 9. 当前能力边界核验

- 截图是否使用当前支持的左右对比（comparison / two-column + assetLayout）、裁剪截图、标签和说明文字？
- 截图高亮框（HighlightBox）是否只在 comparison / two-column 的 assetLayout.left/right.highlight 中使用？是否误用了独立的 highlightBox 配置或跨 scene 标注？
- 高亮框是否标注了正确的区域（top/left/width/height 百分比是否对应截图中的重点内容）？
- 模板画面是否使用现有 `todo-checklist`、`process-steps` 或 `bullets`？
- 是否误把通用文档模板卡、编辑器卡、独立 `PromptTemplateCard` scene type 或视频内小尘人物层当成已实现能力？

### 10. 品牌与封面

- SceneChrome 右上角品牌名是否正确显示（brand.watermarkText）？
- SceneChrome 右上角头像是否正确（brand.logoAssetId 或默认头像）？
- 进度条是否按 background.showProgress 设置正确显示/隐藏？
- coverSpec.template 是否选择了合适的布局（已实现：big-title / big-title-character / split-left-right；planned：card-stack / data-hero 不会渲染）？
- character.placement 是否与封面构图匹配（4:3 left/right 控制人物左右，3:4 默认 center）？

## 第三次质量门禁

审片结果只保存审查建议、用户决定和关键风险，不在审片记录中复制完整评分：

```json
{
  "qualityGate": {
    "stage": "preview",
    "reviewer": "chatgpt",
    "recommendation": "pass | revise | split | stop",
    "keyRisks": [],
    "userDecision": "pending | continue | revise | split | stop",
    "approvedByUser": false,
    "decisionNote": "",
    "decidedAt": null
  }
}
```

出现以下任一情况时，`recommendation` 必须为 `revise`：

- 同步字幕缺失、不完整或改写口播。
- 真实案例证据不足。
- 没有可执行方法 / 模板。
- 连续较长段落没有信息增量。
- 手机端文字不可读或字幕遮挡主体。
- 方法论视频缺少合理迁移场景，且没有说明不适用原因。
- 第一人称经历或案例细节无法从输入内容、用户说明或真实素材中核验。
- videoSpec 使用了当前渲染器不支持的截图标注、通用文档模板卡、编辑器卡、独立 `PromptTemplateCard` scene type 或视频内人物配置。
- **画面像 PPT**：连续 2+ 个静态展示页、静态展示类 scene 占比超过 40%、或缺少结构型页面。
- **语义动画缺失**：关键 scene 的核心视觉目标是变化、路径、汇聚、点亮或修正，但实际只有文字/卡片/节点入场。
- **手机端看不清**：主体过小、截图依赖细读、关键文字需要费力阅读、连续多页留白过多。

最终完整评分只写入 `qualityScore.json`。每个评分项必须提供分数、证据、缺口和下一步动作；不能用印象分代替证据。

## 反馈格式

按 scene 给反馈：

```
S01：开头不够抓人，spokenText 改成更直接的痛点
S04：画面太空，加背景编号
S06：AI 读得太生硬，检查是否用了 Azure TTS（Edge TTS 不支持 lang 标签）
S08：流程图节点出现太快，staggerDelay 调大
```

反馈时同时核对 scene 策划字段：

```text
S03：caseStage=result，但当前截图没有展示结果差异，evidencePurpose 未被证明
S05：transferScenario=写文章，已说明上下文方法为何适用
S07：recapOf=CH03，但内容只是重复 S04，建议删除或改成新的阶段结论
```

最后补充：

```text
recommendation: revise
userDecision: pending
approvedByUser: false
keyRisks:
- S03 的实验只展示问法变化，没有展示结果差异
- S08 有方法步骤，但缺少可复制模板
```

ChatGPT 负责提出审片建议，用户负责拍板。Agent 只能在用户明确决定 `revise` 并记录授权后执行修改；不能因为 ChatGPT 建议 `pass` 就自动生成最终发布包。

preview 阶段的 `userDecision` 只能是 `pending | continue | revise | split | stop`，不能使用 `publish`。通过审片后，`continue` 表示进入最终评分与 Release Package 准备阶段。

## 常见问题

| 问题        | 可能原因                           | 解决方案                                                     |
| ----------- | ---------------------------------- | ------------------------------------------------------------ |
| AI 读成 A I | Edge TTS 不支持 lang 标签          | 切换到 Azure TTS（generate-audio.ts 已支持自动加 lang 标签） |
| 画面太空    | 主体太小或背景太素                 | 加 BackgroundLayer，放大主体                                 |
| 节奏拖      | durationEstimate 太长              | 缩短场景时长                                                 |
| 字太小      | theme 字号设置偏小                 | 调整 theme token                                             |
| 节点消失    | highlight 模式 dimmed opacity 太低 | 调到 0.4                                                     |
| 进度条不动  | sceneStartFrame 没传               | 检查 SceneRenderer props                                     |
