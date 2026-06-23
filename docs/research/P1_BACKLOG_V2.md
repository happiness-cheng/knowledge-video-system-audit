# P1 Backlog V2

> 深度研究修正版。每个 item 增加 sourceConfidence / claimStatus / ruleType 字段。

---

## P1-BL-01: BGM 自动降低（voiceover ducking）

| 字段               | 内容                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| id                 | P1-BL-01                                                                                               |
| title              | BGM 在 voiceover 播放时自动降低音量                                                                    |
| problem            | 当前 BGM 固定音量，与 voiceover 重叠时听不清口播                                                       |
| sourceBasis        | Mayer Coherence Principle; Remotion Audio volume 回调                                                  |
| sourceConfidence   | high                                                                                                   |
| claimStatus        | supported                                                                                              |
| ruleType           | backlog                                                                                                |
| currentStatus      | BGM 已接入但固定音量                                                                                   |
| proposedSolution   | KnowledgeVideo.tsx BGM Audio 组件使用 volume 回调：voiceover 在场时 0.15，间隔时 0.6。阈值做成顶部常量 |
| affectedFiles      | `src/video-system/compositions/KnowledgeVideo.tsx`                                                     |
| notAllowedFiles    | `src/video-system/data/*.json`, `src/video-system/scenes/*.tsx`, `src/video-system/themes/*.ts`        |
| schemaImpact       | none                                                                                                   |
| implementationCost | S                                                                                                      |
| risk               | low                                                                                                    |
| testPlan           | 渲染视频，手动检查 voiceover 段 BGM 是否降低                                                           |
| previewAcceptance  | 口播段 BGM 不抢口播，间隔段 BGM 自然                                                                   |
| recommendedTier    | P1                                                                                                     |
| priority           | P1-high                                                                                                |
| executionPackage   | P1-3                                                                                                   |
| dependency         | 无                                                                                                     |
| whyNow             | 成本 S，听感质变，理论依据强                                                                           |
| whyNotNow          | 不是系统治理第一优先级，排在 P1-1/P1-2 之后                                                            |
| note               | 值得做，但不是 P1 第一包。排在 AGENTS/QA 增强之后                                                      |

---

## P1-BL-02: 连续 scene 类型重复检测

| 字段               | 内容                                                                                                                 |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| id                 | P1-BL-02                                                                                                             |
| title              | 检测连续出现相同 scene type                                                                                          |
| problem            | 连续同类型 scene 让画面像 PPT 轮播                                                                                   |
| sourceBasis        | 07_STYLE_THEME_LAYOUT_RULES PPT 化检查清单                                                                           |
| sourceConfidence   | medium                                                                                                               |
| claimStatus        | partially-supported                                                                                                  |
| ruleType           | inspect                                                                                                              |
| currentStatus      | 无检测                                                                                                               |
| proposedSolution   | generate-visual-metrics.ts：相邻 scene type 相同且属静态类（bullets/title-subtitle/three-column/pros-cons）→ inspect |
| affectedFiles      | `src/video-system/scripts/generate-visual-metrics.ts`                                                                |
| notAllowedFiles    | `src/video-system/scenes/*.tsx`, `src/video-system/themes/*.ts`                                                      |
| schemaImpact       | none                                                                                                                 |
| implementationCost | S                                                                                                                    |
| risk               | low                                                                                                                  |
| testPlan           | 构造连续同类型 scene 的 videoSpec，验证是否标记 inspect                                                              |
| previewAcceptance  | previewVisualReport.inspectItems 包含连续重复 scene                                                                  |
| recommendedTier    | P1                                                                                                                   |
| priority           | P1-high                                                                                                              |
| executionPackage   | P1-2                                                                                                                 |
| dependency         | 无                                                                                                                   |
| whyNow             | 成本 S，直接解决 PPT 感                                                                                              |
| whyNotNow          | —                                                                                                                    |
| note               | 合理的启发式检查，但不做 hard error                                                                                  |

