import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const FONT = "'Inter','Noto Sans SC','Microsoft YaHei',sans-serif";
const MONO = "'JetBrains Mono','SFMono-Regular','Consolas',monospace";

const FADE = { in: 10, hold: 30, out: 10 };
const SEGMENT = FADE.in + FADE.hold + FADE.out;

const segments = [
  { text: "同一个 Claude Code", size: 52 },
  { text: "别人越用越省心\n你却越用越累", size: 44 },
  { text: "差距真的是\n模型吗？", size: 48 },
  { text: "CLAUDE.md", size: 56 },
  { text: "它到底改变了什么？\n又应该怎么写？", size: 44 },
];

function useSegmentOpacity(frame: number, segIdx: number) {
  const segStart = segIdx * SEGMENT;
  const local = frame - segStart;
  if (local < 0) return 0;
  if (local < FADE.in) return interpolate(local, [0, FADE.in], [0, 1], { extrapolateRight: "clamp" });
  if (local < FADE.in + FADE.hold) return 1;
  if (local < SEGMENT) return interpolate(local, [SEGMENT - FADE.out, SEGMENT], [1, 0], { extrapolateLeft: "clamp" });
  return 0;
}

export const TriggerFrame_CognitiveDissonance: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0c", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 0,
          bottom: 0,
          width: 1,
          background: "linear-gradient(180deg, transparent 10%, rgba(148,163,184,0.12) 10%, rgba(148,163,184,0.12) 90%, transparent 90%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 140,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: "linear-gradient(135deg, rgba(210,140,255,0.2), rgba(120,100,255,0.15))",
            border: "1px solid rgba(210,140,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: MONO,
            fontSize: 18,
            fontWeight: 900,
            color: "rgba(210,140,255,0.7)",
          }}
        >
          C
        </div>

        <span
          style={{
            fontFamily: MONO,
            fontSize: 14,
            fontWeight: 600,
            color: "rgba(148,163,184,0.3)",
            letterSpacing: 2,
          }}
        >
          CLAUDE
        </span>
      </div>

      {segments.map((seg, i) => {
        const opacity = useSegmentOpacity(frame, i);
        const segStart = i * SEGMENT;
        const local = frame - segStart;
        const segActive = local >= 0 && local < SEGMENT;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 260,
              top: "50%",
              transform: "translateY(-50%)",
              opacity,
              pointerEvents: "none",
              width: 700,
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: seg.size,
                fontWeight: 700,
                lineHeight: 1.35,
                color: segActive ? "rgba(248,250,252,0.92)" : "rgba(248,250,252,0.92)",
                whiteSpace: "pre-wrap",
              }}
            >
              {i === 2 ? (
                <>
                  差距真的是{" "}
                  <span style={{ position: "relative" }}>
                    <span>模型吗？</span>
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: "50%",
                        height: 3,
                        background: "#ef4444",
                        transform: `scaleX(${interpolate(
                          Math.max(0, frame - (2 * SEGMENT + FADE.in + 10)),
                          [0, 15],
                          [0, 1],
                          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                        )})`,
                        transformOrigin: "left center",
                      }}
                    />
                  </span>
                </>
              ) : (
                seg.text
              )}
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 260,
          bottom: 120,
          display: "flex",
          alignItems: "center",
          gap: 8,
          opacity: interpolate(
            frame,
            [4 * SEGMENT, 4 * SEGMENT + 15],
            [0, 0.6],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          ),
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "2px solid rgba(210,140,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "rgba(210,140,255,0.5)",
            }}
          />
        </div>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 13,
            fontWeight: 700,
            color: "rgba(148,163,184,0.3)",
            letterSpacing: 0.5,
          }}
        >
          3 min
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const TRIGGER_FRAME_COGNITIVE_DISSONANCE_FRAMES = segments.length * SEGMENT;
