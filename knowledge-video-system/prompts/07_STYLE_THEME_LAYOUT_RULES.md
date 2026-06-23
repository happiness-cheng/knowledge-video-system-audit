# 风格、主题、布局规则

本文件的视觉规则依据 `13_REFERENCE_BASIS_AND_BEST_PRACTICES.md` 中的认知负荷、多媒体学习、加工流畅性和 Remotion 官方实践。07 负责把这些依据转成可执行的主题、布局、字号、截图和手机端规则。

## 与 14 Visual Design System 的关系

07 负责当前系统的能力边界和实现状态：

- 主题列表和当前可用 scene type
- Knowledge Lab 触发条件
- 截图能力边界（HighlightBox、assetLayout）
- Sequence 当前实现状态

14_VISUAL_DESIGN_SYSTEM_V1_ALPHA.md 负责作品级视觉系统目标：

- 字体 token（Typography System）
- 中文换行规则（Chinese Text Layout Rules）
- 布局比例（Layout Ratio Rules）
- Scene Pattern Library
- Motion Rules
- Visual QA Checklist

07 中有具体字号建议值（主标题 96-104px、金句 92-108px、副标题 30-36px、卡片正文 30-34px、标签 22-26px）和字号下限（正文 28px、卡片 26px、标签 18px）。这些是当前实现经验值。

14 中有新的作品级目标字号（Display XL 148-176px、Display L 120-148px、Heading L 96-116px、Body L 72-84px 等）。这些是下一轮视觉系统升级目标。

两者存在版本差异：14 的字号普遍比 07 的经验值大 1.5-3 倍。这不是冲突，而是从"能用"到"作品级"的升级路径。

处理方式：

- 07 保留当前实现经验值，作为能力边界参考。
- 14 作为下一轮视觉系统升级目标。
- 实际实现需通过预览校准，不得直接把 14 的建议当成已实现能力。
- 不得因为 14 存在就绕过当前渲染能力边界。

## 可用主题与生产优先级（8 个）

封面 theme 可以半独立于视频 theme：视频 theme 负责观看体验一致性，封面 theme 负责点击决策一致性。独立选择时不能破坏品牌一致性和内容承诺。详见 `09`。

主题状态以 `src/video-system/visual/capabilityRegistry.ts` 为准。新语义组件不要求首发适配全部 8 个主题。

### 主生产主题

**xhs-white-editorial（白底杂志风）**：白底、渐变重点色、大圆角卡片、干净留白。适合观点型、内容型短视频。

**knowledge-blueprint（知识架构蓝图）**：奶油纸底、铁锈红强调、建筑蓝图网格、黑色粗边框。适合知识体系和项目拆解。

### 专题生产主题

| theme ID                 | 名称          | 风格                          | 使用边界 |
| ------------------------ | ------------- | ----------------------------- | -------- |
| testing-safety-alert     | 测试安全警示  | 白底、红/琥珀警示色、条纹装饰 | Bug、风险、验证、安全边界 |
| obsidian-claude-gradient | Obsidian 渐变 | 深紫暗底、GitHub 风格渐变卡   | 深色技术感、代码和 Agent 主题 |

### Legacy / 辅助主题

这些主题保留，但不作为新 semantic shot 首发适配目标：

| theme ID                 | 名称          | 风格                          |
| ------------------------ | ------------- | ----------------------------- |
| minimal-white            | 极简白        | 纯白底、黑色强调、克制高级    |
| neo-brutalism            | 新野蛮主义    | 厚描边、硬阴影、明黄强调      |
| aurora                   | 极光          | 深色底、三色极光光晕          |
| xhs-pastel-card          | 小红书粉彩卡  | 暖米底、马卡龙色块、衬线字体  |

不要因为 legacy theme 存在，就要求每个新语义镜头同时适配全部主题。优先把主生产主题跑通，再按真实视频需要扩展专题主题。

## 已解锁高表达力布局

当前无 locked candidate 布局。`code`、`diff`、`terminal`、`image-hero`、`gantt` 已解锁，但只能用于各自边界内的画面：短代码逐行讲解、短前后变化、短命令结果、一张主图讲解、轻量执行链路。

当前系统不再把所有 scene 当成同等级镜头。`cover / bullets / big-quote / title-subtitle / three-column` 等旧页面型 scene 属于 `legacy-support`，可以做 supporting shot，但不能替代核心视觉解释。核心解释优先选择 `production-validated` 的 semantic shot pattern，例如 `fragment-to-manual` 和 `detour-vs-direct-path`。

