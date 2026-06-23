import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { springEnter, fadeSlide, breathe } from "../labMotionPrimitives";
import { typeScale } from "../tokens/typographyTokens";

type TitleVariant = "split" | "contrast" | "kinetic" | "pain-point" | "conclusion";

interface KineticTitleSystemProps {
  variant: TitleVariant;
  line1?: string;
  line2?: string;
  subtitle?: string;
  keywords?: string[];
  accentColor?: string;
  textColor?: string;
  mutedColor?: string;
}

/** KineticTitleSystem — 4+ 种标题变体 */
export const KineticTitleSystem: React.FC<KineticTitleSystemProps> = ({
  variant,
  line1,
  line2,
  subtitle,
  keywords = [],
  accentColor = "#6366f1",
  textColor = "#f0f0f5",
  mutedColor = "#a0a0b8",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const highlightKw = (text: string): React.ReactNode => {
    for (const kw of keywords) {
      const idx = text.indexOf(kw);
      if (idx >= 0) {
        return <>{text.slice(0, idx)}<span style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{kw}</span>{text.slice(idx + kw.length)}</>;
      }
    }
    return text;
  };

  if (variant === "split") {
    const p1 = springEnter(frame, fps, 0);
    const p2 = springEnter(frame, fps, 10);
    const sub = fadeSlide(frame, fps, 20);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        {line1 && <div style={{ fontSize: typeScale.headingM.size, fontWeight: typeScale.headingM.weight, color: mutedColor, opacity: p1, transform: `translateY(${(1 - p1) * 20}px)` }}>{line1}</div>}
        {line2 && <div style={{ fontSize: typeScale.displayXL.size, fontWeight: typeScale.displayXL.weight, lineHeight: typeScale.displayXL.lineHeight, background: `linear-gradient(135deg, ${accentColor}, #a78bfa)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", opacity: p2, transform: `translateY(${(1 - p2) * 25}px)` }}>{highlightKw(line2)}</div>}
        {subtitle && <div style={{ fontSize: typeScale.headingM.size, color: mutedColor, marginTop: 20, opacity: sub.opacity, transform: `translateY(${sub.translateY}px)` }}>{subtitle}</div>}
      </div>
    );
  }

  if (variant === "contrast") {
    const p1 = springEnter(frame, fps, 0);
    const sub = fadeSlide(frame, fps, 15);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        {line1 && <div style={{ fontSize: typeScale.headingL.size, fontWeight: 700, color: textColor, opacity: p1, transform: `translateY(${(1 - p1) * 15}px)` }}>{line1}</div>}
        {line2 && <div style={{ fontSize: typeScale.displayL.size, fontWeight: 800, background: `linear-gradient(135deg, ${accentColor}, #a78bfa)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginTop: 8, opacity: p1, transform: `translateY(${(1 - p1) * 15}px)` }}>{highlightKw(line2)}</div>}
        {subtitle && <div style={{ fontSize: typeScale.headingM.size, color: mutedColor, marginTop: 16, opacity: sub.opacity, transform: `translateY(${sub.translateY}px)` }}>{subtitle}</div>}
      </div>
    );
  }

  if (variant === "pain-point") {
    const p = springEnter(frame, fps, 0);
    const b = breathe(frame);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        {line1 && <div style={{ fontSize: typeScale.headingM.size, fontWeight: 650, color: mutedColor, opacity: p * 0.8 }}>{line1}</div>}
        {line2 && <div style={{ fontSize: typeScale.displayXL.size, fontWeight: 800, color: textColor, opacity: p, transform: `scale(${b})`, lineHeight: typeScale.displayXL.lineHeight }}>{highlightKw(line2)}</div>}
        {subtitle && <div style={{ fontSize: typeScale.bodyL.size, color: mutedColor, marginTop: 16, opacity: fadeSlide(frame, fps, 15).opacity }}>{subtitle}</div>}
      </div>
    );
  }

  // conclusion / kinetic
  const p = springEnter(frame, fps, 0);
  const b = breathe(frame, 0.04, 1.0, 1.006);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      {line1 && <div style={{ fontSize: typeScale.headingM.size, fontWeight: 700, color: accentColor, letterSpacing: 4, textTransform: "uppercase" as const, opacity: fadeSlide(frame, fps, 0).opacity }}>{line1}</div>}
      {line2 && <div style={{ fontSize: typeScale.displayXL.size, fontWeight: 900, lineHeight: typeScale.displayXL.lineHeight, background: `linear-gradient(135deg, ${accentColor}, #a78bfa)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", opacity: p, transform: `scale(${b})` }}>{line2}</div>}
      {subtitle && <div style={{ fontSize: typeScale.headingM.size, color: mutedColor, marginTop: 16, opacity: fadeSlide(frame, fps, 18).opacity }}>{subtitle}</div>}
    </div>
  );
};
