#!/usr/bin/env npx tsx
/**
 * Generate a text-only packet for independent external AI reviews.
 * It copies the exact reviewed inputs and emits one review JSON template.
 * It never creates scores, reviews, consensus or user approval.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import {
  calculateReviewedInputDigest,
  readPreProductionReview,
  sha256File,
  REQUIRED_DIMENSIONS,
} from "../utils/preProductionGate";

const root = path.resolve(__dirname, "../../..");
const reviewPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, "../data/preProductionReview.json");
const outputDir = process.argv[3]
  ? path.resolve(process.argv[3])
  : path.resolve(root, "out/preproduction-review-packet");

function safeName(index: number, id: string, sourcePath: string): string {
  const ext = path.extname(sourcePath) || ".txt";
  return `${String(index + 1).padStart(2, "0")}_${id}${ext}`;
}

function main() {
  const review = readPreProductionReview(reviewPath);
  const digest = calculateReviewedInputDigest(review.reviewedInputs);
  const errors: string[] = [];

  for (const input of review.reviewedInputs) {
    const absolute = path.resolve(root, input.path);
    if (!fs.existsSync(absolute)) {
      errors.push(`missing reviewed input: ${input.path}`);
      continue;
    }
    const actual = sha256File(absolute);
    if (actual !== input.sha256.toLowerCase()) {
      errors.push(`${input.id}: reviewed input hash changed`);
    }
  }
  if (errors.length > 0) {
    throw new Error(`REVIEW PACKET BLOCKED\n- ${errors.join("\n- ")}`);
  }

  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });

  const copied: Array<{ id: string; file: string; source: string; sha256: string }> = [];
  review.reviewedInputs.forEach((input, index) => {
    const absolute = path.resolve(root, input.path);
    const file = safeName(index, input.id, input.path);
    fs.copyFileSync(absolute, path.join(outputDir, file));
    copied.push({ id: input.id, file, source: input.path, sha256: input.sha256 });
  });

  const template = {
    reviewerId: "REPLACE_WITH_UNIQUE_ID",
    reviewerSystem: "REPLACE_WITH_PROVIDER_AND_MODEL",
    role: "cold-viewer",
    independent: true,
    reviewedInputDigest: digest,
    score: 0,
    dimensions: Object.entries(REQUIRED_DIMENSIONS).map(([id, maxScore]) => ({
      id,
      score: 0,
      maxScore,
      evidence: ["引用被审材料中的具体内容，不写空泛印象"],
      gaps: [],
      action: "给出最小、可执行的修改动作；无需修改时写‘保持’",
    })),
    hardVetoes: [],
    recommendation: "revise",
    reviewedAt: new Date().toISOString(),
  };
  fs.writeFileSync(
    path.join(outputDir, "review-template.json"),
    `${JSON.stringify(template, null, 2)}\n`,
  );

  const roles = review.mode === "quick"
    ? ["cold-viewer", "content-editor", "fact-evidence"]
    : ["cold-viewer", "content-editor", "fact-evidence", "visual-audio-director"];

  const markdown = `# Independent Pre-production Review Packet\n\n## Immutable snapshot\n\n- projectId: \`${review.projectId}\`\n- mode: \`${review.mode}\`\n- reviewedInputDigest: \`${digest}\`\n- required roles: ${roles.map((item) => `\`${item}\``).join(", ")}\n\n所有审查者必须只审查本目录内的同一组材料，不得先阅读其他审查者答案。不要修改材料后继续沿用本 digest。\n\n## Files\n\n${copied.map((item) => `- \`${item.file}\` ← \`${item.source}\`  \n  SHA-256: \`${item.sha256}\``).join("\n")}\n\n## Reviewer task\n\n1. 选择一个尚未被占用的角色，并如实填写 \`reviewerSystem\`（服务商 + 模型名）。\n2. 从该角色视角独立审查，但仍需填写全部九个维度。\n3. 每个维度必须引用具体证据、指出缺口并给出动作。\n4. 发现以下任一问题，写入 \`hardVetoes\`：核心事实错误、反例推翻主命题、关键证据缺失、标题承诺未兑现、范围无法在时长内完成、关键边界缺失会误导行动。\n5. 不得因为画面以后“可以做得更好”而给未实现内容加分。\n6. 不得因为自己熟悉术语而替冷启动观众假设理解。\n7. 输出一个 JSON 对象，结构严格参考 \`review-template.json\`。\n8. \`score\` 必须等于九个维度之和；\`recommendation\` 只能是 \`pass | revise | split | stop\`。\n9. 只有确实达到 90 分门槛且无 veto 时才推荐 \`pass\`，不要凑 90 分。\n\n## Role focus\n\n- **cold-viewer**：是否会点、前 15 秒是否愿意继续、是否听得懂、是否快速觉得“和我有关”。\n- **content-editor**：是否讲全、讲好、讲透，结构是否递进，有没有重复和承诺缺口。\n- **fact-evidence**：事实、实验、来源、限定词、反例、边界是否可靠。\n- **visual-audio-director**：画面是否真正参与讲解、口播与视觉事件是否可同步、当前组件是否可执行。\n\n## Pass policy\n\n系统最终还会机械校验：均分 ≥ 90、中位数 ≥ 90、最低分 ≥ 85、分差 ≤ 8、关键维度阈值、角色齐全、无 veto、所有 recommendation=pass，以及用户明确批准。任何一项不满足都不能进入 Agent 制作。\n`;
  fs.writeFileSync(path.join(outputDir, "REVIEW_PACKET.md"), markdown);

  const manifest = {
    schemaVersion: "1.0",
    generatedAt: new Date().toISOString(),
    projectId: review.projectId,
    mode: review.mode,
    reviewedInputDigest: digest,
    files: copied,
  };
  fs.writeFileSync(
    path.join(outputDir, "packet-manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  console.log(`Review packet generated: ${outputDir}`);
  console.log(`reviewedInputDigest: ${digest}`);
  console.log("No review score or user approval was generated.");
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
