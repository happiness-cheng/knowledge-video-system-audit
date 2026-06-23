# P1 资源整合路线图

> 最终总报告：调研结论、升级建议、执行计划。

---

## 1. Executive Summary

经过对 Remotion 官方文档（8 项）、官方模板/生态（5 项）、Agent Skill（2 项）、多媒体学习理论（3 项）、平台创作者指南（4 项）、UX 研究（1 项）共 23 项资源的系统调研，结合当前仓库代码实际状态的逐文件审计，得出以下核心结论：

**当前系统状态**：文档完善度远超代码实现度。17 个 scene type + 8 个主题 + 完整 QA 管线的架构已经建立，但视觉质量的"最后一公里"尚未打通——SceneContract 存在但不强制执行、primaryAreaRatio 写死 null、screenText 无字数约束、BGM 不随 voiceover 降低、AGENTS.md 不存在。

**P1 目标**：在不改 videoSpec schema、不新增 scene type、不大规模重构的前提下，通过 14 个低成本改进项，将系统从"能渲染"提升到"稳定出作品"。

**P2 暂缓**：@remotion/captions 迁移、Lottie、light leaks、3D、Lambda 云渲染、9:16 竖屏重排、复杂数据图表。

---

## 2. 当前系统真实状态

### 已经做得好的

| 能力                      | 证据                                                                    |
| ------------------------- | ----------------------------------------------------------------------- |
| TransitionSeries 场景过渡 | KnowledgeVideo.tsx 已用 TransitionSeries + wipe + premountFor           |
| SceneContract 体系        | sceneContracts.ts 定义了 23 个合约（17 通用 + 6 Lab）                   |
| 中文断行风险检测          | chineseTitleBreakRisk 实现了弱词行首/标点单行/尾行字数检测              |
| 手机端投影字号            | projectedMobilePx 函数已实现                                            |
| preview:visual 7 步链路   | validateSpec → visualMetrics → visualCheck → keyframes → contact sheets |
| renderManifest            | P0 已实现输入 hash + 命令记录 + 产物 hash                               |
| 双比例封面                | 3:4 + 4:3 已实现，split-left-right 在 3:4 时自动 fallback               |
| 字幕版/无字幕版双产物     | P0 已实现                                                               |

### 明显的短板

| 短板                       | 证据                                        | 影响                 |
| -------------------------- | ------------------------------------------- | -------------------- |
| primaryAreaRatio 写死 null | generate-visual-metrics.ts:243              | 合约系统核心字段失效 |
| screenText 无字数约束      | 无检查代码                                  | Mayer Modality 违反  |
| BGM 固定音量               | KnowledgeVideo.tsx BGM Audio 无 volume 回调 | 口播听不清           |
| 连续 scene 类型无检测      | 无代码                                      | PPT 感风险           |
| 字号下限偏低               | 正文 28px（应为 32px）                      | 手机端可读性         |
| AGENTS.md 不存在           | 文件缺失                                    | Agent 执行无约束     |
| 封面标题字数无检查         | 无代码                                      | 缩略图不可辨认       |

---

## 3. 已经吸收的资源

| 资源                  | 吸收方式                    | 证据                                    |
| --------------------- | --------------------------- | --------------------------------------- |
| TransitionSeries      | KnowledgeVideo.tsx 直接使用 | TransitionSeries + wipe                 |
| Sequence premountFor  | KnowledgeVideo.tsx          | premountFor={30}                        |
| staticFile()          | 全项目使用                  | toStaticFilePath() P0 统一              |
| Audio 组件            | TTS + BGM 播放              | Audio src={staticFile(...)}             |
| interpolate / Easing  | 各 scene 组件               | fade-in / slide-up / progressive-reveal |
| spring()              | 部分引入                    | 已在 package.json                       |
| Mayer 5 原则          | 13_REFERENCE_BASIS 引用     | 文档级，非代码级                        |
| SceneContract         | sceneContracts.ts           | 23 个合约定义                           |
| chineseTitleBreakRisk | visual/chineseTitleBreak.ts | 断行风险评分                            |
| projectedMobilePx     | visual/projectedMobilePx.ts | 手机端字号投影                          |
| 8 个主题              | themes/\*.ts                | 全部实现                                |

---

## 4. 还没有吸收但值得吸收的资源

