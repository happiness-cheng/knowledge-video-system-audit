# 知识视频 Visual Design System v1-alpha

版本：v1-alpha  
适用项目：世间一点尘｜文章转知识视频 Remotion 系统  
适用对象：网页版 ChatGPT、Agent、Remotion 渲染层、审片流程  
当前目标：把视频系统从“组件能出现”升级为“画面能成立”  
默认输出：16:9 横版，mobile-optimized landscape  
核心原则：作品级视觉优先，不以工程通过代替视觉通过

---

## 0. 文档定位

本文件不是视频文案规范，也不是 videoSpec schema。

它定义的是：

1. 什么样的知识视频画面算成立。
2. 什么样的字号、布局、截图、动效更适合手机端观看。
3. Agent 实现 Remotion 组件时应该遵守哪些视觉规则。
4. 审片时如何判断“组件出现”之外的视觉质量。

本文件用于指导：

- videoSpec 之后的 visualDirectionSpec
- Remotion 组件实现
- theme token / layout token / motion token 设计
- preview 审片
- visual QA
- Agent Handoff Package

本文件不直接新增 videoSpec 字段。  
任何未在当前仓库实现的能力，只能作为 implementation note 或 backlog。

---

## 1. 核心判断

当前系统的问题不是缺少更多 scene type，而是缺少一套稳定的视觉操作系统。

过去失败的根因是：

```text
组件能出现，但画面不一定成立。
字段能生效，但作品不一定可发布。
TypeScript 通过，但视觉可能仍然失败。
```

因此后续必须区分三层验收：

```text
工程验收：能不能跑，有没有报错，字段有没有生效。
视觉验收：画面是否成立，手机端是否清楚，是否不像 PPT。
发布验收：这条视频是否值得代表账号发布。
```

本系统的视觉目标不是电影感，也不是炫技。

目标是：

```text
清楚
可信
有获得感
手机端好读
有截图保存价值
不像自动播放 PPT
```

---

## 2. 全局视觉原则

### 2.0 视觉解释优先原则

知识视频画面不是文章页面，也不是动态 PPT。画面必须承担解释任务。

```text
概念 → 对象
关系 → 空间结构
变化 → 运动
推理 → 动画过程
结论 → 从因果链中浮现
```

每个关键 scene 先回答：

```text
观众应该看见什么？
什么从 A 变成 B？
哪些对象之间建立了关系？
哪个过程正在发生？
如果静音观看，观众能否理解主要变化？
```

文字只负责标签、导航、局部解释和结论锚点。若画面只剩文字和卡片，说明视觉解释没有成立。

---

### 2.1 手机端优先原则

虽然视频本体是 16:9 横版，但主要观看场景是手机竖屏信息流。

因此所有画面不能只按 1920×1080 原画布判断。

必须按：

```text
1920×1080 原画布
↓
手机竖屏信息流缩小观看
↓
仍然能一眼看清
```

来设计。

`mobile_scaled_contact_sheet` 是手机端 QA 产物，不是 9:16 输出。它必须保留完整 16:9 横版画面，等比缩小后放入手机信息流模拟画布；不得裁切左右内容，不得触发 scene 竖屏布局。

原则：

- 电脑端看着清楚，不代表手机端清楚。
- 电脑端看着高级的留白，手机端可能变成“太空”。
- 电脑端刚好能读的小字，手机端通常已经吃力。
- 字号和主体占比必须按手机端投影效果反推。

---

### 2.2 可扫读原则

知识视频画面不是文章页面。

每个 scene 必须让用户在 1 秒内知道：

```text
这一页讲什么？
我应该先看哪里？
这一页和上一页有什么关系？
```

每页只允许一个主要视觉中心。

不允许：

- 标题、截图、卡片、标签平均重要。
- 观众需要自己找重点。
- 一页塞太多平级模块。
- 让截图或小字承担主要理解任务。

---

### 2.2.1 关键对象出现原则

当口播提到 A 时，不能默认只放一个写着 A 的卡片。先判断 A 的类型和认知职责。

