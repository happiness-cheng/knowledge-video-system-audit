/**
 * 三栏场景
 *
 * 三个并列观点/能力/阶段。每栏文字短，支持逐个出现。
 */

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoTheme } from "../themes/types";
import { fadeSlideIn, progressiveReveal } from "../utils/animation";
import { Card } from "../components/Card";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";

export interface ThreeColumnSceneData {
  type: "three-column";
  title: string;
  columns: Array<{ title: string; text: string }>;
  keywords?: string[];
  animation?: string;
}

export const ThreeColumnScene: React.FC<{
  scene: ThreeColumnSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
}> = ({ scene, theme, layout = "landscape" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lc = useLayoutConfig(layout);

  const titleAnim = fadeSlideIn({ frame, fps, delay: 0 });
  const cols = scene.columns.slice(0, 3);
  const accentColors = [theme.accentColor, theme.success, theme.warning];

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
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: theme.spacing.item,
        }}
      >
        {cols.map((col, i) => {
          const anim = progressiveReveal({
            frame,
            fps,
            index: i,
            total: cols.length,
            staggerDelay: 15,
          });
          return (
            <div
              key={i}
              style={{
                opacity: anim.opacity,
                transform: `translateY(${anim.translateY}px)`,
              }}
            >
              <Card theme={theme} accent={accentColors[i]}>
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 800,
                    color: accentColors[i],
                    marginBottom: 12,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {col.title}
                </div>
                <div
                  style={{
                    fontSize: 44,
                    fontWeight: 700,
                    color: theme.primaryText,
                    lineHeight: 1.4,
                  }}
                >
                  {col.text}
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};
