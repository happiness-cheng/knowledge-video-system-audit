import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { validateAgentContracts, type CheckResult } from "./validate-agent-contracts";

/**
 * 在临时目录中创建最小文件集，运行 validator，返回结果。
 * 可选择性覆盖默认文件内容。
 */
function runWithFiles(
  overrides: Record<string, string | null>,
): CheckResult[] {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "agent-contract-test-"));
  const ROOT = path.resolve(__dirname, "../../..");

  try {
    // 默认文件内容
    const defaults: Record<string, string> = {
      "CLAUDE.md": `# CLAUDE.md\n<!-- BEGIN SHARED_V2_CONTRACT -->\n## V2\n制作前硬门禁\nRevision Router\nSHA-256\ncandidate\npromotion\nreviewerSystem\napprovedByUser\ndocs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md\n<!-- END SHARED_V2_CONTRACT -->\n`,
      "AGENTS.md": `# AGENTS.md\n<!-- BEGIN SHARED_V2_CONTRACT -->\n## V2\n制作前硬门禁\nRevision Router\nSHA-256\ncandidate\npromotion\nreviewerSystem\napprovedByUser\ndocs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md\n<!-- END SHARED_V2_CONTRACT -->\n`,
      "docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md": "# V2 Contract\n",
      "src/video-system/README.md": "# Video System\nSee CLAUDE.md for production flow.\n",
      "src/lab.tsx": "import { registerRoot } from 'remotion';\nconst LabRoot = () => null;\nregisterRoot(LabRoot);\n",
      "src/Root.tsx": 'import { Composition } from "remotion";\nexport const RemotionRoot = () => null;\n',
      "package.json": '{"scripts":{"studio:lab":"npx remotion studio src/lab.ts"}}',
    };

    // 合并覆盖
    const files = { ...defaults, ...overrides };

    // 创建目录和文件
    for (const [relPath, content] of Object.entries(files)) {
      if (content === null) continue; // null = 不创建
      const fullPath = path.join(tmpDir, relPath);
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, content, "utf-8");
    }

    // 临时修改 __dirname 对应的 ROOT（通过 monkey-patch）
    // 注意：validateAgentContracts 使用硬编码的 ROOT 路径
    // 所以我们需要用另一种方式测试：直接在临时目录中创建文件
    // 然后修改实际的项目文件进行测试

    // 由于 validator 使用固定 ROOT，这里改用实际项目文件测试
    // 负向测试通过检查 validator 输出是否包含预期失败来验证

    return []; // 占位，实际测试用下面的方式
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

