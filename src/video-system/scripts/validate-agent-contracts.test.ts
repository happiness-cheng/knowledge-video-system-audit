import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateAgentContracts } from "./validate-agent-contracts";

describe("validate-agent-contracts", () => {
  it("all checks pass for current CLAUDE.md and AGENTS.md", () => {
    const results = validateAgentContracts();
    const failures = results.filter((r) => !r.pass);
    assert.equal(
      failures.length,
      0,
      `Failed checks:\n${failures.map((f) => `  ${f.rule}: ${f.message}`).join("\n")}`,
    );
  });

  it("shared blocks are identical", () => {
    const results = validateAgentContracts();
    const blockCheck = results.find(
      (r) => r.rule === "shared-blocks-identical",
    );
    assert.ok(blockCheck, "shared-blocks-identical check should exist");
    assert.equal(blockCheck.pass, true, blockCheck.message);
  });

  it("no forbidden phrases present", () => {
    const results = validateAgentContracts();
    const forbiddenChecks = results.filter((r) =>
      r.rule.startsWith("forbidden-"),
    );
    assert.ok(
      forbiddenChecks.length > 0,
      "should have forbidden phrase checks",
    );
    for (const check of forbiddenChecks) {
      assert.equal(check.pass, true, check.message);
    }
  });

  it("contract file exists", () => {
    const results = validateAgentContracts();
    const contractCheck = results.find(
      (r) => r.rule === "contract-file-exists",
    );
    assert.ok(contractCheck, "contract-file-exists check should exist");
    assert.equal(contractCheck.pass, true, contractCheck.message);
  });
});
