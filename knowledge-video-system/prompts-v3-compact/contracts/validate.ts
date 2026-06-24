/**
 * V4 Contract Validator — Two-Layer Architecture
 *
 * Layer A: JSON Schema shape validation via ajv (Draft 2020-12)
 * Layer B: Runtime business gate via preProductionGate.ts
 *
 * CLI:
 *   npx tsx contracts/validate.ts --schema <json-file> <schema-name>
 *   npx tsx contracts/validate.ts --gate <review-json-path> [--verify-inputs]
 *   npx tsx contracts/validate.ts --all
 */

import Ajv2020 from "ajv/dist/2020";
import type { ErrorObject } from "ajv";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  evaluatePreProductionGate,
  calculateReviewedInputDigest,
} from "../../../src/video-system/utils/preProductionGate";
import type {
  PreProductionReview,
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

/** Load all .schema.json files and compile an ajv instance */
function createAjvInstance(): Ajv2020 {
  const ajv = new Ajv2020({ allErrors: true });

  const schemaFiles = fs
    .readdirSync(CONTRACTS_DIR)
    .filter((f) => f.endsWith(".schema.json"));

  for (const schemaFile of schemaFiles) {
    const fullPath = path.join(CONTRACTS_DIR, schemaFile);
    const schema = JSON.parse(fs.readFileSync(fullPath, "utf-8"));

    // If the schema has no $id, set it to the filename so $ref resolves correctly.
    // Schemas like visualDirectionSpec use $ref: "./shotDirectorSpec.schema.json"
    // which resolves relative to the current schema's base URI.
    if (!schema.$id) {
      schema.$id = schemaFile;
    }

    ajv.addSchema(schema);
  }

  return ajv;
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

function validateGate(
  reviewJsonPath: string,
  verifyInputs: boolean,
): GateValidationResult {
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

  const evaluation: GateEvaluation = evaluatePreProductionGate(reviewData, {
    verifyInputFiles: verifyInputs,
  });

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
    totalSchema: number;
    passedSchema: number;
    failedSchema: number;
    totalGate: number;
    passedGate: number;
    failedGate: number;
    unexpectedFailures: string[];
  };
}

function runAll(ajv: Ajv2020): AllResults {
  const schemaResults: SchemaValidationResult[] = [];
  const gateResults: GateValidationResult[] = [];
  const unexpectedFailures: string[] = [];

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

    if (expectation.bucket === "valid" && !schemaResult.passed) {
      unexpectedFailures.push(
        `VALID fixture "${expectation.fixtureFile}" FAILED schema validation: ${schemaResult.errors.map((e) => e.message).join("; ")}`,
      );
    }

    // For invalid fixtures that pass schema validation, check if they should have failed
    if (
      expectation.bucket === "invalid" &&
      schemaResult.passed &&
      !expectation.runGate
    ) {
      unexpectedFailures.push(
        `INVALID fixture "${expectation.fixtureFile}" unexpectedly PASSED schema validation (no gate check configured)`,
      );
    }

    // Layer B: gate validation for preProductionReview fixtures
    if (expectation.runGate) {
      const gateResult = validateGate(fixturePath, false);
      gateResults.push(gateResult);

      if (expectation.bucket === "valid" && !gateResult.passed) {
        unexpectedFailures.push(
          `VALID fixture "${expectation.fixtureFile}" FAILED gate: ${gateResult.blockingReasons.join("; ")}`,
        );
      }
    }
  }

  const passedSchema = schemaResults.filter((r) => r.passed).length;
  const passedGate = gateResults.filter((r) => r.passed).length;

  return {
    schemaResults,
    gateResults,
    summary: {
      totalSchema: schemaResults.length,
      passedSchema,
      failedSchema: schemaResults.length - passedSchema,
      totalGate: gateResults.length,
      passedGate,
      failedGate: gateResults.length - passedGate,
      unexpectedFailures,
    },
  };
}

// ─── CLI ──────────────────────────────────────────────────

function printUsage(): void {
  console.error(`Usage:
  npx tsx contracts/validate.ts --schema <json-file> <schema-name>
  npx tsx contracts/validate.ts --gate <review-json-path> [--verify-inputs]
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

    const ajv = createAjvInstance();
    const result = validateSchema(ajv, jsonFile, schemaName);
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.passed ? 0 : 1);
  }

  // --gate <review-json-path> [--verify-inputs]
  if (mode === "--gate") {
    if (args.length < 2) {
      console.error("Usage: --gate <review-json-path> [--verify-inputs]");
      process.exit(1);
    }
    const reviewPath = path.resolve(args[1]);
    const verifyInputs = args.includes("--verify-inputs");

    if (!fs.existsSync(reviewPath)) {
      console.error(`File not found: ${reviewPath}`);
      process.exit(1);
    }

    const result = validateGate(reviewPath, verifyInputs);
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.passed ? 0 : 1);
  }

  // --all
  if (mode === "--all") {
    const ajv = createAjvInstance();
    const results = runAll(ajv);

    console.log(JSON.stringify(results, null, 2));

    const hasFailures = results.summary.unexpectedFailures.length > 0;
    process.exit(hasFailures ? 1 : 0);
  }

  // Unknown flag
  console.error(`Unknown mode: ${mode}`);
  printUsage();
  process.exit(1);
}

main();