`gantt` 适合计划、并行任务、执行链路、阻塞点和人工确认点；如果只是顺序步骤，用 process-steps；如果只是历史先后，用 timeline；如果只是路线目标，用 roadmap。

选择这些高表达力布局时，先判断“知识动作”：

| 知识动作 | 推荐布局 | 不要误用为 |
| --- | --- | --- |
| 文件 / 配置 / prompt 的结构逐行被理解 | `code` | 长文章阅读器、IDE、diff、terminal |
| 旧写法到新写法、错误到正确 | `diff` | 真实 Git diff、长代码审查 |
| 命令运行、测试结果、构建状态 | `terminal` | 长日志、交互式终端、敏感信息展示 |
| 真实界面、截图、生成图或复杂隐喻图中有关键局部 | `image-hero` | 长图滚动、任意标注编辑器、交互式界面 |
| 执行链路、并行任务、阻塞和确认点 | `gantt` | 真实项目管理甘特图、精确日期排期 |

`image-hero` 支持三类受控标注：

- `box`：框出明确对象，框只比对象边界大一点。
- `arrow`：从解释标签指向明确目标区域。
- `magnify`：放大真正需要细看的单点局部，例如字段、按钮、书封文字、截图状态。

如果只是普通观点，没有关键图像或局部对象，不要为了“看起来高级”硬用 `image-hero`。

## 知识实验台呈现法

把抽象观点转化为可观察的过程，通过错误现场、变量改变、前后对比、结论提炼和方法模板，让观众看到观点是如何成立的。

它不是固定视觉主题，可以适配多个主题；当前 P1 已实现触发的主题是 xhs-white-editorial 和 knowledge-blueprint。其他主题暂不触发 lab 变体。

5 类推荐呈现模块：痛点放大页、错误现场页、对照实验页、方法模板页、阶段钉子页。详见 `03`。

## Knowledge Lab P1 视觉规则

## P0 中文排版与手机端 QA 规则

- 标题、副标题、caption、按钮和大结论必须使用中文语义安全断行。
- 不得出现“像拆 / 家”“缺 / 少管理”这类断词；不得出现标点孤行、单字孤行或英文单词内部断行。
- 封面和 S01 主标题必须预留 descender 安全空间，使用足够 line-height、overflow visible 和底部 padding，避免 `Bug` 的 `g` 被裁切。
- `mobile_scaled_contact_sheet` 只是 QA 产物：完整 16:9 原画面等比缩小放入手机信息流模拟画布，不是 9:16 视频，不触发竖屏重排。
- 字幕审片必须优先看 `contact_sheet_with_subtitles.jpg`；无字幕版本只作为画面结构对照。

## Knowledge Lab P1 视觉规则

### lab-hook：痛点放大页

触发：`cover` + `visualRole=hook`

- 主标题必须一眼读顺。
- 不为了放大而破坏语义断行。
- 默认使用 fade-in 或 slide-up。慎用 slow-zoom；大标题持续放大会产生压迫感。
- 副标题弱化，不和主标题抢视觉中心。

### lab-mistake：错误现场页

触发：`two-column` + `visualRole=conflict`

- 左侧表现为用户提问框。
- 右侧表现为 AI 回答框。
- 左侧内容短，右侧可以展示回答开头。
- 必须让观众看出：问法太宽 → 回答太泛。
- 不要只是普通左右信息卡片。

### lab-evidence：对照实验页

触发：`comparison` + `visualRole=evidence`

- 必须有明确大结论，如"补背景后，回答变具体了"。
- 左右两侧表达变量改变前后。
- 如果有 `assetLayout`，优先展示截图证据。
- 截图不承担主要阅读任务，只提供证据感。
- 标签和 caption 要让观众不读截图也能理解差异。

### lab-insight：阶段钉子页

触发：`big-quote` + `visualRole=insight` 或 `recap`

- 用一句话钉住结论。
- 允许纯文字，但必须短、大、强。
- 核心结论行视觉权重最高。
- 默认 fade-in。

### lab-template：方法模板页

触发：`todo-checklist` + `visualRole=template`

- 应像可截图保存的模板，而不是普通清单。
- 优先使用填空结构：
  - 我现在是：\_\_\_\_
  - 我想要：\_\_\_\_
  - 限制条件是：\_\_\_\_
  - 请你按：\_\_\_\_ 输出
