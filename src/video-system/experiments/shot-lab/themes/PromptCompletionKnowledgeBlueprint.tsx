import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from "remotion";

/**
 * PromptCompletionKnowledgeBlueprint — 知识架构蓝图主题
 *
 * 奶油纸底 + 铁锈红强调 + 建筑蓝图网格
 * 强化网格、坐标、结构线、路径、节点、模块关系
 * 让"模糊提问 → 上下文补齐 → 路径校正 → 输出结构化"更像知识结构逐步成型
 */

// ── 时间轴常量 ──────────────────────────────────────────
const PHASE_1_END = 90;
const PHASE_2_END = 270;
const PHASE_3_END = 390;
const PHASE_4_END = 540;
const PHASE_5_END = 630;
export const TOTAL_FRAMES = PHASE_5_END;

// ── 知识架构蓝图色彩 ────────────────────────────────────
const COLORS = {
  bg: "#F0EAE0",
  bgAlt: "#E8E2D8",
  text: "#1A1A1A",
  textSecondary: "#555555",
  textMuted: "#888888",
  accent: "#B5392A",
  accentSoft: "rgba(181,57,42,0.08)",
  pathConfused: "rgba(85,85,85,0.3)",
  pathClear: "#B5392A",
  forkConfused: "rgba(181,57,42,0.25)",
  grid: "rgba(26,26,26,0.06)",
  gridStrong: "rgba(26,26,26,0.12)",
  cardBorder: "#1A1A1A",
  cardBg: "#FFFFFF",
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

const FRAGMENT_TEXTS = [
  { text: "大概...", x: 180, y: 120, rotation: -15 },
  { text: "可能...", x: 320, y: 300, rotation: 10 },
  { text: "一般来说", x: 420, y: 150, rotation: -8 },
  { text: "某种程度", x: 250, y: 350, rotation: 12 },
];

// ── Props 接口 ──────────────────────────────────────────
export interface PromptCompletionKnowledgeBlueprintProps {
  vaguePrompt: string;
  contextModules: { label: string; value: string; color: string }[];
  completedPrompt: string;
  structuredAnswerItems: { title: string; icon: string }[];
  finalConclusion: string;
  subtitle: string;
}

const defaultProps: PromptCompletionKnowledgeBlueprintProps = {
  vaguePrompt: "帮我解释一下这个问题",
  contextModules: [
    { label: "背景", value: "完全不了解", color: "#B5392A" },
    { label: "目标", value: "生活例子解释", color: "#D4564A" },
    { label: "限制", value: "不要堆术语", color: "#E07060" },
    { label: "输出", value: "2-3个方案", color: "#EC8A7A" },
  ],
  completedPrompt: "我完全不了解，希望用生活例子解释，不要堆术语，给2-3个方案",
  structuredAnswerItems: [
    { title: "背景解释", icon: "📋" },
    { title: "核心观点", icon: "💡" },
    { title: "生活例子", icon: "🌰" },
    { title: "行动建议", icon: "🎯" },
  ],
  finalConclusion: "AI 没变，材料变完整了",
  subtitle: "问法决定回答质量",
};

// ── 子组件：蓝图网格背景 ────────────────────────────────
const BlueprintGrid: React.FC<{ frame: number }> = ({ frame }) => {
  const drift = frame * 0.2;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* 主网格 */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(${COLORS.gridStrong} 1px, transparent 1px),
          linear-gradient(90deg, ${COLORS.gridStrong} 1px, transparent 1px)
        `,
        backgroundSize: "120px 120px",
        backgroundPosition: `${drift}px ${drift * 0.5}px`,
      }} />
      {/* 细网格 */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(${COLORS.grid} 1px, transparent 1px),
          linear-gradient(90deg, ${COLORS.grid} 1px, transparent 1px)
        `,
        backgroundSize: "30px 30px",
        backgroundPosition: `${drift}px ${drift * 0.5}px`,
      }} />
      {/* 坐标标记 */}
      {[0, 120, 240, 360, 480, 600, 720, 840, 960].map((x) => (
        <div key={`x-${x}`} style={{ position: "absolute", left: x + drift % 120, top: 0, bottom: 0, width: 1, background: COLORS.gridStrong }} />
      ))}
    </div>
  );
};

