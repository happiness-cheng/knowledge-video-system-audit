import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { experimentColor } from "../tokens/experimentColor";
import { experimentLayout } from "../tokens/experimentLayout";
import { experimentType } from "../tokens/experimentTypography";
import { expFadeSlideIn } from "../tokens/experimentMotion";

interface TemplateShotProps {
  title: string;
  items: string[];
  /** 每项的 active opacity，由 director cue 控制 */
  itemOpacities: number[];
}

/**
 * TemplateShot — 可截图保存的模板页
 *
 * 四行逐步 active，使用 progressive-retain。
 * 最后阶段全体稳定，适合截图保存。
 */
export const TemplateShot: React.FC<TemplateShotProps> = ({
  title,
  items,
  itemOpacities,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = expFadeSlideIn(frame, fps, 0);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px 120px",
      }}
    >
      {/* 标题 */}
      <div
        style={{
          fontSize: experimentType.headingL.size,
          fontWeight: experimentType.headingL.weight,
          color: experimentColor.primaryText,
          marginBottom: 40,
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.translateY}px)`,
          textAlign: "center",
        }}
      >
        {title}
      </div>

      {/* 模板容器 */}
      <div
        style={{
          width: "80%",
          maxWidth: 1400,
          background: experimentColor.templateBg,
          border: `1.5px solid ${experimentColor.cardBorder}`,
          borderRadius: experimentLayout.template.borderRadius,
          padding: experimentLayout.template.padding,
          display: "flex",
          flexDirection: "column",
          gap: experimentLayout.template.itemGap,
        }}
      >
        {items.map((item, i) => {
          const itemAnim = expFadeSlideIn(frame, fps, 10 + i * 12);
          const activeOpacity = itemOpacities[i] ?? 0.4;

          // active 时背景更亮
          const bgOpacity = interpolate(
            activeOpacity,
            [0.4, 1],
            [0, 0.08],
            { extrapolateRight: "clamp" },
          );

          // 填空线位置
          const hasBlank = item.includes("____");

          return (
            <div
              key={i}
              style={{
                opacity: itemAnim.opacity * activeOpacity,
                transform: `translateY(${itemAnim.translateY}px)`,
                fontSize: experimentType.bodyL.size,
                fontWeight:
                  activeOpacity > 0.8
                    ? experimentType.bodyL.weight + 100
                    : experimentType.bodyL.weight,
                color:
                  activeOpacity > 0.8
                    ? experimentColor.primaryText
                    : experimentColor.secondaryText,
                lineHeight: experimentType.bodyL.lineHeight,
                padding: "16px 24px",
                borderRadius: 12,
                background:
                  bgOpacity > 0
                    ? `rgba(99,102,241,${bgOpacity})`
                    : "transparent",
                borderLeft:
                  activeOpacity > 0.8
                    ? `3px solid ${experimentColor.accent}`
                    : "3px solid transparent",
              }}
            >
              {hasBlank ? (
                <span>
                  {item.replace("____", "")}
                  <span
                    style={{
                      display: "inline-block",
                      width: 120,
                      height: 3,
                      background: experimentColor.templateFillLine,
                      verticalAlign: "middle",
                      marginLeft: 4,
                    }}
                  />
                </span>
              ) : (
                item
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
