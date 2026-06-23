# P1 资源地图

> 调研时间：2026-06-17 | 调研目的：系统性梳理 Remotion 官方资源、社区实现、学习理论、平台指南，为 P1/P2 升级提供依据。

## 使用说明

每条资源按以下框架判断：

1. 解决什么真实问题？
2. 当前仓库是否已支持？
3. 推荐进入 P1 / P2 / reference-only / reject？

---

## A. Remotion 官方文档

### A-1. TransitionSeries 转场系统

| 字段                  | 内容                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| sourceId              | A-1                                                                                                                             |
| sourceName            | TransitionSeries — 场景转场                                                                                                     |
| sourceType            | official-doc                                                                                                                    |
| URL                   | https://www.remotion.dev/docs/transitions/transitionseries                                                                      |
| author                | Remotion                                                                                                                        |
| accessedAt            | 2026-06-17                                                                                                                      |
| reliability           | high                                                                                                                            |
| keyTakeaway           | TransitionSeries 提供 fade/slide/wipe 三种内置转场，支持 linearTiming 和 springTiming，转场会缩短总时长                         |
| relevantSystemProblem | 画面像自动 PPT — 当前场景硬切，无过渡                                                                                           |
| applicableStage       | render                                                                                                                          |
| currentRepoStatus     | partially-implemented — KnowledgeVideo.tsx 已用 TransitionSeries + wipe，但只有一种 wipe 效果                                   |
| recommendedTier       | P1                                                                                                                              |
| reason                | 当前已接入 wipe，但只用了一种效果。P1 可扩展 fade/slide，成本低（改 KnowledgeVideo.tsx 的 Transition 导入），收益大（观感质变） |

### A-2. calculateMetadata 动态元数据

| 字段                  | 内容                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------- |
| sourceId              | A-2                                                                                         |
| sourceName            | calculateMetadata — 动态时长计算                                                            |
| sourceType            | official-doc                                                                                |
| URL                   | https://www.remotion.dev/docs/calculate-metadata                                            |
| author                | Remotion                                                                                    |
| accessedAt            | 2026-06-17                                                                                  |
| reliability           | high                                                                                        |
| keyTakeaway           | Composition 的回调 prop，渲染前执行一次，可动态控制 durationInFrames/width/height/fps/props |
| relevantSystemProblem | 当前用 audioTiming.json 固定时长，需要手动计算帧数                                          |
| applicableStage       | render                                                                                      |
| currentRepoStatus     | not-implemented — KnowledgeVideo.tsx 直接读 audioTiming.json，没有 calculateMetadata 回调   |
| recommendedTier       | P1                                                                                          |
| reason                | 消除手动帧数配置，自动根据音频时长计算总帧数。改造成本 M，收益高（减少配置错误）            |

### A-3. @remotion/captions 字幕系统

| 字段                  | 内容                                                                                                                  |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| sourceId              | A-3                                                                                                                   |
| sourceName            | @remotion/captions — 逐词字幕                                                                                         |
| sourceType            | official-doc                                                                                                          |
| URL                   | https://www.remotion.dev/docs/captions                                                                                |
| author                | Remotion                                                                                                              |
| accessedAt            | 2026-06-17                                                                                                            |
| reliability           | high                                                                                                                  |
| keyTakeaway           | 标准化 Caption 类型，支持 Whisper/ElevenLabs 等 STT 来源，word-level 时间戳，逐词高亮                                 |
| relevantSystemProblem | 当前 spokenText 只给 TTS 用，无视觉字幕；字幕系统是自研 JSON                                                          |
| applicableStage       | subtitles / render                                                                                                    |
| currentRepoStatus     | not-implemented — 当前 subtitles.json 是自研格式，没有用 @remotion/captions                                           |
| recommendedTier       | P2                                                                                                                    |
| reason                | 收益高但成本 L：需要集成 Whisper 或复用 TTS 时间戳，实现逐词渲染，处理中英文混合分词。当前自研字幕系统够用，P2 再迁移 |

### A-4. Audio 组件高级功能

