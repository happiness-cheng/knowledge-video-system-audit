import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { getChineseFontFamily } from "../utils/fontLoader";

interface SubtitleSegment {
  text: string;
  startFrame: number;
  endFrame: number;
}

interface SubtitleOverlayProps {
  /** 字幕段落 */
  segments: SubtitleSegment[];
  /** 底部边距 */
  bottomMargin?: number;
  /** 字幕字号 */
  fontSize?: number;
}

/** SubtitleOverlay — 口播同步字幕 */
export const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({
  segments,
  bottomMargin = 60,
  fontSize = 48,
}) => {
  const frame = useCurrentFrame();
  const fontFamily = getChineseFontFamily();

  // 找到当前应该显示的字幕段
  const currentSegment = segments.find(
    (seg) => frame >= seg.startFrame && frame < seg.endFrame,
  );

  if (!currentSegment) return null;

  // 字幕淡入淡出
  const fadeIn = interpolate(
    frame,
    [currentSegment.startFrame, currentSegment.startFrame + 5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const fadeOut = interpolate(
    frame,
    [currentSegment.endFrame - 5, currentSegment.endFrame],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <div
      style={{
        position: "absolute",
        bottom: bottomMargin,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      <div
        style={{
          fontSize,
          fontWeight: 500,
          color: "#ffffff",
          fontFamily,
          textAlign: "center",
          padding: "8px 24px",
          borderRadius: 8,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
          maxWidth: "80%",
          lineHeight: 1.4,
          opacity,
          textShadow: "0 2px 4px rgba(0,0,0,0.5)",
        }}
      >
        {currentSegment.text}
      </div>
    </div>
  );
};

/** 从 spokenText 生成字幕段（简化版，按句号/逗号分割） */
export function generateSubtitleSegments(
  spokenText: string,
  totalFrames: number,
  fps: number,
): SubtitleSegment[] {
  // 按中文标点分割
  const sentences = spokenText
    .split(/[。！？，；]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (sentences.length === 0) return [];

  const framesPerSentence = Math.floor(totalFrames / sentences.length);

  return sentences.map((text, i) => ({
    text,
    startFrame: i * framesPerSentence,
    endFrame: (i + 1) * framesPerSentence,
  }));
}
