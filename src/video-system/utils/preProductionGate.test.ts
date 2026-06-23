import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateReviewedInputDigest,
  evaluatePreProductionGate,
  evaluateStandardDualReview,
  validateContentSnapshotConsistency,
  validateVisualSnapshotConsistency,
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
  const dimensions = Object.entries(REQUIRED_DIMENSIONS).map(
    ([id, maxScore]) => ({
      id,
      score: maxScore,
      maxScore,
      evidence: ["verified"],
      gaps: [],
      action: "keep",
    }),
  );
  return {
    reviewerId,
    reviewerSystem:
      reviewerId === "viewer" ? "OpenAI GPT-5.5" : "Anthropic Claude",
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
  assert.match(
    result.blockingReasons.join("\n"),
    /two distinct reviewerSystem/,
  );
});

// --- V3.1 Standard Dual-Review Tests ---

test("standard dual-review passes with 2 reviews, 2 systems, GPT self-check, avg > 85", () => {
  const errors = evaluateStandardDualReview({
    reviews: [
      {
        reviewerId: "gpt-self",
        reviewerSystem: "OpenAI GPT-5.5",
        score: 88,
        recommendation: "pass",
        hardVetoes: [],
      },
      {
        reviewerId: "claude",
        reviewerSystem: "Anthropic Claude",
        score: 87,
        recommendation: "pass",
        hardVetoes: [],
      },
    ],
    candidateDigest: "a".repeat(64),
  });
  assert.equal(errors.length, 0);
});

test("standard dual-review blocks with only 1 review", () => {
  const errors = evaluateStandardDualReview({
    reviews: [
      {
        reviewerId: "gpt-self",
        reviewerSystem: "OpenAI GPT-5.5",
        score: 90,
        recommendation: "pass",
        hardVetoes: [],
      },
    ],
    candidateDigest: "a".repeat(64),
  });
  assert.ok(errors.some((e) => e.includes("at least 2 reviews")));
});

test("standard dual-review blocks when only 1 reviewerSystem", () => {
  const errors = evaluateStandardDualReview({
    reviews: [
      {
        reviewerId: "gpt1",
        reviewerSystem: "OpenAI GPT-5.5",
        score: 88,
        recommendation: "pass",
        hardVetoes: [],
      },
      {
        reviewerId: "gpt2",
        reviewerSystem: "OpenAI GPT-5.5",
        score: 87,
        recommendation: "pass",
        hardVetoes: [],
      },
    ],
    candidateDigest: "a".repeat(64),
  });
  assert.ok(errors.some((e) => e.includes("distinct reviewerSystem")));
});

test("standard dual-review blocks when no GPT self-check", () => {
  const errors = evaluateStandardDualReview({
    reviews: [
      {
        reviewerId: "claude1",
        reviewerSystem: "Anthropic Claude",
        score: 88,
        recommendation: "pass",
        hardVetoes: [],
      },
      {
        reviewerId: "claude2",
        reviewerSystem: "Google Gemini",
        score: 87,
        recommendation: "pass",
        hardVetoes: [],
      },
    ],
    candidateDigest: "a".repeat(64),
  });
  assert.ok(errors.some((e) => e.includes("GPT self-check")));
});

test("standard dual-review blocks when averageScore = 85 (not > 85)", () => {
  const errors = evaluateStandardDualReview({
    reviews: [
      {
        reviewerId: "gpt-self",
        reviewerSystem: "OpenAI GPT-5.5",
        score: 85,
        recommendation: "pass",
        hardVetoes: [],
      },
      {
        reviewerId: "claude",
        reviewerSystem: "Anthropic Claude",
        score: 85,
        recommendation: "pass",
        hardVetoes: [],
      },
    ],
    candidateDigest: "a".repeat(64),
  });
  assert.ok(errors.some((e) => e.includes("averageScore")));
});

