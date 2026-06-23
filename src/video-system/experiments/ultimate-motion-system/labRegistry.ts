// ─── V2 Lab 注册表 ─────────────────────────────────────

export { shotGrammarRegistry } from "./labShotGrammar";
export { primitiveRegistry } from "./labMotionPrimitives";
export { labDirectorCues } from "./labDirectorCues";

export const labMeta = {
  name: "Ultimate Motion System Lab",
  version: "2.0",
  sceneCount: 15,
  mainSceneCount: 8,
  gallerySceneCount: 7,
  componentCount: 15,
  primitiveCount: 16,
  shotGrammarCount: 8,
} as const;
