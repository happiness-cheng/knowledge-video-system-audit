import React from "react";
import type { LabScene } from "./labContent";
import { HookShot } from "./shots/HookShot";
import { MistakeShot } from "./shots/MistakeShot";
import { ExperimentSetupShot } from "./shots/ExperimentSetupShot";
import { EvidenceShot } from "./shots/EvidenceShot";
import { InsightShot } from "./shots/InsightShot";
import { TransferShot } from "./shots/TransferShot";
import { TemplateShot } from "./shots/TemplateShot";
import { CtaShot } from "./shots/CtaShot";
import { ComponentGallery } from "./galleries/ComponentGallery";
import { MotionPrimitiveGallery } from "./galleries/MotionPrimitiveGallery";
import { EvidenceGallery } from "./galleries/EvidenceGallery";
import { TemplateGallery } from "./galleries/TemplateGallery";
import { TitleGallery } from "./galleries/TitleGallery";
import { TransitionGallery } from "./galleries/TransitionGallery";
import { MobileReadabilityGallery } from "./galleries/MobileReadabilityGallery";

export const UltimateSceneRenderer: React.FC<{ scene: LabScene; totalFrames: number }> = ({ scene }) => {
  switch (scene.shotType) {
    case "hook": return <HookShot scene={scene} />;
    case "mistake": return <MistakeShot scene={scene} />;
    case "setup": return <ExperimentSetupShot scene={scene} />;
    case "evidence": return <EvidenceShot scene={scene} />;
    case "insight": return <InsightShot scene={scene} />;
    case "transfer": return <TransferShot scene={scene} />;
    case "template": return <TemplateShot scene={scene} />;
    case "cta": return <CtaShot scene={scene} />;
    case "component-gallery": return <ComponentGallery />;
    case "motion-gallery": return <MotionPrimitiveGallery />;
    case "evidence-gallery": return <EvidenceGallery />;
    case "template-gallery": return <TemplateGallery />;
    case "title-gallery": return <TitleGallery />;
    case "transition-gallery": return <TransitionGallery />;
    case "mobile-gallery": return <MobileReadabilityGallery />;
    default:
      return <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#0c0c14", color: "#f87171", fontSize: 28 }}>未知 shotType: {scene.shotType}</div>;
  }
};
