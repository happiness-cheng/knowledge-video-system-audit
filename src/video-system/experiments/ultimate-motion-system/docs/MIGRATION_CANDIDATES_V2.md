# Migration Candidates V2

## 可直接迁回实践版

1. **resolveActiveTarget()** — 核心 cue 解析逻辑
2. **Director Cue 数据结构** — LabCue / LabSceneCueData interface
3. **fadeSlide / springEnter / staggerReveal** — 基础动效原语
4. **cardLift / highlightOpacity** — active 状态工具
5. **breathe / pulse** — 轻微动效
6. **semanticHighlight** — 语义块高亮
7. **transitionFade** — fade 转场

## 小改后迁回实践版

8. **CueActiveCard** — 需接入正式 theme token
9. **TemplatePanel** — 需接入正式 todo-checklist 数据
10. **InsightPanel** — 需接入正式 big-quote 数据
11. **EvidencePanel** — 需处理 assetLayout 截图模式
12. **KineticTitleSystem** — 需接入正式 theme
13. **PromptBuildCard** — 需接入正式 process-steps 数据

## 只作为参考

14. **BackgroundSystem** — 深色/蓝图风格与实践版差异大
15. **TimelineCueBar** — 开发调试工具，非发布组件
16. **FocusRing** — 视觉效果参考

## 不建议迁回

17. **ShotType 命名体系** — 与实践版 type + visualRole 冲突
18. **labContent.ts 硬编码数据** — 正式数据走 videoSpec 流程