// ── 子组件：模糊问题框 ──────────────────────────────────
const VagueQuestionBox: React.FC<{ frame: number; vaguePrompt: string }> = ({ frame, vaguePrompt }) => {
  const appear = spring({ frame, fps: 30, config: { damping: 15, mass: 0.8 } });
  const shake = frame > 60 ? Math.sin(frame * 0.8) * 2 * Math.max(0, 1 - (frame - 60) / 30) : 0;

  return (
    <div style={{ position: "absolute", left: 80, top: 200, width: 600, padding: "40px 48px", background: COLORS.cardBg, border: `2px solid ${COLORS.textMuted}`, borderRadius: 12, opacity: appear, transform: `scale(${0.8 + appear * 0.2}) translateX(${shake}px)`, boxShadow: "0 8px 24px rgba(26,26,26,0.08)" }}>
      <div style={{ fontSize: 18, color: COLORS.textMuted, marginBottom: 12, fontFamily: "'Inter','Noto Sans SC',sans-serif", letterSpacing: 2, fontWeight: 800 }}>用户提问</div>
      <div style={{ fontSize: 42, color: COLORS.textSecondary, fontFamily: "'Inter','Noto Sans SC',sans-serif", fontWeight: 700 }}>"{vaguePrompt}"</div>
      <div style={{ marginTop: 16, fontSize: 16, color: COLORS.textMuted, fontFamily: "'Inter','Noto Sans SC',sans-serif" }}>缺少上下文，AI 无法理解你真正想要什么</div>
      {/* 蓝图标记 */}
      <div style={{ position: "absolute", top: -20, left: 16, fontSize: 12, color: COLORS.accent, fontFamily: "monospace", fontWeight: 800 }}>INPUT_v0</div>
    </div>
  );
};

