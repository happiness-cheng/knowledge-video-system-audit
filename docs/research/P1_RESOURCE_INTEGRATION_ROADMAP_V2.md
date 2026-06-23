# P1 Resource Integration Roadmap V2

> 深度研究修正版。V1 → V2 变更见 P1_DECISION_NOTES.md 和 P1_CLAIM_AUDIT_V2.md。

---

## 1. Executive Summary

基于 23 项资源调研 + 深度研究核验，V2 修正以下核心判断：

1. **AGENTS.md 已存在**（根目录，360 行），任务是审查与增强，不是创建
2. **P1 第一优先级是系统治理**（AGENTS/QA），不是 BGM ducking
3. **BGM ducking 和 spring 动画必须拆开**，不绑一个包
4. **screenText / 封面标题 / Hook 时长 / 字号 32px 全部降级为 inspect**，不是 hard-rule
5. **TransitionSeries fade/slide 不进前三包**，放 P1-4 小范围实验
6. **平台规则全部降级为 inspect / platform heuristic**
7. **primaryAreaRatio 先做粗估 inspect**，不做精确 DOM 测量

P1 目标不变：在不改 videoSpec schema、不新增 scene type、不大规模重构的前提下，将系统从"能渲染"提升到"稳定出作品"。

---

## 2. V1 主要错误

| 错误                    | V1 说法                  | V2 修正                               |
| ----------------------- | ------------------------ | ------------------------------------- |
| AGENTS.md 不存在        | "文件不存在，需创建"     | 已存在（根目录 360 行），需审查与增强 |
| BGM ducking 排第一      | "成本最低、收益明确"     | 系统治理应先于视听增强                |
| BGM + spring 绑一个包   | "升级包 2：BGM + 动画"   | 拆成 P1-3 BGM / P1-4 spring           |
| screenText ≤30 字硬规则 | "超过 30 字标记 revise"  | inspect 级分级，不是硬阈值            |
| 封面标题 ≤10 字硬规则   | "超过 10 字标记 inspect" | platform heuristic，不是硬规则        |
| Hook ≤3 秒硬规则        | "超过 3 秒标记 inspect"  | 检查价值承诺，不机械报错              |
| 字号 32px 硬标准        | "升级字号下限"           | mobile_scaled 经验目标                |
| TransitionSeries 前三包 | "P1-BL-13 排 P1-medium"  | P1-4 小范围实验，不进前三包           |

---

## 3. 深度研究后的修正结论

### 3.1 系统治理优先于视听增强

V1 把 BGM ducking 排第一，理由是"成本 S、收益高"。深度研究认为：AGENTS.md 增强和 QA 检查扩展的成本也是 S-M，但解决的是更根本的问题——Agent 执行约束和视觉质量稳定性。BGM ducking 应该在这之后。

### 3.2 Inspect 而非 Hard Rule

V1 中多个检查项被写成 hard-rule（screenText ≤30、封面标题 ≤10、Hook ≤3s、字号 32px）。深度研究认为：这些是合理的启发式检查，但没有足够证据支持它们作为跨布局、跨场景的硬阈值。正确做法是 inspect（触发人工审片），不是 revise（自动拦截）。

### 3.3 BGM 和 Spring 必须拆开

V1 把 BGM ducking 和 spring 动画绑在一个包里。深度研究认为：两者风险类型不同（音频 vs 视觉），应独立执行和回归。P1-3 做完后可单独回归听感，P1-4 必须小范围实验。

### 3.4 平台规则降级

V1 引用的平台规则（前 3 秒决定完播、封面标题 ≤10、底部 15% 安全区）被写成 hard-rule。深度研究认为：这些是平台经验，除非有明确官方页面精确支持，否则只能作为 inspect / platform heuristic。

---

## 4. 新的 P1 顺序

```
P1-0：P0 Landing 审查与 P1 决策确认
P1-1：AGENTS / 提示词 / 能力边界增强
P1-2：QA / visualMetrics / validate 检查增强
P1-3：BGM ducking 音频清晰度增强
P1-4：spring / TransitionSeries 小范围动画实验
P2：captions / Lottie / 3D / light leaks / Lambda / 9:16
```

### P1-0：P0 Landing 审查与 P1 决策确认

- 等待 Agent A 完成 P0 Landing
- 审查 P0 回归测试产物
- 确认 P0 新增能力已写入 AGENTS.md
- 确认 P1 执行包的输入文件状态
- 用户和 ChatGPT 确认后才能启动 P1-1

### P1-1：AGENTS / 提示词 / 能力边界增强

- 审查并增强现有 AGENTS.md（不覆盖，只 patch/merge）
- 合并 P0 新增能力边界（toStaticFilePath、双预览产物、renderManifest）
- 补充 Remotion 执行硬约束
- 写入 mobile_scaled 非 9:16 定义
- 写入未实现能力不得写入 videoSpec
- 升级 contentBrief 提示词（可复制模板要求、标题规则）
- 成本：S | 风险：low | 纯文档

