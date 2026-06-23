import test from "node:test";
import assert from "node:assert/strict";
import {
  assetIdToProcessedPath,
  toPublicStaticFilePath,
} from "./mediaPaths";

test("toPublicStaticFilePath removes public prefix variants", () => {
  assert.equal(
    toPublicStaticFilePath("public/assets/processed/x.png"),
    "assets/processed/x.png",
  );
  assert.equal(
    toPublicStaticFilePath("/public/assets/processed/x.png"),
    "assets/processed/x.png",
  );
  assert.equal(
    toPublicStaticFilePath("assets/processed/x.png"),
    "assets/processed/x.png",
  );
});

test("toPublicStaticFilePath normalizes windows separators", () => {
  assert.equal(
    toPublicStaticFilePath("public\\audio\\voiceover\\S01.mp3"),
    "audio/voiceover/S01.mp3",
  );
});

test("assetIdToProcessedPath builds a public-relative processed asset path", () => {
  assert.equal(
    assetIdToProcessedPath("xiaochen-thinking"),
    "assets/processed/xiaochen-thinking.png",
  );
});
