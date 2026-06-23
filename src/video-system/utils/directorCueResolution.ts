type TimingStatus =
  | "semantic-draft"
  | "unresolved-stale-audioTiming"
  | "inspect-anchor-not-found"
  | "resolved";

interface DraftCue {
  cueId: string;
  spokenAnchor: string;
  activeTarget: string;
  purpose?: string;
  visualSignals?: string[];
  motionIntent?: string;
  timingStatus?: TimingStatus;
  support?: string;
}

interface DraftScene {
  sceneId: string;
  mode: string;
  purpose?: string;
  fallback?: string;
  cues: DraftCue[];
}

export interface DirectorCueDraft {
  version?: string;
  status?: string;
  scenes: DraftScene[];
}

interface VideoScene {
  id: string;
  durationEstimate?: number;
  spokenText?: string;
}

export interface VideoSpecForCueResolution {
  scenes: VideoScene[];
}

interface AudioSegment {
  sceneId: string;
  start: number;
  end: number;
  duration?: number;
  text?: string;
}

export interface AudioTimingForCueResolution {
  totalDuration?: number;
  segments: AudioSegment[];
}

interface Subtitle {
  sceneId: string;
  start: number;
  end: number;
  text: string;
}

interface BuildResolutionInput {
  fps: number;
  draft: DirectorCueDraft;
  videoSpec: VideoSpecForCueResolution;
  audioTiming: AudioTimingForCueResolution;
  subtitles: Subtitle[];
}

interface SceneTextComparison {
  sceneId: string;
  videoSpecSpokenText: string;
  audioTimingText: string;
  matchStatus: "match" | "mismatch" | "missing-audio" | "missing-spokenText";
}

interface ResolvedCue {
  cueId: string;
  activeTarget: string;
  spokenAnchor: string;
  startFrame: number | null;
  endFrame: number | null;
  timingStatus:
    | "unresolved-stale-audioTiming"
    | "inspect-anchor-not-found"
    | "resolved";
  support?: string;
}

interface ResolvedScene {
  sceneId: string;
  mode: string;
  sceneTimingStatus: "pass" | "inspect";
  blockingReason?: string;
  cues: ResolvedCue[];
}

export interface DirectorCueResolution {
  version: string;
  status:
    | "blocked-stale-audioTiming"
    | "resolved"
    | "inspect-anchor-not-found";
  contract: string;
  sourceDraft: string;
  sourceVideoSpec: string;
  sourceAudioTiming: string;
  sourceSubtitles: string;
  fps: number;
  summary: {
    resolvedCueCount: number;
    unresolvedCueCount: number;
    visualGateStatus: "inspect" | "pass";
    manualReviewRequired: boolean;
    rendererConsumable: boolean;
    blockingReason?: string;
  };
  inputDriftEvidence: {
    videoSpecDurationEstimateSeconds: number;
    audioTimingTotalDurationSeconds: number;
    sceneTextComparison: SceneTextComparison[];
  };
  resolutionPolicy: {
    currentRun: string;
    reason: string;
    nextRequiredAction: string;
    allowedBeforeRegeneration: string[];
    notAllowedBeforeRegeneration: string[];
  };
  scenes: ResolvedScene[];
}

const CONTRACT_PATH = "docs/director/DIRECTOR_SYSTEM_V2_CONTRACT.md";
const DRAFT_PATH = "src/video-system/data/directorCuesDraft.json";
const VIDEO_SPEC_PATH = "src/video-system/data/videoSpec.json";
const AUDIO_TIMING_PATH = "src/video-system/data/audioTiming.json";
const SUBTITLES_PATH = "src/video-system/data/subtitles.json";

function normalizeSpokenText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s，。！？、；：,.!?;:"“”‘’（）()[\]【】]/g, "");
}

function countDraftCues(draft: DirectorCueDraft): number {
  return draft.scenes.reduce((sum, scene) => sum + scene.cues.length, 0);
}

