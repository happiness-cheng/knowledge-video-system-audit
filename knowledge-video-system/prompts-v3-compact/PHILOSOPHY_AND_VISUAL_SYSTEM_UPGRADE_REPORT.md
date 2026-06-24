# 设计哲学与视觉系统 V4 合约收口报告

> 日期：2026-06-24
> 分支：review/v3.1-content-visual-handoff
> 合约版本：V4.0（主链路统一）

---

## 一、当前状态声明

### 已完成

- 哲学真源：已写入，待用户验收
- 内容 Prompt（01-04）：已修改，待合约闭环
- 视觉 Prompt（05）：已修改，待合约闭环
- 输出合约（07）：已重写为索引 + contracts/ 分离
- 质量门禁（06）：已统一为四角色门禁
- Type 接口（capabilityRegistry.ts）：已实现，待提交源码与独立验证
- 合约版本：已统一为 4.0

### 未完成

- 视觉工程能力：未升级（Scene 组件适配、Visual Spike 未开始）
- 视觉验收：未开始
- 语义验收：未开始
- 观众验收：未开始
- 旧 videoSpec 数据迁移：未开始
- 四独立 AI 审查实际执行：未开始
- validator fixture 验证：未完成

---

## 二、V4 合约版本统一

### 主链路统一为 contractVersion: "4.0"

| 合约                    | 版本 | 状态       |
| ----------------------- | ---- | ---------- |
| approvedContentSnapshot | 4.0  | 主链路     |
| shotDirectorSpec        | 4.0  | 主链路     |
| visualSnapshot          | 4.0  | 主链路     |
| preProductionReview     | 4.0  | 四角色门禁 |
| userApproval            | 4.0  | 主链路     |
| capabilityPreflight     | 4.0  | 主链路     |
| capabilityNegotiation   | 4.0  | 主链路     |
| timedVisualAlignment    | 4.0  | 主链路     |
| shotSceneCompileMap     | 4.0  | 主链路     |
| visualDirectionSpec     | 4.0  | 主链路     |
| contentMasterDraft      | 4.0  | 含 V4 字段 |
| beatSheet               | 4.0  | 含 V4 字段 |
| coverBrief              | 4.0  | 含 V4 字段 |

### Legacy 结构（仅用于 V3.1 数据迁移）

| 结构                                   | 说明                                           |
| -------------------------------------- | ---------------------------------------------- |
| preProductionReview (V3.1 dual-review) | 已合并入四角色门禁                             |
| shotPlan (含 visualFocus/visualState)  | 已拆分为 contentSegmentPlan + shotDirectorSpec |

---

## 三、审查机制统一

### 正式门禁：四独立角色审查

| 角色                  | 职责                                   |
| --------------------- | -------------------------------------- |
| cold-viewer           | 模拟首次观众，检查理解与吸引力         |
| content-editor        | 检查内容质量、结构、完整性             |
| fact-evidence         | 检查事实准确性、证据充分性、真实性边界 |
| visual-audio-director | 检查视觉解释、声画同步、动效质量       |

### 门禁条件

- 同一冻结 candidateDigest
- 四份真实、独立审查
- 角色和 reviewerId 唯一
- 至少两个 reviewerSystem
- meanScore >= 90
- medianScore >= 90
- minimumScore >= 85
- max-min <= 8
- 无 hard veto
- 不得由 Agent 模拟

### Quick 模式

Quick 保留轻量自检，不冒充正式预制作门禁。

---

## 四、阶段顺序

```text
Topic Decision
→ researchSynthesis / evidence notes
→ contentMasterDraft（含 viewerStateChange + contentDesignRationale + visualHandoff）
→ humanExpressionReview
→ Beat Sheet + Content Segment Plan
→ 用户批准内容
→ approvedContentSnapshot（只含内容产物）
→ 读取视觉哲学（11）
→ Intent-First Shot Design
→ shotDirectorSpec
→ capabilityPreflight / capabilityNegotiation
→ coverBrief
→ visualSnapshot
→ candidateDigest
→ 四独立审查
→ userApproval
→ TTS / Scene Compile
```

### 快照边界

approvedContentSnapshot 只包含：

- contentMasterDraft
- Beat Sheet
- Scope / Evidence
- 已批准的标题承诺或 topic decision