| A 的类型 | 视觉处理 | 位置原则 | 尺寸原则 |
| --- | --- | --- | --- |
| entity | 变成可见对象 | 靠近相关动作或因果路径 | 关键实体用 L1/L2 |
| state | 用颜色、清晰度、形状、稳定性表达 | 贴近承载该状态的对象 | 状态差异必须可见 |
| relation | 用连接线、路径、距离、包含关系表达 | 放在相关对象之间 | 不能比被连接对象更抢 |
| process | 用连续运动、阶段推进、路径绘制表达 | 放在 transformation 区 | 当前阶段最大、旧阶段降调 |
| evidence | 用证据本体 + 标签 + 结论层表达 | 证据与结论保持接近 | 截图不承担主要阅读 |
| label | 贴近被标注对象 | 不离开对象漂浮 | L2/L3，不能抢主视觉 |
| conclusion | 从前面因果链中浮现 | 靠近输出结果或因果终点 | L1，但不硬切孤立大字 |

关键问题：

```text
A 为什么出现？
A 出现在输入区、变化区、输出区、中心区还是边缘？
A 出现后，画面中什么发生变化？
A 的出现帮助观众理解什么？
如果没有 A，观众是否还能理解？
```

---

### 2.3 主体优先原则

横版知识视频在手机端会被缩小，因此主体不能太小。

默认规则：

```text
主工作区宽度：72%–84%
主工作区高度：68%–82%
单主体内容块面积：不少于画面面积 35%
页面外边距：宽 6%–8%，高 7%–10%
单页等权模块数：不超过 4 个
```

这里的比例不是绝对真理，而是项目默认标准。

判断标准：

```text
留白必须服务聚焦。
留白不能只是为了显得高级。
```

---

### 2.4 内容放不下时拆页，不缩小字号

### 2.5 中文语义断行

中文短文本必须按语义断行，而不是按字符硬切。

禁止：

- “像拆 / 家”
- “缺 / 少管理”
- 标点单独成行
- 单字孤行
- 英文词内部断行，例如 `Clau / de`

适用范围至少包括：title、subtitle、caption、button、conclusion。未接入安全断行组件的新文本出口，不能宣称已满足 P0 排版要求。

如果一页信息放不下，优先顺序是：

```text
改写文案
↓
拆成两页
↓
切换 scene pattern
↓
轻微降字号
```

禁止：

```text
为了塞进一页，把所有字缩小。
```

---

### 2.5 工具页必须有保存价值

知识视频里的方法页、模板页、checklist 页，不应该只是“总结”。

它们应该像一张用户可以截图保存的工具卡。

判断标准：

```text
不听口播，只看这一页，用户也知道怎么用。
```

如果不能截图保存，就不是合格模板页。

---

## 3. 字体系统 Typography System

### 3.1 字阶 token

以下字号基于 1920×1080 横版源画布。

| Token | 用途 | 建议字号 | 行高 | 字重 |
|---|---:|---:|---:|---:|
| Display XL | hook 第一击、封面主标题 | 148–176px | 1.02–1.08 | 700–800 |
| Display L | cover / big-quote 主标题 | 120–148px | 1.05–1.10 | 700–750 |
| Heading L | scene title / 对比页总标题 | 96–116px | 1.08–1.14 | 650–750 |
| Heading M | 副标题 / 阶段钉子副句 | 80–96px | 1.10–1.18 | 600–700 |
| Body L | 关键正文 / 核心步骤 | 72–84px | 1.35–1.45 | 500–600 |
| Body M | 次正文 / checklist 项 | 64–72px | 1.38–1.48 | 500–600 |
| Caption L | 强相关 caption / 图解说明 | 56–64px | 1.30–1.40 | 500–600 |
| Label | 标签、chip、变量名 | 48–56px | 1.15–1.25 | 600–700 |
| Meta XS | 时间、来源补充、弱元数据 | 40–48px | 1.10–1.20 | 500–600 |

硬规则：

```text
主要意思文字尽量不低于 Body M。
Caption / Label 可以小，但不能承载核心结论。
任何需要一瞥看懂的句子，不应低于 56px。
Hook 主标题不能低于 Display L。
```

---

### 3.2 按 scene type 的字号规则

| Scene | 主标题 | 正文 / 步骤 | 标签 / caption | 行数上限 |
|---|---:|---:|---:|---:|
| hook / cover | Display XL / Display L | 不建议大段正文 | Label / Caption L | 标题 2 行内 |
| big-quote | Display L | 仅 1 句解释 | Label | 引句 2–3 行 |
| title-subtitle | Heading L | Heading M | Label | 标题 2 行，副标题 2 行 |
| bullets | Heading L | Body L | Label | 每条 1–2 行，全页 3–5 条 |
| comparison | Heading L 或 80–96px | 56–64px | 48–56px | 每栏 caption 2 行 |
| two-column | Heading L | Body M / Body L | 56–64px | 左右各 2–3 层 |
| process-steps | Heading L | Body L | 56–64px | 同屏 3–4 步最稳 |
| checklist / template | Heading L | Body M / Body L | 48–56px | 4–6 项最稳 |
| CTA | 104–128px | 64–72px | 56–64px | 总量 2–3 行 |

