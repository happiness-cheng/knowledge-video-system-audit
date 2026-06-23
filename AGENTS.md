# AGENTS.md

This file is the Codex entry contract for this repository.

## 项目定位

"世间一点尘"的 Remotion 知识视频生产系统。内容质量由网页版 ChatGPT 与用户负责，Codex 主要负责消费已批准的正式输入，完成工程实现、音频字幕、Studio 预览、视觉验收和系统维护。

<!-- BEGIN SHARED_V2_CONTRACT -->

## 先判断任务模式

开始工作前，必须先把当前任务归入一种模式；不确定时停止并询问，不得混用权限。

### A. Production Execution Mode（默认生产模式）

适用于：制作、调整、预览或渲染某一条视频。

Agent 的职责是执行已经完成内容审查并 promotion 的正式交接物。Agent **不负责重新完成网页版 GPT 的选题讨论、Scope Contract、Coverage Map、Fact Evidence Map 或多 AI 评分**，也不得自行判断"内容应该通过"。这些由内容模块和机器门禁负责。

开工接口：

1. 运行 `npm run gate:preproduction`。
2. 确认读取的是 promotion 后的正式执行输入，而不是 `*.review-candidate.*`。
3. 门禁失败时立即停止，只报告失败原因；不得修改审查分数、digest、批准字段或候选稿来绕过门禁。
4. 门禁通过后，才允许按顺序执行：
   - `npm run generate-audio`
   - `npm run generate-subtitles`
   - `npm start`
   - `npm run preview:visual`
5. MP4 或正式封面只在用户明确要求时生成。

生产模式禁止：

- 把存在 `videoSpec.json` 当作内容已批准。
- 把 `recommendation: pass` 当作用户授权。
- 自行写入或推断 `userDecision`、`approvedByUser`、`decisionNote`、`decidedAt`。
- 门禁失败后继续 TTS、字幕、生产 Studio、视觉预览或渲染。
- 为解决内容问题先改 Remotion 组件。
- 将实验入口作为正式生产门禁的绕过路径。

### B. System Maintenance Mode（系统维护模式）

适用于：升级流程、修复脚本、增加能力、修改组件、validator、registry、schema、文档或测试。

维护前必须读取：

- `docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md`
- `knowledge-video-system/prompts/00_PROJECT_CONTEXT.md`
- `knowledge-video-system/prompts/01_VIDEO_PIPELINE_V1.md`
- `knowledge-video-system/prompts/17_PREPRODUCTION_REVIEW_GATE.md`
- `knowledge-video-system/prompts/18_REVISION_ROUTER.md`
- `knowledge-video-system/prompts/19_EXTERNAL_MULTI_AI_REVIEW.md`
- `src/video-system/visual/capabilityRegistry.ts`
- 相关 validator、测试和实际调用入口

修改前输出 Project Understanding Report 与 Implementation Plan，明确修改文件、不修改文件、风险和回滚方式。修改后必须给出 diff、测试结果、失败项和剩余风险。不得通过降低阈值、篡改 fixture 或删除失败测试来获得 PASS。

系统维护不得顺手生成正式 TTS、字幕、图片、视频或发布产物，除非用户明确要求该验证产物。

### C. Audit / Review Mode（只读审查模式）

适用于：审查完成度、验证 Agent 报告、寻找绕过路径或真源冲突。

默认只读。结论必须以实际源码、脚本入口、测试覆盖和可复现行为为依据，不能把"文档写了""测试数量多"或 Agent 自报完成当作实现证据。

## 硬边界

- 用户是唯一最终决策人。
- Agent 只运行机器门禁，不手工替代门禁算法判断评分是否通过。
- 候选稿发生变化后，旧审查和 digest 失效；必须重新审查和 promotion。
- 审片后先走 Revision Router，修改最小真源：内容问题回内容层，视觉意图问题回导演层，只有能力预检确认不足时才升级组件。
- 未在源码、registry 和 validator 中落地的能力不得写成"已支持"。
- 不得泄露、打印、提交或上传密钥、Token、Cookie、私人路径、私人素材和未授权二进制文件。
- 未经用户明确授权，不得创建公开仓库、push、发布或发送外部请求。

## 真源优先级

发生冲突时按以下顺序处理，并报告冲突：

```text
实际源码、调用入口、capabilityRegistry、validator 与测试
> docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md
> CLAUDE.md / AGENTS.md 的共享核心区
> prompts 00—19
> 迁移指南和当前 README
> 历史报告、旧阶段文档和 Agent 完成声明
```

`src/video-system/README.md` 不得定义与本契约竞争的生产流程；如有冲突，以本契约和机器门禁为准，并把 README 漂移列为待修复问题。

## 关键停止条件

出现以下任一情况必须停止：

- `gate:preproduction` 失败。
- 当前输入无法证明已 promotion。
- 用户授权模糊或缺失。
- reviewed digest 与当前输入不一致。
- 生产入口与实验入口是否隔离无法确认。
- 任务要求超出 capabilityRegistry 的已实现能力。
- 发现秘密、隐私、未授权素材或不可逆外部操作风险。

## 常用命令

### 生产执行

```bash
npm run gate:preproduction
npm run generate-audio
npm run generate-subtitles
npm start
npm run preview:visual
```

只有用户明确要求时：

```bash
npm run render:subs
npm run cover:3x4
npm run cover:4x3
```

### 系统维护与审查

```bash
npm run typecheck
npm test
npm run validate:agent-contracts
npm run validate:system
```

`npm run studio:lab` 只能用于已确认与正式 Composition 隔离的实验入口。若它与生产 Studio 使用同一个 `src/index.ts` 且无法证明 Composition 隔离，不得把它视为安全的无门禁入口。

## 技术底线

- 帧率固定 30fps，时长以 `audioTiming` 为准。
- 禁止 CSS `transition`、CSS animation、`@keyframes` 和 Tailwind 动画类；使用 Remotion frame-driven API。
- 视频必须经过 Studio 与人工审片；命令成功不等于视觉通过。
- 正式能力以 `src/video-system/visual/capabilityRegistry.ts` 为准，不在根入口复制静态数量作为长期真源。
- 封面生产策略以当前项目契约为准；Remotion cover 不是默认唯一方案。

<!-- END SHARED_V2_CONTRACT -->

## Codex 专属执行要求

- 先确认模式，再只读取与任务相关的文件；生产任务不要重新承担内容审查职责。
- 写操作前先列出目标文件、最小修改方案、验证与回滚方式。
- 优先小范围、可回滚修改；不要顺手清理无关代码。
- 完成后逐项报告实际执行过的命令、结果、未运行项和人工待验收项。

## 输出目录

- `out/`：本地渲染与审片产物，默认不提交。
