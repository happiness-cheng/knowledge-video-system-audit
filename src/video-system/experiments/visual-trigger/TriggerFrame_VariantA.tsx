import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const DISPLAY = "'Georgia','Palatino Linotype','Noto Serif SC',serif";
const MONO = "'JetBrains Mono','SFMono-Regular','Consolas',monospace";

const FADE_IN = 8;
const HOLD = 28;
const OUT = 8;
const STEP = FADE_IN + HOLD + OUT;
const END = 200;

function segOpacity(frame: number, i: number) {
  const start = i * (STEP - 6);
  const end = start + STEP;
  if (frame < start || frame > end) return 0;
  const local = frame - start;
  if (local < FADE_IN) return local / FADE_IN;
  if (local < FADE_IN + HOLD) return 1;
  return 1 - (local - FADE_IN - HOLD) / OUT;
}

export const TriggerFrame_VariantA: React.FC = () => {
  const frame = useCurrentFrame();

  const s2Opacity = segOpacity(frame, 1);
  const s3Opacity = segOpacity(frame, 2);
  const s4Opacity = segOpacity(frame, 3);
  const s5Opacity = segOpacity(frame, 4);

  return (
    <AbsoluteFill style={{ backgroundColor: "#09090b", overflow: "hidden" }}>
      {/* 背景渐变情绪 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(245,158,11,0.03) 0%, transparent 60%)",
        }}
      />

      {/* 左上 Claude 标签 */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 50,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: 0.25,
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: 2 }}>CLAUDE</span>
      </div>

      {/* 第 1 句：同一个 Claude Code — 居中，大号 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "38%",
          textAlign: "center",
          opacity: segOpacity(frame, 0),
        }}
      >
        <div style={{ fontFamily: DISPLAY, fontSize: 56, fontWeight: 400, color: "rgba(248,250,252,0.85)", letterSpacing: 2 }}>
          同一个 Claude Code
        </div>
      </div>

      {/* 第 2 句：左右分栏，冷暖对比 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "38%",
          display: "flex",
          justifyContent: "center",
          gap: 80,
          opacity: s2Opacity,
        }}
      >
        <div style={{ textAlign: "right", fontFamily: DISPLAY, fontSize: 42, fontWeight: 400, color: "rgba(245,158,11,0.75)", letterSpacing: 1 }}>
          别人越用越省心
        </div>
        <div style={{ textAlign: "left", fontFamily: DISPLAY, fontSize: 42, fontWeight: 400, color: "rgba(148,163,184,0.5)", letterSpacing: 1 }}>
          你却越用越累
        </div>
      </div>

      {/* 第 3 句：差距真的是模型吗？ */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "30%",
          textAlign: "center",
          opacity: s3Opacity,
        }}
      >
        <div style={{ fontFamily: DISPLAY, fontSize: 44, fontWeight: 400, color: "rgba(248,250,252,0.7)", letterSpacing: 1, marginBottom: 12 }}>
          差距真的是
        </div>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 72, fontWeight: 700, color: "rgba(248,250,252,0.9)", letterSpacing: 2 }}>
            模型吗？
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "50%",
              height: 4,
              backgroundColor: "#ef4444",
              transform: `scaleX(${interpolate(frame, [84, 96], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              transformOrigin: "center center",
              opacity: interpolate(frame, [84, 96], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          />
        </div>
      </div>

      {/* 第 4 句：CLAUDE.md 打字出现 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "38%",
          textAlign: "center",
          opacity: s4Opacity,
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: 52, fontWeight: 700, color: "rgba(34,197,94,0.85)", letterSpacing: 1 }}>
          {(() => {
            const chars = "CLAUDE.md";
            const c4Start = 126;
            const speed = 4;
            const count = Math.min(chars.length, Math.max(0, Math.floor((frame - c4Start) / speed)));
            return chars.slice(0, count);
          })()}
          {frame >= 126 && frame < 126 + 4 * "CLAUDE.md".length && (
            <span style={{ color: "rgba(34,197,94,0.4)", fontSize: 44 }}>▊</span>
          )}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 400, color: "rgba(34,197,94,0.2)", marginTop: 12, letterSpacing: 3 }}>
          CLAUDE.md
        </div>
      </div>

      {/* 第 5 句：它到底改变了什么？ */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "35%",
          textAlign: "center",
          opacity: s5Opacity,
        }}
      >
        <div style={{ fontFamily: DISPLAY, fontSize: 44, fontWeight: 400, color: "rgba(248,250,252,0.7)", letterSpacing: 1 }}>
          它到底改变了什么？
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 36, fontWeight: 400, color: "rgba(148,163,184,0.5)", marginTop: 16, letterSpacing: 1 }}>
          又应该怎么写？
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TRIGGER_FRAME_VARIANT_A_FRAMES = END;
