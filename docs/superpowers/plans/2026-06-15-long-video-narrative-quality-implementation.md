# Long Video Narrative Quality Implementation Plan

> **For agentic workers:** Implement this plan task-by-task and verify each batch before continuing.

**Goal:** Add planning-only narrative quality rules and JSON fields without expanding the current Remotion rendering contract.

**Architecture:** `contentBrief.narrativeDesign` owns whole-video narrative structure. Scene-level fields in `videoSpec` describe each scene's narrative function and are explicitly ignored by the renderer, matching the existing `visualRole` pattern.

**Tech Stack:** Markdown prompt specifications, JSON data files, TypeScript/Remotion verification.

---

### Task 1: Define Shared Narrative Contract

**Files:**
- Modify: `knowledge-video-system/prompts/00_PROJECT_CONTEXT.md`
- Modify: `knowledge-video-system/prompts/01_VIDEO_PIPELINE_V1.md`

- [x] Add the narrative quality formula and methodology-video rules.
- [x] Define `narrativeDesign` and scene planning fields.
- [x] State that planning fields do not imply renderer support.
- [x] Correct Xiaochén, screenshot annotation, and template-card capability boundaries.

### Task 2: Update Generation Prompts

**Files:**
- Modify: `knowledge-video-system/prompts/02_ARTICLE_TO_CONTENT_BRIEF_PROMPT.md`
- Modify: `knowledge-video-system/prompts/03_CONTENT_BRIEF_TO_VIDEO_SPEC_PROMPT.md`

- [x] Add `narrativeDesign` to the contentBrief schema and gate checks.
- [x] Add scene narrative fields and legal values to the videoSpec schema.
- [x] Require real cases, transfer scenarios, templates/actions, and justified recaps.

### Task 3: Update Review and Quality Prompts

**Files:**
- Modify: `knowledge-video-system/prompts/06_PREVIEW_REVIEW_PROMPT.md`
- Modify: `knowledge-video-system/prompts/07_STYLE_THEME_LAYOUT_RULES.md`
- Modify: `knowledge-video-system/prompts/11_QUALITY_SCORE_AND_RELEASE_GATE.md`

- [x] Add narrative continuity, human feel, chapter, recap, transfer, and final-action checks.
- [x] Document current screenshot and template fallback capabilities.
- [x] Map narrative evidence into existing score dimensions without adding new points.

### Task 4: Migrate Current Planning Data

**Files:**
- Modify: `src/video-system/data/contentBrief.json`
- Modify: `src/video-system/data/videoSpec.json`

- [x] Add a complete `narrativeDesign` based only on the existing article and verified assets.
- [x] Add scene planning fields to all scenes without changing render fields.
- [x] Keep all user decision fields unchanged.

### Task 5: Verify

- [x] Parse all data JSON files.
- [x] Validate narrative field presence and allowed values.
- [x] Search for contradictory capability claims and forbidden component names.
- [x] Run `npx tsc --noEmit`.
- [x] Run `npx remotion compositions src/index.ts`.
- [x] Run `git diff --check` and review only task-related diffs.
