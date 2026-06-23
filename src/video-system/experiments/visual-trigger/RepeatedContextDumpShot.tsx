import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
} from "remotion";
import {
  AI_QUESTIONS,
  CONTEXT_CARDS,
  REPEATED_CONTEXT_DUMP_FPS,
  REPEATED_CONTEXT_DUMP_FRAMES,
  REPEATED_CONTEXT_TIMELINE,
} from "./repeatedContextDump.constants";

const FONT = "'Inter','Noto Sans SC','Microsoft YaHei',sans-serif";
const MONO = "'JetBrains Mono','SFMono-Regular','Consolas',monospace";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const progressBetween = (
  frame: number,
  input: [number, number],
  easing?: (input: number) => number,
) =>
  interpolate(frame, input, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

const Background: React.FC<{ frame: number; pressure: number }> = ({
  frame,
  pressure,
}) => {
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 48% 42%, rgba(30,64,175,0.28) 0%, rgba(15,23,42,0.92) 42%, #020617 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,${pressure * 0.42}) 72%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const ChatBubble: React.FC<{
  role: "user" | "ai";
  text: string;
  top: number;
  frame: number;
  delay: number;
  compressed: number;
}> = ({ role, text, top, frame, delay, compressed }) => {
  const localFrame = Math.max(0, frame - delay);
  const appear =
    delay <= 0
      ? 1
      : spring({
          frame: localFrame,
          fps: REPEATED_CONTEXT_DUMP_FPS,
          config: { damping: 16, stiffness: 150, mass: 0.7 },
        });
  const isUser = role === "user";
  const targetTop = top - compressed * 28;
  const chatWidth = 1060 - compressed * 76;
  const bubbleWidth = isUser ? 460 : 600;
  const x = isUser ? chatWidth - bubbleWidth - 32 : 236;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: targetTop,
        width: bubbleWidth,
        opacity: appear,
        transform: `translateY(${(1 - appear) * 20}px)`,
      }}
    >
      {!isUser && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "linear-gradient(135deg, #34d399, #059669)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 900,
              color: "#fff",
              fontFamily: MONO,
            }}
          >
            C
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 15,
              fontWeight: 700,
              color: "rgba(148,163,184,0.7)",
            }}
          >
            Claude
          </div>
        </div>
      )}
      <div
        style={{
          padding: "18px 24px",
          borderRadius: 16,
          background: isUser
            ? "rgba(37,99,235,0.85)"
            : "rgba(30,30,30,0.95)",
          border: isUser ? "none" : "1px solid rgba(148,163,184,0.1)",
          borderBottomRightRadius: isUser ? 6 : 16,
          borderBottomLeftRadius: isUser ? 16 : 6,
          fontFamily: FONT,
          fontSize: isUser ? 44 : 38,
          fontWeight: 800,
          color: "rgba(248,250,252,0.96)",
          lineHeight: 1.2,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const ChatWindow: React.FC<{ frame: number; pressure: number }> = ({
  frame,
  pressure,
}) => {
  const squeeze = progressBetween(frame, [66, 100], Easing.out(Easing.cubic));

  const files = [
    { name: "login.ts", active: true },
    { name: "routes/", active: false },
    { name: "auth.service.ts", active: false },
    { name: "tests/", active: false },
    { name: ".env", active: false },
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: 430,
        top: 104 + squeeze * 22,
        width: 1060 - squeeze * 76,
        height: 822 - squeeze * 108,
        borderRadius: 30,
        background: "rgba(2,6,23,0.92)",
        border: `2px solid rgba(148,163,184,${0.2 + pressure * 0.1})`,
        boxShadow: "0 36px 130px rgba(0,0,0,0.4)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          padding: "0 28px",
          borderBottom: "1px solid rgba(148,163,184,0.12)",
          background: "rgba(15,23,42,0.9)",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 18,
            fontWeight: 900,
            color: "rgba(226,232,240,0.88)",
            letterSpacing: 0.5,
          }}
        >
          Chat
        </div>
        <div
          style={{
            marginLeft: "auto",
            fontFamily: MONO,
            fontSize: 15,
            fontWeight: 800,
            padding: "6px 14px",
            borderRadius: 8,
            background: "rgba(251,113,133,0.1)",
            color: "rgba(251,113,133,0.85)",
          }}
        >
          ASKING CONTEXT
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 64,
          bottom: 0,
          width: 196,
          borderRight: "1px solid rgba(148,163,184,0.1)",
          background: "rgba(15,23,42,0.6)",
          padding: "20px 16px",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 13,
            fontWeight: 900,
            color: "rgba(148,163,184,0.6)",
            letterSpacing: 0.8,
            marginBottom: 16,
            textTransform: "uppercase",
          }}
        >
          Explorer
        </div>
        {files.map((item) => (
          <div
            key={item.name}
            style={{
              height: 36,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 10px",
              marginBottom: 4,
              borderRadius: 8,
              background: item.active
                ? "rgba(34,211,238,0.1)"
                : "transparent",
              fontFamily: MONO,
              fontSize: 16,
              fontWeight: item.active ? 800 : 600,
              color:
                item.name === ".env"
                  ? "rgba(251,113,133,0.8)"
                  : item.active
                    ? "rgba(226,232,240,0.9)"
                    : "rgba(148,163,184,0.55)",
            }}
          >
            <span style={{ fontSize: 11, opacity: 0.45 }}>
              {item.name.includes("/") ? "\u25BE" : "\u25B8"}
            </span>
            {item.name}
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 20,
            padding: "12px 14px",
            borderRadius: 12,
            background: `rgba(251,113,133,${0.08 + Math.sin(frame * 0.12) * 0.04 + 0.04})`,
            border: `1px solid rgba(251,113,133,${0.18 + Math.sin(frame * 0.12) * 0.06})`,
            boxShadow: `0 0 40px rgba(251,113,133,${0.04 + Math.sin(frame * 0.12) * 0.03})`,
            fontFamily: FONT,
            fontSize: 17,
            fontWeight: 800,
            color: "rgba(254,205,211,0.82)",
            lineHeight: 1.25,
          }}
        >
          记忆缺失
          <br />
          需要重讲
        </div>
      </div>

      <ChatBubble
        role="user"
        text="帮我改登录逻辑"
        top={104}
        frame={frame}
        delay={0}
        compressed={squeeze}
      />
      {AI_QUESTIONS.map((question, index) => (
        <ChatBubble
          key={question.id}
          role="ai"
          text={question.text}
          top={246 + index * 136}
          frame={frame}
          delay={index * 8}
          compressed={squeeze}
        />
      ))}

      <div
        style={{
          position: "absolute",
          left: 236,
          right: 32,
          bottom: 16,
          height: 56,
          borderRadius: 16,
          background: "rgba(15,23,42,0.9)",
          border: "1px solid rgba(148,163,184,0.12)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontSize: 20,
            fontWeight: 800,
            color: "rgba(148,163,184,0.45)",
          }}
        >
          继续解释项目背景、目录职责、验证方式...
        </span>
        <div
          style={{
            marginLeft: "auto",
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "rgba(37,99,235,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontFamily: FONT,
            fontSize: 22,
            fontWeight: 900,
          }}
        >
          ↵
        </div>
      </div>
    </div>
  );
};

