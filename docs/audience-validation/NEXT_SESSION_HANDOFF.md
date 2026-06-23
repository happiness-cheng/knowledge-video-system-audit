> **STATUS: HISTORICAL / REFERENCE ONLY.** Current production rules are in `AGENTS.md`, `SOURCE_OF_TRUTH_MAP.md`, prompts 00/01/17/18, and runtime validators.

# 新会话交接方案：观众驱动的 Remotion 视频系统

## 1. 当前最重要的结论

后续不要继续围绕“PPT scene 怎么更高级”打转，也不要急着重做完整视频。

当前正确方向是：

> 先用 0-4 秒 Shot Lab 验证第一眼视觉诱因，再扩展到前 15 秒、前 60 秒，最后才进入完整视频生产。

视频系统的核心不应该是“画面很好看”，而应该是：

> 画面自己参与讲解，而且第一眼就让目标观众知道：这和我有关，我想继续看。

用户明确指出：人是视觉动物。画面不需要复杂，但必须有强诱因。观众不应该为了理解隐喻付出额外成本。

## 2. 之前做错或偏掉的方向

### 2.1 过度抽象的“项目城市”

之前实现过 `AudienceValidationProjectResetShot`，用“项目城市 / 认知核心 / NEW CHAT 后认知断电”表达 AI 新会话失忆。

问题：

- 创意概念成立，但画面太抽象。
- 用户作为决策人也觉得云里雾里。
- 观众必须先理解隐喻，才能理解视频在讲什么。
- Remotion 更擅长做清晰的动态图形解释，不适合硬做 AI 漫剧式复杂世界观。

结论：

> 不要再把“项目城市”作为主方向。可以保留“路径汇入核心”这种动效能力，但不要作为开场主隐喻。

### 2.2 只研究技术，不先研究人

之前系统升级主要在 prompt、组件、scene 能力上推进，容易陷入“技术上更高级，但观众不一定爱看”。

用户明确纠偏：

> 60% 精力研究人，40% 精力研究技术。

当前已经建立观众研究框架，但真实观众数据仍不足。不能把创作者直觉、平台常识或单个爆款印象写成观众事实。

### 2.3 只看成功样本会有幸存者偏差

用户提醒过：要抓高点赞、高收藏作品，但 GPT 审查指出只看成功样本也会产生幸存者偏差。

正确做法：

- 主样本以高点赞、高收藏为主。
- 仍保留少量表现普通的对照样本。
- 结论必须区分 observed / inferred / hypothesis / validated / rejected。

### 2.4 把“高级动效”当作目标

当前最重要的问题不是炫技，而是：

- 第一帧能不能停住人？
- 0-4 秒能不能无声、无字幕也看懂事件？
- 观众是否觉得“这就是我遇到的问题”？

Remotion 的优势是程序化动效、清晰结构、状态变化、信息层叠、路径/流程/对比，不是复杂角色剧和大世界叙事。

## 3. 当前验证方向：A 方案通过初步验证

当前正在验证的方向是：

> 聊天窗口压迫版：AI Coding 中，每次开新会话，AI 又开始问项目背景、目录职责、验证路线，用户被迫重复解释上下文。

这个方向比“项目城市”更好，因为：

- 一眼能看懂是 AI Coding 场景。
- 痛点真实：上下文丢失、重复解释、AI 不知道项目约束。
- 画面参与讲解：AI 的追问和上下文卡片压入，本身就在讲“为什么需要项目手册 / CLAUDE.md / 知识入口”。
- 不需要观众理解抽象隐喻。

当前实验 Composition：

```text
AudienceValidationRepeatedContextDumpShot
```

主要文件：

```text
src/video-system/experiments/visual-trigger/RepeatedContextDumpShot.tsx
src/video-system/experiments/visual-trigger/repeatedContextDump.constants.ts
src/video-system/experiments/visual-trigger/repeatedContextDump.fixture.ts
src/Root.tsx
```

审片图：

