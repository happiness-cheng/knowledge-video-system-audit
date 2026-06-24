# Implementation Notes — Visual Spike 01: State Block

## 实现方案

直接复用 `ProcessStepsScene`，新增 `blockAtFrame` 字段实现时序阻断。

### ProcessStepsScene 扩展

新增 `blockAtFrame?: number` 字段到 `ProcessStepsSceneData` 接口：

- 阻断前：步骤正常推进（progressive-reveal 模式）
- 到达 blockAtFrame：blockedAfter 生效，下游步骤立即进入阻断状态
- 阻断后：下游保持冻结，阻断原因标签淡入

### 时序逻辑

```
blockActive = isTemporalBlock ? frame >= blockAtFrame : staticBlockedAfter >= 0
blockedAfter = isTemporalBlock && blockActive ? staticBlockedAfter : -1
```

### Spike Composition

`StateBlockSpike.tsx` 创建独立 composition，不修改主 KnowledgeVideo：

- 300 帧（10 秒 @ 30fps）
- 6 步流程：内容候选 → 审查 → 音频 → 字幕 → 渲染 → 发布
- blockAtFrame: 120（第 4 秒）
- blockedAfter: 1（审查之后）

### 文件清单

| 文件                  | 类型 | 说明                             |
| --------------------- | ---- | -------------------------------- |
| ProcessStepsScene.tsx | 修改 | 新增 blockAtFrame 字段和时序逻辑 |
| StateBlockSpike.tsx   | 新建 | Spike composition                |
| Root.tsx              | 修改 | 注册 StateBlockSpike             |

### 未修改

- 不涉及哲学文件
- 不涉及 V4 Schema
- 不涉及其他 Scene 组件
- 不涉及完整视频
