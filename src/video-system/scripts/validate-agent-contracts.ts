#!/usr/bin/env npx tsx
/**
 * validate-agent-contracts.ts
 *
 * 检查 CLAUDE.md 和 AGENTS.md 的 V2 共享核心区一致性。
 *
 * 检查项：
 * 1. 两个入口文件存在
 * 2. 共享标记存在且唯一
 * 3. 两个共享区逐字符相同
 * 4. 必需关键词和 V2 文件引用齐全
 * 5. 禁止旧表述不存在
 * 6. 两个入口都引用共享契约
 * 7. 共享契约文件存在
 */

import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(__dirname, "../../..");

interface CheckResult {
  rule: string;
  pass: boolean;
  message: string;
}

const REQUIRED_KEYWORDS = [
  "制作前硬门禁",
  "Revision Router",
  "SHA-256",
  "candidate",
  "promotion",
  "reviewerSystem",
  "approvedByUser",
];

const FORBIDDEN_PHRASES = [
  "00-16 共 17 个 prompt",
  "最终封面由 Remotion 模板渲染",
  "P1 执行默认边界",
  "P0 已落地路径",
];

const REQUIRED_FILE_REFS = ["docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md"];

function extractSharedBlock(content: string): string | null {
  const begin = "<!-- BEGIN SHARED_V2_CONTRACT -->";
  const end = "<!-- END SHARED_V2_CONTRACT -->";
  const startIdx = content.indexOf(begin);
  const endIdx = content.indexOf(end);
  if (startIdx === -1 || endIdx === -1) return null;
  return content.substring(startIdx + begin.length, endIdx).trim();
}

function checkFileExists(relPath: string): boolean {
  return fs.existsSync(path.join(ROOT, relPath));
}

function countOccurrences(haystack: string, needle: string): number {
  let count = 0;
  let pos = 0;
  while (true) {
    const idx = haystack.indexOf(needle, pos);
    if (idx === -1) break;
    count++;
    pos = idx + needle.length;
  }
  return count;
}

export function validateAgentContracts(): CheckResult[] {
  const results: CheckResult[] = [];

  // 1. Two entry files exist
  const claudeExists = checkFileExists("CLAUDE.md");
  const agentsExists = checkFileExists("AGENTS.md");
  results.push({
    rule: "entry-files-exist",
    pass: claudeExists && agentsExists,
    message:
      claudeExists && agentsExists
        ? "CLAUDE.md and AGENTS.md both exist"
        : `Missing: ${!claudeExists ? "CLAUDE.md " : ""}${!agentsExists ? "AGENTS.md" : ""}`,
  });

  if (!claudeExists || !agentsExists) return results;

  const claudeContent = fs.readFileSync(path.join(ROOT, "CLAUDE.md"), "utf-8");
  const agentsContent = fs.readFileSync(path.join(ROOT, "AGENTS.md"), "utf-8");

  // 2. Shared markers exist and unique
  for (const [name, content] of [
    ["CLAUDE.md", claudeContent],
    ["AGENTS.md", agentsContent],
  ] as const) {
    const beginCount = countOccurrences(
      content,
      "<!-- BEGIN SHARED_V2_CONTRACT -->",
    );
    const endCount = countOccurrences(
      content,
      "<!-- END SHARED_V2_CONTRACT -->",
    );
    results.push({
      rule: `shared-markers-unique-${name}`,
      pass: beginCount === 1 && endCount === 1,
      message: `${name}: BEGIN=${beginCount}, END=${endCount}`,
    });
  }

  // 3. Shared blocks are identical
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

  // 4. Required keywords present
  const combined = claudeContent + agentsContent;
  for (const kw of REQUIRED_KEYWORDS) {
    const inClaude = claudeContent.includes(kw);
    const inAgents = agentsContent.includes(kw);
    results.push({
      rule: `keyword-${kw}`,
      pass: inClaude && inAgents,
      message: `"${kw}": CLAUDE=${inClaude}, AGENTS=${inAgents}`,
    });
  }

  // 5. Forbidden phrases absent
  for (const phrase of FORBIDDEN_PHRASES) {
    const inClaude = claudeContent.includes(phrase);
    const inAgents = agentsContent.includes(phrase);
    results.push({
      rule: `forbidden-${phrase.substring(0, 20)}`,
      pass: !inClaude && !inAgents,
      message: `"${phrase}": CLAUDE=${inClaude}, AGENTS=${inAgents} (should be false)`,
    });
  }

  // 6. Both reference shared contract file
  for (const [name, content] of [
    ["CLAUDE.md", claudeContent],
    ["AGENTS.md", agentsContent],
  ] as const) {
    const refs = content.includes("docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md");
    results.push({
      rule: `refs-contract-${name}`,
      pass: refs,
      message: `${name} references shared contract: ${refs}`,
    });
  }

  // 7. Shared contract file exists
  const contractExists = checkFileExists(
    "docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md",
  );
  results.push({
    rule: "contract-file-exists",
    pass: contractExists,
    message: `docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md exists: ${contractExists}`,
  });

  // 8. Required file references in shared block
  if (claudeBlock) {
    for (const ref of REQUIRED_FILE_REFS) {
      const present = claudeBlock.includes(ref);
      results.push({
        rule: `ref-${path.basename(ref)}`,
        pass: present,
        message: `Shared block references "${ref}": ${present}`,
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