test("standard dual-review blocks when minimumScore = 85 (not > 85)", () => {
  const errors = evaluateStandardDualReview({
    reviews: [
      {
        reviewerId: "gpt-self",
        reviewerSystem: "OpenAI GPT-5.5",
        score: 90,
        recommendation: "pass",
        hardVetoes: [],
      },
      {
        reviewerId: "claude",
        reviewerSystem: "Anthropic Claude",
        score: 85,
        recommendation: "pass",
        hardVetoes: [],
      },
    ],
    candidateDigest: "a".repeat(64),
  });
  assert.ok(errors.some((e) => e.includes("minimumScore")));
});

test("standard dual-review blocks when recommendation is not pass", () => {
  const errors = evaluateStandardDualReview({
    reviews: [
      {
        reviewerId: "gpt-self",
        reviewerSystem: "OpenAI GPT-5.5",
        score: 88,
        recommendation: "pass",
        hardVetoes: [],
      },
      {
        reviewerId: "claude",
        reviewerSystem: "Anthropic Claude",
        score: 87,
        recommendation: "revise",
        hardVetoes: [],
      },
    ],
    candidateDigest: "a".repeat(64),
  });
  assert.ok(errors.some((e) => e.includes("recommendation=revise")));
});

test("standard dual-review blocks when vetoes present", () => {
  const errors = evaluateStandardDualReview({
    reviews: [
      {
        reviewerId: "gpt-self",
        reviewerSystem: "OpenAI GPT-5.5",
        score: 88,
        recommendation: "pass",
        hardVetoes: [],
      },
      {
        reviewerId: "claude",
        reviewerSystem: "Anthropic Claude",
        score: 87,
        recommendation: "pass",
        hardVetoes: ["fatal flaw"],
      },
    ],
    candidateDigest: "a".repeat(64),
  });
  assert.ok(errors.some((e) => e.includes("vetoes")));
});

test("validateContentSnapshotConsistency blocks mismatched IDs", () => {
  const errors = validateContentSnapshotConsistency("CS-20260624-ab12", [
    "CS-20260624-ab12",
    "CS-20260624-xy99",
  ]);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /does not match/);
});

test("validateContentSnapshotConsistency passes with matching IDs", () => {
  const errors = validateContentSnapshotConsistency("CS-20260624-ab12", [
    "CS-20260624-ab12",
    "CS-20260624-ab12",
  ]);
  assert.equal(errors.length, 0);
});

test("validateVisualSnapshotConsistency blocks mismatched visualSnapshotId", () => {
  const errors = validateVisualSnapshotConsistency(
    "VS-20260624-ab12",
    "a".repeat(64),
    { visualSnapshotId: "VS-20260624-xy99", candidateDigest: "a".repeat(64) },
  );
  assert.ok(errors.some((e) => e.includes("visualSnapshotId")));
});

test("validateVisualSnapshotConsistency blocks mismatched candidateDigest", () => {
  const errors = validateVisualSnapshotConsistency(
    "VS-20260624-ab12",
    "a".repeat(64),
    { visualSnapshotId: "VS-20260624-ab12", candidateDigest: "b".repeat(64) },
  );
  assert.ok(errors.some((e) => e.includes("candidateDigest")));
});

// --- V3.1 Standard end-to-end gate test ---

function makeV31StandardReview(
  reviewerId: string,
  reviewerSystem: string,
  targetScore: number,
): IndependentReview {
  const entries = Object.entries(REQUIRED_DIMENSIONS);
  const totalMax = entries.reduce((s, [, m]) => s + m, 0);
  // Distribute targetScore proportionally, ensure exact sum
  let remaining = targetScore;
  const dimensions = entries.map(([id, maxScore], i) => {
    const isLast = i === entries.length - 1;
    const score = isLast
      ? remaining
      : Math.round((targetScore / totalMax) * maxScore);
    remaining -= score;
    return {
      id,
      score,
      maxScore,
      evidence: ["verified"],
      gaps: [],
      action: "keep",
    };
  });
  const actualScore = dimensions.reduce((sum, d) => sum + d.score, 0);
  return {
    reviewerId,
    reviewerSystem,
    role: "cold-viewer",
    independent: true,
    reviewedInputDigest: digest,
    score: actualScore,
    dimensions,
    hardVetoes: [],
    recommendation: "pass",
    reviewedAt: "2026-06-24T12:00:00+08:00",
    contentSnapshotId: "CS-20260624-ab12",
    visualSnapshotId: "VS-20260624-ab12",
    candidateDigest: "d".repeat(64),
  };
}