---

## P1-BL-03: screenText 字数分级检查

| 字段               | 内容                                                                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                 | P1-BL-03                                                                                                                                                      |
| title              | screenText 字数 inspect 分级                                                                                                                                  |
| problem            | screenText 可能全文堆砌，挤占视觉通道                                                                                                                         |
| sourceBasis        | Mayer Modality Principle; AGENTS.md "不要把口播全文显示在画面中"                                                                                              |
| sourceConfidence   | medium                                                                                                                                                        |
| claimStatus        | overclaimed if written as hard-rule                                                                                                                           |
| ruleType           | inspect                                                                                                                                                       |
| currentStatus      | AGENTS.md 有文本规则，无代码级检查                                                                                                                            |
| proposedSolution   | generate-visual-metrics.ts：>15 字 inspect, >30 字 high inspect / revise candidate。最终是否 revise 结合 scene type、字号、行数、停留时长、mobile_scaled 判断 |
| affectedFiles      | `src/video-system/scripts/generate-visual-metrics.ts`                                                                                                         |
| notAllowedFiles    | `src/video-system/scenes/*.tsx`, `src/video-system/data/videoSpec.json`                                                                                       |
| schemaImpact       | none                                                                                                                                                          |
| implementationCost | S                                                                                                                                                             |
| risk               | low                                                                                                                                                           |
| testPlan           | 构造 screenText 超长的 scene，验证是否标记                                                                                                                    |
| previewAcceptance  | previewVisualReport.inspectItems 包含超长 screenText scene                                                                                                    |
| recommendedTier    | P1                                                                                                                                                            |
| priority           | P1-high                                                                                                                                                       |
| executionPackage   | P1-2                                                                                                                                                          |
| dependency         | 无                                                                                                                                                            |
| whyNow             | 理论依据强，成本低                                                                                                                                            |
| whyNotNow          | —                                                                                                                                                             |
| note               | 不能写成官方硬规则。阈值是项目经验值，需在实际视频上校准                                                                                                      |
| suggestedThreshold | >15 chars: inspect, >30 chars: high inspect / revise candidate                                                                                                |

---

## P1-BL-04: 静态页占比检查

| 字段               | 内容                                                                           |
| ------------------ | ------------------------------------------------------------------------------ |
| id                 | P1-BL-04                                                                       |
| title              | 静态 scene 占比 ≤40% inspect                                                   |
| problem            | 过多静态 scene 让视频像幻灯片                                                  |
| sourceBasis        | 07_STYLE_THEME_LAYOUT_RULES                                                    |
| sourceConfidence   | medium                                                                         |
| claimStatus        | partially-supported                                                            |
| ruleType           | inspect                                                                        |
| currentStatus      | 无检查                                                                         |
| proposedSolution   | generate-visual-metrics.ts：无 Sequence 内部时间轴的 scene 占比 >40% → inspect |
| affectedFiles      | `src/video-system/scripts/generate-visual-metrics.ts`                          |
| notAllowedFiles    | `src/video-system/scenes/*.tsx`                                                |
| schemaImpact       | none                                                                           |
| implementationCost | S                                                                              |
| risk               | low                                                                            |
| testPlan           | 构造全静态 videoSpec，验证是否标记                                             |
| previewAcceptance  | previewVisualReport.summary 反映静态页比例                                     |
| recommendedTier    | P1                                                                             |
| priority           | P1-medium                                                                      |
| executionPackage   | P1-2                                                                           |
| dependency         | 无                                                                             |
| whyNow             | 与 P1-BL-02 配合解决 PPT 感                                                    |
| whyNotNow          | —                                                                              |
| note               | 启发式检查，不自动 revise                                                      |

---

## P1-BL-05: 字号 mobile_scaled 经验线

