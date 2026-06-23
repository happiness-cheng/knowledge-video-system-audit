# P1 Backlog

> 所有候选能力的可执行 backlog。每个 item 可直接交给 Agent A 执行。

---

## P1-BL-01: BGM 自动降低（voiceover ducking）

| 字段               | 内容                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| id                 | P1-BL-01                                                                                                            |
| title              | BGM 在 voiceover 播放时自动降低音量                                                                                 |
| problem            | 当前 BGM 固定音量，与 voiceover 重叠时听不清口播                                                                    |
| userValue          | 听感提升，口播清晰度提升                                                                                            |
| sourceBasis        | Mayer Coherence Principle (D-1)；Remotion Audio volume 回调 (A-4)                                                   |
| currentStatus      | BGM 已接入但固定音量                                                                                                |
| proposedSolution   | 在 KnowledgeVideo.tsx 中，BGM Audio 组件使用 volume 回调函数，当 voiceover 播放时返回 0.15（-20dB），间隔时返回 0.6 |
| affectedFiles      | `src/video-system/compositions/KnowledgeVideo.tsx`                                                                  |
| schemaImpact       | none                                                                                                                |
| implementationCost | S                                                                                                                   |
| risk               | low                                                                                                                 |
| testPlan           | 渲染视频，检查 voiceover 播放时 BGM 是否降低，间隔是否回升                                                          |
| previewAcceptance  | 手动听：口播段 BGM 不抢口播，间隔段 BGM 自然                                                                        |
| recommendedTier    | P1                                                                                                                  |
| priority           | P1-high                                                                                                             |
| dependency         | 无                                                                                                                  |
| whyNow             | 成本最低（S）、收益明确（听感质变）、理论依据强（Mayer Coherence）                                                  |

---

## P1-BL-02: 连续 scene 类型重复检测

| 字段               | 内容                                                                                                                                               |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                 | P1-BL-02                                                                                                                                           |
| title              | 检测连续出现相同 scene type 的情况                                                                                                                 |
| problem            | 连续出现同类型 scene（如两个 bullets 连续）会让画面像 PPT 轮播                                                                                     |
| userValue          | 视觉节奏感提升，减少 PPT 感                                                                                                                        |
| sourceBasis        | 07_STYLE_THEME_LAYOUT_RULES PPT 化检查清单                                                                                                         |
| currentStatus      | 无检测                                                                                                                                             |
| proposedSolution   | 在 generate-visual-metrics.ts 中添加连续 scene 类型检查：如果相邻 scene type 相同且都是静态类（bullets/title-subtitle/three-column），标记 inspect |
| affectedFiles      | `src/video-system/scripts/generate-visual-metrics.ts`                                                                                              |
| schemaImpact       | none                                                                                                                                               |
| implementationCost | S                                                                                                                                                  |
| risk               | low                                                                                                                                                |
| testPlan           | 运行 visual:metrics，构造连续同类型 scene 的 videoSpec，验证是否标记 inspect                                                                       |
| previewAcceptance  | previewVisualReport 中 inspectItems 包含连续重复的 scene                                                                                           |
| recommendedTier    | P1                                                                                                                                                 |
| priority           | P1-high                                                                                                                                            |
| dependency         | 无                                                                                                                                                 |
| whyNow             | 成本 S，直接解决"PPT 感"核心问题                                                                                                                   |

---

## P1-BL-03: screenText 字数上限检查

| 字段               | 内容                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| id                 | P1-BL-03                                                                                                |
| title              | screenText 字数 ≤30 字/scene 的硬检查                                                                   |
| problem            | screenText 可能全文堆砌，挤占视觉通道（Mayer Modality Principle）                                       |
| userValue          | 画面更干净，信息焦点更明确                                                                              |
| sourceBasis        | Mayer Modality Principle (D-1)                                                                          |
| currentStatus      | 无检查                                                                                                  |
| proposedSolution   | 在 generate-visual-metrics.ts 中添加 screenText 字数检查：超过 30 字标记 inspect，超过 50 字标记 revise |
| affectedFiles      | `src/video-system/scripts/generate-visual-metrics.ts`                                                   |
| schemaImpact       | none                                                                                                    |
| implementationCost | S                                                                                                       |
| risk               | low — 只做检查不截断，不破坏现有数据                                                                    |
| testPlan           | 运行 visual:metrics，构造 screenText 超长的 scene，验证是否标记                                         |
| previewAcceptance  | previewVisualReport 中 inspectItems 包含超长 screenText 的 scene                                        |
| recommendedTier    | P1                                                                                                      |
| priority           | P1-high                                                                                                 |
| dependency         | 无                                                                                                      |
| whyNow             | 成本 S，理论依据强，直接提升画面质量                                                                    |

