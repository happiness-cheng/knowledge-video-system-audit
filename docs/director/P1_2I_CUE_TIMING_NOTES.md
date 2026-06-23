# P1-2I Cue Timing Notes

## 1. 为什么不使用当前 audioTiming 作为主依据

当前 `audioTiming.json` 和 `subtitles.json` 是基于旧版 videoSpec 生成的 TTS 产物。新版 videoSpec 的 spokenText 已经改变（从"你有没有发现"实验过程版改回"我一开始以为"误判版），但 TTS 尚未重新生成。

如果用旧 audioTiming 的 scene duration 作为 cue 总帧数，会导致：

- 某些 scene 的 duration 与 videoSpec 的 durationEstimate 不一致
- 旧 spokenText 的语义分段与新 spokenText 不匹配
- cue 的 startFrameEstimate 在 TTS 重新生成后全部失效

因此，draft 阶段使用 `videoSpec.durationEstimate * fps` 作为 totalFrames，语义分段基于 videoSpec 的 spokenText。

## 2. 为什么用 videoSpec.durationEstimate 做 draft

`durationEstimate` 是 ChatGPT 在生成 videoSpec 时对每 scene 口播时长的估算。虽然不如真实 TTS 精确，但：

- 它与 spokenText 语义一致（同一份数据）
- 它是当前唯一可用的 scene 时长参考
- 偏差通常在 ±1-2 秒内，对 draft 阶段的 cue 估算足够

等 TTS 重新生成后，audioTiming.json 的 `duration` 会替换 `durationEstimate`，cue 的 `startFrameEstimate` 和 `holdFrames` 也会根据 subtitles.json 的句子时间戳修正。

## 3. 为什么画面要领先口播 6-12 帧

人类注意力需要准备时间。如果画面和口播同时切换，观众来不及把眼睛移到新的视觉中心，就会错过口播对应的画面。

| 领先量           | 效果                                                        |
| ---------------- | ----------------------------------------------------------- |
| 0 帧（同步）     | 观众听到新内容时画面还在旧的，需要额外 0.2-0.3 秒转移注意力 |
| 6 帧（0.2 秒）   | 最小提前量，适合快节奏场景                                  |
| 10 帧（0.33 秒） | 推荐值，给观众足够的视觉准备时间                            |
| 18 帧（0.6 秒）  | 太提前，观众已经看到新画面但口播还在旧内容                  |

本 draft 使用 `leadFrames: 10`（0.33 秒 @ 30fps）。

## 4. 为什么 S07 使用 progressive-retain，而不是 strict switch

S07 有 5 个 cue（标题 + 4 项），总时长 13 秒。每项口播约 2-2.5 秒。

如果使用 strict switch（说完 A 切到 B，A 降到 0.4）：

- 每项只亮 2 秒就切走，观众还没看清就变暗
- 4 项快速闪烁，像自动轮播
- 最终画面没有"可截图保存"的稳定感

progressive-retain 模式：

- 当前被说到的 item 最亮（1.0）
- 已经说过的 item 保留较高可见性（0.8 → 0.7 → 0.65）
- 未说到的 item 较弱（0.4）
- 最后阶段四项全部稳定在 0.85-1.0，形成可截图模板

这样既有"说到哪亮到哪"的节奏感，又有"最终稳定"的截图保存价值。

## 5. 为什么 S06 第三栏是视觉收束 cue

S06 的 spokenText 只有 2 个语义段："写文章"和"学新概念"。但 scene 有 3 栏，第三栏是"共同规律"。

问题：口播没有明确说出"共同规律"四个字。如果第三栏按前两栏同样的逻辑出现，会显得与口播脱节。

解决方案：第三栏作为"视觉收束 cue"：

- 在口播接近结束时（最后 1.5 秒）出现
- 不是口播同步，而是视觉 recap
- 标记为 `support: "draft-director"`，表示这是导演设计而非口播同步

后续考虑：

