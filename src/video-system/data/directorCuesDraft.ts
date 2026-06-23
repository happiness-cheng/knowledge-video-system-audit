// ─── Director Cue Draft 数据 ─────────────────────────────
// 基于 P1_2I_DIRECTOR_CUES_DRAFT.json，本轮只放 S02 和 S07
// 这是 draft 版本，基于 durationEstimate 估算，非 audio-aligned

export type DirectorCueMode = "strict-switch" | "progressive-retain";

export type DirectorCue = {
  cueId: string;
  spokenAnchor: string;
  target: string;
  startFrameEstimate: number;
  holdFrames: number;
  leadFrames?: number;
  support: "draft-estimate" | "draft-director" | "reference-only";
};

export type SceneDirectorCues = {
  sceneId: string;
  mode: DirectorCueMode;
  leadFrames: number;
  decayFrames: number;
  minHoldFrames: number;
  cues: DirectorCue[];
};

export const directorCuesDraft: Record<string, SceneDirectorCues> = {
  S02: {
    sceneId: "S02",
    mode: "strict-switch",
    leadFrames: 10,
    decayFrames: 15,
    minHoldFrames: 45,
    cues: [
      {
        cueId: "direct-ask",
        spokenAnchor: "我直接问 / 帮我解释一下这个问题",
        target: "left",
        startFrameEstimate: 0,
        holdFrames: 130,
        leadFrames: 10,
        support: "draft-estimate",
      },
      {
        cueId: "standard-answer",
        spokenAnchor: "它确实回答了 / 答案很标准 / 我反而更懵",
        target: "right",
        startFrameEstimate: 120,
        holdFrames: 150,
        leadFrames: 10,
        support: "draft-estimate",
      },
    ],
  },

  S07: {
    sceneId: "S07",
    mode: "progressive-retain",
    leadFrames: 10,
    decayFrames: 15,
    minHoldFrames: 45,
    cues: [
      {
        cueId: "intro",
        spokenAnchor: "下次不要一上来就说帮我写一下",
        target: "title",
        startFrameEstimate: 0,
        holdFrames: 60,
        leadFrames: 10,
        support: "draft-estimate",
      },
      {
        cueId: "situation",
        spokenAnchor: "我现在的情况",
        target: "item-0",
        startFrameEstimate: 50,
        holdFrames: 75,
        leadFrames: 10,
        support: "draft-estimate",
      },
      {
        cueId: "goal",
        spokenAnchor: "我想要的结果",
        target: "item-1",
        startFrameEstimate: 110,
        holdFrames: 75,
        leadFrames: 10,
        support: "draft-estimate",
      },
      {
        cueId: "constraint",
        spokenAnchor: "回答的限制",
        target: "item-2",
        startFrameEstimate: 180,
        holdFrames: 80,
        leadFrames: 10,
        support: "draft-estimate",
      },
      {
        cueId: "output-request",
        spokenAnchor: "几个方案 / 怎么取舍",
        target: "item-3",
        startFrameEstimate: 270,
        holdFrames: 120,
        leadFrames: 10,
        support: "draft-estimate",
      },
    ],
  },
};
