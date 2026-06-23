import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const SANS = "'Trebuchet MS','Noto Sans SC',sans-serif";
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

export const TriggerFrame_VariantB: React.FC = () => {
  const frame = useCurrentFrame();

  const s1Op = segOpacity(frame, 0);
  const s2Op = segOpacity(frame, 1);
  const s3Op = segOpacity(frame, 2);
  const s4Op = segOpacity(frame, 3);
  const s5Op = segOpacity(frame, 4);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0c0c10", overflow: "hidden" }}>
      {/* 顶部标题条 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 40,
          background: "rgba(148,163,184,0.04)",
          borderBottom: "1px solid rgba(148,163,184,0.06)",
          display: "flex",
          alignItems: "center",
          paddingLeft: 24,
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: "rgba(148,163,184,0.2)", letterSpacing: 1.5 }}>
          CLAUDE.md · 认知差异
        </span>
      </div>

      {/* 第 1 句：居中大标题 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "36%",
          textAlign: "center",
          opacity: s1Op,
        }}
      >
        <div style={{ fontFamily: SANS, fontSize: 50, fontWeight: 800, color: "rgba(248,250,252,0.85)", letterSpacing: -0.5 }}>
          同一个 Claude Code
        </div>
      </div>

      {/* 第 2 句：左右对比面板 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          opacity: s2Op,
          display: "flex",
        }}
      >
        {/* 左：长提示词 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRight: "1px solid rgba(148,163,184,0.06)",
            background: "rgba(148,163,184,0.02)",
            padding: 40,
            gap: 6,
          }}
        >
          <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: "rgba(148,163,184,0.15)", marginBottom: 12, letterSpacing: 2 }}>
            你的方式
          </div>
          <div style={{ fontFamily: MONO, fontSize: 14, color: "rgba(148,163,184,0.25)", textAlign: "left", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
            {"帮我修改登录按钮\n把 border-radius 改成 12px\n注意不要影响其他文件\n还有之前那个 auth 的逻辑\n不要动 routes 里的东西"}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 13, color: "rgba(239,68,68,0.3)", marginTop: 12 }}>
            ✗ 定位模糊 · 多文件风险
          </div>
        </div>
        {/* 右：短指令 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 40,
            gap: 6,
          }}
        >
          <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: "rgba(34,197,94,0.3)", marginBottom: 12, letterSpacing: 2 }}>
            有 CLAUDE.md 的方式
          </div>
          <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 600, color: "rgba(34,197,94,0.7)", textAlign: "left" }}>
            "把登录按钮改成圆角"
          </div>
          <div style={{ fontFamily: MONO, fontSize: 13, color: "rgba(34,197,94,0.3)", marginTop: 12 }}>
            ✓ 精准定位 · 自动避让
          </div>
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
          opacity: s3Op,
        }}
      >
        <div style={{ fontFamily: SANS, fontSize: 40, fontWeight: 600, color: "rgba(248,250,252,0.6)", letterSpacing: -0.3 }}>
          差距真的是
        </div>
        <div style={{ position: "relative", display: "inline-block", marginTop: 12 }}>
          <div style={{ fontFamily: SANS, fontSize: 64, fontWeight: 900, color: "rgba(248,250,252,0.9)", letterSpacing: 2 }}>
            模型吗？
          </div>
          <div
            style={{
              position: "absolute",
              left: -8,
              right: -8,
              top: "50%",
              height: 5,
              backgroundColor: "#ef4444",
              borderRadius: 3,
              transform: `scaleX(${interpolate(frame, [84, 96], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              opacity: interpolate(frame, [84, 96], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          />
        </div>
      </div>

      {/* 第 4 句：CLAUDE.md 文件路径行走 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "38%",
          opacity: s4Op,
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0, fontFamily: MONO, fontSize: 48, fontWeight: 700, color: "rgba(34,197,94,0.85)", letterSpacing: 1 }}>
          {"CLAUDE.md".split("").map((char, i) => {
            const revealAt = 126 + i * 3;
            return (
              <span
                key={i}
                style={{
                  opacity: frame >= revealAt ? 1 : 0,
                  transform: frame >= revealAt ? "translateY(0)" : "translateY(20px)",
                  transition: "none",
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
        <div
          style={{
            textAlign: "center",
            fontFamily: MONO,
            fontSize: 13,
            fontWeight: 400,
            color: "rgba(34,197,94,0.15)",
            marginTop: 16,
            letterSpacing: 4,
          }}
        >
          项目根目录 · 一个文件
        </div>
      </div>

      {/* 第 5 句 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "35%",
          textAlign: "center",
          opacity: s5Op,
        }}
      >
        <div style={{ fontFamily: SANS, fontSize: 40, fontWeight: 700, color: "rgba(248,250,252,0.7)", letterSpacing: -0.3 }}>
          它到底改变了什么？
        </div>
        <div
          style={{
            width: 40,
            height: 2,
            background: "rgba(148,163,184,0.15)",
            margin: "20px auto",
          }}
        />
        <div style={{ fontFamily: SANS, fontSize: 34, fontWeight: 400, color: "rgba(148,163,184,0.45)", letterSpacing: -0.3 }}>
          又应该怎么写？
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TRIGGER_FRAME_VARIANT_B_FRAMES = END;