| 字段                  | 内容                                                                                                        |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| sourceId              | A-4                                                                                                         |
| sourceName            | Audio — volume 回调 / trimBefore / trimAfter                                                                |
| sourceType            | official-doc                                                                                                |
| URL                   | https://www.remotion.dev/docs/audio                                                                         |
| author                | Remotion                                                                                                    |
| accessedAt            | 2026-06-17                                                                                                  |
| reliability           | high                                                                                                        |
| keyTakeaway           | volume 支持逐帧回调（可做 BGM 淡入淡出），trimBefore/trimAfter 帧级裁剪                                     |
| relevantSystemProblem | 当前 BGM 是固定音量，voiceover 播放时 BGM 不降低                                                            |
| applicableStage       | render                                                                                                      |
| currentRepoStatus     | partially-implemented — 已用 Audio 组件播放 TTS 和 BGM，但没有 volume 回调做淡入淡出                        |
| recommendedTier       | P1                                                                                                          |
| reason                | BGM 在 voiceover 时自动降低（Mayer Coherence Principle），成本 S（改 KnowledgeVideo.tsx 的 BGM Audio 组件） |

### A-5. Sequence 高级用法

| 字段                  | 内容                                                                            |
| --------------------- | ------------------------------------------------------------------------------- |
| sourceId              | A-5                                                                             |
| sourceName            | Sequence — premountFor / 负 from / Series                                       |
| sourceType            | official-doc                                                                    |
| URL                   | https://www.remotion.dev/docs/sequence                                          |
| author                | Remotion                                                                        |
| accessedAt            | 2026-06-17                                                                      |
| reliability           | high                                                                            |
| keyTakeaway           | premountFor 提前挂载（音频预加载），负 from 实现"裁剪开头"，Series 自动顺序编排 |
| relevantSystemProblem | 音频可能延迟加载，影响同步                                                      |
| applicableStage       | render                                                                          |
| currentRepoStatus     | partially-implemented — premountFor={30} 已在用，负 from 和 Series 未探索       |
| recommendedTier       | P1                                                                              |
| reason                | premountFor 已用，但可优化值。负 from 和 Series 是内部优化，不暴露新能力        |

### A-6. staticFile / getStaticFiles

| 字段                  | 内容                                                                                |
| --------------------- | ----------------------------------------------------------------------------------- |
| sourceId              | A-6                                                                                 |
| sourceName            | staticFile — 静态资源加载                                                           |
| sourceType            | official-doc                                                                        |
| URL                   | https://www.remotion.dev/docs/staticfile                                            |
| author                | Remotion                                                                            |
| accessedAt            | 2026-06-17                                                                          |
| reliability           | high                                                                                |
| keyTakeaway           | 传入 public/ 下相对路径返回 URL，v4.0+ 自动 URI 编码。getStaticFiles() 枚举所有文件 |
| relevantSystemProblem | P0 已通过 toStaticFilePath() 统一路径协议                                           |
| applicableStage       | render                                                                              |
| currentRepoStatus     | implemented — P0 已修复路径协议                                                     |
| recommendedTier       | P0（已完成）                                                                        |
| reason                | P0 已解决，无需额外工作                                                             |

### A-7. renderMedia 性能选项

| 字段                  | 内容                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------ |
| sourceId              | A-7                                                                                        |
| sourceName            | renderMedia — concurrency / puppeteerInstance / slowestFrames                              |
| sourceType            | official-doc                                                                               |
| URL                   | https://www.remotion.dev/docs/renderer/render-media                                        |
| author                | Remotion                                                                                   |
| accessedAt            | 2026-06-17                                                                                 |
| reliability           | high                                                                                       |
| keyTakeaway           | concurrency 控制并发，puppeteerInstance 复用浏览器加速批量渲染，slowestFrames 定位性能瓶颈 |
| relevantSystemProblem | 当前渲染耗时较长（5271 帧约 5 分钟）                                                       |
| applicableStage       | render                                                                                     |
| currentRepoStatus     | partially-implemented — 用 CLI 渲染，未直接调用 renderMedia API                            |
| recommendedTier       | P2                                                                                         |
| reason                | 当前 CLI 够用，性能优化是锦上添花，不影响视频质量                                          |

### A-8. 文本动画原语

