/**
 * 背景层组件
 *
 * 为页面增加轻量背景装饰，提升完成度。
 * 三种模式：glow（径向光晕）、grid（网格）、none。
 * 所有装饰强度极低，不抢内容。
 *
 * drift 模式：当 frame 和 enableDrift 传入时，glow 中心缓慢漂移 + opacity 脉冲。
 * 仅用于 S01/S05/S08，不在全局开启。
 */

import React from "react";
import { interpolate } from "remotion";
import type { VideoTheme } from "../themes/types";

export interface BackgroundLayerProps {
  theme: VideoTheme;
  /** 背景模式：glow=径向光晕，grid=网格，none=不渲染 */
  mode?: "glow" | "grid" | "none";
  /** 可选的背景大号章节编号 */
  sectionNumber?: string;
  /** 当前帧数，drift 模式必需 */
  frame?: number;
  /** 启用 drift：glow 中心缓慢漂移 + opacity 脉冲 */
  enableDrift?: boolean;
}

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  theme,
  mode = "glow",
  sectionNumber,
  frame,
  enableDrift = false,
}) => {
  const isBlueprint = theme.id === "knowledge-blueprint";
  const driftActive = enableDrift && frame != null && frame > 0;

  // drift: glow 中心缓慢漂移
  const driftX = driftActive
    ? interpolate(frame, [0, 900], [45, 55], { extrapolateRight: "clamp" })
    : 50;
  const driftY = driftActive
    ? interpolate(frame, [0, 900], [40, 52], { extrapolateRight: "clamp" })
    : 45;
  // drift: opacity 极弱脉冲
  const driftOpacity = driftActive
    ? interpolate(Math.sin(frame * 0.02), [-1, 1], [0.015, 0.035])
    : isBlueprint
      ? 0.04
      : 0.03;

  return (
    <>
      {/* 径向光晕：白底主题用极浅灰，蓝图主题用极浅 cyan */}
      {mode === "glow" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isBlueprint
              ? `radial-gradient(ellipse 70% 60% at ${driftX}% ${driftY}%, rgba(0,212,255,${driftOpacity}) 0%, transparent 70%)`
              : `radial-gradient(ellipse 60% 50% at ${driftX}% ${driftY}%, rgba(123,97,255,${driftOpacity}) 0%, transparent 60%)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* 网格：蓝图主题专用，白底主题也用极浅灰网格 */}
      {mode === "grid" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: isBlueprint
              ? `
                linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)
              `
              : `
                linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
              `,
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />
      )}

      {/* 背景大号章节编号 */}
      {sectionNumber && (
        <div
          style={{
            position: "absolute",
            right: 60,
            bottom: 40,
            fontSize: 200,
            fontWeight: 900,
            fontFamily: theme.monoFont,
            color: isBlueprint ? "rgba(0,212,255,0.04)" : "rgba(0,0,0,0.03)",
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {sectionNumber}
        </div>
      )}
    </>
  );
};
