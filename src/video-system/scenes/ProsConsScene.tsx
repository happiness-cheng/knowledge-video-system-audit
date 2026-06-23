/**
 * 优缺点场景
 *
 * 该做/不该做、优点/风险、正确方式/错误方式。
 * 视觉区分左右两侧，但不使用过度强烈的红绿配色。
 */

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoTheme } from "../themes/types";
import { fadeSlideIn, progressiveReveal } from "../utils/animation";
import { Card } from "../components/Card";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";

export interface ProsConsSceneData {
  type: "pros-cons";
  title: string;
  prosTitle: string;
  pros: string[];
  consTitle: string;
  cons: string[];
  keywords?: string[];
  animation?: string;
}

export const ProsConsScene: React.FC<{
  scene: ProsConsSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
}> = ({ scene, theme, layout = "landscape" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lc = useLayoutConfig(layout);

  const titleAnim = fadeSlideIn({ frame, fps, delay: 0 });
  const prosAnim = fadeSlideIn({ frame, fps, delay: 8 });
  const consAnim = fadeSlideIn({ frame, fps, delay: 14 });

  // 用主题的 success/accent 做区分，而非强烈红绿
  const prosColor = theme.success;
  const consColor = theme.warning;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: theme.background,
        fontFamily: theme.fontFamily,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: theme.spacing.page,
      }}
    >
      {theme.toplineGradient && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: theme.toplineGradient,
          }}
        />
      )}

      <h2
        style={{
          fontSize: Math.max(theme.titleStyle.fontSize * 0.88, 88),
          fontWeight: theme.titleStyle.fontWeight,
          color: theme.primaryText,
          marginBottom: theme.spacing.section,
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.translateY}px)`,
        }}
      >
        {scene.title}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: theme.spacing.section,
        }}
      >
        {/* Pros */}
        <div
          style={{
            opacity: prosAnim.opacity,
            transform: `translateY(${prosAnim.translateY}px)`,
          }}
        >
          <Card theme={theme} accent={prosColor}>
            <div
              style={{
                fontSize: 38,
                fontWeight: 800,
                color: prosColor,
                marginBottom: 14,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {scene.prosTitle}
            </div>
            {scene.pros.map((item, i) => {
              const anim = progressiveReveal({
                frame,
                fps,
                index: i,
                total: scene.pros.length,
                staggerDelay: 8,
              });
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 42,
                    fontWeight: 600,
                    color: theme.primaryText,
                    padding: "8px 0",
                    opacity: anim.opacity,
                    transform: `translateY(${anim.translateY}px)`,
                  }}
                >
                  <span style={{ color: prosColor, fontSize: 36 }}>✓</span>
                  {item}
                </div>
              );
            })}
          </Card>
        </div>

        {/* Cons */}
        <div
          style={{
            opacity: consAnim.opacity,
            transform: `translateY(${consAnim.translateY}px)`,
          }}
        >
          <Card theme={theme} accent={consColor}>
            <div
              style={{
                fontSize: 38,
                fontWeight: 800,
                color: consColor,
                marginBottom: 14,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {scene.consTitle}
            </div>
            {scene.cons.map((item, i) => {
              const anim = progressiveReveal({
                frame,
                fps,
                index: i,
                total: scene.cons.length,
                staggerDelay: 8,
              });
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 42,
                    fontWeight: 600,
                    color: theme.primaryText,
                    padding: "8px 0",
                    opacity: anim.opacity,
                    transform: `translateY(${anim.translateY}px)`,
                  }}
                >
                  <span style={{ color: consColor, fontSize: 36 }}>✗</span>
                  {item}
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
};
