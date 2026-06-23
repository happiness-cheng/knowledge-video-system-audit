/**
 * EvidenceBlock — 证据容器
 *
 * 用于 comparison + visualRole=evidence 场景。
 * 渲染大标签 + 大结论 + 截图/文本证据。
 */

import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import type { VideoTheme } from "../themes/types";
import { HighlightBox } from "./HighlightBox";
import type { HighlightBoxConfig } from "./HighlightBox";
import { assetIdToProcessedPath } from "../utils/mediaPaths";
import { SafeTitleText } from "./SafeTitleText";

export interface EvidenceBlockProps {
  theme: VideoTheme;
  /** 大标签（这页在证明什么） */
  label: string;
  /** 大结论（核心判断） */
  conclusion: string;
  /** 截图 assetId（可选） */
  assetId?: string;
  /** 文字证据（无截图时使用） */
  textEvidence?: string;
  /** 截图上的高亮框（可选） */
  highlights?: HighlightBoxConfig[];
  /** 图片在证据框中的位置，例如 "center 38%" */
  imageObjectPosition?: string;
  /** 图片整体位移，用于微调人物素材构图 */
  imageTranslateY?: number;
  /** 当前讲解焦点强度，0 为弱化，1 为当前重点 */
  focusProgress?: number;
  /** 焦点色调 */
  focusTone?: "accent" | "success" | "danger" | "warning";
}

export const EvidenceBlock: React.FC<EvidenceBlockProps> = ({
  theme,
  label,
  conclusion,
  assetId,
  textEvidence,
  highlights,
  imageObjectPosition,
  imageTranslateY = 0,
  focusProgress = 1,
  focusTone = "accent",
}) => {
  const focus = Math.max(0, Math.min(1, focusProgress));
  const focusColor =
    focusTone === "success"
      ? theme.success
      : focusTone === "danger"
        ? theme.danger
        : focusTone === "warning"
          ? theme.warning
          : theme.accentColor;
  const focusScale = interpolate(focus, [0, 1], [0.985, 1]);
  const focusOpacity = interpolate(focus, [0, 1], [0.66, 1]);
  const focusBorderWidth = interpolate(focus, [0, 1], [1.5, 3]);
  const focusTintOpacity = interpolate(focus, [0, 1], [0, 0.09]);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        padding: "24px 28px",
        borderRadius: 20,
        background: `linear-gradient(180deg, ${theme.background} 0%, ${theme.backgroundAlt} 100%)`,
        border: `${focusBorderWidth}px solid ${focus > 0.7 ? focusColor : theme.cardBorder}`,
        boxShadow: focus > 0.7 ? theme.shadowLg : theme.shadow,
        flex: 1,
        minHeight: 0,
        opacity: focusOpacity,
        transform: `scale(${focusScale})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 20,
          background: focusColor,
          opacity: focusTintOpacity,
          pointerEvents: "none",
        }}
      />
      {/* 变量标签 */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          fontSize: 30,
          fontWeight: 700,
          color: focus > 0.7 ? focusColor : theme.accentColor,
          textTransform: "uppercase",
          letterSpacing: 1,
          fontFamily: theme.fontFamily,
        }}
      >
        {label}
      </div>

      {/* 一句结论 */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          fontSize: 44,
          fontWeight: 800,
          color: theme.primaryText,
          textAlign: "center",
          fontFamily: theme.fontFamily,
          lineHeight: 1.3,
          maxWidth: "95%",
        }}
      >
        <SafeTitleText text={conclusion} maxCharsPerLine={14} />
      </div>

      {/* 截图证据：统一 viewport，左右截图等大 */}
      {assetId && (
        <div
          style={{
            position: "relative",
            zIndex: 1,
            borderRadius: 10,
            overflow: "hidden",
            border: `1px solid ${focus > 0.7 ? focusColor : theme.cardBorder}`,
            width: "100%",
            flex: 1,
            minHeight: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: theme.backgroundAlt,
          }}
        >
          <Img
            src={staticFile(assetIdToProcessedPath(assetId))}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: imageObjectPosition ?? "center center",
              display: "block",
              transform: `translateY(${imageTranslateY}px)`,
            }}
          />
          {highlights?.map((h, i) => (
            <HighlightBox key={i} {...h} delay={i * 6} />
          ))}
        </div>
      )}

      {/* 文字证据 */}
      {!assetId && textEvidence && (
        <div
          style={{
            position: "relative",
            zIndex: 1,
            fontSize: 38,
            fontWeight: 600,
            color: theme.secondaryText,
            textAlign: "center",
            fontFamily: theme.fontFamily,
            padding: "12px 16px",
            borderRadius: 12,
            background: `${theme.accentColor}08`,
            border: `1px dashed ${theme.accentColor}33`,
          }}
        >
          {textEvidence}
        </div>
      )}
    </div>
  );
};