| 资源                             | 推荐级别 | 原因                                  |
| -------------------------------- | -------- | ------------------------------------- |
| Audio volume 回调                | P1       | BGM ducking，成本 S                   |
| calculateMetadata                | P1       | 自动时长计算，成本 M                  |
| fade/slide 过渡                  | P1       | 扩展 TransitionSeries，成本 M         |
| spring() 充分使用                | P1       | 动画弹性化，成本 M                    |
| remotion-animate-text            | P1       | typewriter/word-highlight，需评估引入 |
| Mayer Modality → screenText 约束 | P1       | 代码级硬约束                          |
| 平台指南 → 封面/Hook 检查        | P1       | validate 脚本增强                     |
| @remotion/captions               | P2       | 逐词字幕，成本 L                      |
| Onda/RemotionUI 组件库           | P2       | 风格兼容性待评估                      |
| calculateMetadata 动态分辨率     | P2       | 9:16 实验性                           |

---

## 5. P1 推荐目标

**一句话**：让 visualMetrics 从"6 项检查"扩展到"12 项检查"，让 AGENTS.md 约束 Agent 行为，让 BGM 和动画质量跟上。

### P1 核心指标

| 指标                  | 当前   | P1 目标            |
| --------------------- | ------ | ------------------ |
| visualMetrics 检查项  | 6      | 12                 |
| primaryAreaRatio 状态 | null   | 有估算值           |
| screenText 字数检查   | 无     | ≤30 字             |
| 连续 scene 重复检测   | 无     | 有                 |
| 静态页占比检查        | 无     | ≤40%               |
| BGM ducking           | 无     | voiceover 时 -20dB |
| 封面标题字数检查      | 无     | ≤10 字             |
| Hook 时长检查         | 无     | ≤3s                |
| AGENTS.md             | 不存在 | 存在               |

---

## 6. P2 暂缓目标

| 能力                    | 推迟原因                                |
| ----------------------- | --------------------------------------- |
| @remotion/captions 迁移 | 成本 L，当前自研字幕够用                |
| Lottie 动画             | 增加依赖复杂度，与知识视频风格不匹配    |
| light leaks 光效        | 炫技，不提升理解                        |
| 3D 内容                 | 完全不适用                              |
| Lambda 云渲染           | 当前本地渲染够用                        |
| 9:16 竖屏重排           | 与"内容质量优先"定位冲突                |
| 复杂数据图表            | 当前场景类型不支持，需要新增 scene type |
| Typography Token 系统   | 大规模重构 theme 系统，风险高           |
| Layout Token 系统       | 同上                                    |
| 帧级视觉分析            | 需要 AI 视觉识别，成本极高              |

---

## 7. 不建议吸收的东西

| 能力               | 原因                                    |
| ------------------ | --------------------------------------- |
| 粒子/飘花装饰动画  | Mayer Coherence：装饰性素材挤占认知资源 |
| 过多主题（>10 个） | 维护负担大，8 个已够用                  |
| 自动 9:16 重排     | 破坏内容质量优先策略                    |
| 每平台重写视频     | 成本高收益低                            |
| 完全自动审片 AI    | 技术不成熟，误判率高                    |
| 复杂图表系统       | 与当前 17 个 scene type 架构不兼容      |

---

## 8. Top 10 推荐升级

| 排名 | ID       | 标题                    | 成本 | 收益 | 风险   |
| ---- | -------- | ----------------------- | ---- | ---- | ------ |
| 1    | P1-BL-01 | BGM 自动降低            | S    | 高   | low    |
| 2    | P1-BL-02 | 连续 scene 重复检测     | S    | 高   | low    |
| 3    | P1-BL-03 | screenText 字数检查     | S    | 高   | low    |
| 4    | P1-BL-08 | AGENTS.md 创建          | S    | 高   | low    |
| 5    | P1-BL-09 | primaryAreaRatio 估算   | M    | 高   | medium |
| 6    | P1-BL-14 | contentBrief 提示词升级 | S    | 高   | low    |
| 7    | P1-BL-04 | 静态页占比检查          | S    | 中   | low    |
| 8    | P1-BL-05 | 字号下限升级            | S    | 中   | medium |
| 9    | P1-BL-06 | 封面标题字数检查        | S    | 中   | low    |
| 10   | P1-BL-07 | Hook 时长检查           | S    | 中   | low    |

---

## 9. 前 3 个最应该交给 Agent A 执行的升级包

### 升级包 1：QA 检查项扩展（P1-BL-02 + 03 + 04 + 05 + 06 + 07 + 09 + 10）

**目标**：将 visualMetrics 从 6 项检查扩展到 12 项检查。

**范围**：

- 修改 `generate-visual-metrics.ts`：添加连续重复/screenText 字数/静态页占比/primaryAreaRatio 估算/对比度检查
- 修改 `validate-video-spec.ts`：添加 Hook 时长检查
- 修改 `validate-cover-spec.ts`：添加封面标题字数检查
- 修改 `sceneContracts.ts`：提升 minProjectedBodyPx 阈值