```text
out/audience-validation/repeated-context-dump-shot/contact-sheet.jpg
```

当前用户评分约 75 分。用户认为：

- 明显比项目城市好。
- 抖动没必要，已移除。
- 对话框之前粗糙，已初步打磨。
- 仍有细节需要继续提升。

## 4. 当前实验镜头状态

已经完成：

- 第 0 帧直接出现用户任务：“帮我改登录逻辑”。
- AI 连续追问：
  - “这个项目是做什么的？”
  - “哪个目录能改？”
  - “改完怎么验证？”
- 上下文卡片压入：
  - 项目背景
  - 目录职责
  - 禁区
  - 测试命令
  - 代码风格
- 最后出现：“怎么又要重讲一遍？”
- 已去掉 camera shake / chat window shake。
- 聊天窗口已加入项目侧栏、输入栏、状态提示，质感比第一版更好。

验证结果：

```text
npm run typecheck       PASS
npm run validate:render PASS
```

注意：`remotion still` 会出现大量 webpack cache `Unexpected end of stream` 警告，但目前退出码为 0，图片产物完整。不要误判为渲染失败。

## 5. 接下来应该怎么做

### 5.1 下一步不是重做完整视频

不要马上接入正式 `videoSpec.json`，不要修改 prompts，不要改生产 renderer。

下一步应该继续 Shot Lab：

1. 先把 A 方案从 75 分打磨到 82-85 分。
2. 再做 1-2 个候选 Hook 机制对照。
3. 选出最强的 0-4 秒开场。
4. 再扩展成前 15 秒。
5. 前 15 秒通过后，再做前 60 秒。
6. 前 60 秒成立后，才重做完整视频。

### 5.2 A 方案下一轮打磨重点

围绕一个目标：

> 更像一个真实 AI Coding 工作现场，同时保持一眼能懂的痛点。

建议优先改：

- 上下文卡片不要同时乱抢文字，可以做成更有秩序的“层叠压迫”。
- 保留压迫感，但让主阅读路径更清楚：
  1. 用户请求
  2. AI 追问
  3. 用户被迫补上下文
  4. 情绪落点：“怎么又要重讲一遍？”
- 对话框可以继续精细化：
  - 更真实的工具栏状态
  - 更清楚的当前项目文件上下文
  - 更自然的输入区
  - 更像 Claude Code / Cursor 类工具，但不要侵犯品牌 UI 复刻边界
- 卡片文案要更接近用户痛点，不要过于抽象：
  - “这是登录模块，不是注册流程”
  - “auth/ 只放认证逻辑”
  - “别动 billing 和 env”
  - “改完先跑 npm test”
  - “保持现有 hooks 写法”

不建议优先做：

- 增加复杂 3D
- 增加人物角色
- 增加大段文案
- 增加震动、爆炸、粒子等廉价刺激
- 过早接入口播和字幕

## 6. 核心创作原则

### 6.1 第一帧必须成立

禁止空白后慢慢出现。第一帧就要让观众知道：

- 这是 AI Coding 场景。
- 这里有一个明确任务。
- 接下来会出问题。

### 6.2 画面不要增加理解负担

画面隐喻必须一眼可懂。观众不应该先解谜再理解内容。

正确例子：

```text
聊天窗口里 AI 一直问项目背景 → 观众秒懂“又要解释上下文”
```

错误例子：

```text
项目城市熄灯 → 需要理解城市=项目、灯=认知、路线=上下文
```

### 6.3 Remotion 能力要服务表达

Remotion 适合：

- 状态变化
- 信息层叠
- 路径流动
- 对比前后
- 卡片压迫
- 高亮和聚焦
- 局部放大
- 程序化节奏

Remotion 不适合当前阶段强行做：

- AI 漫剧
- 复杂角色表演
- 大世界观叙事
- 高成本电影感场景

### 6.4 不要把实验能力写进正式系统

当前 `AudienceValidationRepeatedContextDumpShot` 是实验 Composition。

