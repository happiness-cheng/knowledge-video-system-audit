# P1 Capability Gap Analysis V2

> 深度研究修正版。按系统能力维度分析，校准"当前能力 / 差距 / P1 可做 / P2 再做"。

---

## 1. Remotion Runtime Foundation

| 维度                 | 当前能力              | 差距                     | P1 可做                   | P2 再做                |
| -------------------- | --------------------- | ------------------------ | ------------------------- | ---------------------- |
| TransitionSeries     | 已接入 wipe           | 只有 wipe，缺 fade/slide | P1-4 小范围实验 fade/wipe | 完整转场库             |
| calculateMetadata    | 未使用                | 手动配置帧数             | —                         | 自动时长计算           |
| Sequence premountFor | premountFor={30} 已用 | 负 from / Series 未探索  | 优化 premountFor 值       | 嵌套 Sequence          |
| Audio volume         | 固定音量              | BGM 不随 voiceover 降低  | P1-3 BGM ducking          | 多轨混音               |
| renderMedia 性能     | CLI 渲染              | 未复用浏览器实例         | —                         | puppeteerInstance 复用 |

## 2. Text Layout / Chinese Typography

| 维度                | 当前能力                                     | 差距                   | P1 可做                                                  | P2 再做                 |
| ------------------- | -------------------------------------------- | ---------------------- | -------------------------------------------------------- | ----------------------- |
| 标题语义断行        | P0 已实现 \n + pre-line                      | 仅手动断行             | 自动断行风险检测（已有）                                 | chooseType 智能字体选择 |
| 中文孤行检测        | chineseTitleBreakRisk 已实现                 | 只做风险检测           | 保持现有                                                 | 断行评分函数            |
| screenText 字数控制 | AGENTS.md 有"不要把口播全文显示在画面中"规则 | 无代码级检查           | P1-2 inspect 分级（>15 字 inspect, >30 字 high inspect） | —                       |
| 行间距/字间距       | 各 theme 硬编码                              | 缺少统一约束           | P1-2 inspect（行间距参考值）                             | Typography Token 系统   |
| 对比度检查          | 无                                           | 不检查文字与背景对比度 | P1-2 WCAG 检查（hard-rule if measurable）                | 自动对比度调整          |

## 3. Visual Layout / Scene Contracts

| 维度                | 当前能力                | 差距                                  | P1 可做                        | P2 再做           |
| ------------------- | ----------------------- | ------------------------------------- | ------------------------------ | ----------------- |
| SceneContract       | 23 个合约定义           | 合约存在但不做强制校验                | P1-2 运行时合约校验（inspect） | —                 |
| primaryAreaRatio    | 定义了阈值但计算为 null | generate-visual-metrics:243 写死 null | P1-2 粗估 heuristic inspect    | 精确像素级计算    |
| 等权模块数检查      | 已实现                  | 只检查数量                            | 保持现有                       | —                 |
| Layout Token        | 无                      | pagePadX/workZoneW 未实现             | —                              | Layout Token 系统 |
| 连续 scene 类型重复 | 无检查                  | 可能连续出现同类型 scene              | P1-2 inspect                   | —                 |
| 静态页占比          | 无检查                  | 不检查静态页比例                      | P1-2 inspect（≤40%）           | —                 |

## 4. Motion / Sequence / Progressive Reveal

| 维度               | 当前能力              | 差距                      | P1 可做                           | P2 再做                     |
| ------------------ | --------------------- | ------------------------- | --------------------------------- | --------------------------- |
| progressive-reveal | 6 种 scene 已实现     | 部分 scene 未确认         | 确认所有 scene 的动画支持         | —                           |
| spring()           | 已引入但未充分使用    | 只在部分场景用 spring     | P1-4 小范围实验（big-quote 先试） | 全场景 spring               |
| typewriter         | 标记为"待实现"        | 无逐字出现动画            | —                                 | P2 封装 TypewriterText 组件 |
| word-highlight     | 标记为"待实现"        | 无关键词高亮动画          | —                                 | P2 封装 WordHighlight 组件  |
| 动画进入顺序       | 部分 scene 有 stagger | 不是所有列表类 scene 都有 | P1-4 确认 stagger 覆盖            | —                           |

## 5. Screenshot Evidence

| 维度             | 当前能力 | 差距                       | P1 可做                  | P2 再做             |
| ---------------- | -------- | -------------------------- | ------------------------ | ------------------- |
| HighlightBox     | 已实现   | 只有高亮框                 | 保持现有                 | 局部放大/zoom frame |
| EvidenceBlock    | 已实现   | 结构够用                   | 增强来源锚点             | —                   |
| 截图尺寸检查     | 无       | 不检查截图是否太小         | P1-2 inspect             | —                   |
| assetLayout 字段 | 不存在   | S04/S10 inspect 因缺此字段 | 需评估是否扩展 videoSpec | —                   |

## 6. Template / Checklist / Method Page

| 维度               | 当前能力                     | 差距         | P1 可做      | P2 再做 |
| ------------------ | ---------------------------- | ------------ | ------------ | ------- |
| todo-checklist     | 已实现 + lab-template        | 结构够用     | 增强视觉层次 | —       |
| PromptTemplateCard | 已实现                       | 只有基本卡片 | 添加模板变体 | —       |
| 模板保存价值检查   | 已实现（项数 <3 则 inspect） | 只检查项数   | 保持现有     | —       |

## 7. Subtitle / Caption

