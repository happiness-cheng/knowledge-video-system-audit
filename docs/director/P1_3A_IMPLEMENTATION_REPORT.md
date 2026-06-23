# P1-3A-S07-final Implementation Report

## 概述

S07 模板页取消单项高亮，改为完整模板整体显示并稳定可截图。

## 1. 修改文件

| 文件 | 改动 |
|------|------|
| `src/video-system/scenes/TodoChecklistScene.tsx` | isLabTemplate 分支重写：移除 cue-driven 逐项逻辑，改为模板卡整体进入 |

## 2. S07 是否取消了单项高亮

是。isLabTemplate 分支不再对任何 item 做 active/inactive 区分。

## 3. S07 是否改为四项同时显示

是。模板卡整体 `fadeSlideIn` 进入（delay 8 帧），卡内四项全部同时显示。

## 4. S07 四项是否等权

是。四项均为：
- 编号 badge：实心 accent 色背景 + 白字
- 文字：48px，fontWeight 700，primaryText 色
- 无 opacity 差异
- 无 translateX 差异
- 无边框/背景差异
- 无色条、无 chip、无 bgTint

## 5. 是否仍然消费 cue active state

isLabTemplate 分支不再消费 cue。`cueState` 仅在 default（非 lab）分支中使用。

## 6. 是否修改了 videoSpec

否。

## 7. typecheck 结果

通过。

## 8. validate:all 结果

通过。

## 9. 是否保留了 debug 样式

否。无 DEBUG overlay、无黄底红框、无 grayscale。

## 10. grep 结果

| 模式 | 结果 |
|------|------|
| DEBUG CUE ON | 0 处 |
| activeTarget（isLabTemplate 分支） | 0 处 |
| progressive-retain（isLabTemplate 分支） | 0 处 |
| transition:（正式渲染代码） | 0 处 |
| @keyframes（正式渲染代码） | 0 处 |
| animation:（正式渲染代码） | 0 处 |

注：`activeTarget` 和 `progressive-retain` 仅存在于 default（非 lab）分支，符合预期。

## 11. git diff 隔离结果

```
videoSpec.json: 空
audioTiming.json: 空
subtitles.json: 空
KnowledgeVideo.tsx: 空
themes/: 空
```

正式文件零修改。

## 12. Studio 检阅建议

启动：

```bash
npx remotion studio src/index.ts
```

选择 `KnowledgeVideo`，拖到 S07 时间段。

**检查点：**
1. 标题"下次这样问"正常淡入
2. 模板卡整体淡入 + 轻微上移进入
3. 四项全部同时显示，视觉权重相同
4. 进入后立即稳定，无持续动画
5. 适合截图保存

---

本轮仅收束 S07 模板页：取消单项高亮，改为完整模板整体显示并稳定可截图；S02 cue spotlight 保持不动，S04 证据页未处理。