研究通过前，不要：

- 修改正式 `videoSpec.json`
- 修改 prompts
- 修改生产 scene renderer
- 注册为 production-validated
- 改 capabilityRegistry
- 把实验字段写入正式 schema

## 7. 推荐的下一步任务包

### Task A：继续打磨 RepeatedContextDumpShot

目标：

> 把当前 75 分镜头提升到 82-85 分。

范围：

```text
src/video-system/experiments/visual-trigger/RepeatedContextDumpShot.tsx
src/video-system/experiments/visual-trigger/repeatedContextDump.constants.ts
```

验收：

- 无抖动。
- 第一帧任务清楚。
- 0.8 秒 AI 追问清楚。
- 1.6 秒上下文压力开始形成。
- 2.6 秒卡片压迫但不脏。
- 3.6 秒情绪落点清楚。
- `npm run typecheck` 通过。
- `npm run validate:render` 通过。
- 重新生成 contact sheet。

### Task B：做一个 B 方案对照

可选候选：

> “AI 拿着空白项目地图乱改”不建议，因为容易回到抽象隐喻。

更建议的 B 方案：

> “同一个需求，第一次 AI 乱问；第二次有 CLAUDE.md 后直接定位 auth/、测试命令、禁区。”

这是强对比，比单纯痛点更能承接后续视频主题。

结构：

```text
左：无项目手册 → AI 连续追问 / 路线混乱
右：有项目手册 → 直接定位 auth/ → 跑 test → 避开 env
```

这个方向天然适合 Remotion：分屏、路径、高亮、状态切换。

### Task C：选出正式前 15 秒

当前最可能的前 15 秒结构：

```text
0-4s：AI 又开始问项目背景，用户被迫重讲
4-8s：切到一句痛点判断：新会话不是不会写代码，是不认识你的项目
8-12s：展示解决物：一份项目手册 / CLAUDE.md / 知识入口
12-15s：给出承诺：让 AI 下次直接知道该改哪里、不能碰哪里、怎么验证
```

注意：这不是最终文案，只是结构。

## 8. 新会话必须遵守的边界

项目规则：

- 默认中文。
- 结论先行。
- 不迎合，实事求是。
- 修改代码前必须给 Project Understanding Report + Implementation Plan，并等用户确认。
- 禁止 CSS transition / animation / @keyframes / Tailwind 动画。
- Remotion 动画必须 frame-driven。
- 不要修改 `userDecision`、`approvedByUser` 等决策字段。
- 不要擅自删除文件、reset、force push。

当前任务边界：

- 只做 Shot Lab，不做正式视频。
- 默认不渲染 mp4。
- 只用 still + contact sheet 做视觉审查。
- 不碰正式 videoSpec、prompts、生产 renderer、capabilityRegistry。

常用命令：

```bash
npm run typecheck
npm run validate:render
npx remotion studio src/index.ts
npx remotion still src/index.ts AudienceValidationRepeatedContextDumpShot --frame=0 --output=out/audience-validation/repeated-context-dump-shot/frame-0.png
```

## 9. 一句话总纲

后续所有工作都围绕这句话做：

> 不要证明我们的系统很高级，要证明观众第一眼就愿意看，并且画面本身就在解释“为什么 AI 需要项目知识入口”。

## 10. 系统级后续方向

这份交接不只服务当前 Shot Lab，也服务整个视频系统接下来的升级。新会话不能只盯着 `RepeatedContextDumpShot`，还要理解后续内容、封面、观众研究、组件系统和正式生产链路的方向。

系统级方向是：

```text
观众研究
→ 选题承诺
→ 封面/标题
→ 0-4 秒视觉诱因
→ 前 15 秒留存结构
→ 前 60 秒价值兑现
→ 完整视频
→ 发布后数据回流
```

不要再从“有哪些 scene type”开始设计视频。scene 和组件只是执行层，不能决定内容方向。

## 11. 内容系统方向

