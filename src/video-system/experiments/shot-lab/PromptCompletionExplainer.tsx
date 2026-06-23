import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from "remotion";

/**
 * PromptCompletionExplainer — Visual Explanation Shot Lab 01 (Confused Path - 微调修正)
 *
 * 修复：
 * 1. 右侧最终结果不再重复出现
 * 2. 模糊关键词随上下文补充逐步消失
 */

// ── 时间轴常量 ──────────────────────────────────────────
const PHASE_1_END = 90;
const PHASE_2_END = 270;
const PHASE_3_END = 390;
const PHASE_4_END = 540;
const PHASE_5_END = 630;
export const TOTAL_FRAMES = PHASE_5_END;

// ── Props 接口 ──────────────────────────────────────────
export interface PromptCompletionExplainerProps {
  vaguePrompt: string;
  contextModules: { label: string; value: string; color: string }[];
  completedPrompt: string;
  structuredAnswerItems: { title: string; icon: string }[];
  finalConclusion: string;
  subtitle: string;
}

const defaultProps: PromptCompletionExplainerProps = {
  vaguePrompt: "帮我写一下",
  contextModules: [
    { label: "身份", value: "我是新手", color: "#6366f1" },
    { label: "目标", value: "想写一篇文章", color: "#8b5cf6" },
    { label: "限制", value: "不要太专业", color: "#a78bfa" },
    { label: "输出", value: "给我三段结构", color: "#c4b5fd" },
  ],
  completedPrompt: "我是新手，想写一篇不要太专业的文章，给我三段结构",
  structuredAnswerItems: [
    { title: "背景解释", icon: "📋" },
    { title: "核心观点", icon: "💡" },
    { title: "生活例子", icon: "🌰" },
    { title: "行动建议", icon: "🎯" },
  ],
  finalConclusion: "AI 没变，材料变完整了",
  subtitle: "提问质量 → 输出质量",
};

// ── 路径配置 ────────────────────────────────────────────
const CONFUSED_PATH_POINTS = {
  start: { x: 50, y: 280 },
  cp1: { x: 150, y: 100 },
  cp2: { x: 250, y: 350 },
  cp3: { x: 350, y: 150 },
  cp4: { x: 450, y: 300 },
  end: { x: 550, y: 200 },
};

const CLEAR_PATH_POINTS = {
  start: { x: 50, y: 280 },
  cp1: { x: 150, y: 240 },
  cp2: { x: 250, y: 220 },
  cp3: { x: 350, y: 210 },
  cp4: { x: 450, y: 205 },
  end: { x: 550, y: 200 },
};

// ── 碎片文字配置 ────────────────────────────────────────
const FRAGMENT_TEXTS = [
  { text: "大概...", x: 180, y: 120, rotation: -15 },
  { text: "可能...", x: 320, y: 300, rotation: 10 },
  { text: "一般来说", x: 420, y: 150, rotation: -8 },
  { text: "某种程度", x: 250, y: 350, rotation: 12 },
];

// ── 子组件：模糊问题框 ──────────────────────────────────
const VagueQuestionBox: React.FC<{
  frame: number;
  vaguePrompt: string;
}> = ({ frame, vaguePrompt }) => {
  const appear = spring({ frame, fps: 30, config: { damping: 15, mass: 0.8 } });
  const shake =
    frame > 60
      ? Math.sin(frame * 0.8) * 2 * Math.max(0, 1 - (frame - 60) / 30)
      : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        top: 200,
        width: 600,
        padding: "40px 48px",
        background: "rgba(255,255,255,0.06)",
        border: "2px dashed rgba(255,255,255,0.2)",
        borderRadius: 20,
        opacity: appear,
        transform: `scale(${0.8 + appear * 0.2}) translateX(${shake}px)`,
      }}
    >
      <div
        style={{
          fontSize: 18,
          color: "rgba(255,255,255,0.4)",
          marginBottom: 12,
          fontFamily: "sans-serif",
          letterSpacing: 2,
        }}
      >
        用户提问
      </div>
      <div
        style={{
          fontSize: 42,
          color: "rgba(255,255,255,0.6)",
          fontFamily: "sans-serif",
          fontWeight: 700,
        }}
      >
        "{vaguePrompt}"
      </div>
      <div
        style={{
          marginTop: 16,
          fontSize: 16,
          color: "rgba(255,255,255,0.25)",
          fontFamily: "sans-serif",
        }}
      >
        缺少上下文，AI 无法理解你真正想要什么
      </div>
    </div>
  );
};

