export interface SemanticVoiceoverVisualAlignment {
  alignmentId: string;
  contentSnapshotId: string;
  beatId: string;
  shotId: string;
  spokenClause: string;
  visualMeaning: string;
  evidenceAnchor: string | null;
}

export interface TimedVisualAlignment {
  alignmentId: string;
  shotId: string;
  audioSegmentId: string;
  startMs: number;
  endMs: number;
  startFrame: number;
  endFrame: number;
  sceneId: string;
}

export interface CapabilityPreflightItem {
  shotId: string;
  capabilityStatus:
    | "supported"
    | "hold-motion-patch"
    | "new-component-gap"
    | "fallback-unacceptable";
  recommendedHost: string;
  requiredCapabilities: string[];
  missingCapabilities: string[];
  implementationPlan: string;
}

export interface ShotSceneCompileEntry {
  sceneId: string;
  sourceShotIds: string[];
  alignmentIds: string[];
}

export interface VisualSnapshot {
  contractVersion: "3.1";
  visualSnapshotId: string;
  contentSnapshotId: string;
  candidateDigest: string;
  shotDirectorSpecs: string[];
  semanticAlignments: string[];
}

export function validateAlignmentId(id: string): boolean {
  return /^A\d{2,}$/i.test(id);
}

export function validateSemanticVoiceoverVisualAlignment(
  input: unknown,
  options?: { contentSnapshotId?: string },
): string[] {
  const errors: string[] = [];
  if (!input || typeof input !== "object")
    return ["semanticAlignment is not an object"];
  const align = input as Partial<SemanticVoiceoverVisualAlignment>;

  if (!align.alignmentId?.trim()) {
    errors.push("semanticAlignment.alignmentId is empty");
  } else if (!validateAlignmentId(align.alignmentId)) {
    errors.push(`${align.alignmentId}: alignmentId must use A01 format`);
  }
  if (!align.contentSnapshotId?.trim()) {
    errors.push(`${align.alignmentId ?? "align"}: contentSnapshotId is empty`);
  }
  if (
    options?.contentSnapshotId &&
    align.contentSnapshotId !== options.contentSnapshotId
  ) {
    errors.push(
      `${align.alignmentId ?? "align"}: contentSnapshotId does not match expected ${options.contentSnapshotId}`,
    );
  }
  if (!align.beatId?.trim())
    errors.push(`${align.alignmentId ?? "align"}: beatId is empty`);
  if (!align.shotId?.trim())
    errors.push(`${align.alignmentId ?? "align"}: shotId is empty`);
  if (!align.spokenClause?.trim())
    errors.push(`${align.alignmentId ?? "align"}: spokenClause is empty`);
  if (!align.visualMeaning?.trim())
    errors.push(`${align.alignmentId ?? "align"}: visualMeaning is empty`);

  return errors;
}

export function validateTimedVisualAlignment(input: unknown): string[] {
  const errors: string[] = [];
  if (!input || typeof input !== "object")
    return ["timedAlignment is not an object"];
  const timed = input as Partial<TimedVisualAlignment>;

  if (!timed.alignmentId?.trim())
    errors.push("timedAlignment.alignmentId is empty");
  if (!timed.shotId?.trim())
    errors.push(`${timed.alignmentId ?? "timed"}: shotId is empty`);
  if (!timed.audioSegmentId?.trim())
    errors.push(`${timed.alignmentId ?? "timed"}: audioSegmentId is empty`);
  if (!Number.isFinite(timed.startMs) || (timed.startMs ?? -1) < 0) {
    errors.push(`${timed.alignmentId ?? "timed"}: startMs must be >= 0`);
  }
  if (
    !Number.isFinite(timed.endMs) ||
    (timed.endMs ?? 0) <= (timed.startMs ?? 0)
  ) {
    errors.push(`${timed.alignmentId ?? "timed"}: endMs must be > startMs`);
  }
  if (!Number.isFinite(timed.startFrame) || (timed.startFrame ?? -1) < 0) {
    errors.push(`${timed.alignmentId ?? "timed"}: startFrame must be >= 0`);
  }
  if (
    !Number.isFinite(timed.endFrame) ||
    (timed.endFrame ?? 0) <= (timed.startFrame ?? 0)
  ) {
    errors.push(
      `${timed.alignmentId ?? "timed"}: endFrame must be > startFrame`,
    );
  }
  if (!timed.sceneId?.trim())
    errors.push(`${timed.alignmentId ?? "timed"}: sceneId is empty`);

  return errors;
}

export function validateCapabilityPreflightItem(input: unknown): string[] {
  const errors: string[] = [];
  if (!input || typeof input !== "object")
    return ["capabilityPreflight is not an object"];
  const item = input as Partial<CapabilityPreflightItem>;

  if (!item.shotId?.trim()) errors.push("capabilityPreflight.shotId is empty");
  const validStatuses = [
    "supported",
    "hold-motion-patch",
    "new-component-gap",
    "fallback-unacceptable",
  ];
  if (!validStatuses.includes(item.capabilityStatus as string)) {
    errors.push(`${item.shotId ?? "preflight"}: capabilityStatus is invalid`);
  }
  if (item.capabilityStatus === "fallback-unacceptable") {
    errors.push(
      `${item.shotId ?? "preflight"}: fallback-unacceptable blocks production`,
    );
  }
  if (!item.recommendedHost?.trim()) {
    errors.push(`${item.shotId ?? "preflight"}: recommendedHost is empty`);
  }
  if (!Array.isArray(item.requiredCapabilities)) {
    errors.push(
      `${item.shotId ?? "preflight"}: requiredCapabilities must be an array`,
    );
  }
  if (!Array.isArray(item.missingCapabilities)) {
    errors.push(
      `${item.shotId ?? "preflight"}: missingCapabilities must be an array`,
    );
  }
  if (
    item.capabilityStatus === "new-component-gap" &&
    (item.missingCapabilities?.length ?? 0) === 0
  ) {
    errors.push(
      `${item.shotId ?? "preflight"}: new-component-gap requires missingCapabilities to be non-empty`,
    );
  }
  if (!item.implementationPlan?.trim()) {
    errors.push(`${item.shotId ?? "preflight"}: implementationPlan is empty`);
  }

  return errors;
}

export function validateShotSceneCompileEntry(input: unknown): string[] {
  const errors: string[] = [];
  if (!input || typeof input !== "object")
    return ["shotSceneCompile is not an object"];
  const entry = input as Partial<ShotSceneCompileEntry>;

  if (!entry.sceneId?.trim()) errors.push("shotSceneCompile.sceneId is empty");
  if (!Array.isArray(entry.sourceShotIds) || entry.sourceShotIds.length === 0) {
    errors.push(
      `${entry.sceneId ?? "compile"}: sourceShotIds must contain at least one shotId`,
    );
  }
  if (!Array.isArray(entry.alignmentIds) || entry.alignmentIds.length === 0) {
    errors.push(
      `${entry.sceneId ?? "compile"}: alignmentIds must contain at least one alignmentId`,
    );
  }

  return errors;
}

export function validateVisualSnapshotId(id: string): boolean {
  return /^VS-\d{8}-[a-f0-9]{4}$/.test(id);
}
