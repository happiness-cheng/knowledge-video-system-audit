# Pattern: Prompt Completion Explainer

**类型**: Visual Explanation Shot Pattern
**状态**: Confused Path (2026-06-18)
**原型位置**: `src/video-system/experiments/shot-lab/PromptCompletionExplainer.tsx`
**Studio ID**: `PromptCompletionExplainer`

---

## 核心隐喻：乱麻路径 → 引导路径 → 清晰结构

这个 pattern 的核心视觉隐喻是**路径**：
- **乱麻路径**：AI 在信息不足时走弯路、绕圈子、输出泛泛回答
- **引导路径**：每补充一个上下文模块，路径被校正一次
- **清晰路径**：路径变直，结构化回答从路径终点生长出来

## 适用场景

模糊输入 → 补充上下文 → 输出变清晰的因果链条。具体包括：

- AI 提问质量影响输出质量
- Prompt 工程从模糊到具体的优化过程
- 信息不完整导致结果不可用的场景
- 任何"输入补齐 → 输出改善"的解释性内容

## 不适用场景

- 纯数据对比（用 comparison 场景）
- 步骤流程展示（用 process-steps 场景）
- 结论已知、只需陈述（用 bullets 场景）
- 需要代码/终端演示的内容

## 核心视觉对象

| 对象 | 视觉隐喻 | 作用 |
|------|----------|------|
| VagueQuestionBox | 虚线边框 + 微抖 | 不完整的输入，暗示缺失 |
| ConfusedPath | 弯曲路径 + 岔路 + 碎片文字 | AI 走弯路，输出混乱 |
| GuidedPath | 路径逐渐变直 + 岔路消失 | 上下文校正 AI 方向 |
| ContextModule x4 | 彩色标签从左下飞入 | 上下文在补齐 |
| CompletedQuestionBox | 实线边框 + 闪光 | 完整输入，拼图到位 |
| StructuredAnswer | 从路径终点生长出来 | 完整输入 = 结构化输出 |
| ConclusionOverlay | 因果箭头 + 结论文字 | 画面内自然浮现的结论 |

## 参数化接口

```typescript
export interface PromptCompletionExplainerProps {
  vaguePrompt: string;                    // 模糊提问内容
  contextModules: {                       // 上下文模块列表
    label: string;
    value: string;
    color: string;
  }[];
  completedPrompt: string;                // 补齐后的完整提问
  structuredAnswerItems: {                // 结构化回答列表
    title: string;
    icon: string;
  }[];
  finalConclusion: string;                // 主结论文字
  subtitle: string;                       // 副标题
}
```

## 初始状态

画面分为左右两个区域：

- **左侧 (80px, 200px)**: 虚线边框的模糊提问框，内容由 `vaguePrompt` 控制
- **右侧 (80px, 100px)**: 乱麻路径区域
  - 一条弯曲的 SVG 路径，从左下到右上
  - 路径上有 2 条岔路（红色虚线）
  - 路径周围有 4 个碎片文字（"大概..."、"可能..."、"一般来说"、"某种程度"）
  - 终点是一个模糊的"泛泛回答"块
- **背景**: 暗色极光 + 微妙网格漂移

## 状态变化

```
Phase 1 (0-90帧/3s): 乱麻路径建立
  - 左侧虚线提问框 spring 弹入
  - 右侧乱麻路径逐渐绘制（0-60帧）
  - 碎片文字逐渐出现
  - 建立"模糊输入 → 混乱输出"的因果关系

Phase 2 (90-270帧/6s): 路径校正
  - 四个彩色标签依次从左下角飞入
  - 每个标签到达后，右侧路径被校正：
    - 身份：路径起点稳定
    - 目标：路径方向变明确（减少弯曲）
    - 限制：多余岔路减少（删除分叉）
    - 输出：终点结构化
  - 路径颜色从灰色变为紫色
  - 岔路逐渐消失（opacity 降低）

Phase 3 (270-390帧/4s): 拼图补齐 + 路径完成
  - 左侧虚线变实线，边框渐变
  - 右侧路径完全变直
  - 结构化回答开始从路径终点生长

Phase 4 (390-540帧/5s): 结构化回答揭示
  - 清晰路径保持显示
  - 四段结构化回答逐条滑入
  - 结构从路径中"生长"出来

Phase 5 (540-630帧/3s): 结论从画面自然浮现
  - 左侧完整 prompt 稳定发光
  - 右侧清晰路径 + 结构化回答稳定
  - 中间出现因果关系箭头：提问质量 → 输出质量
  - 主结论 spring 放大出现
```

