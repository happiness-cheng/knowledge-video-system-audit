# Director Visual Rules

从 P1-3A / P1-3B / P1-3C 实战中沉淀的视觉规则，供导演系统和 Agent 执行时参考。

## 1. Cue Wiring 规则

### 核心教训

**cue 代码必须写在实际渲染分支中，不是逻辑上正确的分支。**

P1-3A 的 spotlight 代码写在了 default 分支，但 S02/S07 实际走 isLabMistake/isLabTemplate 分支 → 用户三轮看不到变化。

### 检查清单

1. 确认 scene 的 `presentationMode`（由 theme 或 KnowledgeVideo 决定）
2. 确认 scene 的 `visualRole` 决定走哪个分支
3. 确认 cue 代码在那个分支中被消费，而不是只被计算
4. 用 debug overlay 验证：显示 sceneId / activeTarget / frame / branch

### Debug Overlay 模板

```tsx
{
  cueState && (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        right: 16,
        background: "rgba(128, 0, 255, 0.92)",
        color: "#fff",
        padding: "12px 18px",
        borderRadius: 10,
        fontSize: 22,
        fontWeight: 700,
        fontFamily: "monospace",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div>DEBUG CUE ON</div>
      <div>scene: {scene.id}</div>
      <div>activeTarget: {cueState.activeTarget ?? "none"}</div>
      <div>frame: {Math.round(frame)}</div>
    </div>
  );
}
```

验证完成后必须移除。

## 2. 白底 Spotlight 规则

### 问题

白底主题下，opacity/scale/shadow 差异不够明显（白底本身就很亮）。

### 解决方案

不靠整卡透明度，靠多种视觉信号叠加：

| 信号       | active           | inactive           |
| ---------- | ---------------- | ------------------ |
| 背景 tint  | 13% accent 色    | 无                 |
| 左侧色条   | 10px, opacity 1  | 无                 |
| 边框       | 2.5px, accent 色 | 1.5px, 极弱        |
| 阴影       | 8px 32px         | 几乎无             |
| scale      | 1.018            | 0.985              |
| translateY | -8px             | 0                  |
| 标题文字   | accent 色, 100%  | secondaryText, 50% |

### 适用场景

- `visualRole: "conflict"` + `mode: "strict-switch"` → 左右卡片切换
- 不适用于模板页（模板页不需要 spotlight）

## 3. 证据页规则

### 结构

```
主标题（大）
小标签（辅助说明）
┌─────────────┬─────────────┐
│  左证据      │  右证据      │
│  变量标签    │  变量标签    │
│  一句结论    │  一句结论    │
│  ██████████  │  ██████████  │
│  截图主体    │  截图主体    │
│             │             │
└─────────────┴─────────────┘
    ↑ 字幕安全区 150px ↑
```

### 关键规则

1. **标题层级不重复**：只有一个主标题，辅助信息用小标签
2. **截图是主体**：label 30px / conclusion 44px，截图 flex:1 自适应占满
3. **左右等权**：grid 等宽 + flex 等高 + objectFit: contain
4. **字幕安全区**：底部 padding 150px，关键内容不进入该区域
5. **不加不准确的 HighlightBox**

## 4. 模板页规则

### 适用场景

`visualRole: "template"` → 收藏型模板页

### 关键规则

1. **四项等权**：相同字号、字重、颜色、badge 样式
2. **不做单项高亮**：不消费 cue active state
3. **不做 progressive-retain**：不逐项切换 spotlight
4. **整体进入**：模板卡 fadeSlideIn，进入后立即稳定
5. **可截图**：最终状态像一张完整的模板卡

### 反模式

- "当前" chip
- 左侧色条
- 背景 tint 差异
- 逐项 opacity 差异

## 5. 字幕安全区规则

### 标准值

```ts
const subtitleSafeBottom = 150;
```

### 应用

- 主容器 padding bottom ≥ 150px
- 截图底部不贴画面底边
- caption / 结论 / 标签不放在字幕覆盖区域
- 字幕最多覆盖空白区或弱信息区

## 6. 防御式实现规则

### 修改 scene 组件时

1. 只改目标分支（如 isLabMistake），不改其他分支
2. 非 lab 的 default 分支保持原逻辑
3. 不修改 videoSpec.json
4. 不修改 KnowledgeVideo.tsx
5. 不修改 themes/

### 验证清单

```bash
npm run typecheck
npm run validate:all
grep -R "DEBUG CUE ON" src/video-system
grep -R "#FFE600\|#FF0000" src/video-system/scenes
git diff -- src/video-system/data/videoSpec.json
```

## 7. 渐进式调试流程

当用户说"看不到变化"时：

1. **先查 wiring**：cue 是否在实际渲染分支中
2. **再查 data**：sceneId / visualRole / presentationMode 是否命中
3. **最后查 visual**：视觉强度是否足够

不要跳过 1 和 2 直接调视觉参数。
