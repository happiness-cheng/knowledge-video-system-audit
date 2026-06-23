# Knowledge Video System V2 — Agent 契约

本文件是 CLAUDE.md 和 AGENTS.md 的共享详细真源。两个根入口引用本文件，不重复维护完整正文。

---

## 一、两个模块

| 模块     | 负责人                | 职责                                                  |
| -------- | --------------------- | ----------------------------------------------------- |
| 内容模块 | 网页版 ChatGPT + 用户 | 吸引力、事实、证据、讲全讲透、制作前审查              |
| 画面模块 | Agent                 | 执行已批准内容的 Remotion、素材、音频、字幕、视觉验收 |

Agent 不得替代内容模块做最终内容判断。

---

## 二、V2 正式流程

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

---

## 三、三种工作模式

| 模式            | 适用场景                     | 审查角色                                     |
| --------------- | ---------------------------- | -------------------------------------------- |
| `quick`（默认） | 单点知识、90s–5min、证据清楚 | cold-viewer + content-editor + fact-evidence |
| `standard`      | 多章节、真实案例、5–10min    | 上述 + visual-audio-director                 |
| `deep`          | 争议命题、旗舰内容、反证实验 | 上述 + 完整来源核验 + 分歧仲裁               |

---

## 四、制作前硬门禁

以下条件全部满足前，禁止正式制作（TTS、字幕、生产 Studio、MP4）：

1. 必需审查角色齐全
2. 至少两个不同 `reviewerSystem`
3. 平均分 ≥ 90
4. 中位数 ≥ 90
5. 任一审查者不得低于 85
6. 最高与最低分差 ≤ 8
7. 关键维度达到独立阈值
8. 无 hard veto
9. `reviewedInputDigest` 与当前候选稿 SHA-256 一致
10. 用户明确批准
11. promotion 已完成

---

## 五、Candidate 与正式稿

- 不得因为存在 `videoSpec.json` 就推断内容已批准
- 内容阶段优先修改 `*.review-candidate.json`
- 候选稿修改后旧审查和 digest 自动失效
- promotion 后的文件才是 Agent 正式执行输入

---

## 六、修改入口（Revision Router）

| 问题类型                 | 首要修改真源                                            | 不要先改                |
| ------------------------ | ------------------------------------------------------- | ----------------------- |
| 观众不关心、痛点弱       | contentBrief.audienceStrategy / Scope Contract          | Remotion 组件           |
| 标题吸引但正文没兑现     | Scope Contract / Coverage Map / 口播结构                | 封面美术                |
| 核心事实错误             | Fact Evidence Map / contentBrief / voiceover            | 字幕措辞                |
| 开场无聊                 | attentionBeats / S01-S03 口播与 visual event            | 全局主题                |
| 中段重复、拖沓           | narrativeDesign / videoSpec scene 合并拆分              | 转场速度                |
| 口播像 AI 稿             | videoSpec.voiceover / spokenText                        | TTS 音色                |
| 画面没参与讲解           | scene 级 visualDirection / scene type / semanticPattern | 加装饰动画              |
| 画面意图成立但组件做不到 | capability preflight → component / generated asset      | 强行塞现有字段          |
| 图片裁切、框错           | assetManifest / assetLayout / annotation                | contentBrief            |
| 字幕断句或遮挡           | spokenText / subtitle script / SubtitleOverlay          | 口播观点                |
| 发音错误、节奏机械       | spokenText / glossary / audio config                    | 画面时长硬改            |
| 封面点击弱               | coverBrief + GPT Image prompt                           | Remotion cover fallback |

---

## 七、用户权限

- 用户是唯一最终决策人
- Agent 不得自行写入或推断 `userDecision`、`approvedByUser`、`decisionNote`、`decidedAt`
- `recommendation: pass` 不等于用户批准
- `approvedByUser: true` 时也只能执行 `userDecision` 对应动作

---

## 八、当前能力真源

能力冲突时按以下优先级：

```text
实际源码 / capabilityRegistry / validator
> 当前 V2 契约（本文件）
> prompts 00—19
> 迁移指南
> 历史报告和旧说明
```

当前正式能力：22 scene / 22 renderer / 8 themes / 5 semantic patterns。以 `src/video-system/visual/capabilityRegistry.ts` 为准。

---

## 九、各阶段允许执行的命令

| 阶段      | 允许                                                              | 禁止                         |
| --------- | ----------------------------------------------------------------- | ---------------------------- |
| 内容设计  | `validate:content`                                                | `generate-audio`, `render:*` |
| 审查准备  | `prepare:preproduction`, `packet:preproduction`                   | 修改候选稿                   |
| 审查导入  | `import:preproduction-review`, `refresh:preproduction-consensus`  | 修改候选稿                   |
| 门禁检查  | `gate:preproduction:review`, `gate:preproduction`                 | 跳过门禁                     |
| promotion | `promote-preproduction`                                           | 手工复制                     |
| 正式制作  | `start`, `generate-audio`, `generate-subtitles`, `preview:visual` | 绕过门禁                     |
| 审片      | 用户连续观看                                                      | Agent 代判                   |
| 发布      | `validate:quality`, `gate:release`                                | 低于 90 分发布               |

---

## 十、详细真源索引

| 项目                 | 唯一真源                                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| V2 流程与工作模式    | `knowledge-video-system/prompts/01_VIDEO_PIPELINE_V1.md`                                              |
| 全局运行契约         | `knowledge-video-system/prompts/00_PROJECT_CONTEXT.md`                                                |
| 制作前评分与通过条件 | `knowledge-video-system/prompts/17_PREPRODUCTION_REVIEW_GATE.md`                                      |
| contentBrief V2 结构 | `src/video-system/utils/contentBriefV2.ts`                                                            |
| 制作前机器门禁       | `src/video-system/utils/preProductionGate.ts`                                                         |
| 候选稿 promotion     | `src/video-system/scripts/promote-preproduction-candidates.ts`                                        |
| 制作前当前状态       | `src/video-system/data/preProductionReview.json`                                                      |
| 外部审查 packet      | `src/video-system/scripts/generate-preproduction-review-packet.ts` + `19_EXTERNAL_MULTI_AI_REVIEW.md` |
| 审片后问题路由       | `knowledge-video-system/prompts/18_REVISION_ROUTER.md`                                                |
| 当前修订授权         | `src/video-system/data/revisionDecision.json`                                                         |
| 成片发布评分         | `src/video-system/data/qualityScore.json` + `11_QUALITY_SCORE_AND_RELEASE_GATE.md`                    |
| 发布评分机器门禁     | `src/video-system/utils/qualityScoreGate.ts`                                                          |
| Scene renderer 分支  | `src/video-system/scenes/SceneRenderer.tsx`                                                           |
| Scene contracts      | `src/video-system/visual/sceneContracts.ts`                                                           |
| 能力注册表           | `src/video-system/visual/capabilityRegistry.ts`                                                       |
| 主题注册             | `src/video-system/themes/index.ts`                                                                    |
| 导演 cue 草案        | `src/video-system/data/directorCuesDraft.json`                                                        |
| 导演 cue 解析        | `src/video-system/data/directorCuesResolved.json`                                                     |
| Renderer 可消费 cue  | `src/video-system/data/directorCuesRuntime.ts`                                                        |