---

### 3.3 字号使用红线

禁止：

```text
hook 字号逻辑继承到 comparison。
caption 做得比截图还抢眼。
label 承担结论。
正文小于 56px 仍承担主要信息。
为了塞内容，把核心文字缩小到看不清。
```

正确做法：

```text
hook 可以极大。
comparison 要克制。
template 要清楚。
caption 要解释局部。
label 只负责导航。
```

---

## 4. 中文排版规则 Chinese Text Layout

### 4.1 中文标题字数分档

| 字数 | 首选策略 | 禁止策略 |
|---:|---|---|
| 6–10 字 | 单行优先 | 为了设计感强行拆两行 |
| 11–18 字 | 两行平衡 | 出现 10+1、11+2 尾行 |
| 19–30 字 | 拆成 eyebrow + 主标题，或主标题 + 副标题 | 直接塞成 3 行大标题 |
| 30 字以上 | 必须改写，保留 8–14 字作主标题 | 降字号硬塞 |

标题首先是导航，不是全文摘要。

主标题目标长度：

```text
8–14 个汉字最稳。
```

超过 18 个字时，优先拆层级，而不是继续缩小。

---

### 4.2 中文换行硬规则

禁止：

```text
单字成行
尾行只有 1–2 个汉字
标点单独成行
“的 / 了 / 与 / 和 / 或 / 等 / 及”落在下一行行首
标题超过 2 行仍作为主标题
```

caption 规则：

```text
caption 最多 2 行。
caption 尾行不小于 4 个字更稳。
caption 放不下时，优先缩短文案。
```

---

### 4.3 中文断行优先级

优先在以下位置断行：

```text
完整短语后
动宾结构后
并列结构中间
转折词前后
冒号后
```

尽量保持完整：

```text
名词短语
固定搭配
产品名
术语
引号内短句
括号内容
```

---

### 4.4 降字号策略

当标题放不下时：

```text
第一次缩字：不超过 6%
第二次缩字：累计不超过 10%
仍然不行：切换布局
```

切换布局包括：

```text
单标题 → eyebrow + title
长标题 → title + subtitle
两行标题 → big-quote / statement card
一页解释 → 拆成两页
```

禁止用 tracking 当救命按钮。

中文默认：

```text
letterSpacing: 0
```

标题可轻微收紧：

```text
0 到 -0.01em
```

但不能靠字距硬塞。

---

### 4.5 标题评分函数建议

Agent 应实现标题断行评分。

建议评分项：

```text
行长差异过大
尾行少于 3 字
出现单字行
弱词落在行首
标点单独成行
标题超过 2 行
```

高风险时不继续渲染当前布局，而是切换 scene 内部标题模式。

---

## 5. Layout Ratio Rules

### 5.1 全局布局 token

建议 Remotion 侧建立以下 layout tokens：

```ts
export const layout = {
  pagePadX: 0.07,
  pagePadY: 0.08,
  workZoneW: [0.72, 0.84],
  workZoneH: [0.68, 0.82],
  twoCol: { col: 0.39, gutter: 0.05 },
  screenshot: { mainW: [0.55, 0.72], sideW: [0.24, 0.30] }
};
```

说明：

```text
pagePadX / pagePadY 控制安全区。
workZone 控制主体密度。
twoCol 防止左右栏过窄或过散。
screenshot 保证截图不沦为背景。
```

---

### 5.2 主体占比规则

每个 scene 都要计算：

```text
primaryAreaRatio
```

默认要求：

```text
关键页主体面积 ≥ 35%
hook / template / evidence 主体应更大
普通装饰不能计入主体面积
```

如果主体面积过小，不能通过视觉验收。

---

### 5.3 等权模块数量

同一页同时可见的等权模块不超过 4 个。

超过 4 个时，优先：

```text
progressive reveal
分组
拆页
切换布局
```

禁止：

```text
一页 5–7 个卡片并排等权展示。
```

---

## 6. Scene Pattern Library

### 6.1 Hook / Cover Pattern

目标：

```text
0–2 秒让用户停下来。
```

结构：

```text
一句明确承诺
+
一个强证据 / 强反差视觉
+
一条次级说明
```

