# P1 组件系统升级总交付文档

> 给全新 Codex 窗口使用。请先读本文件，再读项目根目录 `AGENTS.md`。
> 这不是某一个小 bug 的交接，而是接下来整个 Remotion 知识视频系统升级的方向、状态、计划和执行边界。

## 1. 用户真正想要什么

用户不是单纯想把文章变成 PPT 式视频。

用户想要的是：

> 用画面来解释知识。

更具体地说：

- 抽象概念要变成看得见的对象。
- 关系要变成空间结构。
- 变化要变成运动。
- 推理过程要变成动画。
- 说到 A，画面里应该出现 A。
- 说到“苹果掉下来”，画面里应该真的有苹果从树上掉下来。
- 说到“电子在电场运动”，画面里应该有电子在电场中运动。

用户喜欢的方向接近 3Blue1Brown：不是文字堆叠，而是动画和可视化让抽象概念变得能被看见。

用户明确不满意的方向：

- 卡片一张张出现。
- 文字堆在屏幕上。
- 旁白负责讲，画面只是装饰。
- 看起来像 PPT、像讲课、像死物。

核心判断：

> 视频应该是“画面参与讲解”，不是“画面装饰口播”。

## 2. 为什么要升级组件系统

导演系统已经开始变强，但如果组件系统表达能力不足，导演系统会被现有组件限制。

过去的问题不是 Remotion 做不到，而是系统没有把 Remotion 的能力组织成可复用组件：

- 路径运动可以表达“绕路 / 直达”。
- 高亮可以表达“说到哪里看哪里”。
- 代码逐行高亮可以表达“文档/配置/Prompt 的结构”。
- diff 可以表达“改之前 / 改之后”。
- terminal 可以表达“命令执行 / 测试结果 / 实验现场”。
- image-hero 可以表达“复杂画面、截图、生成图、局部标注”。
- gantt 可以表达“流程、并行、阻塞、确认点”。

所以后续升级重点不是盲目加组件，而是补齐“知识解释动作”的组件能力。

组件升级的目标：

> 给导演系统一组真正能讲知识的视觉动词。

这些视觉动词包括：

- 出现
- 连接
- 分离
- 吸入
- 点亮
- 高亮
- 划掉
- 替换
- 放大
- 路径移动
- 对比
- 逐行解释
- 状态切换
- 因果传递
- 从混乱变有序

## 3. 当前项目关键约束

必须遵守项目根目录：

`<PROJECT_ROOT>\AGENTS.md`

重要约束：

- 默认中文。
- 修改代码前必须先输出：
  - Project Understanding Report
  - Implementation Plan
  - 等用户确认后才能改
- 修改后必须输出：
  - 修改文件清单
  - 验证命令和结果
  - 失败项
  - 回滚方式
- 不要擅自渲染 mp4。
- 视觉修改优先通过 Remotion Studio / still / fixture 检阅。
- 禁止 CSS `transition`。
- 禁止 CSS `animation` / `@keyframes`。
- 禁止 Tailwind 动画类。
- Remotion 动画必须用 frame-driven 方式：
  - `useCurrentFrame()`
  - `interpolate()`
  - `spring()`
  - `Sequence`
  - `TransitionSeries`
- 不要改 `userDecision`、`approvedByUser`、`decisionNote`、`decidedAt`。
- 不要把未实现能力写成已支持。

## 4. 当前系统状态

当前主系统路径：

