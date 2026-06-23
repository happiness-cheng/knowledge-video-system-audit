# Ultimate Motion System Lab — V2

## 定位

工程级 Remotion 视觉系统实验室。不是 8 scene demo，而是一套完整的可复用组件库、镜头语法、动效系统、资产库和 QA 体系。

## 与 V1 的关系

| 维度 | V1 (ExperimentVersionVideo) | V2 (UltimateMotionSystemLab) |
|------|---------------------------|------------------------------|
| 目标 | 最小可行性验证 | 工程级系统实验室 |
| 组件 | 7 个基础组件 | 15+ 个可复用组件 |
| Primitives | 无独立 primitive | 16 个 motion primitive |
| Shot Grammar | 5 种 | 10+ 种 |
| Gallery | 无 | 6+ 个 gallery |
| Evidence | 1 种文字版 | 4+ 种变体 |
| Template | 1 种 | 3+ 种变体 |
| Title | 1 种 | 4+ 种变体 |
| Background | 1 种深色 | 3+ 种变体 |
| Transition | fade only | 4+ 种 |
| QA | 无 | Mobile Readability Gallery |

## 启动方式

```bash
npx remotion studio src/index.ts
```

选择 `UltimateMotionSystemLab` Composition。

## Composition 结构

### Part A: 成片实验（8 scenes）

使用 AI 提问主题，8 个高质量 scene：

1. Hook Shot — 痛点开场
2. Mistake Shot — 错误现场
3. Experiment Setup Shot — 变量改变
4. Evidence Shot — 证据对比
5. Insight Shot — 结论聚焦
6. Transfer Shot — 迁移证明
7. Template Shot — 可截图模板
8. CTA Shot — 行动号召

### Part B: 系统资产展示（7+ gallery scenes）

9. Component Gallery — 组件库展示
10. Motion Primitive Gallery — 动效原语展示
11. Evidence Variants Gallery — 证据页变体
12. Template Variants Gallery — 模板页变体
13. Title Variants Gallery — 标题变体
14. Transition Gallery — 转场展示
15. Mobile Readability Gallery — 手机端可读性

## 文件结构

```
ultimate-motion-system/
├── UltimateMotionSystemLab.tsx     # 主 Composition
├── UltimateSceneRenderer.tsx       # 场景分发器
├── labContent.ts                   # 内容数据
├── labDirectorSpec.ts              # 导演规格
├── labDirectorCues.ts              # cue 数据
├── labShotGrammar.ts               # 镜头语法
├── labMotionPrimitives.ts          # 动效原语注册
├── labRegistry.ts                  # 组件/shot 注册表
├── tokens/                         # 设计 token
├── utils/                          # 工具函数
├── primitives/                     # Motion 原语组件
├── components/                     # 高级组件
├── shots/                          # 镜头组件
├── galleries/                      # Gallery 展示
└── docs/                           # 文档
```

## 隔离保证

- 仅修改 `src/Root.tsx`（新增一行 Composition 注册）
- 不修改任何正式 data / scene / component / theme 文件
- 不渲染 mp4
- 不生成 TTS / 字幕 / 封面