建议：

```text
主标题 8–14 字
Display XL / Display L
标题块宽 58%–72%
视觉证据块占 20%–35%
第一帧必须已有主信息
```

禁止：

```text
第一帧空白
只有标题没有物证
视觉很满但不知道讲什么
标题延迟到 1 秒后出现
```

验收：

```text
0s：主标题可见
0.5s：主标题完全可读
2s：用户知道视频主题和痛点
```

---

### 6.2 错误现场 Two-column Pattern

目标：

```text
用户一眼知道左边错，右边改。
```

结构：

```text
顶部：总标题 / 大结论
左栏：错误现场
右栏：正确改法
底部：一句变量说明或差异总结
```

建议：

```text
左栏标签：错误版本 / 常见问法
右栏标签：补背景后 / 改进版本
每栏只放 1 个核心截图或示意
每栏 caption 只说 1 个关键差异
```

比例：

```text
每栏宽 38%–40%
gutter 4%–6%
总标题区高 16%–20%
证据图区高 50%–58%
```

禁止：

```text
左右栏平均但无差异
两边都很大字抢戏
让用户自己猜左错右对
```

---

### 6.3 对照证据 Comparison Pattern

目标：

```text
让差异被看见，而不是把差异解释完。
```

结构：

```text
顶部：这一页证明什么
中部：左右截图 / 证据对比
左右：变量标签
下方：每侧一句 caption
高亮：每侧 1–2 个
```

字号：

```text
总标题：80–96px
栏标题：64–76px
caption：56–64px
变量标签：48–56px
```

硬规则：

```text
caption 最多 2 行。
截图必须是证据页主体。
caption 不能比截图更抢眼。
每侧高亮最多 2 个。
信息超出容量就拆页。
```

失败信号：

```text
标题太大压过截图。
caption 巨大失控。
截图像附属品。
左右变量不清楚。
用户需要读截图小字才能懂。
```

---

### 6.4 Big-quote 阶段钉子 Pattern

目标：

```text
把阶段判断钉进用户脑子。
```

适用：

```text
核心判断
阶段转折
误区总结
方法背后的原则
```

结构：

```text
一句 10–22 字判断句
+
一个小标签
+
一条 8–14 字补充
```

禁止：

```text
励志海报化
重复上一页文案
引句太长
背景抢文字
```

---

### 6.5 Process-steps Pattern

目标：

```text
让用户知道当前讲到哪一步、这一步做什么。
```

推荐结构：

```text
当前步骤主卡
+
前后步骤缩略轨道
```

规则：

```text
当前步骤最大、最亮、最靠前。
前后步骤弱化但保留上下文。
同屏不超过 4 步等权展示。
每步内部写成：输入 → 动作 → 产出。
```

禁止：

```text
5–7 步并排等权。
一排小圆点和细线作为主视觉。
像网页流程组件。
当前步骤不突出。
```

---

### 6.6 Todo-checklist / Template Pattern

目标：

```text
用户截图后可以直接照做。
```

结构：

```text
标题：明确收益
主体：固定骨架
项目：填空位 / 检查项 / 微型例子
底部：保存或使用提示
```

建议：

```text
模板容器占 78%–86% 宽
模板容器占 72%–82% 高
最稳结构：2×3 或 1×5
项目数量：4–6 项
```

每项写法：

```text
动作化
可执行
短句
最好能填空
```

禁止：

```text
普通 bullet 墙
抽象名词堆叠
小表单化
没有保存价值
```

验收：

```text
不听口播，只看这一页，也知道怎么用。
```

---

### 6.7 CTA Pattern

目标：

```text
再次确认收益 + 一个低摩擦动作。
```

结构：

```text
一句收益复述
+
一句明确动作
+
一个动作对象
```

禁止：

```text
营销海报化
三个按钮并列
只说点赞关注
没有明确下一步
```

---

## 7. Screenshot Evidence Page Rules

### 7.1 截图页核心原则

截图页的职责不是让用户读截图。

截图页的职责是：

```text
截图证明这件事真的存在。
外层排版告诉用户该看哪里，以及为什么重要。
```

截图不能承担完整阅读体验。

---

### 7.2 证据页四层结构

| 层级 | 职责 | 必须项 | 不应承担 |
|---|---|---|---|
| 来源锚点 | 说明证据来自哪里 | 产品名、页面类型、时间或状态、source chip | 解释结论 |
| 证据本体 | 证明现象存在 | 截图主体、局部 UI、可信 chrome | 完整阅读 |
| 导向标注 | 告诉用户看哪里 | 高亮框、编号、局部强调 | 大段解释 |
| 结论层 | 说明证据意味着什么 | caption + inference | 复述截图 |

