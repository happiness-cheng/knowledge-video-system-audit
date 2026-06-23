# contentBrief.json → videoSpec.json

## 前置条件

先读 `00_PROJECT_CONTEXT.md`，了解系统所有可用的 scene type 和字段。
你的输出必须严格匹配那些字段，否则 Remotion 无法渲染。本阶段同时执行第二次质量门禁。

再读 `02B_VISUAL_EXPLANATION_BRIEF_PROMPT.md`。生成 `videoSpec.json` 前，必须先完成视觉解释判断和 Visual Staging Plan：这条内容的关键对象、关系、状态和过程如何被看见，A 应该在哪里出现、如何出现、多大、出现后改变什么。

Visual Staging Plan 是导演中间层，不是正式 `videoSpec` schema。不得把其中字段直接塞进 `videoSpec.json`，除非当前 schema 已明确支持。

再读 `16_AUDIENCE_RESEARCH_AND_RETENTION_LOOP.md`，并检查 `contentBrief.audienceStrategy`。生成 videoSpec 前，必须先回答这条视频前 15 秒如何让观众停留、承诺收益、筛选目标观众并给出第一个证据。

如果用户给文章后尚未完成 Editor Intent Interview，不得生成 videoSpec。你必须回到 02B，先问清楚用户到底想要什么：必须出现的画面、不能接受的感觉、核心记忆点和目标观众变化。

如果 `contentBrief.audienceStrategy` 缺失或只有空泛描述，不得直接生成 videoSpec。你必须回到 02 或 16，先补足观众假设、前 15 秒计划、预期评论和收藏/分享理由。

## P1-1 能力边界与执行契约

1. videoSpec 只能使用当前已实现 scene type 和字段。
2. 不得生成未实现 scene type；不得新增 videoSpec schema 字段。
3. `visualRole` 只能触发当前已实现的组合，不能当成新组件能力。
4. Hook 可以大，但 comparison / evidence / template 不能继承 Hook 字号逻辑。
5. 字体过大、截图被压缩、caption 抢主体，应作为 P1-2 typography clamp inspect 的候选，不在本包实现。
6. 画面规则必须结合 `mobile_scaled_contact_sheet` 审片，不能只看 1920×1080 原图。
7. 字号、Hook 时长、标题字数、screenText 字数属于 inspect 经验线，不能写成跨场景 hard rule。
8. 单字孤行、标点孤行、语义断裂、标题裁切仍是高风险问题。
9. 从现在开始，视觉修改默认由用户在 Remotion Studio 检阅，不要求 Agent 每次渲染 mp4。

## 输入

contentBrief.json。

## 输出

videoSpec.json。

## 做什么

1. 先根据 `02B` 识别每个 beat 的可视化解释核心
2. 根据 `audienceStrategy` 识别每个 beat 的观众任务：停留、承诺、筛选、信任、获得感、收藏或行动
3. 为关键 scene 生成 Visual Staging Plan
4. 把 attentionBeat 变成 scene（一个 beat 默认对应一个 scene，信息量大时可拆成 2-3 个）
5. 先判断“这个知识点应该被看见成什么动作、关系或对象”，再选合适的 type
6. 写 voiceover（人看的口播）
7. 写 spokenText（TTS 读的口语化文本）
8. 写 screenText（画面主文案，最多 15 字）
9. 选动画
10. 填 beatRole 和 attentionTrigger；`attentionTrigger` 应体现观众为什么继续看，而不只是写“fade in”
11. 填 visualRole，说明该 scene 的视觉叙事职责
12. 填 chapterId、humanPresence、caseStage、evidencePurpose、recapOf、transferScenario
13. 检查结构递进、真实案例、迁移场景、信息增量、观众留存和视觉解释是否成立

## beat 拆分规则

默认一个 attentionBeat 对应一个 scene。
如果某个 beat 信息量较大，可以拆成多个 scene。

拆分规则：

- beatId 保留原始 ID（如 B03），用 scenePart 表示子编号（如 "B03-1"）
- 每个 scene 仍然只表达一个核心点
- 不要为了凑页数拆分
- 拆分后要保证节奏更清楚，而不是更拖
- 不按目标时长或 scene 数量配额拆分

## 第二次质量门禁

生成 videoSpec 前检查：

