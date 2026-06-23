/**
 * PromptTemplateCard — 可复制模板卡
 *
 * 用于 todo-checklist + visualRole=template 场景。
 * 把清单项渲染为填空式模板行，适合截图保存。
 */

import React from "react";
import { useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import type { VideoTheme } from "../themes/types";
import { fadeSlideIn } from "../utils/animation";

export interface PromptTemplateCardProps {
  theme: VideoTheme;
  title: string;
  items: string[];
}

export const PromptTemplateCard: React.FC<PromptTemplateCardProps> = ({
  theme,
  title,
  items,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8F9FF 100%)",
        border: `2px solid ${theme.accentColor}33`,
        borderRadius: 24,
        padding: "36px 40px",
        boxShadow: `0 16px 48px ${theme.accentColor}18`,
        maxWidth: 1100,
        width: "100%",
      }}
    >
      <h3
        style={{
          fontSize: 52,
          fontWeight: 900,
          color: theme.primaryText,
          marginBottom: 24,
          textAlign: "center",
          fontFamily: theme.fontFamily,
        }}
      >
        {title}
      </h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {items.map((item, i) => {
          const anim = fadeSlideIn({ frame, fps, delay: i * 12 });
          return (
            <Sequence key={i} from={i * 12} layout="none">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "24px 32px",
                  borderRadius: 14,
                  border: `1.5px solid ${theme.accentColor}22`,
                  background: "#FFFFFF",
                  fontFamily: theme.fontFamily,
                  opacity: anim.opacity,
                  transform: `translateY(${anim.translateY}px)`,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: theme.accentColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "#fff",
                    fontSize: 22,
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    fontSize: 44,
                    fontWeight: 700,
                    color: theme.primaryText,
                    lineHeight: 1.4,
                  }}
                >
                  {item}
                </div>
              </div>
            </Sequence>
          );
        })}
      </div>
      <Sequence from={items.length * 12 + 6} layout="none">
        <div
          style={{
            textAlign: "center",
            fontSize: 28,
            color: theme.secondaryText,
            opacity: 0.7,
            marginTop: 20,
            fontFamily: theme.fontFamily,
          }}
        >
          收藏这个模板
        </div>
      </Sequence>
    </div>
  );
};