---

### 7.3 推荐布局

布局一：证据主图 + 解释侧栏

```text
左 62%–70%：截图主图
右 24%–30%：claim、source chip、caption
高亮：只圈一个主证据
```

布局二：截图背景 + 局部放大卡

```text
全宽截图做低对比背景
中央叠一个 30%–40% 宽的局部卡
下方一句解释
```

布局三：左右证据对比

```text
顶部：大结论
中部：左右证据
每侧：变量标签 + 截图 + caption
高亮：每侧最多 2 个
```

---

### 7.4 失败信号

截图页失败信号：

```text
截图太小。
没有来源锚点。
高亮太多。
caption 只是“如图所示”。
用户必须读截图小字才能理解。
截图只是背景装饰。
结论没有压住画面。
```

证据感来自三件事同时出现：

```text
来源痕迹
局部高亮
外层明示结论
```

---

## 8. Motion Rules

### 8.1 动效唯一目标

动效的目标不是“看起来像视频”。

动效的目标是：

```text
控制理解顺序。
```

每个动效都必须能回答：

```text
这个动作让观众理解了什么？
```

如果答不上来，它就是装饰，应降级或删除。

---

### 8.1.1 UI 动画与语义动画

必须区分两类动画：

```text
UI 动画：标题淡入、卡片上移、列表逐条出现、按钮轻微 pulse。
语义动画：对象移动、关系建立、路径绘制、状态改变、错误被修正、推理过程展开。
```

UI 动画只能改善呈现顺序，不能自动证明画面在解释知识。

视觉解释型知识视频的关键 scene，必须优先使用语义动画：

- 概念变成对象后，对象要参与变化。
- 关系出现后，要用距离、连接、路径、包含或相对位置表达。
- 变化发生时，要看到前后状态差异。
- 推理推进时，要看到路径、阶段、因果或排除过程。

如果一个 scene 的核心是“散乱到有序”“绕路到直达”“模糊到清晰”“错误到修正”，但实际只做了 fade-in / slide-up / progressive list reveal，它仍然有 PPT 风险。

---

### 8.2 运动语义

| 动效 | 适合表达 | 理解动作 | 不适合 |
| ---- | -------- | -------- | ------ |
| 飞入 | 材料补齐、条件加入、新变量进入系统 | “新材料进入了因果系统” | 普通文字装饰 |
| 淡入 | 背景信息、辅助标签、弱提示 | “这是补充信息，不打断主任务” | 关键因果动作 |
| 路径绘制 | 过程、路线、因果链、推理推进 | “过程正在展开” | 没有起点终点的装饰线 |
| morph / 变形 | 状态转换、结构形成、错误被修正 | “A 正在变成 B” | 单纯炫技变形 |
| 消失 / 漂散 | 噪音减少、错误路径排除、不确定性下降 | “无关信息被移除” | 无意义粒子效果 |
| 发光 / 高亮 | 到达、确认、验证、完成 | “这里是当前重点或结果成立” | 长期抢视觉中心 |
| 逐步展开 | 结构生成、步骤推进、输出成形 | “理解按阶段建立” | 只是列表逐条出现 |

运动选择必须与 `13_REFERENCE_BASIS_AND_BEST_PRACTICES.md` 的理论依据一致：

- 分阶段出现对应 Segmenting Principle。
- 当前重点突出对应 Signaling Principle。
- 删除装饰对应 Coherence Principle。
- 减少视线跳跃对应 Spatial Contiguity。
- 保持唯一视觉中心对应 Cognitive Load。

---

### 8.3 三类动效

#### 进入动效

用于：

```text
标题
主卡
主图
当前步骤卡
```

建议：

```text
200–300ms
30fps 下约 6–9 帧
轻微 opacity / translateY / scale
```

禁止：

```text
标题从完全空白慢慢出现
主信息延迟太久
大幅旋转 / bounce
```

#### 强调动效

用于：

```text
当前步骤
当前高亮
当前差异
当前模板项
```

建议：

```text
轻微放大
亮度提升
边框增强
背景强化
其他元素弱化但保留
```

#### 上下文保留动效

用于：

```text
process-steps
comparison
two-column
checklist
```

规则：