---

## P1-BL-04: 静态页占比检查

| 字段               | 内容                                                                                                            |
| ------------------ | --------------------------------------------------------------------------------------------------------------- |
| id                 | P1-BL-04                                                                                                        |
| title              | 静态 scene 占比 ≤40% 的检查                                                                                     |
| problem            | 过多静态 scene（无动画/无 Sequence 内部时间轴）会让视频像幻灯片                                                 |
| userValue          | 视觉节奏感提升                                                                                                  |
| sourceBasis        | 07_STYLE_THEME_LAYOUT_RULES 静态页占比规则                                                                      |
| currentStatus      | 无检查                                                                                                          |
| proposedSolution   | 在 generate-visual-metrics.ts 中统计：无 Sequence 内部时间轴的 scene 占总 scene 数的比例，超过 40% 标记 inspect |
| affectedFiles      | `src/video-system/scripts/generate-visual-metrics.ts`                                                           |
| schemaImpact       | none                                                                                                            |
| implementationCost | S                                                                                                               |
| risk               | low                                                                                                             |
| testPlan           | 构造全静态 videoSpec，验证是否标记                                                                              |
| previewAcceptance  | previewVisualReport.summary 中反映静态页比例                                                                    |
| recommendedTier    | P1                                                                                                              |
| priority           | P1-medium                                                                                                       |
| dependency         | 无                                                                                                              |
| whyNow             | 与 P1-BL-02 配合，双维度解决 PPT 感                                                                             |

---

## P1-BL-05: 字号下限升级

| 字段               | 内容                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------ |
| id                 | P1-BL-05                                                                             |
| title              | 字号下限从 28px 提升到 32px（正文）                                                  |
| problem            | 当前正文 28px 在手机端缩小后可读性差                                                 |
| userValue          | 手机端可读性提升                                                                     |
| sourceBasis        | Processing Fluency (D-3) + WCAG AA 标准                                              |
| currentStatus      | CLAUDE.md 规定正文 28px，代码不检查                                                  |
| proposedSolution   | 在 sceneContracts.ts 中提升 minProjectedBodyPx 阈值；在 CLAUDE.md 中更新字号下限规则 |
| affectedFiles      | `src/video-system/visual/sceneContracts.ts`，`CLAUDE.md`                             |
| schemaImpact       | none                                                                                 |
| implementationCost | S                                                                                    |
| risk               | medium — 可能导致现有 scene 的 bodyFontSize 需要调整                                 |
| testPlan           | 运行 visual:metrics，检查是否有 scene 触发字号 inspect                               |
| previewAcceptance  | mobile_scaled_contact_sheet 中正文可读                                               |
| recommendedTier    | P1                                                                                   |
| priority           | P1-medium                                                                            |
| dependency         | 无                                                                                   |
| whyNow             | 手机端可读性是硬门槛，Processing Fluency 研究支持                                    |

---

## P1-BL-06: 封面标题字数检查

| 字段               | 内容                                                                       |
| ------------------ | -------------------------------------------------------------------------- |
| id                 | P1-BL-06                                                                   |
| title              | 封面主标题 ≤10 字、副标题 ≤15 字的检查                                     |
| problem            | 封面标题过长在缩略图尺寸下不可辨认                                         |
| userValue          | 点击率提升                                                                 |
| sourceBasis        | 小红书创作学院 (E-3) + 抖音创作者学院 (E-1)                                |
| currentStatus      | 无检查                                                                     |
| proposedSolution   | 在 validate-cover-spec.ts 中添加标题字数检查：主标题超过 10 字标记 inspect |
| affectedFiles      | `src/video-system/scripts/validate-cover-spec.ts`                          |
| schemaImpact       | none                                                                       |
| implementationCost | S                                                                          |
| risk               | low                                                                        |
| testPlan           | 构造标题超长的 coverSpec，验证是否标记                                     |
| previewAcceptance  | 封面渲染后标题在缩略图尺寸下仍可辨认                                       |
| recommendedTier    | P1                                                                         |
| priority           | P1-medium                                                                  |
| dependency         | 无                                                                         |
| whyNow             | 封面是点击率第一关，成本低收益高                                           |