| 字段               | 内容                                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| id                 | P1-BL-05                                                                                            |
| title              | 字号 32px 作为 mobile_scaled inspect 经验线                                                         |
| problem            | 当前正文 28px 在手机端缩小后可读性差                                                                |
| sourceBasis        | Processing Fluency; mobile_scaled 经验                                                              |
| sourceConfidence   | medium                                                                                              |
| claimStatus        | partially-supported                                                                                 |
| ruleType           | inspect                                                                                             |
| currentStatus      | AGENTS.md 规定正文 28px                                                                             |
| proposedSolution   | sceneContracts.ts 中 minProjectedBodyPx 参考值调整；visualMetrics 中基于 mobile_scaled 结果 inspect |
| affectedFiles      | `src/video-system/visual/sceneContracts.ts`, `src/video-system/scripts/generate-visual-metrics.ts`  |
| notAllowedFiles    | `src/video-system/themes/*.ts`                                                                      |
| schemaImpact       | none                                                                                                |
| implementationCost | S                                                                                                   |
| risk               | medium — 可能导致现有 scene 触发 inspect                                                            |
| testPlan           | 运行 visual:metrics 检查是否有 scene 触发                                                           |
| previewAcceptance  | mobile_scaled_contact_sheet 中正文可读                                                              |
| recommendedTier    | P1                                                                                                  |
| priority           | P1-medium                                                                                           |
| executionPackage   | P1-2                                                                                                |
| dependency         | 无                                                                                                  |
| whyNow             | 手机端可读性是硬门槛                                                                                |
| whyNotNow          | —                                                                                                   |
| note               | 32px 是项目经验目标，不是官方硬标准。真正可做强规则的是对比度 WCAG                                  |

---

## P1-BL-06: 封面标题字数检查

| 字段               | 内容                                                                                     |
| ------------------ | ---------------------------------------------------------------------------------------- |
| id                 | P1-BL-06                                                                                 |
| title              | 封面主标题字数 inspect                                                                   |
| problem            | 封面标题过长在缩略图尺寸下不可辨认                                                       |
| sourceBasis        | 小红书创作学院 + 抖音创作者学院                                                          |
| sourceConfidence   | medium                                                                                   |
| claimStatus        | unsupported as hard-rule                                                                 |
| ruleType           | inspect                                                                                  |
| currentStatus      | 无检查                                                                                   |
| proposedSolution   | validate-cover-spec.ts：标题字数检查。硬规则是不语义断裂、不孤行、手机可读、双封面都成立 |
| affectedFiles      | `src/video-system/scripts/validate-cover-spec.ts`                                        |
| notAllowedFiles    | `src/video-system/compositions/CoverComposition.tsx`                                     |
| schemaImpact       | none                                                                                     |
| implementationCost | S                                                                                        |
| risk               | low                                                                                      |
| testPlan           | 构造标题超长 coverSpec，验证是否标记                                                     |
| previewAcceptance  | 封面标题在缩略图尺寸下可辨认                                                             |
| recommendedTier    | P1                                                                                       |
| priority           | P1-medium                                                                                |
| executionPackage   | P1-2                                                                                     |
| dependency         | 无                                                                                       |
| whyNow             | 封面是点击率第一关                                                                       |
| whyNotNow          | —                                                                                        |
| note               | 10 字以内是建议不是硬规则。platform heuristic                                            |

---

## P1-BL-07: Hook 价值承诺检查

