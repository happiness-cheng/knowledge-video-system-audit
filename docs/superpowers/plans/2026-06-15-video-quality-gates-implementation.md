# Video Quality Gates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use the repository execution workflow and complete each checkbox in order. Do not commit unless the user explicitly requests it.

**Goal:** 将统一视频质量评分、四阶段门禁和最小平台包装写入项目提示词与 JSON 数据结构。

**Architecture:** `qualityScore.json` 是唯一完整评分源；内容与分镜文件只保存简短 `qualityGate`。各提示词在自己负责的阶段执行门禁，最终由审片与发布包规则汇总评分和硬门槛。

**Tech Stack:** Markdown prompts, JSON, TypeScript/Remotion validation commands

---

### Task 1: 统一项目上下文和主流程

**Files:**
- Modify: `knowledge-video-system/prompts/00_PROJECT_CONTEXT.md`
- Modify: `knowledge-video-system/prompts/01_VIDEO_PIPELINE_V1.md`

- [x] 在项目上下文中定义 85/15 评分结构、单一评分源、硬门槛和最小平台包装。
- [x] 将主流程改为四阶段质量门禁。
- [x] 删除默认短视频和固定 scene 数导向，改为证据与信息增量决定时长。
- [x] 更新 Agent Handoff Package，加入 `qualityScore.json`、字幕、双封面和发布元数据要求。

### Task 2: 内容策划与分镜门禁

**Files:**
- Modify: `knowledge-video-system/prompts/02_ARTICLE_TO_CONTENT_BRIEF_PROMPT.md`
- Modify: `knowledge-video-system/prompts/03_CONTENT_BRIEF_TO_VIDEO_SPEC_PROMPT.md`

- [x] 为 contentBrief 阶段增加选题价值、案例潜力、方法潜力和时长支撑判断。
- [x] 为 videoSpec 阶段增加真实案例四要素、信息增量和结构递进检查。
- [x] 两个阶段只输出简短 `qualityGate`，不得保存完整分数。

### Task 3: 审片、样式和封面规则

**Files:**
- Modify: `knowledge-video-system/prompts/06_PREVIEW_REVIEW_PROMPT.md`
- Modify: `knowledge-video-system/prompts/07_STYLE_THEME_LAYOUT_RULES.md`
- Modify: `knowledge-video-system/prompts/08_VIDEO_SPEC_TO_COVER_BRIEF.md`
- Modify: `knowledge-video-system/prompts/09_COVER_BRIEF_TO_COVER_SPEC.md`

- [x] 审片提示词增加第三阶段门禁、同步字幕和最终评分输入要求。
- [x] 样式规则明确字幕、手机可读性和信息增量服务原则。
- [x] 封面提示词限制为一个主标题、一个备用标题和同一创意主线的双比例封面。
- [x] 明确平台包装只做最小必要适配。

### Task 4: JSON 数据结构

**Files:**
- Create: `src/video-system/data/qualityScore.json`
- Modify: `src/video-system/data/contentBrief.json`
- Modify: `src/video-system/data/videoSpec.json`

- [x] 创建包含 12 个评分维度、硬门槛和决策字段的唯一评分文件。
- [x] 为 contentBrief 和 videoSpec 增加简短 `qualityGate`。
- [x] 不在其他 JSON 中复制完整评分。

### Task 5: 验证与自审

**Files:**
- Verify all modified files

- [x] 运行 PowerShell JSON 解析检查，所有 data JSON 均解析成功。
- [x] 运行规则一致性搜索，旧固定时长和 3 标题候选规则无残留。
- [x] 运行 `npx tsc --noEmit`，退出码为 0。
- [x] 检查 `git diff --check` 和任务相关状态。
- [x] 按 `review-checklist.md` 完成交付自审并记录失败或跳过项。