---

## P1-BL-07: Hook scene 时长检查

| 字段               | 内容                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------- |
| id                 | P1-BL-07                                                                                |
| title              | Hook scene（第一个 scene）时长 ≤3 秒检查                                                |
| problem            | Hook 太长会降低完播率                                                                   |
| userValue          | 前 3 秒留存提升                                                                         |
| sourceBasis        | 抖音创作者学院 (E-1) + Mayer Signaling (D-1)                                            |
| currentStatus      | 有"前 3 秒 hook"规则但不检查实际时长                                                    |
| proposedSolution   | 在 validate-video-spec.ts 中检查第一个 scene 的 durationEstimate，超过 3 秒标记 inspect |
| affectedFiles      | `src/video-system/scripts/validate-video-spec.ts`                                       |
| schemaImpact       | none                                                                                    |
| implementationCost | S                                                                                       |
| risk               | low                                                                                     |
| testPlan           | 构造 Hook 超长的 videoSpec，验证是否标记                                                |
| previewAcceptance  | Hook scene 时长 ≤3 秒                                                                   |
| recommendedTier    | P1                                                                                      |
| priority           | P1-medium                                                                               |
| dependency         | 无                                                                                      |
| whyNow             | 完播率是平台推荐的核心指标                                                              |

---

## P1-BL-08: AGENTS.md 创建

| 字段               | 内容                                                                                                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                 | P1-BL-08                                                                                                                                                         |
| title              | 创建 AGENTS.md — Agent 执行约束文件                                                                                                                              |
| problem            | Agent 执行时无标准流程约束，可能乱造轮子                                                                                                                         |
| userValue          | Agent 执行质量稳定                                                                                                                                               |
| sourceBasis        | C-1 remotion-best-practices Skill                                                                                                                                |
| currentStatus      | 文件不存在                                                                                                                                                       |
| proposedSolution   | 创建 knowledge-video-system/AGENTS.md，包含：执行前必读 Skill 文件列表、CSS 禁令、validate:all 必须通过、preview:visual 必须通过、不得假装支持未实现能力等硬约束 |
| affectedFiles      | `knowledge-video-system/AGENTS.md`（新建）                                                                                                                       |
| schemaImpact       | none                                                                                                                                                             |
| implementationCost | S                                                                                                                                                                |
| risk               | low                                                                                                                                                              |
| testPlan           | Agent 执行时检查是否读取 AGENTS.md                                                                                                                               |
| previewAcceptance  | Agent 执行产物符合约束                                                                                                                                           |
| recommendedTier    | P1                                                                                                                                                               |
| priority           | P1-high                                                                                                                                                          |
| dependency         | 无                                                                                                                                                               |
| whyNow             | 防止未来 Agent 乱造轮子的最基础保障                                                                                                                              |

---

## P1-BL-09: primaryAreaRatio 简化估算

| 字段               | 内容                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| id                 | P1-BL-09                                                                                                                 |
| title              | 实现 primaryAreaRatio 的简化估算（替代 null）                                                                            |
| problem            | generate-visual-metrics 第 243 行写死 primaryAreaRatioEstimated: null，主体面积比检查完全失效                            |
| userValue          | 视觉 QA 更完整                                                                                                           |
| sourceBasis        | 14_VISUAL_DESIGN_SYSTEM + sceneContracts.ts                                                                              |
| currentStatus      | 代码写死 null                                                                                                            |
| proposedSolution   | 基于 scene type 和 screenText/items 数量估算主体面积比：标题类 0.35、列表类按项数递减、对比类 0.35。不追求精确，只做粗筛 |
| affectedFiles      | `src/video-system/scripts/generate-visual-metrics.ts`                                                                    |
| schemaImpact       | none                                                                                                                     |
| implementationCost | M                                                                                                                        |
| risk               | medium — 估算可能不准确，需要调参                                                                                        |
| testPlan           | 运行 visual:metrics，检查各 scene 的 primaryAreaRatioEstimated 是否有合理值                                              |
| previewAcceptance  | previewVisualReport 中不再有 null 值                                                                                     |
| recommendedTier    | P1                                                                                                                       |
| priority           | P1-high                                                                                                                  |
| dependency         | 无                                                                                                                       |
| whyNow             | 合约系统核心字段，null 状态让整个 SceneContract 形同虚设                                                                 |

