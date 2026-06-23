import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { fadeSlideIn } from "../tokens/motion";
import { fontSize, fontWeight, typeScale } from "../tokens/typography";
import { layout } from "../tokens/layout";
import { labContent } from "../labContent";

/**
 * S02 LabMistakeScene — 错误现场页
 * - 展示"错误做法 vs 改进做法"
 * - 左右栏按顺序进入
 * - 不展示 S03 的核心洞察
 * - 不展示四步模板
 * - 只解决"为什么原问法有问题"
 */
export const LabMistakeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scene = labContent.scenes[1]; // S02

  // 标题入场
  const titleAnim = fadeSlideIn(frame, fps, 0);
  // 左栏入场（延迟 15 帧）
  const leftAnim = fadeSlideIn(frame, fps, 15);
  // 右栏入场（延迟 30 帧）
  const rightAnim = fadeSlideIn(frame, fps, 30);

  const cardStyle: React.CSSProperties = {
    borderRadius: layout.evidenceCard.borderRadius,
    padding: layout.evidenceCard.padding,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  };

  const renderSide = (
    title: string,
    items: string[],
    anim: { opacity: number; translateY: number },
    isWrong: boolean,
  ) => (
    <div
      style={{
        ...cardStyle,
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
        borderColor: isWrong
          ? "rgba(239, 68, 68, 0.2)"
          : "rgba(34, 197, 94, 0.2)",
      }}
    >
      {/* 栏标题 */}
      <div
        style={{
          fontSize: fontSize("label"),
          fontWeight: fontWeight("label"),
          color: isWrong ? "#ef4444" : "#22c55e",
          marginBottom: 16,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {title}
      </div>

      {/* 模拟对话框 */}
      <div
        style={{
          backgroundColor: isWrong
            ? "rgba(239, 68, 68, 0.08)"
            : "rgba(34, 197, 94, 0.08)",
          borderRadius: 8,
          padding: 20,
          flex: 1,
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              fontSize: fontSize("bodyM"),
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.85)",
              lineHeight: typeScale.bodyM.lineHeight,
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        padding: layout.padding.y,
        justifyContent: "center",
      }}
    >
      {/* 总标题 */}
      <div
        style={{
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.translateY}px)`,
          textAlign: "center",
          marginBottom: 48,
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
          {scene.title}
        </span>
      </div>

      {/* 左右对比 */}
      <div
        style={{
          display: "flex",
          gap: 40,
          margin: "0 auto",
          width: "80%",
        }}
      >
        {renderSide(scene.leftTitle!, scene.leftItems!, leftAnim, true)}
        {renderSide(scene.rightTitle!, scene.rightItems!, rightAnim, false)}
      </div>
    </AbsoluteFill>
  );
};
