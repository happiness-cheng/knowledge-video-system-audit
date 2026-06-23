/**
 * MapLightUp
 *
 * 表达“手册点亮项目地图，但硬拦截来自权限/Hook”。
 */

import React from "react";
import { interpolate, spring } from "remotion";
import type { VideoTheme } from "../../themes/types";
import { MotionPath } from "../motion/MotionPath";

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const rightMiddle = (rect: Rect) => ({
  x: rect.left + rect.width,
  y: rect.top + rect.height / 2,
});

const leftMiddle = (rect: Rect) => ({
  x: rect.left,
  y: rect.top + rect.height / 2,
});

const edgePath = (from: Rect, to: Rect, bend = 0) => {
  const start = rightMiddle(from);
  const end = leftMiddle(to);
  const distance = Math.max(90, end.x - start.x);
  const controlOffset = distance * 0.48;

  return `M ${start.x} ${start.y} C ${start.x + controlOffset} ${
    start.y + bend
  }, ${end.x - controlOffset} ${end.y - bend}, ${end.x} ${end.y}`;
};

const MapNode: React.FC<{
  rect: Rect;
  label: string;
  detail: string;
  progress: number;
  index: number;
  theme: VideoTheme;
}> = ({ rect, label, detail, progress, index, theme }) => {
  const active = clamp01(progress * 1.4 - index * 0.22);
  const scale = interpolate(active, [0, 1], [0.92, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        boxSizing: "border-box",
        transform: `scale(${scale})`,
        transformOrigin: "center",
        opacity: interpolate(active, [0, 0.35, 1], [0.18, 0.72, 1]),
        borderRadius: 20,
        background:
          active > 0.72 ? `${theme.accentColor}12` : theme.cardBackground,
        border: `3px solid ${
          active > 0.72 ? theme.accentColor : theme.cardBorder
        }`,
        boxShadow:
          active > 0.72
            ? `0 18px 42px rgba(15,23,42,0.10), 0 0 28px ${theme.accentColor}35`
            : "0 10px 28px rgba(15,23,42,0.06)",
        padding: "18px 20px",
      }}
    >
      <div
        style={{
          color: theme.primaryText,
          fontSize: 30,
          fontWeight: 900,
          lineHeight: 1.12,
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: theme.secondaryText,
          fontSize: 22,
          fontWeight: 720,
          lineHeight: 1.2,
        }}
      >
        {detail}
      </div>
    </div>
  );
};

const LockIcon: React.FC<{
  active: number;
  theme: VideoTheme;
}> = ({ active, theme }) => (
  <div
    style={{
      position: "relative",
      width: 42,
      height: 44,
      flex: "0 0 auto",
      opacity: interpolate(active, [0, 1], [0.36, 1]),
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 9,
        top: 0,
        width: 24,
        height: 24,
        borderRadius: "18px 18px 8px 8px",
        border: `5px solid ${theme.danger}`,
        borderBottom: 0,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 3,
        right: 3,
        bottom: 0,
        height: 29,
        borderRadius: 8,
        background: theme.danger,
        boxShadow: active > 0.72 ? `0 0 22px ${theme.danger}55` : "none",
      }}
    />
  </div>
);

const LockZone: React.FC<{
  rect: Rect;
  label: string;
  detail: string;
  index: number;
  progress: number;
  theme: VideoTheme;
}> = ({ rect, label, detail, index, progress, theme }) => {
  const active = clamp01(progress * 1.35 - index * 0.22);

  return (
    <div
      style={{
        position: "absolute",
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        boxSizing: "border-box",
        borderRadius: 18,
        border: `3px solid ${
          active > 0.72 ? theme.danger : theme.cardBorder
        }`,
        background: active > 0.72 ? `${theme.danger}10` : theme.cardBackground,
        opacity: interpolate(active, [0, 0.25, 1], [0.22, 0.7, 1]),
        transform: `translateX(${interpolate(active, [0, 1], [18, 0])}px)`,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "0 22px",
        boxShadow: active > 0.72 ? `0 14px 34px ${theme.danger}18` : "none",
        zIndex: 4,
      }}
    >
      <LockIcon active={active} theme={theme} />
      <div>
        <div
          style={{
            color: theme.primaryText,
            fontSize: 29,
            fontWeight: 900,
            lineHeight: 1.08,
            marginBottom: 8,
          }}
        >
          {label}
        </div>
        <div
          style={{
            color: theme.secondaryText,
            fontSize: 21,
            fontWeight: 720,
            lineHeight: 1.18,
          }}
        >
          {detail}
        </div>
      </div>
    </div>
  );
};

