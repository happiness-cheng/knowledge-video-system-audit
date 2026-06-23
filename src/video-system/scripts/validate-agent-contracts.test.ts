import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { validateAgentContracts } from "./validate-agent-contracts";

/**
 * 创建临时目录，写入最小 fixture 文件，返回目录路径。
 */
function createTempFixture(overrides: Record<string, string> = {}): string {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "agent-contract-test-"));

  const defaults: Record<string, string> = {
    "CLAUDE.md": `# CLAUDE.md\n<!-- BEGIN SHARED_V2_CONTRACT -->\ngate:preproduction\nRevision Router\npromotion\nreview-candidate\napprovedByUser\ncapabilityRegistry\ndocs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md\n<!-- END SHARED_V2_CONTRACT -->\n`,
    "AGENTS.md": `# AGENTS.md\n<!-- BEGIN SHARED_V2_CONTRACT -->\ngate:preproduction\nRevision Router\npromotion\nreview-candidate\napprovedByUser\ncapabilityRegistry\ndocs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md\n<!-- END SHARED_V2_CONTRACT -->\n`,
    "docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md": "# V2 Contract\n",
    "src/video-system/README.md":
      "# Video System\nSee CLAUDE.md for production flow.\n",
    "src/lab.tsx":
      'import { Composition, registerRoot } from "remotion";\nconst LabRoot = () => null;\nregisterRoot(LabRoot);\n',
    "src/Root.tsx":
      'import { Composition } from "remotion";\nexport const RemotionRoot = () => null;\n',
    "package.json":
      '{"scripts":{"studio:lab":"npx remotion studio src/lab.tsx"}}',
  };

  const files = { ...defaults, ...overrides };
  for (const [relPath, content] of Object.entries(files)) {
    const fullPath = path.join(tmpDir, relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, "utf-8");
  }

  return tmpDir;
}

