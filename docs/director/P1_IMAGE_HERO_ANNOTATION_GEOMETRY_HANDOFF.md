# P1 Image Hero 标注几何修复交付文档

> 给新 Codex 窗口使用。请先阅读本文件，再按项目根目录 `AGENTS.md` 执行。
> 本任务只修 `image-hero` 的标注几何问题，不继续扩展新 scene type，不渲染 mp4。

## 1. 当前任务一句话

修复 `image-hero` 内部标注层的几何逻辑：框选必须贴合关键对象，箭头必须从解释标签指向目标框边缘，而不是粗略框大块区域、中心对中心连线。

这一步服务于整个系统的能力升级：让截图、生成图、复杂隐喻图能做到“说到哪里，画面哪里被框出、指向、放大”。

## 2. 用户明确反馈

用户认可：

- “局部放大”效果很好。

用户指出的问题：

- “框出关键信息”有问题。
- 预览图里关键对象是 `手册=知识入口`，但当前框只框到了 `手册=知识`。
- 框选区域包含很多多余部分。
- 正确逻辑应是：先确定关键信息的位置和大小，再画框；框只比关键信息大一点。
- 从关键信息到解释的箭头起始/终止点不明确。
- 箭头应该从框的边缘处连接，而不是中心点随便连。

结论：这是对的，不是审美偏好，而是标注组件的几何规则不严谨。

## 3. 当前已实现能力状态

`image-hero` 已经是正式 scene type，支持：

- 一张主图。
- 最多 3 条解释 points。
- 最多 3 个受控 annotations。
- annotation kind:
  - `box`
  - `arrow`
  - `magnify`
- annotation 字段：
  - `label`
  - `x`
  - `y`
  - `width`
  - `height`
  - `labelX`
  - `labelY`
  - `zoom`
  - `tone`

当前预览 still：

`<PROJECT_ROOT>\out\keyframes\component-upgrade\P1-image-hero-annotations-fixture.png`

当前示例组件：

`<PROJECT_ROOT>\src\video-system\compositions\ImageHeroSceneFixture.tsx`

当前标注组件：

`<PROJECT_ROOT>\src\video-system\components\visual\VisualAnnotations.tsx`

## 4. 当前根因判断

### 根因 A：框选数据不是“目标对象边界”

当前 fixture 里的 `手册=知识入口` annotation 大致是：

```ts
{
  kind: "box",
  label: "手册=知识入口",
  x: 39,
  y: 56,
  width: 20,
  height: 23,
  labelX: 67,
  labelY: 47,
  tone: "success",
}
```

它的问题是：这个框像是在框“整本手册区域”，不是精确框 `手册=知识入口` 这个被解释对象。因此用户看到“手册=知识入口”标签时，会期待框正好落在相关对象上，但实际框住了不够精确的画面块。

修复方式：先在 still 上目测定位目标对象真实边界，把框缩小到只比目标对象大一点。

### 根因 B：箭头连接点算法不对

当前 `VisualAnnotations.tsx` 的线条逻辑是：

```tsx
<line
  x1={label.x}
  y1={label.y}
  x2={center.x}
  y2={center.y}
/>
```

也就是：

- 从解释 label 的中心出发。
- 连到目标框的中心。

这个不符合视觉标注习惯。专业标注应该是：

- 线条从解释标签靠近目标的一侧边缘出发。
- 线条落在目标框靠近解释标签的一侧边缘。
- 不要扎进目标框中心。

修复方式：新增“边缘连接点”计算，而不是中心对中心。

### 根因 C：坐标系需要明确

当前注释写的是：

```ts
// 坐标均为相对于图片面板的百分比
```

但 `<Img objectFit="contain">` 会导致真实图片内容在面板中留白。也就是说，标注坐标是“面板坐标”，不是“真实图片像素坐标”。

本次不要做复杂的自动测量 / OCR / 图片天然尺寸换算。原因：