- 卡片主体居中，字号足够大。

**模板页等权规则**：

- 多项模板默认等权展示（相同字号、字重、颜色、badge 样式）
- 最终状态必须稳定可截图，像一张完整的模板卡
- 不得残留单项 cue 高亮（"当前" chip、色条、背景 tint 差异）
- 不得让 progressive-retain 导致第一项长期更亮
- 模板页重点是保存价值，不是注意力调度

## 白底 Spotlight 规则

白底主题（如 xhs-white-editorial）下，active 状态不得只靠 opacity 区分。白底本身很亮，opacity 0.5 vs 1.0 差异不够明显。

active 状态至少使用以下多信号组合：

| 信号       | active           | inactive           |
| ---------- | ---------------- | ------------------ |
| 背景 tint  | 13% accent 色    | 无                 |
| 左侧色条   | 10px, opacity 1  | 无                 |
| 边框       | 2.5px, accent 色 | 1.5px, 极弱        |
| 阴影       | 8px 32px         | 几乎无             |
| scale      | 1.018            | 0.985              |
| translateY | -8px             | 0                  |
| 标题文字   | accent 色, 100%  | secondaryText, 50% |

适用场景：`visualRole: "conflict"` + `mode: "strict-switch"` 的左右卡片切换。不适用于模板页（模板页不需要 spotlight）。

## 可用场景类型

| type            | 用途        | 动画                                  |
| --------------- | ----------- | ------------------------------------- |
| cover           | 封面        | fade-in, slow-zoom, slide-up          |
| big-quote       | 大引言      | fade-in                               |
| title-subtitle  | 标题+副标题 | fade-in, slow-zoom, slide-up          |
| bullets         | 要点列表    | slide-up, progressive-reveal          |
| comparison      | 左右对比    | fade-in, progressive-reveal           |
| two-column      | 双栏并列    | fade-in, progressive-reveal           |
| three-column    | 三栏并列    | progressive-reveal                    |
| pros-cons       | 该做/不该做 | fade-in, progressive-reveal           |
| todo-checklist  | 行动清单    | progressive-reveal                    |
| stat-highlight  | 数据高亮    | slow-zoom                             |
| process-steps   | 步骤流程    | progressive-reveal, highlight-current |
| flow-diagram    | 流程图      | progressive-reveal, highlight-current |
| roadmap         | 路线图      | progressive-reveal, highlight-current |
| timeline        | 时间线      | progressive-reveal, highlight-current |
| mindmap         | 思维导图    | progressive-reveal, highlight-current |
| section-divider | 章节分隔    | fade-in                               |
| cta             | 行动号召    | fade-in                               |
| code            | 代码/配置/文档步骤逐行讲解 | highlight-current, progressive-reveal |
| diff            | 前后变化解释 | highlight-current, progressive-reveal |
| terminal        | 命令/测试/执行结果 | highlight-current, progressive-reveal |
| image-hero      | 大图/截图/生成图讲解 | highlight-current, progressive-reveal |
| gantt           | 执行链路/并行/阻塞点 | highlight-current, progressive-reveal |

## 16:9 手机端优化规则

视频本体默认 16:9 横版。不默认生成 9:16 竖屏重排版。9:16 仅作为未来实验能力。

16:9 视频在手机竖屏信息流中会被缩小观看。优化目标是让画面在缩放后仍然清晰、舒适、主体突出。

系统目标：做 16:9 的手机端优化知识视频——画面主体够大，视觉中心明确，截图不靠细读，方法页值得收藏，观众不用费力找重点。

### 字号建议（1920×1080 源文件）

| 元素          | 建议字号 | 说明                |
| ------------- | -------- | ------------------- |
| 主标题        | 96-104px | 手机端需要更"顶脸"  |
| 金句/阶段钉子 | 92-108px | 突出关键结论        |
| 副标题        | 30-36px  | 至少是标题的 0.3 倍 |
| 卡片正文      | 30-34px  | 手机端最小可读      |
| 标签          | 22-26px  | 不能太小            |

具体数值根据 Remotion 主题实测微调。关键是手机竖屏实际预览时，3 秒内能看懂这一页重点。

### 组件放大

卡片、流程节点、对比框、截图容器都要更大：

- 画面主体占比提高（减少无效留白）
- 四周留白减少
- 核心卡片更集中
- 不要为高级感留太多白

