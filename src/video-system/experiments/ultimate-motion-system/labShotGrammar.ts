// ─── V2 Shot Grammar 定义 ─────────────────────────────

export interface ShotGrammarDef {
  id: string;
  name: string;
  applicableContent: string;
  visualCenter: string;
  entryStrategy: string;
  activeState: string;
  continuousMotion: string;
  forbidden: string;
  migrationCondition: string;
}

export const shotGrammarRegistry: ShotGrammarDef[] = [
  {
    id: "hook",
    name: "Hook Shot",
    applicableContent: "痛点开场、误判开场",
    visualCenter: "主标题分层入场",
    entryStrategy: "spring 入场，第一行先到第二行后到",
    activeState: "标题 breathing",
    continuousMotion: "背景 drift，标题轻微呼吸",
    forbidden: "PPT 标题页、空白第一帧",
    migrationCondition: "可直接迁回，使用 spring + fadeSlide",
  },
  {
    id: "mistake",
    name: "Mistake Shot",
    applicableContent: "错误现场、模糊提问对比",
    visualCenter: "左右卡片 cue 切换",
    entryStrategy: "fadeSlide 入场，cue 驱动 active 切换",
    activeState: "director cue 驱动，左→右",
    continuousMotion: "active 卡片 lift，非 active 降权",
    forbidden: "普通双栏 PPT、无差异的左右等权",
    migrationCondition: "需接入 resolveActiveTarget",
  },
  {
    id: "setup",
    name: "Experiment Setup Shot",
    applicableContent: "变量改变、实验设计",
    visualCenter: "步骤逐步出现",
    entryStrategy: "staggerReveal 逐个入场",
    activeState: "当前步骤高亮，编号+背景强化",
    continuousMotion: "步骤逐步出现，旧步骤保持可见",
    forbidden: "一步到位的静态列表",
    migrationCondition: "可直接迁回，使用 progressiveReveal",
  },
  {
    id: "evidence",
    name: "Evidence Shot",
    applicableContent: "截图对比、前后对比",
    visualCenter: "左右证据 cue 切换 + 结论",
    entryStrategy: "fadeSlide 入场，cue 驱动证据 active",
    activeState: "director cue 驱动，左证据→右证据→结论",
    continuousMotion: "active 证据 lift，边框高亮",
    forbidden: "乱框、截图太小、无标签",
    migrationCondition: "需接入 cue system + EvidencePanel",
  },
  {
    id: "insight",
    name: "Insight Shot",
    applicableContent: "阶段结论、核心判断",
    visualCenter: "结论文字聚焦 + breathing",
    entryStrategy: "spring 入场，标签 breathing",
    activeState: "引言渐变色，标签轻微呼吸",
    continuousMotion: "背景 glow，标签 breathing",
    forbidden: "励志海报、重复上一页",
    migrationCondition: "可直接迁回，使用 InsightPanel",
  },
  {
    id: "transfer",
    name: "Transfer Shot",
    applicableContent: "迁移证明、多场景验证",
    visualCenter: "三栏 cue 切换",
    entryStrategy: "fadeSlide 入场，cue 驱动栏 active",
    activeState: "director cue 驱动，第一栏→第二栏→第三栏收束",
    continuousMotion: "active 栏 lift，旧栏降权保持可读",
    forbidden: "三栏等权无差异",
    migrationCondition: "需接入 resolveActiveTarget",
  },
  {
    id: "template",
    name: "Template Shot",
    applicableContent: "可截图模板、行动清单",
    visualCenter: "模板项 progressive-retain",
    entryStrategy: "fadeSlide 逐项入场",
    activeState: "progressive-retain，最终全体稳定",
    continuousMotion: "当前项最亮，已激活保持较高可见性",
    forbidden: "普通 bullet 墙、无截图保存价值",
    migrationCondition: "需接入 progressive-retain + TemplatePanel",
  },
  {
    id: "cta",
    name: "CTA Shot",
    applicableContent: "行动号召、下一篇预告",
    visualCenter: "按钮 pulse",
    entryStrategy: "spring 入场 + fadeSlide",
    activeState: "按钮轻微脉冲",
    continuousMotion: "按钮呼吸脉冲",
    forbidden: "营销海报、多个按钮并列",
    migrationCondition: "可直接迁回，使用 MotionButton",
  },
];