| 维度         | 当前能力                                      | 差距             | P1 可做      | P2 再做                   |
| ------------ | --------------------------------------------- | ---------------- | ------------ | ------------------------- |
| 字幕数据格式 | 自研 subtitles.json                           | 非标准格式       | 保持现有     | 迁移到 @remotion/captions |
| 字幕渲染     | KnowledgeVideoWithSubtitles + SubtitleOverlay | 基本够用         | —            | 逐词高亮字幕              |
| 字幕安全区   | 无自动检查                                    | 字幕可能遮挡主体 | P1-2 inspect | —                         |

## 8. Cover System

| 维度             | 当前能力   | 差距                      | P1 可做                            | P2 再做  |
| ---------------- | ---------- | ------------------------- | ---------------------------------- | -------- |
| 封面模板         | 3 个       | 缺 card-stack / data-hero | —                                  | 新增模板 |
| 3:4 / 4:3 双比例 | 已实现     | 够用                      | —                                  | —        |
| 封面标题字数检查 | 无         | 不检查标题字数            | P1-2 inspect（platform heuristic） | —        |
| 封面安全区       | 无         | 不检查底部安全区          | P1-2 inspect                       | —        |
| 封面 QA          | 无自动检查 | 只靠人工审片              | P1-2 封面 QA 脚本                  | —        |

## 9. Preview / QA / Visual Metrics

| 维度           | 当前能力                 | 差距             | P1 可做               | P2 再做                |
| -------------- | ------------------------ | ---------------- | --------------------- | ---------------------- |
| preview:visual | 7 步链路已实现           | 子脚本能力有限   | P1-2 增强子脚本检查项 | —                      |
| visualMetrics  | 6 项检查                 | 缺多项检查       | P1-2 扩展到 12 项     | 帧级视觉分析           |
| visualCheck    | pass/inspect/revise 三级 | 只做静态文本分析 | —                     | contact sheet 图像分析 |
| renderManifest | P0 已实现                | 够用             | —                     | —                      |
| mobile_scaled  | P0 已实现                | 够用             | —                     | —                      |

## 10. Content Strategy / Title / Hook

| 维度            | 当前能力                       | 差距                  | P1 可做                      | P2 再做 |
| --------------- | ------------------------------ | --------------------- | ---------------------------- | ------- |
| 标题策略        | 15_CONTENT_STRATEGY 有指导     | 只是文档              | P1-1 提示词升级              | —       |
| Hook 时长       | AGENTS.md 有"前 3 秒 hook"规则 | 不检查实际时长        | P1-2 inspect（价值承诺检查） | —       |
| screenText 摘要 | AGENTS.md 有"不要全文显示"     | 无字数检查            | P1-2 inspect（分级）         | —       |
| CTA 位置        | 无约束                         | 不检查 CTA 是否在最后 | P1-2 inspect                 | —       |

## 11. Agent Workflow / Skill Usage

| 维度           | 当前能力                    | 差距                     | P1 可做                       | P2 再做              |
| -------------- | --------------------------- | ------------------------ | ----------------------------- | -------------------- |
| AGENTS.md      | **已存在**（根目录 360 行） | 需要补充 P0 新增能力边界 | P1-1 审查与增强               | —                    |
| Skill 读取     | 不强制                      | Agent 执行时不读 Skill   | P1-1 写入强制读取规则         | —                    |
| CSS 动画检测   | 无自动检测                  | 不检测 CSS 动画类名      | P1-1 写入禁令（已有文本规则） | validate:render 增强 |
| 执行 checklist | AGENTS.md 有执行规范        | 需要补充 P0 新增产物     | P1-1 增强                     | —                    |

## 12. Platform Packaging

| 维度         | 当前能力 | 差距                 | P1 可做 | P2 再做                    |
| ------------ | -------- | -------------------- | ------- | -------------------------- |
| 16:9 主视频  | 已实现   | 够用                 | —       | —                          |
| 3:4 封面     | 已实现   | 够用                 | —       | —                          |
| 4:3 封面     | 已实现   | 够用                 | —       | —                          |
| 9:16 竖屏    | 未实现   | 不建议默认做         | —       | reject for current default |
| 多平台差异化 | 无       | 不建议为每个平台重写 | —       | reject                     |

---

## 差距严重度排序（V2 修正）

| 排名 | 差距                           | 影响范围         | 严重度 | P1 包 |
| ---- | ------------------------------ | ---------------- | ------ | ----- |
| 1    | AGENTS.md 需补充 P0 新能力边界 | Agent 执行约束   | 高     | P1-1  |
| 2    | primaryAreaRatio 长期 null     | 合约系统部分失效 | 高     | P1-2  |
| 3    | 连续 scene 类型无检测          | PPT 感风险       | 高     | P1-2  |
| 4    | screenText 无代码级字数检查    | 认知过载风险     | 高     | P1-2  |
| 5    | BGM 不随 voiceover 降低        | 口播听不清       | 中     | P1-3  |
| 6    | 字号下限偏低（正文 28px）      | 手机端可读性     | 中     | P1-2  |
| 7    | 封面标题字数无检查             | 平台适配         | 中     | P1-2  |
| 8    | Hook 价值承诺不检查            | 完播率           | 中     | P1-2  |
| 9    | 对比度不检查                   | 可读性           | 中     | P1-2  |
| 10   | 连续静态页不检查               | PPT 感           | 低     | P1-2  |