| 字段               | 内容                                                                                                              |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| id                 | P1-BL-07                                                                                                          |
| title              | Hook scene 前 3-5 秒价值承诺 inspect                                                                              |
| problem            | Hook 太长或没有明确痛点会降低完播率                                                                               |
| sourceBasis        | 抖音创作者学院 + Mayer Signaling                                                                                  |
| sourceConfidence   | medium                                                                                                            |
| claimStatus        | unsupported as hard-rule                                                                                          |
| ruleType           | inspect                                                                                                           |
| currentStatus      | AGENTS.md 有"前 3 秒 hook"规则，不检查实际时长                                                                    |
| proposedSolution   | validate-video-spec.ts：检查 S01 durationEstimate 和内容。不机械报错 S01 ≤3s，而是检查前 3-5 秒是否完成痛点与承诺 |
| affectedFiles      | `src/video-system/scripts/validate-video-spec.ts`                                                                 |
| notAllowedFiles    | `src/video-system/data/videoSpec.json`                                                                            |
| schemaImpact       | none                                                                                                              |
| implementationCost | S                                                                                                                 |
| risk               | low                                                                                                               |
| testPlan           | 构造 Hook 超长 videoSpec，验证是否标记                                                                            |
| previewAcceptance  | 前 3-5 秒有明确痛点/承诺                                                                                          |
| recommendedTier    | P1                                                                                                                |
| priority           | P1-medium                                                                                                         |
| executionPackage   | P1-2                                                                                                              |
| dependency         | 无                                                                                                                |
| whyNow             | 完播率核心指标                                                                                                    |
| whyNotNow          | —                                                                                                                 |
| note               | 检查价值承诺，不机械报错。S01 是否 0-2 秒让用户知道痛点，S02 是否 2-5 秒给继续理由                                |

---

## P1-BL-08: AGENTS.md 审查与增强

| 字段               | 内容                                                                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| id                 | P1-BL-08                                                                                                                                |
| title              | 审查并增强现有 AGENTS.md                                                                                                                |
| problem            | AGENTS.md 需要补充 P0 新增能力边界和 Remotion 执行硬约束                                                                                |
| sourceBasis        | AGENTS.md 已存在（根目录 360 行）+ P0 新增能力                                                                                          |
| sourceConfidence   | high                                                                                                                                    |
| claimStatus        | corrected                                                                                                                               |
| ruleType           | hard-rule documentation                                                                                                                 |
| currentStatus      | 文件已存在，包含完整执行约束                                                                                                            |
| proposedSolution   | patch/merge：补充 P0 新增能力（toStaticFilePath、双预览产物、renderManifest）、mobile_scaled 非 9:16 定义、未实现能力不得写入 videoSpec |
| affectedFiles      | `AGENTS.md`（根目录）                                                                                                                   |
| notAllowedFiles    | `src/video-system/*`, `package.json`                                                                                                    |
| schemaImpact       | none                                                                                                                                    |
| implementationCost | S                                                                                                                                       |
| risk               | zero                                                                                                                                    |
| testPlan           | 文档自检 + grep 检查关键规则                                                                                                            |
| previewAcceptance  | AGENTS.md 包含 P0 新能力边界                                                                                                            |
| recommendedTier    | P1                                                                                                                                      |
| priority           | P1-high                                                                                                                                 |
| executionPackage   | P1-1                                                                                                                                    |
| dependency         | P0 Landing 完成                                                                                                                         |
| whyNow             | 防止未来 Agent 乱造轮子                                                                                                                 |
| whyNotNow          | 需等 P0 完成后确认最终文件状态                                                                                                          |
| note               | **文件已存在，任务是审查和增强，不是创建。禁止覆盖**                                                                                    |

---

## P1-BL-09: primaryAreaRatio 粗估