// ── 子组件：乱麻路径 ────────────────────────────────────
const ConfusedPath: React.FC<{ frame: number }> = ({ frame }) => {
  const appear = spring({ frame: Math.max(0, frame - 15), fps: 30, config: { damping: 20 } });
  const pathProgress = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: "clamp" });

  const confusedPathD = `M ${CONFUSED_PATH_POINTS.start.x} ${CONFUSED_PATH_POINTS.start.y} C ${CONFUSED_PATH_POINTS.cp1.x} ${CONFUSED_PATH_POINTS.cp1.y}, ${CONFUSED_PATH_POINTS.cp2.x} ${CONFUSED_PATH_POINTS.cp2.y}, ${CONFUSED_PATH_POINTS.end.x} ${CONFUSED_PATH_POINTS.end.y}`;

  return (
    <div style={{ position: "absolute", right: 80, top: 100, width: 600, height: 400, opacity: appear }}>
      <svg width="600" height="400" style={{ position: "absolute", top: 0, left: 0 }}>
        <path d={confusedPathD} fill="none" stroke={COLORS.pathConfused} strokeWidth="3" strokeDasharray="600" strokeDashoffset={600 * (1 - pathProgress)} />
        <path d="M 200 180 Q 250 120 300 160" fill="none" stroke={COLORS.forkConfused} strokeWidth="2" strokeDasharray="200" strokeDashoffset={200 * (1 - Math.max(0, pathProgress - 0.3))} />
        <path d="M 350 250 Q 400 320 450 280" fill="none" stroke={COLORS.forkConfused} strokeWidth="2" strokeDasharray="200" strokeDashoffset={200 * (1 - Math.max(0, pathProgress - 0.5))} />
        {/* 节点 */}
        {[0.2, 0.4, 0.6, 0.8].map((t, i) => {
          const x = interpolate(t, [0, 1], [50, 550]);
          const y = 280 + Math.sin(t * Math.PI * 3) * 80;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={6} fill="none" stroke={COLORS.textMuted} strokeWidth="2" opacity={pathProgress} />
              <circle cx={x} cy={y} r={2} fill={COLORS.textMuted} opacity={pathProgress} />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 480, top: 160, width: 120, height: 80, background: COLORS.cardBg, border: `1px dashed ${COLORS.textMuted}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: COLORS.textMuted, fontFamily: "'Inter','Noto Sans SC',sans-serif", opacity: pathProgress, filter: "blur(2px)" }}>泛泛回答</div>
      <div style={{ position: "absolute", top: 20, left: 20, fontSize: 14, color: COLORS.textMuted, fontFamily: "monospace", letterSpacing: 2, fontWeight: 800 }}>OUTPUT_v0 · 路径混乱</div>
    </div>
  );
};

// ── 子组件：碎片文字 ────────────────────────────────────
const FragmentTexts: React.FC<{ frame: number; contextModuleCount: number }> = ({ frame, contextModuleCount }) => {
  const appear = spring({ frame: Math.max(0, frame - 30), fps: 30, config: { damping: 15 } });

  return (
    <div style={{ position: "absolute", right: 80, top: 100, width: 600, height: 400 }}>
      {FRAGMENT_TEXTS.map((frag, i) => {
        const disappearProgress = Math.max(0, contextModuleCount - i);
        const fadeOut = interpolate(disappearProgress, [0, 1], [1, 0], { extrapolateRight: "clamp" });
        const drift = disappearProgress * 30;
        const blur = disappearProgress * 4;

        return (
          <div key={i} style={{ position: "absolute", left: frag.x, top: frag.y, fontSize: 16, color: COLORS.textMuted, fontFamily: "monospace", fontStyle: "italic", transform: `rotate(${frag.rotation}deg) translateY(${-drift}px)`, opacity: appear * fadeOut * 0.7, filter: `blur(${blur}px)` }}>{frag.text}</div>
        );
      })}
    </div>
  );
};

// ── 子组件：路径校正 ────────────────────────────────────
const GuidedPath: React.FC<{ frame: number; correctionProgress: number }> = ({ frame, correctionProgress }) => {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const currentPoints = {
    start: { x: lerp(CONFUSED_PATH_POINTS.start.x, CLEAR_PATH_POINTS.start.x, correctionProgress), y: lerp(CONFUSED_PATH_POINTS.start.y, CLEAR_PATH_POINTS.start.y, correctionProgress) },
    cp1: { x: lerp(CONFUSED_PATH_POINTS.cp1.x, CLEAR_PATH_POINTS.cp1.x, correctionProgress), y: lerp(CONFUSED_PATH_POINTS.cp1.y, CLEAR_PATH_POINTS.cp1.y, correctionProgress) },
    cp2: { x: lerp(CONFUSED_PATH_POINTS.cp2.x, CLEAR_PATH_POINTS.cp2.x, correctionProgress), y: lerp(CONFUSED_PATH_POINTS.cp2.y, CLEAR_PATH_POINTS.cp2.y, correctionProgress) },
    cp3: { x: lerp(CONFUSED_PATH_POINTS.cp3.x, CLEAR_PATH_POINTS.cp3.x, correctionProgress), y: lerp(CONFUSED_PATH_POINTS.cp3.y, CLEAR_PATH_POINTS.cp3.y, correctionProgress) },
    cp4: { x: lerp(CONFUSED_PATH_POINTS.cp4.x, CLEAR_PATH_POINTS.cp4.x, correctionProgress), y: lerp(CONFUSED_PATH_POINTS.cp4.y, CLEAR_PATH_POINTS.cp4.y, correctionProgress) },
    end: { x: lerp(CONFUSED_PATH_POINTS.end.x, CLEAR_PATH_POINTS.end.x, correctionProgress), y: lerp(CONFUSED_PATH_POINTS.end.y, CLEAR_PATH_POINTS.end.y, correctionProgress) },
  };

  const guidedPathD = `M ${currentPoints.start.x} ${currentPoints.start.y} C ${currentPoints.cp1.x} ${currentPoints.cp1.y}, ${currentPoints.cp2.x} ${currentPoints.cp2.y}, ${currentPoints.end.x} ${currentPoints.end.y}`;
  const forkOpacity = 1 - correctionProgress;

  return (
    <div style={{ position: "absolute", right: 80, top: 100, width: 600, height: 400 }}>
      <svg width="600" height="400" style={{ position: "absolute", top: 0, left: 0 }}>
        <path d={guidedPathD} fill="none" stroke={COLORS.pathClear} strokeWidth={3 + correctionProgress * 2} strokeLinecap="round" opacity={0.5 + correctionProgress * 0.5} />
        {forkOpacity > 0.05 && (
          <>
            <path d="M 200 180 Q 250 120 300 160" fill="none" stroke={COLORS.forkConfused} strokeWidth="2" opacity={forkOpacity} />
            <path d="M 350 250 Q 400 320 450 280" fill="none" stroke={COLORS.forkConfused} strokeWidth="2" opacity={forkOpacity} />
          </>
        )}
        {/* 节点逐渐对齐 */}
        {[0.2, 0.4, 0.6, 0.8].map((t, i) => {
          const baseX = interpolate(t, [0, 1], [50, 550]);
          const baseY = 280 + Math.sin(t * Math.PI * 3) * 80;
          const targetY = 200 + (280 - 200) * (1 - t);
          const y = lerp(baseY, targetY, correctionProgress);
          return (
            <g key={i}>
              <circle cx={baseX} cy={y} r={6 + correctionProgress * 2} fill="none" stroke={COLORS.pathClear} strokeWidth="2" />
              <circle cx={baseX} cy={y} r={2 + correctionProgress} fill={COLORS.pathClear} />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", top: 20, left: 20, fontSize: 14, color: COLORS.textSecondary, fontFamily: "monospace", letterSpacing: 2, fontWeight: 800 }}>OUTPUT_v{Math.round(correctionProgress * 10)} · {correctionProgress < 0.5 ? "路径校正中" : "结构形成中"}</div>
    </div>
  );
};

// ── 子组件：上下文模块 ──────────────────────────────────
const ContextModule: React.FC<{ frame: number; index: number; label: string; value: string; color: string }> = ({ frame, index, label, value, color }) => {
  const delay = index * 45;
  const localFrame = Math.max(0, frame - delay);
  const flyIn = spring({ frame: localFrame, fps: 30, config: { damping: 12, mass: 0.6, stiffness: 100 } });

  const startX = -300 + index * 60;
  const startY = 500 + index * 80;
  const targetX = 80 + index * 10;
  const targetY = 420 + index * 55;

  const x = startX + (targetX - startX) * flyIn;
  const y = startY + (targetY - startY) * flyIn;
  const rotation = (1 - flyIn) * (15 - index * 8);
  const scale = 0.6 + flyIn * 0.4;

  const glow = localFrame > 30 ? spring({ frame: localFrame - 30, fps: 30, config: { damping: 20 } }) : 0;

  return (
    <div style={{ position: "absolute", left: x, top: y, padding: "14px 24px", background: COLORS.accentSoft, border: `2px solid ${color}${Math.round(60 + glow * 40).toString(16).padStart(2, "0")}`, borderRadius: 8, transform: `rotate(${rotation}deg) scale(${scale})`, boxShadow: glow > 0 ? `0 0 ${16 * glow}px ${color}33` : "none", display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 14, color: COLORS.accent, fontFamily: "monospace", fontWeight: 800, opacity: 0.9, minWidth: 40 }}>{label}</span>
      <span style={{ fontSize: 22, color: COLORS.text, fontFamily: "'Inter','Noto Sans SC',sans-serif", fontWeight: 600 }}>{value}</span>
      {/* 蓝图标记 */}
      <span style={{ position: "absolute", top: -16, left: 8, fontSize: 10, color: COLORS.accent, fontFamily: "monospace", fontWeight: 800 }}>CTX_{index + 1}</span>
    </div>
  );
};

// ── 子组件：补齐后的问题框 ──────────────────────────────
const CompletedQuestionBox: React.FC<{ frame: number; completedPrompt: string }> = ({ frame, completedPrompt }) => {
  const progress = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: "clamp" });
  const borderOpacity = interpolate(progress, [0, 1], [0.3, 1]);
  const flash = frame < 30 ? interpolate(frame, [10, 20, 30], [0, 0.5, 0], { extrapolateRight: "clamp" }) : 0;

  return (
    <div style={{ position: "absolute", left: 80, top: 200, width: 600, padding: "40px 48px", background: COLORS.cardBg, border: `2px solid ${COLORS.accent}${Math.round(borderOpacity * 200).toString(16).padStart(2, "0")}`, borderRadius: 12, boxShadow: `0 0 ${24 * flash}px ${COLORS.accent}40` }}>
      <div style={{ fontSize: 18, color: COLORS.textSecondary, marginBottom: 12, fontFamily: "'Inter','Noto Sans SC',sans-serif", letterSpacing: 2, fontWeight: 800 }}>完整提问</div>
      <div style={{ fontSize: 28, color: COLORS.text, fontFamily: "'Inter','Noto Sans SC',sans-serif", fontWeight: 700, lineHeight: 1.6 }}>"{completedPrompt}"</div>
      {/* 蓝图标记 */}
      <div style={{ position: "absolute", top: -20, left: 16, fontSize: 12, color: COLORS.accent, fontFamily: "monospace", fontWeight: 800 }}>INPUT_v10</div>
    </div>
  );
};

// ── 子组件：结构化回答 ──────────────────────────────────
const StructuredAnswerView: React.FC<{ structuredAnswerItems: { title: string; icon: string }[]; opacity?: number }> = ({ structuredAnswerItems, opacity = 1 }) => {
  return (
    <div style={{ position: "absolute", right: 80, top: 100, width: 600, height: 400 }}>
      <svg width="600" height="400" style={{ position: "absolute", top: 0, left: 0 }}>
        <path d={`M ${CLEAR_PATH_POINTS.start.x} ${CLEAR_PATH_POINTS.start.y} C ${CLEAR_PATH_POINTS.cp1.x} ${CLEAR_PATH_POINTS.cp1.y}, ${CLEAR_PATH_POINTS.cp2.x} ${CLEAR_PATH_POINTS.cp2.y}, ${CLEAR_PATH_POINTS.end.x} ${CLEAR_PATH_POINTS.end.y}`} fill="none" stroke={COLORS.pathClear} strokeWidth="5" strokeLinecap="round" opacity={0.7} />
        {/* 节点 */}
        {[0.2, 0.4, 0.6, 0.8].map((t, i) => {
          const x = interpolate(t, [0, 1], [50, 550]);
          const y = 200 + (280 - 200) * (1 - t);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={8} fill="none" stroke={COLORS.pathClear} strokeWidth="2" />
              <circle cx={x} cy={y} r={3} fill={COLORS.pathClear} />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 0, top: 100, width: 600, padding: "36px 40px", background: COLORS.cardBg, border: `2px solid ${COLORS.cardBorder}`, borderRadius: 12, boxShadow: "0 8px 24px rgba(26,26,26,0.08)", opacity }}>
        <div style={{ fontSize: 16, color: COLORS.textSecondary, marginBottom: 20, fontFamily: "monospace", letterSpacing: 2, fontWeight: 800 }}>OUTPUT_v10 · 结构清晰</div>
        {structuredAnswerItems.map((section, i) => (
          <div key={section.title} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", marginBottom: i < 3 ? 10 : 0, background: COLORS.accentSoft, borderRadius: 8, borderLeft: `3px solid ${COLORS.accent}60` }}>
            <span style={{ fontSize: 24 }}>{section.icon}</span>
            <span style={{ fontSize: 22, color: COLORS.text, fontFamily: "'Inter','Noto Sans SC',sans-serif", fontWeight: 600 }}>{section.title}</span>
            <span style={{ marginLeft: "auto", fontSize: 14, color: COLORS.textMuted, fontFamily: "monospace" }}>SEC_{i + 1}</span>
          </div>
        ))}
      </div>
      {/* 蓝图标记 */}
      <div style={{ position: "absolute", top: 80, left: 16, fontSize: 12, color: COLORS.accent, fontFamily: "monospace", fontWeight: 800 }}>STRUCTURE_v10</div>
    </div>
  );
};

// ── 子组件：结论 ────────────────────────────────────────
const ConclusionOverlay: React.FC<{ frame: number; finalConclusion: string; subtitle: string }> = ({ frame, finalConclusion, subtitle }) => {
  const overlayAppear = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const textAppear = spring({ frame: Math.max(0, frame - 15), fps: 30, config: { damping: 12, mass: 0.8 } });
  const subtitleAppear = spring({ frame: Math.max(0, frame - 35), fps: 30, config: { damping: 15 } });
  const arrowAppear = spring({ frame: Math.max(0, frame - 50), fps: 30, config: { damping: 18 } });

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `rgba(240,234,224,${overlayAppear * 0.95})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32, opacity: arrowAppear, transform: `scale(${0.8 + arrowAppear * 0.2})` }}>
        <div style={{ padding: "12px 24px", background: COLORS.accentSoft, border: `1px solid ${COLORS.accent}40`, borderRadius: 8, fontSize: 20, color: COLORS.text, fontFamily: "monospace", fontWeight: 800 }}>INPUT_QUALITY</div>
        <div style={{ fontSize: 28, color: COLORS.textMuted, fontFamily: "monospace" }}>→</div>
        <div style={{ padding: "12px 24px", background: COLORS.accentSoft, border: `1px solid ${COLORS.accent}30`, borderRadius: 8, fontSize: 20, color: COLORS.text, fontFamily: "monospace", fontWeight: 800 }}>OUTPUT_QUALITY</div>
      </div>
      <div style={{ fontSize: 44, color: COLORS.text, fontFamily: "'Inter','Noto Sans SC',sans-serif", fontWeight: 800, letterSpacing: 3, opacity: textAppear, transform: `scale(${0.85 + textAppear * 0.15})`, textAlign: "center" }}>{finalConclusion}</div>
      <div style={{ marginTop: 20, fontSize: 22, color: COLORS.textSecondary, fontFamily: "'Inter','Noto Sans SC',sans-serif", opacity: subtitleAppear, letterSpacing: 4 }}>{subtitle}</div>
    </div>
  );
};