| 字段                  | 内容                                                                                                  |
| --------------------- | ----------------------------------------------------------------------------------------------------- |
| sourceId              | A-8                                                                                                   |
| sourceName            | interpolate / spring / useCurrentFrame 动画原语                                                       |
| sourceType            | official-doc                                                                                          |
| URL                   | https://www.remotion.dev/docs/animating-properties                                                    |
| author                | Remotion                                                                                              |
| accessedAt            | 2026-06-17                                                                                            |
| reliability           | high                                                                                                  |
| keyTakeaway           | interpolate 线性映射，spring 弹簧物理动画，useCurrentFrame 获取帧号。CSS transitions/animations 禁止  |
| relevantSystemProblem | 当前动画较基础（fade-in/slide-up/progressive-reveal），缺少 spring 弹簧动画和逐词高亮                 |
| applicableStage       | render                                                                                                |
| currentRepoStatus     | partially-implemented — interpolate 和 Easing.bezier 已在用，spring() 已引入但未充分使用              |
| recommendedTier       | P1                                                                                                    |
| reason                | spring() 可让动画更自然（弹簧回弹效果），typewriter/word-highlight 可提升 big-quote 和 bullets 表现力 |

---

## B. Remotion 官方模板与生态

### B-1. TikTok 模板（逐词字幕）

| 字段                  | 内容                                                                            |
| --------------------- | ------------------------------------------------------------------------------- |
| sourceId              | B-1                                                                             |
| sourceName            | template-tiktok — 逐词字幕动画                                                  |
| sourceType            | template                                                                        |
| URL                   | https://github.com/remotion-dev/template-tiktok                                 |
| author                | Remotion                                                                        |
| accessedAt            | 2026-06-17                                                                      |
| reliability           | high                                                                            |
| keyTakeaway           | Whisper.cpp 本地转录 + word-level 时间戳 + 逐词高亮动画，是最成熟的字幕渲染参考 |
| relevantSystemProblem | 当前无逐词字幕，自研 subtitles.json 只有 scene 级时间戳                         |
| applicableStage       | subtitles / render                                                              |
| currentRepoStatus     | not-implemented                                                                 |
| recommendedTier       | P2（设计参考）                                                                  |
| reason                | 模式值得参考，但实现成本 L，P2 再做                                             |

### B-2. Onda 组件库

| 字段                  | 内容                                                                           |
| --------------------- | ------------------------------------------------------------------------------ |
| sourceId              | B-2                                                                            |
| sourceName            | Onda — 70 个 Remotion 组件 + 18 种转场                                         |
| sourceType            | official-resource                                                              |
| URL                   | https://onda.video/                                                            |
| author                | Onda                                                                           |
| accessedAt            | 2026-06-17                                                                     |
| reliability           | medium                                                                         |
| keyTakeaway           | 70 个可复用组件（标题、卡片、列表、图表等）+ 18 种转场效果，npm 安装即用       |
| relevantSystemProblem | 当前 17 个 scene type 全部自研，缺少高质量组件参考                             |
| applicableStage       | render                                                                         |
| currentRepoStatus     | not-implemented                                                                |
| recommendedTier       | P2（参考）                                                                     |
| reason                | 组件风格可能与当前主题系统不一致，直接集成风险高。可参考其动画模式，不直接引入 |

### B-3. RemotionUI

| 字段                  | 内容                                       |
| --------------------- | ------------------------------------------ |
| sourceId              | B-3                                        |
| sourceName            | RemotionUI — 生产级动效组件                |
| sourceType            | official-resource                          |
| URL                   | https://remotionui.com                     |
| author                | RemotionUI                                 |
| accessedAt            | 2026-06-17                                 |
| reliability           | medium                                     |
| keyTakeaway           | 生产级 UI 组件库，动画质量高               |
| relevantSystemProblem | 当前组件动画较基础                         |
| applicableStage       | render                                     |
| currentRepoStatus     | not-implemented                            |
| recommendedTier       | reference-only                             |
| reason                | 风格偏 SaaS/商业，与知识视频定位不完全匹配 |

### B-4. remotion-animate-text

| 字段                  | 内容                                                       |
| --------------------- | ---------------------------------------------------------- |
| sourceId              | B-4                                                        |
| sourceName            | remotion-animate-text — 文本动画辅助库                     |
| sourceType            | open-source                                                |
| URL                   | https://github.com/pskd73/remotion-animate-text            |
| author                | pskd73                                                     |
| accessedAt            | 2026-06-17                                                 |
| reliability           | medium                                                     |
| keyTakeaway           | 提供 typewriter、word-by-word、fade-in-word 等文本动画模式 |
| relevantSystemProblem | 文档标记 typewriter/word-highlight 为"待实现"              |
| applicableStage       | render                                                     |
| currentRepoStatus     | not-implemented                                            |
| recommendedTier       | P1（参考+评估引入）                                        |
| reason                | 可评估直接引入或参考实现，成本取决于与当前主题系统的兼容性 |

