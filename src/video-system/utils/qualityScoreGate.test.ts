import test from "node:test";
import assert from "node:assert/strict";
import {
  QUALITY_DIMENSIONS,
  REQUIRED_RELEASE_HARD_GATES,
  validateQualityScoreV2,
} from "./qualityScoreGate";

function passingScore() {
  const dimensions = Object.entries(QUALITY_DIMENSIONS).map(([id, meta]) => ({
    id,
    name: meta.name,
    category: meta.category,
    score: meta.maxScore,
    maxScore: meta.maxScore,
    evidence: ["verified final artifact"],
    gaps: [],
    action: "keep",
  }));
  return {
    schemaVersion: "2.0",
    stage: "release",
    preProductionSnapshotDigest: "a".repeat(64),
    previewGate: {
      reviewer: "chatgpt",
      recommendation: "pass",
      keyRisks: [],
      userDecision: "continue",
      approvedByUser: true,
      decisionNote: "reviewed full video",
      decidedAt: "2026-06-23T12:00:00+08:00",
    },
    scoreRecommendation: "excellent",
    userDecision: "publish",
    approvedByUser: true,
    decisionNote: "approved for release",
    decidedAt: "2026-06-23T13:00:00+08:00",
    totalScore: 100,
    contentScore: 85,
    packagingScore: 15,
    hardGatePassed: true,
    dimensions,
    hardGates: REQUIRED_RELEASE_HARD_GATES.map((id) => ({
      id,
      name: id,
      passed: true,
      evidence: ["verified"],
      action: "keep",
    })),
    reviewSummary: { level: "excellent", nextAction: "publish" },
  };
}

test("release quality gate accepts a complete 90+ publish decision", () => {
  const errors = validateQualityScoreV2(passingScore(), {
    requirePublish: true,
    expectedPreProductionDigest: "a".repeat(64),
  });
  assert.deepEqual(errors, []);
});

test("release quality gate blocks scores below 90", () => {
  const score = passingScore();
  const target = score.dimensions.find((item) => item.id === "gain-value")!;
  target.score -= 11;
  score.contentScore -= 11;
  score.totalScore -= 11;
  score.hardGatePassed = false;
  const score90 = score.hardGates.find((item) => item.id === "score-90")!;
  score90.passed = false;
  const errors = validateQualityScoreV2(score, { requirePublish: true });
  assert.match(errors.join("\n"), /totalScore 89 < 90/);
});
