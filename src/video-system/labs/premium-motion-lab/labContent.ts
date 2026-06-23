// ─── 实验内容数据 ─────────────────────────────────────
// 独立于正式 videoSpec.json，用于 Premium Motion Lab 实验

export interface LabSceneData {
  id: string;
  durationEstimate: number; // 秒
  title?: string;
  subtitle?: string;
  quote?: string;
  keywords?: string[];
  // 对比/证据页
  leftTitle?: string;
  leftItems?: string[];
  rightTitle?: string;
  rightItems?: string[];
  conclusion?: string;
  // 模板页
  steps?: string[];
}

export const labContent = {
  meta: {
    title: "Premium Motion Lab 实验",
    fps: 30,
    width: 1920,
    height: 1080,
  },

  scenes: [
    {
      id: "S01",
      durationEstimate: 2.5,
      title: "你问 AI 的方式",
      subtitle: "可能一直在浪费时间",
    },
    {
      id: "S02",
      durationEstimate: 3.5,
      title: "模糊提问 vs 补背景",
      leftTitle: "你这样问",
      leftItems: ["回答抽象，听完更懵"],
      rightTitle: "应该这样问",
      rightItems: ["回答具体，一下能懂"],
    },
    {
      id: "S03",
      durationEstimate: 3.5,
      title: "同一个问题，结果不同",
      leftTitle: "直接问",
      leftItems: ["泛泛解释"],
      rightTitle: "补背景后",
      rightItems: ["具体可用"],
      conclusion: "变量变了，回答质量才变了",
    },
    {
      id: "S04",
      durationEstimate: 3.5,
      quote: "不是 AI 没懂你\n是你没给判断材料",
      subtitle: "问题不在模型，在提问方式",
    },
    {
      id: "S05",
      durationEstimate: 6,
      title: "四步提问法",
      steps: [
        "我现在是什么情况",
        "我想要什么结果",
        "有什么限制条件",
        "你给我 2-3 个方案",
      ],
    },
    {
      id: "S06",
      durationEstimate: 3,
      title: "下次问 AI 前",
      subtitle: "先套这四句话",
    },
  ] as LabSceneData[],
} as const;

// ─── 帧数计算 ────────────────────────────────────────

/** 秒转帧 */
export function secondsToFrames(seconds: number, fps = 30): number {
  return Math.ceil(seconds * fps);
}

/** 获取 scene 的帧数 */
export function getSceneFrames(sceneId: string): number {
  const scene = labContent.scenes.find((s) => s.id === sceneId);
  if (!scene) throw new Error(`Scene ${sceneId} not found`);
  return secondsToFrames(scene.durationEstimate);
}

/** 总帧数（含转场） */
export const TRANSITION_FRAMES = 12;
export function getTotalFrames(): number {
  const sceneFrames = labContent.scenes.reduce(
    (sum, s) => sum + secondsToFrames(s.durationEstimate),
    0,
  );
  const transitionFrames = (labContent.scenes.length - 1) * TRANSITION_FRAMES;
  return sceneFrames + transitionFrames;
}
