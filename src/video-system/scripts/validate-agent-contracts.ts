#!/usr/bin/env npx tsx
/**
 * validate-agent-contracts.ts
 *
 * 检查 CLAUDE.md、AGENTS.md 和其他入口文档的 V2 契约一致性。
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";

const DEFAULT_ROOT = path.resolve(__dirname, "../../..");

export interface CheckResult {
  rule: string;
  pass: boolean;
  message: string;
}

const REQUIRED_KEYWORDS = [
  "gate:preproduction",
  "Revision Router",
  "promotion",
  "review-candidate",
  "approvedByUser",
  "capabilityRegistry",
];

const FORBIDDEN_PHRASES = [
  "00-16 共 17 个 prompt",
  "最终封面由 Remotion 模板渲染",
  "P1 执行默认边界",
  "P0 已落地路径",
];

const REQUIRED_FILE_REFS = ["docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md"];

const OLD_FLOW_PATTERNS = [
  /contentBrief\.json.*→.*videoSpec\.json.*→.*TTS.*→.*MP4/s,
  /新会话入口文件/,
  /改这个文件来制作新视频/,
  /改这个做新视频/,
  /13 个提示词文件/,
  /00-16 共 17 个/,
  /直接改 videoSpec/,
];

// Lab entry 允许注册的 Composition ID
const LAB_COMPOSITION_ALLOWLIST = [
  "PremiumMotionLab",
  "ExperimentVersionVideo",
  "UltimateMotionSystemLab",
  "PromptCompletionExplainer",
  "AiPromptWrongVisualExplanationSplice",
  "ThemeComparison",
  "KnowledgeVideoLabDemo",
  "AudienceValidationProjectResetShot",
  "AudienceValidationRepeatedContextDumpShot",
  "TriggerFrameVariantA",
  "TriggerFrameVariantB",
  "TriggerFrameVariantC",
  "CodeSceneFixture",
  "DiffSceneFixture",
  "TerminalSceneFixture",
  "ImageHeroSceneFixture",
  "GanttSceneFixture",
  "SpotlightCueFixture",
  "StrikeAndReplaceFixture",
  "ConceptFlowFixture",
  "StateTransitionFixture",
  "MapLightUpFixture",
  "PathComparisonFixture",
  "PressureBuildFixture",
  "ConfusedToGuidedFixture",
];

// 正式 Composition ID（不得出现在 lab entry）
const PRODUCTION_COMPOSITION_IDS = [
  "KnowledgeVideo",
  "KnowledgeVideoWithSubtitles",
  "KnowledgeVideoPortrait",
  "KnowledgeVideoWithSubtitlesPortrait",
  "CoverImage",
  "CoverImage3x4",
  "CoverImage4x3",
];

function normalizeLineEndings(s: string): string {
  return s.replace(/\r\n/g, "\n");
}

function extractSharedBlock(content: string): string | null {
  const begin = "<!-- BEGIN SHARED_V2_CONTRACT -->";
  const end = "<!-- END SHARED_V2_CONTRACT -->";
  const startIdx = content.indexOf(begin);
  const endIdx = content.indexOf(end);
  if (startIdx === -1 || endIdx === -1) return null;
  return content.substring(startIdx + begin.length, endIdx).trim();
}

function sha256(s: string): string {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function extractCompositionIds(content: string): string[] {
  const ids: string[] = [];
  const re = /id\s*=\s*"([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    ids.push(m[1]);
  }
  return ids;
}

export function validateAgentContracts(rootDir = DEFAULT_ROOT): CheckResult[] {
  const results: CheckResult[] = [];

  const checkFile = (rel: string) => fs.existsSync(path.join(rootDir, rel));
  const readFile = (rel: string): string | null => {
    const p = path.join(rootDir, rel);
    return fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : null;
  };

  // 1. Entry files exist
  const claudeExists = checkFile("CLAUDE.md");
  const agentsExists = checkFile("AGENTS.md");
  results.push({
    rule: "entry-files-exist",
    pass: claudeExists && agentsExists,
    message:
      claudeExists && agentsExists
        ? "CLAUDE.md and AGENTS.md both exist"
        : `Missing: ${!claudeExists ? "CLAUDE.md " : ""}${!agentsExists ? "AGENTS.md" : ""}`,
  });
  if (!claudeExists || !agentsExists) return results;

  const claudeRaw = readFile("CLAUDE.md")!;
  const agentsRaw = readFile("AGENTS.md")!;
  const claudeContent = normalizeLineEndings(claudeRaw);
  const agentsContent = normalizeLineEndings(agentsRaw);

  // 2. Shared markers exist and unique
  for (const [name, content] of [
    ["CLAUDE.md", claudeContent],
    ["AGENTS.md", agentsContent],
  ] as const) {
    const b = (content.match(/<!-- BEGIN SHARED_V2_CONTRACT -->/g) || [])
      .length;
    const e = (content.match(/<!-- END SHARED_V2_CONTRACT -->/g) || []).length;
    results.push({
      rule: `shared-markers-unique-${name}`,
      pass: b === 1 && e === 1,
      message: `${name}: BEGIN=${b}, END=${e}`,
    });
  }

  // 3. Shared blocks identical + hash
  const claudeBlock = extractSharedBlock(claudeContent);
  const agentsBlock = extractSharedBlock(agentsContent);
  const blocksIdentical =
    claudeBlock !== null && agentsBlock !== null && claudeBlock === agentsBlock;
  results.push({
    rule: "shared-blocks-identical",
    pass: blocksIdentical,
    message: blocksIdentical
      ? "Shared V2 contract blocks are identical"
      : "Shared V2 contract blocks differ between CLAUDE.md and AGENTS.md",
  });

  // 3b. Shared block hash
  if (claudeBlock && agentsBlock) {
    const claudeHash = sha256(claudeBlock);
    const agentsHash = sha256(agentsBlock);
    const hashesMatch = claudeHash === agentsHash;
    results.push({
      rule: "shared-block-hash-match",
      pass: hashesMatch,
      message: hashesMatch
        ? `Shared block SHA-256: ${claudeHash}`
        : `Hash mismatch: CLAUDE=${claudeHash} AGENTS=${agentsHash}`,
    });
  }

  // 4. Required keywords
  for (const kw of REQUIRED_KEYWORDS) {
    const inC = claudeContent.includes(kw);
    const inA = agentsContent.includes(kw);
    results.push({
      rule: `keyword-${kw}`,
      pass: inC && inA,
      message: `"${kw}": CLAUDE=${inC}, AGENTS=${inA}`,
    });
  }

  // 5. Forbidden phrases
  for (const phrase of FORBIDDEN_PHRASES) {
    const inC = claudeContent.includes(phrase);
    const inA = agentsContent.includes(phrase);
    results.push({
      rule: `forbidden-${phrase.substring(0, 20)}`,
      pass: !inC && !inA,
      message: `"${phrase}": CLAUDE=${inC}, AGENTS=${inA} (should be false)`,
    });
  }

  // 6. Both reference shared contract
  for (const [name, content] of [
    ["CLAUDE.md", claudeContent],
    ["AGENTS.md", agentsContent],
  ] as const) {
    results.push({
      rule: `refs-contract-${name}`,
      pass: content.includes("docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md"),
      message: `${name} references shared contract`,
    });
  }

  // 7. Shared contract file exists
  results.push({
    rule: "contract-file-exists",
    pass: checkFile("docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md"),
    message: "docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md exists",
  });

  // 8. Required file refs in shared block
  if (claudeBlock) {
    for (const ref of REQUIRED_FILE_REFS) {
      results.push({
        rule: `ref-${path.basename(ref)}`,
        pass: claudeBlock.includes(ref),
        message: `Shared block references "${ref}"`,
      });
    }
  }

  // 9. README no old flow
  const readmeContent = readFile("src/video-system/README.md");
  if (readmeContent) {
    for (const pattern of OLD_FLOW_PATTERNS) {
      const match = readmeContent.match(pattern);
      results.push({
        rule: `readme-no-old-flow-${pattern.source.substring(0, 20)}`,
        pass: !match,
        message: match
          ? `README contains old flow: "${match[0].substring(0, 40)}..."`
          : `README clean: ${pattern.source.substring(0, 30)}`,
      });
    }
    const refsRoot =
      readmeContent.includes("CLAUDE.md") ||
      readmeContent.includes("AGENTS.md");
    const refsContract = readmeContent.includes(
      "docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md",
    );
    results.push({
      rule: "readme-refs-root-entry",
      pass: refsRoot || refsContract,
      message: `README refs: root=${refsRoot}, contract=${refsContract}`,
    });
  } else {
    results.push({
      rule: "readme-exists",
      pass: false,
      message: "src/video-system/README.md does not exist",
    });
  }

  // 10. Lab entry isolation
  const labContent = readFile("src/lab.tsx");
  const rootContent = readFile("src/Root.tsx");
  results.push({
    rule: "lab-entry-exists",
    pass: labContent !== null,
    message: `src/lab.tsx exists: ${labContent !== null}`,
  });

  if (labContent) {
    // Lab must use registerRoot
    results.push({
      rule: "lab-uses-register-root",
      pass: labContent.includes("registerRoot(LabRoot)"),
      message: "src/lab.tsx uses registerRoot(LabRoot)",
    });

    // Lab must not register production compositions
    const labIds = extractCompositionIds(labContent);
    const leakedProduction = labIds.filter((id) =>
      PRODUCTION_COMPOSITION_IDS.includes(id),
    );
    results.push({
      rule: "lab-no-production-composition",
      pass: leakedProduction.length === 0,
      message:
        leakedProduction.length === 0
          ? `Lab has ${labIds.length} compositions, none are production`
          : `Lab registers production compositions: ${leakedProduction.join(", ")}`,
    });

    // All lab composition IDs must be in allowlist
    const unknownIds = labIds.filter(
      (id) => !LAB_COMPOSITION_ALLOWLIST.includes(id),
    );
    results.push({
      rule: "lab-all-compositions-in-allowlist",
      pass: unknownIds.length === 0,
      message:
        unknownIds.length === 0
          ? `All ${labIds.length} lab compositions in allowlist`
          : `Unknown lab compositions: ${unknownIds.join(", ")}`,
    });
  }

  // 11. studio:lab uses lab.tsx
  const pkgContent = readFile("package.json");
  if (pkgContent) {
    try {
      const pkg = JSON.parse(pkgContent);
      const cmd = pkg.scripts?.["studio:lab"] || "";
      const usesLabTsx = cmd.includes("src/lab.tsx");
      results.push({
        rule: "studio-lab-uses-lab-entry",
        pass: usesLabTsx,
        message: `studio:lab uses src/lab.tsx: ${usesLabTsx} (cmd: "${cmd}")`,
      });
    } catch {
      results.push({
        rule: "studio-lab-parse",
        pass: false,
        message: "Failed to parse package.json",
      });
    }
  }

  return results;
}

// CLI entry
if (require.main === module) {
  const results = validateAgentContracts();
  const failures = results.filter((r) => !r.pass);

  console.log("\nAgent Contracts Validation");
  console.log("═".repeat(60));

  for (const r of results) {
    const icon = r.pass ? "✓" : "✗";
    console.log(`${icon} [${r.rule}] ${r.message}`);
  }

  console.log("\n" + "─".repeat(60));
  if (failures.length > 0) {
    console.log(`FAIL: ${failures.length} checks failed`);
    process.exit(1);
  } else {
    console.log("PASS: all checks passed");
    process.exit(0);
  }
}
