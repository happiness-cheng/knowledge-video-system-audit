# Prompt Completion Explainer 实战嵌入方案

**日期**: 2026-06-18
**目标视频**: "为什么你用 AI 总是不满意？因为你一开始就问错了"
**当前 videoSpec**: `src/video-system/data/videoSpec.json`
**当前主题**: xhs-white-editorial (白底杂志风)

---

## 1. 替换当前视频哪几个 scene？

**建议替换 S02 + S03 + S04，合并为一个 Visual Explanation Shot。**

当前 S02-S04 的内容：

| Scene | 类型 | 内容 | 问题 |
|-------|------|------|------|
| S02 | two-column | 错误现场：直接问的结果 | 静态卡片，没有变化过程 |
| S03 | process-steps | 同题实验：补背景、说目标、加限制 | 步骤列表，没有因果动画 |
| S04 | comparison | 结果真的变了：直接问 vs 补背景后 | 左右对比，没有因果连接 |

**合并理由**：
- S02-S04 讲的是同一个因果链："模糊问法 → 补充上下文 → 结果变好"
- 当前三个 scene 都是静态卡片/列表，没有视觉解释
- PromptCompletionExplainer 可以用一个 21s 的动画讲完这个因果链

**合并后的 scene**：
- 类型: `visual-explanation`（新类型）
- 时长: 21s (630 frames)
- 内容: 模糊问题 → 上下文飞入 → 路径校正 → 结构化回答

## 2. 保留哪些旧 scene？

| Scene | 类型 | 内容 | 是否保留 | 理由 |
|-------|------|------|----------|------|
| S01 | cover | Hook: "我一开始以为是 AI 不够聪明" | ✅ 保留 | Hook 需要单独建立情绪 |
| S02 | two-column | 错误现场 | ❌ 替换 | 合并到 Visual Explanation |
| S03 | process-steps | 同题实验 | ❌ 替换 | 合并到 Visual Explanation |
| S04 | comparison | 结果真的变了 | ❌ 替换 | 合并到 Visual Explanation |
| S05 | big-quote | "AI 没变，变的是你给的信息" | ✅ 保留 | 结论钉子页，需要独立呼吸空间 |
| S06 | three-column | 换场景也一样 | ✅ 保留 | 迁移场景，不是视觉解释 |
| S07 | todo-checklist | 下次这样问 | ✅ 保留 | 可复制模板，需要独立展示 |
| S08 | CTA | 行动号召 | ✅ 保留 | CTA 需要独立 |

**合并后 scene 列表**：
1. S01: Hook (cover)
2. S02: Visual Explanation (PromptCompletionExplainer)
3. S03: 结论钉子 (big-quote)
4. S04: 迁移场景 (three-column)
5. S05: 可复制模板 (todo-checklist)
6. S06: CTA

## 3. 这个 pattern 放进去后，口播怎么改？

**当前 S02-S04 的口播**：

> S02: "比如我直接问，帮我解释一下这个问题。它确实回答了，但答案很标准，我反而更懵。"
>
> S03: "后来我换了一个做法。同一个问题，我只改问法：先说明我完全不了解，再说希望用生活例子解释，最后加一句不要堆术语。"
>
> S04: "结果差别很明显。直接问的时候，它给的是标准答案；补背景后，它开始用生活例子解释，我一下就能跟上。"

**合并后的口播（21s）**：

> "比如我直接问：帮我解释一下这个问题。
> 它确实回答了，但答案很标准，我反而更懵。
>
> 后来我换了一个做法。
> 先说明我完全不了解——这是背景。
> 再说希望用生活例子解释——这是目标。
> 最后加一句不要堆术语——这是限制。
>
> 结果差别很明显。
> 直接问的时候，它走的是弯路，给的是标准答案。
> 补完上下文后，它方向对了，开始用生活例子解释，我一下就能跟上。"

**口播与画面同步点**：

| 口播内容 | 画面动作 | 时间点 |
|----------|----------|--------|
| "帮我解释一下这个问题" | 左侧模糊问题框弹入 | 0-3s |
| "它确实回答了，但答案很标准" | 右侧乱麻路径绘制 | 3-6s |
| "先说明我完全不了解" | 身份模块飞入，路径起点稳定 | 6-9s |
| "再说希望用生活例子解释" | 目标模块飞入，路径方向变明确 | 9-12s |
| "最后加一句不要堆术语" | 限制模块飞入，岔路消失 | 12-15s |
| "结果差别很明显" | 路径变直，结构化回答出现 | 15-18s |
| "它方向对了，我一下就能跟上" | 结论浮现 | 18-21s |

## 4. 字幕安全区怎么处理？

**当前字幕位置**：底部居中，约 900-1000px 区域。

**PromptCompletionExplainer 的布局**：
- 左侧: 80-680px (模糊问题框)
- 右侧: 80-680px (路径 + 结构化回答)
- 底部: 无重要元素

**字幕安全区处理**：
- ✅ 画面底部没有重要元素，字幕可以放在底部
- ✅ 左右两侧的内容都在 680px 以内，不会与字幕重叠
- ⚠️ 需要确认结论遮罩（Phase 5）是否会遮挡字幕

**建议**：
- 字幕保持底部居中位置
- Phase 5 结论遮罩的底部留白至少 150px，避免遮挡字幕
- 如果字幕遮挡，可以将结论文字上移

## 5. 手机端可读性怎么检查？

**检查方法**：