`<PROJECT_ROOT>\src\video-system\`

当前 prompt 系统：

`<PROJECT_ROOT>\knowledge-video-system\prompts\`

当前已经解锁的正式 scene type 共 22 个：

```text
cover
big-quote
title-subtitle
bullets
comparison
two-column
three-column
pros-cons
todo-checklist
stat-highlight
process-steps
flow-diagram
roadmap
timeline
mindmap
section-divider
cta
code
diff
terminal
image-hero
gantt
```

当前 locked candidate：

```text
无
```

注意：scene type 虽然都已解锁，但仍必须遵守能力边界。不要把一个轻量组件当成无限能力。

## 5. 已完成的组件系统升级

### 5.1 code scene

已解锁。

用途：

- 短代码
- JSON
- prompt
- CLAUDE.md
- 配置片段
- 文档步骤
- 逐行高亮讲解

用户认可的点：

> 代码块形式很好。

用户反馈过的细节：

- `项目背景`
- `开发规范`
- `禁改区域`
- `常用命令`

这四个部分前面不要加 `#`。

当前方向：

- 可以用于当前视频里的 CLAUDE.md 四层结构。
- 右侧解释最好引用官方指引，不要只重复用户自己的经验。
- 示例要给一点点，不然观众会知道“大概要写什么”但不知道“具体写什么”。

边界：

- 不要展示长代码。
- 不要当成 IDE。
- 不要当成 terminal。
- 不要把大段文档塞进去。

### 5.2 diff scene

已解锁。

用途：

- 错误写法到正确写法。
- 改之前 / 改之后。
- prompt 改写。
- 配置变化。

边界：

- 不是 Git diff 全量审查页。
- 不展示大段代码。

### 5.3 terminal scene

已解锁。

用途：

- 短命令。
- 测试结果。
- 构建结果。
- 实验执行现场。

边界：

- 不是长日志阅读器。
- 不展示敏感信息。
- 不做交互式终端模拟。

### 5.4 image-hero scene

已解锁。

用途：

- 一张主图讲解。
- 截图。
- 生成图。
- 真实界面。
- 复杂隐喻图。
- 最多 3 条解释 points。
- 最多 3 个受控 annotations。

已支持 annotation：

- `box`
- `arrow`
- `magnify`

用户认可：

> 局部放大做得很好。

当前未完成的具体修复：

- `手册=知识入口` 的框选不够精确。
- 框选应该贴合关键对象，只比对象大一点。
- 箭头应该从解释 label 指向目标框边缘，而不是中心对中心。

这项局部修复已经单独写了交付文档：

`<PROJECT_ROOT>\docs\director\P1_IMAGE_HERO_ANNOTATION_GEOMETRY_HANDOFF.md`

新窗口继续执行时，优先先完成这个修复。

### 5.5 gantt scene

已解锁并经过用户多轮反馈。

用途：

- 轻量执行链路。
- 并行任务。
- 阻塞点。
- 人工确认点。
- 流程阶段。

用户反馈过的问题：

- 阶段背景块让画面怪，不够美观。
- 删除阶段区分块后舒服很多。

当前方向：

- 不要做真实项目管理甘特图。
- 更适合做“流程可视化 / 执行链路 / 人工确认节点”。

## 6. 当前优先任务顺序

### P1-A：修复 image-hero annotation 几何逻辑

这是下一个新窗口应该先做的任务。

原因：

- 用户刚刚明确指出问题。
- 这个问题影响 `image-hero` 是否能成为可靠组件。
- 局部放大已好用，剩下的是标注专业度。

交付文档：

`docs/director/P1_IMAGE_HERO_ANNOTATION_GEOMETRY_HANDOFF.md`

核心要求：

- 框选贴合真实关键对象。
- 箭头落到框边缘。
- 不做 OCR。
- 不做任意标注编辑器。
- 不新增 scene type。

验收 still：

```bash
npx remotion still src/index.ts ImageHeroSceneFixture --frame=145 --output=out/keyframes/component-upgrade/P1-image-hero-annotations-fixture.png
```

验证：

```bash
npm run typecheck
npm run visual:fixtures
npm run validate:all
```

### P1-B：整理组件能力清单和导演系统提示词

完成 P1-A 后，应该检查 prompt 系统是否准确告诉网页版 GPT：

