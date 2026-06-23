# P1-0 Remotion 优质资源与组件升级蓝图

日期：2026-06-19  
范围：只做资源调研、能力分层和落地路线，不安装依赖，不修改正式 Remotion 组件。  

## 1. 结论

正式组件系统需要升级，但主来源不应该是当前实验版。实验版只能作为本地参考样本。下一阶段应从 Remotion 官方能力、官方模板、官方 Resources、成熟开源组件库和优秀项目里筛选可迁移能力，再按本项目的 videoSpec、theme、安全区、字幕和验证脚本重新封装。

优先级判断：

1. 先补“解释知识”的运动语法：对象出现、路径绘制、状态转换、逐步保留、证据高亮。
2. 再补“视觉质感”的增强能力：motion blur、trail、转场、背景纹理。
3. 最后再考虑高成本能力：3D、WebGL/WebGPU effects、Skia、Lottie、Rive、复杂粒子。

第一批落地不建议超过 3-5 个组件，否则会变成组件堆砌，反而重新回到“好看但不解释”的问题。

## 2. 当前系统缺口

当前正式系统已经支持：

- frame-driven 动画：`useCurrentFrame()`、`interpolate()`、`spring()`。
- `Sequence` 内部时间轴。
- `TransitionSeries` 场景转场。
- `flow-diagram + semanticPattern=fragment-to-manual`。
- `comparison + semanticPattern=detour-vs-direct-path`。
- 部分截图/双栏/列表/模板页渐进出现。

主要缺口：

| 缺口 | 表现 | 对视频的影响 |
| --- | --- | --- |
| 缺少通用 motion primitives | 每个 scene 各写各的入场和 active 状态 | 运动风格不统一，后续扩展慢 |
| 缺少语义动画库 | 只有碎片入手册、绕路/直达两种 | 遇到新知识点容易退回 PPT |
| 缺少资源选型机制 | 不知道何时用官方包、何时自写 | 容易盲目加依赖或重复造轮子 |
| 缺少组件契约 | 外部模板不能直接接入 videoSpec | GPT 生成时不知道可用能力边界 |
| 缺少演示/fixture | 升级后难以证明组件真的更会解释 | 只能靠主视频人工感觉判断 |

## 3. 调研来源

### 3.1 Remotion 官方模板

来源：Remotion Templates  
URL：https://www.remotion.dev/templates

可参考能力：

| 模板/方向 | 适合本项目的部分 | 采用策略 |
| --- | --- | --- |
| Prompt to Motion Graphics SaaS Starter Kit | AI 生成 motion graphics 的能力识别流程 | Inspire |
| Code Hike | 代码、配置、prompt、CLAUDE.md 和步骤的可视化讲解方式 | 高价值候选，先做 `code-step-visualization` 能力门控 |
| TikTok captions | word-by-word captions | Backlog，当前字幕系统已存在，不先替换 |
| Audiogram / Music Visualization | 声音驱动视觉 | Backlog，知识视频目前不是音频可视化主线 |
| 3D / React Three Fiber | 复杂空间概念、物理对象 | Backlog，成本高，先不进 P1 |
| Stills | 封面和关键帧生成 | Already used / reference |

判断：官方模板更适合作为架构和能力识别参考，不适合直接复制成正式组件。Code Hike 方向需要重新评估：以前把 `code` 一刀切禁用过于片面。代码、配置、prompt 和步骤本身有时就是知识对象，应该被做成解释组件，而不是被转译成普通卡片。

### 3.2 Remotion 官方 Resources

来源：Remotion Resources  
URL：https://www.remotion.dev/docs/resources

官方 Resources 汇总了 templates、integrations、effects、animation helpers、full projects 和 components。对本项目最有价值的分类：

| 分类 | 资源方向 | 采用策略 |
| --- | --- | --- |
| Effects | Motion Blur、Noise、Path animations | Adopt / Adapt |
| Animation helpers | animated text、transition helpers、time helpers | Adapt |
| Components | Remocn、React Video Editor、RemotionUI、Remotion Bits、Onda | Evaluate then Adapt |
| Examples | D3、text morphing、Three particles、MapLibre | Backlog / Inspire |
| Integrations | Lottie、Rive、Skia、Three | Backlog |

