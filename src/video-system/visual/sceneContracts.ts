/**
 * Scene Contracts
 *
 * 每种 scene type + visualRole 组合的视觉约束。
 * 用于 visualMetrics 风险检查。
 */

export interface SceneContract {
  sceneType: string;
  visualRole?: string;
  maxEqualWeightBlocks: number;
  minPrimaryAreaRatio: number;
  maxTitleLines: number;
  maxCaptionLines?: number;
  minProjectedTitlePx: number;
  minProjectedBodyPx?: number;
  needsEvidenceAnchor?: boolean;
  needsScreenshotSaveable?: boolean;
  allowedAnimations?: string[];
}

// ─── Knowledge Lab P1 强规则 ────────────────────────

const LAB_HOOK: SceneContract = {
  sceneType: "cover",
  visualRole: "hook",
  maxEqualWeightBlocks: 3,
  minPrimaryAreaRatio: 0.35,
  maxTitleLines: 2,
  minProjectedTitlePx: 22,
};

const LAB_MISTAKE: SceneContract = {
  sceneType: "two-column",
  visualRole: "conflict",
  maxEqualWeightBlocks: 4,
  minPrimaryAreaRatio: 0.35,
  maxTitleLines: 2,
  maxCaptionLines: 2,
  minProjectedTitlePx: 18,
  minProjectedBodyPx: 14,
};

const LAB_EVIDENCE: SceneContract = {
  sceneType: "comparison",
  visualRole: "evidence",
  maxEqualWeightBlocks: 4,
  minPrimaryAreaRatio: 0.35,
  maxTitleLines: 2,
  maxCaptionLines: 2,
  minProjectedTitlePx: 18,
  minProjectedBodyPx: 14,
  needsEvidenceAnchor: true,
};

const LAB_INSIGHT: SceneContract = {
  sceneType: "big-quote",
  visualRole: "insight",
  maxEqualWeightBlocks: 2,
  minPrimaryAreaRatio: 0.3,
  maxTitleLines: 3,
  minProjectedTitlePx: 16,
};

const LAB_RECAP: SceneContract = {
  sceneType: "big-quote",
  visualRole: "recap",
  maxEqualWeightBlocks: 2,
  minPrimaryAreaRatio: 0.3,
  maxTitleLines: 3,
  minProjectedTitlePx: 16,
};

const LAB_TEMPLATE: SceneContract = {
  sceneType: "todo-checklist",
  visualRole: "template",
  maxEqualWeightBlocks: 6,
  minPrimaryAreaRatio: 0.45,
  maxTitleLines: 2,
  minProjectedTitlePx: 18,
  minProjectedBodyPx: 12,
  needsScreenshotSaveable: true,
};

// ─── 通用 scene 默认规则 ────────────────────────────

const DEFAULT_COVER: SceneContract = {
  sceneType: "cover",
  maxEqualWeightBlocks: 3,
  minPrimaryAreaRatio: 0.35,
  maxTitleLines: 2,
  minProjectedTitlePx: 22,
};

const DEFAULT_BIG_QUOTE: SceneContract = {
  sceneType: "big-quote",
  maxEqualWeightBlocks: 2,
  minPrimaryAreaRatio: 0.3,
  maxTitleLines: 3,
  minProjectedTitlePx: 16,
};

const DEFAULT_TITLE_SUBTITLE: SceneContract = {
  sceneType: "title-subtitle",
  maxEqualWeightBlocks: 3,
  minPrimaryAreaRatio: 0.3,
  maxTitleLines: 2,
  minProjectedTitlePx: 18,
};

const DEFAULT_BULLETS: SceneContract = {
  sceneType: "bullets",
  maxEqualWeightBlocks: 6,
  minPrimaryAreaRatio: 0.35,
  maxTitleLines: 2,
  minProjectedTitlePx: 18,
  minProjectedBodyPx: 12,
};

