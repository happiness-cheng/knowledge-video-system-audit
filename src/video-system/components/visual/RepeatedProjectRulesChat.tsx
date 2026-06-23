import React from "react";
import { Easing, interpolate } from "remotion";
import type { VideoTheme } from "../../themes/types";
import { SafeTitleText } from "../SafeTitleText";

const clamp = (value: number) => Math.max(0, Math.min(1, value));

const progress = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const typeText = (text: string, amount: number) =>
  text.slice(0, Math.max(0, Math.floor(text.length * clamp(amount))));

const Bubble: React.FC<{
  role: "user" | "assistant";
  children: React.ReactNode;
  opacity: number;
  y?: number;
  theme: VideoTheme;
  width?: number;
}> = ({ role, children, opacity, y = 0, theme, width = 620 }) => {
  const isUser = role === "user";
  return (
    <div
      style={{
        width,
        alignSelf: isUser ? "flex-end" : "flex-start",
        padding: "20px 24px",
        borderRadius: isUser ? "24px 24px 8px 24px" : "24px 24px 24px 8px",
        background: isUser ? theme.accentGradient : theme.cardBackground,
        border: isUser ? "none" : `2px solid ${theme.cardBorder}`,
        boxShadow: isUser
          ? "0 18px 42px rgba(99, 102, 241, 0.18)"
          : "0 18px 40px rgba(15, 23, 42, 0.08)",
        color: isUser ? "#ffffff" : theme.primaryText,
        fontSize: 33,
        lineHeight: 1.22,
        fontWeight: 750,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      {children}
    </div>
  );
};

const RuleLine: React.FC<{
  text: string;
  active: boolean;
  opacity: number;
  theme: VideoTheme;
}> = ({ text, active, opacity, theme }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "15px 18px",
      borderRadius: 18,
      background: active ? `${theme.accentColor}16` : "rgba(15, 23, 42, 0.035)",
      border: `2px solid ${active ? `${theme.accentColor}66` : theme.cardBorder}`,
      color: theme.primaryText,
      fontSize: 27,
      fontWeight: 760,
      opacity,
      transform: `scale(${active ? 1.02 : 1})`,
    }}
  >
    <span
      style={{
        width: 13,
        height: 13,
        borderRadius: 999,
        background: active ? theme.accentColor : "rgba(15, 23, 42, 0.22)",
        boxShadow: active ? `0 0 0 7px ${theme.accentColor}18` : "none",
        flex: "0 0 auto",
      }}
    />
    <span>{text}</span>
  </div>
);

