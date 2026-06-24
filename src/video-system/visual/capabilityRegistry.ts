export type CapabilityStatus =
  | "legacy-support"
  | "semantic-enabled"
  | "production-validated"
  | "internal-wired"
  | "fixture-only"
  | "experimental"
  | "backlog";

export interface SceneCapability {
  type: string;
  status: CapabilityStatus;
  layer: "presentation" | "semantic-host" | "knowledge-object";
  role:
    | "supporting-shot"
    | "hero-shot-host"
    | "object-explainer"
    | "release-surface";
  boundary: string;
  recommendedUse: string;
  /** V4: 语义能力——该场景类型能承载哪些语义目标 */
  semanticAffordances?: string[];
  /** V4: 支持的状态变化类型 */
  supportedStateChanges?: string[];
  /** V4: 是否支持跨 Shot 状态继承 */
  continuitySupport?: "none" | "manual" | "built-in";
  /** V4: 是否支持证据展示 */
  evidenceSupport?: "none" | "static" | "interactive";
  /** V4: 已知限制 */
  knownLimitations?: string[];
  /** V4: 手机端风险 */
  mobileRisk?: "low" | "medium" | "high";
  /** V4: 已验证的使用示例 */
  validatedExamples?: string[];
}

export interface SemanticPatternCapability {
  pattern: string;
  status: CapabilityStatus;
  hostTypes: string[];
  boundary: string;
  recommendedUse: string;
  /** V4: 语义目标 */
  semanticGoal?: string;
  /** V4: 初始状态 */
  initialState?: string;
  /** V4: 核心变化 */
  coreChange?: string;
  /** V4: 最终状态 */
  finalState?: string;
  /** V4: 禁止降级 */
  forbiddenDowngrade?: string;
  /** V4: 验收标准 */
  acceptanceCriteria?: string[];
}

export interface InternalComponentCapability {
  component: string;
  status: CapabilityStatus;
  entry: string;
  boundary: string;
  recommendedUse: string;
  /** V4: 语义能力 */
  semanticAffordances?: string[];
  /** V4: 已知限制 */
  knownLimitations?: string[];
}

export interface ThemeCapability {
  id: string;
  status: CapabilityStatus;
  role: "primary-production" | "specialized-production" | "legacy-theme";
  boundary: string;
}

