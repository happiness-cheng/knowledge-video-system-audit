// ─── V2 Director Cue 数据 ─────────────────────────────

export interface LabCue {
  cueId: string;
  spokenAnchor: string;
  target: string;
  startFrameEstimate: number;
  holdFrames: number;
  leadFrames: number;
  support: "draft-estimate" | "draft-director" | "reference-only";
}

export interface LabSceneCueData {
  sceneId: string;
  mode: "voiceover-cue" | "progressive-cue";
  highlightMode?: "strict-switch" | "progressive-retain";
  totalFrames: number;
  cues: LabCue[];
}

const LEAD = 10;
const DECAY = 15;

export { LEAD as LEAD_FRAMES, DECAY as DECAY_FRAMES };

export const labDirectorCues: LabSceneCueData[] = [
  {
    sceneId: "S02",
    mode: "voiceover-cue",
    totalFrames: 270,
    cues: [
      { cueId: "direct-ask", spokenAnchor: "我直接问", target: "left", startFrameEstimate: 0, holdFrames: 130, leadFrames: LEAD, support: "draft-estimate" },
      { cueId: "standard-answer", spokenAnchor: "答案很标准", target: "right", startFrameEstimate: 120, holdFrames: 150, leadFrames: LEAD, support: "draft-estimate" },
    ],
  },
  {
    sceneId: "S04",
    mode: "voiceover-cue",
    totalFrames: 360,
    cues: [
      { cueId: "before-evidence", spokenAnchor: "直接问", target: "left-evidence", startFrameEstimate: 10, holdFrames: 140, leadFrames: LEAD, support: "draft-estimate" },
      { cueId: "after-evidence", spokenAnchor: "补背景后", target: "right-evidence", startFrameEstimate: 150, holdFrames: 120, leadFrames: LEAD, support: "draft-estimate" },
      { cueId: "contrast-conclusion", spokenAnchor: "跟上", target: "contrast-conclusion", startFrameEstimate: 270, holdFrames: 90, leadFrames: LEAD, support: "reference-only" },
    ],
  },
  {
    sceneId: "S06",
    mode: "voiceover-cue",
    totalFrames: 390,
    cues: [
      { cueId: "writing-scene", spokenAnchor: "写文章", target: "column-0", startFrameEstimate: 10, holdFrames: 175, leadFrames: LEAD, support: "draft-estimate" },
      { cueId: "learning-scene", spokenAnchor: "学新概念", target: "column-1", startFrameEstimate: 185, holdFrames: 155, leadFrames: LEAD, support: "draft-estimate" },
      { cueId: "common-pattern", spokenAnchor: "视觉收束", target: "column-2", startFrameEstimate: 340, holdFrames: 50, leadFrames: LEAD, support: "draft-director" },
    ],
  },
  {
    sceneId: "S07",
    mode: "progressive-cue",
    highlightMode: "progressive-retain",
    totalFrames: 390,
    cues: [
      { cueId: "intro", spokenAnchor: "下次不要", target: "title", startFrameEstimate: 0, holdFrames: 60, leadFrames: LEAD, support: "draft-estimate" },
      { cueId: "situation", spokenAnchor: "我现在的情况", target: "item-0", startFrameEstimate: 50, holdFrames: 75, leadFrames: LEAD, support: "draft-estimate" },
      { cueId: "goal", spokenAnchor: "我想要的结果", target: "item-1", startFrameEstimate: 110, holdFrames: 75, leadFrames: LEAD, support: "draft-estimate" },
      { cueId: "constraint", spokenAnchor: "限制", target: "item-2", startFrameEstimate: 180, holdFrames: 80, leadFrames: LEAD, support: "draft-estimate" },
      { cueId: "output-request", spokenAnchor: "取舍", target: "item-3", startFrameEstimate: 270, holdFrames: 120, leadFrames: LEAD, support: "draft-estimate" },
    ],
  },
];

export function getLabSceneCues(sceneId: string): LabSceneCueData | undefined {
  return labDirectorCues.find((s) => s.sceneId === sceneId);
}
