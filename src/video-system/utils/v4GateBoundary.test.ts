/**
 * V4 Pre-Production Gate — 真实运行时边界测试
 *
 * 直接调用 evaluatePreProductionGate，不复制 Gate 算法。
 * 覆盖 14+ 边界场景。
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateReviewedInputDigest,
  evaluatePreProductionGate,
  type IndependentReview,
  type PreProductionReview,
  REQUIRED_DIMENSIONS,
} from "./preProductionGate";

// ─── 基础 fixture 工厂 ─────────────────────────────────

const inputs = [
  { id: "contentBrief", path: "content.json", sha256: "a".repeat(64) },
  { id: "videoSpec", path: "video.json", sha256: "b".repeat(64) },
  { id: "coverBrief", path: "cover.json", sha256: "c".repeat(64) },
];
const digest = calculateReviewedInputDigest(inputs);

function maxDimensions() {
  return Object.entries(REQUIRED_DIMENSIONS).map(([id, maxScore]) => ({
    id,
    score: maxScore,
    maxScore,
    evidence: ["verified"],
    gaps: [],
    action: "keep",
  }));
}

function makeReview(
  reviewerId: string,
  role: IndependentReview["role"],
  system: string,
  score = 100,
): IndependentReview {
  const dimensions = maxDimensions();
  return {
    reviewerId,
    reviewerSystem: system,
    role,
    independent: true,
    reviewedInputDigest: digest,
    score,
    dimensions,
    hardVetoes: [],
    recommendation: "pass",
    reviewedAt: "2026-06-24T12:00:00Z",
  };
}

function makeStandardFile(): PreProductionReview {
  const reviews = [
    makeReview("cv", "cold-viewer", "OpenAI GPT", 100),
    makeReview("ce", "content-editor", "Anthropic Claude", 100),
    makeReview("fe", "fact-evidence", "Google Gemini", 100),
    makeReview("vad", "visual-audio-director", "OpenAI GPT", 100),
  ];
  return {
    schemaVersion: "4.0",
    contractVersion: "4.0",
    projectId: "test-v4",
    mode: "standard",
    contentBriefPath: "content.json",
    reviewedInputs: inputs,
    scopeContract: {
      corePromise: "Test promise",
      targetDepth: "decision",
      mustAnswer: ["Q1"],
      shouldAnswer: [],
      explicitlyOutOfScope: [],
      followUpDestination: [],
      splitDecision: "single",
    },
    reviews,
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
      decidedAt: "2026-06-24T12:00:00Z",
    },
  };
}

// ─── 正向测试 ──────────────────────────────────────────

test("V4 gate passes with 4 valid standard reviews", () => {
  const result = evaluatePreProductionGate(makeStandardFile());
  assert.equal(result.passed, true);
  assert.equal(result.blockingReasons.length, 0);
});

// ─── 负向测试：角色与数量 ──────────────────────────────

test("V4 gate blocks with only 3 reviews (missing visual-audio-director)", () => {
  const file = makeStandardFile();
  file.reviews = file.reviews.filter((r) => r.role !== "visual-audio-director");
  file.consensus.meanScore = 100;
  file.consensus.medianScore = 100;
  file.consensus.minReviewerScore = 100;
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /visual-audio-director/);
});

test("V4 gate blocks with missing role (no fact-evidence)", () => {
  const file = makeStandardFile();
  file.reviews = file.reviews.filter((r) => r.role !== "fact-evidence");
  file.consensus.meanScore = 100;
  file.consensus.medianScore = 100;
  file.consensus.minReviewerScore = 100;
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /fact-evidence/);
});

test("V4 gate blocks with duplicate role", () => {
  const file = makeStandardFile();
  file.reviews[1].role = "cold-viewer"; // duplicate
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /unique/);
});

test("V4 gate blocks with duplicate reviewerId", () => {
  const file = makeStandardFile();
  file.reviews[1].reviewerId = "cv"; // duplicate
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /reviewerId.*unique/i);
});

// ─── 负向测试：reviewerSystem ──────────────────────────

test("V4 gate blocks when all reviewers use same system", () => {
  const file = makeStandardFile();
  for (const r of file.reviews) r.reviewerSystem = "Same Model";
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /distinct reviewerSystem/);
});

test("V4 gate blocks when system differs only by trailing whitespace", () => {
  const file = makeStandardFile();
  // trim() makes these "SameSystem" and "SameSystem" — only 1 distinct
  file.reviews[0].reviewerSystem = "SameSystem";
  file.reviews[1].reviewerSystem = "SameSystem ";
  file.reviews[2].reviewerSystem = "SameSystem";
  file.reviews[3].reviewerSystem = "SameSystem ";
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /distinct reviewerSystem/);
});

// ─── 负向测试：reviewedInputDigest ─────────────────────

test("V4 gate blocks when review has wrong reviewedInputDigest", () => {
  const file = makeStandardFile();
  file.reviews[0].reviewedInputDigest = "f".repeat(64);
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /reviewedInputDigest/);
});

// ─── 负向测试：分数阈值 ────────────────────────────────

test("V4 gate blocks when meanScore = 89.99", () => {
  const file = makeStandardFile();
  // Set 3 reviews to 90, 1 to 89.94 → mean = 89.985
  file.reviews[0].score = 89.94;
  file.reviews[0].dimensions[0].score = 5; // audience-pain: 12→5, -7
  file.reviews[1].score = 90;
  file.reviews[2].score = 90;
  file.reviews[3].score = 90;
  file.consensus.meanScore = 89.99;
  file.consensus.medianScore = 90;
  file.consensus.minReviewerScore = 89.94;
  file.consensus.scoreSpread = 0.06;
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /meanScore.*< 90/);
});

test("V4 gate blocks when medianScore = 89.99", () => {
  const file = makeStandardFile();
  // Adjust dimensions so score equals dimension sum
  file.reviews[0].dimensions[0].score = 3; // audience-pain 12→3, -9
  file.reviews[0].score = 91; // 100-9=91
  file.reviews[1].dimensions[0].score = 3;
  file.reviews[1].score = 91;
  file.reviews[2].score = 100;
  file.reviews[3].score = 100;
  // median of [91,91,100,100] = 95.5, but set 2 reviews to 91 and 2 to 89
  // to get median = 90 exactly, then adjust
  file.reviews[0].dimensions[0].score = 3; // -9 → 91
  file.reviews[0].score = 91;
  file.reviews[1].dimensions[0].score = 3;
  file.reviews[1].score = 91;
  file.reviews[2].dimensions[0].score = 1; // -11 → 89
  file.reviews[2].score = 89;
  file.reviews[3].dimensions[0].score = 1;
  file.reviews[3].score = 89;
  // median of [91,91,89,89] sorted = [89,89,91,91] → median = 90
  // To get median < 90, need e.g. [89,89,89,91] → median = 89
  file.reviews[2].dimensions[0].score = 3;
  file.reviews[2].score = 91;
  file.reviews[3].dimensions[0].score = 3;
  file.reviews[3].score = 91;
  // All 4 reviews at 91, median = 91. Need different approach.
  // Set 3 reviews to 89, 1 to 100: sorted [89,89,89,100] → median = 89
  file.reviews[0].dimensions[0].score = 1; // -11 → 89
  file.reviews[0].score = 89;
  file.reviews[1].dimensions[0].score = 1;
  file.reviews[1].score = 89;
  file.reviews[2].dimensions[0].score = 1;
  file.reviews[2].score = 89;
  file.reviews[3].score = 100;
  file.consensus.meanScore = 91.75;
  file.consensus.medianScore = 89;
  file.consensus.minReviewerScore = 89;
  file.consensus.scoreSpread = 11;
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /medianScore.*< 90/);
});

test("V4 gate blocks when minReviewerScore = 84.99", () => {
  const file = makeStandardFile();
  file.reviews[0].score = 84.99;
  file.reviews[1].score = 95;
  file.reviews[2].score = 95;
  file.reviews[3].score = 95;
  file.consensus.meanScore = 92.5;
  file.consensus.medianScore = 95;
  file.consensus.minReviewerScore = 84.99;
  file.consensus.scoreSpread = 10.01;
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /minReviewerScore.*< 85/);
});

test("V4 gate blocks when scoreSpread = 8.01", () => {
  const file = makeStandardFile();
  file.reviews[0].score = 91;
  file.reviews[3].score = 99.01;
  file.consensus.meanScore = 95;
  file.consensus.medianScore = 95;
  file.consensus.minReviewerScore = 91;
  file.consensus.scoreSpread = 8.01;
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /spread.*> 8/);
});

// ─── 负向测试：关键维度门槛 ────────────────────────────

test("V4 gate blocks when first15-retention mean < 13", () => {
  const file = makeStandardFile();
  // Set all reviews' first15-retention to 12 (below threshold 13)
  for (const r of file.reviews) {
    const dim = r.dimensions.find((d) => d.id === "first15-retention")!;
    dim.score = 12;
    r.score = 100 - 3; // 97
  }
  file.consensus.meanScore = 97;
  file.consensus.medianScore = 97;
  file.consensus.minReviewerScore = 97;
  file.consensus.dimensionMeans["first15-retention"] = 12;
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /first15-retention/);
});

test("V4 gate blocks when visual-explainability mean < 4", () => {
  const file = makeStandardFile();
  for (const r of file.reviews) {
    const dim = r.dimensions.find((d) => d.id === "visual-explainability")!;
    dim.score = 3;
    r.score = 100 - 2; // 98
  }
  file.consensus.meanScore = 98;
  file.consensus.medianScore = 98;
  file.consensus.minReviewerScore = 98;
  file.consensus.dimensionMeans["visual-explainability"] = 3;
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /visual-explainability/);
});

// ─── 负向测试：hardVetoes ──────────────────────────────

test("V4 gate blocks when any review has hardVetoes", () => {
  const file = makeStandardFile();
  file.reviews[2].hardVetoes = ["factual error in core claim"];
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /hard veto/);
});

// ─── 负向测试：recommendation ──────────────────────────

test("V4 gate blocks when any review recommendation is not pass", () => {
  const file = makeStandardFile();
  file.reviews[1].recommendation = "revise";
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /recommendation=revise/);
});

// ─── 负向测试：approval ────────────────────────────────

test("V4 execution gate blocks when approval is pending", () => {
  const file = makeStandardFile();
  file.approval.userDecision = "pending";
  file.approval.approvedByUser = false;
  file.approval.decidedAt = null;
  file.approval.decisionNote = "";
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /user approval/);
});

// ─── 负向测试：consensus 一致性 ────────────────────────

test("V4 gate blocks when stored consensus.meanScore differs from calculated", () => {
  const file = makeStandardFile();
  file.consensus.meanScore = 95; // actual is 100
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /consensus\.meanScore/);
});

test("V4 gate blocks when consensus.passed is false", () => {
  const file = makeStandardFile();
  file.consensus.passed = false;
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(result.blockingReasons.join("\n"), /consensus\.passed/);
});

// ─── 负向测试：score = dimension sum ───────────────────

test("V4 gate blocks when review score does not equal dimension sum", () => {
  const file = makeStandardFile();
  file.reviews[0].score = 999; // clearly wrong
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.match(
    result.blockingReasons.join("\n"),
    /does not equal dimension sum/,
  );
});