export const sceneCapabilities: SceneCapability[] = [
  {
    type: "cover",
    status: "legacy-support",
    layer: "presentation",
    role: "supporting-shot",
    boundary: "可做标题入口；动态 hook 不应只依赖 cover 入场动画。",
    recommendedUse: "普通开场、低复杂度标题页、封面式入口。",
  },
  {
    type: "big-quote",
    status: "legacy-support",
    layer: "presentation",
    role: "supporting-shot",
    boundary: "适合钉住结论，不应替代结论形成过程。",
    recommendedUse: "阶段结论、反差金句、recap。",
  },
  {
    type: "title-subtitle",
    status: "legacy-support",
    layer: "presentation",
    role: "supporting-shot",
    boundary: "只能承担低密度过渡，不适合作为核心视觉解释。",
    recommendedUse: "章节转场、短暂停顿。",
  },
  {
    type: "bullets",
    status: "legacy-support",
    layer: "presentation",
    role: "supporting-shot",
    boundary: "只用于辅助信息；连续使用会产生 PPT 风险。",
    recommendedUse: "补充要点、非核心并列信息。",
  },
  {
    type: "comparison",
    status: "semantic-enabled",
    layer: "semantic-host",
    role: "hero-shot-host",
    boundary:
      "默认仍是对比页；只有接入 semanticPattern 时才承担路径型视觉解释。",
    recommendedUse: "证据对比、前后变化、路径差异。",
    semanticAffordances: [
      "path-comparison",
      "before-after",
      "evidence-side-by-side",
    ],
    supportedStateChanges: ["highlight-difference", "switch-focus"],
    continuitySupport: "manual",
    evidenceSupport: "static",
    knownLimitations: ["默认左右等权，需 semanticPattern 激活路径对比"],
    mobileRisk: "medium",
    validatedExamples: ["detour-vs-direct-path 场景"],
  },
  {
    type: "two-column",
    status: "semantic-enabled",
    layer: "semantic-host",
    role: "hero-shot-host",
    boundary: "可做左右冲突和 cue 高亮；未接 cue 时仍可能退回并列卡片。",
    recommendedUse: "错误现场、左右因果、角色状态对照。",
    semanticAffordances: [
      "conflict-display",
      "cause-effect",
      "state-comparison",
    ],
    supportedStateChanges: ["cue-highlight", "resolve-conflict"],
    continuitySupport: "manual",
    evidenceSupport: "static",
    knownLimitations: ["未接 cue 时退回并列卡片"],
    mobileRisk: "medium",
    validatedExamples: ["confused-to-guided 场景"],
  },
  {
    type: "three-column",
    status: "legacy-support",
    layer: "presentation",
    role: "supporting-shot",
    boundary: "三栏天然等权，核心解释页慎用。",
    recommendedUse: "迁移场景、三类辅助例子。",
  },
  {
    type: "pros-cons",
    status: "legacy-support",
    layer: "presentation",
    role: "supporting-shot",
    boundary: "优缺点并列容易 PPT 化，不应用于动态推理。",
    recommendedUse: "轻量取舍说明。",
  },
  {
    type: "todo-checklist",
    status: "semantic-enabled",
    layer: "semantic-host",
    role: "hero-shot-host",
    boundary: "template 变体可截图保存；普通 checklist 仍是辅助页。",
    recommendedUse: "方法模板、交付清单、可复制行动。",
  },
  {
    type: "stat-highlight",
    status: "legacy-support",
    layer: "presentation",
    role: "supporting-shot",
    boundary: "适合单个数字，不适合复杂数据解释。",
    recommendedUse: "单指标强调。",
  },
  {
    type: "process-steps",
    status: "semantic-enabled",
    layer: "semantic-host",
    role: "hero-shot-host",
    boundary: "可表达阶段推进，但列表逐条出现不等于语义动画。",
    recommendedUse: "少量步骤、变量逐步加入。",
  },
  {
    type: "flow-diagram",
    status: "semantic-enabled",
    layer: "semantic-host",
    role: "hero-shot-host",
    boundary: "默认节点图仍偏静态；fragment-to-manual 已可做语义汇聚。",
    recommendedUse: "节点关系、碎片汇聚、流程结构。",
    semanticAffordances: [
      "fragment-convergence",
      "process-flow",
      "node-relationship",
    ],
    supportedStateChanges: [
      "fragment-to-whole",
      "node-highlight",
      "path-trace",
    ],
    continuitySupport: "built-in",
    evidenceSupport: "none",
    knownLimitations: ["默认节点图偏静态，需 semanticPattern 激活动态汇聚"],
    mobileRisk: "medium",
    validatedExamples: ["fragment-to-manual 场景"],
  },
  {
    type: "roadmap",
    status: "legacy-support",
    layer: "presentation",
    role: "supporting-shot",
    boundary: "适合目标路线，不适合精确执行链路。",
    recommendedUse: "阶段目标、学习路线。",
  },
  {
    type: "timeline",
    status: "legacy-support",
    layer: "presentation",
    role: "supporting-shot",
    boundary: "适合历史先后，不适合因果推理本体。",
    recommendedUse: "事件顺序、版本演进。",
  },
  {
    type: "mindmap",
    status: "legacy-support",
    layer: "presentation",
    role: "supporting-shot",
    boundary: "适合概念展开，不适合证明关系变化。",
    recommendedUse: "概念分组、知识地图。",
  },
  {
    type: "section-divider",
    status: "legacy-support",
    layer: "presentation",
    role: "supporting-shot",
    boundary: "只用于节奏分隔。",
    recommendedUse: "章节分割、低密度呼吸。",
  },
  {
    type: "cta",
    status: "legacy-support",
    layer: "presentation",
    role: "release-surface",
    boundary: "适合行动号召；不承担核心解释。",
    recommendedUse: "结尾行动、下一步提示。",
  },
  {
    type: "code",
    status: "production-validated",
    layer: "knowledge-object",
    role: "object-explainer",
    boundary:
      "1-10 行短代码、配置、prompt、CLAUDE.md；不是 IDE 或长文档阅读器。",
    recommendedUse: "逐行解释文件结构和关键字段。",
    semanticAffordances: [
      "line-by-line-explanation",
      "structure-reveal",
      "syntax-highlight",
    ],
    supportedStateChanges: ["progressive-reveal", "highlight-current"],
    continuitySupport: "manual",
    evidenceSupport: "interactive",
    knownLimitations: ["仅限 1-10 行短代码", "不支持 IDE 式长文档"],
    mobileRisk: "high",
    validatedExamples: ["CLAUDE.md 配置解释"],
  },
  {
    type: "diff",
    status: "production-validated",
    layer: "knowledge-object",
    role: "object-explainer",
    boundary: "2-8 条短前后变化；不是 Git diff 或长代码审查。",
    recommendedUse: "错误写法到正确写法、prompt 改写、配置变化。",
    semanticAffordances: [
      "before-after-change",
      "error-correction",
      "config-migration",
    ],
    supportedStateChanges: ["line-add", "line-remove", "line-modify"],
    continuitySupport: "manual",
    evidenceSupport: "interactive",
    knownLimitations: ["仅限 2-8 条短变化", "不支持 Git diff 式长审查"],
    mobileRisk: "high",
    validatedExamples: ["prompt 改写对比"],
  },
  {
    type: "terminal",
    status: "production-validated",
    layer: "knowledge-object",
    role: "object-explainer",
    boundary: "1-8 行短命令结果；不展示敏感信息、长日志或交互式终端。",
    recommendedUse: "测试结果、构建结果、实验执行现场。",
  },
  {
    type: "image-hero",
    status: "production-validated",
    layer: "knowledge-object",
    role: "object-explainer",
    boundary: "一张主图、最多 3 个受控标注；不是任意标注编辑器或长图滚动。",
    recommendedUse: "截图、生成图、复杂隐喻图的局部讲解。",
    semanticAffordances: [
      "screenshot-evidence",
      "visual-annotation",
      "局部放大",
    ],
    supportedStateChanges: ["zoom-in", "highlight-area"],
    continuitySupport: "manual",
    evidenceSupport: "interactive",
    knownLimitations: ["最多 3 个受控标注", "不支持长图滚动"],
    mobileRisk: "medium",
    validatedExamples: ["截图证据展示"],
  },
  {
    type: "gantt",
    status: "production-validated",
    layer: "knowledge-object",
    role: "object-explainer",
    boundary: "轻量执行链路，最多 5 条 lane / 8 个 task；不是项目管理甘特图。",
    recommendedUse: "并行任务、阻塞、人工确认、交付链路。",
  },
];

