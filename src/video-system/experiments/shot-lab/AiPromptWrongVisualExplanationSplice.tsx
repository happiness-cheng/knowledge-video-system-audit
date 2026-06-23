import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from "remotion";
import {
  PromptCompletionExplainerWhite,
  TOTAL_FRAMES as VISUAL_EXPLAINER_FRAMES,
} from "./PromptCompletionExplainerWhite";

/**
 * AiPromptWrongVisualExplanationSplice — 实验版整段拼接预览
 *
 * 结构：
 * 1. S01 Hook (90帧/3s)
 * 2. PromptCompletionExplainerWhite (630帧/21s)
 * 3. 结论钉子 (150帧/5s)
 * 4. 迁移场景 (150帧/5s)
 * 5. 模板 (150帧/5s)
 * 6. CTA (180帧/6s)
 *
 * 总时长: 1350帧/45s
 */

// ── 时间轴 ──────────────────────────────────────────────
const S01_HOOK_FRAMES = 90; // 3s
const S02_VISUAL_FRAMES = VISUAL_EXPLAINER_FRAMES; // 21s
const S03_CONCLUSION_FRAMES = 150; // 5s
const S04_TRANSFER_FRAMES = 150; // 5s
const S05_TEMPLATE_FRAMES = 150; // 5s
const S06_CTA_FRAMES = 180; // 6s

export const TOTAL_FRAMES =
  S01_HOOK_FRAMES +
  S02_VISUAL_FRAMES +
  S03_CONCLUSION_FRAMES +
  S04_TRANSFER_FRAMES +
  S05_TEMPLATE_FRAMES +
  S06_CTA_FRAMES;

// ── 白底主题色彩 ────────────────────────────────────────
const COLORS = {
  bg: "#FFFFFF",
  bgAlt: "#F9FAFB",
  text: "#111318",
  textSecondary: "#475467",
  textMuted: "#98A2B3",
  accent: "#7B61FF",
  accentLight: "#F4EFFF",
  border: "#EAECF3",
};