// ── 子组件：乱麻路径（仅路径，不含碎片文字）────────────
const ConfusedPath: React.FC<{
  frame: number;
}> = ({ frame }) => {
  const appear = spring({
    frame: Math.max(0, frame - 15),
    fps: 30,
    config: { damping: 20 },
  });

  const pathProgress = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  const confusedPathD = `M ${CONFUSED_PATH_POINTS.start.x} ${CONFUSED_PATH_POINTS.start.y}
    C ${CONFUSED_PATH_POINTS.cp1.x} ${CONFUSED_PATH_POINTS.cp1.y},
      ${CONFUSED_PATH_POINTS.cp2.x} ${CONFUSED_PATH_POINTS.cp2.y},
      ${CONFUSED_PATH_POINTS.end.x} ${CONFUSED_PATH_POINTS.end.y}`;

  const fork1D = `M 200 180 Q 250 120 300 160`;
  const fork2D = `M 350 250 Q 400 320 450 280`;

  return (
    <div
      style={{
        position: "absolute",
        right: 80,
        top: 100,
        width: 600,
        height: 400,
        opacity: appear,
      }}
    >
      <svg
        width="600"
        height="400"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <path
          d={confusedPathD}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="3"
          strokeDasharray="600"
          strokeDashoffset={600 * (1 - pathProgress)}
          style={{ filter: "blur(1px)" }}
        />
        <path
          d={fork1D}
          fill="none"
          stroke="rgba(255,100,100,0.2)"
          strokeWidth="2"
          strokeDasharray="200"
          strokeDashoffset={200 * (1 - Math.max(0, pathProgress - 0.3))}
          style={{ filter: "blur(0.5px)" }}
        />
        <path
          d={fork2D}
          fill="none"
          stroke="rgba(255,100,100,0.2)"
          strokeWidth="2"
          strokeDasharray="200"
          strokeDashoffset={200 * (1 - Math.max(0, pathProgress - 0.5))}
          style={{ filter: "blur(0.5px)" }}
        />
        {[0.2, 0.4, 0.6, 0.8].map((t, i) => {
          const x = interpolate(t, [0, 1], [50, 550]);
          const y = 280 + Math.sin(t * Math.PI * 3) * 80;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={4}
              fill={`rgba(255,255,255,${0.2 + Math.sin(frame * 0.1 + i) * 0.1})`}
            />
          );
        })}
      </svg>

      {/* 终点：泛泛回答块 */}
      <div
        style={{
          position: "absolute",
          left: 480,
          top: 160,
          width: 120,
          height: 80,
          background: "rgba(255,255,255,0.08)",
          border: "1px dashed rgba(255,255,255,0.2)",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          color: "rgba(255,255,255,0.3)",
          fontFamily: "sans-serif",
          opacity: pathProgress,
          filter: "blur(2px)",
        }}
      >
        泛泛回答
      </div>

      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          fontSize: 14,
          color: "rgba(255,255,255,0.3)",
          fontFamily: "sans-serif",
          letterSpacing: 2,
        }}
      >
        AI 输出 · 方向混乱
      </div>
    </div>
  );
};

