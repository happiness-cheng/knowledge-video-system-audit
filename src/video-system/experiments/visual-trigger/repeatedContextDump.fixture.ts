import { REPEATED_CONTEXT_REVIEW_FRAMES } from "./repeatedContextDump.constants";

export const repeatedContextDumpFixture = {
  compositionId: "AudienceValidationRepeatedContextDumpShot",
  purpose: "validate-clear-real-pain-visual-trigger",
  reviewFrames: REPEATED_CONTEXT_REVIEW_FRAMES,
  manualReviewQuestions: [
    "第一帧是否能看懂这是 AI Coding 聊天？",
    "1 秒内是否知道 AI 又在追问上下文？",
    "2-3 秒是否有被重复解释压住的烦躁感？",
    "静音无字幕是否能看懂大概事件？",
    "是否比项目城市更像目标观众会停下来的开场？",
  ],
} as const;

