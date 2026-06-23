# 理论依据、官方指引与最佳实践

本文件记录系统采用的理论依据、Remotion 官方指引和参考资源。

**定位**：只指导设计和优化，不定义新的 videoSpec 字段，不代表当前 Remotion 已实现新能力。

---

## 1. 能力分层

系统的"能力"分为三层，策划和审片时必须区分：

| 层级         | 含义                                                                | 能否写进 videoSpec         |
| ------------ | ------------------------------------------------------------------- | -------------------------- |
| 当前渲染能力 | 当前仓库已实现、Agent 可执行或检查                                  | 可以，通过现有字段表达     |
| 设计参考能力 | Remotion 官方文档、Resources、Templates、Agent Skills、优秀开源项目 | 不可以，只能记录为 backlog |
| 理论依据     | 认知负荷、多媒体学习、加工流畅性、平台留存研究                      | 不可以，只能解释规则来源   |

详细能力清单见 `00_PROJECT_CONTEXT.md` 的"能力分层"章节。

---

## 2. Remotion 官方实践基线

以下来自 Remotion 官方文档和资源。只有当前仓库已经实现的部分，才可以作为当前运行能力。未实现部分只能作为后续优化方向。

### 2.1 核心 API

| API                | 官方用途                                                    | 本系统落地状态                                                                                                        |
| ------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `useCurrentFrame`  | frame-driven animation 基础，每个组件根据当前帧决定渲染状态 | 已实现，所有 scene 组件使用                                                                                           |
| `interpolate`      | 透明度、位移、缩放等数值映射                                | 已实现，animation.ts 封装                                                                                             |
| `spring`           | 自然弹性动画，支持 damping / stiffness / mass 配置          | 已实现，animation.ts 封装                                                                                             |
| `Sequence`         | scene 内部时间轴，支持分批出现和子组件独立帧计时            | 已实现，TwoColumnScene / ComparisonScene / TodoChecklistScene / BulletsScene / ProcessStepsScene / BigQuoteScene 使用 |
| `TransitionSeries` | 场景间过渡，支持 wipe / fade / slide 等                     | 已实现，KnowledgeVideo.tsx 使用                                                                                       |
| `Easing.bezier`    | 自定义缓动曲线                                              | 已实现，三条曲线：EASE_OUT_CRISP / EASE_IN_OUT_EDITORIAL / EASE_OVERSHOOT                                             |
| `staticFile()`      | 引用 public 目录内静态资源                                  | 已实现，mediaPaths 统一去除 `public/` 前缀                                                                            |
| `<Audio>` + `Sequence` | 按 scene 音频片段同步播放                                | 已实现，AudioTrackLayer 统一读取 audioTiming.filePath                                                                 |

### 2.2 官方资源

| 资源               | 官方用途                           | 本系统关系                     |
| ------------------ | ---------------------------------- | ------------------------------ |
| Remotion Templates | 可复用组件、props、自动化渲染流程  | 设计参考，不自动等于当前已实现 |
| Remotion Resources | 社区组件、工具和最佳实践           | 设计参考                       |
| Agent Skills       | 让 AI Agent 理解 Remotion 最佳实践 | 设计参考，指导 Agent 实现      |

**关键区分**：官方文档中的 API 能力（如 `spring`、`Sequence`、`TransitionSeries`）在当前仓库已实现的部分可以直接利用；官方 Templates/Resources 中的组件（如 3D 渲染、字幕系统、实时数据接入等）如果当前仓库未实现，只能作为后续优化方向。

P0 已落地能力与参考来源的对应关系见仓库根目录 `P0_REFERENCE_INTEGRATION_MATRIX.md`。未实现能力必须标记为 design reference 或 backlog，不能进入当前 videoSpec 能力清单。

### 2.3 当前渲染能力清单

以下能力已在当前仓库实现，策划和审片时可以直接利用：

| 能力类别        | 能力项                                             | 说明                                                                                      |
| --------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 品牌渲染        | brand.watermarkText                                | SceneChrome 右上角显示自定义品牌名                                                        |
| 品牌渲染        | brand.logoAssetId                                  | SceneChrome 右上角 avatar 使用指定图片                                                    |
| 背景控制        | background.showProgress                            | false 隐藏进度条，true 显示                                                               |
| 封面模板        | big-title / big-title-character / split-left-right | 已实现，CoverComposition 渲染                                                             |
| 封面人物位置    | character.placement                                | 4:3 left/right 控制人物左右，3:4 默认 center                                              |
| 素材布局        | assetLayout                                        | comparison 和 two-column 都支持，不依赖 presentationMode                                  |
| 截图高亮框      | HighlightBox                                       | 在 assetLayout.left/right.highlight 中使用，百分比定位，支持多框叠加                      |
| Knowledge Lab   | 两个主题触发                                       | xhs-white-editorial / knowledge-blueprint 的 presentationMode=knowledge-lab 触发 lab 变体 |
| Sequence 时间轴 | 6 个 scene 已实现                                  | TwoColumn / Comparison / TodoChecklist / Bullets / ProcessSteps / BigQuote                |

