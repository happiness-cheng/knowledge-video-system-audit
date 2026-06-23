import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const MONO = "'JetBrains Mono','SFMono-Regular','Consolas',monospace";

const lines = [
  { text: '$ npx claude "把登录按钮改成圆角"', type: "input" as const, revealFrame: 0 },
  { text: "", type: "blank" as const, revealFrame: 30 },
  { text: "  📋 读取项目规则...  CLAUDE.md → 允许 UI 修改", type: "info" as const, revealFrame: 34 },
  { text: "  📁 定位到 components/auth/LoginButton.tsx", type: "path" as const, revealFrame: 44 },
  { text: "  ✏️  修改 borderRadius: 4 → 12", type: "diff" as const, revealFrame: 54 },
  { text: "  ✓  修改范围：仅 1 个文件 · 未触碰正式数据", type: "success" as const, revealFrame: 64 },
  { text: "", type: "blank" as const, revealFrame: 72 },
  { text: "  🧪 npm run typecheck →", type: "running" as const, revealFrame: 76 },
  { text: "  🧪 npm run test:ui →", type: "running" as const, revealFrame: 86 },
];

const PASS_RESULT = "  PASS";
const PASS_REVEAL_FRAME_TYPECHECK = 84;
const PASS_REVEAL_FRAME_TEST = 94;

function useCursorBlink(frame: number, start: number): number {
  return interpolate(
    Math.abs(((frame - start) % 30) - 15),
    [0, 2, 13, 15],
    [1, 1, 0, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
}

function typeText(full: string, frame: number, start: number, speed: number): string {
  const charCount = Math.max(0, Math.floor((frame - start) / speed));
  return full.slice(0, Math.min(charCount, full.length));
}

export const TriggerFrame_TerminalReplay: React.FC = () => {
  const frame = useCurrentFrame();
  const typed = typeText(lines[0].text, frame, 0, 2);
  const cursor = useCursorBlink(frame, 0);
  const inputDone = typed.length >= lines[0].text.length;

  return (
    <AbsoluteFill style={{ backgroundColor: "#08080c", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 140,
          right: 140,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 6,
        }}
      >
        {/* Line pre-header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
            paddingLeft: 20,
            opacity: interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#22c55e",
              opacity: 0.6,
            }}
          />
          <span
            style={{
              fontFamily: MONO,
              fontSize: 13,
              fontWeight: 700,
              color: "rgba(148,163,184,0.25)",
              letterSpacing: 1.5,
            }}
          >
            CLAUDE CODE · 已接入项目规则
          </span>
        </div>

        <div
          style={{
            background: "rgba(15,15,20,0.6)",
            border: "1px solid rgba(148,163,184,0.06)",
            borderRadius: 12,
            padding: "28px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 5,
            minHeight: 300,
          }}
        >
          {lines.map((line, i) => {
            const revealed = frame >= line.revealFrame;
            const lineOpacity = revealed ? 1 : 0;

            if (line.type === "blank") {
              return <div key={i} style={{ height: 0 }} />;
            }

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  opacity: lineOpacity,
                  transition: "none",
                  fontFamily: MONO,
                  fontSize: 18,
                  fontWeight: 500,
                  height: 30,
                  whiteSpace: "pre",
                }}
              >
                {line.type === "input" ? (
                  <span style={{ color: "rgba(248,250,252,0.75)" }}>
                    {typed}
                    {!inputDone && (
                      <span
                        style={{
                          opacity: cursor,
                          color: "rgba(248,250,252,0.5)",
                        }}
                      >
                        ▊
                      </span>
                    )}
                    {inputDone && (
                      <span
                        style={{ color: "rgba(148,163,184,0.2)", fontSize: 14, marginLeft: 8 }}
                      >
                        ↵
                      </span>
                    )}
                  </span>
                ) : (
                  <>
                    <span
                      style={{
                        color:
                          line.type === "info"
                            ? "rgba(148,163,184,0.5)"
                            : line.type === "path"
                              ? "rgba(96,165,250,0.7)"
                              : line.type === "diff"
                                ? "rgba(251,191,36,0.7)"
                                : line.type === "success"
                                  ? "rgba(34,197,94,0.7)"
                                  : "rgba(148,163,184,0.3)",
                      }}
                    >
                      {line.text}
                    </span>
                    {line.type === "running" && frame >= PASS_REVEAL_FRAME_TYPECHECK && i === 7 && (
                      <span
                        style={{
                          color: "rgba(34,197,94,0.9)",
                          fontWeight: 700,
                        }}
                      >
                        {PASS_RESULT}
                      </span>
                    )}
                    {line.type === "running" && frame >= PASS_REVEAL_FRAME_TEST && i === 8 && (
                      <span
                        style={{
                          color: "rgba(34,197,94,0.9)",
                          fontWeight: 700,
                        }}
                      >
                        {PASS_RESULT}
                      </span>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom question */}
        <div
          style={{
            marginTop: 24,
            paddingLeft: 20,
            opacity: interpolate(
              frame,
              [100, 115],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 28,
              height: 2,
              borderRadius: 1,
              background: "rgba(148,163,184,0.15)",
            }}
          />
          <span
            style={{
              fontFamily: MONO,
              fontSize: 15,
              fontWeight: 600,
              color: "rgba(148,163,184,0.35)",
              letterSpacing: 0.3,
            }}
          >
            它怎么知道该改哪里？
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TRIGGER_FRAME_TERMINAL_REPLAY_FRAMES = 130;