- 当前目标是修几何逻辑，不是做完整标注编辑器。
- 项目边界明确说 `image-hero` 不是任意标注编辑器。
- 自动测量 object-fit 后的 rendered image rect 可以以后再做，但这次先不扩大范围。

本次只需要：

- 在文档/注释里继续明确坐标是“图片面板百分比”。
- fixture 坐标按当前 still 调准。
- 箭头边缘连接算法修好。

## 5. 必须修改的文件

### 5.1 标注组件

文件：

`<PROJECT_ROOT>\src\video-system\components\visual\VisualAnnotations.tsx`

要做：

1. 保留 `annotationCenter`，但不要再直接用它作为箭头终点。
2. 新增 rectangle 类型和边缘点计算。
3. 箭头和 magnify 的连接线改为：
   - label edge -> target rect edge。
4. `box` 只显示框和 label，不需要线。
5. 不引入 CSS animation / transition。

建议实现思路：

```ts
interface RectPercent {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PointPercent {
  x: number;
  y: number;
}

const rectCenter = (rect: RectPercent): PointPercent => ({
  x: rect.x + rect.width / 2,
  y: rect.y + rect.height / 2,
});
```

目标框边缘点：

```ts
const targetEdgePoint = (
  rect: RectPercent,
  from: PointPercent,
): PointPercent => {
  const center = rectCenter(rect);
  const dx = from.x - center.x;
  const dy = from.y - center.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    return {
      x: dx > 0 ? rect.x + rect.width : rect.x,
      y: clampPercent(from.y),
    };
  }

  return {
    x: clampPercent(from.x),
    y: dy > 0 ? rect.y + rect.height : rect.y,
  };
};
```

注意上面只是思路，实际代码需要把 y/x clamp 到目标框边界范围内，否则线可能落到框角以外。更好的版本：

```ts
const clampToRange = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const targetEdgePoint = (rect: RectPercent, from: PointPercent): PointPercent => {
  const center = rectCenter(rect);
  const dx = from.x - center.x;
  const dy = from.y - center.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    return {
      x: dx > 0 ? rect.x + rect.width : rect.x,
      y: clampToRange(from.y, rect.y, rect.y + rect.height),
    };
  }

  return {
    x: clampToRange(from.x, rect.x, rect.x + rect.width),
    y: dy > 0 ? rect.y + rect.height : rect.y,
  };
};
```

解释 label 边缘点可以先简化。因为 label 的真实像素宽高不容易在 Remotion render 中测量，本次可以用一个百分比偏移近似：

```ts
const labelEdgePoint = (
  label: PointPercent,
  target: PointPercent,
): PointPercent => {
  const dx = target.x - label.x;
  const dy = target.y - label.y;
  const length = Math.max(1, Math.sqrt(dx * dx + dy * dy));
  const offset = 3.2;

  return {
    x: clampPercent(label.x + (dx / length) * offset),
    y: clampPercent(label.y + (dy / length) * offset),
  };
};
```

然后在 svg line 里使用：

```tsx
const targetPoint = targetEdgePoint(rect, label);
const startPoint = labelEdgePoint(label, targetPoint);

<line
  x1={startPoint.x}
  y1={startPoint.y}
  x2={targetPoint.x}
  y2={targetPoint.y}
/>
<circle cx={targetPoint.x} cy={targetPoint.y} ... />
```

这样线条视觉上会从解释标签附近出发，落到框边缘。

### 5.2 fixture 示例

文件：

`<PROJECT_ROOT>\src\video-system\compositions\ImageHeroSceneFixture.tsx`

要做：

- 调整 `手册=知识入口` 的 `x/y/width/height`，让框贴合目标对象。
- 框不要覆盖太多人物和手册无关区域。
- 如果需要，可以让 label 稍微离框远一点，但线条要从 label 指向框边缘。

当前目标是让用户一眼看懂：

“这个绿色框框住的就是我正在解释的关键对象。”

不是让用户猜“这个框到底想框什么”。

