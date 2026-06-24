# Visual Spike 01 — State Block

## 验证目标

> 审查未通过后，下游生产流程真实停止。

## 实现方案

扩展 `ProcessStepsScene` 新增 `blockAtFrame` 字段，实现时序阻断。

6 步生产流程（内容候选→审查→音频→字幕→渲染→发布），审查在第 4 秒失败，下游 4 步同时冻结。

## 验证结果

### 冷观看

| 问题                     | 正确答案            | 画面是否支持             |
| ------------------------ | ------------------- | ------------------------ |
| 哪个节点失败了？         | 审查                | 是 — 红叉 + 删除线       |
| 失败后发生了什么？       | 流程停止            | 是 — 下游灰化 + 箭头暗淡 |
| 哪些步骤没有继续？       | 音频/字幕/渲染/发布 | 是 — 4 步同时阻断        |
| 是状态变化还是文字提醒？ | 状态变化            | 是 — 颜色/图标/滤镜全变  |

### 三类贡献

- **explanationContribution**: 主贡献 — 展示失败如何切断下游
- **comprehensionContribution**: 辅助贡献 — 抽象门禁转化为状态变化
- **attentionContribution**: 辅助贡献 — 流动中断产生反差

### TruthBoundary

原型只表达：在本项目已定义的门禁流程里，审查失败会阻断生产。

不得扩展成：所有软件、所有 AI 工作流都会如此。

## 已知限制

1. 阻断即时生效，无过渡动画
2. 下游无"等待"视觉状态
3. 未展示"审查通过后恢复"

## 完成状态

`Visually Verified` — 视频已渲染，关键帧已提取，冷观看通过。等待用户确认。

## 文件清单

```
spike/state-block/
├── 00_SPIKE_REPORT.md
├── 01_VISUAL_PHILOSOPHY_ACKNOWLEDGEMENT.json
├── 02_INTENT_FIRST_SPEC.json
├── 03_CAPABILITY_PREFLIGHT.json
├── 04_IMPLEMENTATION_NOTES.md
├── 05_VISUAL_SPIKE_RESULT.json
├── render/
│   └── state-block-spike.mp4
├── frames/
│   ├── 01-before-review.png
│   ├── 02-reviewing.png
│   ├── 03-failure-event.png
│   ├── 04-downstream-blocked.png
│   └── 05-final-hold.png
├── mobile/
│   ├── mobile-preview.mp4
│   └── mobile-keyframe.png
└── evidence/
    ├── semantic-goal-vs-actual.md
    └── state-transition-table.md
```