export const MapLightUp: React.FC<{
  frame: number;
  fps: number;
  theme: VideoTheme;
  title?: string;
  manualTitle?: string;
  mapNodes?: Array<{ label: string; detail: string }>;
  lockZones?: Array<{ label: string; detail: string }>;
}> = ({
  frame,
  fps,
  theme,
  title = "手册点亮地图，权限锁住危险区",
  manualTitle = "CLAUDE.md",
  mapNodes = [
    { label: "项目规则", detail: "知道该按什么约定做" },
    { label: "目录职责", detail: "知道文件应该改哪里" },
    { label: "验证路线", detail: "知道完成后怎么检查" },
  ],
  lockZones = [
    { label: "删除文件", detail: "需要明确确认" },
    { label: "改密钥", detail: "敏感字段不可擅动" },
    { label: "危险 git", detail: "reset / force push 拦截" },
  ],
}) => {
  const manualIn = clamp01(
    interpolate(frame, [0, 28], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const mapPath = clamp01(
    interpolate(frame, [28, 78], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const nodeProgress = clamp01(
    interpolate(frame, [50, 104], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const divideIn = clamp01(
    interpolate(frame, [76, 106], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const lockProgress = clamp01(
    interpolate(frame, [96, 148], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const pulse = spring({
    frame: frame - 34,
    fps,
    config: { damping: 16, stiffness: 92, mass: 0.85 },
  });
  const manualScale = interpolate(clamp01(pulse), [0, 1], [1, 1.035]);

  const manualRect: Rect = { left: 44, top: 332, width: 286, height: 248 };
  const mapNodeRects: Rect[] = [
    { left: 430, top: 184, width: 286, height: 154 },
    { left: 474, top: 358, width: 286, height: 154 },
    { left: 396, top: 542, width: 286, height: 154 },
  ];
  const dividerNoteRect: Rect = { left: 804, top: 350, width: 180, height: 106 };
  const guardrailSourceRect: Rect = {
    left: 970,
    top: 350,
    width: 18,
    height: 106,
  };
  const lockPanelRect: Rect = { left: 1042, top: 168, width: 448, height: 466 };
  const lockRowRects: Rect[] = [
    { left: 32, top: 92, width: 384, height: 104 },
    { left: 32, top: 210, width: 384, height: 104 },
    { left: 32, top: 328, width: 384, height: 104 },
  ];
  const absoluteLockRowRects = lockRowRects.map((rect) => ({
    ...rect,
    left: rect.left + lockPanelRect.left,
    top: rect.top + lockPanelRect.top,
  }));
  const mapPathLengths = [560, 460, 500];
  const lockPathLengths = [170, 136, 170];
  const mapPathBends = [-82, 0, 78];
  const lockPathBends = [-16, 0, 16];
  const lockStartRects = [
    guardrailSourceRect,
    guardrailSourceRect,
    guardrailSourceRect,
  ];

  return (
    <div
      style={{
        position: "relative",
        width: 1540,
        height: 690,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 64,
          fontWeight: 950,
          color: theme.primaryText,
          lineHeight: 1.08,
        }}
      >
        {title}
      </div>

      <div
        style={{
          position: "absolute",
          left: 86,
          top: 98,
          color: theme.accentColor,
          fontSize: 28,
          fontWeight: 900,
        }}
      >
        上下文提醒
      </div>
      <div
        style={{
          position: "absolute",
          left: lockPanelRect.left + 256,
          top: 98,
          color: theme.danger,
          fontSize: 28,
          fontWeight: 900,
        }}
      >
        硬拦截边界
      </div>

      <svg
        width="1540"
        height="690"
        viewBox="0 0 1540 690"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {mapNodeRects.map((nodeRect, index) => (
          <MotionPath
            key={`map-path-${index}`}
            d={edgePath(manualRect, nodeRect, mapPathBends[index])}
            color={theme.accentColor}
            progress={mapPath}
            length={mapPathLengths[index]}
            strokeWidth={10}
            ghostOpacity={0.16}
            activeOpacity={0.96}
          />
        ))}
        <line
          x1="770"
          y1="126"
          x2="770"
          y2="648"
          stroke={theme.cardBorder}
          strokeWidth="4"
          strokeDasharray="16 16"
          opacity={0.28 + divideIn * 0.44}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: manualRect.left,
          top: manualRect.top,
          width: manualRect.width,
          height: manualRect.height,
          boxSizing: "border-box",
          borderRadius: 24,
          background: theme.cardBackground,
          border: `4px solid ${theme.accentColor}`,
          boxShadow: `0 24px 58px rgba(15,23,42,0.10), 0 0 ${manualIn * 34}px ${theme.accentColor}35`,
          opacity: manualIn,
          transform: `scale(${interpolate(manualIn, [0, 1], [0.9, manualScale])})`,
          padding: "28px 24px",
          zIndex: 2,
        }}
      >
        <div
          style={{
            height: 58,
            borderRadius: 12,
            background: theme.accentGradient,
            color: "#fff",
            fontFamily: theme.monoFont,
            fontSize: 32,
            fontWeight: 950,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 22,
          }}
        >
          {manualTitle}
        </div>
        <div
          style={{
            color: theme.primaryText,
            fontSize: 30,
            fontWeight: 900,
            lineHeight: 1.16,
            marginBottom: 10,
          }}
        >
          点亮怎么走
        </div>
        <div
          style={{
            color: theme.secondaryText,
            fontSize: 22,
            fontWeight: 720,
            lineHeight: 1.22,
          }}
        >
          它是上下文，不是保险丝
        </div>
      </div>

      {mapNodes.slice(0, 3).map((node, index) => (
        <MapNode
          key={node.label}
          rect={mapNodeRects[index]}
          label={node.label}
          detail={node.detail}
          progress={nodeProgress}
          index={index}
          theme={theme}
        />
      ))}

      <svg
        width="1540"
        height="690"
        viewBox="0 0 1540 690"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 3,
        }}
      >
        {absoluteLockRowRects.map((lockRect, index) => (
          <MotionPath
            key={`lock-path-${index}`}
            d={edgePath(lockStartRects[index], lockRect, lockPathBends[index])}
            color={theme.danger}
            progress={lockProgress}
            length={lockPathLengths[index]}
            strokeWidth={7}
            ghostOpacity={0}
            activeOpacity={0.5}
            dashPattern="18 16"
          />
        ))}
      </svg>

      <div
        style={{
          position: "absolute",
          left: lockPanelRect.left,
          top: lockPanelRect.top,
          width: lockPanelRect.width,
          height: lockPanelRect.height,
          boxSizing: "border-box",
          borderRadius: 28,
          background: `${theme.danger}08`,
          border: `4px solid ${theme.danger}`,
          boxShadow: `0 22px 56px ${theme.danger}14`,
          opacity: interpolate(lockProgress, [0, 0.24, 1], [0, 0.42, 1]),
          padding: "30px 34px",
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 4,
            color: theme.primaryText,
            fontSize: 34,
            fontWeight: 950,
            lineHeight: 1.12,
            marginBottom: 22,
          }}
        >
          真正拦截危险动作
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
          }}
        >
          {lockZones.slice(0, 3).map((zone, index) => (
            <LockZone
              key={zone.label}
              rect={lockRowRects[index]}
              label={zone.label}
              detail={zone.detail}
              index={index}
              progress={lockProgress}
              theme={theme}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: dividerNoteRect.left,
          top: dividerNoteRect.top,
          width: dividerNoteRect.width,
          height: dividerNoteRect.height,
          boxSizing: "border-box",
          transform: `translateX(${interpolate(divideIn, [0, 1], [-10, 0])}px)`,
          opacity: divideIn,
          color: theme.secondaryText,
          fontSize: 27,
          fontWeight: 820,
          lineHeight: 1.22,
          textAlign: "center",
          zIndex: 4,
        }}
      >
        提醒路线
        <br />
        不等于
        <br />
        自动拦截
      </div>
    </div>
  );
};
