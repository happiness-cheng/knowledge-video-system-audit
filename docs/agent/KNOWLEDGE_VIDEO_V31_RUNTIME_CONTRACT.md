# Knowledge Video V3.1 — Agent 运行时契约

本文件描述 Agent 如何读取、验证和执行 V3.1 交接包。不包含内容策划、选题、Hook、封面等上游规则。

---

## 一、交接包文件清单

V3.1 Agent Handoff 至少包含：

```text
00_AGENT_HANDOFF.md
01_APPROVED_CONTENT_SNAPSHOT.json
02_CONTENT_MASTER_DRAFT.md
03_BEAT_SHEET.json
04_SHOT_PLAN.json
05_SHOT_DIRECTOR_SPEC.json
06_SEMANTIC_VOICEOVER_VISUAL_ALIGNMENT.json
07_CAPABILITY_PREFLIGHT.json
08_COVER_BRIEF.json
09_ASSET_MANIFEST.json
10_PREPRODUCTION_REVIEW.json
assets/
```

TTS 后由 Agent 增加：

```text
11_AUDIO_TIMING.json
12_TIMED_VISUAL_ALIGNMENT.json
13_COMPILED_VIDEO_SPEC.json
```

---

## 二、快照与 digest 验证

### contentSnapshotId

所有视觉产物必须携带同一个 `contentSnapshotId`。验证方法：

```typescript
import { validateContentSnapshotId } from "../src/video-system/utils/contentSnapshot";

// CS-YYYYMMDD-xxxx 格式
validateContentSnapshotId("CS-20260624-ab12"); // true
```

不一致时阻断交接。

### candidateDigest

`preProductionReview` 中的 `candidateDigest` 必须与被审快照的 SHA-256 完全一致。验证方法：

```typescript
import { validateVisualSnapshotConsistency } from "../src/video-system/utils/preProductionGate";
```

不一致时阻断审查。

### visualSnapshotId

视觉产物汇总快照标识，格式 `VS-YYYYMMDD-xxxx`。

```typescript
import { validateVisualSnapshotId } from "../src/video-system/utils/visualHandoff";
```

---

## 三、能力预检

每个 Shot 在进入 Scene 编译前必须通过能力预检。

### 状态含义

| 状态                  | Agent 处理                         |
| --------------------- | ---------------------------------- |
| supported             | 直接进入 Scene 编译                |
| hold-motion-patch     | 实现 holdMotion 补丁，验证后才进入 |
| new-component-gap     | 返回用户决定，不得自行降级         |
| fallback-unacceptable | 阻断生产，返回用户                 |

### 验证方法

```typescript
import { validateCapabilityPreflightItem } from "../src/video-system/utils/visualHandoff";
```

关键规则：不得静默降级为文字卡。判断标准是"能否完成解释目标"，不是"能否渲染"。

---

## 四、Shot 到 Scene 编译

### 默认规则

1 Shot = 1 Scene。

### 合并条件

相邻 Shot 同时满足以下条件时可合并为同一 Scene 的多个 Sequence：

- 同一视觉宿主
- 同一核心素材
- 状态连续
- 不改变 Shot 顺序
- 不改变 spokenClause
- 不改变证据和信息结论
- 保留所有 sourceShotIds 和 alignmentIds

### 编译映射

```typescript
import { validateShotSceneCompileEntry } from "../src/video-system/utils/visualHandoff";

// 每个 Scene 记录来源 Shot 和 alignment
{
  sceneId: "S01",
  sourceShotIds: ["B01-S01"],
  alignmentIds: ["A01"]
}
```

---

## 五、制作前门禁

### Quick 模式

沿用 V2 门禁逻辑。

### Standard 模式（V3.1 新增）

双独立审查：

```typescript
import { evaluateStandardDualReview } from "../src/video-system/utils/preProductionGate";

const errors = evaluateStandardDualReview({
  reviews: [...],
  candidateDigest: "sha256",
});
```

通过条件：

- 至少 2 份 review
- 至少 2 个不同 reviewerSystem
- 其中一份必须是 GPT 自检
- averageScore > 85
- minimumScore > 85
- 所有 recommendation = pass
- 所有 vetoes 为空
- candidateDigest 完全一致

评分为 85 不通过。

### Deep 模式

沿用多 AI 90 分门禁，不降低门槛。

---

## 六、TTS 后时序映射

TTS 生成 `audioTiming.json` 后，Agent 编译 `timedVisualAlignment`：

```typescript
import { validateTimedVisualAlignment } from "../src/video-system/utils/visualHandoff";
```

规则：

- 真实音频时序覆盖 durationEstimate
- Agent 可调整动画速度和 Scene 时长
- 不得为适配时长删改口播含义或视觉结论
- 口播变化后，原音频、字幕、timedVisualAlignment 全部失效

---

## 七、类型导入

所有 V3.1 类型和验证器位于：

```text
src/video-system/utils/contentSnapshot.ts
src/video-system/utils/shotDirectorSpec.ts
src/video-system/utils/visualHandoff.ts
src/video-system/utils/preProductionGate.ts
```

导入示例：

```typescript
import type { ApprovedContentSnapshot } from "../src/video-system/utils/contentSnapshot";
import type { ShotDirectorSpec } from "../src/video-system/utils/shotDirectorSpec";
import type {
  SemanticVoiceoverVisualAlignment,
  TimedVisualAlignment,
  CapabilityPreflightItem,
  ShotSceneCompileEntry,
} from "../src/video-system/utils/visualHandoff";
```

---

## 八、禁止事项

- 不得修改 contentSnapshotId、sourceDigest 或 candidateDigest 来绕过门禁
- 不得把 new-component-gap 或 fallback-unacceptable 静默降级为文字卡
- 不得为适配时长删改口播含义
- 不得在合并 Shot 时丢失 sourceShotIds 或 alignmentIds
- 不得在用户未批准时进入正式生产或发布
