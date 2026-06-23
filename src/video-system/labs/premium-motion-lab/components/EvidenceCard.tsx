import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fadeSlideIn, progressiveReveal } from "../tokens/motion";
import { fontSize, fontWeight, typeScale } from "../tokens/typography";
import { layout } from "../tokens/layout";

interface EvidenceSide {
  title: string;
  items: string[];
  /** 高亮框位置（百分比） */
  highlight?: { top: number; left: number; width: number; height: number };
  /** 模拟截图内容 */
  mockContent?: string;
}

interface EvidenceCardProps {
  /** 总标题 */
  title: string;
  /** 左侧 */
  left: EvidenceSide;
  /** 右侧 */
  right: EvidenceSide;
  /** 底部结论 */
  conclusion?: string;
  /** 入场延迟 */
  delay?: number;
}

/**
 * 证据卡组件
 * - 左右对比按顺序进入
 * - 高亮框 frame-driven reveal
 * - 截图/证据卡是主体
 * - caption 不比证据卡更抢眼
 */
export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  title,
  left,
  right,
  conclusion,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 标题入场
  const titleAnim = fadeSlideIn(frame, fps, delay);
  // 结论入场（延迟 45 帧）
  const conclusionAnim = fadeSlideIn(frame, fps, delay + 45);
  // 左栏入场（延迟 15 帧）
  const leftAnim = fadeSlideIn(frame, fps, delay + 15);
  // 右栏入场（延迟 30 帧）
  const rightAnim = fadeSlideIn(frame, fps, delay + 30);

  // 高亮框 reveal（延迟 50 帧）
  const highlightProgress = fadeSlideIn(frame, fps, delay + 50, 20);

  const cardStyle: React.CSSProperties = {
    borderRadius: layout.evidenceCard.borderRadius,
    padding: layout.evidenceCard.padding,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    position: "relative",
    overflow: "hidden",
  };

  const renderSide = (
    side: EvidenceSide,
    anim: { opacity: number; translateY: number },
  ) => (
    <div
      style={{
        ...cardStyle,
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 栏标题 */}
      <div
        style={{
          fontSize: fontSize("label"),
          fontWeight: fontWeight("label"),
          color: "rgba(255, 255, 255, 0.5)",
          marginBottom: 12,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {side.title}
      </div>

      {/* 模拟截图/证据区域 */}
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderRadius: 8,
          padding: 20,
          minHeight: 200,
          position: "relative",
        }}
      >
        {/* 模拟内容 */}
        {side.mockContent && (
          <div
            style={{
              fontSize: fontSize("bodyM"),
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.6)",
              lineHeight: 1.6,
            }}
          >
            {side.mockContent}
          </div>
        )}

        {/* 高亮框 */}
        {side.highlight && (
          <div
            style={{
              position: "absolute",
              top: `${side.highlight.top}%`,
              left: `${side.highlight.left}%`,
              width: `${side.highlight.width}%`,
              height: `${side.highlight.height}%`,
              border: `${layout.evidenceCard.highlightBorderWidth}px solid #f59e0b`,
              borderRadius: layout.evidenceCard.highlightBorderRadius,
              boxShadow: "0 0 12px 3px rgba(245, 158, 11, 0.3)",
              opacity: highlightProgress.opacity,
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      {/* 项目列表 */}
      <div style={{ marginTop: 16 }}>
        {side.items.map((item, i) => (
          <div
            key={i}
            style={{
              fontSize: fontSize("captionL"),
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.8)",
              lineHeight: typeScale.captionL.lineHeight,
              marginBottom: 4,
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: layout.padding.y,
      }}
    >
      {/* 总标题 */}
      <div
        style={{
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.translateY}px)`,
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        <span
          style={{
            fontSize: fontSize("headingL"),
            fontWeight: fontWeight("headingL"),
            color: "#ffffff",
            lineHeight: typeScale.headingL.lineHeight,
          }}
        >
          {title}
        </span>
      </div>

      {/* 左右对比区 */}
      <div
        style={{
          display: "flex",
          gap: 40,
          flex: 1,
        }}
      >
        {renderSide(left, leftAnim)}
        {renderSide(right, rightAnim)}
      </div>

      {/* 底部结论 */}
      {conclusion && (
        <div
          style={{
            opacity: conclusionAnim.opacity,
            transform: `translateY(${conclusionAnim.translateY}px)`,
            textAlign: "center",
            marginTop: 32,
            padding: "16px 24px",
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            borderRadius: 12,
            border: "1px solid rgba(245, 158, 11, 0.2)",
          }}
        >
          <span
            style={{
              fontSize: fontSize("bodyL"),
              fontWeight: fontWeight("bodyL"),
              color: "#f59e0b",
              lineHeight: typeScale.bodyL.lineHeight,
            }}
          >
            {conclusion}
          </span>
        </div>
      )}
    </div>
  );
};
