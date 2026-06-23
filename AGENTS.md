# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## 项目概述

"世间一点尘"自媒体品牌的 Remotion 视频生产系统。用 React 组件化方式制作程序化视频，发布到 YouTube/Bilibili/抖音。

品牌定位：一个普通大学生用 AI 做各种实验，把真实过程记录下来。不是"我教你"，而是"我试给你看"。

<!-- BEGIN SHARED_V2_CONTRACT -->

## V2 核心契约

详细规则见 `docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md`。

### 两个模块

| 模块     | 负责人                | 职责                                                  |
| -------- | --------------------- | ----------------------------------------------------- |
| 内容模块 | 网页版 ChatGPT + 用户 | 吸引力、事实、证据、讲全讲透、制作前审查              |
| 画面模块 | Agent                 | 执行已批准内容的 Remotion、素材、音频、字幕、视觉验收 |

Agent 不得替代内容模块做最终内容判断。

### V2 正式流程

```text
选题 / 文章
→ contentBrief review candidate（含 Scope Contract / Coverage Map / Fact Evidence Map）
→ videoSpec + coverBrief review candidate
→ 多 AI 独立审查同一 SHA-256 快照
→ 制作前 90 分门禁
→ 用户明确批准
→ promotion 为正式执行稿
→ TTS / 字幕 / Studio / visual preview
→ 用户审片
→ Revision Router
→ 成片发布门禁
```

### 制作前硬门禁

以下条件全部满足前，禁止正式制作（TTS、字幕、生产 Studio、MP4）：

1. 必需审查角色齐全
2. 至少两个不同 `reviewerSystem`
3. 平均分 ≥ 90，中位数 ≥ 90
4. 任一审查者不得低于 85，分差 ≤ 8
5. 关键维度达到独立阈值，无 hard veto
6. `reviewedInputDigest` 与当前候选稿 SHA-256 一致
7. 用户明确批准，promotion 已完成

### Candidate 与正式稿

- 不得因为存在 `videoSpec.json` 就推断内容已批准
- 内容阶段优先修改 `*.review-candidate.json`
- 候选稿修改后旧审查和 digest 自动失效
- promotion 后的文件才是 Agent 正式执行输入

### 修改入口（Revision Router）

审片后先判断问题类型，再修改最小真源。详见 `docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md` §六。

### 用户权限

- 用户是唯一最终决策人
- Agent 不得自行写入或推断 `userDecision`、`approvedByUser`、`decisionNote`、`decidedAt`
- `recommendation: pass` 不等于用户批准

### 当前能力真源

能力冲突时：源码 / capabilityRegistry / validator > 本文件 > prompts 00—19 > 历史报告。

当前正式：22 scene / 22 renderer / 8 themes / 5 semantic patterns。以 `src/video-system/visual/capabilityRegistry.ts` 为准。

<!-- END SHARED_V2_CONTRACT -->

## 常用命令

```bash
# 系统自检
npm run validate:system

# 实验组件 Studio（不经过制作前门禁）
npm run studio:lab

# 正式 Studio（需要 gate:preproduction 通过）
npm start

# 生成 TTS / 字幕
npm run generate-audio
npm run generate-subtitles

# 视觉预览
npm run preview:visual

# 渲染 MP4（需要用户明确要求）
npm run render:subs
```

## 提示词系统

`knowledge-video-system/prompts/` 目录下 00-19 共 20 个 prompt 文件：

| 文件 | 作用                       |
| ---- | -------------------------- |
| 00   | 系统能力清单（必读）       |
| 01   | 流程总览                   |
| 02   | 文章 → contentBrief        |
| 03   | contentBrief → videoSpec   |
| 04   | 素材接入                   |
| 05   | TTS 文本处理               |
| 06   | 审片指南                   |
| 07   | 风格/主题/布局规则         |
| 08   | videoSpec → coverBrief     |
| 09   | coverBrief → coverSpec     |
| 10   | 视频 → 通用发布元数据      |
| 11   | 最终评分与发布门禁         |
| 12   | spokenText → 同步字幕      |
| 13   | 理论依据和最佳实践         |
| 14   | 视觉系统底座               |
| 15   | 内容账号策略与创作者定位   |
| 16   | 观众研究与留存闭环         |
| 17   | 制作前多方审查与 90 分门禁 |
| 18   | 审片后 Revision Router     |
| 19   | 外部多 AI 独立审查协议     |

## 关键技术约定

- 帧率固定 30fps，所有时间计算基于此
- CSS transitions/animations 禁止使用，必须用 `interpolate()` + `spring()`
- Tailwind 动画类名禁止
- 场景时长从 audioTiming 读取，禁止硬编码帧数
- 视频必须先 Studio 预览确认，再执行渲染
- 封面默认由 GPT Image 生成，Remotion cover 只做 fallback

## Codex 专属规则

- 执行前报告：Project Understanding Report + Implementation Plan
- 执行后验证：修改文件清单、验证结果、失败项、回滚方式
- 禁止自行修改 `userDecision`、`approvedByUser`、`decisionNote`、`decidedAt`
- 禁止创造新的 scene type 或把待开发能力写成已实现
- 实验组件使用 `npm run studio:lab`，不经过制作前门禁

## 输出目录

- `out/` — 渲染输出（视频、封面），已 gitignore