const ContextCard: React.FC<{
  card: (typeof CONTEXT_CARDS)[number];
  frame: number;
  index: number;
}> = ({ card, frame, index }) => {
  const delay = 36 + index * 7;
  const slideDuration = 20;
  const slideIn = progressBetween(
    frame,
    [delay, delay + slideDuration],
    Easing.out(Easing.cubic),
  );
  const scaleIn = progressBetween(frame, [delay, delay + 14], Easing.out(Easing.cubic));
  const shiftIn = progressBetween(frame, [66, 100], Easing.out(Easing.cubic));

  const targetX = 1350 - shiftIn * 120;
  const targetY = 170 + index * 150 - shiftIn * 8;
  const startX = 1920;

  const x = startX + (targetX - startX) * slideIn;
  const y = targetY;
  const opacity = slideIn;
  const rotation = (index - 2) * 1.2 * (1 - slideIn) * (1 - shiftIn * 0.3);
  const scale = 0.92 + scaleIn * 0.08 + shiftIn * 0.04;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 360,
        padding: "22px 24px",
        borderRadius: 22,
        background: `linear-gradient(135deg, ${card.color}2E, rgba(15,23,42,0.94))`,
        border: `2px solid ${card.color}${Math.round(80 + slideIn * 76)
          .toString(16)
          .padStart(2, "0")}`,
        boxShadow: `0 24px 70px ${card.color}22`,
        opacity,
        transform: `rotate(${rotation}deg) scale(${scale})`,
        transformOrigin: "center center",
        zIndex: 5 + index,
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 22,
          fontWeight: 900,
          color: card.color,
          marginBottom: 12,
          letterSpacing: 0.8,
        }}
      >
        {card.label}
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 31,
          fontWeight: 800,
          color: "rgba(248,250,252,0.94)",
          lineHeight: 1.22,
          letterSpacing: 0,
        }}
      >
        {card.text}
      </div>
    </div>
  );
};

