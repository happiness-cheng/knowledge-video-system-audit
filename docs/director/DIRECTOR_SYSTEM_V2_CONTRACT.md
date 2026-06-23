> **STATUS: HISTORICAL / REFERENCE ONLY.** Current production rules are in `AGENTS.md`, `SOURCE_OF_TRUTH_MAP.md`, prompts 00/01/17/18, and runtime validators.

# Director System V2 Contract

## 1. 目标

Director System V2 的目标是把视频生产从“页面模板选择”改成“导演意图驱动”。

当前实践版保留 `videoSpec.json` 的 22 个已实现 scene type，但它们不再被视为同等级的导演核心。V2 先作为导演中间层契约存在，用于指导 ChatGPT、用户和 Agent 在进入正式 `videoSpec` 前完成镜头意图、实现等级和风险判断；不得新增正式 scene type，不得把实验能力写成已支持。

核心原则：

- 导演层先回答观众理解路径，不先选 `two-column`、`comparison` 或 `big-quote`。
- 旧 PPT scene 只能作为 presentation layer 或 supporting shot；核心解释优先由 semantic shot pattern 承担。
- 实现层必须区分稳定资产、迁移候选和实验能力。
- 实践版默认只允许 Level 1 / Level 2。
- Level 3 必须进入 `experiments` 或 shot-lab，不污染正式 renderer。
- Level 4 必须独立立项，不在单条视频迭代里顺手实现。
- 未落地能力只能标注为 `backlog`、`reference-only` 或 `experiment-only`。

## 2. 分层数据流

V2 不再从 `contentBrief` 直接跳到 `videoSpec`。

```text
contentBrief
↓
directorBrief
↓
shotPlan
↓
directorCuesDraft
↓
videoSpec
↓
audioTiming / subtitles
↓
directorCuesResolved
↓
Remotion implementation
```

### contentBrief

负责内容取舍、真实案例、节拍和口播材料。它回答“讲什么”。

### directorBrief

负责整期导演意图。它回答“观众要经历什么变化”。

示例字段：

```json
{
  "directorTheme": "从模糊到具体",
  "viewerTransformation": "从以为 AI 不懂我，到意识到自己没给判断材料",
  "visualMetaphor": "问题逐渐补全，回答逐渐变清晰",
  "narrativeMode": "对照实验",
  "emotionalCurve": ["困惑", "反差", "证据", "顿悟", "可执行"]
}
```

### shotPlan

负责每个镜头的导演任务和实现偏好。它回答“这一段怎么被看见”。

示例字段：

```json
{
  "shotId": "SH04",
  "sceneId": "S04",
  "shotTask": "evidence-proof",
  "viewerAttentionPath": ["先看结论", "再看左右变量", "最后看截图证据"],
  "visualCenter": "右侧补背景后的具体回答",
  "motionIntent": "先左后右，最后收束到结论",
  "implementationLevel": 2,
  "implementationPreference": "compose-existing",
  "currentSupport": "partial",
  "fallback": "退化为 comparison + evidence + assetLayout",
  "qaRequired": ["studio-review", "contact-sheet", "manual-evidence-inspect"]
}
```

### directorCuesDraft

负责语义 cue，不负责最终精确帧。

在 TTS/audioTiming 生成前，cue 只能使用 `spokenAnchor`、`target`、`purpose`、`motionIntent` 这类语义字段。不得把估算时间写成已对齐时间。

示例字段：

```json
{
  "cueId": "C02",
  "sceneId": "S04",
  "spokenAnchor": "补背景后 / 生活例子解释",
  "activeTarget": "right-evidence",
  "purpose": "让观众看到补背景后的结果更具体",
  "visualSignals": ["tint", "border", "scale", "shadow"],
  "timingStatus": "semantic-draft"
}
```

### videoSpec

仍是正式渲染输入。实践版 `videoSpec` 只能使用当前已实现字段和 22 个已实现 scene type。scene type 只是渲染宿主，不等于导演意图已经完成。

`directorBrief`、`shotPlan`、`directorCuesDraft` 不自动进入 `videoSpec`。只有经过验证、schema 评审和 renderer 支持确认的字段，才能进入正式 schema。

### directorCuesResolved

在 `audioTiming.json` 和 `subtitles.json` 可用后生成。它把 `spokenAnchor` 解析为 `startFrame`、`endFrame` 或 `timeRange`。

如果无法可靠对齐，必须保留 `timingStatus: "inspect"`，不得写成 pass。

## 3. 实现授权等级

### Level 1: 直接复用稳定组件

用于实践版默认生产。

允许：

- 选择当前已实现 scene type。
- 使用已落地的 `type + visualRole + presentationMode` 组合。
- 调整文案、布局参数、cue 目标和素材。
- 使用 `EvidenceBlock`、`PromptTemplateCard` 等已在实践版接入的组件。

禁止：

- 新增复杂组件。
- 改 renderer 主结构。
- 把实验组件标成稳定能力。

适合：

- 大多数正式视频。
- 可预测、可回归、可复用的生产任务。

### Level 2: 组合已有能力

