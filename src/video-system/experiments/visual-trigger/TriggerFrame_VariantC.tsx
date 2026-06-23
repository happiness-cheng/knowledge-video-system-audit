import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const SERIF = "'Palatino Linotype','Georgia','Noto Serif SC',serif";
const MONO = "'JetBrains Mono','SFMono-Regular','Consolas',monospace";

const CUT = 30;
const BLACK = 12;
const STEP = CUT + BLACK;
const END = 210;

function cutIn(frame: number, i: number) {
  const start = i * STEP;
  const end = start + CUT;
  return frame >= start && frame < end;
}

export const TriggerFrame_VariantC: React.FC = () => {
  const frame = useCurrentFrame();
  const blankAfter = (i: number) => {
    const start = i * STEP + CUT;
    return frame >= start && frame < (i + 1) * STEP;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      {/* 固定左上标签 */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 40,
          opacity: 0.15,
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 3 }}>CLAUDE</span>
      </div>

      {/* 第 1 句 */}
      {cutIn(frame, 0) && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "42%",
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: SERIF, fontSize: 58, fontWeight: 400, color: "rgba(248,250,252,0.85)", letterSpacing: 4 }}>
            同一个 Claude Code
          </div>
        </div>
      )}
      {blankAfter(0) && <div style={{ position: "absolute", inset: 0, backgroundColor: "#000" }} />}

      {/* 第 2 句：上下叠排 */}
      {cutIn(frame, 1) && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "38%",
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: SERIF, fontSize: 42, fontWeight: 400, color: "rgba(245,158,11,0.7)", letterSpacing: 1, marginBottom: 24 }}>
            别人越用越省心
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 42, fontWeight: 400, color: "rgba(148,163,184,0.4)", letterSpacing: 1 }}>
            你却越用越累
          </div>
        </div>
      )}
      {blankAfter(1) && <div style={{ position: "absolute", inset: 0, backgroundColor: "#000" }} />}

      {/* 第 3 句：差距真的是模型吗？ */}
      {cutIn(frame, 2) && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "35%",
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 400, color: "rgba(248,250,252,0.6)", letterSpacing: 1, marginBottom: 8 }}>
            差距真的是
          </div>
          <div style={{ position: "relative", display: "inline-block" }}>
            <div style={{ fontFamily: SERIF, fontSize: 80, fontWeight: 700, color: "rgba(248,250,252,0.95)", letterSpacing: 4 }}>
              模型吗？
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "50%",
                height: 5,
                backgroundColor: "#dc2626",
                transform: `scaleX(${interpolate(frame, [75, 84], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                transformOrigin: "center center",
              }}
            />
          </div>
        </div>
      )}
      {blankAfter(2) && <div style={{ position: "absolute", inset: 0, backgroundColor: "#000" }} />}

      {/* 第 4 句：CLAUDE.md */}
      {cutIn(frame, 3) && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "42%",
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: MONO, fontSize: 56, fontWeight: 700, color: "rgba(34,197,94,0.9)", letterSpacing: 2 }}>
            {(() => {
              const text = "CLAUDE.md";
              const revealStart = 108;
              const speed = 4;
              const count = Math.min(text.length, Math.max(0, Math.floor((frame - revealStart) / speed)));
              return text.slice(0, count);
            })()}
          </div>
        </div>
      )}
      {blankAfter(3) && <div style={{ position: "absolute", inset: 0, backgroundColor: "#000" }} />}

      {/* 第 5 句 */}
      {cutIn(frame, 4) && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "38%",
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: SERIF, fontSize: 42, fontWeight: 400, color: "rgba(248,250,252,0.7)", letterSpacing: 1, marginBottom: 16 }}>
            它到底改变了什么？
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 400, color: "rgba(148,163,184,0.45)", letterSpacing: 1 }}>
            又应该怎么写？
          </div>
        </div>
      )}
      {blankAfter(4) && <div style={{ position: "absolute", inset: 0, backgroundColor: "#000" }} />}

      {/* 进度 */}
      <div
        style={{
          position: "absolute",
          right: 50,
          bottom: 40,
          fontFamily: MONO,
          fontSize: 12,
          fontWeight: 600,
          color: "rgba(148,163,184,0.1)",
          letterSpacing: 1,
        }}
      >
        {["00","01","02","03","04"][Math.min(4, Math.floor(frame / STEP))]}/05
      </div>
    </AbsoluteFill>
  );
};

export const TRIGGER_FRAME_VARIANT_C_FRAMES = END;