const FinalQuestion: React.FC<{ frame: number }> = ({ frame }) => {
  const appear = spring({
    frame: Math.max(0, frame - 96),
    fps: REPEATED_CONTEXT_DUMP_FPS,
    config: { damping: 16, stiffness: 140, mass: 0.8 },
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 72,
        display: "flex",
        justifyContent: "center",
        opacity: appear,
        transform: `translateY(${(1 - appear) * 24}px) scale(${0.96 + appear * 0.04})`,
      }}
    >
      <div
        style={{
          padding: "26px 44px",
          borderRadius: 28,
          background: "rgba(15,23,42,0.92)",
          border: "2px solid rgba(251,113,133,0.5)",
          boxShadow: "0 28px 90px rgba(251,113,133,0.2)",
          fontFamily: FONT,
          fontSize: 72,
          fontWeight: 900,
          color: "rgba(248,250,252,0.97)",
          letterSpacing: 0,
        }}
      >
        怎么又要重讲一遍？
      </div>
    </div>
  );
};

export const RepeatedContextDumpShot: React.FC = () => {
  const frame = useCurrentFrame();
  const pressure = progressBetween(frame, [36, 94], Easing.out(Easing.cubic));
  const cameraPush = interpolate(frame, [0, REPEATED_CONTEXT_DUMP_FRAMES], [1, 1.035], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const dim = clamp01(progressBetween(frame, [96, 112]));

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        fontFamily: FONT,
        backgroundColor: "#020617",
      }}
    >
      <Background frame={frame} pressure={pressure} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${cameraPush})`,
          transformOrigin: "50% 46%",
        }}
      >
        <ChatWindow frame={frame} pressure={pressure} />
        {CONTEXT_CARDS.map((card, index) => (
          <ContextCard
            key={card.id}
            card={card}
            frame={frame}
            index={index}
          />
        ))}
      </div>
      <AbsoluteFill
        style={{
          background: `rgba(0,0,0,${dim * 0.24})`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 58,
          top: 46,
          fontFamily: MONO,
          fontSize: 22,
          fontWeight: 900,
          color: "rgba(148,163,184,0.58)",
          letterSpacing: 1,
        }}
      >
        REPEATED CONTEXT DUMP
      </div>
      <div
        style={{
          position: "absolute",
          right: 58,
          top: 46,
          fontFamily: MONO,
          fontSize: 22,
          fontWeight: 900,
          color:
            frame < REPEATED_CONTEXT_TIMELINE.contextCardsEnd
              ? "rgba(34,211,238,0.66)"
              : "rgba(251,113,133,0.82)",
          letterSpacing: 1,
        }}
      >
        {frame < REPEATED_CONTEXT_TIMELINE.contextCardsEnd
          ? "TASK STARTED"
          : "CONTEXT OVERLOAD"}
      </div>
      <FinalQuestion frame={frame} />
    </AbsoluteFill>
  );
};

export const AUDIENCE_VALIDATION_REPEATED_CONTEXT_DUMP_FRAMES =
  REPEATED_CONTEXT_DUMP_FRAMES;