1. 结构是否形成”问题 → 误判/冲突 → 证据 → 结论 → 方法 → 应用/行动”的递进，而不是平铺知识点。
2. 真实案例 / 实验是否至少包含”原状态、改变、结果、结论”中的三项。
3. 每 20-40 秒是否有新问题、新证据、新反差、新结论、新方法或新应用。
4. 用户看完是否能执行一个明确动作，或直接使用一个模板。
5. 表达是否像真实经历和复盘，而不是抽象说教。
6. 每个 scene 是否有明确 `visualRole`，并与 `beatRole`、scene type 和内容作用一致。
7. 如果某个 scene 没有新增信息，只是重复上一页，建议删除或合并。
8. 每个 scene 是否归属于明确章节，章节切换是否对应认知推进，而不是机械分段。
9. `humanPresence` 是否有真实依据，第一人称经历和判断是否来自输入内容或用户提供的信息。
10. 案例 scene 的 `caseStage` 和 `evidencePurpose` 是否与 `narrativeDesign.caseStructure` 一致。
11. 迁移场景是否说明方法为何适用，而不是只更换名词。
12. 小结是否真正收束前一阶段；没有新增理解价值时应删除或合并。
13. **画面呈现节奏**：不要把 scene 当作 PPT 页面。每个 scene 要明确：这一页解决什么问题、观众先看到什么、后看到什么、这一页和上一页是否有新的信息增量。
14. **避免连续静态页**：连续 2 个以上 title-subtitle、big-quote、bullets 时，必须插入结构型页面（process-steps、comparison、todo-checklist 等）或章节分隔。
15. **避免信息一次性摊开**：静态展示类 scene（title-subtitle、big-quote、bullets）占比不应超过 40%。超过时必须将部分 scene 改为支持逐步揭示的类型。
16. **长视频节奏**：高密度和低密度 scene 交替使用，章节之间不能硬切，关键结论必须有独立 scene 呈现。
17. **scene 内部节奏**：超过 12 秒的 scene 必须有逐步呈现、当前高亮、左右展开、步骤推进或口播转折之一。
18. **手机端观看舒适度**：主标题必须在手机竖屏缩放后一眼可读；截图不得依赖细读，必须配大标签和大结论；核心卡片和文字不能过小；留白不能导致主体显小。
19. **能力边界核验**：不得把 `@remotion/captions`、Lottie、3D、light leaks、Lambda、9:16 自动重排、独立 PromptTemplateCard scene type、通用文档模板卡、编辑器卡或视频内小尘人物层写成当前已支持能力。
20. **inspect 与 hard rule 区分**：screenText 字数、Hook 时长、封面/标题字数、字号经验线、静态页占比、连续 scene 类型和 primaryAreaRatio 粗估只能作为 inspect 线索；不要写成自动 revise 的硬规则。
21. **视觉解释检查**：每个关键 scene 是否有对象、状态、关系、路径或过程，而不只是文字卡片。
22. **A 出现规则**：关键对象出现后，画面中是否有状态、路径、结构、注意力或因果关系发生变化。
23. **理论依据检查**：关键布局、字号、动效和注意力调度是否能对应 `13_REFERENCE_BASIS_AND_BEST_PRACTICES.md` 中的理论依据。
24. **Remotion 能力分类**：每个关键视觉要求必须判断是当前组件已支持、Remotion 可做但需组件升级、适合生图补足，还是应标记 backlog。不得把“Remotion 可以做”误写成“当前组件已支持”。
25. **导演意图落地检查**：不能只把复杂画面写进 `deliveryHint` 或 `visualDirectionSpec`。如果当前 videoSpec 无法表达，必须在 keyRisks 或 visualDirectionSpec 中明确“需组件升级 / 需生图补足 / backlog”。
26. **观众策略落地检查**：S01-S04 是否兑现 `audienceStrategy.first15sPlan`。如果 0-15 秒仍在铺背景、讲定义或堆工具术语，必须重写。
27. **互动/收藏价值检查**：至少一个 scene 是否服务 `expectedComment`、`saveOrShareReason` 或 `finalAction`。如果观众看完没有可评论、可收藏或可执行的东西，必须降低质量建议。
28. **证据等级检查**：如果 `audienceStrategy.researchStatus` 是 `assumption`，videoSpec 不能写成“观众一定会喜欢”；只能把它作为待验证假设。

没有真实案例时不得虚构。应将 `qualityGate.recommendation` 设为 `revise`，并在 `keyRisks` 中指出需要用户补充的证据。

## beatRole → 推荐 type

| beatRole | 推荐 type      | 备选                       |
| -------- | -------------- | -------------------------- |
| hook     | cover          | big-quote                  |
| conflict | two-column     | comparison, title-subtitle |
| case     | two-column     | bullets, comparison        |
| thesis   | big-quote      | title-subtitle             |
| method   | process-steps  | flow-diagram, roadmap      |
| action   | todo-checklist | bullets, three-column      |
| cta      | cta            | -                          |

注意：hook 的推荐 type 从 `cover | title-subtitle, big-quote` 改为 `cover | big-quote`。title-subtitle 不再作为 hook 的首选备选，因为它的信息呈现方式太平，不适合信息流停留。

## 观众任务 → scene 编译规则

videoSpec 不能只从内容结构生成，还必须从观众任务生成。`contentBrief.audienceStrategy` 是前 60 秒设计的优先输入。

### Hook 机制先于 scene 外壳

生成 S01-S03 时，不要先问“用 cover 还是 big-quote”。必须先选择 Hook 机制，再选择 scene host 和 semanticPattern。

优先机制：

| Hook 机制 | 适用情况 | 推荐落地 |
| --- | --- | --- |
| 症状回声 | 观众已经遇到问题，但不知道原因 | 具体工作现场、聊天窗口、错误操作或重复动作 |
| 错误归因 | 观众把原因归到模型、工具或自己不会用 | `wrong-to-correct` 或先旧判断再反转 |
| 错误现场 | 观众一眼能看出“这就是我” | 真实界面感、输入框、任务卡、失败反馈 |
| 结果反差 | 有前后对比或实验结果 | comparison / detour-vs-direct / before-after |
| 模板收益 | 观众明确想拿走可复制结构 | todo-checklist / process-steps |

默认优先使用“具体事件”而不是抽象隐喻。若观众需要先解码画面寓意，Hook 就已经变慢了。比如“聊天窗口反复解释项目规则”优先于“项目城市失去认知核心”，因为前者一眼可懂，后者需要背景知识。

S01 不负责教完整概念，只完成两件事：让目标观众认出自己的症状，并动摇一个旧归因。解决方案命名通常放在 S02-S04 之后，除非目标观众已经主动搜索该术语。

| 观众任务 | 来源字段 | 推荐 scene 任务 | 不要做 |
| --- | --- | --- | --- |
| 停下来 | `first15sPlan.stopReason` / `viewerPain` | S01 用痛点、错误现场、损失提醒或反常识判断 | 先讲背景、定义、工具历史 |
| 愿意继续 | `first15sPlan.continuePromise` / `viewerPromise` | S02 给结果承诺、证据预告或模板收益 | 只重复标题或换一个大字页 |
| 确认是给自己 | `first15sPlan.viewerFilter` / `primaryViewer` | S03 展示真实场景、适用对象或专业问题 | 继续泛泛讲“大家都可以” |
| 开始相信 | `first15sPlan.firstProof` | S04 在 60 秒内给第一个案例、截图、对比实验或错误现场 | 用定义、概念和口号撑满前一分钟 |
| 愿意收藏 | `saveOrShareReason` / `finalAction` | 方法页、模板页、清单页必须清晰可截图 | 只给抽象建议 |
| 愿意评论 | `expectedComment` | 放入真实争议、共鸣点或“我也踩过”的场景 | 只做无风险、无态度的工具说明 |

`attentionTrigger` 应写成观众层面的触发，例如：

- `痛点自我识别`
- `错误现场`
- `收益预告`
- `目标用户筛选`
- `第一个证据`
- `模板收藏价值`
- `评论共鸣点`

不要把 `attentionTrigger` 写成纯动画词，例如 `fade-in`、`slide-up`、`zoom`。

## 5 分钟以上视频留存结构

当 durationStrategy.type 为 standard / deep / long-form，或目标时长超过 5 分钟时，videoSpec 必须按以下留存链路设计。

核心原则：**目标受众优先，入口降低门槛，正文保持深度。**

### 0-2 秒：停留

