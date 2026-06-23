import * as fs from "node:fs";
import * as path from "node:path";
import {
  productionSceneTypes,
  semanticPatternCapabilities,
  themeCapabilities,
} from "../visual/capabilityRegistry";
import { listThemes } from "../themes";

export interface RegistryValidationResult {
  passed: boolean;
  errors: string[];
  summary: {
    sceneTypeCount: number;
    rendererCaseCount: number;
    themeCount: number;
    semanticPatternCount: number;
  };
}

function duplicates(values: string[]): string[] {
  return values.filter((value, index) => values.indexOf(value) !== index);
}

export function validateSystemRegistry(
  sceneRendererPath = path.resolve(__dirname, "../scenes/SceneRenderer.tsx"),
): RegistryValidationResult {
  const errors: string[] = [];
  const source = fs.readFileSync(sceneRendererPath, "utf-8");
  const rendererCases = [...source.matchAll(/case\s+["']([^"']+)["']\s*:/g)].map(
    (match) => match[1],
  );
  const sceneTypes = [...productionSceneTypes];
  const registryThemes: string[] = themeCapabilities.map((item) => item.id);
  const runtimeThemes: string[] = listThemes().map((item) => item.id);

  for (const duplicate of new Set(duplicates(sceneTypes))) {
    errors.push(`duplicate scene capability: ${duplicate}`);
  }
  for (const duplicate of new Set(duplicates(rendererCases))) {
    errors.push(`duplicate SceneRenderer case: ${duplicate}`);
  }
  for (const type of sceneTypes) {
    if (!rendererCases.includes(type)) errors.push(`scene capability missing renderer case: ${type}`);
  }
  for (const type of rendererCases) {
    if (!sceneTypes.includes(type)) errors.push(`renderer case missing capability registry entry: ${type}`);
  }

  for (const id of registryThemes) {
    if (!runtimeThemes.includes(id)) errors.push(`theme capability missing runtime theme: ${id}`);
  }
  for (const id of runtimeThemes) {
    if (!registryThemes.includes(id)) errors.push(`runtime theme missing capability entry: ${id}`);
  }

  for (const pattern of semanticPatternCapabilities) {
    if (pattern.hostTypes.length === 0) {
      errors.push(`semantic pattern has no host type: ${pattern.pattern}`);
    }
    for (const host of pattern.hostTypes) {
      if (!sceneTypes.includes(host)) {
        errors.push(`semantic pattern ${pattern.pattern} uses unknown host type ${host}`);
      }
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    summary: {
      sceneTypeCount: sceneTypes.length,
      rendererCaseCount: rendererCases.length,
      themeCount: runtimeThemes.length,
      semanticPatternCount: semanticPatternCapabilities.length,
    },
  };
}