// ── S01 Hook ────────────────────────────────────────────
const S01Hook: React.FC<{ frame: number }> = ({ frame }) => {
  const appear = spring({ frame, fps: 30, config: { damping: 15 } });
  const subtitleAppear = spring({
    frame: Math.max(0, frame - 20),
    fps: 30,
    config: { damping: 15 },
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: COLORS.bg,
      }}
    >
      {/* 顶部渐变线 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background:
            "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7, #ec4899, #f43f5e, #f97316, #eab308, #22c55e, #06b6d4, #6366f1)",
        }}
      />

      <div
        style={{
          fontSize: 52,
          color: COLORS.text,
          fontFamily: "'Inter','Noto Sans SC',sans-serif",
          fontWeight: 800,
          opacity: appear,
          transform: `scale(${0.85 + appear * 0.15})`,
          textAlign: "center",
        }}
      >
        我一开始以为
      </div>
      <div
        style={{
          marginTop: 16,
          fontSize: 36,
          color: COLORS.textSecondary,
          fontFamily: "'Inter','Noto Sans SC',sans-serif",
          fontWeight: 400,
          opacity: subtitleAppear,
        }}
      >
        是 AI 不够聪明
      </div>
    </AbsoluteFill>
  );
};

// ── S03 结论钉子 ────────────────────────────────────────
const S03Conclusion: React.FC<{ frame: number }> = ({ frame }) => {
  const appear = spring({ frame, fps: 30, config: { damping: 15 } });
  const subtitleAppear = spring({
    frame: Math.max(0, frame - 20),
    fps: 30,
    config: { damping: 15 },
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: COLORS.bg,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background:
            "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7, #ec4899, #f43f5e, #f97316, #eab308, #22c55e, #06b6d4, #6366f1)",
        }}
      />

      <div
        style={{
          fontSize: 48,
          color: COLORS.text,
          fontFamily: "'Inter','Noto Sans SC',sans-serif",
          fontWeight: 800,
          opacity: appear,
          transform: `scale(${0.85 + appear * 0.15})`,
          textAlign: "center",
          whiteSpace: "pre-line",
        }}
      >
        {"AI 没变\n变的是你给的信息"}
      </div>
      <div
        style={{
          marginTop: 24,
          fontSize: 28,
          color: COLORS.textSecondary,
          fontFamily: "'Inter','Noto Sans SC',sans-serif",
          fontWeight: 400,
          opacity: subtitleAppear,
        }}
      >
        不是模型突然变聪明
      </div>
    </AbsoluteFill>
  );
};

// ── S04 迁移场景 ────────────────────────────────────────
const S04Transfer: React.FC<{ frame: number }> = ({ frame }) => {
  const titleAppear = spring({ frame, fps: 30, config: { damping: 15 } });

  const columns = [
    { title: "写文章", text: "它需要知道读者是谁，以及你想要什么语气。" },
    { title: "学新概念", text: "它需要知道你的基础，以及你卡在哪一步。" },
    { title: "共同规律", text: "你给得越具体，它越接近你的目标。" },
  ];

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: COLORS.bg,
        padding: "0 120px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background:
            "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7, #ec4899, #f43f5e, #f97316, #eab308, #22c55e, #06b6d4, #6366f1)",
        }}
      />

      <div
        style={{
          fontSize: 36,
          color: COLORS.text,
          fontFamily: "'Inter','Noto Sans SC',sans-serif",
          fontWeight: 800,
          marginBottom: 48,
          opacity: titleAppear,
        }}
      >
        换场景也一样
      </div>

      <div
        style={{
          display: "flex",
          gap: 32,
          width: "100%",
        }}
      >
        {columns.map((col, i) => {
          const colAppear = spring({
            frame: Math.max(0, frame - 15 - i * 15),
            fps: 30,
            config: { damping: 15 },
          });

          return (
            <div
              key={col.title}
              style={{
                flex: 1,
                padding: "32px 28px",
                background: i === 2 ? COLORS.accentLight : COLORS.bgAlt,
                border: `1px solid ${i === 2 ? COLORS.accent + "40" : COLORS.border}`,
                borderRadius: 24,
                opacity: colAppear,
                transform: `translateY(${(1 - colAppear) * 20}px)`,
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  color: i === 2 ? COLORS.accent : COLORS.text,
                  fontFamily: "'Inter','Noto Sans SC',sans-serif",
                  fontWeight: 700,
                  marginBottom: 16,
                }}
              >
                {col.title}
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: COLORS.textSecondary,
                  fontFamily: "'Inter','Noto Sans SC',sans-serif",
                  lineHeight: 1.6,
                }}
              >
                {col.text}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── S05 模板 ────────────────────────────────────────────
const S05Template: React.FC<{ frame: number }> = ({ frame }) => {
  const titleAppear = spring({ frame, fps: 30, config: { damping: 15 } });

  const items = [
    "我现在的情况是：____",
    "我想得到的结果是：____",
    "我的限制条件是：____",
    "给 2-3 个方案，并说取舍",
  ];

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: COLORS.bg,
        padding: "0 200px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background:
            "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7, #ec4899, #f43f5e, #f97316, #eab308, #22c55e, #06b6d4, #6366f1)",
        }}
      />

      <div
        style={{
          fontSize: 36,
          color: COLORS.text,
          fontFamily: "'Inter','Noto Sans SC',sans-serif",
          fontWeight: 800,
          marginBottom: 48,
          opacity: titleAppear,
        }}
      >
        下次这样问
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 800,
        }}
      >
        {items.map((item, i) => {
          const itemAppear = spring({
            frame: Math.max(0, frame - 20 - i * 15),
            fps: 30,
            config: { damping: 15 },
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "20px 28px",
                marginBottom: i < 3 ? 16 : 0,
                background: COLORS.accentLight,
                borderRadius: 16,
                borderLeft: `3px solid ${COLORS.accent}80`,
                opacity: itemAppear,
                transform: `translateX(${(1 - itemAppear) * 30}px)`,
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  color: COLORS.accent,
                  fontFamily: "'Inter','Noto Sans SC',sans-serif",
                  fontWeight: 700,
                  minWidth: 32,
                }}
              >
                {i + 1}.
              </span>
              <span
                style={{
                  fontSize: 24,
                  color: COLORS.text,
                  fontFamily: "'Inter','Noto Sans SC',sans-serif",
                  fontWeight: 600,
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── S06 CTA ─────────────────────────────────────────────
const S06CTA: React.FC<{ frame: number }> = ({ frame }) => {
  const appear = spring({ frame, fps: 30, config: { damping: 15 } });
  const subtitleAppear = spring({
    frame: Math.max(0, frame - 20),
    fps: 30,
    config: { damping: 15 },
  });
  const actionAppear = spring({
    frame: Math.max(0, frame - 40),
    fps: 30,
    config: { damping: 15 },
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: COLORS.bg,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background:
            "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7, #ec4899, #f43f5e, #f97316, #eab308, #22c55e, #06b6d4, #6366f1)",
        }}
      />

      <div
        style={{
          fontSize: 44,
          color: COLORS.text,
          fontFamily: "'Inter','Noto Sans SC',sans-serif",
          fontWeight: 800,
          opacity: appear,
          transform: `scale(${0.85 + appear * 0.15})`,
          textAlign: "center",
        }}
      >
        让 AI 理解你之后
      </div>
      <div
        style={{
          marginTop: 16,
          fontSize: 28,
          color: COLORS.textSecondary,
          fontFamily: "'Inter','Noto Sans SC',sans-serif",
          fontWeight: 400,
          opacity: subtitleAppear,
        }}
      >
        下一步，是让它按规则执行
      </div>
      <div
        style={{
          marginTop: 40,
          padding: "16px 40px",
          background: COLORS.accent,
          borderRadius: 999,
          fontSize: 24,
          color: "#FFFFFF",
          fontFamily: "'Inter','Noto Sans SC',sans-serif",
          fontWeight: 600,
          opacity: actionAppear,
          transform: `scale(${0.85 + actionAppear * 0.15})`,
        }}
      >
        下一篇：规则执行
      </div>
    </AbsoluteFill>
  );
};

// ── 主 Composition ──────────────────────────────────────
export const AiPromptWrongVisualExplanationSplice: React.FC = () => {
  const frame = useCurrentFrame();

  // 阶段判断
  const s01End = S01_HOOK_FRAMES;
  const s02End = s01End + S02_VISUAL_FRAMES;
  const s03End = s02End + S03_CONCLUSION_FRAMES;
  const s04End = s03End + S04_TRANSFER_FRAMES;
  const s05End = s04End + S05_TEMPLATE_FRAMES;

  const isS01 = frame < s01End;
  const isS02 = frame >= s01End && frame < s02End;
  const isS03 = frame >= s02End && frame < s03End;
  const isS04 = frame >= s03End && frame < s04End;
  const isS05 = frame >= s04End && frame < s05End;
  const isS06 = frame >= s05End;

  const s01Frame = frame;
  const s02Frame = Math.max(0, frame - s01End);
  const s03Frame = Math.max(0, frame - s02End);
  const s04Frame = Math.max(0, frame - s03End);
  const s05Frame = Math.max(0, frame - s04End);
  const s06Frame = Math.max(0, frame - s05End);

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {isS01 && <S01Hook frame={s01Frame} />}
      {isS02 && <PromptCompletionExplainerWhite />}
      {isS03 && <S03Conclusion frame={s03Frame} />}
      {isS04 && <S04Transfer frame={s04Frame} />}
      {isS05 && <S05Template frame={s05Frame} />}
      {isS06 && <S06CTA frame={s06Frame} />}
    </AbsoluteFill>
  );
};
