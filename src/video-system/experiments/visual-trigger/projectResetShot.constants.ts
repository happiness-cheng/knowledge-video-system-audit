export const PROJECT_RESET_SHOT_FPS = 30;
export const PROJECT_RESET_SHOT_FRAMES = 120;

export const PROJECT_RESET_TIMELINE = {
  stableEnd: 18,
  triggerEnd: 30,
  outageEnd: 66,
  errorRouteEnd: 96,
  dayOneEnd: PROJECT_RESET_SHOT_FRAMES,
} as const;

export const COGNITION_CORE = {
  x: 960,
  y: 495,
  radius: 136,
};

export const PROJECT_BUILDINGS = [
  {
    id: "src",
    label: "src/",
    x: 430,
    y: 276,
    w: 178,
    h: 118,
    accent: "#60a5fa",
  },
  {
    id: "components",
    label: "components/",
    x: 670,
    y: 170,
    w: 216,
    h: 132,
    accent: "#38bdf8",
  },
  {
    id: "data",
    label: "data/",
    x: 1168,
    y: 172,
    w: 196,
    h: 126,
    accent: "#2dd4bf",
  },
  {
    id: "rules",
    label: "rules/",
    x: 1410,
    y: 300,
    w: 186,
    h: 114,
    accent: "#a78bfa",
  },
  {
    id: "tests",
    label: "tests/",
    x: 1238,
    y: 686,
    w: 214,
    h: 118,
    accent: "#34d399",
  },
  {
    id: "docs",
    label: "docs/",
    x: 518,
    y: 706,
    w: 196,
    h: 112,
    accent: "#fbbf24",
  },
  {
    id: "danger",
    label: "core/config",
    x: 1456,
    y: 636,
    w: 214,
    h: 128,
    accent: "#ef4444",
    danger: true,
  },
] as const;

export const KNOWLEDGE_PATHS = [
  {
    id: "src-core",
    d: "M608 335 C704 330 792 384 848 432 C884 462 910 480 960 495",
    label: "目录职责",
    labelX: 705,
    labelY: 376,
  },
  {
    id: "components-core",
    d: "M812 302 C836 354 876 404 918 454 C930 468 946 482 960 495",
    label: "组件边界",
    labelX: 804,
    labelY: 342,
  },
  {
    id: "data-core",
    d: "M1210 298 C1152 356 1072 420 1002 478 C986 490 974 494 960 495",
    label: "数据来源",
    labelX: 1114,
    labelY: 372,
  },
  {
    id: "rules-core",
    d: "M1410 360 C1280 364 1154 418 1018 480 C996 490 976 496 960 495",
    label: "禁区规则",
    labelX: 1254,
    labelY: 412,
  },
  {
    id: "tests-core",
    d: "M1240 705 C1168 642 1080 570 996 516 C982 506 970 500 960 495",
    label: "验证路线",
    labelX: 1134,
    labelY: 622,
  },
  {
    id: "docs-core",
    d: "M714 725 C770 650 846 574 922 512 C938 500 950 496 960 495",
    label: "历史判断",
    labelX: 778,
    labelY: 632,
  },
] as const;

export const ERROR_ROUTE = {
  id: "wrong-route",
  d: "M410 802 C542 718 654 708 764 760 C902 825 1020 700 1134 650 C1262 596 1370 650 1458 700",
  startLabel: "new context",
  dangerLabel: "危险区域",
};

export const REVIEW_FRAMES = [0, 24, 48, 78, 108] as const;