S01 必须让用户立刻知道这条视频和自己有关。

- 默认使用 cover 或 big-quote。不用 title-subtitle 作为默认开头。
- screenText 必须短、大、具体（6-12 个中文字）。
- 不讲定义，不铺背景，不说"今天我们来聊"。
- 优先使用：痛点、错误现场、损失提醒、反常识判断。
- 如果封面标题承诺了具体痛点，S01 必须兑现。
- 16:9 在手机竖屏缩小后，S01 主标题必须一眼可读。
- S01 禁止：长副标题、复杂截图、三栏结构。S01 不堆标签，keywords 可以为空；如必须使用，最多 1-2 个，并且不能抢主标题视觉中心。
- S01 不宜过长。若 S01 承担 0-2 秒停留，durationEstimate 通常控制在 2-3 秒；S02 必须在前 5 秒内出现。

### 2-5 秒：承诺

S02 必须告诉用户继续看能得到什么。

- 给出反差、证据预告、方法预告或模板预告。
- 不直接进入抽象知识解释。
- 让用户期待一个可验证的结果或可复用的方法。

### 5-15 秒：筛选

S03 必须让目标用户确认"这是给我看的"。

- 可以说明适用对象。
- 可以展示真实工作场景。
- 可以把泛痛点转入专业问题。
- 工具名可以在这里出现，但不宜作为 S01 唯一钩子。

### 15-60 秒：建立信任

必须尽早给出第一个真实案例、错误现场、对比实验或具体证据。

不要把定义、背景、术语解释放满前 60 秒。

### 1 分钟后：深度展开

中段必须围绕案例、方法、迁移场景、阶段钉子和模板展开。

每 20-40 秒至少出现一种信息增量：新问题、新反差、新证据、新方法步骤、新迁移场景、新阶段结论、新可执行动作。

### 中后段：收藏价值

方法论类视频必须至少有一个可截图保存的页面。优先使用：

- `todo-checklist` + `visualRole=template`
- `process-steps`
- `flow-diagram`
- `big-quote` + `visualRole=insight/recap`

### 结尾：行动

结尾不能只说点赞关注，必须给出一个用户马上能执行的动作。

## 手机端视觉呈现标准

核心理论依据：

- Mayer 多媒体学习认知理论（Multimedia Learning, 3rd ed., Cambridge University Press, 2020）
- Sweller 认知负荷理论（Cognitive Science, 1988）
- Processing Fluency 加工流畅性（Personality and Social Psychology Review, 2004）

完整理论依据、Remotion 官方实践和参考资源见 `13_REFERENCE_BASIS_AND_BEST_PRACTICES.md`。本文件只使用其中已经落地到当前系统的规则；不得因为参考资源存在就生成未实现的 scene type、字段或组件。

系统目标：做 16:9 的手机端优化知识视频——画面主体够大，视觉中心明确，截图不靠细读，方法页值得收藏，观众不用费力找重点。

### 唯一视觉中心

每个 scene 必须有唯一视觉中心。观众 3 秒内必须知道这一页的重点是什么。

不要让观众在标题、截图、标签、字幕之间来回猜关系。

### 截图标签化

截图页不要让观众读截图。正确结构是：

- 大标签（这页在证明什么）
- 大结论（核心判断）
- 截图作为证据（缩小，提供视觉证据感）

截图文字看不清没关系，但观众必须一眼看懂"这两张图在证明什么"。

### 方法模板页

方法类内容优先做成"可截图保存"的结构：

- 步骤清晰、字号大
- 用 `process-steps` 或 `todo-checklist`
- 观众看完能照做、能收藏

### 主体占比

减少无效留白，让主体占画面更大比例。手机端缩小观看时，主体太小会显空。

## 5 类推荐呈现模块

以下 5 类模块是画面呈现的推荐方式，不替换现有 `beatRole → type` 映射，不作为每条视频强制要求。

### 1. 痛点放大页

适合：hook / conflict

特点：大字、强对比、少留白、关键词突出。像"用户脑内弹幕"。

示例：

```
AI 又没答到点上？
```

### 2. 错误现场页

适合：conflict / case

特点：展示用户常见错误做法，像真实场景，不像抽象说教。

示例：

```
你是不是这样问：
帮我写一下
```

### 3. 对照实验页

适合：case / evidence

特点：大标签 + 大结论 + 截图证据。截图不承担主要阅读。

示例：

```
标签：直接问 vs 补背景
结论：AI 没变，变的是上下文
截图：缩小，居中
```

### 4. 方法模板页

适合：method / action

特点：可截图保存的结构，步骤清晰，字号大，有收藏价值。

示例：

```
下次这样问：
1. 我现在是……
2. 我想要……
3. 限制条件是……
```

### 5. 阶段钉子页

适合：thesis / recap / cta

特点：一句话钉住结论。允许纯文字，但必须大、短、强、有收束价值。

示例：

```
不是 AI 没懂你
是你没给判断材料
```

## Knowledge Lab P1 生成规则

当选题适合通过"错误做法 → 变量改变 → 结果差异 → 结论 → 方法"来讲清楚时，优先使用 Knowledge Lab P1 结构。

### 推荐组合

| 场景       | type           | visualRole       | 用途                 |
| ---------- | -------------- | ---------------- | -------------------- |
| 痛点放大页 | cover          | hook             | 3 秒内抓住痛点       |
| 错误现场页 | two-column     | conflict         | 展示用户常见错误做法 |
| 对照实验页 | comparison     | evidence         | 展示变量改变后的差异 |
| 阶段钉子页 | big-quote      | insight 或 recap | 一句话钉住结论       |
| 方法模板页 | todo-checklist | template         | 可截图保存的模板     |

### 注意事项

- 这不是强制每条视频都必须 5 页。
- 不适合实验台结构的内容，可以使用普通结构。
- 不得为了套实验台而虚构案例或实验。
- 对照实验页必须明确变量改变和结果差异。
- 方法模板页必须有可复制、可照做的价值。

## 画面呈现节奏

不要把 scene 当作 PPT 页面。要把 scene 当作一段信息呈现。

### 判断标准

每个 scene 要明确：

1. 这一页解决什么问题
2. 观众先看到什么
3. 后看到什么
4. 这一页和上一页是否有新的信息增量
5. 是否连续出现相似的大标题页

### 避免 PPT 化的策略