export const RepeatedProjectRulesChat: React.FC<{
  frame: number;
  theme: VideoTheme;
  title: string;
  subtitle?: string;
}> = ({ frame, theme, title, subtitle }) => {
  const firstAsk = 1;
  const ruleOne = progress(frame, 18, 34);
  const ruleTwo = progress(frame, 34, 50);
  const ruleThree = progress(frame, 50, 66);
  const newChat = progress(frame, 80, 94);
  const wipe = progress(frame, 92, 112);
  const repeatStart = progress(frame, 116, 146);
  const secondAsk = progress(frame, 134, 160);
  const conclusion = progress(frame, 150, 188);
  const oldChatOpacity = interpolate(wipe, [0, 1], [1, 0]);
  const flash = progress(frame, 84, 96) * (1 - progress(frame, 96, 112));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: theme.background,
        fontFamily: theme.fontFamily,
        color: theme.primaryText,
      }}
    >
      {theme.toplineGradient && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: theme.toplineGradient,
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          inset: "7% 6%",
          borderRadius: 38,
          border: `1px solid ${theme.cardBorder}`,
          opacity: 0.42,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 88,
          top: 102,
          width: 650,
          zIndex: 12,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "9px 16px",
            borderRadius: 999,
            background: `${theme.accentColor}14`,
            color: theme.accentColor,
            border: `1px solid ${theme.accentColor}44`,
            fontSize: 24,
            fontWeight: 850,
            marginBottom: 18,
          }}
        >
          新会话痛点
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 92,
            lineHeight: 1.06,
            fontWeight: theme.titleStyle.fontWeight,
            letterSpacing: 0,
            background: theme.accentGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textShadow: "0 18px 42px rgba(15, 23, 42, 0.10)",
          }}
        >
          <SafeTitleText text={title} maxCharsPerLine={9} gradient={theme.accentGradient} />
        </h1>
        {subtitle && (
          <p
            style={{
              margin: "18px 0 0",
              maxWidth: 590,
              color: theme.secondaryText,
              fontSize: 34,
              lineHeight: 1.28,
              fontWeight: 700,
              opacity: 0.92,
            }}
          >
            <SafeTitleText text={subtitle} maxCharsPerLine={15} />
          </p>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          right: 102,
          top: 92,
          width: 1000,
          height: 808,
          borderRadius: 34,
          background: "rgba(255, 255, 255, 0.92)",
          border: `2px solid ${theme.cardBorder}`,
          boxShadow: "0 34px 90px rgba(15, 23, 42, 0.13)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            background: "rgba(248, 250, 252, 0.96)",
            borderBottom: `2px solid ${theme.cardBorder}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                width: 13,
                height: 13,
                borderRadius: 999,
                background: "#ef4444",
              }}
            />
            <span
              style={{
                width: 13,
                height: 13,
                borderRadius: 999,
                background: "#f59e0b",
              }}
            />
            <span
              style={{
                width: 13,
                height: 13,
                borderRadius: 999,
                background: "#22c55e",
              }}
            />
            <span
              style={{
                marginLeft: 14,
                fontSize: 25,
                fontWeight: 850,
                color: theme.primaryText,
              }}
            >
              Claude Code
            </span>
          </div>
          <div
            style={{
              padding: "10px 16px",
              borderRadius: 16,
              background: newChat > 0
                ? "rgba(239, 68, 68, 0.12)"
                : "rgba(15, 23, 42, 0.045)",
              color: newChat > 0 ? "#dc2626" : theme.secondaryText,
              border: `2px solid ${
                newChat > 0 ? "rgba(239, 68, 68, 0.42)" : theme.cardBorder
              }`,
              fontSize: 22,
              fontWeight: 900,
              transform: `scale(${1 + progress(frame, 80, 88) * 0.07})`,
            }}
          >
            NEW CHAT
          </div>
        </div>

        <div
          style={{
            position: "relative",
            height: 736,
            padding: "38px 42px",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.92))",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#ffffff",
              opacity: flash * 0.78,
              zIndex: 20,
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              opacity: oldChatOpacity,
              filter: wipe > 0.5 ? "grayscale(0.55)" : "none",
            }}
          >
            <Bubble role="user" opacity={1} theme={theme}>
              帮我改登录逻辑
            </Bubble>
            <Bubble
              role="assistant"
              opacity={firstAsk}
              y={interpolate(firstAsk, [0, 1], [20, 0])}
              theme={theme}
              width={720}
            >
              这个项目是做什么的？哪个目录能改？改完怎么验证？
            </Bubble>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 12,
                width: 660,
                alignSelf: "flex-end",
                marginTop: 4,
              }}
            >
              <RuleLine text="这个目录不能动" active={ruleOne > 0.8} opacity={ruleOne} theme={theme} />
              <RuleLine text="优先复用现有实现" active={ruleTwo > 0.8} opacity={ruleTwo} theme={theme} />
              <RuleLine text="改完必须运行测试" active={ruleThree > 0.8} opacity={ruleThree} theme={theme} />
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 42,
              right: 42,
              top: 122,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              opacity: repeatStart,
              transform: `translateY(${interpolate(repeatStart, [0, 1], [30, 0])}px)`,
            }}
          >
            <Bubble role="user" opacity={1} theme={theme}>
              {typeText("帮我加导出功能", repeatStart)}
              <span
                style={{
                  display: "inline-block",
                  width: 14,
                  height: 34,
                  marginLeft: 4,
                  transform: "translateY(6px)",
                  background: "rgba(255,255,255,0.86)",
                  opacity: frame % 18 < 9 ? 1 : 0.18,
                }}
              />
            </Bubble>
            <Bubble
              role="assistant"
              opacity={secondAsk}
              y={interpolate(secondAsk, [0, 1], [18, 0])}
              theme={theme}
              width={760}
            >
              项目结构是怎样的？哪个目录能改？改完怎么测？
            </Bubble>
            <div
              style={{
                alignSelf: "flex-start",
                padding: "18px 22px",
                borderRadius: 22,
                background: "rgba(239, 68, 68, 0.10)",
                border: "2px solid rgba(239, 68, 68, 0.34)",
                color: "#b91c1c",
                fontSize: 30,
                lineHeight: 1.25,
                fontWeight: 850,
                opacity: conclusion,
              }}
            >
              不是你没说过，是它没有稳定入口
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 95,
          bottom: 92,
          width: 650,
          padding: "22px 26px",
          borderRadius: 24,
          background: `${theme.accentColor}10`,
          border: `2px solid ${theme.accentColor}36`,
          color: theme.primaryText,
          fontSize: 30,
          lineHeight: 1.28,
          fontWeight: 780,
          opacity: conclusion,
          transform: `translateY(${interpolate(conclusion, [0, 1], [20, 0])}px)`,
        }}
      >
        你以为它忘了。其实这些规则从没真正留在项目里。
      </div>
    </div>
  );
};
