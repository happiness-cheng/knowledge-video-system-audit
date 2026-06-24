/**
 * V4 Contract Validator — Two-Layer Architecture
 *
 * Layer A: JSON Schema shape validation via ajv (Draft 2020-12)
 * Layer B: Runtime business gate via preProductionGate.ts
 *
 * CLI:
 *   npx tsx contracts/validate.ts --schema <json-file> <schema-name>
 *   npx tsx contracts/validate.ts --review-ready <preProductionReview.json>
 *   npx tsx contracts/validate.ts --execution-gate <preProductionReview.json> <userApproval.json>
 *   npx tsx contracts/validate.ts --all
 */

import Ajv2020 from "ajv/dist/2020";
import type { ErrorObject } from "ajv";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  evaluatePreProductionReviewReady,
  evaluatePreProductionExecutionGate,
  calculateReviewedInputDigest,
} from "../../../src/video-system/utils/preProductionGate";
import type {
  PreProductionReview,
  UserApproval,
  GateEvaluation,
} from "../../../src/video-system/utils/preProductionGate";

// ─── Paths ────────────────────────────────────────────────

const CONTRACTS_DIR = __dirname;
const FIXTURES_DIR = path.resolve(CONTRACTS_DIR, "../fixtures");
const VALID_FIXTURES_DIR = path.join(FIXTURES_DIR, "valid");
const INVALID_FIXTURES_DIR = path.join(FIXTURES_DIR, "invalid");

// ─── Schema Name Mapping ──────────────────────────────────

/** Map friendly name → schema file basename */
const SCHEMA_FILE_MAP: Record<string, string> = {
  approvedContentSnapshot: "approvedContentSnapshot.schema.json",
  beatSheet: "beatSheet.schema.json",
  capabilityNegotiation: "capabilityNegotiation.schema.json",
  capabilityPreflight: "capabilityPreflight.schema.json",
  contentBrief: "contentBrief.schema.json",
  contentMasterDraft: "contentMasterDraft.schema.json",
  contentSegmentPlan: "contentSegmentPlan.schema.json",
  coverBrief: "coverBrief.schema.json",
  preProductionReview: "preProductionReview.schema.json",
  shotDirectorSpec: "shotDirectorSpec.schema.json",
  shotSceneCompileMap: "shotSceneCompileMap.schema.json",
  timedVisualAlignment: "timedVisualAlignment.schema.json",
  userApproval: "userApproval.schema.json",
  viewerAcceptanceReview: "viewerAcceptanceReview.schema.json",
  visualDirectionSpec: "visualDirectionSpec.schema.json",
  visualPhilosophyAcknowledgement:
    "visualPhilosophyAcknowledgement.schema.json",
  visualSnapshot: "visualSnapshot.schema.json",
  visualSpikeResult: "visualSpikeResult.schema.json",
  visualVerificationBundle: "visualVerificationBundle.schema.json",
};

// ─── Fixture-to-Schema Mapping for --all ──────────────────

interface FixtureExpectation {
  fixtureFile: string;
  schemaName: string;
  /** "valid" = expect schema pass; "invalid" = expect schema or gate fail */
  bucket: "valid" | "invalid";
  /** If true, also run the gate after schema validation */
  runGate?: boolean;
}

