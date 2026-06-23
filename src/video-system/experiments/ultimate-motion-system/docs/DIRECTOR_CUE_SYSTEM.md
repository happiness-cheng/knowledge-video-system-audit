# Director Cue System — V2

## 核心能力

1. **labDirectorCues.ts** — S02/S04/S06/S07 的 cue 数据
2. **resolveActiveTarget.ts** — 根据当前帧计算 active 目标
3. **TimelineCueBar** — cue 时间轴可视化组件

## Cue 数据结构

```typescript
interface LabCue {
  cueId: string;
  spokenAnchor: string;
  target: string;
  startFrameEstimate: number;
  holdFrames: number;
  leadFrames: number;
  support: "draft-estimate" | "draft-director" | "reference-only";
}
```

## 支持的模式

- **strict-switch**: 当前 active 最亮，相邻 0.65，其他 0.4
- **progressive-retain**: 已激活保持较高可见性，最终全体稳定

## Cue 配置

- leadFrames: 10（0.33 秒 @ 30fps）
- decayFrames: 15
- minHoldFrames: 45

## 消费方式

```typescript
const cues = getLabSceneCues("S02");
const { activeTarget, targetOpacity } = resolveActiveTarget(
  frame, cues.cues, DECAY_FRAMES, "strict-switch"
);
// targetOpacity("left") → 0.4~1.0
```

## 迁移建议

P0 优先迁回实践版：
- resolveActiveTarget() 作为共享 utils
- cue 数据结构作为标准接口
