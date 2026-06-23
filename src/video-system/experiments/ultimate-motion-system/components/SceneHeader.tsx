import React from "react";
import { useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import { fadeSlide } from "../labMotionPrimitives";

interface SceneHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  showAvatar?: boolean;
  style?: React.CSSProperties;
}

/** SceneHeader — 场景顶部标题区，可选品牌头像 */
export const SceneHeader: React.FC<SceneHeaderProps> = ({ title, subtitle, badge, showAvatar = false, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tAnim = fadeSlide(frame, fps, 0);
  const sAnim = fadeSlide(frame, fps, 8);
  return (
    <div style={{ textAlign: "center", marginBottom: 32, ...style }}>
      {showAvatar && (
        <Img
          src={staticFile("assets/avatar.png")}
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: 12,
            opacity: tAnim.opacity,
            border: "2px solid rgba(99,102,241,0.3)",
          }}
        />
      )}
      {badge && <div style={{ fontSize: 36, fontWeight: 650, color: "#6366f1", letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 8, opacity: tAnim.opacity }}>{badge}</div>}
      <div style={{ fontSize: 104, fontWeight: 700, color: "#f0f0f5", opacity: tAnim.opacity, transform: `translateY(${tAnim.translateY}px)` }}>{title}</div>
      {subtitle && <div style={{ fontSize: 88, fontWeight: 650, color: "#a0a0b8", marginTop: 12, opacity: sAnim.opacity, transform: `translateY(${sAnim.translateY}px)` }}>{subtitle}</div>}
    </div>
  );
};
