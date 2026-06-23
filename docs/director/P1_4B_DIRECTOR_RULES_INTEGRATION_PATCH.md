# P1-4B Director Rules Integration Patch

## 1. 修改文件

| 文件                                                            | 改动                                       |
| --------------------------------------------------------------- | ------------------------------------------ |
| `knowledge-video-system/prompts/06_PREVIEW_REVIEW_PROMPT.md`    | 新增 Cue Wiring 验证 + 字幕安全区 150px    |
| `knowledge-video-system/prompts/07_STYLE_THEME_LAYOUT_RULES.md` | 新增白底 spotlight 信号表 + 模板页等权规则 |
| `AGENTS.md`                                                     | 新增 Cue Debug 流程 + 防御式修改规则       |

## 2. 每个文件新增了什么

### 06_PREVIEW_REVIEW_PROMPT.md

- **5.3 Cue Wiring 验证**：检查 cue 代码是否在实际渲染分支中被消费，排查顺序 wiring → data → visual
- **硬风险新增**：字幕遮挡主体时必须 revise（底部 150px 安全区）

### 07_STYLE_THEME_LAYOUT_RULES.md

- **lab-template 等权规则**：多项模板等权展示、稳定可截图、不得残留 cue 高亮、不得 progressive-retain 导致第一项更亮
- **白底 Spotlight 规则**：7 信号表（背景 tint / 色条 / 边框 / 阴影 / scale / translateY / 文字色），不得只靠 opacity

### AGENTS.md

- **Cue Debug 流程**：第一步查 wiring、第二步查 data、第三步查 visual，不允许跳过 wiring 直接调颜色
- **防御式修改**：只改目标分支，不改 videoSpec/theme/KnowledgeVideo，不迁移实验版大能力
- **视觉规则补充**：字幕安全区 150px、白底 spotlight 多信号、模板页等权

## 3. git diff 摘要

```
AGENTS.md                                                  | 7 +++
knowledge-video-system/prompts/06_PREVIEW_REVIEW_PROMPT.md | 12 ++++
knowledge-video-system/prompts/07_STYLE_THEME_LAYOUT_RULES.md | 18 ++++++
3 files changed
```

## 4. 是否误改禁止修改文件

否。

```
03_CONTENT_BRIEF_TO_VIDEO_SPEC_PROMPT.md: 空
14_VISUAL_DESIGN_SYSTEM_V1_ALPHA.md: 空
validate-render-code.ts: 空
videoSpec.json: 空
```

## 5. 是否建议进入 P1-4C 下一条真实视频验证

是。7 条规则已接入 3 个入口文件：

- 生成阶段：07 提供 spotlight 信号表和模板页规则
- 审片阶段：06 要求 cue wiring 验证和字幕安全区检查
- Agent 执行：AGENTS.md 固化 debug 流程和防御式修改边界

下一条视频制作时，这些规则会自动生效。建议在新视频的 videoSpec 生成和 Studio 审片中实际验证规则是否被正确引用。