用于 Director System V2 的主力方式。

允许：

- 使用 `Sequence`、`useCurrentFrame`、`interpolate`、`spring` 组合已实现组件。
- 组合 `EvidenceBlock`、`PromptTemplateCard`、spotlight、progressive reveal、assetLayout。
- 在已有 scene 分支内消费已验证 cue。

要求：

- 必须 frame-driven。
- 禁止 CSS `transition`、CSS `animation`、Tailwind 动画类。
- 必须有 fallback。
- 必须保留 Studio 可检阅入口。

适合：

- “同一画面内先看 A、后看 B、最后收束”的镜头。
- 需要更强注意力调度，但不需要全新视觉语法的正式视频。

### Semantic Shot Core

V2 的核心不是继续优化每个 PPT scene，而是用少量可复用 semantic shot pattern 承担视觉解释：

| semantic shot | 当前状态 | 正式落地方式 | 用途 |
| --- | --- | --- | --- |
| `pressure-build` | production-validated | `cover + semanticPattern=pressure-build` | 开头压力、重复指令、信息袭来、困惑形成 |
| `fragment-to-manual` | production-validated | `flow-diagram + semanticPattern=fragment-to-manual` | 碎片汇聚成手册 / 文件 / 默认共识 |
| `detour-vs-direct` | production-validated | `comparison + semanticPattern=detour-vs-direct-path` | 同一目标下绕路和直达对比 |
| `wrong-to-correct` | production-validated | `big-quote + semanticPattern=wrong-to-correct` | 旧判断被否定，新判断浮现 |
| `confused-to-guided` | production-validated | `two-column + semanticPattern=confused-to-guided` | 角色从困惑到理解、操作路径变清楚 |
| `map-light-up` | internal-wired | `MapLightUp` 内部组件 / 特定 scene 分支 | 手册点亮项目地图，区分提醒和硬拦截 |

只有 `production-validated` 的 semantic shot 可以直接进入正式 videoSpec。`internal-wired` 只能作为 Agent 复用线索或特定已接入分支；`backlog` 必须进入组件升级包或改写导演方案。

### Level 3: 新增局部 shot component

用于实验版大胆探索。

允许：

- 为单个导演任务新增小型 shot component。
- 放在 `experiments`、shot-lab 或明确实验目录。
- 使用新的局部视觉表达，例如 prompt 逐步补全、证据局部放大、变量箭头等。

要求：

- 不直接进入实践版。
- 必须有 Studio 入口。
- 必须有截图或 contact sheet。
- 必须有实验报告、风险说明和迁移候选记录。
- 迁移前必须通过回归检查。

禁止：

- 在单条正式视频里顺手把 Level 3 组件接入实践版 renderer。
- 在 `videoSpec.json` 中引用未实现字段或 scene type。

适合：

- 现有资产无法表达的强导演意图。
- 需要验证是否真能降低 PPT 感的新镜头。

### Level 4: 新增视觉语法或 renderer 能力

用于大版本升级。

包括：

- 全新镜头系统。
- 全新背景系统。
- 全新转场体系。
- 全新字幕互动系统。
- renderer 主结构重构。
- 正式 schema 大改。

要求：

- 必须独立立项。
- 必须有设计文档、实施计划、回归策略和回滚策略。
- 不允许在单条视频迭代中顺手做。

## 4. 能力分类

### 稳定资产

稳定资产是已经在实践版或当前正式渲染链路中可控使用的组件或模式。

当前可视为稳定资产的例子：

- 已实现的 22 个 scene type，但其中大部分旧 PPT scene 只作为辅助镜头或渲染宿主。
- `EvidenceBlock`。
- `PromptTemplateCard` 作为 `todo-checklist + visualRole=template` 的内部组件。
- `lab-hook`、`lab-mistake`、`lab-evidence`、`lab-insight`、`lab-template` 这类已接入的 Knowledge Lab 变体，仅限已有触发条件。
- `directorCue.ts` 中已验证的 spotlight 计算逻辑，仅限已有消费点和支持场景。

### 迁移候选

迁移候选是实验区已有实现，但尚未成为实践版稳定资产的能力。

当前应标为迁移候选的例子：

- `EvidenceCompare`。
- `TemplatePanel`。
- `CueActiveCard`。
- ultimate motion system 中的 shot grammar。
- 更完整的 evidence panel、semantic highlight、timeline cue bar。

迁移候选不得在正式 prompt 或正式 `videoSpec` 中写成“已支持”。

### 实验能力

实验能力是可以探索但不能污染实践版的能力。

例子：

- prompt morph。
- 证据局部放大。
- 新背景系统。
- 新转场系统。
- 音频可视化。
- 复杂光效或 WebGL 表达。

实验能力必须有明确业务目的：提升理解、证据感、注意力调度、保存价值或转发价值。不能只为了炫技。

## 5. Agent 决策流程

Agent 不是只能套模板的执行员，也不是自由导演。

Agent 的职责：

