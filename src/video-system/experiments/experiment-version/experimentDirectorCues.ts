// ─── 试验版导演 Cue 数据 ─────────────────────────────
// 独立于 P1_2I_DIRECTOR_CUES_DRAFT.json
// 基于 durationEstimate + spokenText 语义段估算

export interface DirectorCue {
  cueId: string;
  spokenAnchor: string;
  target: string;
  startFrameEstimate: number;
  holdFrames: number;
  leadFrames: number;
  support: "draft-estimate" | "draft-director" | "reference-only";
  motionIntent: string;
}

export interface SceneCueData {
  sceneId: string;
  mode: "voiceover-cue" | "progressive-cue";
  highlightMode?: "strict-switch" | "progressive-retain";
  totalFrames: number;
  cues: DirectorCue[];
}

const FPS = 30;
const LEAD_FRAMES = 10;
const DECAY_FRAMES = 15;

export { LEAD_FRAMES, DECAY_FRAMES };

export const experimentDirectorCues: SceneCueData[] = [
  // ─── S02: Mistake Shot ─────────────────────────────
  {
    sceneId: "S02",
    mode: "voiceover-cue",
    totalFrames: 270,
    cues: [
      {
        cueId: "direct-ask",
        spokenAnchor: "我直接问 / 帮我解释一下这个问题",
        target: "left",
        startFrameEstimate: 0,
        holdFrames: 130,
        leadFrames: LEAD_FRAMES,
        support: "draft-estimate",
        motionIntent:
          "口播'我直接问'时，左侧错误问法成为视觉中心。右侧尚未出现或刚入场。",
      },
      {
        cueId: "standard-answer",
        spokenAnchor: "它确实回答了 / 答案很标准 / 我反而更懵",
        target: "right",
        startFrameEstimate: 120,
        holdFrames: 150,
        leadFrames: LEAD_FRAMES,
        support: "draft-estimate",
        motionIntent:
          "口播'答案很标准/我反而更懵'时，右侧抽象结果接管视觉中心。左卡从 1.0 衰减到 0.65。",
      },
    ],
  },

  // ─── S04: Evidence Shot ─────────────────────────────
  {
    sceneId: "S04",
    mode: "voiceover-cue",
    totalFrames: 360,
    cues: [
      {
        cueId: "before-evidence",
        spokenAnchor: "直接问的时候 / 标准答案",
        target: "left-evidence",
        startFrameEstimate: 10,
        holdFrames: 140,
        leadFrames: LEAD_FRAMES,
        support: "draft-estimate",
        motionIntent:
          "口播'直接问/标准答案'时，左侧截图证据成为视觉中心。右证据弱化。",
      },
      {
        cueId: "after-evidence",
        spokenAnchor: "补背景后 / 生活例子解释",
        target: "right-evidence",
        startFrameEstimate: 150,
        holdFrames: 120,
        leadFrames: LEAD_FRAMES,
        support: "draft-estimate",
        motionIntent:
          "口播'补背景后/生活例子'时，右侧截图证据接管视觉中心。左证据衰减到 0.65。",
      },
      {
        cueId: "contrast-conclusion",
        spokenAnchor: "我一下就能跟上",
        target: "contrast-conclusion",
        startFrameEstimate: 270,
        holdFrames: 90,
        leadFrames: LEAD_FRAMES,
        support: "reference-only",
        motionIntent:
          "口播'跟上'时，对比结论区域成为视觉中心。此时左右证据同时稳定。",
      },
    ],
  },

  // ─── S06: Transfer Shot ─────────────────────────────
  {
    sceneId: "S06",
    mode: "voiceover-cue",
    totalFrames: 390,
    cues: [
      {
        cueId: "writing-scene",
        spokenAnchor: "写文章时 / 读者和目的",
        target: "column-0",
        startFrameEstimate: 10,
        holdFrames: 175,
        leadFrames: LEAD_FRAMES,
        support: "draft-estimate",
        motionIntent:
          "口播'写文章/读者和目的'时，第一栏 active。第二、三栏弱化。",
      },
      {
        cueId: "learning-scene",
        spokenAnchor: "学新概念时 / TCP / 基础和卡点",
        target: "column-1",
        startFrameEstimate: 185,
        holdFrames: 155,
        leadFrames: LEAD_FRAMES,
        support: "draft-estimate",
        motionIntent:
          "口播'学新概念/TCP'时，第二栏 active。第一栏衰减到 0.65，第三栏弱化。",
      },
      {
        cueId: "common-pattern",
        spokenAnchor: "（视觉收束）",
        target: "column-2",
        startFrameEstimate: 340,
        holdFrames: 50,
        leadFrames: LEAD_FRAMES,
        support: "draft-director",
        motionIntent:
          "口播接近结束时，第三栏作为规律收束出现。前两栏稳定在 0.65。",
      },
    ],
  },

  // ─── S07: Template Shot (progressive-retain) ─────────
  {
    sceneId: "S07",
    mode: "progressive-cue",
    highlightMode: "progressive-retain",
    totalFrames: 390,
    cues: [
      {
        cueId: "intro",
        spokenAnchor: "下次不要一上来就说帮我写一下",
        target: "title",
        startFrameEstimate: 0,
        holdFrames: 60,
        leadFrames: LEAD_FRAMES,
        support: "draft-estimate",
        motionIntent: "开场白，标题区域保持视觉中心。清单项尚未出现或刚入场。",
      },
      {
        cueId: "situation",
        spokenAnchor: "我现在的情况",
        target: "item-0",
        startFrameEstimate: 50,
        holdFrames: 75,
        leadFrames: LEAD_FRAMES,
        support: "draft-estimate",
        motionIntent:
          "口播'我现在的情况'时，第一行 active（最亮）。标题降权。其他项弱化。",
      },
      {
        cueId: "goal",
        spokenAnchor: "我想要的结果",
        target: "item-1",
        startFrameEstimate: 110,
        holdFrames: 75,
        leadFrames: LEAD_FRAMES,
        support: "draft-estimate",
        motionIntent:
          "口播'我想要的结果'时，第二行 active。item-0 保留较高可见性（progressive-retain）。",
      },
      {
        cueId: "constraint",
        spokenAnchor: "回答的限制",
        target: "item-2",
        startFrameEstimate: 180,
        holdFrames: 80,
        leadFrames: LEAD_FRAMES,
        support: "draft-estimate",
        motionIntent:
          "口播'限制'时，第三行 active。item-0/1 保留较高可见性。item-3 弱化。",
      },
      {
        cueId: "output-request",
        spokenAnchor: "几个方案 / 怎么取舍",
        target: "item-3",
        startFrameEstimate: 270,
        holdFrames: 120,
        leadFrames: LEAD_FRAMES,
        support: "draft-estimate",
        motionIntent:
          "口播'几个方案/取舍'时，第四行 active。前三行全部保留可见（progressive-retain），形成可截图模板。",
      },
    ],
  },
];