describe("validate-agent-contracts", () => {
  // === 正向测试：当前真实文件 ===

  it("current real files pass all checks", () => {
    const results = validateAgentContracts();
    const failures = results.filter((r) => !r.pass);
    assert.equal(
      failures.length,
      0,
      `Failed:\n${failures.map((f) => `  ${f.rule}: ${f.message}`).join("\n")}`,
    );
  });

  it("shared block hash is deterministic", () => {
    const r1 = validateAgentContracts();
    const r2 = validateAgentContracts();
    const h1 = r1.find((r) => r.rule === "shared-block-hash-match");
    const h2 = r2.find((r) => r.rule === "shared-block-hash-match");
    assert.ok(h1 && h2);
    assert.equal(h1.message, h2.message);
  });

  // === 正向测试：临时目录最小 fixture ===

  it("minimal valid fixture passes", () => {
    const tmp = createTempFixture();
    try {
      const results = validateAgentContracts(tmp);
      const failures = results.filter((r) => !r.pass);
      assert.equal(
        failures.length,
        0,
        `Failed:\n${failures.map((f) => `  ${f.rule}: ${f.message}`).join("\n")}`,
      );
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  // === 负向测试：全部使用临时目录 ===

  it("detects missing CLAUDE.md", () => {
    const tmp = createTempFixture({ "CLAUDE.md": "" });
    // Delete the file
    fs.unlinkSync(path.join(tmp, "CLAUDE.md"));
    try {
      const results = validateAgentContracts(tmp);
      const check = results.find((r) => r.rule === "entry-files-exist");
      assert.ok(check);
      assert.equal(check.pass, false);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("detects missing BEGIN marker", () => {
    const tmp = createTempFixture({
      "CLAUDE.md": `# CLAUDE.md\n## V2\ngate:preproduction\n<!-- END SHARED_V2_CONTRACT -->\n`,
    });
    try {
      const results = validateAgentContracts(tmp);
      const check = results.find(
        (r) => r.rule === "shared-markers-unique-CLAUDE.md",
      );
      assert.ok(check);
      assert.equal(check.pass, false);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("detects duplicate BEGIN marker", () => {
    const tmp = createTempFixture({
      "CLAUDE.md": `# CLAUDE.md\n<!-- BEGIN SHARED_V2_CONTRACT -->\n<!-- BEGIN SHARED_V2_CONTRACT -->\nfoo\n<!-- END SHARED_V2_CONTRACT -->\n`,
    });
    try {
      const results = validateAgentContracts(tmp);
      const check = results.find(
        (r) => r.rule === "shared-markers-unique-CLAUDE.md",
      );
      assert.ok(check);
      assert.equal(check.pass, false);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("detects mismatched shared blocks", () => {
    const tmp = createTempFixture({
      "AGENTS.md": `# AGENTS.md\n<!-- BEGIN SHARED_V2_CONTRACT -->\ngate:preproduction\nEXTRA\n<!-- END SHARED_V2_CONTRACT -->\n`,
    });
    try {
      const results = validateAgentContracts(tmp);
      const check = results.find((r) => r.rule === "shared-blocks-identical");
      assert.ok(check);
      assert.equal(check.pass, false);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("detects hash change on single char difference", () => {
    const tmp = createTempFixture({
      "AGENTS.md": `# AGENTS.md\n<!-- BEGIN SHARED_V2_CONTRACT -->\ngate:preproductionX\nRevision Router\npromotion\nreview-candidate\napprovedByUser\ncapabilityRegistry\ndocs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md\n<!-- END SHARED_V2_CONTRACT -->\n`,
    });
    try {
      const results = validateAgentContracts(tmp);
      const hashCheck = results.find(
        (r) => r.rule === "shared-block-hash-match",
      );
      const blockCheck = results.find(
        (r) => r.rule === "shared-blocks-identical",
      );
      assert.ok(hashCheck);
      assert.equal(hashCheck.pass, false, "hash should differ");
      assert.ok(blockCheck);
      assert.equal(blockCheck.pass, false, "blocks should differ");
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("detects missing contract file", () => {
    const tmp = createTempFixture();
    fs.unlinkSync(path.join(tmp, "docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md"));
    try {
      const results = validateAgentContracts(tmp);
      const check = results.find((r) => r.rule === "contract-file-exists");
      assert.ok(check);
      assert.equal(check.pass, false);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("detects old flow in README", () => {
    const tmp = createTempFixture({
      "src/video-system/README.md":
        "# Video System\ncontentBrief.json → videoSpec.json → TTS → MP4\n",
    });
    try {
      const results = validateAgentContracts(tmp);
      const checks = results.filter((r) =>
        r.rule.startsWith("readme-no-old-flow-"),
      );
      assert.ok(checks.some((r) => !r.pass));
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("detects 新会话入口 in README", () => {
    const tmp = createTempFixture({
      "src/video-system/README.md": "# Video System\n新会话入口文件\n",
    });
    try {
      const results = validateAgentContracts(tmp);
      const checks = results.filter((r) =>
        r.rule.startsWith("readme-no-old-flow-"),
      );
      assert.ok(checks.some((r) => !r.pass));
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("detects production composition in lab entry", () => {
    const tmp = createTempFixture({
      "src/lab.tsx":
        'import { Composition, registerRoot } from "remotion";\nconst LabRoot = () => null;\nregisterRoot(LabRoot);\n',
    });
    // Inject production composition ID
    const labPath = path.join(tmp, "src/lab.tsx");
    fs.writeFileSync(
      labPath,
      fs.readFileSync(labPath, "utf-8") +
        '\n<Composition id="KnowledgeVideo" component={null as any} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{}} />\n',
    );
    try {
      const results = validateAgentContracts(tmp);
      const check = results.find(
        (r) => r.rule === "lab-no-production-composition",
      );
      assert.ok(check);
      assert.equal(check.pass, false);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("detects unknown composition in lab entry", () => {
    const tmp = createTempFixture({
      "src/lab.tsx":
        'import { Composition, registerRoot } from "remotion";\nconst LabRoot = () => null;\n<Composition id="UnknownThing" component={null as any} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{}} />\nregisterRoot(LabRoot);\n',
    });
    try {
      const results = validateAgentContracts(tmp);
      const check = results.find(
        (r) => r.rule === "lab-all-compositions-in-allowlist",
      );
      assert.ok(check);
      assert.equal(check.pass, false);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("detects studio:lab not using lab.tsx", () => {
    const tmp = createTempFixture({
      "package.json":
        '{"scripts":{"studio:lab":"npx remotion studio src/index.ts"}}',
    });
    try {
      const results = validateAgentContracts(tmp);
      const check = results.find((r) => r.rule === "studio-lab-uses-lab-entry");
      assert.ok(check);
      assert.equal(check.pass, false);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("CRLF and LF produce same hash after normalization", () => {
    const lf =
      "# CLAUDE.md\n<!-- BEGIN SHARED_V2_CONTRACT -->\ngate:preproduction\n<!-- END SHARED_V2_CONTRACT -->\n";
    const crlf = lf.replace(/\n/g, "\r\n");
    const tmpLf = createTempFixture({ "CLAUDE.md": lf, "AGENTS.md": lf });
    const tmpCrlf = createTempFixture({
      "CLAUDE.md": lf,
      "AGENTS.md": crlf,
    });
    try {
      const rLf = validateAgentContracts(tmpLf);
      const rCrlf = validateAgentContracts(tmpCrlf);
      const hashLf = rLf.find((r) => r.rule === "shared-block-hash-match");
      const hashCrlf = rCrlf.find((r) => r.rule === "shared-block-hash-match");
      assert.ok(hashLf && hashCrlf);
      assert.equal(hashLf.pass, true, "LF should pass: " + hashLf.message);
      assert.equal(
        hashCrlf.pass,
        true,
        "CRLF should pass after normalization: " + hashCrlf.message,
      );
      // Extract hash values
      const extractHash = (msg: string) => msg.match(/[a-f0-9]{64}/)?.[0] ?? "";
      assert.equal(extractHash(hashLf.message), extractHash(hashCrlf.message));
    } finally {
      fs.rmSync(tmpLf, { recursive: true, force: true });
      fs.rmSync(tmpCrlf, { recursive: true, force: true });
    }
  });
});