1. 读取 `directorBrief` 和 `shotPlan`。
2. 判断每个 shot 的导演意图是否能由当前稳定资产实现。
3. 能实现时，优先用 Level 1。
4. Level 1 不够但已有能力可组合时，使用 Level 2。
5. Level 2 仍不能表达时，进入 Level 3 shot-lab，并报告不能进入实践版。
6. 如果需要 renderer 主结构或视觉语法变化，升级为 Level 4 独立项目。
7. 所有实现必须围绕 `viewerAttentionPath`、`visualCenter` 和 `motionIntent`，不得为了炫技添加动效。

决策表：

| 判断问题 | 是 | 否 |
|---|---|---|
| 当前 scene type 能表达导演任务吗 | Level 1 | 继续判断 |
| 已有组件组合能表达注意力路径吗 | Level 2 | 继续判断 |
| 只需要局部新 shot component 吗 | Level 3 shot-lab | 继续判断 |
| 需要新增视觉语法或 renderer 能力吗 | Level 4 独立立项 | 回退重写导演意图 |

## 6. ChatGPT / 用户 / Agent 分工

### ChatGPT / 用户

负责：

- 决定导演主题。
- 决定观众理解变化。
- 决定叙事模式。
- 审查 shotPlan 是否符合内容目标。
- 明确批准实践版、实验版或停止。

### Agent

负责：

- 判断当前能力是否支持导演意图。
- 选择 Level 1 / 2 / 3 / 4。
- 执行已批准范围内的工程修改。
- 报告 fallback、风险和 QA 结果。
- 不得自行修改 `userDecision`、`approvedByUser`、`decisionNote`、`decidedAt`。

### Remotion

Remotion 是镜头执行引擎，不是 PPT 模板库。

实践版应优先使用：

- `Sequence`。
- `useCurrentFrame()`。
- `interpolate()`。
- `spring()`。
- `staticFile()` 路径 helper。
- frame-driven 的 spotlight、progressive reveal、active state。

禁止使用 CSS transition / animation 替代 frame-driven 动画。

## 7. QA 门禁

### 文档和数据 QA

- `directorBrief` 必须说明导演主题和观众理解变化。
- 每个 shot 必须有 `shotTask`、`viewerAttentionPath`、`visualCenter`、`motionIntent`。
- 每个 shot 必须声明 `implementationLevel`、`currentSupport`、`fallback`。
- `directorCuesDraft` 必须标注 `timingStatus`，不得把语义估算写成已对齐。

### 实践版 QA

实践版 Level 1 / 2 至少需要：

- `npm run validate:all`。
- Studio 可检阅入口。
- 必要时生成 contact sheet。
- 如果执行 preview，则遵守 visual compiler 协议。

### 实验版 QA

Level 3 至少需要：

- 独立 Studio composition。
- 截图或 contact sheet。
- 实验报告。
- 迁移候选记录。
- 回归风险说明。

### Level 4 QA

Level 4 必须作为独立项目进入完整计划审查、代码审查和验收流程。

## 8. 落地路线

### P0: 契约冻结

产出：

- 本文档。
- 示例 `directorBrief` / `shotPlan` / `directorCuesDraft`。

不做：

- 不改 renderer。
- 不改正式 schema。
- 不新增 scene type。

### P1: Sidecar 数据试点

产出：

- 针对一条视频新增 sidecar `directorBrief` 和 `shotPlan`。
- 保持正式 `videoSpec` 不扩 schema。

验收：

- 用户能用 sidecar 审查镜头意图。
- Agent 能根据 sidecar 选择 Level 1 / 2 / 3。

### P2: Cue 语义到帧对齐

产出：

- `directorCuesDraft` 到 `directorCuesResolved` 的生成规则。
- 基于 `audioTiming` / `subtitles` 的 cue 对齐检查。

验收：

- cue 不再只靠 `durationEstimate`。
- 对齐失败时能进入 inspect，而不是误报 pass。

### P3: Level 2 能力标准化

产出：

- 复用 `directorCue.ts`。
- 标准化 strict-switch / progressive-retain。
- 为已支持 scene 建立明确消费点。

验收：

- cue wiring 可追踪。
- fallback 明确。
- 不扩大到无关 scene。

### P4: Level 3 shot-lab 流程

产出：

- 新 shot component 的实验目录规范。
- Studio 审片入口。
- migration candidate 模板。

验收：

- 实验能力可验证、可放弃、可迁移。
- 不污染实践版。

## 9. 明确非目标

本契约不做以下事情：

- 不创建独立 `PromptTemplateCard` scene type。
- 不把 ultimate motion system 组件直接声明为实践版能力。
- 不实现通用文档模板卡、编辑器卡、小尘人物层或 9:16 自动重排。
- 不引入 Lottie、3D、light leaks、Lambda 或复杂 WebGL 作为实践版默认能力。
- 不改变现有 22 个 scene type 的正式边界。
- 不替代人工审片。

## 10. 一句话原则

导演系统永远先提出镜头意图，再决定复用、组合、实验，还是独立立项。

实践版追求稳定生产，实验版释放导演想象力，迁移机制负责把有效实验沉淀成稳定资产。
