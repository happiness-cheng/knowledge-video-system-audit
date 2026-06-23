import React from "react";
import { InsightPanel } from "../components/InsightPanel";
import type { LabScene } from "../labContent";

export const InsightShot: React.FC<{ scene: LabScene }> = ({ scene }) => {
  const s = scene as any;
  return <InsightPanel quote={s.quote ?? ""} subtitle={s.subtitle} />;
};