**文件**：

- `src/video-system/scripts/generate-visual-metrics.ts`
- `src/video-system/scripts/validate-video-spec.ts`
- `src/video-system/scripts/validate-cover-spec.ts`
- `src/video-system/visual/sceneContracts.ts`

**测试**：运行 `npm run preview:visual`，检查新增检查项是否生效。

**验收**：previewVisualReport 中 inspectItems 覆盖新增检查项。

**风险控制**：只做检查不截断，所有新增检查项默认 inspect（不自动 revise）。

### 升级包 2：BGM Ducking + 动画增强（P1-BL-01 + 11）

**目标**：BGM 在 voiceover 时自动降低；关键场景用 spring() 替代 linear。

**范围**：

- 修改 `KnowledgeVideo.tsx`：BGM Audio 组件添加 volume 回调
- 修改 `BigQuoteScene.tsx`、`BulletsScene.tsx`：用 spring() 替代部分 linear interpolate

**文件**：

- `src/video-system/compositions/KnowledgeVideo.tsx`
- `src/video-system/scenes/BigQuoteScene.tsx`
- `src/video-system/scenes/BulletsScene.tsx`

**测试**：渲染视频，手动检查 BGM 和动画效果。

**验收**：口播段 BGM 不抢口播；big-quote 动画有弹性回弹感。

**风险控制**：spring 参数可调，volume 回调阈值可配。

### 升级包 3：AGENTS.md + 提示词升级（P1-BL-08 + 14）

**目标**：建立 Agent 执行约束；提升 contentBrief 质量门槛。

**范围**：

- 新建 `knowledge-video-system/AGENTS.md`
- 修改 `knowledge-video-system/prompts/02_ARTICLE_TO_CONTENT_BRIEF_PROMPT.md`
- 修改 `knowledge-video-system/prompts/03_CONTENT_BRIEF_TO_VIDEO_SPEC_PROMPT.md`

**文件**：

- `knowledge-video-system/AGENTS.md`（新建）
- `knowledge-video-system/prompts/02_ARTICLE_TO_CONTENT_BRIEF_PROMPT.md`
- `knowledge-video-system/prompts/03_CONTENT_BRIEF_TO_VIDEO_SPEC_PROMPT.md`

**测试**：用新提示词生成 contentBrief，检查质量。

**验收**：AGENTS.md 存在且包含硬约束；contentBrief 包含可复制模板。

**风险控制**：纯文档改动，不影响代码。

---

## 10. 风险控制

| 风险                              | 缓解措施                                                           |
| --------------------------------- | ------------------------------------------------------------------ |
| 新增检查项导致大量 inspect        | 所有新增检查项默认 inspect 而非 revise；inspect 数量增加是正常现象 |
| spring() 动画参数调不好           | 先在一个 scene 试用，确认效果后再推广                              |
| BGM ducking 阈值不合适            | 阈值做成可配置常量，方便调整                                       |
| 字号下限提升导致现有 scene 不达标 | 先运行 visual:metrics 看影响范围，再决定是否调整 sceneContracts    |
| 提示词改动影响策划质量            | 先在一条视频上试用新提示词，对比效果                               |

---

## 11. 如何避免系统越改越乱

1. **只改检查层，不改渲染层**：升级包 1 全部在 validate/metrics 脚本中，不动 scene 组件
2. **只加不减**：新增检查项不影响现有检查项
3. **inspect 而非 revise**：新增检查项默认 inspect，给人工审片留空间
4. **先检查后修复**：任何新增检查项先跑一次看影响范围，再决定是否调整阈值
5. **文档先于代码**：AGENTS.md 和提示词先更新，再考虑代码级约束

---

## 12. 如何确保未来 videoSpec 不引用未实现能力

1. **AGENTS.md 硬约束**：禁止 videoSpec 引用代码未实现的字段
2. **validate:spec 增强**：检查 videoSpec 中是否有 schema 之外的字段
3. **renderManifest 记录**：manifest 中记录实际使用的字段，对比 videoSpec 声明的字段
4. **定期审计**：每 5 条视频后，审计一次 videoSpec 字段使用率

---

## 13. 如何持续维护资源地图

1. **每季度更新一次** P1_RESOURCE_MAP.md
2. **新资源发现时**：先评估 recommendedTier，再决定是否纳入
3. **资源降级机制**：如果某资源实现后效果不佳，从 P1 降级到 P2 或 reject
4. **版本标记**：资源地图中标注 Remotion 版本（当前 v4.0.469），版本升级时重新评估
