import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";

export interface ContentSnapshotSource {
  contentMasterDraft: string;
  beatSheet: string;
  shotPlan: string;
  coverBrief: string;
}

export interface ApprovedContentSnapshot {
  contractVersion: "3.1";
  contentSnapshotId: string;
  sourceDigest: string;
  approvedAt: string | null;
  userDecision: "approved" | "pending";
  sources: ContentSnapshotSource;
}

export function generateContentSnapshotId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = crypto.randomBytes(2).toString("hex");
  return `CS-${date}-${rand}`;
}

export function computeSourceDigest(
  sources: ContentSnapshotSource,
  projectRoot?: string,
): string {
  const entries: string[] = [];
  for (const [role, filePath] of Object.entries(sources).sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    const resolved = projectRoot
      ? path.resolve(projectRoot, filePath)
      : filePath;
    if (fs.existsSync(resolved)) {
      const contentHash = crypto
        .createHash("sha256")
        .update(fs.readFileSync(resolved))
        .digest("hex");
      entries.push(`${role}:${filePath}:${contentHash}`);
    } else {
      entries.push(`${role}:${filePath}:missing`);
    }
  }
  return crypto.createHash("sha256").update(entries.join("\n")).digest("hex");
}

export function validateContentSnapshotId(id: string): boolean {
  return /^CS-\d{8}-[a-f0-9]{4}$/.test(id);
}

const VALID_USER_DECISIONS = ["approved", "pending"] as const;

export function validateApprovedContentSnapshot(
  input: unknown,
  options?: { projectRoot?: string },
): string[] {
  const errors: string[] = [];
  if (!input || typeof input !== "object") {
    return ["approvedContentSnapshot is not an object"];
  }
  const snap = input as Partial<ApprovedContentSnapshot>;

  if (snap.contractVersion !== "3.1") {
    errors.push("approvedContentSnapshot.contractVersion must be 3.1");
  }
  if (
    !snap.contentSnapshotId ||
    !validateContentSnapshotId(snap.contentSnapshotId)
  ) {
    errors.push(
      "approvedContentSnapshot.contentSnapshotId must match CS-YYYYMMDD-xxxx format",
    );
  }
  if (!/^[a-f0-9]{64}$/i.test(snap.sourceDigest ?? "")) {
    errors.push(
      "approvedContentSnapshot.sourceDigest must be a 64-character SHA-256 hex digest",
    );
  }
  if (
    !VALID_USER_DECISIONS.includes(
      snap.userDecision as (typeof VALID_USER_DECISIONS)[number],
    )
  ) {
    errors.push(
      "approvedContentSnapshot.userDecision must be approved | pending",
    );
  }
  if (snap.userDecision === "approved") {
    if (!snap.approvedAt || Number.isNaN(Date.parse(snap.approvedAt))) {
      errors.push(
        "approvedContentSnapshot.approvedAt must be a valid ISO date when approved",
      );
    }
  }
  if (snap.userDecision === "pending") {
    if (snap.approvedAt !== null) {
      errors.push(
        "approvedContentSnapshot.approvedAt must be null when pending",
      );
    }
  }

  const sources = snap.sources;
  if (!sources || typeof sources !== "object") {
    errors.push("approvedContentSnapshot.sources is missing");
  } else {
    for (const key of [
      "contentMasterDraft",
      "beatSheet",
      "shotPlan",
      "coverBrief",
    ] as const) {
      if (!sources[key]?.trim()) {
        errors.push(`approvedContentSnapshot.sources.${key} is empty`);
      }
    }
    if (options?.projectRoot) {
      for (const key of [
        "contentMasterDraft",
        "beatSheet",
        "shotPlan",
        "coverBrief",
      ] as const) {
        const filePath = path.resolve(options.projectRoot, sources[key]);
        if (!fs.existsSync(filePath)) {
          errors.push(
            `approvedContentSnapshot.sources.${key} file does not exist: ${sources[key]}`,
          );
        }
      }
    }
  }

  return errors;
}

export function readApprovedContentSnapshot(
  filePath: string,
): ApprovedContentSnapshot {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing approvedContentSnapshot file: ${filePath}`);
  }
  return JSON.parse(
    fs.readFileSync(filePath, "utf-8"),
  ) as ApprovedContentSnapshot;
}
