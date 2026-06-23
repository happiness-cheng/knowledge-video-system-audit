# Docs status map

The files under `docs/` are historical research, experiments, handoffs and implementation reports. They are not the current production contract unless `SOURCE_OF_TRUTH_MAP.md` explicitly names them.

## Current production sources

1. `AGENTS.md`
2. `SOURCE_OF_TRUTH_MAP.md`
3. `knowledge-video-system/prompts/00_PROJECT_CONTEXT.md`
4. `knowledge-video-system/prompts/01_VIDEO_PIPELINE_V1.md`
5. `knowledge-video-system/prompts/17_PREPRODUCTION_REVIEW_GATE.md`
6. `knowledge-video-system/prompts/18_REVISION_ROUTER.md`
7. Runtime registry, validators and renderer source under `src/video-system/`

## Reference-only directories

- `docs/audience-validation/`: prior hook and audience experiments.
- `docs/director/`: prior director-system experiments and implementation records. Sidecar director cues are optional; `directorCuesDraft.json` is never renderer truth.
- `docs/research/`: resource research, old backlog and decision notes.

When a historical document conflicts with the current sources above, the historical document loses. Do not copy its capability claims, workflow steps or quality state into a new task without revalidation.