详细字段说明见 `00_PROJECT_CONTEXT.md`。

### 2.4 高表达力 Scene 能力

`code`、`diff`、`terminal`、`image-hero`、`gantt` 已解锁为正式 scene type。它们应被看作高价值能力方向：当代码、配置、prompt、日志、执行链路、并行任务或真实界面本身就是知识对象时，对应组件可能比普通卡片更符合 Multimedia、Signaling 和 Segmenting 原则。

但它们仍有严格边界：短代码、短变化、短命令结果、一张主图、轻量执行链路。超出这些边界时，策划阶段应在 visualDirectionSpec 中标记为 `needs-component-upgrade` 或 `backlog`，不能假装当前渲染器已支持复杂 IDE、长日志、长图滚动或真实项目管理系统。

同理，“人感”不是必须真人出镜，但应尽量通过操作痕迹、角色状态、判断瞬间和工作现场隐喻体现。`human-presence-layer` 当前仍是候选能力，不是已实现渲染能力。

---

## 3. 平台留存与内容结构依据

### 3.1 Hook / Body / Close 结构

平台内容结构经验与官方创意建议可抽象为：

- **Hook（0-2 秒）**：必须让用户立刻知道这条视频和自己有关。不讲定义，不铺背景。
- **Body（2 秒 - 结尾前）**：围绕案例、方法、迁移场景展开，每 20-40 秒至少出现一种信息增量。
- **Close（结尾）**：不能只说点赞关注，必须给出一个用户马上能执行的动作。

**系统落地**：

- `02_ARTICLE_TO_CONTENT_BRIEF_PROMPT` 的 `attentionBeats` 字段负责节拍设计
- `03_CONTENT_BRIEF_TO_VIDEO_SPEC_PROMPT` 的 5 分钟以上视频留存结构负责 S01-S03 的时间分配
- `06_PREVIEW_REVIEW_PROMPT` 的全片留存审片负责检查留存链路是否成立

### 3.2 前 15 秒留存链路

| 时间段   | 作用                               | 系统落地                                      |
| -------- | ---------------------------------- | --------------------------------------------- |
| 0-2 秒   | 停留：让用户知道和自己有关         | S01，cover 或 big-quote，durationEstimate 2.5 |
| 2-5 秒   | 承诺：告诉用户继续看能得到什么     | S02，反差/证据预告/方法预告                   |
| 5-15 秒  | 筛选：让目标用户确认"这是给我看的" | S03，适用对象/真实场景/专业问题               |
| 15-60 秒 | 信任：尽早给出第一个真实案例或证据 | 不把定义放满前 60 秒                          |

### 3.3 中段信息增量

每 20-40 秒至少出现一种信息增量：新问题、新证据、新反差、新结论、新方法或新应用。

**系统落地**：`03` 的第二次质量门禁第 3 条检查。

### 3.4 结尾行动

结尾不能只说点赞关注，必须给出一个用户马上能执行的动作。

**系统落地**：`cta` scene type + `beatRole=cta` + `finalAction` 字段。

---

## 4. 认知负荷与多媒体学习依据

### 4.0 参考来源

| 来源 | 本文件使用章节 | URL |
| ---- | -------------- | --- |
| Mayer, Multimedia Learning / Cambridge Handbook | §4.1、§4.4 | https://assets.cambridge.org/97811071/87504/frontmatter/9781107187504_frontmatter.pdf |
| Mayer & Fiorella, principles for reducing extraneous processing | §4.1、§4.4 | https://www.researchgate.net/publication/262915119_Principles_for_reducing_extraneous_processing_in_multimedia_learning_Coherence_signaling_redundancy_spatial_contiguity_and_temporal_contiguity_principles |
| Sweller, Cognitive Load During Problem Solving | §4.2、§4.4 | https://onlinelibrary.wiley.com/doi/10.1207/s15516709cog1202_4 |
| Reber, Schwarz, Winkielman, Processing Fluency and Aesthetic Pleasure | §4.3、§4.4 | https://pubmed.ncbi.nlm.nih.gov/15582859/ |
| Remotion useCurrentFrame | §2.1 | https://www.remotion.dev/docs/use-current-frame |
| Remotion Sequence | §2.1 | https://www.remotion.dev/docs/sequence |
| Remotion interpolate | §2.1 | https://www.remotion.dev/docs/interpolate |
| Remotion spring | §2.1 | https://www.remotion.dev/docs/spring |