1. **不要连续 2+ 个静态展示页**（title-subtitle、big-quote、bullets）
   - 连续静态页会让观众感觉在翻 PPT
   - 解决方案：在静态页之间插入结构型页面（process-steps、comparison、todo-checklist）

2. **不要信息一次性摊开**
   - 静态展示类 scene 占比不应超过 40%
   - 超过时，将部分 scene 改为支持逐步揭示的类型

3. **同一个观点可以拆成"问题 → 证据 → 结论"**
   - 不要把所有信息放在一个 scene 里
   - 拆分后用 progressive-reveal 动画逐步呈现

4. **方法类内容要有步骤页 / 清单页 / 模板页**
   - 不要用 title-subtitle 展示方法
   - 用 process-steps 或 todo-checklist 让步骤逐个出现

5. **案例类内容要有原状态、改变、结果、结论**
   - 不要用 title-subtitle 展示案例
   - 用 comparison 做前后对比，用 progressive-reveal 逐步揭示

### 动画选择原则

| 场景类型       | 推荐动画                              | 避免动画 |
| -------------- | ------------------------------------- | -------- |
| title-subtitle | fade-in, slow-zoom, slide-up          | -        |
| big-quote      | fade-in（金句页可以例外）             | -        |
| bullets        | progressive-reveal                    | fade-in  |
| comparison     | progressive-reveal                    | fade-in  |
| process-steps  | progressive-reveal, highlight-current | fade-in  |
| todo-checklist | progressive-reveal                    | fade-in  |

注意：`title-subtitle` 不支持 `progressive-reveal`。如果需要逐步呈现，改用 `bullets`、`comparison`、`process-steps`、`todo-checklist` 等已支持 `progressive-reveal` 的类型。

## 长视频节奏设计

长视频不是把短视频堆长，也不是一页页 PPT 自动播放。
长视频需要章节级节奏起伏：高密度讲解、低密度消化、章节过渡和阶段小结交替出现。

节奏目标不是每几秒刺激一次观众，而是让观众：

- 知道现在讲到哪
- 能消化前面的信息
- 能感受到章节推进
- 能记住关键结论
- 能收藏方法或模板

### 信息密度分类

把 scene 按信息密度分为三类：

**高密度 scene**（案例、方法、模板、多信息点解释）：

- comparison, two-column, process-steps, flow-diagram, todo-checklist, bullets

**中密度 scene**（承上启下、背景设定、迁移场景）：

- title-subtitle, bullets, roadmap

**低密度 scene**（阶段小结、节奏缓冲、关键结论突出）：

- big-quote, section-divider, cta

高密度和低密度要交替使用，但不要机械规定"几个高密度后必须几个低密度"。
判断标准是观众是否需要消化、是否出现章节转折、是否有关键结论需要突出。

### 节奏切换点

当一个章节完成了以下任务之一，应考虑加入节奏切换点：

- 完成一个案例证明
- 讲完一组方法步骤
- 得出一个关键结论
- 从问题进入方法
- 从方法进入迁移场景
- 从正文进入结尾行动

节奏切换点可以使用：

- big-quote：总结一句核心判断
- title-subtitle：承上启下
- section-divider：明确进入下一章
- cta：收尾行动

不要按固定时间机械插入节奏切换点。
不要为了"呼吸"制造无信息价值的空场景。

### 章节过渡

章节之间不要硬切。进入下一章前，应通过口播或画面说明：

- 刚才我们看到了什么
- 这个结论说明了什么
- 接下来要解决什么问题

可以通过 `recapOf` 表示该 scene 是对上一章的小结。
可以通过 `transferScenario` 表示该 scene 是进入迁移应用。
需要视觉章节页时，只能使用现有 `section-divider`，不得创造新的章节组件。

### scene 内部节奏

长视频 scene 可以比短视频更长，但不能长期静止。

如果一个 scene 超过 12 秒，应优先满足至少一项：

- 使用 `progressive-reveal` 让信息分批出现
- 使用 `highlight-current` 强调当前步骤
- 让左右对比按先左后右出现
- 让步骤、清单或节点逐个出现
- 在 voiceover 中有明确转折、停顿或总结

如果一个 scene 超过 15 秒且画面完全没有变化，应建议拆分或改为支持逐步呈现的 scene type。

### 节奏优化原则

节奏优化不是堆更多信息，而是让关键信息更清楚、更容易消化、更值得收藏。

视觉变化不等于新增知识点。
关键结论必须有独立 scene 呈现（big-quote 或 title-subtitle），不要埋在高密度 scene 里。
方法和模板必须有收藏价值，观众看完能照做。

## 手机端观看舒适度

视频最终在手机竖屏信息流中观看。横屏 16:9 画面缩到竖屏后，主体会变小。
生成 videoSpec 时必须考虑：观众在手机上能不能看清、看懂、看舒服。

### 主体放大

- 核心文字和卡片占画面更大比例，减少无效留白
- 大标题要更"顶脸"：字号更大、行距更紧、关键词更突出、副标题更短
- 不要像演示文稿那样居中留很多白

### 截图不要让观众读截图

截图页的结构应该是：大标签 + 大结论 + 截图证据

- 截图只承担"证据感"，不承担主要阅读任务
- 手机端观众不会读小字
- 截图必须配大标签和大结论，让观众不看截图也能理解核心信息

### 关键文字要大

- 主标题必须在手机竖屏缩放后一眼可读
- 关键卡片和文字不能过小
- 每页核心信息不能过散

### 字幕预留

- 字幕区域必须预留，不得遮挡主体
- 当前字幕规范已要求手机端可读、每屏最多两行、不能遮挡主体

### 中长期方向

9:16 竖屏重排仅作为未来实验方向，不进入当前默认交付包。当前默认交付物只有 video-main.mp4（16:9 mobile-optimized landscape）。

## visualRole

`visualRole` 默认用于策划、审查和质量门禁。但对于 `00_PROJECT_CONTEXT.md` 中明确标记为已实现的 `type + visualRole` 组合，Remotion 会读取 `visualRole` 触发对应样式变体。

当前已实现的 Knowledge Lab P1 组合：

- `cover` + `visualRole=hook` → lab-hook
- `two-column` + `visualRole=conflict` → lab-mistake
- `comparison` + `visualRole=evidence` → lab-evidence
- `big-quote` + `visualRole=insight/recap` → lab-insight
- `todo-checklist` + `visualRole=template` → lab-template