### B-5. Prompt to Video 模板

| 字段                  | 内容                                                     |
| --------------------- | -------------------------------------------------------- |
| sourceId              | B-5                                                      |
| sourceName            | template-prompt-to-video — AI 图文+配音                  |
| sourceType            | template                                                 |
| URL                   | https://github.com/remotion-dev/template-prompt-to-video |
| author                | Remotion                                                 |
| accessedAt            | 2026-06-17                                               |
| reliability           | high                                                     |
| keyTakeaway           | AI 生成图文素材 + TTS 配音 → 自动合成视频的完整流程架构  |
| relevantSystemProblem | 与当前"文章转知识视频"流程高度类似                       |
| applicableStage       | agent-workflow                                           |
| currentRepoStatus     | not-implemented（流程参考）                              |
| recommendedTier       | reference-only                                           |
| reason                | 流程架构有参考价值，但当前系统已自建完整管线，不需要替换 |

---

## C. remotion-best-practices / Agent Skills

### C-1. remotion-best-practices Skill

| 字段                  | 内容                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| sourceId              | C-1                                                                                                                                   |
| sourceName            | remotion-best-practices — Agent Skill                                                                                                 |
| sourceType            | skill                                                                                                                                 |
| URL                   | 本地：.claude/skills/remotion-best-practices/                                                                                         |
| author                | 项目内建                                                                                                                              |
| accessedAt            | 2026-06-17                                                                                                                            |
| reliability           | high                                                                                                                                  |
| keyTakeaway           | 30+ 规则文件覆盖 subtitles/transitions/text-animations/voiceover/images/audio/sequencing/timing/display-captions 等全部 Remotion 能力 |
| relevantSystemProblem | Agent 执行时未充分利用官方 Skill                                                                                                      |
| applicableStage       | agent-workflow                                                                                                                        |
| currentRepoStatus     | partially-implemented — Skill 文件存在，但 Agent 执行时读取不完整                                                                     |
| recommendedTier       | P1                                                                                                                                    |
| reason                | 在 AGENTS.md 中强制要求 Agent 执行前读取相关 Skill 文件                                                                               |

### C-2. CSS 禁令执行

| 字段                  | 内容                                                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| sourceId              | C-2                                                                                             |
| sourceName            | CSS transitions/animations 禁令                                                                 |
| sourceType            | skill                                                                                           |
| URL                   | remotion-best-practices/SKILL.md                                                                |
| author                | Remotion 官方                                                                                   |
| accessedAt            | 2026-06-17                                                                                      |
| reliability           | high                                                                                            |
| keyTakeaway           | CSS transitions/animations/Tailwind 动画类名在 Remotion 渲染中不生效，必须用 interpolate/spring |
| relevantSystemProblem | Agent 可能误用 CSS 动画                                                                         |
| applicableStage       | agent-workflow                                                                                  |
| currentRepoStatus     | partially-implemented — CLAUDE.md 有规则，但没有自动检测                                        |
| recommendedTier       | P1                                                                                              |
| reason                | 在 validate:render 中添加 CSS 动画类名检测                                                      |

---

## D. 学习理论

### D-1. Mayer 多媒体学习理论

| 字段                  | 内容                                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| sourceId              | D-1                                                                                                                    |
| sourceName            | Mayer Multimedia Learning Theory                                                                                       |
| sourceType            | theory                                                                                                                 |
| URL                   | Mayer, R. E. (2001). Multimedia Learning. Cambridge University Press.                                                  |
| author                | Richard Mayer                                                                                                          |
| accessedAt            | 2026-06-17                                                                                                             |
| reliability           | high                                                                                                                   |
| keyTakeaway           | 5 大原则：coherence（去装饰）、signaling（高亮关键）、segmenting（分段）、modality（语音优先）、multimedia（图文结合） |
| relevantSystemProblem | 当前 screenText 可能全文堆砌、缺少视觉信号、信息密度不均                                                               |
| applicableStage       | contentBrief / videoSpec                                                                                               |
| currentRepoStatus     | partially-implemented — 13_REFERENCE_BASIS 引用了理论，但代码层没有硬约束                                              |
| recommendedTier       | P1                                                                                                                     |
| reason                | 转化为可检查的规则：screenText 字数上限、禁止纯文字页、BGM 自动降低                                                    |

