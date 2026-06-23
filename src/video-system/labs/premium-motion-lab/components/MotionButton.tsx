import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { springIn, gentlePulse, fadeSlideIn } from "../tokens/motion";
import { fontSize, fontWeight } from "../tokens/typography";

interface MotionButtonProps {
  /** 按钮文字 */
  text: string;
  /** 入场延迟 */
  delay?: number;
  /** 是否有呼吸效果 */
  breathe?: boolean;
  /** 按钮颜色 */
  color?: string;
}

/**
 * 动效按钮
 * - spring 入场
 * - 轻微呼吸效果（可选）
 * - 不闪烁
 */
export const MotionButton: React.FC<MotionButtonProps> = ({
  text,
  delay = 0,
  breathe = true,
  color = "#f59e0b",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // spring 入场
  const enterProgress = springIn(frame, fps, delay);

  // 呼吸效果（入场完成后开始）
  const pulseScale =
    breathe && frame > delay + 30
      ? gentlePulse(frame, fps, 1.0, 1.03, 0.05)
      : 1.0;

  return (
    <div
      style={{
        opacity: enterProgress,
        transform: `scale(${enterProgress * pulseScale})`,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          padding: "20px 48px",
          borderRadius: 16,
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          boxShadow: `0 8px 32px ${color}40`,
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontSize: fontSize("bodyM"),
            fontWeight: 600,
            color: "#000000",
            letterSpacing: "0.02em",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