// ── 子组件：碎片文字（随上下文逐步消失）────────────────
const FragmentTexts: React.FC<{
  frame: number;
  contextModuleCount: number; // 已飞入的上下文模块数量
}> = ({ frame, contextModuleCount }) => {
  const appear = spring({
    frame: Math.max(0, frame - 30),
    fps: 30,
    config: { damping: 15 },
  });

  return (
    <div
      style={{
        position: "absolute",
        right: 80,
        top: 100,
        width: 600,
        height: 400,
      }}
    >
      {FRAGMENT_TEXTS.map((frag, i) => {
        // 每个碎片文字对应一个上下文模块
        // 当该模块飞入后，碎片文字开始消失
        const disappearProgress = Math.max(0, contextModuleCount - i);

        // 消失动画：减弱 → 漂散 → 消失
        const fadeOut = interpolate(disappearProgress, [0, 1], [1, 0], {
          extrapolateRight: "clamp",
        });
        const drift = disappearProgress * 30; // 漂散距离
        const blur = disappearProgress * 4; // 模糊增加

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: frag.x,
              top: frag.y,
              fontSize: 16,
              color: `rgba(255,255,255,${0.25 * fadeOut})`,
              fontFamily: "sans-serif",
              fontStyle: "italic",
              transform: `rotate(${frag.rotation}deg) translateY(${-drift}px)`,
              opacity: appear * fadeOut * 0.6,
              filter: `blur(${blur}px)`,
              transition: "all 0.3s ease-out",
            }}
          >
            {frag.text}
          </div>
        );
      })}
    </div>
  );
};

// ── 子组件：路径校正动画 ────────────────────────────────
const GuidedPath: React.FC<{
  frame: number;
  correctionProgress: number;
  structuredAnswerItems: { title: string; icon: string }[];
}> = ({ frame, correctionProgress, structuredAnswerItems }) => {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const currentPoints = {
    start: {
      x: lerp(CONFUSED_PATH_POINTS.start.x, CLEAR_PATH_POINTS.start.x, correctionProgress),
      y: lerp(CONFUSED_PATH_POINTS.start.y, CLEAR_PATH_POINTS.start.y, correctionProgress),
    },
    cp1: {
      x: lerp(CONFUSED_PATH_POINTS.cp1.x, CLEAR_PATH_POINTS.cp1.x, correctionProgress),
      y: lerp(CONFUSED_PATH_POINTS.cp1.y, CLEAR_PATH_POINTS.cp1.y, correctionProgress),
    },
    cp2: {
      x: lerp(CONFUSED_PATH_POINTS.cp2.x, CLEAR_PATH_POINTS.cp2.x, correctionProgress),
      y: lerp(CONFUSED_PATH_POINTS.cp2.y, CLEAR_PATH_POINTS.cp2.y, correctionProgress),
    },
    cp3: {
      x: lerp(CONFUSED_PATH_POINTS.cp3.x, CLEAR_PATH_POINTS.cp3.x, correctionProgress),
      y: lerp(CONFUSED_PATH_POINTS.cp3.y, CLEAR_PATH_POINTS.cp3.y, correctionProgress),
    },
    cp4: {
      x: lerp(CONFUSED_PATH_POINTS.cp4.x, CLEAR_PATH_POINTS.cp4.x, correctionProgress),
      y: lerp(CONFUSED_PATH_POINTS.cp4.y, CLEAR_PATH_POINTS.cp4.y, correctionProgress),
    },
    end: {
      x: lerp(CONFUSED_PATH_POINTS.end.x, CLEAR_PATH_POINTS.end.x, correctionProgress),
      y: lerp(CONFUSED_PATH_POINTS.end.y, CLEAR_PATH_POINTS.end.y, correctionProgress),
    },
  };

  const guidedPathD = `M ${currentPoints.start.x} ${currentPoints.start.y}
    C ${currentPoints.cp1.x} ${currentPoints.cp1.y},
      ${currentPoints.cp2.x} ${currentPoints.cp2.y},
      ${currentPoints.end.x} ${currentPoints.end.y}`;

  const forkOpacity = 1 - correctionProgress;

  return (
    <div
      style={{
        position: "absolute",
        right: 80,
        top: 100,
        width: 600,
        height: 400,
      }}
    >
      <svg
        width="600"
        height="400"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <path
          d={guidedPathD}
          fill="none"
          stroke={`rgba(99, 102, 241, ${0.3 + correctionProgress * 0.4})`}
          strokeWidth={3 + correctionProgress * 2}
          strokeLinecap="round"
        />
        {forkOpacity > 0.05 && (
          <>
            <path
              d="M 200 180 Q 250 120 300 160"
              fill="none"
              stroke={`rgba(255,100,100,${0.2 * forkOpacity})`}
              strokeWidth="2"
              style={{ filter: "blur(0.5px)" }}
            />
            <path
              d="M 350 250 Q 400 320 450 280"
              fill="none"
              stroke={`rgba(255,100,100,${0.2 * forkOpacity})`}
              strokeWidth="2"
              style={{ filter: "blur(0.5px)" }}
            />
          </>
        )}
        {[0.2, 0.4, 0.6, 0.8].map((t, i) => {
          const baseX = interpolate(t, [0, 1], [50, 550]);
          const baseY = 280 + Math.sin(t * Math.PI * 3) * 80;
          const targetY = 200 + (280 - 200) * (1 - t);
          const x = baseX;
          const y = lerp(baseY, targetY, correctionProgress);

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={4 + correctionProgress * 2}
              fill={`rgba(99, 102, 241, ${0.3 + correctionProgress * 0.4})`}
            />
          );
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          fontSize: 14,
          color: `rgba(255,255,255,${0.3 + correctionProgress * 0.2})`,
          fontFamily: "sans-serif",
          letterSpacing: 2,
        }}
      >
        AI 输出 · {correctionProgress < 0.5 ? "方向校正中" : "结构形成中"}
      </div>
    </div>
  );
};

