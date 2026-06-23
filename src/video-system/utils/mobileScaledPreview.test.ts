import test from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import sharp from "sharp";
import {
  createMobileScaledPreview,
  MOBILE_FEED_CANVAS,
} from "./mobileScaledPreview";

test("createMobileScaledPreview keeps a complete 16:9 frame inside a phone feed canvas", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mobile-preview-"));
  const input = path.join(dir, "source.png");
  const output = path.join(dir, "mobile.png");

  await sharp({
    create: {
      width: 1920,
      height: 1080,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      {
        input: Buffer.from(
          `<svg width="1920" height="1080">
            <rect x="0" y="0" width="40" height="1080" fill="#ff0000"/>
            <rect x="1880" y="0" width="40" height="1080" fill="#0000ff"/>
          </svg>`,
        ),
        left: 0,
        top: 0,
      },
    ])
    .png()
    .toFile(input);

  await createMobileScaledPreview(input, output);

  const metadata = await sharp(output).metadata();
  assert.equal(metadata.width, MOBILE_FEED_CANVAS.width);
  assert.equal(metadata.height, MOBILE_FEED_CANVAS.height);

  const raw = await sharp(output).raw().toBuffer();
  const channels = metadata.channels ?? 4;
  const scaledHeight = Math.round((MOBILE_FEED_CANVAS.width * 9) / 16);
  const y = MOBILE_FEED_CANVAS.frameTop + Math.floor(scaledHeight / 2);
  const leftPixel = (y * MOBILE_FEED_CANVAS.width + 0) * channels;
  const rightPixel = (y * MOBILE_FEED_CANVAS.width + 389) * channels;

  assert.equal(raw[leftPixel], 255);
  assert.equal(raw[leftPixel + 2], 0);
  assert.equal(raw[rightPixel], 0);
  assert.equal(raw[rightPixel + 2], 255);
});
