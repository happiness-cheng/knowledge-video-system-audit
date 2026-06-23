# P1-2B Visual Direction Spec

本文件是导演审查文档，不会被当前脚本自动读取。当前脚本读取路径是 `src/video-system/data/visualDirectionSpec.md`，该文件本轮不创建，避免把草案误接入正式 QA。

## 全局方向

- 目标：像一次实验复盘，不像方法论讲义。
- 输出规格：16:9 横版，后续 Studio 检阅时必须同时看 mobile scaled 观感。
- 能力边界：只使用现有 scene type、`visualRole`、`animation`、`assetLayout` 和已实现 Knowledge Lab P1 组合。
- 视觉策略：每页只有一个导演任务；证据页不依赖细读截图；模板页必须可截图保存。
- 本轮不使用：动态背景、KineticTitle、GlassCard、BGM、音效、Lottie、3D、light leaks、9:16 自动重排、视频内小尘人物层。

## Scene Directions

### S01 Hook Shot / Pain Scene

- sceneId: S01
- scenePattern: hook-cover
- visualGoal: 用第一人称误判建立真实复盘入口。
- firstFocus: `我一开始以为`
- layoutRatio: 主标题区域占画面中心 60%-72%，副标题弱化。
- typography: 主标题按 cover 现有字号；副标题不超过主标题权重。
- chineseTextRules: 两行文案都必须独立成句，避免单字孤行。
- motionRhythm: title -> subtitle；当前 renderer 只按 cover 能力表达，不声明句内高级分层。
- mobileScaledQA: 0.5 秒内能读出“我误判了”。
- forbidden: 抽象标题、复杂截图、课程开场语。

### S02 Mistake Shot

- sceneId: S02
- scenePattern: mistake-two-column
- visualGoal: 让观众看见错误问法和抽象结果。
- firstFocus: 左侧直接问法。
- layoutRatio: 左右两栏各约 38%-40%，中间留 4%-6%。
- typography: 栏标题清楚，正文每栏最多 3 项。
- chineseTextRules: 每项短句，不写长段落。
- motionRhythm: 左栏先出现，右栏后出现，最后形成“问法太空 -> 回答太泛”。
- mobileScaledQA: 不读小字也能看懂左错右泛。
- forbidden: 提前讲模板、左右无差异、普通信息卡堆叠。

### S03 Experiment Setup Shot

- sceneId: S03
- scenePattern: process-steps
- visualGoal: 展示同题实验只改了输入变量。
- firstFocus: `同一个问题，只改问法`
- layoutRatio: 步骤主体占画面宽度 72%-85%。
- typography: 步骤文字按 process-steps 现有能力呈现，优先保证手机端可读。
- chineseTextRules: 步骤不超过 8 字，保持动宾结构。
- motionRhythm: 补背景 -> 说目标 -> 加限制。理想画面是 prompt 卡逐步补全，但本轮 draft 只使用步骤逐条展示。
- mobileScaledQA: 三个变量一眼可辨认。
- forbidden: 直接给结论、普通方法页、把 prompt morph 写成已支持能力。

### S04 Evidence Shot

- sceneId: S04
- scenePattern: comparison-evidence
- visualGoal: 证明同一问题因为输入变量不同而结果改变。
- firstFocus: 顶部结论和左右变量标签。
- layoutRatio: 左右证据卡各 38%-40%；截图是主体，不让 caption 压过截图。
- typography: 标题和 caption 克制；caption 最多 2 行。
- chineseTextRules: 左右 caption 都写成结果判断，不写完整解释段。
- motionRhythm: 左证据 -> 右证据 -> caption 收束。高亮坐标需要人工 inspect 后再写入正式 videoSpec。
- mobileScaledQA: 不读截图小字也能知道“直接问抽象、补背景具体”。
- forbidden: 截图当装饰、未确认坐标就写死 HighlightBox、caption 比截图更抢眼。

### S05 Insight Shot

- sceneId: S05
- scenePattern: big-quote-insight
- visualGoal: 在证据之后钉住核心判断。
- firstFocus: `AI 没变`
- layoutRatio: 主句居中，占画面视觉中心。
- typography: big-quote 主句短、大、强。
- chineseTextRules: 两行语义完整，不能拆出单字尾行。
- motionRhythm: 主句 -> 副句；作为低密度消化页。
- mobileScaledQA: 1 秒内读懂结论。
- forbidden: 提前出现、长段观点、重复 S04 caption。

### S06 Transfer Shot

- sceneId: S06
- scenePattern: three-column-transfer
- visualGoal: 证明规律能迁移到写作和技术学习。
- firstFocus: 写文章场景。
- layoutRatio: 三栏等宽，但每栏只承担一个具体场景。
- typography: 栏标题短，正文每栏 1 句。
- chineseTextRules: 避免只写名词，必须说明适用原因。
- motionRhythm: 写文章 -> 学 TCP -> 共同规律。
- mobileScaledQA: 三栏在手机缩放后仍能读出每栏作用。
- forbidden: 抽象概念堆叠、没有适用理由、把迁移说成万能。

### S07 Template Shot

- sceneId: S07
- scenePattern: todo-checklist-template
- visualGoal: 产出可截图保存的 prompt 模板。
- firstFocus: 模板卡主体。
- layoutRatio: 模板容器居中，占画面宽度约 70%-85%。
- typography: 每项要像可填空句，不是普通 bullet。
- chineseTextRules: 保持“三步上下文 + 一个输出要求”的结构。
- motionRhythm: 四行逐个出现，形成工具卡。
- mobileScaledQA: 不听口播也知道怎么照着问。
- forbidden: 普通 checklist、抽象名词、缺少输出要求。

### S08 CTA Shot / Next Hook

- sceneId: S08
- scenePattern: cta-next-hook
- visualGoal: 收束本集，并引出规则执行篇。
- firstFocus: `让 AI 理解你之后`
- layoutRatio: 主标题占中心，按钮或 actionText 作为次级动作。
- typography: CTA 标题要短，不压成营销海报。
- chineseTextRules: 上下两句分别承接“本集收益”和“下一步”。
- motionRhythm: 收益复述 -> 下一篇钩子。
- mobileScaledQA: 结尾能明确知道下一集方向。
- forbidden: 只说点赞关注、重复 S07、承诺未落地视觉能力。
