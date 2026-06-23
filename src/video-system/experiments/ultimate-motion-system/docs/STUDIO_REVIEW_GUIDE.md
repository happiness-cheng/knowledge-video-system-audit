# Studio Review Guide — V2

## 启动

```bash
npx remotion studio src/index.ts
```

选择 `UltimateMotionSystemLab` Composition。

## Part A: 成片实验（S01-S08）

| Scene | Shot Type | 检查项 |
|-------|-----------|--------|
| S01 | Hook Shot | 标题分层入场，不空白 |
| S02 | Mistake Shot | 左→右 cue 切换自然 |
| S03 | Setup Shot | 步骤逐步出现，当前高亮 |
| S04 | Evidence Shot | 左→右→结论 cue 切换 |
| S05 | Insight Shot | 结论聚焦，breathing |
| S06 | Transfer Shot | 三栏依次 active |
| S07 | Template Shot | progressive-retain，最终稳定 |
| S08 | CTA Shot | 按钮 pulse |

## Part B: Gallery 展示（G01-G07）

| Gallery | 检查项 |
|---------|--------|
| G01 Component | 6 种 primitive 组件可见 |
| G02 Motion | 7+ 种动效原语有数值展示 |
| G03 Evidence | 4 种证据变体可见 |
| G04 Template | 3 种模板变体可见 |
| G05 Title | 4 种标题变体可见 |
| G06 Transition | 4 种转场有模拟动画 |
| G07 Mobile | 字号投影对比可见 |

## 全局检查

- [ ] 全部 frame-driven
- [ ] 无 CSS animation
- [ ] 背景不抢主体
- [ ] 字号足够大
- [ ] 转场不突兀