判断：Resources 是后续组件选型的主入口。每次升级一个能力前，都应先查 Resources 是否已有成熟方向。

### 3.3 Remotion motion blur

来源：`@remotion/motion-blur`  
URL：https://www.remotion.dev/docs/motion-blur/

官方说明：该包提供 `<Trail>` 和 `<CameraMotionBlur>`，用于 motion blur 和 trail effects。许可证 MIT。官方也提示 Remotion 版本要保持一致，且 `<Trail>` / `<CameraMotionBlur>` 会操作当前时间的 React context，`useCurrentFrame()` 位置有常见坑。

可用价值：

- 路径运动、对象飞入、碎片吸入、电子移动等可以用 trail 增强速度感。
- 复杂镜头运动可以用 CameraMotionBlur，但应谨慎，避免颜色破坏和性能成本。

采用策略：P1 可优先试点 `<Trail>`，暂不默认全局引入 `<CameraMotionBlur>`。

落地约束：

- 如果安装，`remotion` 与所有 `@remotion/*` 版本必须保持一致。
- 先做 isolated fixture，不直接套主视频。
- motion blur 只用于“运动表达意义”的对象，不用于装饰性漂浮。

### 3.4 Remotion Effects

来源：Remotion Effects  
URL：https://www.remotion.dev/docs/effects

官方说明：Effects 支持 2D Canvas、WebGL2、WebGPU 等方式创建自定义效果，并可组合现有效果，如 gridlines、waves、lightLeak、starburst 等。

采用策略：Backlog。

原因：

- 当前项目目标是把画面变成解释，不是先追光效。
- Effects 是高上限能力，但也容易把注意力从知识对象转移到视觉表演。
- 需要先建立组件契约和 fixture，否则难以控制质量。

### 3.5 React Video Editor Remotion Templates

来源：React Video Editor / `reactvideoeditor/remotion-templates`  
URL：https://github.com/reactvideoeditor/remotion-templates  
URL：https://www.reactvideoeditor.com/remotion-templates

仓库说明：81 个 free ready-to-use Remotion templates，自包含 React component，使用 `useCurrentFrame`、`interpolate`、`spring`、`useVideoConfig`，不使用 CSS keyframes 或外部动画库。

高价值分类：

| 分类 | 适合能力 | 采用策略 |
| --- | --- | --- |
| Text | animated text、slide text、typewriter subtitle | Adapt |
| Content Animation | animated list、progress steps、text highlight | Adapt |
| Charts & Data | bar、line、progress、stat counter | Backlog / future data scenes |
| Transition | pixel transition 等 | Inspire |
| Background | 可借鉴弱背景纹理 | Inspire |

判断：这是 P1 最值得细看的外部模板库之一，但不能直接复制。需要改造为本项目的 theme、safe area、subtitle-safe zone 和 scene contract。

### 3.6 Remotion Bits

来源：Remotion Bits / `av/remotion-bits`  
URL：https://remotion-bits.dev/  
URL：https://github.com/av/remotion-bits

仓库说明：面向 Remotion 的 ready-made composable components，覆盖 text effects、gradient transitions、particle systems、3D scenes 等。MIT 许可证。提供 CLI、MCP、package、jsrepo、skill 等多种使用方式。

采用策略：Evaluate then Adapt。

适合本项目的部分：

- text reveals
- charts
- transitions
- lower-level motion utilities

暂不建议直接包依赖：

- 本项目有严格能力边界和验证脚本。
- 直接依赖会把组件契约外包给第三方，GPT 提示词难以稳定描述。
- 更适合用 CLI/fetch 单个 bit 研究，然后改造成 `src/video-system/components/motion/` 下的本地组件。

### 3.7 Remocn

来源：Remocn / `kapishdima/remocn`  
URL：https://www.remocn.dev/docs/getting-started/introduction  
URL：https://github.com/kapishdima/remocn

说明：shadcn 风格的 Remotion copy-paste 组件库，强调 production-ready、`useCurrentFrame()`、`interpolate()`、`spring()`，组件复制进项目后由项目自己维护。

采用策略：Adapt / Inspire。

价值：