- 当前 Remotion 能做什么。
- 每种 scene type 适合表达什么知识动作。
- 什么情况应该用 `code`。
- 什么情况应该用 `image-hero`。
- 什么情况应该用 `gantt`。
- 什么情况应该用生成图补足 Remotion 不适合直接做的复杂画面。

重点文件：

`knowledge-video-system/prompts/00_PROJECT_CONTEXT.md`

可同时检查：

- `knowledge-video-system/prompts/03_CONTENT_BRIEF_TO_VIDEO_SPEC_PROMPT.md`
- `knowledge-video-system/prompts/07_STYLE_THEME_LAYOUT_RULES_PROMPT.md`
- `knowledge-video-system/prompts/13_THEORY_AND_BEST_PRACTICES.md`
- `knowledge-video-system/prompts/14_VISUAL_DESIGN_SYSTEM_V1_ALPHA.md`

这一步的目标不是写更多漂亮话，而是让 GPT 在生成 videoSpec 时真的会选择合适组件。

必须强调：

> 先想“这个知识点应该被看见成什么”，再选 scene type。

不要让 GPT 只按内容类型选组件。

错误例子：

- 看到文档就用 bullets。
- 看到流程就用 process-steps。
- 看到截图就只放 image。

正确例子：

- 如果关键是“项目知识从聊天记录吸入 CLAUDE.md”，画面应该表达吸入、聚合、沉淀。
- 如果关键是“没有手册会绕路，有手册会直达”，画面应该表达两条路径对比。
- 如果关键是“配置文件有四层”，可以用 code scene 逐行高亮。
- 如果关键是“复杂画面中某个局部重要”，用 image-hero annotation / magnify。

### P1-C：补齐视觉解释动作库

下一阶段不要急着加 scene type，而是优先抽象内部可复用视觉动作。

建议新增或整理为 reusable component / utility，而不一定暴露为 scene type：

1. `VisualAnnotations`
   - 当前已有。
   - 继续修边缘连接和精确框选。

2. `ConceptFlow`
   - 用于“散落 -> 聚合 -> 沉淀”。
   - 典型画面：便签被吸入 CLAUDE.md。

3. `PathComparison`
   - 用于“绕路 vs 直达”。
   - 当前 S07/S08 已有类似效果，但可能是场景内定制。
   - 可考虑沉淀成可复用能力。

4. `SpotlightCue`
   - 用于“说到哪里，哪里高亮”。
   - 用户明确喜欢 S03 的效果。
   - 必须多信号高亮，不要只靠 opacity。

5. `StrikeAndReplace`
   - 用于“错误概念被划掉，然后替换成正确概念”。
   - 用户曾提出：`记忆问题` 出现后，被横线划掉，然后消失。

6. `StateTransition`
   - 用于“空白新人 -> 已读手册的新同事”。
   - 用状态切换表达理解变化。

7. `MapLightUp`
   - 用于“项目地图被点亮 / 禁改区域上锁 / 路径变短”。
   - 可先做轻量 2D，不要上复杂 3D。

这些能力的优先级要看是否能服务真实视频，不要为了组件而组件。

## 7. 当前视频的关键经验

当前视频主题：

> Claude Code 不是失忆，是我没给它办入职。

用户认可的画面经验：

- S03：说到哪里，哪里高亮。这是用户明确说“这就是我想要的效果”的例子。
- S07/S08：放在同一画面对比后更好，因为分开会让人觉得“这里不是讲过了吗”。
- code scene：代码块形式很好，适合 CLAUDE.md 四层结构。
- image-hero：局部放大效果很好。
- gantt：删除阶段背景块后更舒服。

用户不喜欢或指出的问题：

- PPT 感强。
- 动画感觉没有用上。
- 视觉设计没有真正进入视频。
- 有些修改只是在做漂亮卡片，没有让画面参与讲解。
- 标注和解释不能遮挡关键内容。
- 给建议时必须讲清楚“这个组件升级用在当前视频哪里”，否则用户不容易判断值不值得做。

给新窗口的重要沟通方式：

