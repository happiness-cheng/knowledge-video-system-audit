import test from "node:test";
import assert from "node:assert/strict";
import { assertRenderManifestShape } from "./renderManifestSchema";

test("assertRenderManifestShape accepts the required P0 manifest fields", () => {
  assert.doesNotThrow(() =>
    assertRenderManifestShape({
      runId: "run-1",
      agentId: "agent-a",
      remotion: { entryPoint: "src/index.ts" },
      inputs: { "videoSpec.json": { path: "src/video-system/data/videoSpec.json" } },
      commands: ["npm run preview:visual"],
      outputs: { contactSheet: { path: "out/keyframes/contact_sheet.jpg" } },
      preview: { visualGateStatus: "inspect" },
    }),
  );
});

test("assertRenderManifestShape rejects missing gate information", () => {
  assert.throws(
    () =>
      assertRenderManifestShape({
        runId: "run-1",
        agentId: "agent-a",
        remotion: {},
        inputs: { a: {} },
        commands: ["x"],
        outputs: { b: {} },
        preview: {},
      }),
    /preview\.visualGateStatus/,
  );
});
