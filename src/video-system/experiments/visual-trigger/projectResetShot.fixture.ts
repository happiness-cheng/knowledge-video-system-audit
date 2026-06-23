import { REVIEW_FRAMES } from "./projectResetShot.constants";

export const projectResetShotFixture = {
  compositionId: "AudienceValidationProjectResetShot",
  purpose: "validate-first-frame-visual-trigger",
  reviewFrames: REVIEW_FRAMES,
  manualReviewQuestions: [
    "第一帧是否已经有强视觉主体？",
    "第一秒是否感觉有重要事情即将发生？",
    "核心熄灭是否形成足够强的状态反转？",
    "红色错误路线是否自然制造悬念？",
    "静音无字幕时，是否愿意继续看下一秒？",
    "是否像作品级镜头，而不是科技背景模板？",
  ],
} as const;