- 如果 ChatGPT 确认需要，可以补一句口播（如"这就是共同规律"）
- 如果 renderer 不支持尾段收束，可以退化为三栏 progressiveReveal 结束后全部 1.0

## 6. 下一步 renderer 消费 cue 的边界

### 建议新增文件

- `src/video-system/utils/directorCue.ts` — `resolveActiveTarget()` 函数

### 建议修改文件

- `src/video-system/scenes/TwoColumnScene.tsx` — S02 用 cue 驱动 active
- `src/video-system/scenes/ComparisonScene.tsx` — S04 用 cue 驱动 active
- `src/video-system/scenes/ThreeColumnScene.tsx` — S06 用 cue 驱动 active
- `src/video-system/scenes/TodoChecklistScene.tsx` — S07 用 cue 驱动 active

### 不改的文件

- `videoSpec.json` — cue 数据在独立文件中
- `videoSpec schema` — 不新增字段
- `audioTiming.json` — TTS 重新生成时才更新
- `subtitles.json` — TTS 重新生成时才更新
- `themes/**` — 不改主题
- `KnowledgeVideo.tsx` — 不改 composition

### resolveActiveTarget 逻辑

```typescript
function resolveActiveTarget(
  frame: number,
  cues: DirectorCue[],
  leadFrames: number,
  decayFrames: number,
): {
  activeTarget: string;
  targetOpacity: (target: string) => number;
};
```

1. 找到 `startFrameEstimate - leadFrames <= frame` 的最后一个 cue
2. 该 cue 的 `target` 为当前 active
3. 其他 target 的 opacity 按距离衰减（距离 1 → 0.65，距离 ≥2 → 0.4）
4. 切换时用 `interpolate(frame, [switchFrame, switchFrame + decayFrames], [1.0, 0.65])` 做平滑过渡

### S07 特殊处理

S07 使用 `highlightMode: "progressive-retain"`，resolveActiveTarget 需要额外逻辑：

- 已激活过的 target 保持较高 opacity（不完全降到 0.4）
- 最终阶段所有 target 稳定在 0.85-1.0

## 7. Audio-aligned 阶段如何在 TTS / subtitles 更新后修正 cue

### 触发条件

用户确认 Studio 预览方向正确后。

### 步骤

1. 运行 `npx tsx src/video-system/scripts/generate-audio.ts` — 基于 videoSpec spokenText 生成新音频
2. 运行 `npx tsx src/video-system/scripts/generate-subtitles.ts` — 生成新字幕
3. 对比 subtitles.json 的实际句子时间戳与 draft 估算值
4. 更新 `startFrameEstimate`：从 subtitles.json 的 `start` 换算为 scene 内相对帧
5. 更新 `holdFrames`：从 subtitles.json 的 `end - start` 换算
6. 更新 `support`：从 `"draft-estimate"` 改为 `"audio-aligned"`
7. Studio 再次预览

### 数据变化

| 字段                 | Draft              | Audio-aligned                         |
| -------------------- | ------------------ | ------------------------------------- |
| `startFrameEstimate` | 手工按语义比例估算 | 从 subtitles.json 的 start 换算       |
| `holdFrames`         | 按段数均匀分配     | 从 subtitles.json 的 end - start 换算 |
| `support`            | `"draft-estimate"` | `"audio-aligned"`                     |

## 8. 如何回滚

### 文件级回滚

- 删除 `docs/director/P1_2I_DIRECTOR_CUES_DRAFT.json` — 回到无 cue 状态
- 删除 `docs/director/P1_2I_CUE_TIMING_NOTES.md` — 回到无 notes 状态

### Renderer 级回滚（实现后）

- scene 组件中设置 `const USE_DIRECTOR_CUES = false` — 退回 progressiveReveal 逻辑
- 删除 `src/video-system/utils/directorCue.ts` — 移除 cue 解析逻辑
- scene 组件 diff revert — 恢复原始入场逻辑

### 不可回滚项

- 无。本轮不改代码，不改数据文件，不改 schema。