| 字段               | 内容                                                                                |
| ------------------ | ----------------------------------------------------------------------------------- |
| id                 | P1-BL-09                                                                            |
| title              | primaryAreaRatio scene type heuristic estimate                                      |
| problem            | generate-visual-metrics:243 写死 null，合约系统部分失效                             |
| sourceBasis        | 14_VISUAL_DESIGN_SYSTEM + sceneContracts.ts                                         |
| sourceConfidence   | medium                                                                              |
| claimStatus        | partially-supported                                                                 |
| ruleType           | inspect                                                                             |
| currentStatus      | 代码写死 null                                                                       |
| proposedSolution   | 基于 scene type 粗估：标题类 0.35、列表类按项数递减、对比类 0.35。不追求精确        |
| affectedFiles      | `src/video-system/scripts/generate-visual-metrics.ts`                               |
| notAllowedFiles    | `src/video-system/scenes/*.tsx`                                                     |
| schemaImpact       | none                                                                                |
| implementationCost | M                                                                                   |
| risk               | medium — 估算不准确需调参                                                           |
| testPlan           | 运行 visual:metrics 检查各 scene 的估算值                                           |
| previewAcceptance  | previewVisualReport 中不再有 null                                                   |
| recommendedTier    | P1                                                                                  |
| priority           | P1-high                                                                             |
| executionPackage   | P1-2                                                                                |
| dependency         | 无                                                                                  |
| whyNow             | 合约系统核心字段                                                                    |
| whyNotNow          | —                                                                                   |
| note               | 先做 scene type heuristic estimate，不做精确 DOM 测量。不得把粗估值写成精确视觉指标 |

---

## P1-BL-10: 对比度 WCAG 检查

| 字段               | 内容                                                                                                                       |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| id                 | P1-BL-10                                                                                                                   |
| title              | 文字与背景对比度 WCAG 检查                                                                                                 |
| problem            | 低对比度文字在手机端不可读                                                                                                 |
| sourceBasis        | WCAG AA + Processing Fluency                                                                                               |
| sourceConfidence   | high                                                                                                                       |
| claimStatus        | supported                                                                                                                  |
| ruleType           | hard-rule if measurable, otherwise inspect                                                                                 |
| currentStatus      | 无检查                                                                                                                     |
| proposedSolution   | generate-visual-metrics.ts：基于 theme 的 primaryText 和 background 计算对比度。正文 <4.5:1 → inspect；大字 <3:1 → inspect |
| affectedFiles      | `src/video-system/scripts/generate-visual-metrics.ts`                                                                      |
| notAllowedFiles    | `src/video-system/themes/*.ts`                                                                                             |
| schemaImpact       | none                                                                                                                       |
| implementationCost | S                                                                                                                          |
| risk               | low — 必须说明 theme token 可测前提                                                                                        |
| testPlan           | 使用深色主题运行，检查对比度值                                                                                             |
| previewAcceptance  | 所有主题文字对比度达标                                                                                                     |
| recommendedTier    | P1                                                                                                                         |
| priority           | P1-medium                                                                                                                  |
| executionPackage   | P1-2                                                                                                                       |
| dependency         | 无                                                                                                                         |
| whyNow             | WCAG 国际标准                                                                                                              |
| whyNotNow          | —                                                                                                                          |
| note               | 实现时必须说明 theme token 可测前提。无法可靠识别背景时不应误报 hard fail。第一版建议 inspect，稳定后升级                  |

---

## P1-BL-11: spring() 小范围实验

| 字段               | 内容                                                                    |
| ------------------ | ----------------------------------------------------------------------- |
| id                 | P1-BL-11                                                                |
| title              | big-quote 场景 spring() 实验                                            |
| problem            | 当前动画偏线性，缺少弹性感                                              |
| sourceBasis        | A-8 Remotion 动画原语                                                   |
| sourceConfidence   | high                                                                    |
| claimStatus        | supported                                                               |
| ruleType           | backlog                                                                 |
| currentStatus      | spring() 已引入但未充分使用                                             |
| proposedSolution   | 先在 big-quote 一个 scene 试用 spring()，确认效果后再考虑推广到 bullets |
| affectedFiles      | `src/video-system/scenes/BigQuoteScene.tsx`（先试一个）                 |
| notAllowedFiles    | `src/video-system/data/*.json`, `src/video-system/themes/*.ts`          |
| schemaImpact       | none                                                                    |
| implementationCost | M                                                                       |
| risk               | low — spring 参数可调                                                   |
| testPlan           | 渲染视频，对比 spring vs linear                                         |
| previewAcceptance  | big-quote 动画有弹性回弹感                                              |
| recommendedTier    | P1                                                                      |
| priority           | P1-medium                                                               |
| executionPackage   | P1-4                                                                    |
| dependency         | P1-1/P1-2 完成                                                          |
| whyNow             | 视觉提升明显                                                            |
| whyNotNow          | 需在系统治理稳定后做                                                    |
| note               | 小范围实验，不全局替换。先一个 scene 试用，确认后再推广                 |

