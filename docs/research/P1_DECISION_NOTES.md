# P1 Decision Notes

> V1 → V2 修正记录。每条决策的修正原因。

---

## 1. V1 结论保留

| 结论                                           | 保留原因                                                                                        |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| QA 检查项需要扩展                              | 当前 visualMetrics 只有 6 项检查，SceneContract 的 primaryAreaRatio 长期 null，确实需要补       |
| BGM ducking 值得做                             | Mayer Coherence 原则支持，Audio volume 回调是官方 API，成本 S                                   |
| AGENTS.md 需要增强                             | 无论文件是否已存在，P0 新增的能力边界（toStaticFilePath、双预览产物、renderManifest）都需要写入 |
| @remotion/captions 放 P2                       | 当前自研字幕链够用，迁移成本 L，不急                                                            |
| Lottie / 3D / light leaks / Lambda / 9:16 暂缓 | 与知识视频主线不匹配                                                                            |
| mobile_scaled_contact_sheet 不是 9:16          | 项目已有明确定义，V1 正确                                                                       |

## 2. V1 结论修正

| V1 结论                   | 修正为                                              | 原因                                   |
| ------------------------- | --------------------------------------------------- | -------------------------------------- |
| AGENTS.md 不存在，需创建  | AGENTS.md 已存在（根目录，360 行），需审查与增强    | 文件实际存在，V1 搜索不完整            |
| BGM ducking 排 P1 第一    | BGM ducking 排 P1-3（第三包）                       | 系统治理（AGENTS/QA）应先于视听增强    |
| BGM + spring 绑一个包     | 拆成 P1-3 BGM / P1-4 spring                         | 风险类型不同，应独立执行和回归         |
| screenText ≤30 字硬规则   | inspect 级分级：>15 字 inspect, >30 字 high inspect | 没有足够证据支持 30 字作为跨布局硬阈值 |
| 封面标题 ≤10 字硬规则     | inspect / platform heuristic                        | 10 字是建议，不是硬规则                |
| Hook ≤3 秒硬规则          | inspect，检查前 3-5 秒价值承诺                      | 不机械报错 S01 ≤3s                     |
| 字号 28→32px 硬标准       | inspect / mobile_scaled 经验目标                    | 32px 是项目经验目标，不是官方硬标准    |
| TransitionSeries 进前三包 | P1-4 / P1.5 小范围实验                              | 不适合第一轮 P1 主包，需测试音频同步   |

## 3. Hard Rule 降级为 Inspect

| 规则             | V1 类型   | V2 类型 | 原因                       |
| ---------------- | --------- | ------- | -------------------------- |
| screenText 字数  | hard-rule | inspect | 跨布局硬阈值证据不足       |
| 封面标题字数     | hard-rule | inspect | 平台经验，非官方标准       |
| Hook 时长        | hard-rule | inspect | 应检查价值承诺，不机械报错 |
| 字号 32px        | hard-rule | inspect | 经验目标，非官方标准       |
| 静态页占比       | hard-rule | inspect | 启发式检查                 |
| 连续 scene 重复  | hard-rule | inspect | PPT 感启发式检查           |
| primaryAreaRatio | hard-rule | inspect | 粗估不等于精确测量         |
| 平台创作者建议   | hard-rule | inspect | 经验规则，非官方硬标准     |

## 4. P1 降级为 P2 / reject

| 能力                           | V1 级别             | V2 级别                    | 原因                       |
| ------------------------------ | ------------------- | -------------------------- | -------------------------- |
| TransitionSeries fade/slide    | P1-medium（前三包） | P1-4 / P1.5 小范围实验     | 不进前三包，需测试音频同步 |
| @remotion/captions             | P2                  | P2（不变）                 | 当前自研字幕链继续保留     |
| Lottie                         | P2                  | P2 / reject                | 增加依赖复杂度             |
| 3D                             | P2                  | reject                     | 不适合知识视频             |
| light leaks                    | P2                  | reference-only             | 不提升理解                 |
| Lambda                         | P2                  | P2（不变）                 | 当前本地渲染够用           |
| 自动 9:16                      | P2                  | reject for current default | 与内容质量优先策略冲突     |
| 每平台重写视频                 | P2                  | reject                     | 成本高收益低               |
| 大型组件库直接引入             | P2                  | reference-only             | 风格兼容性风险             |
| Typography/Layout Token 大重构 | P2                  | P2（不变）                 | 大规模重构风险高           |
| 帧级 AI 视觉分析               | P2                  | P2（不变）                 | 技术不成熟                 |

## 5. AGENTS.md 不能再写"创建"的原因

AGENTS.md 实际状态：

- 路径：`<PROJECT_ROOT>\AGENTS.md`（项目根目录）
- 行数：360 行
- 内容：完整的执行约束，包括项目概述、常用命令、架构概览、17 个 scene type、8 个主题、TTS 规则、视觉规则、提示词系统、Agent 执行规范、决策权限、四层数据结构、画面规则、封面规则、验收标准、Visual Compiler 流程、Knowledge Lab 能力边界

V1 报告写"AGENTS.md 不存在"是搜索不完整导致的错误。根目录存在 AGENTS.md，`knowledge-video-system/AGENTS.md` 不存在但不需要创建（根目录的已覆盖）。

P1-1 的正确任务是：审查并增强现有 AGENTS.md，补充 P0 新增的能力边界，不是新建。

## 6. P0 完成前不能执行 P1 的原因

1. P0 Landing 由 Agent A 执行，修改的是主系统代码
2. P1 的部分修改依赖 P0 的最终文件状态（如 toStaticFilePath、双预览脚本、renderManifest）
3. 如果 P1 和 P0 同时执行，可能产生冲突
4. P0 的回归测试结果是 P1 决策的输入（如哪些检查项需要增强）
5. 用户明确要求：P0 未完成前，不允许启动 P1 实现

## 7. BGM ducking 不再排第一的原因

V1 把 BGM ducking 排第一的理由是"成本最低（S）、收益明确（听感质变）、理论依据强"。

修正原因：

- BGM ducking 是视听体验增强，不是系统治理
- 系统治理（AGENTS/QA）的基础不打好，视听增强的效果会被不稳定的执行流程稀释
- AGENTS.md 增强（P1-1）成本也是 S，但解决的是"Agent 乱造轮子"的根本问题
- QA 检查扩展（P1-2）成本也是 S-M，但解决的是"视觉质量不稳定"的根本问题
- BGM ducking 应该在系统治理稳定后再做

## 8. Hard Rule 清单（V2 最终）

可以作为 hard-rule 的规则：

1. mobile_scaled_contact_sheet 不是 9:16
2. videoSpec 不得引用未实现字段
3. 未落地能力不得写成"已支持"
4. CSS transition / animation / Tailwind 动画类禁令
5. 必须使用 Remotion frame-driven animation
6. preview / still / render / manifest 证据链必须保留
7. COMMAND PASS 不等于 VISUAL GATE PASS
8. 有 revise 不得误报 pass
9. 用户未授权不得修改 userDecision / approvedByUser
10. 对比度在可可靠计算时应作为强检查项（WCAG 4.5:1 正文 / 3:1 大字）

## 9. Inspect Rule 清单（V2 最终）

只能作为 inspect 的规则：

1. screenText 字数（>15 字 inspect, >30 字 high inspect）
2. Hook 时长 / 前 3-5 秒价值承诺
3. 封面标题字数（10 字以内建议）
4. 字号 32px 经验线
5. 静态页占比（≤40%）
6. 连续 scene 重复
7. primaryAreaRatio 粗估
8. 平台创作者建议中的经验规则
