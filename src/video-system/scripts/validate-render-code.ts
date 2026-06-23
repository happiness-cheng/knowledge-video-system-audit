#!/usr/bin/env npx tsx
/**
 * 渲染代码验证脚本
 *
 * 扫描 scenes/ 和 components/ 下的 .tsx 文件，检查：
 * 1. 禁止 CSS transitions/animations（Remotion 不支持）
 * 2. 必须使用 useCurrentFrame
 * 3. 必须使用 interpolate/spring 或动画工具函数
 * 4. KnowledgeVideo.tsx 和 KnowledgeVideoWithSubtitles.tsx 必须导入 TransitionSeries
 * 5. 警告：scene 组件没有任何动画逻辑（纯静态 JSX）
 *
 * 用法：npx tsx src/video-system/scripts/validate-render-code.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ─── 路径 ─────────────────────────────────────────
const SCENES_DIR = path.resolve(__dirname, "../scenes");
const COMPONENTS_DIR = path.resolve(__dirname, "../components");
const COMPOSITIONS_DIR = path.resolve(__dirname, "../compositions");

// ─── 常量 ─────────────────────────────────────────

/** 禁止的 CSS transition/animation 模式 */
const BANNED_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /transition\s*:/, label: "transition:" },
  { pattern: /animation\s*:/, label: "animation:" },
  { pattern: /@keyframes/, label: "@keyframes" },
  { pattern: /transition-all/, label: "transition-all" },
  { pattern: /transition-none/, label: "transition-none" },
  { pattern: /duration-\d/, label: "duration-[0-9]" },
  { pattern: /ease-in/, label: "ease-in" },
  { pattern: /ease-out/, label: "ease-out" },
  { pattern: /animate-pulse/, label: "animate-pulse" },
  { pattern: /animate-spin/, label: "animate-spin" },
  { pattern: /animate-bounce/, label: "animate-bounce" },
];

/** 动画工具函数模式 */
const ANIMATION_UTIL_PATTERNS = [
  /import.*\binterpolate\b/,
  /import.*\bspring\b/,
  /from\s+["']\.\.\/utils\/animation["']/,
  /from\s+["']remotion["']/,
];

// ─── 类型 ─────────────────────────────────────────

interface CheckResult {
  level: "error" | "warning";
  rule: string;
  message: string;
  files?: string[];
}

// ─── 工具函数 ─────────────────────────────────────

function getTsxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => path.join(dir, f));
}

function readCode(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

function relativePath(filePath: string): string {
  return path.relative(path.resolve(__dirname, ".."), filePath);
}

// ─── 检查函数 ─────────────────────────────────────

function checkBannedPatterns(files: string[]): CheckResult[] {
  const results: CheckResult[] = [];
  for (const banned of BANNED_PATTERNS) {
    const hitFiles: string[] = [];

    for (const file of files) {
      const code = readCode(file);
      const lines = code.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // 跳过注释行
        if (line.trim().startsWith("//") || line.trim().startsWith("*"))
          continue;
        if (banned.pattern.test(line)) {
          hitFiles.push(`${relativePath(file)}:${i + 1}`);
        }
      }
    }

    if (hitFiles.length > 0) {
      results.push({
        level: "error",
        rule: `banned-css-${banned.label}`,
        message: `检测到禁止的 CSS 模式 "${banned.label}"（Remotion 不支持 CSS transitions/animations）`,
        files: hitFiles,
      });
    }
  }

  return results;
}

function checkUseCurrentFrame(sceneFiles: string[]): CheckResult[] {
  const results: CheckResult[] = [];
  const missing: string[] = [];

  for (const file of sceneFiles) {
    const code = readCode(file);
    // SceneRenderer.tsx 不直接使用 useCurrentFrame，跳过
    if (path.basename(file) === "SceneRenderer.tsx") continue;
    if (!code.includes("useCurrentFrame")) {
      missing.push(relativePath(file));
    }
  }

  if (missing.length > 0) {
    results.push({
      level: "error",
      rule: "missing-useCurrentFrame",
      message: `${missing.length} 个 scene 组件未使用 useCurrentFrame（Remotion 要求用帧驱动动画）`,
      files: missing,
    });
  }

  return results;
}

