import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateReviewedInputDigest,
  evaluatePreProductionGate,
  type IndependentReview,
  type PreProductionReview,
  REQUIRED_DIMENSIONS,
} from "./preProductionGate";

const inputs = [
  { id: "contentBrief", path: "content.json", sha256: "a".repeat(64) },
  { id: "videoSpec", path: "video.json", sha256: "b".repeat(64) },
  { id: "coverBrief", path: "cover.json", sha256: "c".repeat(64) },
];
const digest = calculateReviewedInputDigest(inputs);

function makeReview(
  reviewerId: string,
  role: IndependentReview["role"],
): IndependentReview {
  const dimensions = Object.entries(REQUIRED_DIMENSIONS).map(([id, maxScore]) => ({
    id,
    score: maxScore,
    maxScore,
    evidence: ["verified"],
    gaps: [],
    action: "keep",
  }));
  return {
    reviewerId,
    reviewerSystem: reviewerId === "viewer" ? "OpenAI GPT-5.5" : "Anthropic Claude",
    role,
    independent: true,
    reviewedInputDigest: digest,
    score: 100,
    dimensions,
    hardVetoes: [],
    recommendation: "pass",
    reviewedAt: "2026-06-23T12:00:00+08:00",
  };
}

function makeFile(): PreProductionReview {
  return {
    schemaVersion: "2.0",
    projectId: "demo",
    mode: "quick",
    contentBriefPath: "content.json",
    reviewedInputs: inputs,
    scopeContract: {
      corePromise: "Explain one verified question",
      targetDepth: "decision",
      mustAnswer: ["What changed?"],
      shouldAnswer: [],
      explicitlyOutOfScope: [],
      followUpDestination: [],
      splitDecision: "single",
    },
    reviews: [
      makeReview("viewer", "cold-viewer"),
      makeReview("editor", "content-editor"),
      makeReview("fact", "fact-evidence"),
    ],
    consensus: {
      reviewedInputDigest: digest,
      meanScore: 100,
      medianScore: 100,
      minReviewerScore: 100,
      scoreSpread: 0,
      dimensionMeans: { ...REQUIRED_DIMENSIONS },
      passed: true,
      blockingReasons: [],
    },
    approval: {
      userDecision: "continue",
      approvedByUser: true,
      decisionNote: "approved",
      decidedAt: "2026-06-23T12:00:00+08:00",
    },
  };
}

test("pre-production gate passes complete independent reviews", () => {
  const result = evaluatePreProductionGate(makeFile());
  assert.equal(result.passed, true);
  assert.equal(result.calculated.meanScore, 100);
});

test("pre-production gate blocks a hard veto", () => {
  const file = makeFile();
  file.reviews[1].hardVetoes.push("unsupported core claim");
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /hard veto/);
});

test("pre-production gate blocks missing user approval", () => {
  const file = makeFile();
  file.approval.userDecision = "pending";
  file.approval.approvedByUser = false;
  file.approval.decidedAt = null;
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /user approval/);
});

test("pre-production gate blocks reviewers who reviewed another snapshot", () => {
  const file = makeFile();
  file.reviews[0].reviewedInputDigest = "d".repeat(64);
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /reviewedInputDigest/);
});

test("pre-production gate blocks score spread above eight points", () => {
  const file = makeFile();
  file.reviews[0].dimensions[0].score = 3;
  file.reviews[0].score = 91;
  file.consensus.meanScore = 97;
  file.consensus.medianScore = 100;
  file.consensus.minReviewerScore = 91;
  file.consensus.scoreSpread = 9;
  file.consensus.dimensionMeans["audience-pain"] = 9;
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /spread/);
});


test("pre-production gate requires at least two distinct reviewer systems", () => {
  const file = makeFile();
  for (const review of file.reviews) review.reviewerSystem = "Same Model";
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /two distinct reviewerSystem/);
});