### 截图标签化

截图页不要让观众读截图。正确结构是：

- 大标签（这页在证明什么）
- 大结论（核心判断）
- 截图作为证据（缩小，提供视觉证据感）

截图文字看不清没关系，但观众必须一眼看懂"这两张图在证明什么"。

### 字幕安全区

- 主体不要太靠底部，给字幕留空间
- 关键结论不要被字幕盖住
- 截图页的标签不要贴边

### 唯一视觉中心

每个 scene 必须有唯一视觉中心。观众 3 秒内必须知道这一页的重点是什么。

不要让观众在标题、截图、标签、字幕之间来回猜关系。

### 减少小而散的装饰

品牌、标签、进度条可以保留，但不要分散注意力。手机端真正重要的是：

- 标题
- 核心卡片
- 截图标签
- 方法步骤
- 字幕

## 字号下限（16:9）

| 元素      | 最小字号 |
| --------- | -------- |
| 正文      | 28px     |
| 卡片说明  | 26px     |
| 标签/页脚 | 18px     |
| 代码块    | 22px     |

## 手机端视觉规则

视频最终在手机竖屏信息流中观看。横屏 16:9 画面缩到竖屏后，主体会变小。
桌面端排版美感不等于手机端观看舒适度。

### 主体优先

- 关键文字和卡片优先放大
- 减少无效留白，让主体占画面更大比例
- 大标题要更"顶脸"：字号更大、行距更紧、关键词更突出

### 截图标签化

- 截图页优先标签化、结论化
- 截图只承担"证据感"，不承担主要阅读任务
- 截图必须配大标签和大结论

### 避免大面积无效留白

- 留白不能导致主体显小
- 不要像演示文稿那样居中留很多白
- 手机端优先看主体大小，不只看桌面端排版美感

## 信息密度

- 每页最多 3 个核心信息点
- 禁止一页同时使用三栏 + 长段落 + 代码块
- 每页只允许一个主要动画
- 内容放不下时必须拆页
- 画面变化服务理解，不为凑 scene 数制造无意义切换
- 连续 20-40 秒至少出现一种信息增量：新证据、新反差、新结论、新方法或新应用

## 画面呈现节奏

不要把 scene 当作 PPT 页面。要把 scene 当作一段信息呈现。

### 核心原则

1. **信息跟随口播逐步呈现**：观众应该先看到问题，再看到证据，最后看到结论。不要一上来就展示全部内容。
2. **避免连续静态页**：连续 2 个以上 title-subtitle、big-quote、bullets 时，必须插入结构型页面或章节分隔。
3. **控制静态页占比**：静态展示类 scene（title-subtitle、big-quote、bullets）占比不应超过 40%。comparison 在使用 progressive-reveal 或 lab-evidence 时不算静态页。
4. **每个 scene 要有信息增量**：这一页和上一页相比，观众能获得什么新信息？

### 静态展示类型

以下类型信息一次性摊开，不跟随口播逐步呈现：

- `title-subtitle`：标题 + 副标题
- `big-quote`：大引言
- `bullets`：要点列表（当 animation=fade-in 时）
- `comparison`：左右对比（当 animation=fade-in 且无内部逐步出现时；使用 progressive-reveal 或 lab-evidence 时不算静态页）

### 结构型页面

以下类型支持逐步揭示，信息跟随口播出现：

- `process-steps`：步骤流程
- `flow-diagram`：流程图
- `roadmap`：路线图
- `timeline`：时间线
- `mindmap`：思维导图
- `todo-checklist`：行动清单

在 Knowledge Lab P1 中，`comparison + visualRole=evidence`、`two-column + visualRole=conflict` 也属于结构型/动态信息页，不算静态展示。

### 动画选择

| 场景类型       | 推荐动画                              | 避免动画 |
| -------------- | ------------------------------------- | -------- |
| title-subtitle | fade-in, slow-zoom, slide-up          | -        |
| big-quote      | fade-in（金句页可以例外）             | -        |
| bullets        | progressive-reveal                    | fade-in  |
| comparison     | progressive-reveal                    | fade-in  |
| process-steps  | progressive-reveal, highlight-current | fade-in  |
| todo-checklist | progressive-reveal                    | fade-in  |

### 信息密度分类

把 scene 按信息密度分为三类：

**高密度 scene**（案例、方法、模板、多信息点解释）：