```text
当前信息突出。
旧信息降调但不消失。
用户始终知道自己处在结构的哪一部分。
```

---

### 8.4 Progressive Reveal 红线

禁止：

```text
所有元素同样 fade in。
上一信息完全消失导致断上下文。
只为动而动。
中间态布局错位。
当前重点不突出。
```

正确：

```text
当前更亮、更大、更靠前。
前后信息弱化但可见。
最后形成整体收束。
```

---

## 9. Mobile Scaled Viewing Rules

### 9.1 必须生成 mobile_scaled_contact_sheet

Agent 每次输出 preview 时，必须生成：

```text
contact_sheet
mobile_scaled_contact_sheet
```

mobile_scaled_contact_sheet 用于模拟：

```text
16:9 横版在手机竖屏信息流中缩小后的观感。
```

---

### 9.2 手机端验收项目

每个关键 scene 检查：

```text
主标题是否一眼可读？
核心正文是否吃力？
caption 是否还看得清？
截图是否只是证据，而不是阅读任务？
主体是否太小？
画面是否太空？
字幕是否遮挡主体？
```

如果电脑端通过但 mobile_scaled 不通过，判定为不通过。

---

## 10. Remotion Implementation Guidance

### 10.1 四层 token

Agent 应建立四层 token：

```text
Typography tokens
Layout tokens
Scene contracts
Motion tokens
```

---

### 10.2 Typography tokens 示例

```ts
export const typeScale = {
  displayXL: {min: 148, max: 176, lh: 1.05, weight: 750},
  displayL:  {min: 120, max: 148, lh: 1.08, weight: 700},
  headingL:  {min: 96,  max: 116, lh: 1.12, weight: 700},
  headingM:  {min: 80,  max: 96,  lh: 1.16, weight: 650},
  bodyL:     {min: 72,  max: 84,  lh: 1.40, weight: 550},
  bodyM:     {min: 64,  max: 72,  lh: 1.44, weight: 550},
  captionL:  {min: 56,  max: 64,  lh: 1.34, weight: 550},
  label:     {min: 48,  max: 56,  lh: 1.20, weight: 650},
};
```

---

### 10.3 Scene contracts 示例

```ts
type SceneContract = {
  maxEqualWeightBlocks: number;
  minPrimaryAreaRatio: number;
  maxTitleLines: number;
  minProjectedBodyPx: number;
  needsEvidenceAnchor?: boolean;
};
```

每个 scene type 必须有 contract。

示例：

```text
hook:
- maxTitleLines: 2
- minPrimaryAreaRatio: 0.35
- minProjectedBodyPx: 22

comparison:
- maxEqualWeightBlocks: 4
- maxTitleLines: 2
- needsEvidenceAnchor: true

template:
- minPrimaryAreaRatio: 0.45
- mustBeScreenshotSaveable: true
```

---

### 10.3.1 Semantic Motion Primitives

当前导演系统的目标已经超过普通卡片组件。组件系统应逐步增加可复用的语义动画 primitives，而不是为每个选题新增一次性 scene type。

优先 primitives：

| Primitive | 职责 | 可表达的知识动作 |
| --- | --- | --- |
| `MotionObject` | 可移动对象，如便签、文件、电子、节点、标签 | 材料进入、对象聚集、变量加入、角色状态变化 |
| `MotionPath` | 可绘制路径，支持直线、曲线、绕路、分叉 | 因果推进、路线选择、推理路径、错误路径 |
| `TransformStage` | 输入区 → 转换区 → 输出区的三段结构 | 散乱到有序、材料到结果、条件到输出 |
| `SpotlightState` | 当前重点高亮，旧信息降调但保留 | 注意力引导、分阶段理解、上下文保留 |
| `StateMorph` | 状态转换，如模糊到清晰、错误到修正、未读到已读 | 理解变化、判断修正、风险解除 |
| `CorrectionMotion` | 旧判断出现、划掉、灰化，新判断浮现 | 误判反转、概念纠偏 |
| `EdgeConnector` | 对象边缘到对象边缘的关系线 | 因果关系、路径推进、对象连接、标注指向 |

这些 primitives 可以被组合成稳定 scene pattern：

