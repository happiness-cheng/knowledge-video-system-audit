/**
 * StateTransition
 *
 * 表达同一个对象从“未入职”到“已入职”的状态变化。
 */

import React from "react";
import { interpolate, spring } from "remotion";
import type { VideoTheme } from "../../themes/types";
import { MotionPath } from "../motion/MotionPath";

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const StatusAvatar: React.FC<{
  x: number;
  y: number;
  label: string;
  status: string;
  tone: "muted" | "success";
  progress: number;
  theme: VideoTheme;
}> = ({ x, y, label, status, tone, progress, theme }) => {
  const color = tone === "success" ? theme.success : theme.secondaryText;
  const bg =
    tone === "success" ? `${theme.success}18` : "rgba(148, 163, 184, 0.10)";

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 330,
        minHeight: 300,
        transform: `translate(-50%, -50%) scale(${interpolate(progress, [0, 1], [0.96, 1.03])})`,
        opacity: interpolate(progress, [0, 0.18, 1], [0, 1, 1]),
        borderRadius: 24,
        background: bg,
        border: `3px solid ${color}`,
        boxShadow: `0 18px 48px rgba(15,23,42,${0.08 + progress * 0.08})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px 30px",
      }}
    >
      <div
        style={{
          width: 104,
          height: 104,
          borderRadius: 999,
          border: `4px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
          fontSize: 56,
          fontWeight: 950,
          marginBottom: 22,
          background: theme.cardBackground,
        }}
      >
        {tone === "success" ? "✓" : "?"}
      </div>
      <div
        style={{
          fontSize: 38,
          fontWeight: 900,
          color: theme.primaryText,
          marginBottom: 12,
        }}
      >
        {label}
      </div>
      <div
        style={{
          minWidth: 168,
          borderRadius: 999,
          background: color,
          color: "#fff",
          fontSize: 28,
          fontWeight: 850,
          padding: "8px 18px",
          textAlign: "center",
        }}
      >
        {status}
      </div>
    </div>
  );
};

const RuleRow: React.FC<{
  label: string;
  index: number;
  progress: number;
  theme: VideoTheme;
}> = ({ label, index, progress, theme }) => {
  const active = clamp01(progress * 1.72 - index * 0.22);

  return (
    <div
      style={{
        height: 48,
        display: "flex",
        alignItems: "center",
        gap: 12,
        color: active > 0.75 ? theme.primaryText : theme.secondaryText,
        fontSize: 28,
        fontWeight: 780,
        opacity: interpolate(active, [0, 1], [0.32, 1]),
        transform: `translateX(${interpolate(active, [0, 1], [14, 0])}px)`,
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 999,
          background: active > 0.72 ? theme.success : theme.cardBorder,
          boxShadow:
            active > 0.72 ? `0 0 18px ${theme.success}66` : "none",
          flex: "0 0 auto",
        }}
      />
      {label}
    </div>
  );
};

export const StateTransition: React.FC<{
  frame: number;
  fps: number;
  theme: VideoTheme;
  title?: string;
  beforeLabel?: string;
  beforeStatus?: string;
  afterLabel?: string;
  afterStatus?: string;
  manualTitle?: string;
  rules?: string[];
}> = ({
  frame,
  fps,
  theme,
  title = "读完手册，状态变了",
  beforeLabel = "Claude Code",
  beforeStatus = "未入职",
  afterLabel = "Claude Code",
  afterStatus = "已入职",
  manualTitle = "CLAUDE.md",
  rules = ["项目背景", "目录职责", "禁改区域", "验证方式"],
}) => {
  const beforeIn = clamp01(
    interpolate(frame, [0, 20], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const handbookIn = clamp01(
    interpolate(frame, [26, 54], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const rulesLoad = clamp01(
    interpolate(frame, [54, 106], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const pathDraw = clamp01(
    interpolate(frame, [78, 118], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const afterIn = clamp01(
    interpolate(frame, [98, 132], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const handbookPulse = spring({
    frame: frame - 72,
    fps,
    config: { damping: 17, stiffness: 95, mass: 0.9 },
  });
  const manualScale = interpolate(clamp01(handbookPulse), [0, 1], [1, 1.035]);

  return (
    <div
      style={{
        position: "relative",
        width: 1540,
        height: 660,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 68,
          fontWeight: 950,
          color: theme.primaryText,
          lineHeight: 1.1,
        }}
      >
        {title}
      </div>

      <svg
        width="1540"
        height="660"
        viewBox="0 0 1540 660"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <path
          d="M 286 374 C 392 406, 452 426, 558 374"
          fill="none"
          stroke={theme.secondaryText}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="20 18"
          opacity={0.22 * beforeIn}
        />
        <MotionPath
          d="M 982 374 C 1086 344, 1130 326, 1248 350"
          color={theme.success}
          progress={pathDraw}
          length={640}
          strokeWidth={8}
          ghostOpacity={0.14}
          activeOpacity={0.95}
        />
      </svg>

      <StatusAvatar
        x={220}
        y={374}
        label={beforeLabel}
        status={beforeStatus}
        tone="muted"
        progress={beforeIn}
        theme={theme}
      />

      <div
        style={{
          position: "absolute",
          left: 590,
          top: 204,
          width: 360,
          minHeight: 374,
          borderRadius: 24,
          background: theme.cardBackground,
          border: `3px solid ${theme.accentColor}`,
          boxShadow: `0 22px 62px rgba(15,23,42,${0.1 + rulesLoad * 0.08}), 0 0 ${rulesLoad * 30}px ${theme.accentColor}3d`,
          opacity: handbookIn,
          transform: `scale(${interpolate(handbookIn, [0, 1], [0.94, manualScale])})`,
          padding: "34px 40px",
        }}
      >
        <div
          style={{
            height: 58,
            borderRadius: 12,
            background: theme.accentGradient,
            color: "#fff",
            fontSize: 34,
            fontWeight: 950,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: theme.monoFont,
            marginBottom: 32,
          }}
        >
          {manualTitle}
        </div>
        {rules.slice(0, 4).map((rule, index) => (
          <RuleRow
            key={rule}
            label={rule}
            index={index}
            progress={rulesLoad}
            theme={theme}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: 40,
            right: 40,
            bottom: 28,
            height: 10,
            borderRadius: 999,
            background: `${theme.success}33`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${rulesLoad * 100}%`,
              height: "100%",
              borderRadius: 999,
              background: theme.success,
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 626,
          top: 600,
          width: 290,
          textAlign: "center",
          color: theme.secondaryText,
          fontSize: 27,
          fontWeight: 760,
          opacity: rulesLoad,
        }}
      >
        项目规则加载进工作状态
      </div>

      <StatusAvatar
        x={1320}
        y={374}
        label={afterLabel}
        status={afterStatus}
        tone="success"
        progress={afterIn}
        theme={theme}
      />
    </div>
  );
};