function buildSceneTextComparison(
  draft: DirectorCueDraft,
  videoSpec: VideoSpecForCueResolution,
  audioTiming: AudioTimingForCueResolution,
): SceneTextComparison[] {
  const sceneMap = new Map(videoSpec.scenes.map((scene) => [scene.id, scene]));
  const audioMap = new Map(
    audioTiming.segments.map((segment) => [segment.sceneId, segment]),
  );

  return draft.scenes.map((draftScene) => {
    const scene = sceneMap.get(draftScene.sceneId);
    const audio = audioMap.get(draftScene.sceneId);
    const videoSpecSpokenText = scene?.spokenText ?? "";
    const audioTimingText = audio?.text ?? "";

    if (!scene?.spokenText) {
      return {
        sceneId: draftScene.sceneId,
        videoSpecSpokenText,
        audioTimingText,
        matchStatus: "missing-spokenText",
      };
    }

    if (!audio?.text) {
      return {
        sceneId: draftScene.sceneId,
        videoSpecSpokenText,
        audioTimingText,
        matchStatus: "missing-audio",
      };
    }

    return {
      sceneId: draftScene.sceneId,
      videoSpecSpokenText,
      audioTimingText,
      matchStatus:
        normalizeSpokenText(videoSpecSpokenText) ===
        normalizeSpokenText(audioTimingText)
          ? "match"
          : "mismatch",
    };
  });
}

function buildBlockedScenes(draft: DirectorCueDraft): ResolvedScene[] {
  return draft.scenes.map((scene) => ({
    sceneId: scene.sceneId,
    mode: scene.mode,
    sceneTimingStatus: "inspect",
    blockingReason: `audioTiming ${scene.sceneId} text does not match videoSpec ${scene.sceneId} spokenText.`,
    cues: scene.cues.map((cue) => ({
      cueId: cue.cueId,
      activeTarget: cue.activeTarget,
      spokenAnchor: cue.spokenAnchor,
      startFrame: null,
      endFrame: null,
      timingStatus: "unresolved-stale-audioTiming",
      ...(cue.support ? { support: cue.support } : {}),
    })),
  }));
}

function getVideoSpecDuration(videoSpec: VideoSpecForCueResolution): number {
  return videoSpec.scenes.reduce(
    (sum, scene) => sum + (scene.durationEstimate ?? 0),
    0,
  );
}

function findSubtitleForAnchor(
  cue: DraftCue,
  sceneId: string,
  subtitles: Subtitle[],
): Subtitle | null {
  const anchors = cue.spokenAnchor
    .split("/")
    .map((part) => normalizeSpokenText(part.trim()))
    .filter((part) => part.length >= 2);

  if (anchors.length === 0) return null;

  return (
    subtitles.find((subtitle) => {
      if (subtitle.sceneId !== sceneId) return false;
      const subtitleText = normalizeSpokenText(subtitle.text);
      return anchors.some((anchor) => subtitleText.includes(anchor));
    }) ?? null
  );
}

function buildResolvedScenes(
  draft: DirectorCueDraft,
  audioTiming: AudioTimingForCueResolution,
  subtitles: Subtitle[],
  fps: number,
): ResolvedScene[] {
  const audioMap = new Map(
    audioTiming.segments.map((segment) => [segment.sceneId, segment]),
  );

  return draft.scenes.map((scene) => {
    const audio = audioMap.get(scene.sceneId);
    const cues = scene.cues.map((cue): ResolvedCue => {
      const subtitle = findSubtitleForAnchor(cue, scene.sceneId, subtitles);

      if (!audio || !subtitle) {
        return {
          cueId: cue.cueId,
          activeTarget: cue.activeTarget,
          spokenAnchor: cue.spokenAnchor,
          startFrame: null,
          endFrame: null,
          timingStatus: "inspect-anchor-not-found",
          ...(cue.support ? { support: cue.support } : {}),
        };
      }

      return {
        cueId: cue.cueId,
        activeTarget: cue.activeTarget,
        spokenAnchor: cue.spokenAnchor,
        startFrame: Math.max(0, Math.round((subtitle.start - audio.start) * fps)),
        endFrame: Math.max(0, Math.round((subtitle.end - audio.start) * fps)),
        timingStatus: "resolved",
        ...(cue.support ? { support: cue.support } : {}),
      };
    });

    return {
      sceneId: scene.sceneId,
      mode: scene.mode,
      sceneTimingStatus: cues.every((cue) => cue.timingStatus === "resolved")
        ? "pass"
        : "inspect",
      cues,
    };
  });
}

