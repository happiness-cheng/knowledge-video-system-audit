export interface MotionSpec {
  type: string;
  purpose: string;
  noneReason?: string | null;
}

export interface ExitOrCarryMotionSpec {
  type: string;
  carryObject: string | null;
}

export interface AmbientMotionSpec {
  type: "none" | "drift" | "pulse" | "flow" | "breathe";
  purpose: string;
}

export type AssetStrategy =
  | "generated-static"
  | "screenshot-led-raw"
  | "screenshot-led-prepared"
  | "component-only"
  | "hybrid";

export type ImplementationLock = "locked" | "preferred" | "open";

export type CapabilityPreflightStatus =
  | "supported"
  | "hold-motion-patch"
  | "new-component-gap"
  | "fallback-unacceptable";

export interface ShotDirectorSpec {
  contractVersion: "3.1";
  contentSnapshotId: string;
  beatId: string;
  shotId: string;
  contentSourceRef: string;
  spokenClause: string;
  explanationGoal: string;
  informationDelta: string;
  primaryAttentionTarget: string;
  objects: string[];
  initialState: string;
  semanticAction: string;
  finalState: string;
  enterMotion: MotionSpec;
  holdMotion: MotionSpec;
  exitOrCarryMotion: ExitOrCarryMotionSpec;
  continuityAnchor: string;
  ambientMotion: AmbientMotionSpec;
  assetStrategy: AssetStrategy;
  evidenceAnchor: string | null;
  implementationLock: ImplementationLock;
  capabilityStatus: CapabilityPreflightStatus;
  fallbackPolicy: "return-gap";
  acceptanceCriteria: string[];
}

export function validateShotDirectorSpecId(shotId: string): boolean {
  return /^B\d{2,}-S\d{2,}$/i.test(shotId);
}

export function validateHoldMotion(
  spec: ShotDirectorSpec,
  durationEstimate: number,
): string[] {
  const errors: string[] = [];
  if (durationEstimate > 1.2) {
    if (!spec.holdMotion || typeof spec.holdMotion !== "object") {
      errors.push(`${spec.shotId}: shots >1.2s require holdMotion`);
    } else if (
      spec.holdMotion.type === "none" &&
      !spec.holdMotion.noneReason?.trim()
    ) {
      errors.push(
        `${spec.shotId}: holdMotion.type=none requires noneReason for shots >1.2s`,
      );
    }
  }
  return errors;
}

