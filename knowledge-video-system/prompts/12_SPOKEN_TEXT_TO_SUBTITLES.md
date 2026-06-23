# 12 — spokenText → subtitles.json

## 目标

规范如何从 `videoSpec.scenes[].spokenText` 和 `audioTiming.json` 生成口播同步字幕。

项目已经存在：

- `src/video-system/scripts/generate-subtitles.ts`
- `src/video-system/components/SubtitleOverlay.tsx`
- `KnowledgeVideoWithSubtitles` Composition

沿用这些能力，不新增 `SubtitleLayer`，不创造新的字幕渲染组件。

## 输入

1. `videoSpec.json`：读取每个 scene 的 `spokenText`。
2. `audioTiming.json`：读取每个 scene 的 `start`、`end` 和 `duration`。

## 输出

当前脚本和 Composition 直接读取顶层数组，因此 `subtitles.json` 必须保持：

```json
[
  {
    "sceneId": "S01",
    "start": 0,
    "end": 2.4,
    "text": "你有没有发现"
  }
]
```

不要擅自改成 `{ "items": [...] }`，除非同步修改并验证生成脚本和字幕 Composition。

## 文本规则

- 字幕文本必须忠于 `spokenText`。
- 口播说什么，字幕显示什么。
- 可以按句号、问号、感叹号、逗号和自然停顿断句。
- 不能改写、总结或补充原文。
- 优先使用 `spokenText`；仅当它为空时，现有脚本才允许 fallback 到 `voiceover`。
- 每条字幕应保持手机端可读，避免一个字幕块承载过长句子。
- 每屏最多两行。
- 字幕不得遮挡主体画面、关键数据和重要截图。

## 时间规则

- 每个字幕项必须落在对应 scene 的音频时间范围内。
- `start < end`。
- 同一 scene 内字幕按时间递增，不得重叠。
- 字幕时间由 `audioTiming.json` 决定，不使用 `durationEstimate` 代替真实音频时序。
- 当前生成脚本按字符数比例分配 scene 内时间；最终审片仍需检查字幕与实际发音是否同步。

## 执行

```bash
npx tsx src/video-system/scripts/generate-subtitles.ts
```

输出：

```text
src/video-system/data/subtitles.json
```

## 验收

- [ ] 每个有 spokenText 和音频时序的 scene 都有字幕
- [ ] 字幕内容没有改写 spokenText
- [ ] sceneId 存在于 videoSpec
- [ ] start/end 合法且按时间递增
- [ ] 最终成片每屏最多两行
- [ ] 字幕没有遮挡主体
- [ ] `KnowledgeVideoWithSubtitles` 可以正常加载

字幕完整属于发布硬门槛，但字幕文件存在不等于视觉验收通过；必须在最终审片中确认同步、断句、行数和遮挡。