- comparison, two-column, process-steps, flow-diagram, todo-checklist, bullets

**中密度 scene**（承上启下、背景设定、迁移场景）：

- title-subtitle, bullets, roadmap

**低密度 scene**（阶段小结、节奏缓冲、关键结论突出）：

- big-quote, section-divider, cta

高密度和低密度要交替使用。判断标准是观众是否需要消化、是否出现章节转折、是否有关键结论需要突出。

### scene 内部节奏

长视频 scene 可以比短视频更长，但不能长期静止。

如果一个 scene 超过 12 秒，应优先满足至少一项：

- 使用 `progressive-reveal` 让信息分批出现
- 使用 `highlight-current` 强调当前步骤
- 让左右对比按先左后右出现
- 让步骤、清单或节点逐个出现
- 在 voiceover 中有明确转折、停顿或总结

### 节奏优化原则

节奏优化不是堆更多信息，而是让关键信息更清楚、更容易消化、更值得收藏。

视觉变化不等于新增知识点。
关键结论必须有独立 scene 呈现（big-quote 或 title-subtitle），不要埋在高密度 scene 里。
方法和模板必须有收藏价值，观众看完能照做。

### PPT 化检查清单

生成 videoSpec 后，用以下清单自查：

1. 是否连续 2+ 个 scene 类型相同？
2. 是否连续 2+ 个 scene 都是静态展示类型？
3. 静态展示类 scene 占比是否超过 40%？
4. 是否有无收束价值、无信息增量的静态展示页使用 fade-in？（big-quote、section-divider、cta 可以使用 fade-in，但不能连续堆叠、不能过长、不能只重复上一页）
5. 是否有结构型页面（process-steps、flow-diagram 等）？
6. 超过 12 秒的 scene 是否有内部信息变化？

## 章节与小结

- `chapterId` 是策划字段，不会自动显示章节标题。
- 短视频可以只用 `chapterId` 分组，不需要机械插入章节页。
- 中长视频在明确认知转折时，可以使用现有 `section-divider`。
- 阶段小结可以使用 `big-quote`、`title-subtitle` 或 `section-divider`。
- 小结必须压缩前一阶段的关键判断，不能只是重复上一页文案。

## 人感与人物

- 人感优先，不强制真人出镜，也不强制视频内出现小尘。
- `humanPresence` 只描述第一人称经历、个人判断、用户场景或行动指导，不是视觉人物配置。
- 当前视频 scene 没有统一的小尘人物层，不得生成无法渲染的人物字段。
- 小尘当前主要用于封面。抽象痛点和系列内容优先考虑小尘；工具清单、结构总结和数据观点可以使用纯文字或卡片封面。

## 截图能力边界

当前可以：

- 用 `comparison` 做左右截图对比。
- 用 `two-column` 做左右信息并列（同样支持 assetLayout）。
- 使用事先裁剪好的重点截图。
- 使用现有标签和说明文字。
- 使用安全截图高亮框（HighlightBox）标注截图重点区域。

当前不支持 `zoomFrame`、`freeArrowAnnotation`。内部 `Arrow`、`Card`、`KeywordTag` 组件不是面向 videoSpec 的任意截图标注接口。

## HighlightBox 视觉规则

HighlightBox 用于在截图证据上标注重点区域，只在 `comparison` / `two-column` 的 `assetLayout.left/right.highlight` 中使用。

### 结构

```json
{
  "top": 10,
  "left": 5,
  "width": 40,
  "height": 15,
  "color": "#ef4444",
  "label": "关键区域"
}
```

- top/left/width/height 使用百分比 0-100，相对于截图容器。
- color 默认红色 `#ef4444`，可自定义。
- label 可选，显示在框上方。

### 视觉规范

- 边框：2.5px solid，圆角 4px。
- 阴影：外发光（box-shadow）增强可见性。
- 入场动画：fadeSlideIn，多个高亮框交错延迟（每项 delay = index \* 6 帧）。
- 不遮挡截图：pointer-events: none，纯视觉标注。

### 使用原则

- 高亮框只标注截图中的关键区域，不滥用。
- 每张截图建议不超过 2 个高亮框，避免视觉混乱。
- label 文字简短（2-6 个字），不和截图标签（label）重复。
- 高亮框服务于"观众不读截图也能理解重点"的目标。

## Knowledge Lab 主题触发