export const semanticPatternCapabilities: SemanticPatternCapability[] = [
  {
    pattern: "fragment-to-manual",
    status: "production-validated",
    hostTypes: ["flow-diagram"],
    boundary: "只表达碎片、规则或经验汇聚成手册/文件/默认共识。",
    recommendedUse: "散乱知识沉淀成 CLAUDE.md、项目手册或操作规范。",
    semanticGoal: "让观众看到散乱知识如何汇聚成结构化手册",
    initialState: "散落的便签、知识点、规则碎片",
    coreChange: "碎片逐步汇聚、排列、形成结构",
    finalState: "完整的结构化手册/文件",
    forbiddenDowngrade: "不要一开始就展示最终形态；不要跳过汇聚过程",
    acceptanceCriteria: [
      "碎片到整体的过程可见",
      "最终形态是逐步形成的而非突然出现",
    ],
  },
  {
    pattern: "detour-vs-direct-path",
    status: "production-validated",
    hostTypes: ["comparison"],
    boundary: "只表达同一目标下旧路径绕远、新路径直达的差异。",
    recommendedUse: "有手册前后、补背景前后、错误路线和正确路线。",
    semanticGoal: "让观众直观理解为什么直接路径更好",
    initialState: "两条路径并存，目标相同",
    coreChange: "同时展示绕路和直达的差异",
    finalState: "对比清晰，直接路径优势明显",
    forbiddenDowngrade: "不要只用文字说明路径差异",
    acceptanceCriteria: ["两条路径的空间差异可见", "优劣对比直观"],
  },
  {
    pattern: "pressure-build",
    status: "production-validated",
    hostTypes: ["cover"],
    boundary: "只用于 Hook：信息压力形成、重复说明袭来、标题从冲突中浮现。",
    recommendedUse: "把静态封面升级成动态冲突开场，但最终标题仍必须清晰可读。",
    semanticGoal: "让观众在 2 秒内感受到问题的紧迫性",
    initialState: "观众熟悉的场景或默认假设",
    coreChange: "压力逐步累积，冲突加剧",
    finalState: "痛点被放大，标题从冲突中浮现",
    forbiddenDowngrade: "不要变成纯文字列表；不要让标题不可读",
    acceptanceCriteria: ["压力感在 2 秒内建立", "最终标题清晰可读"],
  },
  {
    pattern: "confused-to-guided",
    status: "production-validated",
    hostTypes: ["two-column"],
    boundary: "只表达从入口太多、不知道看哪里，到被明确路线引导的状态变化。",
    recommendedUse: "角色困惑、操作入口分散、职责路线逐步清晰的解释镜头。",
    semanticGoal: "让观众经历从困惑到被引导的认知变化",
    initialState: "入口太多、不知道看哪里",
    coreChange: "逐步获得指引，方向明确",
    finalState: "路线清晰，知道该怎么做",
    forbiddenDowngrade: "不要跳过困惑直接给答案",
    acceptanceCriteria: ["困惑状态可见", "引导过程有层次"],
  },
  {
    pattern: "wrong-to-correct",
    status: "production-validated",
    hostTypes: ["big-quote"],
    boundary:
      "只表达短错误判断被否定，再替换成短正确判断；不是 diff、代码审查或长句重写。",
    recommendedUse: "纠正误解、推翻旧结论、把观众注意力转移到正确判断。",
    semanticGoal: "让观众看到错误判断被纠正的过程",
    initialState: "错误判断占据注意力",
    coreChange: "划掉错误，展示正确",
    finalState: "正确判断确立",
    forbiddenDowngrade: "不要只用文字对比；不要跳过纠正过程",
    acceptanceCriteria: ["错误判断的否定可见", "正确判断的浮现有层次"],
  },
];