### 4.1 Mayer 多媒体学习认知理论

来源：Mayer, R. E. (2020). Multimedia Learning (3rd ed.). Cambridge University Press.

核心原则与系统规则的对应：

| Mayer 原则                               | 系统规则                     | 落地方式                             |
| ---------------------------------------- | ---------------------------- | ------------------------------------ |
| Multimedia Principle：图文结合优于纯文字 | 截图 + 标签 + 结论的结构     | comparison + visualRole=evidence     |
| Coherence Principle：删除无关材料        | 每页最多 3 个核心信息点      | 07 信息密度规则                      |
| Signaling Principle：突出重要信息        | 唯一视觉中心、大标签、大结论 | 07 手机端视觉规则                    |
| Segmenting Principle：分段呈现           | progressive-reveal 逐步揭示  | animation 字段                       |
| Modality Principle：用图+语音而非图+文字 | voiceover + screenText 分工  | spokenText 给 TTS，screenText 给画面 |

### 4.2 Sweller 认知负荷理论

来源：Sweller, J. (1988). Cognitive load during problem solving. Cognitive Science, 12(2), 257-285.

核心概念与系统规则的对应：

| 认知负荷类型                       | 系统应对                         | 落地方式                        |
| ---------------------------------- | -------------------------------- | ------------------------------- |
| 内在负荷（内容本身的复杂度）       | 不降低内容深度，但控制每页信息量 | 每页最多 3 个核心信息点         |
| 外在负荷（呈现方式造成的额外负担） | 减少无关装饰、统一视觉层次       | 07 减少小而散的装饰             |
| 相关负荷（学习所需的认知努力）     | 让信息逐步呈现、截图标签化       | progressive-reveal + 截图标签化 |

### 4.3 Processing Fluency 加工流畅性

来源：Reber, R., Schwarz, N., & Winkielman, P. (2004). Processing fluency and aesthetic pleasure. Personality and Social Psychology Review, 8(4), 364-382.

核心概念：加工流畅性越高（信息越容易处理），用户越觉得内容可信、有价值。

系统落地：

- 字号足够大（手机端 3 秒看懂）
- 留白适度（不导致主体显小）
- 视觉层次清晰（唯一视觉中心）
- 截图不靠细读（标签化、结论化）

---

## 4.4 理论依据 → 导演决策映射

理论依据不能只停留在参考文档里。ChatGPT 在生成 Visual Explanation Brief、Visual Staging Plan、videoSpec 和 visualDirectionSpec 时，应把关键视觉决策映射到具体依据。

| 导演问题 | 理论依据 | 系统规则 | 典型落地 |
| -------- | -------- | -------- | -------- |
| 为什么说到 A 要出现 A | Multimedia Principle | 能被画面解释的概念优先视觉化，不只用文字复述 | 讲电场时出现电子、场线和运动轨迹 |
| A 应该在哪里出现 | Spatial Contiguity / Cognitive Load | 标签靠近对象，因果相关对象靠近路径或连接线，减少视线跳跃 | 条件标签贴近输入框，结论贴近输出结果 |
| A 应该多大 | Processing Fluency / Cognitive Load | 关键对象 L1，辅助标签 L2/L3，手机端投影后仍可读 | 核心对象居中或占主要面积，辅助说明退到边缘 |
| A 什么时候出现 | Segmenting Principle | 按理解步骤分段出现，不一次性摊开 | 输入先出现，变化再发生，输出最后展开 |
| A 如何被注意到 | Signaling Principle | 用高亮、路径、箭头、边框、scale、色彩对比引导注意 | 当前对象有 tint + 边框 + 轻微 scale |
| 哪些装饰要删 | Coherence Principle | 不帮助理解的粒子、光效、漂浮、旋转应降级或删除 | 背景只保留弱纹理，不抢主解释对象 |
| 每帧看哪里 | Cognitive Load | 每一帧只有一个主要视觉中心 | 当前讲条件补齐时，视觉中心在飞入的条件标签 |
| 动画是否成立 | Segmenting / Signaling / Motion as meaning | 每个动作必须对应一个理解动作 | 路径校正 = 方向变明确，模糊词消失 = 不确定性减少 |

