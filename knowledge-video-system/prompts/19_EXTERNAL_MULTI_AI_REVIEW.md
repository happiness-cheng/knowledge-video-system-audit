# 19 — 外部多 AI 独立审查交接协议

## 目标

把同一版 `contentBrief + videoSpec candidate + coverBrief candidate + optional visualDirection` 交给多个 AI 独立审查，避免所有审查者被前一个答案带偏，也避免审查后材料被悄悄修改。

本文件不替代 `17_PREPRODUCTION_REVIEW_GATE.md`。17 定义评分与门槛，19 定义怎样安全地把材料交给外部审查者并收回结构化结果。

## 标准流程

```bash
npm run prepare:preproduction
npm run packet:preproduction
```

第二条命令生成：

```text
out/preproduction-review-packet/
├── REVIEW_PACKET.md
├── review-template.json
├── packet-manifest.json
└── 01_... / 02_... / 03_... 被审材料副本
```

每个 AI 只接收同一份 packet，并被分配一个不同角色：

- cold-viewer
- content-editor
- fact-evidence
- visual-audio-director（standard / deep）

审查者不得先看其他 AI 的答案。每个审查结果必须保留 packet 中的 `reviewedInputDigest`。一次门禁至少要有两个不同的 `reviewerSystem`，且每个必需角色恰好一位审查者。

## 导入结果

每个 AI 只输出一个 JSON 对象，保存为独立文件后执行：

```bash
npm run import:preproduction-review -- path/to/review.json
```

导入器会检查：

- reviewerId 唯一；
- reviewerSystem（服务商 + 模型名）真实且非空；
- reviewedAt 合法；
- role 未被占用；
- digest 与当前被审快照一致；
- 九个维度齐全；
- 分数等于维度总和；
- evidence、gaps、action 不为空；
- hardVetoes 与 recommendation 结构合法。

导入器不会生成共识，也不会替用户批准。

全部角色完成后：

```bash
npm run refresh:preproduction-consensus
npm run gate:preproduction:review
```

若分差超过 8 分、任一 reviewer 低于 85、均分或中位数低于 90、关键维度未达线、存在 veto 或 recommendation 不是 pass，必须先仲裁或修改材料。修改任一候选文件后，旧 digest 和所有旧审查自动作废，必须重新生成 packet。

## 禁止事项

- 不把一个 AI 的答案复制给另一个 AI 要它“评价一下”。
- 不让多个审查者使用不同版本的材料。
- 不让 Agent 自动补齐分数到 90。
- 不因平均分达标忽略事实错误和证据缺失。
- 不在用户未明确批准时写入 `continue`。
