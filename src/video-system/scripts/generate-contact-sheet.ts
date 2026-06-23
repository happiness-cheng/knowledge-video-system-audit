#!/usr/bin/env npx tsx
/**
 * Contact Sheet 生成脚本
 *
 * 将关键帧合成为单张 contact sheet 图片。
 * 用于审片：快速预览全片节奏和手机端缩放效果。
 *
 * 用法：
 *   npx tsx src/video-system/scripts/generate-contact-sheet.ts
 *   npx tsx src/video-system/scripts/generate-contact-sheet.ts --mobile
 *   npx tsx src/video-system/scripts/generate-contact-sheet.ts --input-dir=out/keyframes/with-subtitles --output=out/keyframes/contact_sheet_with_subtitles.jpg
 */

import * as fs from "node:fs";
import * as path from "node:path";
import sharp from "sharp";

// ─── 参数 ─────────────────────────────────────────
const args = process.argv.slice(2);
const isMobile = args.includes("--mobile");
const inputDirArg = args
  .find((a) => a.startsWith("--input-dir="))
  ?.split("=")[1];
const outputArg = args.find((a) => a.startsWith("--output="))?.split("=")[1];

// ─── 路径 ─────────────────────────────────────────
const KEYFRAME_DIR = inputDirArg
  ? path.resolve(inputDirArg)
  : isMobile
    ? path.resolve(__dirname, "../../../out/keyframes/mobile")
    : path.resolve(__dirname, "../../../out/keyframes");
const OUTPUT_PATH = outputArg
  ? path.resolve(outputArg)
  : isMobile
    ? path.resolve(
        __dirname,
        "../../../out/keyframes/mobile_scaled_contact_sheet.jpg",
      )
    : path.resolve(__dirname, "../../../out/keyframes/contact_sheet.jpg");

// ─── 布局配置 ─────────────────────────────────────
const TILE_WIDTH = isMobile ? 390 : 480;
const TILE_HEIGHT = isMobile ? 693 : 270;
const LABEL_HEIGHT = 28;
const TILE_GAP = 8;
const COLS = 4;
const BG_COLOR = { r: 24, g: 24, b: 24, alpha: 1 };

interface TileInfo {
  file: string;
  label: string;
}

function extractLabel(filename: string): string {
  // "S01-cover-hook.png" → "S01"
  // "00s.png" → "00s"
  const base = path.basename(filename, path.extname(filename));
  const match = base.match(/^(S\d+)/i);
  if (match) return match[1];
  return base.replace(/-mobile$/, "").replace(/[^a-zA-Z0-9_-]/g, "");
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function main() {
  if (!fs.existsSync(KEYFRAME_DIR)) {
    console.error(`\n❌ 关键帧目录不存在: ${KEYFRAME_DIR}`);
    console.error(
      "请先运行 npm run capture:keyframes" + (isMobile ? ":mobile" : ""),
    );
    process.exit(1);
  }

  const files = fs
    .readdirSync(KEYFRAME_DIR)
    .filter((f) => f.endsWith(".png") && !f.includes("contact_sheet"))
    .sort();

  if (files.length === 0) {
    console.error(`\n❌ 关键帧目录为空: ${KEYFRAME_DIR}`);
    process.exit(1);
  }

  const tiles: TileInfo[] = files.map((f) => ({
    file: path.join(KEYFRAME_DIR, f),
    label: extractLabel(f),
  }));

  const rows = Math.ceil(tiles.length / COLS);
  const canvasWidth = COLS * TILE_WIDTH + (COLS + 1) * TILE_GAP;
  const canvasHeight =
    rows * (TILE_HEIGHT + LABEL_HEIGHT) + (rows + 1) * TILE_GAP;

  // 构建 composite 操作
  const composites: sharp.OverlayOptions[] = [];

  for (let i = 0; i < tiles.length; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = TILE_GAP + col * (TILE_WIDTH + TILE_GAP);
    const y = TILE_GAP + row * (TILE_HEIGHT + LABEL_HEIGHT + TILE_GAP);

    // 缩放关键帧到 tile 尺寸
    const resized = await sharp(tiles[i].file)
      .resize(TILE_WIDTH, TILE_HEIGHT, {
        fit: isMobile ? "contain" : "cover",
        background: BG_COLOR,
      })
      .toBuffer();

    composites.push({ input: resized, left: x, top: y });

    // 标签
    const labelSvg = Buffer.from(
      `<svg width="${TILE_WIDTH}" height="${LABEL_HEIGHT}">
        <text x="${TILE_WIDTH / 2}" y="20" text-anchor="middle"
              font-family="monospace" font-size="16" fill="#CCCCCC">
          ${escapeXml(tiles[i].label)}
        </text>
      </svg>`,
    );
    composites.push({ input: labelSvg, left: x, top: y + TILE_HEIGHT });
  }

  // 创建画布并合成
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  const canvas = sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background: BG_COLOR,
    },
  });

  await canvas.composite(composites).jpeg({ quality: 85 }).toFile(OUTPUT_PATH);

  console.log(`\n✅ contact sheet 生成完成`);
  console.log(`   输入: ${tiles.length} 张关键帧`);
  console.log(`   输出: ${OUTPUT_PATH}`);
  console.log(`   尺寸: ${canvasWidth}x${canvasHeight}`);
}

main().catch((err) => {
  console.error(`\n❌ 生成失败: ${err.message}`);
  process.exit(1);
});
