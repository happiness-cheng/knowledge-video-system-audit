# P1 Current Decision Index

> 本文件是 P1 当前有效决策的唯一索引。

---

## 当前有效版本

**V2 / V2.1**

## 有效文件清单

Agent A 后续只能读取以下文件：

| 文件                                                   | 用途                                                    |
| ------------------------------------------------------ | ------------------------------------------------------- |
| `docs/research/P1_RESOURCE_INTEGRATION_ROADMAP_V2.md`  | 总路线图                                                |
| `docs/research/P1_CAPABILITY_GAP_ANALYSIS_V2.md`       | 能力差距分析                                            |
| `docs/research/P1_BACKLOG_V2.md`                       | Backlog（含 sourceConfidence / claimStatus / ruleType） |
| `docs/research/P1_EXECUTION_HANDOFF_FOR_AGENT_A_V2.md` | 执行交接包                                              |
| `docs/research/P1_DECISION_NOTES.md`                   | V1→V2 修正记录                                          |
| `docs/research/P1_CLAIM_AUDIT_V2.md`                   | Claim 审计                                              |
| `docs/research/P1_CURRENT_DECISION.md`                 | 本文件                                                  |

## 历史文件（不作为执行依据）

以下文件只作为历史记录，不得用于执行：

| 文件                                                | 状态                   |
| --------------------------------------------------- | ---------------------- |
| `docs/research/P1_RESOURCE_MAP.md`                  | V1 历史                |
| `docs/research/P1_CAPABILITY_GAP_ANALYSIS.md`       | V1 历史                |
| `docs/research/P1_BACKLOG.md`                       | V1 历史                |
| `docs/research/P1_RESOURCE_INTEGRATION_ROADMAP.md`  | V1 历史                |
| `docs/research/P1_EXECUTION_HANDOFF_FOR_AGENT_A.md` | V1 历史                |
| `docs/research/P1_SOURCE_BIBLIOGRAPHY.md`           | V1（无需修订，仍有效） |

如果旧版与 V2 文件冲突，以 V2 文件为准。

## 硬约束

1. **不得使用旧版 `P1_EXECUTION_HANDOFF_FOR_AGENT_A.md` 执行**
2. **不得执行"创建 AGENTS.md"** — AGENTS.md 已存在（根目录 360 行），任务是审查增强、patch / merge，不是新建或覆盖
3. **P0 Landing 完成前，不执行 P1**
4. **执行 P1 时一次只执行一个包**
5. **执行前必须由用户和 ChatGPT 审查 P0_LANDING_REPORT**