Knowledge Lab 变体只在以下两个主题下触发：

| theme ID            | 名称         | presentationMode |
| ------------------- | ------------ | ---------------- |
| xhs-white-editorial | 白底杂志风   | knowledge-lab    |
| knowledge-blueprint | 知识架构蓝图 | knowledge-lab    |

其余 6 个主题的 presentationMode 为 default，不会触发 lab 变体样式。即使 type + visualRole 组合匹配，非上述主题也按普通 scene 渲染。

## Sequence 内部时间轴使用场景

Sequence 用于 scene 内部信息分批呈现，以下 scene 已实现 Sequence 内部时间轴：

| scene type     | Sequence 用法                                                         |
| -------------- | --------------------------------------------------------------------- |
| two-column     | 标题 from=0，左栏 from=10，右栏 from=20（lab-mistake）                |
| comparison     | 标题 from=0，结论 from=10，左栏 from=18，右栏 from=26（lab-evidence） |
| todo-checklist | 标题 from=0，清单项逐个 from=i\*15                                    |
| bullets        | 标题 from=0，要点卡片逐个 from=i\*15                                  |
| process-steps  | 标题 from=0，步骤节点逐个 from=i\*15（progressive 模式）              |
| big-quote      | 引言 from=0，副标题 from=12                                           |

使用场景：

- 需要信息跟随口播逐步呈现时，使用 Sequence 分批出现。
- 超过 12 秒的 scene 必须有内部信息变化，Sequence 是主要手段之一。
- Sequence 内子组件必须调用 useCurrentFrame() 获取帧数（Sequence 内帧从 0 开始）。

## 模板能力边界

- 当前可以使用 `todo-checklist`、`process-steps`、`bullets` 表达模板、清单和行动步骤。
- `PromptTemplateCard` 已实现，但不是新的 scene type，只作为 `todo-checklist + visualRole=template` 的内部渲染组件使用。
- 仍然待开发的是：通用文档模板卡、编辑器卡、prompt 编辑器界面，以及把 `PromptTemplateCard` 作为独立 scene type 使用。
- 不得为了表达普通模板而滥用 `code` 或 `terminal`。只有当“文件结构 / prompt 片段 / 命令结果本身就是知识对象”时，才使用 `code` 或 `terminal`；否则仍优先使用 `todo-checklist + visualRole=template`、`process-steps` 或 `bullets`。

## 同步字幕

知识视频默认必须生成口播同步字幕：

- 口播说什么，字幕显示什么。
- 可以按自然停顿断句，不能改写成摘要。
- 每屏最多两行。
- 字幕必须避开画面主体和关键数据。
- 字幕字号和对比度必须适合手机端阅读。
- 输出 `subtitles.json`。
- 最终渲染保留原视频，并另行输出带字幕版本，不覆盖原文件。
- 具体生成规则以 `12_SPOKEN_TEXT_TO_SUBTITLES.md` 为准，沿用现有 `generate-subtitles.ts` 和 `SubtitleOverlay`。

字幕完整属于发布硬门槛，不能由其他包装得分抵消。

## 音频规则

- voiceover：给人看的口播原文
- spokenText：真正喂给 TTS 的文本，要自然口语化
- deliveryHint：审稿备注，代码层忽略
- 屏幕可以写 AI，嘴里不一定读 AI
- 英文词（AI、Token、Bug、prompt 等）直接保留，TTS 系统自动处理发音
- TTS、CTA 等用中文替代（文字转语音、行动号召）
- 每个 scene 单独生成音频
- 如果 TTS provider 支持 SSML（如 Azure），可用 `<lang xml:lang="en-US">` 包裹需要英文发音的词
- 如果使用 Edge TTS，优先通过 spokenText 改写解决，不强依赖 SSML

## 背景系统

- 左上角：场景进度（玻璃质感卡片）
- 右上角：品牌头像 + 名称
- 进度条：badges 下方，跟着当前场景走
- 背景层：极浅光晕或网格，不抢内容

## 动画策略

普通观点页（cover, big-quote, title-subtitle, bullets, cta）：

- fade-in
- slow-zoom
- slide-up

结构型页面（flow-diagram, process-steps, roadmap, timeline, mindmap）：

- progressive-reveal（逐个出现）
- highlight-current（当前高亮，其他弱可见）

弱可见性三层：

- 当前节点：1.0
- 相邻节点：0.65
- 其他节点：0.4