当你建议一个组件升级时，不要只说专业名词。要这样说：

> 这个升级可以用在当前视频的 S03：口播说到“项目背景说过很多次”时，对应卡片会被高亮，观众能看到“说到哪里，看哪里”。

如果当前视频用不上，也要用生活例子解释：

> 比如讲苹果掉下来时，不是显示“苹果掉落”四个字，而是让苹果真的从树上落下。

## 8. 生图和 Remotion 的关系

用户新增的重要想法：

> Remotion 做不到或不适合直接做的复杂画面，可以用生图补足。

但要判断清楚：

Remotion 适合：

- 运动。
- 路径。
- 高亮。
- 关系变化。
- 状态切换。
- 代码/终端/流程等结构化画面。
- 基于已有图像的标注、放大、遮罩、强调。

生图适合：

- 复杂隐喻大场景。
- 真实感/插画感主视觉。
- 人物、桌面、工作现场。
- 单帧里很难用 CSS/React 快速画好的复杂图像。

正确组合：

> 生图负责“复杂现场”，Remotion 负责“讲解动作”。

例如：

- 生图生成“小尘在读 CLAUDE.md 手册”的复杂画面。
- Remotion 在图上框选手册、放大文字、箭头指向、同步高亮右侧解释。

错误组合：

- 生图生成一张漂亮图，然后 Remotion 只把它摆在那里。
- Remotion 硬画复杂人物和场景，浪费时间，效果还差。

## 9. 理论依据应该怎么融入

用户希望“怎么出现 A、在哪里出现 A、出现方式、字体大小”都有理论依据。

但理论不应该变成论文堆砌。

应转成可执行规则：

- 认知负荷：一屏最多 3 个核心信息点。
- 双通道学习：不要让屏幕文字重复口播全文；画面承担结构和关系。
- 注意力引导：说到哪里，高亮哪里；不要让观众自己找。
- 空间邻近：解释文字靠近被解释对象，箭头/框选连接明确。
- 时间邻近：口播提到某对象时，对象同步出现或变化。
- 信号原则：高亮要用多信号组合，不能只靠透明度。
- 分段原则：复杂过程拆成步骤动画，不一次性全铺开。
- 一致性原则：同类对象用一致颜色、形状、位置规则。

这些规则已经部分写入：

`docs/director/DIRECTOR_VISUAL_RULES.md`

以及 prompt：

`knowledge-video-system/prompts/13_THEORY_AND_BEST_PRACTICES.md`

新窗口如继续优化导演系统，应该把理论转成 checklist，而不是只加说明文字。

## 10. 流程层面必须记住的问题

用户之前踩过最大坑：

> 没有想清楚自己到底想要什么，就直接把文章丢给 AI，然后一路同意，最后发现不满意，又开始返工。

所以网页版 GPT 接到文章后，不应该直接生成完整 `contentBrief` / `videoSpec`。

它必须先问用户：

- 你到底想让观众记住什么？
- 你想表达的变化是什么？
- 看完前观众以为什么？
- 看完后观众应该理解什么？
- 这个视频最该被看见的画面是什么？
- 有哪些画面绝对不要像 PPT？

也就是说，前置阶段要强迫用户想清楚。

不是 GPT 自动生成 `whyThisVideo/viewerBefore/viewerAfter` 后就继续往下跑。

正确流程：

1. 用户给文章。
2. GPT 先追问用户想要什么。
3. 用户确认核心表达。
4. GPT 再生成内容策划。
5. 每个阶段交付前自检。
6. Agent 执行前检查交付包是否完整。
7. 先 Studio/Still 预览，用户确认后再渲染 mp4。

## 11. 交付包自检要求

用户明确希望：

> 给出交付包的时候，罗列任务清单检查一遍是否所有流程都走过一遍了，并让 GPT 再重新思考整个交付包有没有问题。

所以后续任何 handoff / execution package 都应包含：

