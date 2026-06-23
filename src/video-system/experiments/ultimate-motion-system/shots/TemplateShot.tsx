import React from "react";
import { useCurrentFrame } from "remotion";
import { TemplatePanel } from "../components/TemplatePanel";
import { getLabSceneCues, DECAY_FRAMES } from "../labDirectorCues";
import { resolveActiveTarget } from "../utils/resolveActiveTarget";
import type { LabScene } from "../labContent";

export const TemplateShot: React.FC<{ scene: LabScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const cues = getLabSceneCues("S07");
  const { targetOpacity } = cues ? resolveActiveTarget(frame, cues.cues, DECAY_FRAMES, "progressive-retain") : { targetOpacity: () => 1 };
  const s = scene as any;
  const items = s.templateItems ?? [];
  const opacities = items.map((_: string, i: number) => targetOpacity(`item-${i}`));
  return <TemplatePanel title={s.title} items={items} itemOpacities={opacities} />;
};
