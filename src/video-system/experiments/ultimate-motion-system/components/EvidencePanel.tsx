import React from "react";
import { useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import { fadeSlide, cardLift } from "../labMotionPrimitives";

interface EvidencePanelProps {
  label: string;
  conclusion: string;
  activeOpacity: number;
  accent: string;
  /** 截图路径（public 内相对路径） */
  screenshotSrc?: string;
  delay?: number;
}

/** EvidencePanel — 证据面板，支持真实截图 */
export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  label,
  conclusion,
  activeOpacity,
  accent,
  screenshotSrc,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlide(frame, fps, delay);
  const scale = cardLift(activeOpacity, 0.97, 1.01);

  return (
    <div
      style={{
        opacity: anim.opacity * activeOpacity,
        transform: `translateY(${anim.translateY}px) scale(${scale})`,
        background: "linear-gradient(180deg, #0c0c14 0%, #12121f 100%)",
        border: `1.5px solid ${activeOpacity > 0.8 ? accent + "55" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 16,
        padding: 28,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        boxShadow: activeOpacity > 0.8 ? `0 0 24px ${accent}18` : "none",
      }}
    >
      {/* 大标签 */}
      <div
        style={{
          fontSize: 50,
          fontWeight: 650,
          color: accent,
          letterSpacing: 2,
          textTransform: "uppercase" as const,
        }}
      >
        {label}
      </div>

      {/* 截图证据区域 */}
      <div
        style={{
          width: "100%",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.04)",
        }}
      >
        {screenshotSrc ? (
          <Img
            src={staticFile(screenshotSrc)}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "contain",
            }}
          />
        ) : (
          <div
            style={{
              height: 280,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 42,
              color: "#6a6a80",
            }}
          >
            证据截图区域
          </div>
        )}
      </div>

      {/* 结论 */}
      <div
        style={{
          fontSize: 58,
          fontWeight: 600,
          color: "#f0f0f5",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {conclusion}
      </div>
    </div>
  );
};
