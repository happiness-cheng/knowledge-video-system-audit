// ─── V2 Lab 内容数据 ─────────────────────────────────

export interface LabScene {
  id: string;
  shotType: string;
  durationEstimate: number;
  [key: string]: unknown;
}

export const labContent = {
  meta: { title: "Ultimate Motion System Lab", fps: 30, width: 1920, height: 1080 },
  scenes: [
    { id: "S01", shotType: "hook", durationEstimate: 3, title: "我一开始以为", subtitle: "是 AI 不够聪明", spokenText: "我一开始以为，AI 回答不到点，是因为它不够聪明。" },
    { id: "S02", shotType: "mistake", durationEstimate: 9, title: "错误现场", leftTitle: "我直接问", leftItems: ["帮我解释一下这个问题", "没说我懂到哪", "没说我想拿去干嘛"], rightTitle: "结果是", rightItems: ["回答很标准", "术语很多", "我反而更懵"], spokenText: "比如我直接问，帮我解释一下这个问题。它确实回答了，但答案很标准，我反而更懵。" },
    { id: "S03", shotType: "setup", durationEstimate: 10, title: "同题实验", subtitle: "同一个问题，我只改了三件事", steps: ["补背景", "说目标", "加限制"], spokenText: "后来我换了一个做法。同一个问题，我只改问法：先说明我完全不了解，再说希望用生活例子解释，最后加一句不要堆术语。" },
    { id: "S04", shotType: "evidence", durationEstimate: 12, title: "结果真的变了", leftLabel: "直接问", leftCaption: "标准，但不贴我的理解状态", rightLabel: "补背景后", rightCaption: "具体，开始按我的目标解释", conclusion: "补背景后，回答变具体了", spokenText: "结果差别很明显。直接问的时候，它给的是标准答案；补背景后，它开始用生活例子解释，我一下就能跟上。" },
    { id: "S05", shotType: "insight", durationEstimate: 5, quote: "AI 没变\n变的是你给的信息", subtitle: "不是模型突然变聪明", spokenText: "这时我才反应过来，AI 没变，问题也没变，真正变的是我给它的信息。" },
    { id: "S06", shotType: "transfer", durationEstimate: 13, title: "换场景也一样", columns: [{ title: "写文章", text: "它需要知道读者是谁，以及你想要什么语气" }, { title: "学新概念", text: "它需要知道你的基础，以及你卡在哪一步" }, { title: "共同规律", text: "你给得越具体，它越接近你的目标" }], spokenText: "这个规律不只适用于概念解释。写文章时，它需要知道读者和目的；学新概念时，它需要知道你的基础和卡点。" },
    { id: "S07", shotType: "template", durationEstimate: 13, title: "下次这样问", templateItems: ["我现在的情况是：____", "我想得到的结果是：____", "我的限制条件是：____", "给 2-3 个方案，并说取舍"], spokenText: "所以，下次不要一上来就说帮我写一下。先写清楚三件事：我现在的情况，我想要的结果，还有这次回答的限制。最后再说明，你要几个方案，以及希望它怎么取舍。" },
    { id: "S08", shotType: "cta", durationEstimate: 6, title: "让 AI 理解你之后", subtitle: "下一步，是让它按规则执行", actionText: "下一篇：规则执行", spokenText: "让 AI 理解你，只是第一步。下一步，是让它按规则稳定执行。这就是下一篇要解决的问题。" },
    // Gallery scenes
    { id: "G01", shotType: "component-gallery", durationEstimate: 15, title: "Component Gallery" },
    { id: "G02", shotType: "motion-gallery", durationEstimate: 12, title: "Motion Primitives" },
    { id: "G03", shotType: "evidence-gallery", durationEstimate: 15, title: "Evidence Variants" },
    { id: "G04", shotType: "template-gallery", durationEstimate: 12, title: "Template Variants" },
    { id: "G05", shotType: "title-gallery", durationEstimate: 12, title: "Title Variants" },
    { id: "G06", shotType: "transition-gallery", durationEstimate: 15, title: "Transitions" },
    { id: "G07", shotType: "mobile-gallery", durationEstimate: 10, title: "Mobile Readability" },
  ] as LabScene[],
} as const;

export function secondsToFrames(s: number, fps = 30) { return Math.ceil(s * fps); }
export function getSceneFrames(id: string): number {
  const s = labContent.scenes.find((sc) => sc.id === id);
  if (!s) throw new Error(`Scene ${id} not found`);
  return secondsToFrames(s.durationEstimate);
}
export const TRANSITION_FRAMES = 12;
export function getTotalFrames(): number {
  const sf = labContent.scenes.reduce((sum, s) => sum + secondsToFrames(s.durationEstimate), 0);
  return sf + (labContent.scenes.length - 1) * TRANSITION_FRAMES;
}