### P1-2：QA / visualMetrics 增强

- 连续 scene 重复检测（inspect）
- 静态页占比 ≤40%（inspect）
- screenText 密度分级（>15 字 inspect, >30 字 high inspect）
- primaryAreaRatio 粗估（heuristic inspect）
- 对比度 WCAG 检查（hard-rule if measurable, 否则 inspect）
- Hook 价值承诺检查（inspect）
- 封面标题字数检查（inspect）
- 字号 32px mobile_scaled 经验线（inspect）
- 成本：M | 风险：low | 不改 scene 组件 / 不改 schema

### P1-3：BGM Ducking

- BGM Audio 组件 volume 回调
- voiceover 在场时 BGM 降至 0.15（-20dB）
- 无 voiceover 时 BGM 恢复 0.6
- 阈值做成可配置常量
- 成本：S | 风险：low | 只改 KnowledgeVideo.tsx

### P1-4：Spring / TransitionSeries 小范围实验

- big-quote 场景用 spring() 替代 linear（小范围试用）
- 确认效果后再推广到 bullets
- TransitionSeries fade/wipe 有限调色板实验
- 不新增 videoSpec schema
- 不影响音频同步
- 成本：M | 风险：medium | 需要人工听审/视审

---

## 5. P1 / P2 / reference-only / reject 分层

### P1（本轮推荐）

| ID   | 标题                           | 包   |
| ---- | ------------------------------ | ---- |
| P1-1 | AGENTS / 提示词增强            | 包一 |
| P1-2 | QA / visualMetrics 增强        | 包二 |
| P1-3 | BGM ducking                    | 包三 |
| P1-4 | spring / TransitionSeries 实验 | 包四 |

### P2（暂缓）

| 能力                       | 暂缓原因                                 |
| -------------------------- | ---------------------------------------- |
| @remotion/captions 迁移    | 成本 L，当前自研字幕链够用               |
| calculateMetadata 动态时长 | 收益高但需要改造 KnowledgeVideo.tsx 结构 |
| 逐词高亮字幕               | 依赖 @remotion/captions                  |
| 复杂数据图表               | 需要新增 scene type                      |
| Typography Token 系统      | 大规模 theme 重构                        |
| Layout Token 系统          | 同上                                     |

### reference-only（仅参考）

| 能力                  | 参考价值        |
| --------------------- | --------------- |
| Onda 组件库           | 动画模式参考    |
| RemotionUI            | UI 组件参考     |
| remotion-animate-text | typewriter 参考 |
| Prompt to Video 模板  | 流程架构参考    |

### reject（不建议）

| 能力              | 拒绝原因                             |
| ----------------- | ------------------------------------ |
| Lottie            | 增加依赖复杂度，与知识视频风格不匹配 |
| 3D                | 完全不适用                           |
| light leaks       | 炫技，不提升理解                     |
| Lambda 云渲染     | 当前本地渲染够用                     |
| 自动 9:16 重排    | 与内容质量优先策略冲突               |
| 每平台重写视频    | 成本高收益低                         |
| 粒子/飘花装饰动画 | Mayer Coherence：挤占认知资源        |

---

## 6. 最推荐的前三个执行包

| 包   | 名称                    | 范围                        | 成本 | 风险 |
| ---- | ----------------------- | --------------------------- | ---- | ---- |
| 包一 | AGENTS 与回归契约校准   | 审查增强 AGENTS.md + 提示词 | S    | zero |
| 包二 | QA / visualMetrics 增强 | 6→12 项检查                 | M    | low  |
| 包三 | 音频清晰度微增强        | BGM ducking                 | S    | low  |

包四（spring / TransitionSeries 实验）不进前三，需要在包一～三稳定后再做。

---

## 7. 不建议现在做的能力

| 能力                           | 原因                 |
| ------------------------------ | -------------------- |
| @remotion/captions 全量迁移    | 成本 L，当前够用     |
| Typography/Layout Token 大重构 | 风险高，收益不明确   |
| 帧级 AI 视觉分析               | 技术不成熟           |
| 每平台差异化包装               | 成本高收益低         |
| 复杂光效系统                   | 不提升理解           |
| 自动 9:16 竖屏重排             | 破坏内容质量优先策略 |

---

## 8. 等待 P0 Landing 完成的事项

| 事项                | 依赖                                                    |
| ------------------- | ------------------------------------------------------- |
| P1-1 AGENTS.md 增强 | 需要知道 P0 最终写入了哪些新能力                        |
| P1-2 QA 增强        | 需要 P0 的 visualMetrics / previewVisualReport 最终格式 |
| P1-3 BGM ducking    | 需要 P0 的 KnowledgeVideo.tsx 最终状态                  |
| P1-4 spring 实验    | 需要 P0 的 scene 组件最终状态                           |
| P1 执行包正式交付   | 需要用户/ChatGPT 审查 P0_LANDING_REPORT                 |
