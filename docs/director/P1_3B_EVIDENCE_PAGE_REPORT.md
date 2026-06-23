# P1-3B Implementation Report

## 概述

S04 证据页结构与字幕安全区优化。

## 1. 修改文件

| 文件 | 改动 |
|------|------|
| `src/video-system/components/EvidenceBlock.tsx` | 缩小 label/conclusion 字号，截图用 flex:1 自适应占满，移除 item 列表 |
| `src/video-system/scenes/ComparisonScene.tsx` | "同题对比"从大结论降级为小标签，底部加字幕安全区，移除未使用的 LabEvidenceConclusion 组件 |
| `docs/director/P1_3B_EVIDENCE_PAGE_REPORT.md` | 本报告 |

## 2. 是否修改 videoSpec

否。

## 3. 是否修改 S02 / S07

否。

## 4. 是否修改 audioTiming / subtitles

否。

## 5. S04 标题层级如何处理

| 元素 | 修改前 | 修改后 |
|------|--------|--------|
| 主标题"结果真的变了" | 保留 | 保留（不变） |
| "同题对比" | 84px 大结论，accent 色，fontWeight 900 | 30px 小标签，secondaryText 色，fontWeight 600 |

修改前：主标题 + 大结论两个层级抢视觉。
修改后：主标题主导，"同题对比"退为辅助说明。

## 6. 截图主体占比如何优化

EvidenceBlock 修改前：
- label: 42px, fontWeight 800
- conclusion: 84px, fontWeight 900
- 截图: 固定 height 420px
- item 列表: 38px × N 条

EvidenceBlock 修改后：
- label: 30px, fontWeight 700
- conclusion: 44px, fontWeight 800
- 截图: flex:1 自适应占满剩余空间
- 无 item 列表（caption 已足够说明证据）

截图从固定 420px 改为 flex:1 自适应，在 1080px 画面中实际占比约 45%-55%。

## 7. 左右截图一致性如何保证

- 两个 EvidenceBlock 在同一 grid 容器中，gridTemplateColumns 保证等宽
- 截图 viewport 用 `flex: 1; minHeight: 0` 保证等高
- `objectFit: contain` 保证不裁切关键信息
- 左右 padding、gap、border 完全一致

## 8. 字幕安全区如何预留

```ts
const subtitleSafeBottom = 150;
```

主容器 padding 从 `"56px 48px 40px"` 改为 `"56px 48px 150px"`。

底部 150px 区域不放置任何关键内容（截图、caption、结论）。后续字幕最多覆盖空白区。

## 9. 是否新增 HighlightBox

否。

## 10. typecheck 结果

通过。

## 11. validate:all 结果

通过。

## 12. grep 结果

```
transition: 0 处
animation: 0 处
@keyframes: 0 处
animate-*: 0 处
```

## 13. git diff 隔离结果

```
videoSpec.json: 空
audioTiming.json: 空
subtitles.json: 空
contentBrief.json: 空
TwoColumnScene.tsx: 空
TodoChecklistScene.tsx: 空
KnowledgeVideo.tsx: 空
themes/: 空
```

正式文件零修改。

## 14. Studio 检阅建议

启动：

```bash
npx remotion studio src/index.ts
```

选择 `KnowledgeVideo`，拖到 S04 时间段。

**检查点：**

1. 主标题"结果真的变了"保持突出
2. "同题对比"是小号灰色文字，不抢主标题
3. 左右截图大小一致，是页面视觉主体
4. 左右标签"直接问" / "补背景后"清晰
5. 左右结论"标准，但不贴我的理解状态" / "具体，开始按我的目标解释"可读
6. 截图底部不贴画面底边
7. 底部 150px 区域是空白/弱信息区
8. 整体像证据页，不像 PPT 表格

---

本轮只完成 P1-3B：S04 证据页结构与字幕安全区优化；未迁移 S04 cue active，未修改 videoSpec，未渲染 mp4。