const DEFAULT_COMPARISON: SceneContract = {
  sceneType: "comparison",
  maxEqualWeightBlocks: 4,
  minPrimaryAreaRatio: 0.35,
  maxTitleLines: 2,
  maxCaptionLines: 2,
  minProjectedTitlePx: 18,
  minProjectedBodyPx: 14,
};

const DEFAULT_TWO_COLUMN: SceneContract = {
  sceneType: "two-column",
  maxEqualWeightBlocks: 4,
  minPrimaryAreaRatio: 0.35,
  maxTitleLines: 2,
  maxCaptionLines: 2,
  minProjectedTitlePx: 18,
  minProjectedBodyPx: 14,
};

const DEFAULT_THREE_COLUMN: SceneContract = {
  sceneType: "three-column",
  maxEqualWeightBlocks: 6,
  minPrimaryAreaRatio: 0.35,
  maxTitleLines: 2,
  minProjectedTitlePx: 18,
  minProjectedBodyPx: 12,
};

const DEFAULT_PROS_CONS: SceneContract = {
  sceneType: "pros-cons",
  maxEqualWeightBlocks: 6,
  minPrimaryAreaRatio: 0.35,
  maxTitleLines: 2,
  minProjectedTitlePx: 18,
  minProjectedBodyPx: 12,
};

const DEFAULT_TODO_CHECKLIST: SceneContract = {
  sceneType: "todo-checklist",
  maxEqualWeightBlocks: 6,
  minPrimaryAreaRatio: 0.4,
  maxTitleLines: 2,
  minProjectedTitlePx: 18,
  minProjectedBodyPx: 12,
};

const DEFAULT_STAT_HIGHLIGHT: SceneContract = {
  sceneType: "stat-highlight",
  maxEqualWeightBlocks: 4,
  minPrimaryAreaRatio: 0.3,
  maxTitleLines: 2,
  minProjectedTitlePx: 18,
};

const DEFAULT_PROCESS_STEPS: SceneContract = {
  sceneType: "process-steps",
  maxEqualWeightBlocks: 5,
  minPrimaryAreaRatio: 0.35,
  maxTitleLines: 2,
  minProjectedTitlePx: 18,
  minProjectedBodyPx: 12,
};

const DEFAULT_FLOW_DIAGRAM: SceneContract = {
  sceneType: "flow-diagram",
  maxEqualWeightBlocks: 6,
  minPrimaryAreaRatio: 0.35,
  maxTitleLines: 2,
  minProjectedTitlePx: 18,
};

const DEFAULT_ROADMAP: SceneContract = {
  sceneType: "roadmap",
  maxEqualWeightBlocks: 6,
  minPrimaryAreaRatio: 0.35,
  maxTitleLines: 2,
  minProjectedTitlePx: 18,
};

const DEFAULT_TIMELINE: SceneContract = {
  sceneType: "timeline",
  maxEqualWeightBlocks: 6,
  minPrimaryAreaRatio: 0.35,
  maxTitleLines: 2,
  minProjectedTitlePx: 18,
};

const DEFAULT_MINDMAP: SceneContract = {
  sceneType: "mindmap",
  maxEqualWeightBlocks: 6,
  minPrimaryAreaRatio: 0.3,
  maxTitleLines: 2,
  minProjectedTitlePx: 18,
};

const DEFAULT_SECTION_DIVIDER: SceneContract = {
  sceneType: "section-divider",
  maxEqualWeightBlocks: 2,
  minPrimaryAreaRatio: 0.2,
  maxTitleLines: 2,
  minProjectedTitlePx: 22,
};

const DEFAULT_CTA: SceneContract = {
  sceneType: "cta",
  maxEqualWeightBlocks: 3,
  minPrimaryAreaRatio: 0.3,
  maxTitleLines: 2,
  minProjectedTitlePx: 22,
};

const DEFAULT_CODE: SceneContract = {
  sceneType: "code",
  maxEqualWeightBlocks: 2,
  minPrimaryAreaRatio: 0.4,
  maxTitleLines: 2,
  minProjectedTitlePx: 18,
  minProjectedBodyPx: 12,
  allowedAnimations: ["progressive-reveal", "highlight-current"],
};