const FIXTURE_EXPECTATIONS: FixtureExpectation[] = [
  // Valid fixtures: all should pass schema validation
  {
    fixtureFile: "complete-v4-beat-sheet.json",
    schemaName: "beatSheet",
    bucket: "valid",
  },
  {
    fixtureFile: "complete-v4-content-master.json",
    schemaName: "contentMasterDraft",
    bucket: "valid",
  },
  {
    fixtureFile: "complete-content-snapshot.json",
    schemaName: "approvedContentSnapshot",
    bucket: "valid",
  },
  {
    fixtureFile: "complete-four-review-gate.json",
    schemaName: "preProductionReview",
    bucket: "valid",
  },
  {
    fixtureFile: "complete-shot-director-spec.json",
    schemaName: "shotDirectorSpec",
    bucket: "valid",
  },
  // Invalid fixtures
  {
    fixtureFile: "missing-information-delta.json",
    schemaName: "beatSheet",
    bucket: "invalid",
  },
  {
    fixtureFile: "missing-viewer-state-change.json",
    schemaName: "contentMasterDraft",
    bucket: "invalid",
  },
  {
    fixtureFile: "mixed-contract-version.json",
    schemaName: "approvedContentSnapshot",
    bucket: "invalid",
  },
  {
    fixtureFile: "digest-mismatch.json",
    schemaName: "approvedContentSnapshot",
    bucket: "invalid",
  },
  {
    fixtureFile: "duplicate-review-role.json",
    schemaName: "preProductionReview",
    bucket: "invalid",
    runGate: true,
  },
  {
    fixtureFile: "missing-review-role.json",
    schemaName: "preProductionReview",
    bucket: "invalid",
    runGate: true,
  },
  {
    fixtureFile: "score-sum-mismatch.json",
    schemaName: "preProductionReview",
    bucket: "invalid",
    runGate: true,
  },
  {
    fixtureFile: "single-reviewer-system.json",
    schemaName: "preProductionReview",
    bucket: "invalid",
    runGate: true,
  },
  {
    fixtureFile: "missing-identifiers.json",
    schemaName: "preProductionReview",
    bucket: "invalid",
  },
  {
    fixtureFile: "invalid-candidate-digest.json",
    schemaName: "preProductionReview",
    bucket: "invalid",
  },
  {
    fixtureFile: "approval-wrong-version.json",
    schemaName: "userApproval",
    bucket: "invalid",
  },
  {
    fixtureFile: "approval-missing-identifiers.json",
    schemaName: "userApproval",
    bucket: "invalid",
    runGate: true,
  },
];

// ─── Layer A: ajv Schema Validation ───────────────────────

interface SchemaValidationError {
  instancePath: string;
  schemaPath: string;
  keyword: string;
  message?: string;
}

interface SchemaValidationResult {
  mode: "schema";
  schema: string;
  file: string;
  passed: boolean;
  errors: SchemaValidationError[];
}

/** Load all .schema.json files and compile an ajv instance.
 *  Returns the ajv instance and the count of discovered/compiled schemas.
 *  Throws if any schema fails to compile. */
function createAjvInstance(): {
  ajv: Ajv2020;
  schemasDiscovered: number;
  schemasCompiled: number;
} {
  const ajv = new Ajv2020({ allErrors: true });

  const schemaFiles = fs
    .readdirSync(CONTRACTS_DIR)
    .filter((f) => f.endsWith(".schema.json"));

  const schemasDiscovered = schemaFiles.length;
  let schemasCompiled = 0;

  for (const schemaFile of schemaFiles) {
    const fullPath = path.join(CONTRACTS_DIR, schemaFile);
    const schema = JSON.parse(fs.readFileSync(fullPath, "utf-8"));

    // If the schema has no $id, set it to the filename so $ref resolves correctly.
    if (!schema.$id) {
      schema.$id = schemaFile;
    }

    ajv.addSchema(schema);
    schemasCompiled++;
  }

  // Verify every registered schema can be retrieved and compiled
  for (const schemaFile of schemaFiles) {
    const schema = JSON.parse(
      fs.readFileSync(path.join(CONTRACTS_DIR, schemaFile), "utf-8"),
    );
    const key = schema.$id ?? schemaFile;
    if (!ajv.getSchema(key)) {
      throw new Error(
        `Schema "${schemaFile}" ($id="${key}") could not be compiled. Check for invalid $ref or syntax.`,
      );
    }
  }

  return { ajv, schemasDiscovered, schemasCompiled };
}

/** Resolve a friendly schema name to the ajv schema key */
function resolveSchemaKey(ajv: Ajv2020, schemaName: string): string {
  const fileName = SCHEMA_FILE_MAP[schemaName];
  if (!fileName) {
    throw new Error(
      `Unknown schema name: "${schemaName}". Available: ${Object.keys(SCHEMA_FILE_MAP).join(", ")}`,
    );
  }

  // The schema may have been registered with its $id (if it had one) or with
  // the filename (if we injected $id). Try both.
  const schema = JSON.parse(
    fs.readFileSync(path.join(CONTRACTS_DIR, fileName), "utf-8"),
  );
  const key = schema.$id ?? fileName;

  if (!ajv.getSchema(key)) {
    throw new Error(
      `Schema "${schemaName}" (${fileName}) was not compiled. Key "${key}" not found in ajv.`,
    );
  }

  return key;
}

function formatAjvErrors(errors: ErrorObject[]): SchemaValidationError[] {
  return errors.map((err) => ({
    instancePath: err.instancePath,
    schemaPath: err.schemaPath,
    keyword: err.keyword,
    message: err.message,
  }));
}

