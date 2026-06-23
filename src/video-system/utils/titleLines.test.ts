import test from "node:test";
import assert from "node:assert/strict";
import { formatTitleLines } from "./titleLines";

test("formatTitleLines keeps explicit title line breaks", () => {
  assert.deepEqual(formatTitleLines("它修 Bug，\n像拆家"), [
    "它修 Bug，",
    "像拆家",
  ]);
});

test("formatTitleLines avoids splitting a two-character phrase into an orphan line", () => {
  assert.deepEqual(formatTitleLines("它修 Bug，像拆家", { maxCharsPerLine: 10 }), [
    "它修 Bug，",
    "像拆家",
  ]);
});

test("formatTitleLines does not leave punctuation as a standalone line", () => {
  const lines = formatTitleLines("为什么别人用 Claude Code 像开挂？", {
    maxCharsPerLine: 14,
  });
  assert.ok(lines.every((line) => !/^[，。！？、；：]$/.test(line)));
});

test("formatTitleLines avoids weak words at the start of wrapped lines", () => {
  const lines = formatTitleLines("这是一个和大家有关的问题", {
    maxCharsPerLine: 5,
  });
  assert.ok(lines.every((line) => !/^[的了与和或等及]/.test(line)));
});

test("formatTitleLines keeps short semantic phrases such as 缺少管理 together", () => {
  const lines = formatTitleLines("Claude Code 不是不能用，是缺少管理", {
    maxCharsPerLine: 14,
  });
  assert.ok(lines.includes("是缺少管理"));
  assert.ok(lines.every((line) => !/^少管理/.test(line)));
});

test("formatTitleLines does not split inside ASCII words", () => {
  const lines = formatTitleLines("为什么别人用 Claude Code 像开挂？", {
    maxCharsPerLine: 14,
  });
  assert.ok(lines.every((line) => !/Clau$|^de\b/.test(line)));
});