1. **渲染 1080p 画面**：在 Studio 中渲染关键帧
2. **缩放到 360px 宽**：模拟手机竖屏观看
3. **检查关键文字**：
   - L1 核心结论（"AI 没变，材料变完整了"）是否清晰可读？
   - L2 关键对象标签（"身份"、"目标"、"限制"、"输出"）是否可读？
   - L3 辅助说明（"用户提问"、"AI 输出"）是否可辨认？

**当前字号**：
- L1 结论: 44px → 缩放后约 14px ✅
- L2 标签: 14-22px → 缩放后约 5-7px ⚠️
- L3 辅助: 14-16px → 缩放后约 5px ⚠️

**潜在问题**：
- L2 标签字号可能偏小，缩放后可能不可读
- 碎片文字（"大概..."、"可能..."）可能太小

**建议**：
- 下一轮 craft pass 专门验证手机端可读性
- 可能需要放大 L2 标签字号到 18-24px

## 6. 是否需要改 videoSpec？

**需要改，但改动最小。**

**改动内容**：

1. **删除 S02、S03、S04**
2. **新增一个 scene**，类型为 `visual-explanation`
3. **重新编号 S05-S08 为 S03-S06**

**新增 scene 的 videoSpec 结构**：

```json
{
  "id": "S02",
  "beatId": "B02-B04",
  "beatRole": "conflict-case-thesis",
  "visualRole": "visual-explanation",
  "chapterId": "CH01-CH02",
  "humanPresence": "personal-experience",
  "caseStage": "original-change-result",
  "evidencePurpose": "用视觉动画展示模糊问法 → 补充上下文 → 结果变清晰的因果链",
  "type": "visual-explanation",
  "durationEstimate": 21,
  "screenText": "问法决定回答质量",
  "keywords": ["视觉解释"],
  "voiceover": "（见上方口播）",
  "spokenText": "（见上方口播）",
  "tts": {
    "voice": "zh-CN-YunxiNeural",
    "rate": "-5%"
  },
  "animation": "frame-driven",
  "visualExplanation": {
    "pattern": "prompt-completion-explainer",
    "vaguePrompt": "帮我解释一下这个问题",
    "contextModules": [
      { "label": "背景", "value": "完全不了解", "color": "#6366f1" },
      { "label": "目标", "value": "生活例子解释", "color": "#8b5cf6" },
      { "label": "限制", "value": "不要堆术语", "color": "#a78bfa" }
    ],
    "completedPrompt": "我完全不了解，希望用生活例子解释，不要堆术语",
    "structuredAnswerItems": [
      { "title": "背景解释", "icon": "📋" },
      { "title": "核心观点", "icon": "💡" },
      { "title": "生活例子", "icon": "🌰" }
    ],
    "finalConclusion": "AI 没变，材料变完整了",
    "subtitle": "问法决定回答质量"
  }
}
```

## 7. 是否可以继续保持实验区隔离？

**可以，但需要明确边界。**

**实验区隔离方式**：
- 组件仍在 `src/video-system/experiments/shot-lab/PromptCompletionExplainer.tsx`
- 不直接在 SceneRenderer 中注册
- 通过 videoSpec 的 `type: "visual-explanation"` 触发，由 SceneRenderer 特殊处理

**SceneRenderer 处理方式**：
```tsx
// SceneRenderer.tsx
case "visual-explanation":
  // 从 experiments/shot-lab 动态导入
  const { PromptCompletionExplainer } = await import(
    "../experiments/shot-lab/PromptCompletionExplainer"
  );
  return <PromptCompletionExplainer {...scene.visualExplanation} />;
```

**隔离边界**：
- ✅ 组件代码在实验区
- ✅ 不修改正式 scene 类型
- ✅ 通过 videoSpec 配置驱动
- ⚠️ SceneRenderer 需要新增 `visual-explanation` case

## 8. 最小实现路径是什么？

**Phase 1: 验证（已完成）**
- ✅ PromptCompletionExplainer 原型开发
- ✅ 用户 Studio 确认
- ✅ Confused Path 微调修正
- ✅ Visual Explanation Craft Rules v0

**Phase 2: 适配（下一步）**
- [ ] 适配 xhs-white-editorial 主题（白底杂志风）
- [ ] 验证手机端可读性
- [ ] 调整字号和布局

**Phase 3: 集成**
- [ ] 修改 videoSpec.json：删除 S02-S04，新增 visual-explanation scene
- [ ] 修改 SceneRenderer.tsx：新增 `visual-explanation` case
- [ ] 修改 Root.tsx：确保 Composition 注册正确

**Phase 4: 验证**
- [ ] Studio 预览完整视频
- [ ] 验证口播与画面同步
- [ ] 验证手机端可读性
- [ ] 验证字幕安全区

**Phase 5: 渲染**
- [ ] 渲染完整视频 MP4
- [ ] 渲染封面 PNG

---

## 总结

| 问题 | 答案 |
|------|------|
| 替换哪几个 scene？ | S02 + S03 + S04 合并为一个 Visual Explanation Shot |
| 保留哪些旧 scene？ | S01 Hook、S05 结论、S06 迁移、S07 模板、S08 CTA |
| 口播怎么改？ | 合并 S02-S04 口播，与画面动作同步 |
| 字幕安全区？ | 底部无重要元素，Phase 5 需留白 150px |
| 手机端可读性？ | L2 标签可能偏小，需下一轮 craft pass 验证 |
| 是否需要改 videoSpec？ | 需要，删除 S02-S04，新增 visual-explanation scene |
| 是否可以保持实验区隔离？ | 可以，组件在实验区，通过 videoSpec 配置驱动 |
| 最小实现路径？ | Phase 2 适配 → Phase 3 集成 → Phase 4 验证 → Phase 5 渲染 |