function validateSchema(
  ajv: Ajv2020,
  jsonFilePath: string,
  schemaName: string,
): SchemaValidationResult {
  const fileName = path.basename(jsonFilePath);
  const schemaKey = resolveSchemaKey(ajv, schemaName);

  let data: unknown;
  try {
    data = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));
  } catch (e) {
    return {
      mode: "schema",
      schema: schemaName,
      file: fileName,
      passed: false,
      errors: [
        {
          instancePath: "",
          schemaPath: "",
          keyword: "parse",
          message: `Cannot parse JSON: ${e instanceof Error ? e.message : String(e)}`,
        },
      ],
    };
  }

  const validate = ajv.getSchema(schemaKey)!;
  const valid = validate(data);

  return {
    mode: "schema",
    schema: schemaName,
    file: fileName,
    passed: !!valid,
    errors: valid ? [] : formatAjvErrors(validate.errors ?? []),
  };
}

// ─── Layer B: Runtime Business Gate ───────────────────────

interface GateValidationResult {
  mode: "gate";
  file: string;
  passed: boolean;
  blockingReasons: string[];
  calculated: GateEvaluation["calculated"];
}

function validateReviewReady(reviewJsonPath: string): GateValidationResult {
  const fileName = path.basename(reviewJsonPath);

  let reviewData: PreProductionReview;
  try {
    reviewData = JSON.parse(
      fs.readFileSync(reviewJsonPath, "utf-8"),
    ) as PreProductionReview;
  } catch (e) {
    return {
      mode: "gate",
      file: fileName,
      passed: false,
      blockingReasons: [
        `Cannot parse JSON: ${e instanceof Error ? e.message : String(e)}`,
      ],
      calculated: {
        reviewedInputDigest: "",
        meanScore: 0,
        medianScore: 0,
        minReviewerScore: 0,
        scoreSpread: 0,
        dimensionMeans: {},
      },
    };
  }

  const evaluation: GateEvaluation =
    evaluatePreProductionReviewReady(reviewData);

  return {
    mode: "gate",
    file: fileName,
    passed: evaluation.passed,
    blockingReasons: evaluation.blockingReasons,
    calculated: evaluation.calculated,
  };
}

// ─── --all Mode ───────────────────────────────────────────

interface AllResults {
  schemaResults: SchemaValidationResult[];
  gateResults: GateValidationResult[];
  summary: {
    schemasDiscovered: number;
    schemasCompiled: number;
    validFixturesPassed: number;
    invalidSchemaFixturesFailed: number;
    invalidGateFixturesFailed: number;
    unexpectedPasses: string[];
    unexpectedFailures: string[];
  };
}

function runAll(
  ajv: Ajv2020,
  schemasDiscovered: number,
  schemasCompiled: number,
): AllResults {
  const schemaResults: SchemaValidationResult[] = [];
  const gateResults: GateValidationResult[] = [];
  const unexpectedFailures: string[] = [];
  const unexpectedPasses: string[] = [];
  let validFixturesPassed = 0;
  let invalidSchemaFixturesFailed = 0;
  let invalidGateFixturesFailed = 0;

  for (const expectation of FIXTURE_EXPECTATIONS) {
    const fixtureDir =
      expectation.bucket === "valid"
        ? VALID_FIXTURES_DIR
        : INVALID_FIXTURES_DIR;
    const fixturePath = path.join(fixtureDir, expectation.fixtureFile);

    if (!fs.existsSync(fixturePath)) {
      unexpectedFailures.push(`Fixture not found: ${expectation.fixtureFile}`);
      continue;
    }

    // Layer A: schema validation
    const schemaResult = validateSchema(
      ajv,
      fixturePath,
      expectation.schemaName,
    );
    schemaResults.push(schemaResult);

    if (expectation.bucket === "valid") {
      if (schemaResult.passed) {
        validFixturesPassed++;
      } else {
        unexpectedFailures.push(
          `VALID fixture "${expectation.fixtureFile}" FAILED schema: ${schemaResult.errors.map((e) => e.message).join("; ")}`,
        );
      }
    }

    if (expectation.bucket === "invalid" && !schemaResult.passed) {
      invalidSchemaFixturesFailed++;
    }

    // Invalid fixture passes schema and has no gate → unexpected
    if (
      expectation.bucket === "invalid" &&
      schemaResult.passed &&
      !expectation.runGate
    ) {
      unexpectedFailures.push(
        `INVALID fixture "${expectation.fixtureFile}" unexpectedly PASSED schema (no gate configured)`,
      );
    }

    // Layer B: gate validation
    if (expectation.runGate) {
      const gateResult = validateReviewReady(fixturePath);
      gateResults.push(gateResult);

      if (expectation.bucket === "valid" && !gateResult.passed) {
        unexpectedFailures.push(
          `VALID fixture "${expectation.fixtureFile}" FAILED gate: ${gateResult.blockingReasons.join("; ")}`,
        );
      }

      if (expectation.bucket === "invalid") {
        if (gateResult.passed) {
          // False-green: invalid fixture passed gate
          unexpectedPasses.push(
            `INVALID fixture "${expectation.fixtureFile}" unexpectedly PASSED gate`,
          );
        } else {
          invalidGateFixturesFailed++;
        }
      }
    }
  }

  return {
    schemaResults,
    gateResults,
    summary: {
      schemasDiscovered,
      schemasCompiled,
      validFixturesPassed,
      invalidSchemaFixturesFailed,
      invalidGateFixturesFailed,
      unexpectedPasses,
      unexpectedFailures,
    },
  };
}