// ── 子组件：上下文模块飞入 ──────────────────────────────
const ContextModule: React.FC<{
  frame: number;
  index: number;
  label: string;
  value: string;
  color: string;
}> = ({ frame, index, label, value, color }) => {
  const delay = index * 45;
  const localFrame = Math.max(0, frame - delay);

  const flyIn = spring({
    frame: localFrame,
    fps: 30,
    config: { damping: 12, mass: 0.6, stiffness: 100 },
  });

  const startX = -300 + index * 60;
  const startY = 500 + index * 80;
  const targetX = 80 + index * 10;
  const targetY = 420 + index * 55;

  const x = startX + (targetX - startX) * flyIn;
  const y = startY + (targetY - startY) * flyIn;
  const rotation = (1 - flyIn) * (15 - index * 8);
  const scale = 0.6 + flyIn * 0.4;

  const glow =
    localFrame > 30
      ? spring({ frame: localFrame - 30, fps: 30, config: { damping: 20 } })
      : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "14px 24px",
        background: `linear-gradient(135deg, ${color}22, ${color}11)`,
        border: `2px solid ${color}${Math.round(60 + glow * 40)
          .toString(16)
          .padStart(2, "0")}`,
        borderRadius: 14,
        transform: `rotate(${rotation}deg) scale(${scale})`,
        boxShadow: glow > 0 ? `0 0 ${20 * glow}px ${color}44` : "none",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span
        style={{
          fontSize: 14,
          color: color,
          fontFamily: "sans-serif",
          fontWeight: 700,
          opacity: 0.8,
          minWidth: 40,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 22,
          color: "rgba(255,255,255,0.9)",
          fontFamily: "sans-serif",
          fontWeight: 600,
        }}
      >
        {value}
      </span>
    </div>
  );
};