- copy-paste 模式比 runtime dependency 更适合当前系统。
- 可借鉴 registry 方式，未来建立自己的 `visual-patterns` 注册表。

风险：

- 多面向产品 demo，不一定天然适合知识解释。
- 需要筛掉营销感、炫技感强的组件。

### 3.8 Onda

来源：Onda / `degueba/onda`  
URL：https://github.com/degueba/onda

仓库说明：70 components + 18 transitions，包含 entrances、interface、graphics、data、scenes、atmosphere 等分类。

采用策略：Evaluate then Adapt。

适合本项目的部分：

- entrances：fade、slide、mask、word-stagger、typewriter。
- graphics：highlight、callout、draw-on、bounding-box。
- data：counters、bars、lines、progress、timeline、captions。
- atmosphere：dynamic-grid、grain-overlay。

风险：

- interface 类组件如 terminal、code-diff 不能直接纳入当前能力；但它们不再是永久禁区，而是 `terminal-result` / `diff-explainer` 的候选参考。
- transitions 数量多，但当前系统需要先解决 scene 内视觉解释，不应先堆转场。

### 3.9 SwiftClip

来源：SwiftClip  
URL：https://swift-clip.vercel.app/  
URL：https://github.com/zz41354899/SwiftClip

说明：30 个 copy-paste Remotion composition templates，偏 Apple Light Mode 设计。

采用策略：Inspire。

价值：

- 适合参考干净、轻量、明亮的排版和转场节奏。
- 与当前 `xhs-white-editorial`、`minimal-white` 有相似气质。

限制：

- 更偏完整模板，不一定适合拆成知识解释 primitives。
- 当前视频以横版知识解释为主，不应直接引入竖屏/社交模板。

## 4. 能力分类与采用策略

### 4.1 概念对象化

目标：说到 A，不只是出现文字 A，而是出现能代表 A 的对象。

候选能力：

- object token / concept node
- icon-like semantic object
- generated image placeholder / bitmap object
- object enter / split / merge / transform

推荐来源：

- 本地自写为主。
- RVE text/content templates 参考入场。
- Remocn / Onda 参考 callout、highlight、draw-on。

第一批建议：

- `ConceptObject`
- `ObjectTransform`
- `ObjectCluster`

### 4.2 关系空间化

目标：关系变成空间结构、连接线、路径、网络、包含关系。

候选能力：

- path drawing
- node-link graph
- hierarchy stack
- before/after spatial compare
- map-like route

推荐来源：

- 当前 `DetourVsDirectPathScene` 继续抽象。
- Onda draw-on / bounding-box / timeline 参考。
- Remotion Resources 的 path animations 参考。

第一批建议：

- `SemanticPath`
- `RelationGraph`
- `ContainmentFrame`

### 4.3 变化运动化

目标：变化不是换页，而是对象运动、状态转换、聚合、拆解。

候选能力：

- aggregation / scatter
- absorb / collect
- dissolve / remove noise
- morph-like transform
- trail / motion blur

推荐来源：

- 当前 `FragmentToManualScene` 继续抽象。
- `@remotion/motion-blur` 的 `<Trail>` 试点。
- RVE content animation 参考。

第一批建议：

- `ParticleToObject`
- `AbsorbToContainer`
- `MotionTrail`

### 4.4 推理过程动画化

目标：推理过程可见，观众静音看也能理解“从问题到证据到结论”。

候选能力：

- progressive retain
- cue active cards
- evidence accumulation
- wrong path correction
- premise -> transformation -> conclusion

推荐来源：

- 本地 director cue 系统。
- 实验版 cue active 仅作参考。
- RVE progress steps、text highlight。
- Onda timeline、captions、highlight。

第一批建议：

- `ProgressiveRetainList`
- `CueActivePanel`
- `EvidenceStack`

### 4.5 视觉质感增强

目标：增强运动质感，但不抢知识对象。

候选能力：

- motion blur / trail
- soft depth shadow
- subtle grid / grain
- scene transition overlay

推荐来源：

- `@remotion/motion-blur`
- Remotion Effects 作为 backlog
- Remocn / Onda atmosphere 参考

第一批建议：

- `MotionTrail`
- `SoftDepthCard`
- `SubtleGridBackground`