function checkAnimationUtils(sceneFiles: string[]): CheckResult[] {
  const results: CheckResult[] = [];
  const missing: string[] = [];

  for (const file of sceneFiles) {
    const code = readCode(file);
    // SceneRenderer.tsx 是分发器，不直接做动画
    if (path.basename(file) === "SceneRenderer.tsx") continue;

    const hasAnimUtil = ANIMATION_UTIL_PATTERNS.some((p) => p.test(code));
    if (!hasAnimUtil) {
      missing.push(relativePath(file));
    }
  }

  if (missing.length > 0) {
    results.push({
      level: "warning",
      rule: "no-animation-import",
      message: `${missing.length} 个 scene 组件未导入 interpolate/spring 等动画工具`,
      files: missing,
    });
  }

  return results;
}

function checkTransitionSeries(): CheckResult[] {
  const results: CheckResult[] = [];
  const targetFiles = [
    path.join(COMPOSITIONS_DIR, "KnowledgeVideo.tsx"),
    path.join(COMPOSITIONS_DIR, "KnowledgeVideoWithSubtitles.tsx"),
  ];

  const missing: string[] = [];

  for (const file of targetFiles) {
    if (!fs.existsSync(file)) continue;
    const code = readCode(file);
    if (!code.includes("TransitionSeries")) {
      missing.push(relativePath(file));
    }
  }

  if (missing.length > 0) {
    results.push({
      level: "error",
      rule: "missing-transition-series",
      message: `以下 Composition 未导入 TransitionSeries（场景切换需要）`,
      files: missing,
    });
  }

  return results;
}

function checkStaticScenes(sceneFiles: string[]): CheckResult[] {
  const results: CheckResult[] = [];
  const staticScenes: string[] = [];

  for (const file of sceneFiles) {
    const name = path.basename(file);
    // 跳过分发器
    if (name === "SceneRenderer.tsx") continue;

    const code = readCode(file);

    // 检查是否有任何动画逻辑
    const hasInterpolate = /interpolate\s*\(/.test(code);
    const hasSpring = /spring\s*\(/.test(code);
    const hasFrameBasedLogic =
      /useCurrentFrame/.test(code) &&
      (/frame\s*[><=]/.test(code) ||
        /interpolate/.test(code) ||
        /spring/.test(code) ||
        /fadeSlideIn|slowZoom|slideUp|progressiveReveal|highlightCurrent|typewriter|wordHighlight/.test(
          code,
        ));

    if (!hasInterpolate && !hasSpring && !hasFrameBasedLogic) {
      staticScenes.push(relativePath(file));
    }
  }

  if (staticScenes.length > 0) {
    results.push({
      level: "warning",
      rule: "static-scene-no-animation",
      message: `${staticScenes.length} 个 scene 组件没有任何动画逻辑（纯静态 JSX）`,
      files: staticScenes,
    });
  }

  return results;
}

// ─── 主流程 ───────────────────────────────────────

function main() {
  const sceneFiles = getTsxFiles(SCENES_DIR);
  const componentFiles = getTsxFiles(COMPONENTS_DIR);
  const allFiles = [...sceneFiles, ...componentFiles];

  console.log(`\n${"═".repeat(60)}`);
  console.log("渲染代码验证");
  console.log("═".repeat(60));
  console.log(`扫描目录:`);
  console.log(`  scenes/: ${sceneFiles.length} 个 .tsx 文件`);
  console.log(`  components/: ${componentFiles.length} 个 .tsx 文件`);

  const allResults: CheckResult[] = [
    ...checkBannedPatterns(allFiles),
    ...checkUseCurrentFrame(sceneFiles),
    ...checkAnimationUtils(sceneFiles),
    ...checkTransitionSeries(),
    ...checkStaticScenes(sceneFiles),
  ];

  const errors = allResults.filter((r) => r.level === "error");
  const warnings = allResults.filter((r) => r.level === "warning");

  for (const result of allResults) {
    const icon = result.level === "error" ? "❌" : "⚠️";
    console.log(`\n${icon} [${result.rule}] ${result.message}`);
    if (result.files) {
      const display = result.files.slice(0, 15);
      console.log(`   涉及: ${display.join(", ")}`);
      if (result.files.length > 15) {
        console.log(`   ... 共 ${result.files.length} 处`);
      }
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  if (errors.length > 0) {
    console.log(
      `\n结论: 发现 ${errors.length} 个错误，${warnings.length} 个警告`,
    );
    console.log("建议: 修复后重新检查");
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log(`\n结论: 发现 ${warnings.length} 个警告`);
    console.log("建议: 检查是否需要补充动画");
    process.exit(0);
  } else {
    console.log("\n结论: 渲染代码验证通过");
    process.exit(0);
  }
}

main();
