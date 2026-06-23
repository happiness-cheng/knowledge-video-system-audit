import test from "node:test";
import assert from "node:assert/strict";
import { buildDirectorCueResolution } from "./directorCueResolution";

test("buildDirectorCueResolution blocks frame ranges when audioTiming text is stale", () => {
  const result = buildDirectorCueResolution({
    fps: 30,
    draft: {
      version: "test",
      status: "semantic-draft",
      scenes: [
        {
          sceneId: "S02",
          mode: "strict-switch",
          purpose: "测试 cue",
          fallback: "fallback",
          cues: [
            {
              cueId: "S02-C01",
              spokenAnchor: "我直接问",
              activeTarget: "left",
              purpose: "突出左侧",
              visualSignals: ["tint"],
              motionIntent: "left active",
              timingStatus: "semantic-draft",
            },
            {
              cueId: "S02-C02",
              spokenAnchor: "答案很标准",
              activeTarget: "right",
              purpose: "突出右侧",
              visualSignals: ["border"],
              motionIntent: "right active",
              timingStatus: "semantic-draft",
            },
          ],
        },
      ],
    },
    videoSpec: {
      scenes: [
        {
          id: "S02",
          durationEstimate: 9,
          spokenText:
            "比如我直接问，帮我解释一下这个问题。它确实回答了，但答案很标准，我反而更懵。",
        },
      ],
    },
    audioTiming: {
      totalDuration: 5,
      segments: [
        {
          sceneId: "S02",
          start: 0,
          end: 5,
          duration: 5,
          text: "很多人一上来就说帮我写一下，但这些工具不知道你的上下文。",
        },
      ],
    },
    subtitles: [],
  });

  assert.equal(result.status, "blocked-stale-audioTiming");
  assert.equal(result.summary.rendererConsumable, false);
  assert.equal(result.summary.resolvedCueCount, 0);
  assert.equal(result.summary.unresolvedCueCount, 2);
  assert.equal(result.scenes[0].sceneTimingStatus, "inspect");
  const blockingReason = result.scenes[0].blockingReason;
  if (blockingReason === undefined) {
    assert.fail("blockingReason should be present for stale audioTiming");
  }
  assert.match(blockingReason, /does not match/);
  assert.deepEqual(
    result.scenes[0].cues.map((cue) => ({
      startFrame: cue.startFrame,
      endFrame: cue.endFrame,
      timingStatus: cue.timingStatus,
    })),
    [
      {
        startFrame: null,
        endFrame: null,
        timingStatus: "unresolved-stale-audioTiming",
      },
      {
        startFrame: null,
        endFrame: null,
        timingStatus: "unresolved-stale-audioTiming",
      },
    ],
  );
});