### 4.6 人感与操作痕迹

目标：画面里不只是概念、路径和卡片，还要能看见“有人在经历、操作、判断和发现”。

候选能力：

- cursor / pointer / selection highlight
- typing / editing trace
- handwritten annotation
- decision moment card
- actor state badge
- workspace scene metaphor

推荐来源：

- Code Hike / interface templates 的操作步骤表达。
- Remocn / Onda 的 interface、highlight、draw-on、callout。
- 本项目的小尘品牌资产和已有场景隐喻：桌面、白板、手册、便签、项目地图。

第一批建议：

- `OperationTrace`
- `DecisionMoment`
- `HumanPresenceCue`

## 5. 采用决策矩阵

| 资源 | 维护/成熟度 | 匹配度 | 许可证/风险 | 建议 |
| --- | --- | --- | --- | --- |
| Remotion official templates | 高 | 中 | 官方，低风险 | Inspire / Backlog |
| Remotion Resources | 高 | 高 | 官方入口 | 作为长期选型入口 |
| `@remotion/motion-blur` | 高 | 高 | MIT，版本需一致 | P1 可试点 `<Trail>` |
| Remotion Effects | 新，高上限 | 中 | 官方，但成本高 | Backlog |
| React Video Editor templates | 中 | 高 | 需逐项确认 | P1 重点参考 |
| Remotion Bits | 中 | 高 | MIT，第三方 | 单 bit 研究后本地化 |
| Remocn | 新但活跃 | 中高 | copy-paste 友好 | 参考 registry 和组件设计 |
| Onda | 中 | 高 | 需逐项确认 | 重点参考 highlight/data/timeline |
| SwiftClip | 中 | 中 | copy-paste | 视觉风格参考 |
| 本地实验版 | 已存在 | 中 | 无外部风险 | 只作参考，不作主来源 |

## 6. P1 第一批落地建议

第一批目标不是做“最炫”，而是最大幅降低 PPT 感。

### P1-1：Motion Foundation

新增正式组件目录：

```text
src/video-system/components/motion/
```

建议组件：

| 组件 | 作用 | 来源策略 |
| --- | --- | --- |
| `MotionBox` | 统一 fade/slide/spring 入场 | 本地实现，参考 RVE/Remocn |
| `MotionText` | 文字分词/逐字/逐行 reveal | 参考 RVE text templates |
| `MotionCard` | active / inactive / retained 状态 | 本地实现 |
| `MotionPath` | SVG path draw + optional trail | 本地实现，参考 path animations |
| `MotionTrail` | 包装高速移动对象 | 试点 `@remotion/motion-blur` 或先自写 ghost trail |

同时建立能力门控候选，不写入正式 `videoSpec`：

| 候选能力 | 说明 | 解锁目标 |
| --- | --- | --- |
| `code-step-visualization` | 代码 / JSON / prompt / CLAUDE.md / 配置 / 步骤可视化 | 未来解锁 `code` 或语义 pattern |
| `diff-explainer` | 前后版本、prompt 改写、配置变化、错误/正确对照 | 未来解锁 `diff` |
| `terminal-result` | 命令执行、日志、报错、测试通过、Agent 工作流 | 未来解锁 `terminal` |
| `plan-timeline` | 并行任务、执行链路、项目排期 | 未来解锁 `gantt` |
| `real-interface-hero` | 真实产品、界面、截图、视觉案例大图 | 未来解锁 `image-hero` |
| `human-presence-layer` | 操作痕迹、角色状态、判断瞬间、创作者视角 | 先做低成本人感层 |

### P1-2：Anti-PPT Scene Upgrade

优先升级两个高频静态场景：

| Scene | 当前问题 | 升级目标 |
| --- | --- | --- |
| `BulletsScene` | 容易像列表 PPT | progressive-retain list，当前项高亮，旧项保留 |
| `BigQuoteScene` | 容易像海报/PPT | insight shot，结论从前景浮现，有轻微 breathing |

### P1-3：Visual Explanation Patterns

沉淀 3 个正式可复用语义 pattern：