// ── 子组件：补齐后的问题框 ──────────────────────────────
const CompletedQuestionBox: React.FC<{
  frame: number;
  completedPrompt: string;
}> = ({ frame, completedPrompt }) => {
  const progress = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: "clamp",
  });
  const borderOpacity = interpolate(progress, [0, 1], [0.2, 0.8]);
  const bgColor = `rgba(99, 102, 241, ${0.05 + progress * 0.1})`;

  const flash =
    frame < 30
      ? interpolate(frame, [10, 20, 30], [0, 0.6, 0], {
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        top: 200,
        width: 600,
        padding: "40px 48px",
        background: bgColor,
        border: `2px solid rgba(99, 102, 241, ${borderOpacity})`,
        borderRadius: 20,
        boxShadow: `0 0 ${30 * flash}px rgba(99, 102, 241, ${flash * 0.4})`,
      }}
    >
      <div
        style={{
          fontSize: 18,
          color: "rgba(255,255,255,0.6)",
          marginBottom: 12,
          fontFamily: "sans-serif",
          letterSpacing: 2,
        }}
      >
        完整提问
      </div>
      <div
        style={{
          fontSize: 28,
          color: "rgba(255,255,255,0.95)",
          fontFamily: "sans-serif",
          fontWeight: 700,
          lineHeight: 1.6,
        }}
      >
        "{completedPrompt}"
      </div>
    </div>
  );
};