// ─── Cue 查询工具 ─────────────────────────────────────

/** 获取指定 scene 的 cue 数据 */
export function getSceneCues(sceneId: string): SceneCueData | undefined {
  return experimentDirectorCues.find((s) => s.sceneId === sceneId);
}

/**
 * resolveActiveTarget: 根据当前帧计算 active 目标
 *
 * 逻辑：
 * 1. 找到 startFrameEstimate - leadFrames <= frame 的最后一个 cue
 * 2. 该 cue 的 target 为当前 active
 * 3. 其他 target 按距离衰减
 * 4. progressive-retain 模式下，已激活过的 target 保持较高可见性
 */
export function resolveActiveTarget(
  frame: number,
  cues: DirectorCue[],
  decayFrames: number,
  mode: "strict-switch" | "progressive-retain" = "strict-switch",
): {
  activeTarget: string;
  targetOpacity: (target: string) => number;
} {
  // 找当前 active cue
  let activeCue: DirectorCue | null = null;
  for (let i = cues.length - 1; i >= 0; i--) {
    const cue = cues[i];
    if (frame >= cue.startFrameEstimate - cue.leadFrames) {
      activeCue = cue;
      break;
    }
  }

  const activeTarget = activeCue?.target ?? cues[0]?.target ?? "";

  if (mode === "progressive-retain") {
    // progressive-retain: 已激活过的 target 保持较高可见性
    const activatedTargets = new Set<string>();
    for (const cue of cues) {
      if (frame >= cue.startFrameEstimate - cue.leadFrames) {
        activatedTargets.add(cue.target);
      }
    }

    return {
      activeTarget,
      targetOpacity: (target: string) => {
        if (target === activeTarget) return 1;
        if (activatedTargets.has(target)) {
          // 已激活过的：0.7-0.85，越早激活越暗
          const activationOrder = cues.findIndex(
            (c) => c.target === target,
          );
          const currentOrder = cues.findIndex(
            (c) => c.target === activeTarget,
          );
          const distance = Math.abs(currentOrder - activationOrder);
          return Math.max(0.7, 1 - distance * 0.08);
        }
        // 未激活的
        return 0.4;
      },
    };
  }

  // strict-switch 模式
  return {
    activeTarget,
    targetOpacity: (target: string) => {
      if (target === activeTarget) return 1;
      // 找 target 在 cues 中的位置
      const targetIndex = cues.findIndex((c) => c.target === target);
      const activeIndex = cues.findIndex(
        (c) => c.target === activeTarget,
      );
      if (targetIndex < 0 || activeIndex < 0) return 0.4;
      const distance = Math.abs(targetIndex - activeIndex);
      if (distance === 1) return 0.65;
      return 0.4;
    },
  };
}