### D-2. Sweller 认知负荷理论

| 字段                  | 内容                                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------- |
| sourceId              | D-2                                                                                                             |
| sourceName            | Sweller Cognitive Load Theory                                                                                   |
| sourceType            | theory                                                                                                          |
| URL                   | Sweller, J. (1988). Cognitive load during problem solving. Cognitive Science, 12(2), 257-285.                   |
| author                | John Sweller                                                                                                    |
| accessedAt            | 2026-06-17                                                                                                      |
| reliability           | high                                                                                                            |
| keyTakeaway           | 三种负荷：intrinsic（内容复杂度）、extraneous（设计额外负荷）、germane（有效学习负荷）。目标是最小化 extraneous |
| relevantSystemProblem | 信息密度不均、复杂场景时长不够、等权排列增加 extraneous load                                                    |
| applicableStage       | videoSpec / render                                                                                              |
| currentRepoStatus     | partially-implemented — 有"每页最多 3 个信息点"规则，但代码不检查                                               |
| recommendedTier       | P1                                                                                                              |
| reason                | 转化为 visualMetrics 检查项：连续 scene 类型重复检测、静态页占比检查                                            |

### D-3. Processing Fluency 加工流畅性

| 字段                  | 内容                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| sourceId              | D-3                                                                                                                                   |
| sourceName            | Processing Fluency — 视觉可读性与信任感                                                                                               |
| sourceType            | theory                                                                                                                                |
| URL                   | Reber, R., Schwarz, N., & Winkielman, P. (2004). Processing fluency and aesthetic pleasure. Personality and Social Psychology Review. |
| author                | Reber, Schwarz, Winkielman                                                                                                            |
| accessedAt            | 2026-06-17                                                                                                                            |
| reliability           | high                                                                                                                                  |
| keyTakeaway           | 用户 17-50ms 内判断视觉吸引力；高对比度+大字号+简洁排版 = 高加工流畅性 = 高信任                                                       |
| relevantSystemProblem | 字号下限偏低（正文 28px）、缺少对比度约束、行间距不够                                                                                 |
| applicableStage       | render                                                                                                                                |
| currentRepoStatus     | partially-implemented — 有字号下限但偏低，有 projectedMobilePx 但不检查对比度                                                         |
| recommendedTier       | P1                                                                                                                                    |
| reason                | 升级字号下限（28→32px）、添加对比度检查（WCAG 4.5:1）、行间距约束                                                                     |

---

## E. 平台创作者指南

### E-1. 抖音创作者学院

| 字段                  | 内容                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------- |
| sourceId              | E-1                                                                                       |
| sourceName            | 抖音创作者学院 — 封面/标题/完播率                                                         |
| sourceType            | platform-official                                                                         |
| URL                   | https://school.oceanengine.com/                                                           |
| author                | 抖音                                                                                      |
| accessedAt            | 2026-06-17                                                                                |
| reliability           | high                                                                                      |
| keyTakeaway           | 前 3 秒决定 80% 完播率；封面文字 ≥24 号居中；标题 ≤20 字关键词前置；知识类用数字+痛点句式 |
| relevantSystemProblem | Hook 时长控制、封面标题长度、前几秒留存                                                   |
| applicableStage       | contentBrief / coverSpec                                                                  |
| currentRepoStatus     | partially-implemented — 有"前 3 秒 hook"规则，但代码不检查 Hook 时长                      |
| recommendedTier       | P1                                                                                        |
| reason                | 转化为 validate:spec 检查项：Hook scene 时长 ≤3s、封面标题字数检查                        |

### E-2. B站创作学院