除上述已实现组合外，不得假设 `visualRole` 会自动产生新的视觉能力。

可选值：

- hook
- conflict
- story
- evidence
- insight
- method
- example
- template
- recap
- cta

不要把 `EvidenceScreenshot`、`MethodStepCards`、`ExperimentFlow`、独立 `PromptTemplateCard` scene type 等尚未实现的 scene type 或配置写成系统已支持。`PromptTemplateCard` 已实现，但只能通过 `todo-checklist + visualRole=template` 间接触发，不能在 videoSpec 中作为独立 type 生成。实际画面仍必须使用 `00_PROJECT_CONTEXT.md` 中已有的 22 个 scene type。

## 叙事策划字段

以下字段默认是策划、审查和质量门禁字段。但对于 00 中明确已实现的 `type + visualRole` 组合，Remotion 会读取 `visualRole` 触发对应样式变体。不要把 `visualRole` 用来生成未实现的新组件或新字段。

- `chapterId`: 必填，对应 `contentBrief.narrativeDesign.chapters[].id`。
- `humanPresence`: 必填，可选值：
  - `personal-experience`：第一人称真实经历或实验过程。
  - `personal-judgment`：个人判断、反思或认知变化。
  - `user-scenario`：用户可代入的真实使用场景。
  - `action-guidance`：面向用户的明确行动建议。
  - `none`：本 scene 不承担人感职责。
- `caseStage`: `original | change | result | conclusion | null`。只有案例相关 scene 使用。
- `evidencePurpose`: string 或 `null`。说明证据要证明什么，不是素材文件名。
- `recapOf`: chapterId 或 `null`。只有阶段小结使用。
- `transferScenario`: 场景名称或 `null`。只有迁移应用 scene 使用。

这些字段不是渲染配置：

- `humanPresence` 不代表画面必须出现真人或小尘。
- `chapterId` 不代表自动显示章节标题；需要画面章节页时，只能选择现有 `section-divider`。
- `caseStage` 和 `evidencePurpose` 不代表存在截图高亮框、局部放大或箭头标注。
- `recapOf` 不会自动生成总结页。

如果一个 scene 同时展示案例的多个阶段，`caseStage` 填该 scene 最主要的叙事阶段，并在 `evidencePurpose` 解释前后关系。完整四段式以 `contentBrief.narrativeDesign.caseStructure` 为准。

当前截图使用左右截图对比、裁剪后的重点截图、标签和说明文字。`comparison` 和 `two-column` 都支持 `assetLayout`（不依赖 presentationMode）。在 `assetLayout.left/right.highlight` 数组中可使用安全截图高亮框（HighlightBox），结构为 `{ top, left, width, height, color?, label? }`，数值使用百分比 0-100。当前 `image-hero` 支持一张主图和最多 3 个受控 `annotations`：`box`、`arrow`、`magnify`；局部放大只能通过 `annotations.kind="magnify"` 表达，不得生成独立 `zoomFrame`。当前模板用 `todo-checklist`、`process-steps`、`bullets` 表达；`PromptTemplateCard` 已作为 `todo-checklist + visualRole=template` 的内部组件实现，不能作为独立 scene type 或配置字段生成。不得生成 `freeArrowAnnotation`、任意标注编辑器或视频内人物层配置。

## voiceover 写作规则

- 口语化，不是论文
- 一句话不超过 25 个中文字
- 用标点制造自然停顿
- 不要写"大家好，今天我们来聊聊"
- 直接进入内容

## spokenText 写作规则

- 在 voiceover 基础上进一步口语化
- 英文词（AI、API、JSON、Token、Bug、prompt 等）直接保留，TTS 系统自动处理发音
- TTS、CTA 等中文语境下用中文更自然的缩写，按 05_TTS_TEXT_NORMALIZATION_PROMPT 处理
- 句子要短，一句话尽量不超过 25 个中文字

## screenText 写作规则

- 短，有冲击力
- 不是口播的完整复制
- 最多 15 个字

## 每个 scene 必须包含的字段

```json
{
  "id": "S01",
  "beatId": "B01",
  "beatRole": "hook",
  "visualRole": "hook",
  "chapterId": "CH01",
  "humanPresence": "user-scenario",
  "caseStage": null,
  "evidencePurpose": null,
  "recapOf": null,
  "transferScenario": null,
  "attentionTrigger": "pain",
  "type": "cover",
  "durationEstimate": 2.5,
  "voiceover": "",
  "spokenText": "",
  "screenText": "",
  "animation": "slow-zoom"
}
```

加上 type 特有的字段（见 00_PROJECT_CONTEXT.md）。

## 完整输出格式

```json
{
  "meta": {
    "title": "",
    "platform": "multi-platform",
    "aspectRatio": "project-default",
    "fps": 30,
    "theme": "xhs-white-editorial"
  },
  "brand": {
    "show": true,
    "watermarkText": "世间一点尘",
    "handle": "",
    "logoAssetId": null
  },
  "background": {
    "show": true,
    "variant": "theme-default",
    "showProgress": true
  },
  "qualityGate": {
    "stage": "videoSpec",
    "reviewer": "chatgpt",
    "recommendation": "pass | revise | split | stop",
    "keyRisks": [],
    "userDecision": "pending | continue | revise | split | stop",
    "approvedByUser": false,
    "decisionNote": "",
    "decidedAt": null
  },
  "scenes": [
    {
      "id": "S01",
      "beatId": "B01",
      "beatRole": "hook",
      "visualRole": "hook",
      "chapterId": "CH01",
      "humanPresence": "user-scenario",
      "caseStage": null,
      "evidencePurpose": null,
      "recapOf": null,
      "transferScenario": null,
      "attentionTrigger": "pain",
      "type": "cover",
      "durationEstimate": 2.5,
      "title": "",
      "subtitle": "",
      "screenText": "",
      "keywords": [],
      "voiceover": "",
      "spokenText": "",
      "deliveryHint": "",
      "tts": { "voice": "zh-CN-YunxiNeural", "rate": "-5%", "pitch": "+0Hz" },
      "animation": "slow-zoom"
    }
  ]
}
```

aspectRatio 默认使用 16:9。平台字段使用通用多平台描述，不为不同平台生成多个视频本体。

### 渲染目标：mobile-optimized landscape

视频本体默认输出 16:9 横版。不默认生成 9:16 竖屏重排版。