不包含：

- visual Shot Plan
- shotDirectorSpec
- coverBrief

---

## 五、内容系统 schema 修复

### contentMasterDraft

正式包含：

- viewerStateChange（viewerStateBefore/After/stateChangeReason）
- contentDesignRationale（5 个 why）
- visualHandoff（数组，含 beatId/contentSourceRef/mustBeSeen/canBeSpoken/mustUseEvidence/needsVisualProcess/needsEmotionalExperience/whyThisNeedsVisualSupport）

### beatSheet

每个 Beat 正式包含：

- beatId
- contentFunction
- viewerStateBefore / viewerStateAfter
- informationDelta
- emotionalShift
- whyThisBeatExists

不包含视觉实现字段（visualFocus、visualState、transition、assetStrategy）。

### contentSegmentPlan

内容阶段输出，替代旧 shotPlan：

- beatId / segmentId
- spokenUnit
- mustBeSeen / evidenceRequirement / emotionalRequirement / semanticRelationship

### coverBrief

正式包含 coverViewerStateChange。

---

## 六、能力谈判记录规则

| 等级 | 处理方式                                                              |
| ---- | --------------------------------------------------------------------- |
| L0   | 无需启动 capabilityNegotiation，但在 shotSceneCompileMap 中留简短记录 |
| L1   | 必须写入 capabilityNegotiation                                        |
| L2   | 必须写入并等待用户批准                                                |
| L3   | 禁止执行，不得作为推荐方案                                            |

---

## 七、完成状态定义

| 状态                    | 定义                                                 |
| ----------------------- | ---------------------------------------------------- |
| Not Implemented         | 代码未编写                                           |
| Implemented, Unverified | 代码存在但未验证                                     |
| Technically Verified    | 代码、类型、测试运行正常                             |
| Visually Verified       | 实际渲染中无裁切、遮挡、闪烁、跳变、不可读等视觉故障 |
| Semantically Verified   | 实际画面符合 lockedMeaning、因果和事实边界           |
| Viewer Accepted         | 真实观看条件下，用户确认解释、理解与吸引成立         |

---

## 八、文件清单

### 新增文件

```
knowledge-video-system/prompts-v3-compact/10_CONTENT_DESIGN_PHILOSOPHY_CORE.md
knowledge-video-system/prompts-v3-compact/11_VISUAL_DESIGN_PHILOSOPHY_CORE.md
knowledge-video-system/prompts-v3-compact/12_VISUAL_DESIGN_PHILOSOPHY_FULL.md
knowledge-video-system/prompts-v3-compact/CAPABILITY_NEGOTIATION.md
knowledge-video-system/prompts-v3-compact/contracts/*.schema.json（18 个）
```

### 修改文件

```
knowledge-video-system/prompts-v3-compact/00_GPT_VIDEO_ORCHESTRATOR.md
knowledge-video-system/prompts-v3-compact/01_TOPIC_AND_PROMISE.md
knowledge-video-system/prompts-v3-compact/02_TRUTH_DEPTH_AND_SCOPE.md
knowledge-video-system/prompts-v3-compact/02B_RESEARCH_TO_CONTENT_MASTER.md
knowledge-video-system/prompts-v3-compact/03_HOOK_STRUCTURE_AND_RETENTION.md
knowledge-video-system/prompts-v3-compact/04_COVER_DECISION.md
knowledge-video-system/prompts-v3-compact/05_VISUAL_DIRECTION_AND_HANDOFF.md
knowledge-video-system/prompts-v3-compact/06_QUALITY_GATE_AND_REVISION.md
knowledge-video-system/prompts-v3-compact/07_OUTPUT_CONTRACTS.md
knowledge-video-system/prompts-v3-compact/08_PROJECT_FACTS_AND_CAPABILITIES.md
src/video-system/visual/capabilityRegistry.ts
```

---

## 九、后续工作（不在本轮执行）

1. Visual Spike 原型（3 个关键能力）
2. Scene 组件 V4 适配
3. videoSpec.json V4 字段迁移
4. 四独立 AI 审查实际执行
5. P0_VISUAL_VERIFICATION_BUNDLE
6. validator fixture 完整验证