| 字段                  | 内容                                                                             |
| --------------------- | -------------------------------------------------------------------------------- |
| sourceId              | E-2                                                                              |
| sourceName            | B站创作学院 — 知识区创作者指南                                                   |
| sourceType            | platform-official                                                                |
| URL                   | https://member.bilibili.com/                                                     |
| author                | B站                                                                              |
| accessedAt            | 2026-06-17                                                                       |
| reliability           | high                                                                             |
| keyTakeaway           | 知识类视频最佳 3-8 分钟；封面 16:9 横版大字标题；深度 > 信息密度；弹幕触发点设计 |
| relevantSystemProblem | 视频时长控制、封面横版适配                                                       |
| applicableStage       | contentBrief / coverSpec                                                         |
| currentRepoStatus     | partially-implemented — 有 4:3 横版封面，但没有弹幕触发点设计                    |
| recommendedTier       | P1                                                                               |
| reason                | 横版封面已支持；弹幕触发点是策划层规则，写入提示词即可                           |

### E-3. 小红书创作学院

| 字段                  | 内容                                                                      |
| --------------------- | ------------------------------------------------------------------------- |
| sourceId              | E-3                                                                       |
| sourceName            | 小红书创作学院 — 封面/标题设计                                            |
| sourceType            | platform-official                                                         |
| URL                   | https://school.xiaohongshu.com/                                           |
| author                | 小红书                                                                    |
| accessedAt            | 2026-06-17                                                                |
| reliability           | high                                                                      |
| keyTakeaway           | 3:4 竖版封面；主标题 3-7 字 ≥80px；总字数 ≤15；高对比度；文字避开底部 15% |
| relevantSystemProblem | 封面标题长度、字号、安全区                                                |
| applicableStage       | coverSpec                                                                 |
| currentRepoStatus     | partially-implemented — 有 3:4 竖版封面，但没有标题字数和安全区检查       |
| recommendedTier       | P1                                                                        |
| reason                | 转化为 coverSpec validate 检查项                                          |

### E-4. 知乎创作中心

| 字段                  | 内容                                               |
| --------------------- | -------------------------------------------------- |
| sourceId              | E-4                                                |
| sourceName            | 知乎创作中心 — 内容质量标准                        |
| sourceType            | platform-official                                  |
| URL                   | https://creator.zhihu.com/                         |
| author                | 知乎                                               |
| accessedAt            | 2026-06-17                                         |
| reliability           | medium                                             |
| keyTakeaway           | 偏好深度专业内容；标题偏问句形式；数据引用标注来源 |
| relevantSystemProblem | 标题策略、内容深度                                 |
| applicableStage       | contentBrief                                       |
| currentRepoStatus     | not-implemented                                    |
| recommendedTier       | P1（提示词升级）                                   |
| reason                | 标题问句结构写入 contentBrief 提示词即可           |

---

## F. UX 研究

### F-1. NNGroup 信息气味研究

| 字段                  | 内容                                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| sourceId              | F-1                                                                                                      |
| sourceName            | NNGroup — Information Scent / Scannability                                                               |
| sourceType            | UX-research                                                                                              |
| URL                   | https://www.nngroup.com/                                                                                 |
| author                | Nielsen Norman Group                                                                                     |
| accessedAt            | 2026-06-17                                                                                               |
| reliability           | high                                                                                                     |
| keyTakeaway           | 用户根据标题和缩略图的"信息气味"决定是否点击；F 型注意力模式；concise+scannable 内容任务完成时间降低 58% |
| relevantSystemProblem | 视频标题信息气味、scene 内信息层级                                                                       |
| applicableStage       | contentBrief / render                                                                                    |
| currentRepoStatus     | partially-implemented — 有进度信息常驻（SceneChrome），但标题信息气味没有硬约束                          |
| recommendedTier       | P1                                                                                                       |
| reason                | 标题关键词前置写入提示词；screenText 视觉层级在 scene 组件中实现                                         |

---

## 资源统计

| 分类        | 总数   | P1     | P2    | reference-only | reject |
| ----------- | ------ | ------ | ----- | -------------- | ------ |
| 官方文档    | 8      | 5      | 2     | 0              | 0      |
| 模板/生态   | 5      | 1      | 2     | 2              | 0      |
| Agent Skill | 2      | 2      | 0     | 0              | 0      |
| 学习理论    | 3      | 3      | 0     | 0              | 0      |
| 平台指南    | 4      | 4      | 0     | 0              | 0      |
| UX 研究     | 1      | 1      | 0     | 0              | 0      |
| **合计**    | **23** | **16** | **4** | **2**          | **0**  |
