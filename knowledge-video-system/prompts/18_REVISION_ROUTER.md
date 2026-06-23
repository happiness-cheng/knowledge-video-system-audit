# 18 — 审片后 Revision Router

## 目标

发现问题后，先判断问题来源，再修改最小真源。禁止看到画面问题就直接改组件，也禁止看到内容问题只改字幕或动效。

---

## 一、路由原则

```text
症状
→ 根因层
→ 唯一真源
→ 最小修改范围
→ 重新生成下游产物
→ 只回归受影响链路
```

优先修改最上游且真正造成问题的文件。下游生成物不得手工修补以掩盖上游错误。

---

## 二、问题类型与修改入口

| 问题 | 常见根因 | 首要修改真源 | 不要先改 |
|---|---|---|---|
| 观众不关心、痛点弱 | 受众角度错误 | contentBrief.audienceStrategy / Scope Contract | Remotion 组件 |
| 标题吸引但正文没兑现 | 承诺范围错误 | Scope Contract / Coverage Map / 口播结构 | 封面美术 |
| 核心事实错误 | 证据或命题错误 | Fact Evidence Map / contentBrief / voiceover | 字幕措辞 |
| 开场无聊 | Hook 机制、第一事件、承诺错误 | attentionBeats / S01-S03 口播与 visual event | 全局主题 |
| 中段重复、拖沓 | 信息增量不足 | narrativeDesign / videoSpec scene 合并拆分 | 转场速度 |
| 口播像 AI 稿 | voiceover / spokenText 写法 | videoSpec.voiceover / spokenText | TTS 音色 |
| 画面没参与讲解 | visual event 不成立 | scene 级 visualDirection / scene type / semanticPattern | 加装饰动画 |
| 画面意图成立但组件做不到 | 能力缺口 | capability preflight → component / generated asset | 强行塞现有字段 |
| 图片裁切、框错 | 素材映射或几何错误 | assetManifest / assetLayout / annotation | contentBrief |
| 字幕断句或遮挡 | 字幕生成或布局 | spokenText / subtitle script / SubtitleOverlay | 口播观点 |
| 发音错误、节奏机械 | TTS 文本或语音配置 | spokenText / glossary / audio config | 画面时长硬改 |
| 封面点击弱 | 封面承诺或视觉事件弱 | coverBrief + GPT Image prompt | Remotion cover fallback |
| 技术报错 | 源码、schema、路径 | component / validator / media helper | 内容稿 |
| 审片问题不确定 | 证据不足 | 补连续播放、音频、帧或手机端证据 | 立即修改 |

---

## 三、强制诊断问题

每个问题必须先回答：

1. 这是内容、事实、结构、口播、视觉意图、实现、素材、音频、字幕还是包装问题？
2. 问题第一次在哪个上游文件中出现？
3. 修改该文件会影响哪些下游产物？
4. 是否能只改一个 scene / 一个段落 / 一个素材映射？
5. 哪些文件明确不能动？
6. 需要哪种回归：文本、事实、类型、Studio、音频、字幕、手机端还是全片？

无法回答时，先补证据，不得盲改。

---

## 四、revisionDecision.json

```json
{
  "schemaVersion": "1.0",
  "sourceReview": "审片报告路径或说明",
  "issues": [
    {
      "issueId": "R01",
      "symptom": "观众看到的问题",
      "severity": "inspect | revise | veto",
      "rootCauseLayer": "audience | scope | fact | structure | voiceover | visual-direction | component | asset | audio | subtitle | cover | metadata",
      "primarySource": "要修改的唯一真源",
      "secondarySources": ["修改后需要重新生成的下游文件"],
      "doNotTouch": ["本轮禁止修改的文件或模块"],
      "change": "最小修改要求",
      "acceptance": "如何证明已经修好",
      "regression": ["需要运行的检查"]
    }
  ],
  "routingSummary": {
    "primarySource": "主要根因文件",
    "secondarySources": [],
    "doNotTouch": [],
    "reason": "为什么从这里改"
  },
  "approval": {
    "userDecision": "pending | revise | split | stop | continue",
    "approvedByUser": false,
    "decisionNote": "",
    "decidedAt": null
  }
}
```

Agent 只能执行用户明确批准的 issue，不能把审片报告中的所有建议一次性混改。

---

## 五、重新审查范围

- 改 audience / scope / fact：回到制作前多方审查，原分数作废。
- 改完整口播结构：重新确认 spokenText，再生成 TTS 和字幕。
- 只改一个 scene 的视觉实现：回归该 scene、相邻转场和手机端关键帧。
- 改组件或主题 token：运行全部 fixtures，并检查非目标分支。
- 改素材几何：只回归对应 scene 的原尺寸、mobile scaled 和带字幕版本。
- 改封面：重新审查点击承诺与正文一致性，不要求重做视频。

---

## 六、禁止事项

- 不用调快动画掩盖内容拖沓。
- 不用大字和强色掩盖痛点不成立。
- 不用字幕改写掩盖口播不自然。
- 不用新增组件解决本可通过内容重写解决的问题。
- 不因一个局部问题改全局 theme、renderer 或正式 schema。
- 不把 Agent 的技术 pass 当作作品通过。