---

## P1-BL-10: 对比度检查

| 字段               | 内容                                                                                                            |
| ------------------ | --------------------------------------------------------------------------------------------------------------- |
| id                 | P1-BL-10                                                                                                        |
| title              | 文字与背景对比度 ≥4.5:1 检查                                                                                    |
| problem            | 低对比度文字在手机端不可读                                                                                      |
| userValue          | 可读性保障                                                                                                      |
| sourceBasis        | WCAG AA + Processing Fluency (D-3)                                                                              |
| currentStatus      | 无检查                                                                                                          |
| proposedSolution   | 在 generate-visual-metrics.ts 中基于 theme 的 primaryText 和 background 颜色计算对比度，低于 4.5:1 标记 inspect |
| affectedFiles      | `src/video-system/scripts/generate-visual-metrics.ts`                                                           |
| schemaImpact       | none                                                                                                            |
| implementationCost | S                                                                                                               |
| risk               | low                                                                                                             |
| testPlan           | 使用深色主题（如 obsidian-claude-gradient）运行，检查对比度值                                                   |
| previewAcceptance  | 所有主题的文字对比度 ≥4.5:1                                                                                     |
| recommendedTier    | P1                                                                                                              |
| priority           | P1-low                                                                                                          |
| dependency         | 无                                                                                                              |
| whyNow             | WCAG 是国际标准，Processing Fluency 研究支持                                                                    |

---

## P1-BL-11: spring() 弹性动画增强

| 字段               | 内容                                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| id                 | P1-BL-11                                                                                                 |
| title              | 关键场景用 spring() 替代 linear interpolate                                                              |
| problem            | 当前动画偏线性，缺少弹性感                                                                               |
| userValue          | 动画更自然、更有生命力                                                                                   |
| sourceBasis        | A-8 Remotion 动画原语                                                                                    |
| currentStatus      | spring() 已引入但未充分使用                                                                              |
| proposedSolution   | 在 big-quote、cover、cta 场景中用 spring() 替代线性 interpolate；在 bullets 的逐条出现中加入 spring 回弹 |
| affectedFiles      | `src/video-system/scenes/BigQuoteScene.tsx`，`CoverScene.tsx`，`CtaScene.tsx`，`BulletsScene.tsx`        |
| schemaImpact       | none                                                                                                     |
| implementationCost | M                                                                                                        |
| risk               | low — spring 参数可调，不影响数据                                                                        |
| testPlan           | 渲染视频，对比 spring vs linear 的动画效果                                                               |
| previewAcceptance  | 视觉上动画有弹性回弹感                                                                                   |
| recommendedTier    | P1                                                                                                       |
| priority           | P1-medium                                                                                                |
| dependency         | 无                                                                                                       |
| whyNow             | 成本 M，视觉提升明显                                                                                     |

---

## P1-BL-12: 封面安全区检查

| 字段               | 内容                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------ |
| id                 | P1-BL-12                                                                             |
| title              | 封面文字避开底部 15%（平台 UI 遮挡区）                                               |
| problem            | 抖音/小红书的互动按钮会遮挡封面底部文字                                              |
| userValue          | 封面在平台预览中完整可见                                                             |
| sourceBasis        | E-1 抖音 + E-3 小红书                                                                |
| currentStatus      | 无检查                                                                               |
| proposedSolution   | 在 validate-cover-spec.ts 中检查封面布局的底部安全区（y > 85% 的区域不应有关键文字） |
| affectedFiles      | `src/video-system/scripts/validate-cover-spec.ts`                                    |
| schemaImpact       | none                                                                                 |
| implementationCost | S                                                                                    |
| risk               | low                                                                                  |
| testPlan           | 构造底部有文字的封面，验证是否标记                                                   |
| previewAcceptance  | 封面文字不在底部 15% 区域                                                            |
| recommendedTier    | P1                                                                                   |
| priority           | P1-low                                                                               |
| dependency         | 无                                                                                   |
| whyNow             | 平台适配的基础保障                                                                   |