手机端优化通过以下方式解决：

- 放大字号（主标题 +15%-30%，副标题 +10%-20%，卡片正文 +15%-25%）
- 放大组件（卡片、流程节点、对比框、截图容器）
- 减少无效留白，主体占画面更大比例
- 截图不依赖细读，配大标签和大结论
- 字幕安全区预留，不遮挡主体

封面仍输出两个比例：`cover-3x4.png`（抖音/快手）和 `cover-4x3.png`（B站/小红书）。

`brand` 字段的渲染状态：

- `brand.watermarkText`：已渲染生效。SceneChrome 右上角显示自定义品牌名（默认"世间一点尘"）。
- `brand.logoAssetId`：已渲染生效。SceneChrome 右上角 avatar 使用指定图片；为 null 时回退到默认头像。
- `brand.handle`：保留字段，暂不渲染。

`background.showProgress`：已渲染生效。`false` 隐藏进度条，`true` 显示。`background.variant` 仍为 metadata-only，背景来自 theme.background。

## TTS rate 建议

| 场景类型 | 建议 rate |
| -------- | --------- |
| hook     | -5%       |
| conflict | -5%       |
| case     | +0%       |
| thesis   | -5%       |
| method   | -3%       |
| action   | -3%       |
| cta      | -5%       |

## 注意事项

- 当前无 locked candidate type。`code` 已解锁，但只用于短代码、JSON、prompt、CLAUDE.md、配置片段和文档步骤的逐行高亮讲解。`diff` 已解锁，但只用于短前后变化解释，不用于真实 Git diff、终端日志、IDE 或长代码审查。`terminal` 已解锁，但只用于短命令和短执行结果，不用于长日志、交互式终端、IDE 或敏感信息展示。`image-hero` 已解锁，但只用于一张主图、最多 3 个受控标注和最多 3 条解释；`box`、`arrow`、`magnify` 都已支持，但不用于长图滚动、任意标注编辑器、视频素材或交互式界面。`gantt` 已解锁，但只用于轻量执行链路、并行任务、阻塞点和确认点，不用于复杂项目管理甘特图、精确日期排期或资源管理。
- 生成 `image-hero.annotations` 坐标时，先确认关键对象的位置和大小，再写框选或放大坐标；框只比对象大一点，箭头必须指向明确目标，`magnify` 必须放大真正需要细看的局部。
- 每个 scene 的 type 特有字段必须完整
- 每个 scene 必须有合法且明确的 visualRole
- 每个 scene 必须有合法的 chapterId 和 humanPresence
- caseStage、evidencePurpose、recapOf、transferScenario 不适用时写 null，不省略语义
- 策划字段不能被解释为新增渲染能力
- `humanPresence` 不只是口播标签。生成 Visual Staging Plan 时，应考虑低成本人感表达：光标、输入、选中、拖拽、勾选、手写标注、角色状态、桌面/白板/手册/便签等。但当前不能把视频内小尘人物层或 human-presence-layer 写成已实现能力。
- 每页最多 3 个核心信息点
- 内容放不下时拆页，不缩小字号
- `qualityGate` 只保存审查建议、关键风险和用户决定，不得保存完整评分
- 不得用观点或假设冒充真实案例证据
- `recommendation: "pass"` 不代表已获准生成 TTS、字幕、封面或渲染

## 广痛点入口规则

如果 contentBrief 已引用 `15_CONTENT_STRATEGY_AND_CREATOR_POSITIONING.md`，生成 videoSpec 时应确保 S01-S03 延续广痛点入口：

- S01：不裸露工具术语（如 CLAUDE.md / Prompt / Skill），用普通读者能感受到的痛点或判断。
- S02：给出反差或结果承诺，让读者期待一个可验证的变化。
- S03：再进入具体工具/系统/案例。

不得把面向普通读者的痛点在 videoSpec 阶段改写成内部术语。

## Visual Staging Plan 规则

生成 videoSpec 前，对关键 scene 先输出 Visual Staging Plan 摘要。该摘要给用户确认画面解释逻辑，不写入正式 `videoSpec.json`。

关键 scene 包括：

- hook / cover
- conflict
- case / evidence
- method / process
- template / action
- recap / insight
- cta

每个关键 scene 至少回答：

```json
{
  "sceneId": "S03",
  "visualExplanationGoal": "",
  "stagingObjects": [
    {
      "objectName": "",
      "objectType": "entity | state | relation | process | evidence | label | conclusion",
      "cognitiveRole": "identify | compare | track | explain | confirm | warn | remember",
      "appearanceTrigger": "",
      "stagingZone": "input | transformation | output | center | edge | background",
      "entryMotion": "",
      "exitMotion": "",
      "sizeLevel": "L1 | L2 | L3",
      "attentionPriority": 1,
      "holdDurationIntent": "",
      "whatChangesAfterAppearance": "",
      "viewerShouldUnderstand": "",
      "theoryRationale": ""
    }
  ],
  "causalPath": "",
  "silentViewingCheck": "",
  "pptRiskCheck": ""
}
```

导演决策规则：

- 输入材料类对象靠近输入区出现。
- 转换过程类对象在中间变化区出现。
- 输出结果类对象在输出区出现。
- 关系类对象必须连接对象，不能孤立出现。
- 状态类对象必须有前后差异。
- 辅助标签必须靠近被标注对象。
- 结论必须从前面的因果关系中浮现。
- 关键对象必须位于手机端中心安全区或清晰可读区域。

### Visual Staging Plan → scene type 决策表

不要只按内容类型选组件。先看 Visual Staging Plan 中的 `objectType`、`cognitiveRole` 和 `whatChangesAfterAppearance`，再映射到当前已实现能力：

生成顺序必须是：

```text
semantic beat
→ semantic shot pattern
→ scene host
→ 当前字段和 renderer 能力
```

不要反过来从 `cover / bullets / two-column` 这类 PPT page scene 倒推画面。旧页面型 scene 可以作为 supporting shot 或外壳，但核心解释页必须先判断对象、状态、关系或过程是否真的发生变化。当前能力状态以 `src/video-system/visual/capabilityRegistry.ts` 为准。