- `fragmentToManual`：碎片 / 便签汇聚成手册或文件。当前已落地为 `flow-diagram + semanticPattern=fragment-to-manual`。
- `detourVsDirectPath`：旧路径绕远，新路径直达。当前已落地为 `comparison + semanticPattern=detour-vs-direct-path`。
- `spotlightCue`：说到哪里，高亮信号就落到哪里。当前已落地为内部组件 `SpotlightCue`，仅在已接入 cue 的 scene 中使用。
- `wrongToCorrectJudgment`：旧判断被修正，新判断从因果链中浮现。当前已落地为 `big-quote + semanticPattern=wrong-to-correct`，不是独立 scene type。
- `stateTransition`：状态从未读、混乱或空白，转到已读、理解或稳定。当前已落地为内部组件 `StateTransition`，不是独立 scene type。
- `mapLightUp`：节点或区域逐步点亮，表示理解范围扩大；并能区分“提醒路线”和“硬拦截边界”。当前已落地为内部组件 `MapLightUp`，不是独立 scene type。
- `pathComparison`：同一目标先绕路、再直达。当前已落地为内部组件 `PathComparison`，正式 videoSpec 仍使用 `comparison + semanticPattern=detour-vs-direct-path`。
- `visualAnnotations`：大图标注、箭头和局部放大。当前已落地为 `image-hero.annotations` / `VisualAnnotations`，不是任意标注编辑器。

实现要求：

- 全部使用 Remotion frame-driven 动画：`useCurrentFrame()`、`interpolate()`、`spring()`、SVG path 动画等。
- 不使用 CSS transition / animation。
- 先做可组合 primitives，再决定是否抽象成正式 scene type。
- 每个 primitive 必须有可测试的最小示例和 mobile_scaled 截图。
- 关系线、路径线、标注箭头必须从对象边缘出发并落到目标边缘。矩形对象优先使用右边中点到左边中点、左边中点到右边中点、上边中点到下边中点或下边中点到上边中点；不得用中心点连线穿过卡片主体。
- `image-hero` 的 `box` / `magnify` 坐标必须先基于关键对象位置和大小判断，框选只比对象略大；箭头应落到目标框边缘或关键对象边缘。
- 白底高亮必须使用多信号组合：背景 tint、色条、边框、阴影、scale、文字色中至少 3 种；不得只靠 opacity。
- 路径对比必须同屏表达“旧路径”和“新路径”的关系，避免拆成两页让观众误以为是重复内容。

能力边界：

- Remotion 可以实现这些动画。
- 已落地的内部组件可以作为 Agent 复用实现线索，但不能自动变成正式 scene type。
- 未落地的 primitives 只能标记为 `needs-component-upgrade`，不能写进正式 videoSpec 当作已支持能力。

---

### 10.4 projectedMobilePx

Agent 应实现手机端投影字号函数：

```ts
function projectedMobilePx(
  sourcePx: number,
  compositionWidth = 1920,
  mobileWidth = 390
) {
  return sourcePx * mobileWidth / compositionWidth;
}
```

使用原则：

```text
不能只看源字号。
必须看投影到手机端后的实际观感。
```

---

### 10.5 chooseType

字体选择不应只是 CSS clamp。

应同时考虑：

```text
token
textLength
availableWidthPx
maxLines
targetMinProjectedPx
lineBreakScore
scene contract
```

优先级：

```text
手机端最小可读性
↓
行数限制
↓
中文断行质量
↓
布局平衡
↓
视觉风格
```

---

### 10.6 visualMetrics.json

Agent 每次渲染应输出 visualMetrics.json。

建议字段：

```json
{
  "sceneId": "S06",
  "sceneType": "comparison",
  "pattern": "evidenceComparison",
  "titleChars": 12,
  "titleLines": 2,
  "titleBreakScore": 4,
  "hasSingleCharLine": false,
  "captionMaxLines": 2,
  "primaryAreaRatio": 0.42,
  "projectedTitlePx": 22,
  "projectedBodyPx": 14,
  "textOverflowRisk": false,
  "mobileReadabilityRisk": false,
  "evidenceAnchorPresent": true,
  "screenshotTooSmall": false,
  "pptRisk": "low"
}
```

---

## 11. Visual QA Checklist

### 11.1 全局 QA

每次 preview 后必须检查：

```text
第一帧是否有信息？
0.5 秒内主标题是否可读？
主体是否足够大？
是否有唯一视觉中心？
是否出现文字裁切？
是否出现单字孤行？
是否出现 caption 过长？
是否像 PPT？
手机端缩放后是否清楚？
```

---

### 11.2 Hook QA

```text
0s 是否不空白？
主标题是否 8–14 字？
是否有清楚承诺？
是否有视觉锚点？
是否 2 秒内知道主题？
```

