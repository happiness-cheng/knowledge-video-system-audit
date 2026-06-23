import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { execFileSync } from "node:child_process";

/**
 * CLI 门禁行为测试
 *
 * 验证 generate-audio 和 generate-subtitles 在门禁失败时
 * 不读取生产数据、不创建目录、不调用 Provider、不写出文件。
 */

const PROJECT_ROOT = path.resolve(__dirname, "../../..");

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "gate-behavior-test-"));
}

function runScript(
  scriptAbsPath: string,
  cwd: string,
): { stdout: string; stderr: string; exitCode: number } {
  try {
    const stdout = execFileSync("npx", ["tsx", scriptAbsPath], {
      cwd,
      encoding: "utf-8",
      timeout: 15000,
      env: { ...process.env },
      stdio: "pipe",
    });
    return { stdout, stderr: "", exitCode: 0 };
  } catch (err: any) {
    return {
      stdout: err.stdout?.toString() || "",
      stderr: err.stderr?.toString() || "",
      exitCode: err.status ?? 1,
    };
  }
}

describe("generate-audio gate behavior", () => {
  it("gate failure: does not create audio dir or write audioTiming", () => {
    const tmp = createTempDir();
    const dataDir = path.join(tmp, "data");
    const audioDir = path.join(tmp, "audio");
    fs.mkdirSync(dataDir, { recursive: true });

    fs.writeFileSync(
      path.join(dataDir, "videoSpec.json"),
      JSON.stringify({
        meta: { title: "test", fps: 30, theme: "xhs-white-editorial" },
        scenes: [{ id: "S01", type: "cover", spokenText: "test" }],
      }),
    );

    const scriptPath = path.join(
      PROJECT_ROOT,
      "src/video-system/scripts/generate-audio.ts",
    );
    const result = runScript(scriptPath, PROJECT_ROOT);

    // 脚本应以非零退出码退出（门禁失败）
    assert.notEqual(result.exitCode, 0, "script should exit with non-zero");

    // audio 输出目录不应被创建
    assert.equal(
      fs.existsSync(audioDir),
      false,
      "audio output directory should not be created",
    );

    // audioTiming.json 不应被写入到临时目录
    assert.equal(
      fs.existsSync(path.join(dataDir, "audioTiming.json")),
      false,
      "audioTiming.json should not be written",
    );

    fs.rmSync(tmp, { recursive: true, force: true });
  });
});

describe("generate-subtitles gate behavior", () => {
  it("gate failure: does not write subtitles.json", () => {
    const tmp = createTempDir();
    const dataDir = path.join(tmp, "data");
    fs.mkdirSync(dataDir, { recursive: true });

    fs.writeFileSync(
      path.join(dataDir, "videoSpec.json"),
      JSON.stringify({
        meta: { title: "test", fps: 30, theme: "xhs-white-editorial" },
        scenes: [{ id: "S01", type: "cover", spokenText: "test" }],
      }),
    );
    fs.writeFileSync(
      path.join(dataDir, "audioTiming.json"),
      JSON.stringify({
        audioPath: "audio/voiceover",
        provider: "azure-ssml",
        totalDuration: 5,
        segments: [
          { sceneId: "S01", text: "test", start: 0, end: 5, duration: 5 },
        ],
      }),
    );

    const scriptPath = path.join(
      PROJECT_ROOT,
      "src/video-system/scripts/generate-subtitles.ts",
    );
    const result = runScript(scriptPath, PROJECT_ROOT);

    // 脚本应以非零退出码退出（门禁失败）
    assert.notEqual(result.exitCode, 0, "script should exit with non-zero");

    // subtitles.json 不应被写入到临时目录
    assert.equal(
      fs.existsSync(path.join(dataDir, "subtitles.json")),
      false,
      "subtitles.json should not be written",
    );

    fs.rmSync(tmp, { recursive: true, force: true });
  });
});
