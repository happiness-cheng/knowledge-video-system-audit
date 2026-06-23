# P1-4A Director Rules Integration Audit

## 1. 当前接入现状

`DIRECTOR_VISUAL_RULES.md` 是孤立文档。系统内没有任何文件引用它。

逐文件覆盖度：

| 文件                              | 是否引用 DIRECTOR_VISUAL_RULES | 已覆盖规则              | 缺失                |
| --------------------------------- | ------------------------------ | ----------------------- | ------------------- |
| 03_CONTENT_BRIEF_TO_VIDEO_SPEC    | 否                             | Rule 3/4/5 片段         | 1/2/4细节/6/7       |
| 06_PREVIEW_REVIEW_PROMPT          | 否                             | Rule 5 片段             | 1/2/3/4/6/7         |
| 07_STYLE_THEME_LAYOUT_RULES       | 否                             | Rule 2/3/4/5 片段       | 1/2细节/4反模式/6/7 |
| 14_VISUAL_DESIGN_SYSTEM           | 否                             | Rule 3 最全（四层结构） | 1/2/4反模式/6/7     |
| AGENTS.md                         | 否                             | Rule 6 片段             | 全部                |
| P1_2B_VISUAL_ACCEPTANCE_CHECKLIST | 否                             | Rule 1/3/4 片段         | 2/5/6/7             |
| P1_2B_VISUAL_DIRECTION_SPEC       | 否                             | Rule 1/3/4 片段         | 2/5/6/7             |
| validate-render-code.ts           | 否                             | 无（仅检查 CSS 禁令）   | 全部                |

## 2. 缺失接入口

| 规则                        | 当前覆盖                   | 缺口                                |
| --------------------------- | -------------------------- | ----------------------------------- |
| 1. Cue Wiring               | 0 处完整覆盖               | scene 分支验证、debug overlay 流程  |
| 2. White Theme Spotlight    | 0 处有信号表               | 多信号叠加规格缺失                  |
| 3. Evidence Page            | 14 有四层结构              | 标题层级不重复、150px 安全区未写入  |
| 4. Template Page            | 07/14 有截图保存           | 等权规则、反模式清单缺失            |
| 5. Subtitle Safe Zone       | 多处提及"字幕安全区"       | 150px 常量未写入任何规范            |
| 6. Defensive Implementation | AGENTS.md 有 validate 命令 | 分支定向规则缺失                    |
| 7. Progressive Debug Flow   | 0 处                       | wiring→data→visual 诊断序列完全空白 |

## 3. 建议接入位置

### Rule 1: Cue Wiring → 06_PREVIEW_REVIEW_PROMPT + AGENTS.md

- **06_PREVIEW_REVIEW_PROMPT**：新增 "Cue Wiring 验证" 检查项 — 确认 cue 代码在实际渲染分支中被消费
- **AGENTS.md**：新增 "Cue Debug 流程" — 先查 wiring、再查 data、最后查 visual
- 改动类型：**checklist**（审片时必须检查）

### Rule 2: White Theme Spotlight → 07_STYLE_THEME_LAYOUT_RULES + 14_VISUAL_DESIGN_SYSTEM

- **07_STYLE_THEME_LAYOUT_RULES**：新增白底 spotlight 信号表（背景 tint / 色条 / 边框 / 阴影 / scale / 文字）
- **14_VISUAL_DESIGN_SYSTEM**：在 active state 章节引用信号表
- 改动类型：**reference-only**（给 Agent 参考规格，不硬门禁）

### Rule 3: Evidence Page → 03 + 07 + 14

- **03_CONTENT_BRIEF_TO_VIDEO_SPEC**：证据页生成时要求"标题层级不重复"
- **07_STYLE_THEME_LAYOUT_RULES**：EvidenceBlock 规格更新（label 30px / conclusion 44px / 截图 flex:1）
- **14_VISUAL_DESIGN_SYSTEM**：四层结构中补充 150px 安全区
- 改动类型：**checklist**（生成时必须满足）

### Rule 4: Template Page → 07 + 14

- **07_STYLE_THEME_LAYOUT_RULES**：新增模板页等权规则 + 反模式清单
- **14_VISUAL_DESIGN_SYSTEM**：模板页章节补充"不做 progressive-retain"
- 改动类型：**checklist**

### Rule 5: Subtitle Safe Zone → 03 + 06 + 14

- **03**：videoSpec 生成时要求预留 150px
- **06**：preview 时检查关键内容是否进入底部 150px
- **14**：layout tokens 中 codify 150px 常量
- 改动类型：**hard-gate**（preview 发现遮挡时必须 revise）

### Rule 6: Defensive Implementation → AGENTS.md

- **AGENTS.md**：新增"防御式修改"规则 — 只改目标分支、不改 videoSpec/themes/KnowledgeVideo
- 改动类型：**checklist**

### Rule 7: Progressive Debug Flow → AGENTS.md

- **AGENTS.md**：新增调试流程 — wiring → data → visual
- 改动类型：**reference-only**（Agent 调试参考，不硬门禁）

## 4. 不建议接入的内容及理由

| 内容                                         | 不建议接入    | 理由                                                |
| -------------------------------------------- | ------------- | --------------------------------------------------- |
| Debug overlay 代码模板                       | 不进 06/07/14 | 仅开发调试用，不是生产流程的一部分                  |
| validate-render-code.ts                      | 不改          | 该脚本只做 CSS 禁令检查，视觉规则不应混入静态分析   |
| videoSpec schema                             | 不改          | 当前 videoSpec 不需要新增字段，视觉规则在组件层处理 |
| coverSpec / coverBrief                       | 不改          | 封面系统独立，不涉及 P1-3 规则                      |
| 实验版能力（KineticTitle / 背景系统 / 转场） | 不迁移        | 本轮明确不扩大范围                                  |

## 5. 最小改动方案

仅改动 4 个文件，每个文件加 1-2 段落：

| 文件                                                            | 改动                                               | 改动量 |
| --------------------------------------------------------------- | -------------------------------------------------- | ------ |
| `knowledge-video-system/prompts/06_PREVIEW_REVIEW_PROMPT.md`    | 新增 "Cue Wiring 验证" + "字幕安全区 150px" 检查项 | ~15 行 |
| `knowledge-video-system/prompts/07_STYLE_THEME_LAYOUT_RULES.md` | 新增白底 spotlight 信号表 + 模板页等权规则         | ~20 行 |
| `AGENTS.md`                                                     | 新增 "Cue Debug 流程" + "防御式修改" 规则          | ~15 行 |
| `docs/director/DIRECTOR_VISUAL_RULES.md`                        | 无改动（源文档保持不变）                           | 0 行   |

**不改**：03（生成阶段改动风险大，留待下一轮）、14（设计系统文档层级高，需单独审查）、validate-render-code.ts（职责不匹配）。

## 6. 是否建议进入 P1-4B 文档接入补丁

**建议：是，但限最小范围。**

P1-4B 只做上述 3 个文件的小段落接入，不重构 prompt 结构，不新增 schema，不改 renderer。

理由：

- 7 条规则中有 3 条是硬知识（Rule 2/5/7），不接入会导致下个视频重蹈覆辙
- 但改动量极小（~50 行），风险可控
- 不需要改 videoSpec、renderer、themes

---

本轮只做 P1-4A 导演规则接入审查；未修改正式文件，未渲染 mp4，未生成 TTS / 字幕。