describe("validate-agent-contracts", () => {
  // === 正向测试 ===

  it("current files pass all checks", () => {
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
    const blockCheck = results.find((r) => r.rule === "shared-blocks-identical");
    assert.ok(blockCheck, "shared-blocks-identical check should exist");
    assert.equal(blockCheck.pass, true, blockCheck.message);
  });

  it("no forbidden phrases present", () => {
    const results = validateAgentContracts();
    const forbiddenChecks = results.filter((r) =>
      r.rule.startsWith("forbidden-"),
    );
    assert.ok(forbiddenChecks.length > 0, "should have forbidden phrase checks");
    for (const check of forbiddenChecks) {
      assert.equal(check.pass, true, check.message);
    }
  });

  it("contract file exists", () => {
    const results = validateAgentContracts();
    const contractCheck = results.find((r) => r.rule === "contract-file-exists");
    assert.ok(contractCheck, "contract-file-exists check should exist");
    assert.equal(contractCheck.pass, true, contractCheck.message);
  });

  it("README has no old flow patterns", () => {
    const results = validateAgentContracts();
    const readmeChecks = results.filter((r) =>
      r.rule.startsWith("readme-no-old-flow-"),
    );
    assert.ok(readmeChecks.length > 0, "should have README old flow checks");
    for (const check of readmeChecks) {
      assert.equal(check.pass, true, check.message);
    }
  });

  it("README references root entry or V2 contract", () => {
    const results = validateAgentContracts();
    const refCheck = results.find((r) => r.rule === "readme-refs-root-entry");
    assert.ok(refCheck, "readme-refs-root-entry check should exist");
    assert.equal(refCheck.pass, true, refCheck.message);
  });

  it("lab entry exists and is isolated", () => {
    const results = validateAgentContracts();
    const labExists = results.find((r) => r.rule === "lab-entry-exists");
    const labIsolated = results.find(
      (r) => r.rule === "lab-no-production-composition",
    );
    assert.ok(labExists, "lab-entry-exists check should exist");
    assert.equal(labExists.pass, true, labExists.message);
    assert.ok(labIsolated, "lab-no-production-composition check should exist");
    assert.equal(labIsolated.pass, true, labIsolated.message);
  });

  it("studio:lab uses lab entry", () => {
    const results = validateAgentContracts();
    const studioLabCheck = results.find(
      (r) => r.rule === "studio-lab-uses-lab-entry",
    );
    assert.ok(studioLabCheck, "studio-lab-uses-lab-entry check should exist");
    assert.equal(studioLabCheck.pass, true, studioLabCheck.message);
  });

  // === 负向测试：验证 validator 能检测到问题 ===

  it("detects missing BEGIN marker", () => {
    const ROOT = path.resolve(__dirname, "../../..");
    const claudePath = path.join(ROOT, "CLAUDE.md");
    const original = fs.readFileSync(claudePath, "utf-8");

    try {
      // 移除 BEGIN 标记
      const broken = original.replace("<!-- BEGIN SHARED_V2_CONTRACT -->", "");
      fs.writeFileSync(claudePath, broken, "utf-8");

      const results = validateAgentContracts();
      const markerCheck = results.find(
        (r) => r.rule === "shared-markers-unique-CLAUDE.md",
      );
      assert.ok(markerCheck, "should have marker check");
      assert.equal(markerCheck.pass, false, "should fail without BEGIN marker");
    } finally {
      fs.writeFileSync(claudePath, original, "utf-8");
    }
  });

  it("detects duplicate BEGIN marker", () => {
    const ROOT = path.resolve(__dirname, "../../..");
    const claudePath = path.join(ROOT, "CLAUDE.md");
    const original = fs.readFileSync(claudePath, "utf-8");

    try {
      // 重复 BEGIN 标记
      const broken = original.replace(
        "<!-- BEGIN SHARED_V2_CONTRACT -->",
        "<!-- BEGIN SHARED_V2_CONTRACT -->\n<!-- BEGIN SHARED_V2_CONTRACT -->",
      );
      fs.writeFileSync(claudePath, broken, "utf-8");

      const results = validateAgentContracts();
      const markerCheck = results.find(
        (r) => r.rule === "shared-markers-unique-CLAUDE.md",
      );
      assert.ok(markerCheck, "should have marker check");
      assert.equal(markerCheck.pass, false, "should fail with duplicate marker");
    } finally {
      fs.writeFileSync(claudePath, original, "utf-8");
    }
  });

  it("detects mismatched shared blocks", () => {
    const ROOT = path.resolve(__dirname, "../../..");
    const agentsPath = path.join(ROOT, "AGENTS.md");
    const original = fs.readFileSync(agentsPath, "utf-8");

    try {
      // 修改 AGENTS.md 共享区内容
      const broken = original.replace(
        "gate:preproduction",
        "gate:preproduction\n额外内容",
      );
      fs.writeFileSync(agentsPath, broken, "utf-8");

      const results = validateAgentContracts();
      const blockCheck = results.find(
        (r) => r.rule === "shared-blocks-identical",
      );
      assert.ok(blockCheck, "should have block check");
      assert.equal(blockCheck.pass, false, "should fail with mismatched blocks");
    } finally {
      fs.writeFileSync(agentsPath, original, "utf-8");
    }
  });

  it("detects missing contract file", () => {
    const ROOT = path.resolve(__dirname, "../../..");
    const contractPath = path.join(
      ROOT,
      "docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md",
    );
    const original = fs.readFileSync(contractPath, "utf-8");

    try {
      // 删除 contract 文件内容（模拟缺失）
      fs.unlinkSync(contractPath);

      const results = validateAgentContracts();
      const contractCheck = results.find(
        (r) => r.rule === "contract-file-exists",
      );
      assert.ok(contractCheck, "should have contract check");
      assert.equal(contractCheck.pass, false, "should fail without contract");
    } finally {
      fs.writeFileSync(contractPath, original, "utf-8");
    }
  });

  it("detects old flow in README", () => {
    const ROOT = path.resolve(__dirname, "../../..");
    const readmePath = path.join(ROOT, "src/video-system/README.md");
    const original = fs.readFileSync(readmePath, "utf-8");

    try {
      // 注入旧流程
      const broken =
        original +
        "\n## 数据流\ncontentBrief.json → videoSpec.json → TTS → MP4\n";
      fs.writeFileSync(readmePath, broken, "utf-8");

      const results = validateAgentContracts();
      const oldFlowChecks = results.filter((r) =>
        r.rule.startsWith("readme-no-old-flow-"),
      );
      const hasFailure = oldFlowChecks.some((r) => !r.pass);
      assert.equal(hasFailure, true, "should detect old flow in README");
    } finally {
      fs.writeFileSync(readmePath, original, "utf-8");
    }
  });

  it("detects new session entry in README", () => {
    const ROOT = path.resolve(__dirname, "../../..");
    const readmePath = path.join(ROOT, "src/video-system/README.md");
    const original = fs.readFileSync(readmePath, "utf-8");

    try {
      // 注入"新会话入口"
      const broken = original.replace(
        "# Knowledge Video System",
        "# Knowledge Video System\n\n新会话入口文件。",
      );
      fs.writeFileSync(readmePath, broken, "utf-8");

      const results = validateAgentContracts();
      const oldFlowChecks = results.filter((r) =>
        r.rule.startsWith("readme-no-old-flow-"),
      );
      const hasFailure = oldFlowChecks.some((r) => !r.pass);
      assert.equal(hasFailure, true, "should detect 新会话入口 in README");
    } finally {
      fs.writeFileSync(readmePath, original, "utf-8");
    }
  });

  it("detects single-side update (only CLAUDE.md changed)", () => {
    const ROOT = path.resolve(__dirname, "../../..");
    const claudePath = path.join(ROOT, "CLAUDE.md");
    const original = fs.readFileSync(claudePath, "utf-8");

    try {
      // 只修改 CLAUDE.md 共享区
      const broken = original.replace(
        "gate:preproduction",
        "gate:preproduction\n单边更新测试",
      );
      fs.writeFileSync(claudePath, broken, "utf-8");

      const results = validateAgentContracts();
      const blockCheck = results.find(
        (r) => r.rule === "shared-blocks-identical",
      );
      assert.ok(blockCheck, "should have block check");
      assert.equal(
        blockCheck.pass,
        false,
        "should detect single-side update",
      );
    } finally {
      fs.writeFileSync(claudePath, original, "utf-8");
    }
  });

  it("detects production composition in lab entry", () => {
    const ROOT = path.resolve(__dirname, "../../..");
    const labPath = path.join(ROOT, "src/lab.tsx");
    const original = fs.readFileSync(labPath, "utf-8");

    try {
      // 在 lab entry 中注入正式 Composition
      const broken = original.replace(
        "registerRoot(LabRoot);",
        `// @ts-ignore\nconst KnowledgeVideo = () => null;\nregisterRoot(LabRoot);`,
      );
      // 改用直接注入 id
      const broken2 = broken + '\n// id="KnowledgeVideo"\n';
      // 实际上需要在 JSX 中注入，这里用字符串检查
      const broken3 = original.replace(
        "registerRoot(LabRoot);",
        `<Composition id="KnowledgeVideo" component={null as any} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{}} />\nregisterRoot(LabRoot);`,
      );
      fs.writeFileSync(labPath, broken3, "utf-8");

      const results = validateAgentContracts();
      const labCheck = results.find(
        (r) => r.rule === "lab-no-production-composition",
      );
      assert.ok(labCheck, "should have lab check");
      assert.equal(
        labCheck.pass,
        false,
        "should detect production composition in lab",
      );
    } finally {
      fs.writeFileSync(labPath, original, "utf-8");
    }
  });
});