- 输入文件是否齐全。
- 用户确认是否齐全。
- `approvedByUser` 是否允许进入下一步。
- 是否跳过了封面设计。
- 是否跳过了口播汇总。
- 是否需要 TTS。
- 是否应该只进 Studio，而不是直接 render mp4。
- 当前任务是不是只改一个包。
- 有没有用了未实现能力。
- 有没有把 Remotion 做不到的画面硬写成已支持。
- 有没有需要生图补足。
- 有没有视觉自检结论。

## 12. 新窗口执行总顺序建议

### 第一步：接手上下文

新窗口先读：

```bash
Get-Content -Raw AGENTS.md
Get-Content -Raw docs/director/P1_COMPONENT_SYSTEM_UPGRADE_MASTER_HANDOFF.md
Get-Content -Raw docs/director/P1_IMAGE_HERO_ANNOTATION_GEOMETRY_HANDOFF.md
```

然后读当前关键代码：

```bash
Get-Content -Raw src/video-system/components/visual/VisualAnnotations.tsx
Get-Content -Raw src/video-system/scenes/ImageHeroScene.tsx
Get-Content -Raw src/video-system/compositions/ImageHeroSceneFixture.tsx
```

### 第二步：先完成 P1-A

完成 `image-hero` 标注几何修复。

这是当前最近的未完成任务。

### 第三步：跑验证并让用户看 still

生成：

```bash
npx remotion still src/index.ts ImageHeroSceneFixture --frame=145 --output=out/keyframes/component-upgrade/P1-image-hero-annotations-fixture.png
```

验证：

```bash
npm run typecheck
npm run visual:fixtures
npm run validate:all
```

### 第四步：用户确认后，再进入下一项组件升级

不要连续做多个包。

建议下一项从下面选：

1. `SpotlightCue` 系统化：把用户喜欢的 S03 高亮能力沉淀成更通用的 cue 模式。
2. `StrikeAndReplace`：实现“错误概念被划掉并消失/替换”。
3. `ConceptFlow`：实现“散落知识 -> 吸入手册 -> 沉淀成结构”的可复用画面。
4. `PathComparison`：沉淀“绕路 vs 直达”的可复用路径对比组件。

选择标准：

> 优先做能服务真实视频、能减少 PPT 感、能让画面承担解释功能的组件。

## 13. 新窗口不要犯的错误

不要：

- 只修一个视觉小细节，却说完成了系统升级。
- 只做漂亮卡片。
- 没解释组件在当前视频哪里用。
- 没等用户确认就改代码。
- 直接渲染 mp4。
- 一次并入多个组件升级。
- 为了显得高级而引入复杂库。
- 把实验版能力直接迁移到主系统。
- 把未实现能力写进 prompt 说已支持。
- 忽略用户指出的“画面参与讲解”核心目标。

## 14. 最重要的判断标准

每次做组件升级前，问一句：

> 这个组件能不能让观众在静音情况下也看懂一个变化、关系或过程？

如果不能，它可能只是装饰。

每次做视频画面前，问一句：

> 这个画面是在讲知识，还是只是在摆文字？

如果只是摆文字，就会回到用户最不满意的 PPT 感。

## 15. 当前总状态

已完成：

- 导演系统核心方向明确：用画面解释知识。
- `code` / `diff` / `terminal` / `image-hero` / `gantt` 已解锁。
- 当前视频多处细节已迭代到用户认可。
- image-hero 局部放大已得到用户认可。

当前未完成：

- image-hero 的框选和箭头几何逻辑需要修。
- 组件能力清单还需要进一步让 GPT 更会选组件。
- 多个视觉解释动作还需要沉淀成可复用组件。

下一步：

1. 先执行 `P1_IMAGE_HERO_ANNOTATION_GEOMETRY_HANDOFF.md`。
2. 用户确认后，再选一个能服务真实视频的视觉解释动作做组件化。
3. 每一步都要 still / fixture / validate，不要直接 mp4。

