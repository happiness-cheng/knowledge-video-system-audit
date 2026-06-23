type ManifestRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ManifestRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireRecord(value: unknown, field: string): ManifestRecord {
  if (!isRecord(value)) {
    throw new Error(`renderManifest.${field} must be an object`);
  }
  return value;
}

function requireString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`renderManifest.${field} must be a non-empty string`);
  }
}

function requireArray(value: unknown, field: string) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`renderManifest.${field} must be a non-empty array`);
  }
}

export function assertRenderManifestShape(manifest: unknown) {
  const root = requireRecord(manifest, "root");
  requireString(root.runId, "runId");
  requireString(root.agentId, "agentId");

  const inputs = requireRecord(root.inputs, "inputs");
  const outputs = requireRecord(root.outputs, "outputs");
  const preview = requireRecord(root.preview, "preview");

  requireArray(root.commands, "commands");
  requireRecord(root.remotion, "remotion");
  requireString(preview.visualGateStatus, "preview.visualGateStatus");

  if (Object.keys(inputs).length === 0) {
    throw new Error("renderManifest.inputs must not be empty");
  }
  if (Object.keys(outputs).length === 0) {
    throw new Error("renderManifest.outputs must not be empty");
  }
}