// ── 主 Composition ──────────────────────────────────────
export const PromptCompletionKnowledgeBlueprint: React.FC<Partial<PromptCompletionKnowledgeBlueprintProps>> = (props) => {
  const frame = useCurrentFrame();
  const config = { ...defaultProps, ...props };

  const isPhase1 = frame < PHASE_1_END;
  const isPhase2 = frame >= PHASE_1_END && frame < PHASE_2_END;
  const isPhase3 = frame >= PHASE_2_END && frame < PHASE_3_END;
  const isPhase4 = frame >= PHASE_3_END && frame < PHASE_4_END;
  const isPhase5 = frame >= PHASE_4_END;

  const phase2Frame = Math.max(0, frame - PHASE_1_END);
  const phase3Frame = Math.max(0, frame - PHASE_2_END);
  const phase4Frame = Math.max(0, frame - PHASE_3_END);
  const phase5Frame = Math.max(0, frame - PHASE_4_END);

  const phase1FadeOut = isPhase2 ? interpolate(phase2Frame, [0, 30], [1, 0], { extrapolateRight: "clamp" }) : 1;
  const correctionProgress = isPhase2 ? Math.min(1, phase2Frame / 180) : isPhase3 ? 1 : isPhase4 ? 1 : 0;
  const contextModuleCount = isPhase2 ? Math.min(4, Math.floor(phase2Frame / 45)) : isPhase3 || isPhase4 || isPhase5 ? 4 : 0;
  const structureRevealProgress = isPhase4 ? interpolate(phase4Frame, [0, 60], [0, 1], { extrapolateRight: "clamp" }) : isPhase5 ? 1 : 0;

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <BlueprintGrid frame={frame} />
      {(isPhase1 || (isPhase2 && phase1FadeOut > 0)) && (
        <div style={{ opacity: phase1FadeOut }}>
          <VagueQuestionBox frame={frame} vaguePrompt={config.vaguePrompt} />
          <ConfusedPath frame={frame} />
        </div>
      )}
      {(isPhase1 || isPhase2) && <FragmentTexts frame={frame} contextModuleCount={contextModuleCount} />}
      {isPhase2 && (
        <>
          <div style={{ position: "absolute", left: 80, top: 200, width: 600, padding: "40px 48px", background: COLORS.cardBg, border: `2px dashed ${COLORS.textMuted}`, borderRadius: 12, boxShadow: "0 8px 24px rgba(26,26,26,0.08)" }}>
            <div style={{ fontSize: 18, color: COLORS.textMuted, marginBottom: 12, fontFamily: "'Inter','Noto Sans SC',sans-serif", letterSpacing: 2, fontWeight: 800 }}>用户提问</div>
            <div style={{ fontSize: 42, color: COLORS.textSecondary, fontFamily: "'Inter','Noto Sans SC',sans-serif", fontWeight: 700 }}>"{config.vaguePrompt}"</div>
          </div>
          {config.contextModules.map((mod, i) => <ContextModule key={mod.label} frame={phase2Frame} index={i} label={mod.label} value={mod.value} color={mod.color} />)}
          <GuidedPath frame={frame} correctionProgress={correctionProgress} />
        </>
      )}
      {isPhase3 && (
        <>
          <CompletedQuestionBox frame={phase3Frame} completedPrompt={config.completedPrompt} />
          <GuidedPath frame={frame} correctionProgress={correctionProgress} />
        </>
      )}
      {isPhase4 && (
        <>
          <CompletedQuestionBox frame={120} completedPrompt={config.completedPrompt} />
          <StructuredAnswerView structuredAnswerItems={config.structuredAnswerItems} opacity={structureRevealProgress} />
        </>
      )}
      {isPhase5 && (
        <>
          <div style={{ position: "absolute", left: 80, top: 200, width: 600, padding: "40px 48px", background: COLORS.cardBg, border: `2px solid ${COLORS.accent}80`, borderRadius: 12, boxShadow: `0 0 24px ${COLORS.accent}20` }}>
            <div style={{ fontSize: 18, color: COLORS.textSecondary, marginBottom: 12, fontFamily: "'Inter','Noto Sans SC',sans-serif", letterSpacing: 2, fontWeight: 800 }}>完整提问</div>
            <div style={{ fontSize: 28, color: COLORS.text, fontFamily: "'Inter','Noto Sans SC',sans-serif", fontWeight: 700, lineHeight: 1.6 }}>"{config.completedPrompt}"</div>
            <div style={{ position: "absolute", top: -20, left: 16, fontSize: 12, color: COLORS.accent, fontFamily: "monospace", fontWeight: 800 }}>INPUT_v10</div>
          </div>
          <StructuredAnswerView structuredAnswerItems={config.structuredAnswerItems} />
          <ConclusionOverlay frame={phase5Frame} finalConclusion={config.finalConclusion} subtitle={config.subtitle} />
        </>
      )}
    </AbsoluteFill>
  );
};