---

## P1-BL-12: 封面安全区检查

| 字段               | 内容                                                 |
| ------------------ | ---------------------------------------------------- |
| id                 | P1-BL-12                                             |
| title              | 封面文字避开底部 15% inspect                         |
| problem            | 抖音/小红书互动按钮遮挡封面底部文字                  |
| sourceBasis        | 抖音创作者学院 + 小红书创作学院                      |
| sourceConfidence   | medium                                               |
| claimStatus        | partially-supported                                  |
| ruleType           | inspect                                              |
| currentStatus      | 无检查                                               |
| proposedSolution   | validate-cover-spec.ts：检查封面布局底部安全区       |
| affectedFiles      | `src/video-system/scripts/validate-cover-spec.ts`    |
| notAllowedFiles    | `src/video-system/compositions/CoverComposition.tsx` |
| schemaImpact       | none                                                 |
| implementationCost | S                                                    |
| risk               | low                                                  |
| testPlan           | 构造底部有文字的封面，验证是否标记                   |
| previewAcceptance  | 封面文字不在底部 15%                                 |
| recommendedTier    | P1                                                   |
| priority           | P1-low                                               |
| executionPackage   | P1-2                                                 |
| dependency         | 无                                                   |
| whyNow             | 平台适配基础保障                                     |
| whyNotNow          | —                                                    |
| note               | platform heuristic，不是官方硬标准                   |

---

## P1-BL-13: TransitionSeries 有限转场实验

| 字段               | 内容                                                                                                       |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| id                 | P1-BL-13                                                                                                   |
| title              | TransitionSeries fade/wipe 有限调色板实验                                                                  |
| problem            | 当前所有场景过渡都是 wipe，视觉单调                                                                        |
| sourceBasis        | A-1 TransitionSeries 官方文档                                                                              |
| sourceConfidence   | high                                                                                                       |
| claimStatus        | supported                                                                                                  |
| ruleType           | backlog                                                                                                    |
| currentStatus      | KnowledgeVideo.tsx 已用 TransitionSeries + wipe                                                            |
| proposedSolution   | 小范围实验 fade/wipe 切换。不新增 videoSpec schema，不影响音频同步。只允许 fade/wipe/少量 slide 有限调色板 |
| affectedFiles      | `src/video-system/compositions/KnowledgeVideo.tsx`                                                         |
| notAllowedFiles    | `src/video-system/data/videoSpec.json`（不改 schema）                                                      |
| schemaImpact       | none（不新增字段）                                                                                         |
| implementationCost | M                                                                                                          |
| risk               | medium — 需测试音频同步                                                                                    |
| testPlan           | 分别用 fade/wipe 渲染，检查过渡和音频同步                                                                  |
| previewAcceptance  | 场景过渡效果可接受                                                                                         |
| recommendedTier    | P1                                                                                                         |
| priority           | P1-low                                                                                                     |
| executionPackage   | P1-4                                                                                                       |
| dependency         | P1-1/P1-2 完成                                                                                             |
| whyNow             | 已有 TransitionSeries 基础                                                                                 |
| whyNotNow          | 不进前三包。需在系统治理稳定后做                                                                           |
| note               | 不进前三包。不一口气做完整转场库                                                                           |

---

## P1-BL-14: contentBrief 提示词升级