### 4.4.1 A 如何出现的依据

当口播提到 A 时，不要直接默认“放一个写着 A 的卡片”。先判断 A 的信息类型：

| A 的类型 | 应该如何出现 | 理论依据 |
| -------- | ------------ | -------- |
| 实体 | 作为可见对象出现，位置靠近相关动作 | Multimedia + Spatial Contiguity |
| 状态 | 用颜色、清晰度、形状、密度或稳定性表达 | Processing Fluency + Signaling |
| 关系 | 用空间距离、连接线、箭头、包含关系或路径表达 | Spatial Contiguity + Signaling |
| 过程 | 用连续运动、阶段推进或路径绘制表达 | Segmenting |
| 证据 | 用证据本体 + 标签 + 结论层表达 | Coherence + Signaling |
| 结论 | 从前面因果链中浮现，不突然硬切 | Cognitive Load + Segmenting |

### 4.4.2 出现位置的依据

- 输入材料类对象靠近输入区出现，减少观众寻找成本。
- 转换过程类对象放在中间变化区，承担因果连接。
- 输出结果类对象放在输出区，作为前面变化的结果。
- 辅助标签靠近被标注对象，符合空间接近原则。
- 关键对象位于手机端中心安全区或清晰可读区域，降低外在认知负荷。

### 4.4.3 字号和尺寸的依据

字号不是审美偏好，而是认知负荷和加工流畅性问题：

- L1：当前理解任务的核心对象、核心结论或最终状态。
- L2：关键对象标签、阶段名、变量名。
- L3：辅助说明、来源、低优先级状态。

如果 L2 以上信息在 mobile-scaled 视图中不可读，应优先重排、拆页或降低信息量，而不是继续缩小字号。

### 4.4.4 动效选择的依据

| 动效 | 理解动作 | 理论依据 |
| ---- | -------- | -------- |
| 飞入 | 材料补齐、新变量进入系统 | Segmenting + Signaling |
| 淡入 | 辅助信息出现，不打断主注意力 | Cognitive Load |
| 路径绘制 | 过程展开、因果推进 | Segmenting |
| morph / 变形 | 状态转换、结构形成 | Multimedia |
| 消失 / 漂散 | 噪音减少、错误路径排除 | Coherence |
| 发光 / 高亮 | 到达、确认、验证成立 | Signaling |

如果一个动画无法回答“它让观众理解了什么”，它就是装饰，应降级或删除。

## 4.5 与 14 Visual Design System 的关系

14_VISUAL_DESIGN_SYSTEM_V1_ALPHA.md 是 Deep Research 后沉淀出的可执行视觉系统文件。

三层关系：

- 13 = 为什么这样设计（理论依据与来源）
- 14 = 具体怎么设计（字体系统、布局比例、scene pattern、motion rules、visual QA）
- 07 = 当前系统能怎么渲染（能力边界和实现状态）
- 06 = 怎么审片（审片规则和验收标准）

14 不直接新增 videoSpec 字段。14 用于指导 visualDirectionSpec、Remotion tokens、scene contracts、mobile scaled QA、visualMetrics.json 和审片规则。

---

## 5. 本系统如何使用这些依据

### 5.1 ChatGPT 策划时使用

ChatGPT 在生成 contentBrief 和 videoSpec 时，应参考本文件的理论依据来解释设计决策。例如：

- "S01 使用 cover + big-quote，因为前 2 秒需要最大化停留"
- "使用 progressive-reveal 而非 fade-in，因为 Segmenting Principle 要求分段呈现"
- "截图页使用标签化结构，因为 Coherence Principle 要求减少外在负荷"
- "标签必须靠近对象，因为 Spatial Contiguity 可以减少视线跳跃"
- "当前对象需要多信号高亮，因为 Signaling Principle 要求明确告诉观众看哪里"
- "删除不解释知识的光效和漂浮元素，因为 Coherence Principle 要求去掉无关材料"

### 5.2 Agent 执行时使用

Agent 在执行渲染、检查和审片时，应参考本文件来理解规则来源，但不能因为理论依据存在就生成未实现的能力。

### 5.3 用户最终决定

理论依据只提供设计参考。最终的内容方向、画面选择和发布决定由用户做出。

### 5.4 边界

- 任何理论依据都不能绕过当前能力边界
- 任何理论依据都不能绕过授权规则
- 任何理论依据都不能绕过质量门禁
- 理论依据不定义新的 videoSpec 字段
- 理论依据不代表当前 Remotion 已实现新能力
