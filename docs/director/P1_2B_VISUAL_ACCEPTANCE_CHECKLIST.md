# P1-2B Visual Acceptance Checklist

本清单用于 Studio 人工检阅前的导演验收。它不是自动脚本结果。

## 全局

- [ ] 全片是否像一次实验过程，而不是方法论讲义。
- [ ] 每个 scene 是否只承担一个导演任务。
- [ ] 每个 scene 是否有第一视觉中心。
- [ ] 每个 scene 是否说明观众先看哪里、后看哪里。
- [ ] 是否避免连续静态页。
- [ ] evidence 页是否不依赖细读截图。
- [ ] HighlightBox 是否先有证据意图，而不是只有坐标。
- [ ] 方法页是否值得截图保存。
- [ ] CTA 是否接到下一篇“规则执行”。
- [ ] 是否没有引入未实现能力。
- [ ] 是否明确区分 DirectorSpec 理想动作和当前 renderer 支持能力。
- [ ] 根目录 `VISUAL_DIRECTION_SPEC.md` 与脚本读取路径不一致的问题是否已记录。

## S01 Hook Shot / Pain Scene

- [ ] 0.5 秒内能读懂“我一开始以为”。
- [ ] 是否像第一人称误判，而不是普通课程标题。
- [ ] 主标题和副标题是否主次清楚。
- [ ] 是否没有复杂截图。
- [ ] 是否没有“今天我们来聊”式开场。
- [ ] mobile scaled 下主标题是否一眼可读。

## S02 Mistake Shot

- [ ] 左侧是否像真实错误问法。
- [ ] 右侧是否体现“标准但没到点”。
- [ ] 是否只讲错误现场，不提前讲方法。
- [ ] 左右两栏是否有明确差异。
- [ ] 观众不读长文本也能看懂问题。
- [ ] 是否触发 `two-column + visualRole=conflict` 的已有 Knowledge Lab 变体。

## S03 Experiment Setup Shot

- [ ] 是否能看懂“同一个问题，只改问法”。
- [ ] 三个变量是否逐条出现。
- [ ] 是否没有直接给最终结论。
- [ ] 是否没有把 prompt morph 写成已支持能力。
- [ ] 三个步骤是否足够短。
- [ ] 是否为 S04 的结果证据建立因果前提。

## S04 Evidence Shot

- [ ] 左右变量是否清楚。
- [ ] 截图是否是主体，而不是附属背景。
- [ ] 不读截图小字是否能看懂差异。
- [ ] caption 是否最多 2 行。
- [ ] 高亮框是否有明确证据意图。
- [ ] 高亮坐标是否标记为需要 inspect，而不是假装精准。
- [ ] 是否没有超过每侧 2 个高亮框。
- [ ] 是否触发 `comparison + visualRole=evidence` 的已有 Knowledge Lab 变体。

## S05 Insight Shot

- [ ] 是否在证据之后出现。
- [ ] 金句是否短、大、强。
- [ ] 是否真正收束实验，而不是重复上一页。
- [ ] 是否给观众消化时间。
- [ ] mobile scaled 下是否 1 秒内可读。
- [ ] 是否触发 `big-quote + visualRole=insight` 的已有 Knowledge Lab 变体。

## S06 Transfer Shot

- [ ] 写文章场景是否说明“读者和目的”的作用。
- [ ] 学 TCP 场景是否说明“基础和目标”的作用。
- [ ] 第三栏是否收束共同规律。
- [ ] 是否不是只堆两个名词。
- [ ] 是否没有把方法说成万能。
- [ ] 三栏在 mobile scaled 下是否仍能读清。

## S07 Template Shot

- [ ] 是否像可截图保存的模板。
- [ ] 前三项是否是上下文变量。
- [ ] 第四项是否明确是输出要求。
- [ ] 是否不听口播也能照做。
- [ ] 是否不是普通 checklist。
- [ ] 是否触发 `todo-checklist + visualRole=template` 的已有 PromptTemplateCard 能力。

## S08 CTA Shot / Next Hook

- [ ] 是否先复述本集收益。
- [ ] 是否明确引出下一篇“按规则执行”。
- [ ] 是否不是只说收藏、点赞或关注。
- [ ] 是否没有重复 S07 的模板内容。
- [ ] 是否没有承诺当前未实现的 Claude Code 视觉能力。
- [ ] mobile scaled 下是否能读懂下一集方向。