// ─── CLI ──────────────────────────────────────────────────

function printUsage(): void {
  console.error(`Usage:
  npx tsx contracts/validate.ts --schema <json-file> <schema-name>
  npx tsx contracts/validate.ts --review-ready <preProductionReview.json>
  npx tsx contracts/validate.ts --execution-gate <preProductionReview.json> <userApproval.json>
  npx tsx contracts/validate.ts --all

Schema names:
  ${Object.keys(SCHEMA_FILE_MAP).join("\n  ")}`);
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printUsage();
    process.exit(1);
  }

  const mode = args[0];

  // --schema <json-file> <schema-name>
  if (mode === "--schema") {
    if (args.length < 3) {
      console.error("Usage: --schema <json-file> <schema-name>");
      process.exit(1);
    }
    const jsonFile = path.resolve(args[1]);
    const schemaName = args[2];

    if (!fs.existsSync(jsonFile)) {
      console.error(`File not found: ${jsonFile}`);
      process.exit(1);
    }

    const { ajv } = createAjvInstance();
    const result = validateSchema(ajv, jsonFile, schemaName);
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.passed ? 0 : 1);
  }

  // --review-ready <preProductionReview.json>
  if (mode === "--review-ready") {
    if (args.length < 2) {
      console.error("Usage: --review-ready <preProductionReview.json>");
      process.exit(1);
    }
    const reviewPath = path.resolve(args[1]);

    if (!fs.existsSync(reviewPath)) {
      console.error(`File not found: ${reviewPath}`);
      process.exit(1);
    }

    const result = validateReviewReady(reviewPath);
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.passed ? 0 : 1);
  }

  // --execution-gate <preProductionReview.json> <userApproval.json>
  if (mode === "--execution-gate") {
    if (args.length < 3) {
      console.error(
        "Usage: --execution-gate <preProductionReview.json> <userApproval.json>",
      );
      process.exit(1);
    }
    const reviewPath = path.resolve(args[1]);
    const approvalPath = path.resolve(args[2]);

    if (!fs.existsSync(reviewPath)) {
      console.error(`File not found: ${reviewPath}`);
      process.exit(1);
    }
    if (!fs.existsSync(approvalPath)) {
      console.error(`File not found: ${approvalPath}`);
      process.exit(1);
    }

    const reviewData = JSON.parse(
      fs.readFileSync(reviewPath, "utf-8"),
    ) as PreProductionReview;
    const approvalData = JSON.parse(
      fs.readFileSync(approvalPath, "utf-8"),
    ) as UserApproval;
    const evaluation = evaluatePreProductionExecutionGate(
      reviewData,
      approvalData,
    );
    const result: GateValidationResult = {
      mode: "gate",
      file: `${path.basename(reviewPath)} + ${path.basename(approvalPath)}`,
      passed: evaluation.passed,
      blockingReasons: evaluation.blockingReasons,
      calculated: evaluation.calculated,
    };
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.passed ? 0 : 1);
  }

  // --all
  if (mode === "--all") {
    const { ajv, schemasDiscovered, schemasCompiled } = createAjvInstance();
    const results = runAll(ajv, schemasDiscovered, schemasCompiled);

    console.log(JSON.stringify(results, null, 2));

    const hasFailures = results.summary.unexpectedFailures.length > 0;
    const hasFalseGreens = results.summary.unexpectedPasses.length > 0;
    process.exit(hasFailures || hasFalseGreens ? 1 : 0);
  }

  // Unknown flag
  console.error(`Unknown mode: ${mode}`);
  printUsage();
  process.exit(1);
}

main();