const DEFAULT_DIFF: SceneContract = {
  sceneType: "diff",
  maxEqualWeightBlocks: 4,
  minPrimaryAreaRatio: 0.4,
  maxTitleLines: 2,
  minProjectedTitlePx: 18,
  minProjectedBodyPx: 12,
  allowedAnimations: ["progressive-reveal", "highlight-current"],
};

const DEFAULT_TERMINAL: SceneContract = {
  sceneType: "terminal",
  maxEqualWeightBlocks: 3,
  minPrimaryAreaRatio: 0.4,
  maxTitleLines: 2,
  minProjectedTitlePx: 18,
  minProjectedBodyPx: 12,
  allowedAnimations: ["progressive-reveal", "highlight-current"],
};

const DEFAULT_IMAGE_HERO: SceneContract = {
  sceneType: "image-hero",
  maxEqualWeightBlocks: 4,
  minPrimaryAreaRatio: 0.5,
  maxTitleLines: 2,
  maxCaptionLines: 2,
  minProjectedTitlePx: 18,
  minProjectedBodyPx: 12,
  needsEvidenceAnchor: true,
  allowedAnimations: ["progressive-reveal", "highlight-current"],
};

const DEFAULT_GANTT: SceneContract = {
  sceneType: "gantt",
  maxEqualWeightBlocks: 5,
  minPrimaryAreaRatio: 0.45,
  maxTitleLines: 2,
  minProjectedTitlePx: 18,
  minProjectedBodyPx: 12,
  allowedAnimations: ["progressive-reveal", "highlight-current"],
};

// ─── 合约注册表 ─────────────────────────────────────

const ALL_CONTRACTS: SceneContract[] = [
  // Knowledge Lab P1
  LAB_HOOK,
  LAB_MISTAKE,
  LAB_EVIDENCE,
  LAB_INSIGHT,
  LAB_RECAP,
  LAB_TEMPLATE,
  // 通用默认
  DEFAULT_COVER,
  DEFAULT_BIG_QUOTE,
  DEFAULT_TITLE_SUBTITLE,
  DEFAULT_BULLETS,
  DEFAULT_COMPARISON,
  DEFAULT_TWO_COLUMN,
  DEFAULT_THREE_COLUMN,
  DEFAULT_PROS_CONS,
  DEFAULT_TODO_CHECKLIST,
  DEFAULT_STAT_HIGHLIGHT,
  DEFAULT_PROCESS_STEPS,
  DEFAULT_FLOW_DIAGRAM,
  DEFAULT_ROADMAP,
  DEFAULT_TIMELINE,
  DEFAULT_MINDMAP,
  DEFAULT_SECTION_DIVIDER,
  DEFAULT_CTA,
  DEFAULT_CODE,
  DEFAULT_DIFF,
  DEFAULT_TERMINAL,
  DEFAULT_IMAGE_HERO,
  DEFAULT_GANTT,
];

/**
 * 根据 sceneType 和 visualRole 查找合约
 * 优先匹配 visualRole（Lab 规则），回退到通用默认
 */
export function getSceneContract(
  sceneType: string,
  visualRole?: string,
): SceneContract {
  // 优先精确匹配 visualRole
  if (visualRole) {
    const exact = ALL_CONTRACTS.find(
      (c) => c.sceneType === sceneType && c.visualRole === visualRole,
    );
    if (exact) return exact;
  }
  // 回退到无 visualRole 的默认
  const fallback = ALL_CONTRACTS.find(
    (c) => c.sceneType === sceneType && !c.visualRole,
  );
  if (!fallback) {
    console.warn(
      `[sceneContracts] 未找到 sceneType="${sceneType}" 的合约，使用 DEFAULT_COVER`,
    );
  }
  return fallback ?? DEFAULT_COVER;
}

/**
 * 获取合约的唯一键（用于 visualMetrics 报告）
 */
export function contractKey(contract: SceneContract): string {
  return contract.visualRole
    ? `${contract.sceneType}:${contract.visualRole}`
    : contract.sceneType;
}