### 11.1 账号内容定位

品牌定位仍然是：

> 一个普通大学生用 AI 做各种实验，把真实过程记录下来。

不是：

```text
我教你一个高级方法
```

而是：

```text
我试了一套方法，看看 AI 到底能不能少犯错、少重复解释、少乱改。
```

内容要保持“实验感”和“真实过程”，不要变成传统课程号。

### 11.2 下一条视频的核心主题

当前最适合重做的视频主题仍然围绕：

> AI Coding 为什么需要项目知识入口 / 项目手册 / CLAUDE.md。

但表达角度需要从“介绍一个文件”升级为：

> 新会话不是不会写代码，是不认识你的项目；项目手册的作用，是让 AI 下次不用从零认识你。

这比“CLAUDE.md 怎么写”更有观众痛点。

### 11.3 内容结构要从痛点出发

不要直接开场说：

```text
今天讲 CLAUDE.md
```

更好的结构：

```text
你让 AI 改登录逻辑
它却先问：项目是做什么的？哪个目录能改？改完怎么验证？
问题不是它不会写代码
问题是每次新会话，它都不认识你的项目
```

然后再引出：

```text
所以我试着给项目做了一份“知识入口”
```

### 11.4 内容不应只讲概念，要展示变化

优质视频必须让观众看到“前后差异”：

```text
无项目手册：
AI 追问、绕路、可能碰禁区、验证路线不明确

有项目手册：
AI 直接定位目录、知道禁区、知道测试命令、知道交付前检查
```

这个前后对比应该成为内容主轴，而不是只在后面补一句。

## 12. 封面系统方向

封面不能等视频快做完才随便截一张。封面应该和 0-4 秒 Hook 共用同一个痛点承诺。

### 12.1 封面目标

封面只做一件事：

> 让目标观众在信息流里立刻识别：这是我遇到的 AI Coding 问题。

不要把封面做成系统架构图、PPT 摘要、抽象隐喻图。

### 12.2 当前最适合的封面方向

建议优先测试两个封面方向：

#### 方向 A：痛点问题型

主视觉：

```text
AI 聊天窗口连续追问：
这个项目是做什么的？
哪个目录能改？
改完怎么验证？
```

大标题：

```text
AI 怎么又不认识项目了？
```

或者：

```text
每次新会话都要重讲？
```

优点：

- 一眼痛点强。
- 和当前 Shot Lab 完全一致。
- 适合抖音、小红书、B站封面复用。

风险：

- 如果封面文字太多，会显得乱。
- 需要强主标题压住聊天细节。

#### 方向 B：前后对比型

主视觉：

```text
左：AI 一直问背景
右：AI 直接定位 auth/ + npm test
```

大标题：

```text
给 AI 一份项目手册后
```

或：

```text
AI 不再从零认识项目
```

优点：

- 价值承诺更强。
- 更容易连接完整视频内容。

风险：

- 第一眼痛点可能不如方向 A 强。
- 画面要避免左右都塞太多文字。

### 12.3 封面不要做什么

不要做：

- 项目城市
- 抽象知识网络
- 大量节点连线
- 只有 CLAUDE.md 文件名的大字封面
- 纯“高级科技感”背景
- 完全依赖品牌风格但没有痛点的封面

### 12.4 封面生产顺序

封面不应该在完整视频之后才做。推荐顺序：

1. 先确定 0-4 秒 Hook。
2. 同步做 2 个封面 still 草案。
3. 让封面和 Hook 使用同一痛点。
4. 前 15 秒通过后，再定正式 coverSpec。

## 13. 前 15 秒方向

前 15 秒是当前系统最该投入的区域。完整视频能不能变好，主要看这里。

推荐结构：

```text
0-4s：视觉事件
AI 又开始追问项目背景，用户被迫重讲

4-8s：痛点命名
新会话不是不会写代码，是不认识你的项目

8-12s：解决物出现
我给项目做了一份知识入口 / 项目手册

12-15s：具体承诺
让 AI 下次直接知道：改哪里、不能碰哪里、怎么验证
```

