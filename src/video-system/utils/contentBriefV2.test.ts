import test from "node:test";
import assert from "node:assert/strict";
import * as path from "node:path";
import { validateContentBriefV2 } from "./contentBriefV2";

const root = path.resolve(__dirname, "../../..");

function validBrief() {
  return {
    workflowMode: "quick",
    scopeContract: {
      corePromise: "回答一个明确问题",
      targetDepth: "decision",
      mustAnswer: ["看到了什么"],
      shouldAnswer: [],
      explicitlyOutOfScope: [],
      followUpDestination: [],
      splitDecision: "single",
    },
    coverageMap: [
      {
        questionId: "Q01",
        question: "看到了什么",
        priority: "must",
        answerSummary: "真实对照结果",
        evidenceIds: ["C01"],
        plannedScenes: ["S01"],
        status: "covered",
        gapAction: "保持证据",
      },
    ],
    factEvidenceMap: [
      {
        claimId: "C01",
        claim: "对照结果存在差异",
        criticality: "core",
        claimType: "experiment",
        source:
          "src/video-system/fixtures/preproduction/example-experiment-record.md",
        confidence: "high",
        counterexampleChecked: true,
        qualification: "只适用于本实验条件",
        productionStatus: "qualify",
      },
    ],
    preProductionReadiness: {
      status: "ready-for-review",
      blockingReasons: [],
    },
  };
}

test("content brief V2 accepts traceable coverage and evidence", () => {
  const errors = validateContentBriefV2(validBrief(), {
    projectRoot: root,
    verifySources: true,
  });
  assert.deepEqual(errors, []);
});

test("content brief V2 blocks coverage evidence that does not exist", () => {
  const brief = validBrief();
  brief.coverageMap[0].evidenceIds = ["C99"];
  const errors = validateContentBriefV2(brief, {
    projectRoot: root,
    verifySources: true,
  });
  assert.match(errors.join("\n"), /C99 is not present/);
});

test("content brief V2 blocks missing experiment source files", () => {
  const brief = validBrief();
  brief.factEvidenceMap[0].source = "missing-experiment.md";
  const errors = validateContentBriefV2(brief, {
    projectRoot: root,
    verifySources: true,
  });
  assert.match(errors.join("\n"), /does not exist/);
});