| Pattern | 解释动作 | 典型场景 |
| --- | --- | --- |
| `object-transform` | A 变成 B | 模糊问题变清晰问题，概念变模型 |
| `accumulate-evidence` | 证据逐步累积成结论 | 案例、实验、截图证据 |
| `path-correction` | 错误路径被修正为正确路径 | 方法论、工作流、推理纠偏 |

### P1-4：Prompt Contract Update

只有组件代码和 fixture 通过后，才更新 prompts：

- `00_PROJECT_CONTEXT.md`：写入“已实现能力”。
- `03_CONTENT_BRIEF_TO_VIDEO_SPEC_PROMPT.md`：告诉 GPT 如何调用。
- `14_VISUAL_DESIGN_SYSTEM_V1_ALPHA.md`：补充组件使用规则。
- `13_REFERENCE_BASIS_AND_BEST_PRACTICES.md`：补充资源来源和依据。

## 7. 不建议第一批做的事

| 不建议 | 原因 |
| --- | --- |
| 直接安装多个组件库 | 能力边界会混乱，验证成本高 |
| 直接搬实验版 Ultimate Motion System | 实验版只是样本，不代表质量最好 |
| 先做 3D / WebGPU / Skia | 成本高，当前主要问题是解释语法不足 |
| 先堆转场 | 转场不能解决 scene 内 PPT 感 |
| 先做竖屏重排 | 当前 mobile_scaled 是 QA 产物，不是发布规格 |
| 先替换字幕系统 | 当前字幕系统已有流程，收益不如 scene 内运动 |
| 直接引入 terminal/code 类组件并写入 videoSpec | 当前仍未解锁；应先作为 `terminal-result` / `code-step-visualization` 做组件门控 |

## 8. 推荐执行顺序

1. 建立 `components/motion/` 正式 primitives，先自写最小可用版本。
2. 建立 `components/visual-patterns/`，只放已经通过 fixture 的语义 pattern。
3. 升级 `BulletsScene` 和 `BigQuoteScene`，降低静态占比的观感问题。
4. 用 fixture/still 验证组件，不先碰真实视频。
5. 验证通过后更新 prompts，把能力写成“已实现”。
6. 再考虑从 RVE、Remotion Bits、Onda 中挑单个组件做 Adapt。

## 9. 下一步建议

建议下一包执行：

```text
P1-1 Motion Foundation + Bullets/BigQuote anti-PPT upgrade
```

范围：

- 新增 `src/video-system/components/motion/`。
- 新增 3-4 个本地 motion primitives。
- 改 `BulletsScene` 和 `BigQuoteScene` 使用 primitives。
- 不安装第三方依赖。
- 不更新 prompts 为“已支持”，直到 fixture 和 still 验证通过。

验收：

- `npm run typecheck`
- `npm run validate:all`
- `npm run visual:fixtures`（如果受影响 fixture 存在）
- 导出至少 2 张 still：Bullets 前中后态、BigQuote 结论态
- `npm run check:ppt` 至少不新增更严重风险

这个顺序比较稳：先让系统拥有自己的运动底座，再从外部资源里挑“真正值得吸收”的部件。外部资源不是目的，解释能力才是目的。

## 10. 参考来源

- Remotion Templates：https://www.remotion.dev/templates
- Remotion Resources：https://www.remotion.dev/docs/resources
- Remotion motion blur：https://www.remotion.dev/docs/motion-blur/
- Remotion Trail：https://www.remotion.dev/docs/motion-blur/trail
- Remotion CameraMotionBlur：https://www.remotion.dev/docs/motion-blur/camera-motion-blur
- Remotion Effects：https://www.remotion.dev/docs/effects
- React Video Editor Remotion templates：https://github.com/reactvideoeditor/remotion-templates
- React Video Editor template gallery：https://www.reactvideoeditor.com/remotion-templates
- Remotion Bits：https://remotion-bits.dev/
- Remotion Bits GitHub：https://github.com/av/remotion-bits
- Remocn docs：https://www.remocn.dev/docs/getting-started/introduction
- Remocn GitHub：https://github.com/kapishdima/remocn
- Onda GitHub：https://github.com/degueba/onda
- SwiftClip：https://swift-clip.vercel.app/
- SwiftClip GitHub：https://github.com/zz41354899/SwiftClip