这 15 秒里不要讲太多理论，也不要展示完整模板。

目标只是让观众继续看：

```text
这个问题我懂
这个解决方式我想知道
接下来应该有可复制的东西
```

## 14. 前 60 秒方向

前 60 秒不是完整教程，而是“价值兑现的第一层”。

推荐结构：

```text
0-4s：视觉痛点 Hook
4-15s：痛点命名 + 解决承诺
15-30s：无手册 vs 有手册的第一次对比
30-45s：项目手册里到底放什么：目录职责、禁区、验证路线
45-60s：展示一个最小可复制结构
```

前 60 秒必须让观众拿到一个具体东西：

```text
原来不是让 AI 读完整项目
而是给它一个入口，告诉它先看哪里、不能碰哪里、怎么检查
```

如果前 60 秒只是在铺垫，失败。

## 15. 完整视频方向

完整视频应该以“实验过程”组织，而不是以“知识点章节”组织。

推荐章节：

```text
1. 我遇到的问题：每次新会话都要重讲项目
2. 我第一次试：只写普通说明，效果一般
3. 我发现关键：AI 需要的不是长文档，而是入口路线
4. 我把项目手册拆成几块：目录职责、禁区、验证路线、常用命令
5. 前后对比：同一个任务，有无手册的差别
6. 最后给一个可复制的最小模板
```

不要做成：

```text
CLAUDE.md 是什么
CLAUDE.md 有什么字段
CLAUDE.md 怎么配置
```

那会变成普通教程，缺少“我试给你看”的账号人格。

## 16. 组件系统方向

### 16.1 组件系统要服务观众任务

组件不是为了炫技，而是为了完成观众任务：

- 停下来
- 看懂痛点
- 相信这个问题真实
- 看见解决前后差异
- 收藏模板
- 产生评论或复用行动

每个组件都应该回答：

```text
它帮助观众完成哪一步？
```

### 16.2 当前最需要的组件能力

优先级从高到低：

#### A. Chat Workbench / AI Coding 工作台

用途：

- 展示 AI 对话
- 展示项目文件侧栏
- 展示 AI 追问
- 展示输入区
- 展示“记忆缺失 / 上下文不足 / 已读取手册”等状态

当前 `RepeatedContextDumpShot` 已经是雏形，但还不是正式组件。

后续如果通过，应抽象为实验组件，而不是直接塞进旧 scene type。

#### B. Before / After Split 对比组件

用途：

- 无项目手册 vs 有项目手册
- 绕路 vs 直达
- 模糊追问 vs 直接定位

这是最适合解释“系统为什么有用”的组件。

#### C. Context Card Stack 上下文卡片层叠

用途：

- 展示项目背景、目录职责、禁区、验证路线等信息压入 AI 会话。
- 后续可分为“混乱压入”和“有序装载”两种状态。

当前卡片偏挤，下一步应做成更有秩序的层叠压迫。

#### D. Route / Path 动效

用途：

- 表达 AI 从需求到文件目录再到验证命令的路线。
- 表达绕路和直达。

这类能力之前已经在 S07/S08 做过“同一画面内先绕路、再直达”，可以复用思想。

#### E. Template Reveal 模板揭示

用途：

- 最后展示可复制的项目手册最小模板。
- 适合收藏导向。

注意：不要太早出现模板。先让观众感到痛点，再给模板。

### 16.3 暂时不优先开发的组件

暂时不优先：

- 复杂 3D 城市
- 人物角色层
- 大量粒子背景
- 通用炫酷标题
- 纯装饰特效系统
- 复杂电影转场

这些都可能提高制作成本，但不一定提高观众留存。

## 17. 观众研究系统方向

当前系统已经有观众研究框架，但真实证据还不够。后续不要把 prompt 字段当成研究本身。

### 17.1 抖音是主平台

平台优先级：