function makeV31StandardFile(): PreProductionReview {
  const reviews = [
    makeV31StandardReview("gpt-self", "OpenAI GPT-5.5", 88),
    makeV31StandardReview("claude", "Anthropic Claude", 87),
  ];
  const scores = reviews.map((r) => r.score);
  const meanScore =
    Math.round((scores.reduce((s, v) => s + v, 0) / scores.length) * 100) / 100;
  const sorted = [...scores].sort((a, b) => a - b);
  const medianScore =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);

  const dimensionMeans: Record<string, number> = {};
  for (const id of Object.keys(REQUIRED_DIMENSIONS)) {
    const values = reviews
      .map((r) => r.dimensions.find((d) => d.id === id)?.score)
      .filter((v): v is number => typeof v === "number");
    dimensionMeans[id] = values.length
      ? Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 100) /
        100
      : 0;
  }

  return {
    schemaVersion: "3.1",
    contractVersion: "3.1",
    projectId: "v31-demo",
    mode: "standard",
    contentSnapshotId: "CS-20260624-ab12",
    visualSnapshotId: "VS-20260624-ab12",
    candidateDigest: "d".repeat(64),
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
    reviews,
    consensus: {
      reviewedInputDigest: digest,
      meanScore,
      medianScore,
      minReviewerScore: minScore,
      scoreSpread: maxScore - minScore,
      dimensionMeans,
      passed: true,
      blockingReasons: [],
    },
    approval: {
      userDecision: "continue",
      approvedByUser: true,
      decisionNote: "approved",
      decidedAt: "2026-06-24T12:00:00+08:00",
    },
  };
}

test("v3.1 standard gate passes with 2 reviews from different systems via evaluatePreProductionGate", () => {
  const file = makeV31StandardFile();
  const result = evaluatePreProductionGate(file);
  assert.equal(
    result.passed,
    true,
    `blocking: ${result.blockingReasons.join(", ")}`,
  );
});

test("v3.1 standard gate does NOT require 4 roles like V2", () => {
  const file = makeV31StandardFile();
  // Only 2 reviews, no visual-audio-director — should still pass for V3.1 Standard
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, true);
  assert.ok(
    !result.blockingReasons.some((r) => r.includes("required reviewer role")),
  );
});

test("v3.1 standard gate blocks when review snapshot ID mismatches", () => {
  const file = makeV31StandardFile();
  file.reviews[1].contentSnapshotId = "CS-different";
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.ok(
    result.blockingReasons.some((r) => r.includes("contentSnapshotId")),
  );
});

test("v3.1 standard gate blocks when review candidateDigest mismatches", () => {
  const file = makeV31StandardFile();
  file.reviews[1].candidateDigest = "e".repeat(64);
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.ok(result.blockingReasons.some((r) => r.includes("candidateDigest")));
});

test("v3.1 standard gate blocks when only 1 review", () => {
  const file = makeV31StandardFile();
  file.reviews = [file.reviews[0]];
  // Also fix consensus
  file.consensus.meanScore = 88;
  file.consensus.medianScore = 88;
  file.consensus.minReviewerScore = 88;
  file.consensus.scoreSpread = 0;
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.ok(
    result.blockingReasons.some((r) => r.includes("at least 2 reviews")),
  );
});

test("v3.1 standard gate blocks when both reviews use same system", () => {
  const file = makeV31StandardFile();
  file.reviews[1].reviewerSystem = "OpenAI GPT-5.5";
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.ok(
    result.blockingReasons.some((r) => r.includes("distinct reviewerSystem")),
  );
});

test("v3.1 standard gate blocks when no GPT self-check", () => {
  const file = makeV31StandardFile();
  file.reviews[0].reviewerSystem = "Google Gemini";
  const result = evaluatePreProductionGate(file);
  assert.equal(result.passed, false);
  assert.ok(result.blockingReasons.some((r) => r.includes("GPT self-check")));
});
