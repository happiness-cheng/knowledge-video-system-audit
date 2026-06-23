# Motion Primitives — V2

## 16 种动效原语

| # | 名称 | 用途 | 参数 | 默认值 | 禁用场景 | 迁移性 |
|---|------|------|------|--------|---------|--------|
| 1 | springEnter | 弹性入场 | frame, fps, delay, config | delay=0, translateY=30 | 连续快速切换 | direct |
| 2 | fadeSlide | 淡入+滑入 | frame, fps, delay, duration, translateY | delay=0, duration=15 | 需要弹性感 | direct |
| 3 | staggerReveal | 逐个出现 | frame, fps, index, delayPerItem, duration | delayPerItem=15 | 需要同时出现 | direct |
| 4 | cueActive | cue 驱动 active | frame, cues, leadFrames, decayFrames | lead=10, decay=15 | 无时序关系 | direct |
| 5 | progressiveRetain | 逐步激活保持 | frame, cues, leadFrames | lead=10 | 需要严格切换 | direct |
| 6 | breathe | 极轻微呼吸 | frame, speed, min, max | speed=0.04 | 文字密集区域 | direct |
| 7 | pulse | 脉冲缩放 | frame, speed, min, max | speed=0.05 | 大面积背景 | direct |
| 8 | focusGlow | 聚焦发光 | frame, color, speed | speed=0.03 | 无 active 状态 | minor-edit |
| 9 | cardLift | 卡片抬起 | activeOpacity, base, active | base=0.98, active=1.01 | 不需强调 | direct |
| 10 | evidenceFocus | 证据聚焦 | activeOpacity, borderColor | — | 非证据内容 | minor-edit |
| 11 | textEmphasis | 文字强调 | text, keywords, gradient | — | 短文本 | minor-edit |
| 12 | backgroundDrift | 背景漂移 | frame, duration, speed | speed=0.02 | 浅色简约 | minor-edit |
| 13 | semanticHighlight | 语义块高亮 | text, keywords, color | — | 截图标注 | direct |
| 14 | transitionFade | fade 转场 | durationFrames | duration=12 | 快节奏切换 | direct |
| 15 | transitionSlide | slide 转场 | durationFrames, direction | duration=15 | 同方向连续 | minor-edit |
| 16 | transitionWipe | wipe 转场 | durationFrames, direction | duration=15 | 频繁使用 | reference-only |