function buildResolutionPolicy(isBlocked: boolean) {
  if (isBlocked) {
    return {
      currentRun: "do-not-resolve",
      reason: "Frame ranges based on stale audio would create false cue timing.",
      nextRequiredAction:
        "After the user approves the active videoSpec for audio generation, regenerate audioTiming.json and subtitles.json, then rerun cue resolution.",
      allowedBeforeRegeneration: [
        "manual review of directorBrief and shotPlan",
        "semantic cue editing",
        "Studio visual review without cue frame claims",
      ],
      notAllowedBeforeRegeneration: [
        "renderer consumption of directorCuesResolved.json",
        "claiming frame-accurate cue alignment",
        "committing cue timing as pass",
      ],
    };
  }

  return {
    currentRun: "anchor-resolution",
    reason:
      "audioTiming text matches videoSpec spokenText for cue scenes; cue anchors are resolved against subtitles where possible.",
    nextRequiredAction:
      "Inspect unresolved anchors and run Studio review before renderer consumption.",
    allowedBeforeRegeneration: ["manual review", "semantic cue editing"],
    notAllowedBeforeRegeneration: ["claiming visual gate pass without review"],
  };
}

export function buildDirectorCueResolution(
  input: BuildResolutionInput,
): DirectorCueResolution {
  const sceneTextComparison = buildSceneTextComparison(
    input.draft,
    input.videoSpec,
    input.audioTiming,
  );
  const hasInputDrift = sceneTextComparison.some(
    (scene) => scene.matchStatus !== "match",
  );
  const totalCueCount = countDraftCues(input.draft);
  const scenes = hasInputDrift
    ? buildBlockedScenes(input.draft)
    : buildResolvedScenes(
        input.draft,
        input.audioTiming,
        input.subtitles,
        input.fps,
      );

  const resolvedCueCount = scenes.reduce(
    (sum, scene) =>
      sum + scene.cues.filter((cue) => cue.timingStatus === "resolved").length,
    0,
  );
  const unresolvedCueCount = totalCueCount - resolvedCueCount;
  const rendererConsumable = !hasInputDrift && unresolvedCueCount === 0;

  return {
    version: "director-system-v2-p2",
    status: hasInputDrift
      ? "blocked-stale-audioTiming"
      : rendererConsumable
        ? "resolved"
        : "inspect-anchor-not-found",
    contract: CONTRACT_PATH,
    sourceDraft: DRAFT_PATH,
    sourceVideoSpec: VIDEO_SPEC_PATH,
    sourceAudioTiming: AUDIO_TIMING_PATH,
    sourceSubtitles: SUBTITLES_PATH,
    fps: input.fps,
    summary: {
      resolvedCueCount,
      unresolvedCueCount,
      visualGateStatus: rendererConsumable ? "pass" : "inspect",
      manualReviewRequired: !rendererConsumable,
      rendererConsumable,
      ...(hasInputDrift
        ? {
            blockingReason:
              "audioTiming.json and subtitles.json do not match the active videoSpec spokenText, so semantic cue anchors cannot be resolved into reliable frame ranges.",
          }
        : {}),
    },
    inputDriftEvidence: {
      videoSpecDurationEstimateSeconds: getVideoSpecDuration(input.videoSpec),
      audioTimingTotalDurationSeconds: input.audioTiming.totalDuration ?? 0,
      sceneTextComparison,
    },
    resolutionPolicy: buildResolutionPolicy(hasInputDrift),
    scenes,
  };
}

