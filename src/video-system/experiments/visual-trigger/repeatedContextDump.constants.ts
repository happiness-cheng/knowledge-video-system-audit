export const REPEATED_CONTEXT_DUMP_FPS = 30;
export const REPEATED_CONTEXT_DUMP_FRAMES = 120;

export const REPEATED_CONTEXT_TIMELINE = {
  userTaskEnd: 15,
  aiQuestionsEnd: 36,
  contextCardsEnd: 78,
  compressionEnd: 102,
  finalEnd: REPEATED_CONTEXT_DUMP_FRAMES,
} as const;

export const AI_QUESTIONS = [
  {
    id: "project",
    text: "这个项目是做什么的？",
    short: "项目背景？",
  },
  {
    id: "directory",
    text: "哪个目录能改？",
    short: "目录职责？",
  },
  {
    id: "verify",
    text: "改完怎么验证？",
    short: "验证路线？",
  },
] as const;

export const CONTEXT_CARDS = [
  {
    id: "background",
    label: "项目背景",
    text: "这是登录模块，不是注册流程",
    x: 150,
    y: 154,
    rotation: -7,
    color: "#38bdf8",
  },
  {
    id: "directory",
    label: "目录职责",
    text: "auth/ 只放认证逻辑",
    x: 1290,
    y: 150,
    rotation: 6,
    color: "#a78bfa",
  },
  {
    id: "forbidden",
    label: "禁区",
    text: "别动 billing 和 env",
    x: 104,
    y: 670,
    rotation: 8,
    color: "#fb7185",
  },
  {
    id: "test",
    label: "测试命令",
    text: "改完先跑 npm test",
    x: 1320,
    y: 686,
    rotation: -6,
    color: "#34d399",
  },
  {
    id: "style",
    label: "代码风格",
    text: "保持现有 hooks 写法",
    x: 760,
    y: 825,
    rotation: 4,
    color: "#fbbf24",
  },
] as const;

export const REPEATED_CONTEXT_REVIEW_FRAMES = [0, 24, 48, 78, 108] as const;