---

## P1-BL-13: TransitionSeries 扩展 fade/slide

| 字段               | 内容                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| id                 | P1-BL-13                                                                                                |
| title              | 场景过渡从单一 wipe 扩展到 fade/slide 可选                                                              |
| problem            | 当前所有场景过渡都是 wipe，视觉单调                                                                     |
| userValue          | 视觉丰富度提升                                                                                          |
| sourceBasis        | A-1 TransitionSeries 官方文档                                                                           |
| currentStatus      | KnowledgeVideo.tsx 已用 TransitionSeries + wipe                                                         |
| proposedSolution   | 在 videoSpec 的 meta 或 scene 级别添加 transition 字段，KnowledgeVideo.tsx 根据字段选择 fade/slide/wipe |
| affectedFiles      | `src/video-system/compositions/KnowledgeVideo.tsx`，`src/video-system/data/videoSpec.json`（可选）      |
| schemaImpact       | low — 可选字段，不破坏现有 schema                                                                       |
| implementationCost | M                                                                                                       |
| risk               | medium — 需要测试每种转场对音频同步的影响                                                               |
| testPlan           | 分别用 fade/slide/wipe 渲染，检查过渡效果和音频同步                                                     |
| previewAcceptance  | 场景过渡不再是单调 wipe                                                                                 |
| recommendedTier    | P1                                                                                                      |
| priority           | P1-medium                                                                                               |
| dependency         | 无                                                                                                      |
| whyNow             | 当前已有 TransitionSeries 基础，扩展成本可控                                                            |

---

## P1-BL-14: contentBrief 提示词升级

| 字段               | 内容                                                                                                                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                 | P1-BL-14                                                                                                                                                                    |
| title              | contentBrief 提示词增加质量硬约束                                                                                                                                           |
| problem            | 当前提示词质量门禁不够硬，可能产出"我懂了什么"而非"你能拿走什么"                                                                                                            |
| userValue          | 视频内容更有获得感                                                                                                                                                          |
| sourceBasis        | 15_CONTENT_STRATEGY + 平台指南                                                                                                                                              |
| currentStatus      | 提示词有指导但无硬约束                                                                                                                                                      |
| proposedSolution   | 在 02_ARTICLE_TO_CONTENT_BRIEF_PROMPT 中添加：每个 brief 必须包含至少 1 个可复制模板/行动清单；标题禁止内部术语（Rules/Hook/Prompt/Skill）；标题必须在前 5 字包含核心关键词 |
| affectedFiles      | `knowledge-video-system/prompts/02_ARTICLE_TO_CONTENT_BRIEF_PROMPT.md`                                                                                                      |
| schemaImpact       | none                                                                                                                                                                        |
| implementationCost | S                                                                                                                                                                           |
| risk               | low — 只改提示词不改代码                                                                                                                                                    |
| testPlan           | 用新提示词生成 contentBrief，检查是否包含可复制模板                                                                                                                         |
| previewAcceptance  | contentBrief 包含至少 1 个模板/行动清单                                                                                                                                     |
| recommendedTier    | P1                                                                                                                                                                          |
| priority           | P1-high                                                                                                                                                                     |
| dependency         | 无                                                                                                                                                                          |
| whyNow             | 内容质量是根本，成本最低（只改文档）                                                                                                                                        |

---

## Backlog 统计

| 级别        | 数量   | 列表                                     |
| ----------- | ------ | ---------------------------------------- |
| P1-high     | 6      | BL-01, BL-02, BL-03, BL-08, BL-09, BL-14 |
| P1-medium   | 5      | BL-04, BL-05, BL-06, BL-07, BL-11, BL-13 |
| P1-low      | 2      | BL-10, BL-12                             |
| **P1 合计** | **14** |                                          |