## 运动设计

| 运动类型 | 实现方式 | 用途 |
|----------|----------|------|
| 路径绘制 | `strokeDasharray` + `strokeDashoffset` | 乱麻路径出现 |
| 路径校正 | 控制点线性插值 | 弯曲路径变直 |
| 岔路消失 | `opacity` 降低 | 多余方向减少 |
| 碎片文字 | `spring()` + 旋转 | 混乱感 |
| 结构生长 | 从路径终点 `spring()` 滑入 | 结果从路径中长出 |
| 发光 | `boxShadow` + 校正进度 | 到达反馈 |

## 观众理解目标

1. **混乱感**: AI 不是没输出，而是走弯路、输出一团乱（Phase 1）
2. **校正过程**: 每补充一个上下文，路径被校正一次（Phase 2）
3. **因果验证**: 完整输入 → 清晰路径 → 结构化输出（Phase 3-4）
4. **核心结论**: 材料比 AI 更重要（Phase 5 从画面内自然浮现）

## 最后一帧结论

```
左侧: 完整提问框，稳定发光（紫色边框 + box-shadow）
右侧: 清晰路径 + 结构化回答列表
中间: 因果箭头 "提问质量 → 输出质量"
主文字: "AI 没变，材料变完整了"（spring 放大）
副标题: "提问质量 → 输出质量"（渐入）
背景: 半透明黑色遮罩（65% opacity）+ 暗色极光
```

## Remotion 实现方式

- **Composition**: `PromptCompletionExplainer` (630 frames / 21s / 30fps)
- **Props**: `Partial<PromptCompletionExplainerProps>`，支持自定义所有文字内容
- **子组件**: 8 个内联子组件（Background, VagueQuestionBox, ConfusedPath, GuidedPath, ContextModule, CompletedQuestionBox, StructuredAnswer, ConclusionOverlay）
- **路径动画**: SVG `strokeDasharray/offset` + 控制点插值
- **动画**: 全程 frame-driven，零 CSS transition/animation

## 已解决的限制

1. ✅ **内容参数化**: 所有文字内容改为 props 输入
2. ✅ **Phase 标签移除**: 左上角阶段提示已移除，由画面动作自然切换
3. ✅ **结论页优化**: 不再使用全屏大字，改为画面内因果箭头 + 结论浮现
4. ✅ **右侧初始状态**: 从"看不见的灰雾"改为"可见但混乱的乱麻路径"
5. ✅ **路径校正**: 每个上下文模块飞入时，路径被校正一次
6. ✅ **结构生长**: 结构化回答从路径终点生长出来，而非突然出现

## 当前限制

1. **视觉风格单一**: 暗色极光风，其他主题未适配
2. **内联样式**: 子组件样式过多，正式化需提取 design tokens
3. **坐标硬编码**: ContextModule 飞入目标坐标写死，不同内容长度需要自适应
4. **路径固定**: 乱麻路径的控制点是固定的，不同场景可能需要不同路径

## Migration Candidate 评估

**结论: Level 2 组合能力候选，接近 Level 3。**

理由：
- 核心 pattern（乱麻路径 → 引导路径 → 清晰结构）已参数化
- 路径校正动画与上下文飞入联动
- 仍需主题适配和坐标自适应才能正式迁移

## 进入实践版前的 QA

- [x] 参数化：所有文字内容改为 props 输入
- [ ] 主题适配：至少支持 3 个主题（暗色极光、白底杂志、小红书粉彩）
- [x] 移除 PhaseLabel，用画面过渡自然切换阶段
- [x] 结论页重新设计：因果箭头 + 画面内浮现
- [x] 右侧初始状态：乱麻路径（可见但混乱）
- [x] 路径校正：上下文飞入时路径逐渐变直
- [x] 结构生长：结构化回答从路径终点生长
- [ ] 性能测试：SVG 路径动画在低端设备的表现
- [ ] 声画同步：接入 TTS 验证节奏匹配
- [ ] 坐标自适应：不同内容长度的飞入目标