| 字段               | 内容                                                                                                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                 | P1-BL-14                                                                                                                                                                                          |
| title              | contentBrief 提示词增加内容策划质量约束                                                                                                                                                           |
| problem            | 提示词质量门禁不够硬                                                                                                                                                                              |
| sourceBasis        | 15_CONTENT_STRATEGY + 平台指南                                                                                                                                                                    |
| sourceConfidence   | medium                                                                                                                                                                                            |
| claimStatus        | supported                                                                                                                                                                                         |
| ruleType           | hard-rule documentation                                                                                                                                                                           |
| currentStatus      | 提示词有指导但无硬约束                                                                                                                                                                            |
| proposedSolution   | 02 提示词添加内容策划质量约束：判断是否具备可复制方法；缺方法时不得虚构并标注 keyRisks；标题优先命中痛点/结果/反差，不堆内部术语；标题前半句尽快出现用户能理解的痛点或结果，但不机械要求"前 5 字" |
| affectedFiles      | `knowledge-video-system/prompts/02_ARTICLE_TO_CONTENT_BRIEF_PROMPT.md`                                                                                                                            |
| notAllowedFiles    | `src/video-system/*`                                                                                                                                                                              |
| schemaImpact       | none                                                                                                                                                                                              |
| implementationCost | S                                                                                                                                                                                                 |
| risk               | low — 只改文档                                                                                                                                                                                    |
| testPlan           | 用新提示词生成 contentBrief 检查质量                                                                                                                                                              |
| previewAcceptance  | contentBrief 判断了可复制方法；缺方法时 keyRisks 已标注；标题不堆内部术语                                                                                                                         |
| recommendedTier    | P1                                                                                                                                                                                                |
| priority           | P1-high                                                                                                                                                                                           |
| executionPackage   | P1-1                                                                                                                                                                                              |
| dependency         | 无                                                                                                                                                                                                |
| whyNow             | 内容质量是根本                                                                                                                                                                                    |
| whyNotNow          | —                                                                                                                                                                                                 |
| note               | 只改提示词不改代码                                                                                                                                                                                |

---

## P2 Items（不进 P1 执行包）

| ID    | 标题                       | tier | ruleType | claimStatus     | note                                   |
| ----- | -------------------------- | ---- | -------- | --------------- | -------------------------------------- |
| P2-01 | @remotion/captions 迁移    | P2   | backlog  | supported as P2 | 当前字幕链继续保留                     |
| P2-02 | calculateMetadata 动态时长 | P2   | backlog  | supported       | 收益高但需改造 KnowledgeVideo.tsx 结构 |
| P2-03 | 逐词高亮字幕               | P2   | backlog  | supported       | 依赖 P2-01                             |
| P2-04 | typewriter 文本动画        | P2   | backlog  | supported       | 参考 remotion-animate-text             |
| P2-05 | word-highlight 关键词高亮  | P2   | backlog  | supported       | 参考 TikTok 模板                       |
| P2-06 | 复杂数据图表               | P2   | backlog  | supported       | 需新增 scene type                      |
| P2-07 | Typography Token 系统      | P2   | backlog  | supported       | 大规模 theme 重构                      |
| P2-08 | Layout Token 系统          | P2   | backlog  | supported       | 同上                                   |
| P2-09 | 帧级 AI 视觉分析           | P2   | backlog  | supported       | 技术不成熟                             |

## reject Items

| ID   | 标题           | tier           | ruleType | claimStatus | note                 |
| ---- | -------------- | -------------- | -------- | ----------- | -------------------- |
| R-01 | Lottie         | reject         | reject   | supported   | 增加依赖复杂度       |
| R-02 | 3D             | reject         | reject   | supported   | 不适合知识视频       |
| R-03 | light leaks    | reference-only | reject   | supported   | 不提升理解           |
| R-04 | Lambda 云渲染  | P2             | backlog  | supported   | 当前够用             |
| R-05 | 自动 9:16 重排 | reject         | reject   | supported   | mobile_scaled ≠ 9:16 |
| R-06 | 每平台重写视频 | reject         | reject   | supported   | 成本高收益低         |
| R-07 | 粒子/飘花装饰  | reject         | reject   | supported   | Mayer Coherence 违反 |