| 视觉解释核心 | 优先 scene type / pattern | 判断标准 |
| --- | --- | --- |
| 开头压力、重复指令、信息袭来、困惑形成 | `cover + semanticPattern=pressure-build` | 当前已支持；只能用于 Hook，不能用普通 cover 冒充 |
| 文件、配置、prompt、CLAUDE.md 本身就是知识对象 | `code` | 观众需要逐行看到结构或字段含义 |
| 旧写法被替换为新写法 | `diff` | 核心是前后变化，不是完整代码阅读 |
| 命令执行、测试结果、构建状态 | `terminal` | 核心是“我跑了什么，结果是什么” |
| 真实界面、截图、生成图、复杂隐喻图 | `image-hero` | 核心图像承载现场，需要少量标注或单点放大 |
| 执行链路、并行、阻塞、人工确认 | `gantt` | 核心是流程推进和依赖关系 |
| 散落材料聚合成结构 | `flow-diagram + semanticPattern=fragment-to-manual` | 当前已实现“碎片汇聚成手册”语义 pattern |
| 绕路和直达的路径差异 | `comparison + semanticPattern=detour-vs-direct-path` | 当前已实现“绕远 vs 直达”语义 pattern |
| 说到哪里需要观众看哪里 | 已接入 cue 的 scene + `SpotlightCue` 内部组件 | 只在当前 scene 已接入 cue 渲染时使用；不得新增 `spotlight` type |
| 错误判断需要被否定再替换 | `big-quote + semanticPattern=wrong-to-correct` | 当前已支持；适合短判断纠偏；不得新增 `strike-replace` type |
| 手册点亮项目地图但不提供硬拦截 | 组件升级 / handoff 中使用 `MapLightUp` | 当前不是正式 scene type；正式 videoSpec 需落在已支持 scene type 或记录风险 |
| 新人状态从未读手册到已读手册 | 组件升级 / handoff 中使用 `StateTransition` | 当前不是正式 scene type；正式 videoSpec 需落在已支持 scene type 或记录风险 |
| 角色从困惑到理解、操作路线变清楚 | `two-column + semanticPattern=confused-to-guided` | 当前已支持；用于入口太多到路线清晰的状态变化 |
| 普通并列观点 | `bullets` / `two-column` / `three-column` | 没有对象变化、路径、证据或执行链路时才使用 |

如果 Visual Staging Plan 的核心动作无法被上述已实现能力表达，不要硬塞成普通卡片。应在 `qualityGate.keyRisks` 或 visualDirectionSpec 的 `remotionCapability` 中标为 `needs-component-upgrade`、`needs-generated-asset` 或 `backlog`。

内部组件只能作为“已实现能力说明”或“Agent 可复用实现线索”，不能直接生成到正式 `videoSpec.type`。例如 `PathComparison` 是内部组件，正式 videoSpec 仍应使用 `type="comparison"` + `semanticPattern="detour-vs-direct-path"`；`MapLightUp`、`StateTransition` 当前也不能写成新的 type。

连线、路径、箭头的生成原则：关系线应从对象边缘中点出发并落到目标对象边缘中点，避免中心点连线穿过卡片主体。标注箭头必须指向目标框或关键对象边缘；`image-hero` 的框选应先判断关键对象位置和大小，再让框只比对象略大。

理论依据写法：

- 标签靠近对象：Spatial Contiguity。
- 当前重点突出：Signaling Principle。
- 分阶段出现：Segmenting Principle。
- 删除无关装饰：Coherence Principle。
- 每帧唯一视觉中心：Cognitive Load。
- 字号、对齐、图底对比：Processing Fluency。

## Visual Direction Spec 规则

videoSpec 生成后，不直接交给 Agent 执行。对以下关键 scene，ChatGPT 必须生成 visualDirectionSpec.md：

- hook / cover
- two-column conflict
- comparison evidence
- big-quote insight / recap
- process-steps
- todo-checklist template
- cta

visualDirectionSpec.md 至少包含：

- sceneId
- scene pattern（对应 14 的 Scene Pattern Library）
- 视觉目标
- 第一视觉中心
- 布局比例
- 字号层级（对应 14 的 Typography System）
- 中文换行要求（对应 14 的 Chinese Text Layout Rules）
- 动画节奏（对应 14 的 Motion Rules）
- 手机端验收标准（对应 14 的 Mobile Scaled Viewing Rules）
- 禁止事项

关键区分：

- scene type 选择不等于画面设计完成。
- comparison 不等于证据页成立。
- todo-checklist 不等于模板页有收藏价值。
- cover 不等于 hook 成立。

视觉系统底座见 `14_VISUAL_DESIGN_SYSTEM_V1_ALPHA.md`。

### visualDirectionSpec 输出模板

每个关键 scene 的 visualDirectionSpec 至少包含：

```json
{
  "sceneId": "S06",
  "scenePattern": "evidenceComparison",
  "visualGoal": "让差异被看见，而不是把差异解释完",
  "firstFocus": "顶部大结论",
  "layoutRatio": "左右各 38%-40%，gutter 5%",
  "typography": {
    "title": "Heading L (80-96px)",
    "caption": "Caption L (56-64px)",
    "label": "Label (48-56px)"
  },
  "chineseTextRules": "caption 最多 2 行，尾行不小于 4 字",
  "motionRhythm": "大结论→左截图→左高亮→右截图→右高亮→底部解释",
  "remotionCapability": {
    "engineCanDo": true,
    "currentComponentSupport": "supported | needs-component-upgrade | needs-generated-asset | backlog",
    "implementationPath": "使用现有 comparison + assetLayout / 新增 SVG path motion / 生成静态示意图后作为 asset 展示",
    "risk": "如果不升级组件，将退化成普通卡片或流程图"
  },
  "mobileScaledQA": "主标题一眼可读，截图不依赖细读",
  "forbidden": ["caption 比截图更抢眼", "高亮超过 2 个", "用户需要读截图小字"]
}
```

`remotionCapability` 只写在 visualDirectionSpec / handoff 说明中，不写入正式 `videoSpec.json`，除非项目 schema 已明确支持对应字段。

能力分类规则：