---

### 11.3 Comparison QA

```text
左右变量是否清楚？
总标题是否说明证明什么？
caption 是否 2 行内？
截图是否是主体？
文字是否压过截图？
是否出现单字孤行？
```

---

### 11.4 Screenshot QA

```text
是否有来源锚点？
是否有证据本体？
是否有导向标注？
是否有结论层？
是否需要读截图小字？
高亮是否超过 2 个？
```

---

### 11.5 Template QA

```text
是否值得截图保存？
不听口播能否照做？
是否有固定骨架？
是否有填空位或动作项？
是否只是 bullet 墙？
```

---

### 11.6 Motion QA

```text
当前重点是否突出？
旧信息是否保留上下文？
动效是否服务理解？
是否只是同样 fade in？
是否有中间态错位？
```

---

## 12. 常见失败类型与修正方向

### 12.1 主体太小

症状：

```text
画面很空
卡片像网页小组件
手机端看不清
```

修正：

```text
增加主体占比
减少外边距
放大卡片和正文
拆除不必要装饰
```

---

### 12.2 字体失控

症状：

```text
caption 比截图更大
comparison 页面压迫
文字挤满画面
标题裁切
```

修正：

```text
按 scene type 设置字号上限
caption 限 2 行
引入 typography clamp
检查 safe area
```

---

### 12.3 中文换行难看

症状：

```text
单字孤行
尾行 1–2 字
标点单独成行
弱词行首
```

修正：

```text
语义断行
轻微降字号
改写标题
切换标题结构
```

---

### 12.4 截图没有证据感

症状：

```text
截图只是摆上去
用户必须读小字
高亮太弱或太多
没有来源锚点
没有外层结论
```

修正：

```text
加 source chip
加 claim
加 1 个主高亮
加 caption + inference
放大截图主体
```

---

### 12.5 像 PPT

症状：

```text
一页太多平级元素
所有元素同样 fade in
标题居中 + 小卡片
缺少视觉焦点
```

修正：

```text
建立唯一视觉中心
当前项高亮
旧项降调
拆页
增加 scene pattern
```

---

## 13. Agent 执行规则

Agent 后续不得只根据“看起来差不多”实现。

必须按以下顺序执行：

```text
读取 Visual Design System
↓
识别 scene pattern
↓
选择 typography token
↓
运行中文断行规则
↓
检查 scene contract
↓
渲染关键帧
↓
生成 contact_sheet
↓
生成 mobile_scaled_contact_sheet
↓
输出 visualMetrics.json
↓
按 Visual QA Checklist 自检
```

---

## 14. 当前优先级

第一阶段不要新增复杂能力，也不要继续围绕旧 PPT scene 做全量美化。

当前优先级是把系统从：

```text
PPT Scene System
```

迁移到：

```text
Semantic Shot System
```

旧 scene 和主题保留为 presentation layer；真正承担核心解释的是对象、状态、关系、过程和 semantic shot pattern。能力状态以 `src/video-system/visual/capabilityRegistry.ts` 为准。

优先实现：

```text
Typography Clamp System
Chinese Title Break System
Scene Contracts
Mobile Scaled Preview
visualMetrics.json
Comparison / Evidence Pattern
Template Pattern
Process Step Focus Pattern
Capability Registry
Semantic Shot Core
```

Semantic Shot Core 第一批：

```text
pressure-build          production-validated
fragment-to-manual      production-validated
detour-vs-direct        production-validated
wrong-to-correct        production-validated
confused-to-guided      production-validated
map-light-up            internal-wired
```

主生产主题先收敛为：

```text
xhs-white-editorial
knowledge-blueprint
```

`testing-safety-alert` 和 `obsidian-claude-gradient` 作为专题生产主题；其他主题暂按 legacy-support 处理。

暂不处理：

```text
9:16 竖屏重排
视频内小尘人物层
data-chart
复杂 3D 动效
新主题
更多封面模板
任意箭头标注系统
任意局部放大系统
```

---

## 15. v1-alpha 结论

这套系统的核心不是让每页更花。

而是让每页更稳。

目标是从：

```text
每次看预览再猜怎么改
```

升级为：

```text
先按规则生成
再用 QA 检查
最后人工审片确认
```

真正要解决的是：

```text
10 个字能排
20 个字能排
30 个字知道要拆
截图知道怎么变证据
模板知道怎么变工具
动画知道怎么服务理解
```

这就是本系统进入作品级生产前必须建立的视觉底座。