```json
{
  "primaryOptimizationPlatform": "douyin",
  "secondaryReusePlatforms": ["bilibili", "xiaohongshu", "youtube"],
  "platformTradeoff": "优先优化抖音前15秒停留、痛点识别和信息密度；正文深度、收藏页和章节结构兼顾B站、小红书和YouTube复用。"
}
```

不能假装一条视频同时对所有平台最优。

### 17.2 研究应该沉淀为数据文件

后续应补齐：

```text
audienceEvidenceDataset.json
audienceResearchBrief.json
AUDIENCE_EVIDENCE_REPORT.md
postPublishAudienceReport.json
```

注意：研究通过前，不要把推断写成系统硬规则。

### 17.3 研究结论要分级

所有结论必须标记：

- observed：样本直接可见
- inferred：多个样本重复出现后的推断
- hypothesis：下一条视频准备验证
- validated：自己账号数据支持
- rejected：自己账号数据反驳

评论区只能辅助发现痛点、反对意见、模板需求和表达习惯，不能单独证明整体留存偏好。

## 18. 发布和数据回流方向

系统不能只停在“做出视频”。后续要记录发布后的真实反馈。

最小数据闭环：

```json
{
  "videoId": "",
  "platform": "douyin",
  "hypothesisId": "",
  "titleCoverSignal": "",
  "first15Signal": "",
  "midDropOff": "",
  "commentThemes": [],
  "saveShareSignal": "",
  "validatedPatterns": [],
  "rejectedPatterns": [],
  "nextAction": ""
}
```

关键原则：

```text
first15-design-quality ≠ actual-retention-signal
```

发布前只能判断“前 15 秒设计是否合理”；发布后才能知道“观众是否真的留下来”。

## 19. Prompt 系统后续修补方向

研究通过前，不要继续大改 00-16 prompts。

研究通过后，只做最小修补：

1. 持久化 `audienceResearchBrief.json`。
2. 增加 `primaryOptimizationPlatform`、`secondaryReusePlatforms`、`platformTradeoff`。
3. 拆分 `first15-design-quality` 与 `actual-retention-signal`。
4. 根据真实研究结果修正 Hook mechanism → host scene + semanticPattern 映射。
5. 让 Hook 先选机制，再选 scene，不要默认 `cover / big-quote`。

特别注意：

```text
hook → cover / big-quote
```

这个旧映射太弱，容易把动态痛点又编译回静态 PPT。

应该改成：

```text
Hook 机制
→ 错误现场 / 压力累积 / 前后反差 / 结果揭示
→ host scene + semanticPattern
```

## 20. 正式重做视频的推荐顺序

不要从 17 个旧 scene 开始修。

推荐顺序：

```text
1. 完成 0-4 秒 Hook 验证
2. 做 2 个封面方向 still
3. 完成前 15 秒结构
4. 完成前 60 秒结构
5. 再生成新的 contentBrief
6. 再生成新的 videoSpec
7. 再接 TTS / subtitles / preview QA
8. 最后才进入完整视频渲染
```

旧的 17 个 scene 和主题来自 PPT 项目迁移，可以保留可复用部分，但不要以它们为中心优化。

正确策略：

> 保留能用的视觉资产和组件能力，重构内容组织方式与核心 Hook，不要推倒所有代码，也不要继续在旧 PPT scene 上小修小补。

## 21. 新会话最该先问的问题

如果新会话继续工作，先问或先确认这几个问题：

1. 当前是继续打磨 A 方案，还是做 B 方案对照？
2. 是否仍然以抖音为主平台？
3. 当前目标是 0-4 秒、前 15 秒、封面，还是前 60 秒？
4. 是否允许修改实验组件代码？
5. 是否仍然不碰正式 videoSpec / prompts / production renderer？

如果用户没有明确改变方向，默认答案是：

```text
继续 Shot Lab；
抖音主平台；
先把 A 方案打磨到 82-85 分；
只改实验文件；
不碰正式生产链路。
```