// ── 子组件：结构化回答（统一渲染）──────────────────────
const StructuredAnswerView: React.FC<{
  structuredAnswerItems: { title: string; icon: string }[];
  opacity?: number;
}> = ({ structuredAnswerItems, opacity = 1 }) => {
  return (
    <div
      style={{
        position: "absolute",
        right: 80,
        top: 100,
        width: 600,
        height: 400,
      }}
    >
      {/* 清晰路径 */}
      <svg
        width="600"
        height="400"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <path
          d={`M ${CLEAR_PATH_POINTS.start.x} ${CLEAR_PATH_POINTS.start.y}
              C ${CLEAR_PATH_POINTS.cp1.x} ${CLEAR_PATH_POINTS.cp1.y},
                ${CLEAR_PATH_POINTS.cp2.x} ${CLEAR_PATH_POINTS.cp2.y},
                ${CLEAR_PATH_POINTS.end.x} ${CLEAR_PATH_POINTS.end.y}`}
          fill="none"
          stroke="rgba(99, 102, 241, 0.6)"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>

      {/* 结构化回答 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 100,
          width: 600,
          padding: "36px 40px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: 20,
          opacity,
        }}
      >
        <div
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.5)",
            marginBottom: 20,
            fontFamily: "sans-serif",
            letterSpacing: 2,
          }}
        >
          AI 输出 · 结构清晰
        </div>
        {structuredAnswerItems.map((section, i) => (
          <div
            key={section.title}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "14px 20px",
              marginBottom: i < 3 ? 10 : 0,
              background: `rgba(99, 102, 241, ${0.06 + i * 0.02})`,
              borderRadius: 12,
              borderLeft: "3px solid rgba(99, 102, 241, 0.5)",
            }}
          >
            <span style={{ fontSize: 24 }}>{section.icon}</span>
            <span
              style={{
                fontSize: 22,
                color: "rgba(255,255,255,0.9)",
                fontFamily: "sans-serif",
                fontWeight: 600,
              }}
            >
              {section.title}
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 14,
                color: "rgba(255,255,255,0.3)",
                fontFamily: "sans-serif",
              }}
            >
              第 {i + 1} 段
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── 子组件：结论从画面自然浮现 ──────────────────────────
const ConclusionOverlay: React.FC<{
  frame: number;
  finalConclusion: string;
  subtitle: string;
}> = ({ frame, finalConclusion, subtitle }) => {
  const overlayAppear = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const textAppear = spring({
    frame: Math.max(0, frame - 15),
    fps: 30,
    config: { damping: 12, mass: 0.8 },
  });

  const subtitleAppear = spring({
    frame: Math.max(0, frame - 35),
    fps: 30,
    config: { damping: 15 },
  });

  const arrowAppear = spring({
    frame: Math.max(0, frame - 50),
    fps: 30,
    config: { damping: 18 },
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `rgba(0,0,0,${overlayAppear * 0.65})`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          marginBottom: 32,
          opacity: arrowAppear,
          transform: `scale(${0.8 + arrowAppear * 0.2})`,
        }}
      >
        <div
          style={{
            padding: "12px 24px",
            background: "rgba(99, 102, 241, 0.15)",
            border: "1px solid rgba(99, 102, 241, 0.4)",
            borderRadius: 12,
            fontSize: 20,
            color: "rgba(255,255,255,0.8)",
            fontFamily: "sans-serif",
            fontWeight: 600,
          }}
        >
          提问质量
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.5)",
            fontFamily: "sans-serif",
          }}
        >
          →
        </div>
        <div
          style={{
            padding: "12px 24px",
            background: "rgba(139, 92, 246, 0.15)",
            border: "1px solid rgba(139, 92, 246, 0.4)",
            borderRadius: 12,
            fontSize: 20,
            color: "rgba(255,255,255,0.8)",
            fontFamily: "sans-serif",
            fontWeight: 600,
          }}
        >
          输出质量
        </div>
      </div>

      <div
        style={{
          fontSize: 44,
          color: "rgba(255,255,255,0.95)",
          fontFamily: "sans-serif",
          fontWeight: 800,
          letterSpacing: 3,
          opacity: textAppear,
          transform: `scale(${0.85 + textAppear * 0.15})`,
          textAlign: "center",
        }}
      >
        {finalConclusion}
      </div>

      <div
        style={{
          marginTop: 20,
          fontSize: 22,
          color: "rgba(255,255,255,0.5)",
          fontFamily: "sans-serif",
          opacity: subtitleAppear,
          letterSpacing: 4,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

// ── 背景 ────────────────────────────────────────────────
const Background: React.FC<{ frame: number }> = ({ frame }) => {
  const drift = frame * 0.3;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `
          radial-gradient(ellipse at 30% 40%, rgba(99,102,241,0.08) 0%, transparent 60%),
          radial-gradient(ellipse at 70% 60%, rgba(139,92,246,0.06) 0%, transparent 60%),
          linear-gradient(180deg, #0a0a14 0%, #0d0d1a 100%)
        `,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          backgroundPosition: `${drift}px ${drift * 0.5}px`,
        }}
      />
    </div>
  );
};

// ── 主 Composition ──────────────────────────────────────
export const PromptCompletionExplainer: React.FC<
  Partial<PromptCompletionExplainerProps>
> = (props) => {
  const frame = useCurrentFrame();
  const config = { ...defaultProps, ...props };

  // 阶段判断
  const isPhase1 = frame < PHASE_1_END;
  const isPhase2 = frame >= PHASE_1_END && frame < PHASE_2_END;
  const isPhase3 = frame >= PHASE_2_END && frame < PHASE_3_END;
  const isPhase4 = frame >= PHASE_3_END && frame < PHASE_4_END;
  const isPhase5 = frame >= PHASE_4_END;

  const phase2Frame = Math.max(0, frame - PHASE_1_END);
  const phase3Frame = Math.max(0, frame - PHASE_2_END);
  const phase4Frame = Math.max(0, frame - PHASE_3_END);
  const phase5Frame = Math.max(0, frame - PHASE_4_END);

  // Phase 1 元素淡出
  const phase1FadeOut = isPhase2
    ? interpolate(phase2Frame, [0, 30], [1, 0], { extrapolateRight: "clamp" })
    : 1;

  // 路径校正进度
  const correctionProgress = isPhase2
    ? Math.min(1, phase2Frame / 180)
    : isPhase3
      ? 1
      : isPhase4
        ? 1
        : 0;

  // 已飞入的上下文模块数量（用于控制碎片文字消失）
  const contextModuleCount = isPhase2
    ? Math.min(4, Math.floor(phase2Frame / 45))
    : isPhase3 || isPhase4 || isPhase5
      ? 4
      : 0;

  // 结构化回答的揭示动画（Phase 4）
  const structureRevealProgress = isPhase4
    ? interpolate(phase4Frame, [0, 60], [0, 1], { extrapolateRight: "clamp" })
    : isPhase5
      ? 1
      : 0;

  return (
    <AbsoluteFill>
      <Background frame={frame} />

      {/* Phase 1: 模糊问题 + 乱麻路径 */}
      {(isPhase1 || (isPhase2 && phase1FadeOut > 0)) && (
        <div style={{ opacity: phase1FadeOut }}>
          <VagueQuestionBox frame={frame} vaguePrompt={config.vaguePrompt} />
          <ConfusedPath frame={frame} />
        </div>
      )}

      {/* 碎片文字（随上下文逐步消失） */}
      {(isPhase1 || isPhase2) && (
        <FragmentTexts
          frame={frame}
          contextModuleCount={contextModuleCount}
        />
      )}

      {/* Phase 2: 四个上下文模块飞入 + 路径校正 */}
      {isPhase2 && (
        <>
          <div
            style={{
              position: "absolute",
              left: 80,
              top: 200,
              width: 600,
              padding: "40px 48px",
              background: "rgba(255,255,255,0.04)",
              border: "2px dashed rgba(255,255,255,0.15)",
              borderRadius: 20,
            }}
          >
            <div
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,0.3)",
                marginBottom: 12,
                fontFamily: "sans-serif",
                letterSpacing: 2,
              }}
            >
              用户提问
            </div>
            <div
              style={{
                fontSize: 42,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "sans-serif",
                fontWeight: 700,
              }}
            >
              "{config.vaguePrompt}"
            </div>
          </div>

          {config.contextModules.map((mod, i) => (
            <ContextModule
              key={mod.label}
              frame={phase2Frame}
              index={i}
              label={mod.label}
              value={mod.value}
              color={mod.color}
            />
          ))}

          <GuidedPath
            frame={frame}
            correctionProgress={correctionProgress}
            structuredAnswerItems={config.structuredAnswerItems}
          />
        </>
      )}

      {/* Phase 3: 拼图补齐 + 路径完成校正 */}
      {isPhase3 && (
        <>
          <CompletedQuestionBox
            frame={phase3Frame}
            completedPrompt={config.completedPrompt}
          />
          <GuidedPath
            frame={frame}
            correctionProgress={correctionProgress}
            structuredAnswerItems={config.structuredAnswerItems}
          />
        </>
      )}

      {/* Phase 4: 结构化回答揭示（带动画） */}
      {isPhase4 && (
        <>
          <CompletedQuestionBox
            frame={120}
            completedPrompt={config.completedPrompt}
          />
          <StructuredAnswerView
            structuredAnswerItems={config.structuredAnswerItems}
            opacity={structureRevealProgress}
          />
        </>
      )}

      {/* Phase 5: 结论（结构化回答保持显示，不再重复动画） */}
      {isPhase5 && (
        <>
          {/* 左侧完整 prompt */}
          <div
            style={{
              position: "absolute",
              left: 80,
              top: 200,
              width: 600,
              padding: "40px 48px",
              background: "rgba(99, 102, 241, 0.08)",
              border: "2px solid rgba(99, 102, 241, 0.5)",
              borderRadius: 20,
              boxShadow: "0 0 30px rgba(99, 102, 241, 0.15)",
            }}
          >
            <div
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,0.6)",
                marginBottom: 12,
                fontFamily: "sans-serif",
                letterSpacing: 2,
              }}
            >
              完整提问
            </div>
            <div
              style={{
                fontSize: 28,
                color: "rgba(255,255,255,0.95)",
                fontFamily: "sans-serif",
                fontWeight: 700,
                lineHeight: 1.6,
              }}
            >
              "{config.completedPrompt}"
            </div>
          </div>

          {/* 右侧结构化回答（保持显示，不再重复动画） */}
          <StructuredAnswerView
            structuredAnswerItems={config.structuredAnswerItems}
          />

          {/* 结论遮罩 */}
          <ConclusionOverlay
            frame={phase5Frame}
            finalConclusion={config.finalConclusion}
            subtitle={config.subtitle}
          />
        </>
      )}
    </AbsoluteFill>
  );
};