export function validateShotDirectorSpec(
  input: unknown,
  options?: { contentSnapshotId?: string; durationEstimate?: number },
): string[] {
  const errors: string[] = [];
  if (!input || typeof input !== "object") {
    return ["shotDirectorSpec is not an object"];
  }
  const spec = input as Partial<ShotDirectorSpec>;

  if (spec.contractVersion !== "3.1") {
    errors.push(`${spec.shotId ?? "shot"}: contractVersion must be 3.1`);
  }
  if (!spec.contentSnapshotId?.trim()) {
    errors.push(`${spec.shotId ?? "shot"}: contentSnapshotId is empty`);
  }
  if (
    options?.contentSnapshotId &&
    spec.contentSnapshotId !== options.contentSnapshotId
  ) {
    errors.push(
      `${spec.shotId ?? "shot"}: contentSnapshotId ${spec.contentSnapshotId} does not match expected ${options.contentSnapshotId}`,
    );
  }
  if (!spec.beatId?.trim())
    errors.push(`${spec.shotId ?? "shot"}: beatId is empty`);
  if (!spec.shotId?.trim()) {
    errors.push("shotDirectorSpec.shotId is empty");
  } else if (!validateShotDirectorSpecId(spec.shotId)) {
    errors.push(`${spec.shotId}: shotId must use B01-S01 format`);
  }
  if (!spec.contentSourceRef?.trim())
    errors.push(`${spec.shotId ?? "shot"}: contentSourceRef is empty`);
  if (!spec.spokenClause?.trim())
    errors.push(`${spec.shotId ?? "shot"}: spokenClause is empty`);
  if (!spec.explanationGoal?.trim())
    errors.push(`${spec.shotId ?? "shot"}: explanationGoal is empty`);
  if (!spec.informationDelta?.trim())
    errors.push(`${spec.shotId ?? "shot"}: informationDelta is empty`);
  if (!spec.primaryAttentionTarget?.trim())
    errors.push(`${spec.shotId ?? "shot"}: primaryAttentionTarget is empty`);
  if (!Array.isArray(spec.objects) || spec.objects.length === 0) {
    errors.push(
      `${spec.shotId ?? "shot"}: objects must contain at least one item`,
    );
  }
  if (!spec.initialState?.trim())
    errors.push(`${spec.shotId ?? "shot"}: initialState is empty`);
  if (!spec.semanticAction?.trim())
    errors.push(`${spec.shotId ?? "shot"}: semanticAction is empty`);
  if (!spec.finalState?.trim())
    errors.push(`${spec.shotId ?? "shot"}: finalState is empty`);

  if (!spec.enterMotion || typeof spec.enterMotion !== "object") {
    errors.push(`${spec.shotId ?? "shot"}: enterMotion is missing`);
  } else {
    if (!spec.enterMotion.type?.trim())
      errors.push(`${spec.shotId ?? "shot"}: enterMotion.type is empty`);
    if (!spec.enterMotion.purpose?.trim())
      errors.push(`${spec.shotId ?? "shot"}: enterMotion.purpose is empty`);
  }

  if (!spec.holdMotion || typeof spec.holdMotion !== "object") {
    errors.push(`${spec.shotId ?? "shot"}: holdMotion is missing`);
  } else {
    if (!spec.holdMotion.type?.trim())
      errors.push(`${spec.shotId ?? "shot"}: holdMotion.type is empty`);
    if (spec.holdMotion.type !== "none" && !spec.holdMotion.purpose?.trim()) {
      errors.push(
        `${spec.shotId ?? "shot"}: holdMotion.purpose is empty when type is not none`,
      );
    }
  }

  if (!spec.exitOrCarryMotion || typeof spec.exitOrCarryMotion !== "object") {
    errors.push(`${spec.shotId ?? "shot"}: exitOrCarryMotion is missing`);
  } else {
    if (!spec.exitOrCarryMotion.type?.trim()) {
      errors.push(`${spec.shotId ?? "shot"}: exitOrCarryMotion.type is empty`);
    }
  }

  if (!spec.continuityAnchor?.trim())
    errors.push(`${spec.shotId ?? "shot"}: continuityAnchor is empty`);

  if (!spec.ambientMotion || typeof spec.ambientMotion !== "object") {
    errors.push(`${spec.shotId ?? "shot"}: ambientMotion is missing`);
  } else {
    const validAmbient = ["none", "drift", "pulse", "flow", "breathe"];
    if (!validAmbient.includes(spec.ambientMotion.type)) {
      errors.push(
        `${spec.shotId ?? "shot"}: ambientMotion.type must be none | drift | pulse | flow | breathe`,
      );
    }
    if (!spec.ambientMotion.purpose?.trim()) {
      errors.push(`${spec.shotId ?? "shot"}: ambientMotion.purpose is empty`);
    }
  }

  const validAssetStrategies = [
    "generated-static",
    "screenshot-led-raw",
    "screenshot-led-prepared",
    "component-only",
    "hybrid",
  ];
  if (!validAssetStrategies.includes(spec.assetStrategy as string)) {
    errors.push(`${spec.shotId ?? "shot"}: assetStrategy is invalid`);
  }

  if (
    spec.implementationLock &&
    !["locked", "preferred", "open"].includes(spec.implementationLock)
  ) {
    errors.push(
      `${spec.shotId ?? "shot"}: implementationLock must be locked | preferred | open`,
    );
  }

  const validCapabilityStatuses = [
    "supported",
    "hold-motion-patch",
    "new-component-gap",
    "fallback-unacceptable",
  ];
  if (
    spec.capabilityStatus &&
    !validCapabilityStatuses.includes(spec.capabilityStatus)
  ) {
    errors.push(`${spec.shotId ?? "shot"}: capabilityStatus is invalid`);
  }

  if (
    !Array.isArray(spec.acceptanceCriteria) ||
    spec.acceptanceCriteria.length === 0
  ) {
    errors.push(
      `${spec.shotId ?? "shot"}: acceptanceCriteria must contain at least one item`,
    );
  }

  if (options?.durationEstimate !== undefined) {
    errors.push(
      ...validateHoldMotion(spec as ShotDirectorSpec, options.durationEstimate),
    );
  }

  return errors;
}
