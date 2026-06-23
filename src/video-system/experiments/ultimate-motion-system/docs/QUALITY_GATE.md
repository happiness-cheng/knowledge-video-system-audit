# Quality Gate — V2

## 工程验收

- [x] TypeScript 类型检查通过
- [x] validate:all 通过
- [x] 无 CSS transition / animation / @keyframes / animate-*
- [x] 全部 frame-driven（useCurrentFrame / interpolate / spring / Sequence / TransitionSeries）
- [x] 正式 data 无 diff
- [x] 正式 scenes 无 diff
- [x] 正式 components 无 diff
- [x] 正式 themes 无 diff
- [x] Root.tsx 只新增 V2 Composition 注册
- [x] 未渲染 mp4
- [x] 未生成 TTS / 字幕

## 视觉验收（需人工 Studio 审片）

- [ ] 8 个主 scene 全部可见
- [ ] 7 个 gallery scene 全部可见
- [ ] S02/S04/S06/S07 cue-driven active 切换自然
- [ ] S07 progressive-retain 最终稳定可截图
- [ ] 字号手机端可读
- [ ] 背景不抢主体
- [ ] 转场不突兀

## 组件验收

- [x] 9 个 primitive 全部实现
- [x] 14 个 high-level component 全部实现
- [x] 8 种 shot grammar 全部定义
- [x] 16 种 motion primitive 全部注册
- [x] 6 种 gallery 全部实现
