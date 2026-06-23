/**
 * 场景镀铬层（Scene Chrome）
 *
 * 左上角：场景进度
 * 右上角：品牌头像 + 名称
 * 进度条：在 badges 下方
 */

import React from "react";
import { useCurrentFrame, Img, staticFile } from "remotion";
import type { VideoTheme } from "../themes/types";
import {
  assetIdToProcessedPath,
  toPublicStaticFilePath,
} from "../utils/mediaPaths";

export interface SceneChromeProps {
  theme: VideoTheme;
  current: number;
  total: number;
  /** 当前场景起始帧 */
  sceneStartFrame?: number;
  /** 当前场景总帧数 */
  sceneDurationFrames?: number;
  brand?: string;
  brandLogoAssetId?: string | null;
  showProgress?: boolean;
}

export const SceneChrome: React.FC<SceneChromeProps> = ({
  theme,
  current,
  total,
  sceneStartFrame = 0,
  sceneDurationFrames = 1,
  brand,
  brandLogoAssetId,
  showProgress = true,
}) => {
  const frame = useCurrentFrame();
  const isBlueprint = theme.id === "knowledge-blueprint";

  // Sequence 内 useCurrentFrame() 已经是场景内帧数（从 0 开始）
  const progress = Math.min(frame / sceneDurationFrames, 1);

  const glassBg = isBlueprint
    ? "rgba(10,22,40,0.75)"
    : "rgba(255,255,255,0.85)";
  const glassBorder = isBlueprint
    ? "1px solid rgba(0,212,255,0.2)"
    : "1px solid rgba(0,0,0,0.08)";
  const glassBlur = "blur(8px)";
  const textColor = isBlueprint ? "#E8F0FF" : "#111318";
  const accentColor = isBlueprint ? "#00D4FF" : theme.accentColor;

  return (
    <>
      {/* ─── 左上角：场景进度 ─── */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 28,
          zIndex: 20,
          background: glassBg,
          backdropFilter: glassBlur,
          WebkitBackdropFilter: glassBlur,
          border: glassBorder,
          borderRadius: 10,
          padding: "6px 14px",
          fontSize: 16,
          fontWeight: 700,
          fontFamily: theme.monoFont,
          color: accentColor,
          letterSpacing: 2,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {String(current).padStart(2, "0")}/{String(total).padStart(2, "0")}
      </div>

      {/* ─── 右上角：品牌头像 + 名称 ─── */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 28,
          display: "flex",
          alignItems: "center",
          gap: 10,
          zIndex: 20,
          background: glassBg,
          backdropFilter: glassBlur,
          WebkitBackdropFilter: glassBlur,
          border: glassBorder,
          borderRadius: 10,
          padding: "6px 14px 6px 6px",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <Img
          src={staticFile(
            brandLogoAssetId
              ? assetIdToProcessedPath(brandLogoAssetId)
              : toPublicStaticFilePath("assets/avatar.png"),
          )}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <span
          style={{
            fontSize: 15,
            fontWeight: 600,
            fontFamily: theme.fontFamily,
            color: textColor,
            letterSpacing: 0.5,
          }}
        >
          {brand ?? "世间一点尘"}
        </span>
      </div>

      {/* ─── 进度条：badges 下方 ─── */}
      {showProgress && (
        <div
          style={{
            position: "absolute",
            top: 62,
            left: 28,
            right: 28,
            height: 3,
            background: isBlueprint
              ? "rgba(0,212,255,0.1)"
              : "rgba(0,0,0,0.05)",
            borderRadius: 2,
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              background: theme.accentGradient,
              borderRadius: 2,
            }}
          />
        </div>
      )}
    </>
  );
};
