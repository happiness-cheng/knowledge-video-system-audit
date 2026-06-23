# 视频质量门禁设计

## 定位

项目采用“内容质量优先 + 最小平台适配 + 全流程质量门禁 + 单一评分源”。

同一个视频本体默认复用于抖音、快手、小红书和 B站。平台适配只保留必要包装，不为每个平台重做完整内容、标题体系或封面创意。

## 质量结构

总分 100 分：

| 类别 | 指标 | 分值 |
|---|---|---:|
| 内容质量 | 选题承诺 | 10 |
| 内容质量 | 痛点命中 | 10 |
| 内容质量 | 获得感 | 15 |
| 内容质量 | 惊喜感 / 认知反差 | 10 |
| 内容质量 | 真实案例 / 实验 | 15 |
| 内容质量 | 结构递进 | 10 |
| 内容质量 | 可执行方法 / 模板 | 10 |
| 内容质量 | 表达力 / 感染力 | 5 |
| 通用包装 | 3:4 + 4:3 双封面 | 5 |
| 通用包装 | 标题清楚有点击欲 | 4 |
| 通用包装 | 同步字幕完整 | 3 |
| 通用包装 | 简介和标签可复用 | 3 |

完整分数只保存在 `qualityScore.json`。其他 JSON 只保存显式权限门禁：

```json
{
  "qualityGate": {
    "stage": "contentBrief",
    "reviewer": "chatgpt",
    "recommendation": "pass",
    "keyRisks": [],
    "userDecision": "pending",
    "approvedByUser": false,
    "decisionNote": "",
    "decidedAt": null
  }
}
```

ChatGPT 负责 `recommendation`，用户负责 `userDecision`，Agent 只能按已记录授权执行。`recommendation: pass` 不等于用户批准。

## 四阶段门禁

### contentBrief

判断选题是否值得制作，检查选题承诺、痛点、获得感、认知反差、案例潜力和方法潜力。若内容证据不足，应缩短、补案例、拆分或放弃，不以增加口播填充时长。

### videoSpec

判断内容结构是否成立。每个 scene 必须有清晰的信息作用；真实案例至少包含“原状态、改变、结果、结论”中的三项；连续 20-40 秒应有新问题、新证据、新结论、新方法或新应用。

### 审片

判断实际成片的表达、节奏、字幕和画面是否成立。同步字幕必须与口播一致，可断句但不能改写；画面应服务理解，避免长时间停留和全文堆字。

### 发布包

汇总最终评分、硬门槛和包装完整性，生成最终发布决策。默认包装为：

- 一个主标题和一个备用标题。
- 一版 3:4 封面和一版 4:3 封面。
- 一版短简介和一版 B站长简介。
- 一组通用标签。

## 硬门槛

硬门槛独立于总分，不能被其他项目得分抵消：

1. 同步字幕完整。
2. 3:4 和 4:3 双封面齐全。
3. 存在真实案例或实验，且不得虚构。
4. 存在可执行方法或模板。
5. 获得感至少 9/15。
6. 真实案例 / 实验至少 9/15。
7. 可执行方法 / 模板至少 6/10。

任一硬门槛失败时，`hardGatePassed` 必须为 `false`，最终 `scoreRecommendation` 不能为 `excellent` 或 `publish`。

## 发布决策

| 分数 | scoreRecommendation | 审查建议 |
|---:|---|---|
| 90-100 | excellent | 可以发布，优先发布 |
| 85-89 | publish | 可以发布 |
| 75-84 | revise | 修改薄弱项后发布 |
| 60-74 | major-revise | 重构部分内容 |
| 0-59 | reject | 放弃、缩短或拆成其他选题 |

若分数达到发布区间但硬门槛失败，建议降为 `revise` 或更低，并明确下一步动作。最终是否发布仍由用户决定。

## 交接包

- Execution Handoff Package：用于 TTS、audioTiming、字幕、视频预览和双封面渲染，不要求 qualityScore 已存在；要求 videoSpec 阶段已获得 continue 授权。
- Release Package：用于最终发布归档；要求 previewGate 已 continue、publishMetadata.approval 已 continue、qualityScore 已 publish，所有授权为 true，且 hardGatePassed 为 true。

## 时长策略

时长是内容成立后的结果，不是质量目标：

- 单一观点或技巧可做 90-180 秒。
- 有案例、方法和迁移场景时可做 3-8 分钟。
- 系统拆解或复杂工具链可做 8-12 分钟或更长。

不按时长硬性规定 scene 数。scene 数由注意力节拍和信息增量决定，每个 scene 仍只表达一个核心点。

## 数据职责

- `contentBrief.json`：内容判断与简短门禁状态。
- `videoSpec.json`：画面、口播与简短门禁状态。
- `qualityScore.json`：唯一完整评分、证据、缺口、动作、硬门槛、GPT 建议与用户决定。
- `subtitles.json`：同步字幕。
- `coverSpec.json`：双比例封面规格。
- 发布元数据：两个标题、两版简介和一组标签，可放入质量评分文件的 packaging evidence 或后续独立发布文件。

## 非目标

- 不建立抖音、快手、小红书和 B站的独立评分体系。
- 不为每个平台生成完全不同的视频本体。
- 不把 5-8 分钟或固定 scene 数设为发布条件。
- 不修改本次质量规则以外的 Remotion 组件。
