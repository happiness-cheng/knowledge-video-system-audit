# P1 Claim Audit V2

> 逐条审计 V1 报告中的 claim，标注修正。

---

## Audit Table

| #   | claim                                               | V1 status            | deepResearchVerdict | correctedDecision                | shouldBecome            | reason                                                                            | affectedDocs              |
| --- | --------------------------------------------------- | -------------------- | ------------------- | -------------------------------- | ----------------------- | --------------------------------------------------------------------------------- | ------------------------- |
| 1   | BGM 自动降低应该排 P1 第一                          | P1-high, Top 1       | 降级                | P1-3（第三包）                   | backlog                 | BGM ducking 是视听增强，不是系统治理第一优先级。AGENTS/提示词/QA 才是             | ROADMAP, HANDOFF, BACKLOG |
| 2   | 连续 scene 重复检测应该 P1-high                     | P1-high              | 保留但降级规则类型  | P1-2, inspect                    | inspect                 | 合理的 PPT 感启发式检查，但不应做 hard error                                      | BACKLOG                   |
| 3   | screenText ≤30 字应该作为硬规则                     | hard-rule            | 过度声称            | inspect, 分级阈值                | inspect                 | 没有足够证据支持 30 字作为跨布局硬阈值。建议 >15 字 inspect, >30 字 high inspect  | BACKLOG, ROADMAP          |
| 4   | primaryAreaRatio 简化估算值得 P1 做                 | P1-high              | 保留但限定精度      | P1-2, heuristic inspect          | inspect                 | 先做 scene type 粗估，不做精确 DOM 测量。不得把粗估值写成精确视觉指标             | BACKLOG, GAP              |
| 5   | 字号下限 28px → 32px 合理                           | P1-medium, hard-rule | 过度声称            | inspect / mobile_scaled 经验目标 | inspect                 | 32px 是项目经验目标，不是官方硬标准。真正可做强规则的是对比度 WCAG                | BACKLOG, GAP              |
| 6   | 封面标题 ≤10 字应该作为硬规则                       | hard-rule            | 过度声称            | inspect / platform heuristic     | inspect                 | 10 字以内是建议，不是硬规则。硬规则是：不语义断裂、不孤行、手机可读、双封面都成立 | BACKLOG, GAP              |
| 7   | Hook scene ≤3 秒应该作为硬规则                      | hard-rule            | 过度声称            | inspect                          | inspect                 | 检查前 3-5 秒是否完成痛点与承诺，不机械报错 S01 ≤3s                               | BACKLOG, GAP              |
| 8   | TransitionSeries fade/slide 适合 P1                 | P1-medium            | 降级                | P1-4 / P1.5 小范围实验           | backlog                 | 不进入前三包。只允许 fade/wipe/少量 slide 有限调色板。不影响音频同步              | ROADMAP, HANDOFF          |
| 9   | @remotion/captions 应该 P2                          | P2                   | 保留                | P2                               | backlog (P2)            | 当前自研字幕链继续保留                                                            | ROADMAP                   |
| 10  | Lottie / light leaks / 3D / Lambda / 自动 9:16 暂缓 | P2 / reject          | 保留                | P2 / reject                      | reject / reference-only | 不适合当前知识视频主线                                                            | ROADMAP                   |
| 11  | AGENTS.md 不存在                                    | "不存在，需创建"     | **错误**            | 已存在，需审查与增强             | hard-rule documentation | AGENTS.md 在项目根目录，360 行，包含完整执行约束。V1 判断错误                     | ALL                       |
| 12  | 对比度 WCAG 4.5:1 检查                              | P1-low               | 保留但加前提        | P1-2, hard-rule if measurable    | hard-rule if measurable | 实现时必须说明 theme token 可测前提。无法可靠识别背景时不应误报 hard fail         | BACKLOG                   |
| 13  | BGM + spring 绑定一个包                             | 一个包               | 必须拆开            | P1-3 BGM / P1-4 spring 分开      | backlog                 | 风险类型不同，不应绑定。P1-3 做完可单独回归听感                                   | HANDOFF                   |
| 14  | 平台规则作为硬规则                                  | hard-rule            | 全部降级            | inspect / platform heuristic     | inspect                 | 除非有明确官方页面精确支持，否则不得写成 error/revise/hard rule                   | BACKLOG, ROADMAP          |