- `legacy-support`：旧 PPT scene / 主题保留为辅助表达或外壳。可以使用，但不能把它当作核心视觉解释页。
- `semantic-enabled`：可作为语义镜头宿主，但必须有明确 shot pattern、visualRole、cue 或内部时序。
- `production-validated`：已有正式入口、validator/fixture/视觉边界，可以直接进入正式 videoSpec。
- `internal-wired`：代码里已接入某些分支或消费点，但不是通用 schema 能力。只能作为 Agent 复用线索，不得当作新 type。
- `fixture-only`：有 fixture 或实验演示，但未接入正式 renderer，不能直接进入正式视频。
- `experimental`：只允许进入 shot-lab / experiment。
- `backlog`：本轮不做，不能写成执行要求。
- `supported`：现有 scene type 和字段可以直接表达，并且当前组件会读取这些字段。
- `needs-component-upgrade`：Remotion 可以做，但当前正式 scene / schema 尚未稳定暴露。碎片吸入手册已由 `flow-diagram + semanticPattern=fragment-to-manual` 支持；路径绕远 / 路径变短已由 `comparison + semanticPattern=detour-vs-direct-path` 支持；错误判断纠偏已由 `big-quote + semanticPattern=wrong-to-correct` 支持；`SpotlightCue`、`StateTransition`、`MapLightUp`、`PathComparison` 是内部 reusable component 或已接入能力，不能直接当作新 scene type 输出。
- `needs-generated-asset`：用生图或静态素材更合适，后续必须进入 04 assetManifest 流程。
- `backlog`：本轮不做，不能写成执行要求。

Locked candidate 类型处理：

- `code-step-visualization`：代码、JSON、prompt、CLAUDE.md、配置和步骤讲解。当前可以生成 `type=code`，但必须提供 1-10 行 `lines`，每行建议不超过 84 字符；适合逐行高亮，不适合长文章、diff 对比、终端日志或真实 IDE 操作。
- `diff-explainer`：前后版本、prompt 改写、配置变化、错误/正确对照。当前可以生成 `type=diff`，但必须提供 2-8 条 `changes`，每条 kind 只能是 `removed` 或 `added`，至少 1 条 removed 和 1 条 added；适合短前后变化解释，不适合真实 Git diff、长代码审查、终端日志或 IDE 操作。
- `terminal-result`：命令执行、报错、测试通过、Agent 工作流。当前可以生成 `type=terminal`，但必须提供 1-8 行 `lines`、一个 `command` 和一个 `result`；适合短执行结果，不适合长日志、多屏滚动、交互式终端、IDE 操作或敏感信息展示。
- `plan-timeline`：并行任务、执行链路、项目排期。当前可以生成 `type=gantt`，但必须提供 1-5 条 `lanes`，总 task 不超过 8 个，start/end 使用 0-100 的流程百分比；适合执行链路、并行关系、阻塞和确认点，不适合复杂项目管理、精确日期排期或资源管理。
- `real-interface-hero`：真实产品、界面、截图、视觉案例大图。当前可以生成 `type=image-hero`，但必须提供 assetId 或 public 内相对 imagePath；适合一张主图 + 少量受控标注，支持 `box`、`arrow`、`magnify`。不适合长图滚动、任意标注编辑器、交互式界面或需要读很多小字的截图。标注应放在空白区、边缘区或不重要区域，不能遮挡主图要呈现的关键内容；局部放大只用于真正需要细看的单点区域。
- `human-presence-layer`：人正在操作、判断、卡住或确认结果的视觉层。当前不能写成正式字段，只能作为 `needs-component-upgrade` 风险记录。

如果关键 scene 的核心视觉解释属于 `needs-component-upgrade` 或 `needs-generated-asset`，videoSpec 的 `qualityGate.keyRisks` 必须记录该风险。不能给用户一种“已完全可渲染”的错觉。

### visualAcceptanceChecklist 生成规则

visualAcceptanceChecklist.md 由 ChatGPT 在生成 visualDirectionSpec.md 时同步生成。

结构：

```markdown
# 视觉验收清单 — [视频标题]

## 全局

- [ ] 第一帧有信息
- [ ] 0.5s 主标题可读
- [ ] 主体面积 ≥ 35%
- [ ] 无单字孤行
- [ ] mobile_scaled 通过

## [sceneId] [scenePattern]

- [ ] [该 scene 的具体验收项]
- [ ] 字号在 14 规定范围内
- [ ] 中文换行无孤行
- [ ] 截图不依赖细读（如适用）
- [ ] 模板有保存价值（如适用）
```

每个关键 scene 必须有独立验收项。验收项来自 14 的 Visual QA Checklist 对应 pattern。

### 截图字段映射

14 中的证据页四层结构（来源锚点、证据本体、导向标注、结论层）当前映射到：

| 14 概念  | 当前 videoSpec 字段              | 当前渲染                      |
| -------- | -------------------------------- | ----------------------------- |
| 来源锚点 | 无独立字段                       | 通过 visualDirectionSpec 描述 |
| 证据本体 | assetLayout.left/right.assetId   | Img 组件渲染截图              |
| 导向标注 | assetLayout.left/right.highlight | HighlightBox 组件             |
| 结论层   | assetLayout.left/right.caption   | EvidenceBlock caption         |

source chip、claim、inference 当前不写入 videoSpec schema。如需单独渲染 source chip，记录为未来实现任务。

## 共同打磨要求

生成 videoSpec.json 前，先和用户讨论：

- 口播应该是什么语气
- 哪些地方适合用对比
- 哪些地方适合用流程图
- 哪些地方需要真实截图
- 章节如何推进，哪些地方需要阶段小结
- 人感来自哪段真实经历、判断或行动建议
- 哪些 scene 承担案例四段式和迁移场景
- 这条视频的核心概念应该变成什么对象、状态、关系、路径或过程
- 关键对象 A 应该在哪里出现、怎么出现、出现后改变什么
- 每个关键 scene 的视觉中心是什么，静音观看能否看出主要变化
- 画面主题用白底杂志风还是知识架构蓝图

ChatGPT 必须主动给出自己的判断和依据。例如："我建议这里用 two-column，不用 bullets，因为这段核心是'模糊提问 vs 补充背景'的对比。"

讨论画面方向后可以先输出 videoSpec 草案。

输出后必须暂停，把 videoSpec 的关键摘要贴给用户确认：

- scene 摘要表（id / chapterId / type / beatRole / visualRole / humanPresence / screenText）
- voiceover 要点
- spokenText 要点
- qualityGate 状态与关键风险

草案输出后必须暂停。用户明确决定 `continue` 且 `approvedByUser: true` 后，才进入素材处理 / TTS / 封面路线。`revise` 只能修改后重新审查，不能自动推进。

如果用户只要求修改某个 scene，只修改对应 scene，不要重写整个 videoSpec。