export const internalComponentCapabilities: InternalComponentCapability[] = [
  {
    component: "SpotlightCue",
    status: "internal-wired",
    entry: "已接入 cue 的 scene 分支",
    boundary: "只能通过现有消费点使用，不得生成 spotlight scene type。",
    recommendedUse: "当前重点高亮、旧信息降调、口播同步注意力调度。",
  },
  {
    component: "StrikeAndReplace",
    status: "production-validated",
    entry: "big-quote + semanticPattern=wrong-to-correct",
    boundary:
      "不是独立 scene type；正式 videoSpec 使用 big-quote semantic pattern。",
    recommendedUse: "旧判断划掉、灰化，新判断浮现。",
  },
  {
    component: "StateTransition",
    status: "fixture-only",
    entry: "StateTransitionFixture",
    boundary: "有 fixture，但未接入正式 SceneRenderer。",
    recommendedUse: "新人未读手册到已读手册的状态变化候选。",
  },
  {
    component: "MapLightUp",
    status: "internal-wired",
    entry: "BigQuoteScene 的项目地图分支和 MapLightUpFixture",
    boundary: "不是正式 scene type；通用使用前需要 schema/触发合同。",
    recommendedUse: "手册点亮项目地图、区分提醒路线和硬拦截边界。",
  },
  {
    component: "PathComparison",
    status: "internal-wired",
    entry: "comparison + semanticPattern=detour-vs-direct-path",
    boundary: "正式 videoSpec 仍使用 comparison + semanticPattern。",
    recommendedUse: "同一目标先绕路、再直达。",
  },
  {
    component: "VisualAnnotations",
    status: "production-validated",
    entry: "image-hero.annotations",
    boundary: "最多 3 个受控标注；框和箭头必须贴合关键对象。",
    recommendedUse: "大图框选、轻量指向、局部放大。",
  },
];

export const themeCapabilities: ThemeCapability[] = [
  {
    id: "xhs-white-editorial",
    status: "production-validated",
    role: "primary-production",
    boundary: "当前主生产白底知识解释主题。",
  },
  {
    id: "knowledge-blueprint",
    status: "production-validated",
    role: "primary-production",
    boundary: "系统结构、路径、关系图的主生产主题。",
  },
  {
    id: "testing-safety-alert",
    status: "semantic-enabled",
    role: "specialized-production",
    boundary: "适合风险、验证、安全边界，不要求所有语义 shot 首发适配。",
  },
  {
    id: "obsidian-claude-gradient",
    status: "semantic-enabled",
    role: "specialized-production",
    boundary: "适合深色技术感、代码和 Agent 主题。",
  },
  {
    id: "minimal-white",
    status: "legacy-support",
    role: "legacy-theme",
    boundary: "旧主题保留，不作为新语义组件首发适配目标。",
  },
  {
    id: "neo-brutalism",
    status: "legacy-support",
    role: "legacy-theme",
    boundary: "旧主题保留，不作为新语义组件首发适配目标。",
  },
  {
    id: "aurora",
    status: "legacy-support",
    role: "legacy-theme",
    boundary: "旧主题保留，不作为新语义组件首发适配目标。",
  },
  {
    id: "xhs-pastel-card",
    status: "legacy-support",
    role: "legacy-theme",
    boundary: "旧主题保留，不作为新语义组件首发适配目标。",
  },
];

export const productionSceneTypes = sceneCapabilities.map((item) => item.type);

export const productionSemanticPatterns = semanticPatternCapabilities.map(
  (item) => item.pattern,
);

export const semanticPatternHostTypes = semanticPatternCapabilities.reduce<
  Record<string, string[]>
>((acc, item) => {
  acc[item.pattern] = item.hostTypes;
  return acc;
}, {});