### 5.3 visual fixture JSON

文件：

`<PROJECT_ROOT>\src\video-system\fixtures\visual\image-hero-complex-visual.json`

要和 `ImageHeroSceneFixture.tsx` 保持一致。

## 6. 可选修改文件

如果你发现 validator 已经允许当前字段，不需要改。

当前 validator 路径：

`<PROJECT_ROOT>\src\video-system\scripts\validate-video-spec.ts`

只有在新增字段时才改 validator。本次建议不新增字段，避免扩大范围。

## 7. 不要做的事

本任务不要做：

- 不要新增 scene type。
- 不要做自动 OCR。
- 不要做截图标注编辑器。
- 不要支持任意箭头、多段折线、自由绘制。
- 不要重构 `ImageHeroScene` 整体布局。
- 不要改当前正式视频 `videoSpec.json`。
- 不要渲染 mp4。
- 不要修改 `userDecision`、`approvedByUser`、`decisionNote`、`decidedAt`。
- 不要用 CSS transition / CSS animation / Tailwind 动画类。

## 8. 验收标准

必须生成 still：

```bash
npx remotion still src/index.ts ImageHeroSceneFixture --frame=145 --output=out/keyframes/component-upgrade/P1-image-hero-annotations-fixture.png
```

必须人工看图确认：

- `局部放大` 仍然好用。
- `手册=知识入口` 的框选只比目标对象大一点。
- 框选没有框很多多余区域。
- 箭头终点落在目标框边缘，不是框中心。
- 箭头起点看起来从解释 label 方向发出，不是突兀地从中间冒出来。
- 标注不遮挡人物脸、手册关键字、解释面板正文。

必须跑：

```bash
npm run typecheck
npm run visual:fixtures
npm run validate:all
```

预计 `validate:all` 仍可能出现当前 Claude Code 视频已有警告：

- PPT 化倾向。
- 长场景缺少渐进动画。
- 字幕密度。

这些不是本任务引入的新错误。只要退出码是 0，并且渲染代码验证通过即可。

## 9. 当前已知命令现象

Remotion still 过程中可能出现大量 Webpack cache 警告：

```text
[webpack.cache.PackFileCacheStrategy] Restoring failed ... Error: Unexpected end of stream
```

只要命令退出码是 0，且 PNG 文件实际生成，就不要误判为本任务失败。

## 10. 新窗口建议开场执行顺序

1. 阅读：

```bash
Get-Content -Raw AGENTS.md
Get-Content -Raw docs/director/P1_IMAGE_HERO_ANNOTATION_GEOMETRY_HANDOFF.md
Get-Content -Raw src/video-system/components/visual/VisualAnnotations.tsx
Get-Content -Raw src/video-system/compositions/ImageHeroSceneFixture.tsx
```

2. 按 AGENTS 输出：

- Project Understanding Report
- Implementation Plan

3. 等用户确认后再改。

4. 修改：

- `VisualAnnotations.tsx`
- `ImageHeroSceneFixture.tsx`
- `image-hero-complex-visual.json`

5. 生成 still 并查看。

6. 运行验证。

7. 交付时必须提供：

- 修改文件清单。
- still 路径。
- 验证命令和结果。
- 是否有剩余警告。
- 回滚方式。

## 11. 最终交付话术示例

可以这样告诉用户：

> 已修复 `image-hero` 标注几何逻辑。现在绿色框会更贴近 `手册=知识入口` 对象本身，箭头不再连到框中心，而是落在目标框靠近解释标签的一侧边缘。局部放大保持原效果。

并附上：

```md
![image-hero annotations](<PROJECT_ROOT>\out\keyframes\component-upgrade\P1-image-hero-annotations-fixture.png)
```

## 12. 任务边界总结

这不是“继续美化一张图”，而是补齐一个系统能力细节：

知识视频里的标注必须有明确对象边界。

画面说“看这里”时，观众必须真的知道“这里”是哪。

