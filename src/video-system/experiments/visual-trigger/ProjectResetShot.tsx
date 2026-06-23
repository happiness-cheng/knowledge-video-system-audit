import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
} from "remotion";
import {
  COGNITION_CORE,
  ERROR_ROUTE,
  KNOWLEDGE_PATHS,
  PROJECT_BUILDINGS,
  PROJECT_RESET_SHOT_FPS,
  PROJECT_RESET_SHOT_FRAMES,
  PROJECT_RESET_TIMELINE,
} from "./projectResetShot.constants";

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

const outageProgressFor = (frame: number, delay = 0) =>
  progressBetween(frame, [30 + delay, 58 + delay], Easing.out(Easing.cubic));

const getPulse = (frame: number, speed = 0.12, amount = 1) =>
  (0.5 + Math.sin(frame * speed) * 0.5) * amount;

const BackgroundGrid: React.FC<{ frame: number; outage: number }> = ({
  frame,
  outage,
}) => {
  const drift = frame * 0.35;
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 42%, #10243a 0%, #07111f 42%, #030711 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 46%, rgba(56,189,248,0.2) 0%, rgba(56,189,248,0.08) 22%, transparent 55%)",
          opacity: 1 - outage * 0.78,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(148,163,184,0.075) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.075) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          backgroundPosition: `${drift}px ${drift * 0.5}px`,
          opacity: 0.42 - outage * 0.18,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.03), transparent 24%, rgba(0,0,0,0.25))",
        }}
      />
    </AbsoluteFill>
  );
};

const Building: React.FC<{
  building: (typeof PROJECT_BUILDINGS)[number];
  frame: number;
}> = ({ building, frame }) => {
  const isDangerBuilding = "danger" in building && building.danger === true;
  const outage = outageProgressFor(frame, isDangerBuilding ? 20 : 8);
  const lit = 1 - outage;
  const pulse = getPulse(frame, 0.08, 1);
  const dangerGlow = isDangerBuilding
    ? progressBetween(frame, [70, 96], Easing.out(Easing.cubic))
    : 0;
  const stroke =
    isDangerBuilding && dangerGlow > 0
      ? `rgba(248,113,113,${0.3 + dangerGlow * 0.45})`
      : `rgba(148,163,184,${0.26 + lit * 0.26})`;

  return (
    <g>
      <rect
        x={building.x}
        y={building.y}
        width={building.w}
        height={building.h}
        rx={14}
        fill={`rgba(15,23,42,${0.72 + outage * 0.08})`}
        stroke={stroke}
        strokeWidth={isDangerBuilding && dangerGlow > 0 ? 2.4 : 1.4}
      />
      <rect
        x={building.x + 14}
        y={building.y + 14}
        width={building.w - 28}
        height={10}
        rx={5}
        fill={
          isDangerBuilding && dangerGlow > 0
            ? `rgba(248,113,113,${0.2 + dangerGlow * 0.35})`
            : `${building.accent}${Math.round(30 + lit * (52 + pulse * 20))
                .toString(16)
                .padStart(2, "0")}`
        }
      />
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect
            key={`${building.id}-${row}-${col}`}
            x={building.x + 22 + col * 38}
            y={building.y + 42 + row * 22}
            width={24}
            height={8}
            rx={4}
            fill={`rgba(226,232,240,${0.08 + lit * 0.18})`}
          />
        )),
      )}
      <text
        x={building.x + building.w / 2}
        y={building.y + building.h + 34}
        textAnchor="middle"
        style={{
          fontFamily: MONO,
          fontSize: 24,
          fontWeight: 700,
          fill:
            isDangerBuilding && dangerGlow > 0
              ? `rgba(252,165,165,${0.48 + dangerGlow * 0.42})`
              : `rgba(203,213,225,${0.2 + lit * 0.56})`,
          letterSpacing: 0,
        }}
      >
        {building.label}
      </text>
    </g>
  );
};

const KnowledgePath: React.FC<{
  path: (typeof KNOWLEDGE_PATHS)[number];
  frame: number;
  index: number;
}> = ({ path, frame, index }) => {
  const outage = outageProgressFor(frame, index * 3);
  const lit = 1 - outage;
  const flowOffset = -((frame * 9 + index * 42) % 220);

  return (
    <g>
      <path
        d={path.d}
        fill="none"
        stroke={`rgba(56,189,248,${0.18 * lit + 0.05})`}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <path
        d={path.d}
        fill="none"
        stroke={`rgba(165,243,252,${0.72 * lit})`}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray="22 198"
        strokeDashoffset={flowOffset}
        filter="url(#cyanGlow)"
      />
      <g opacity={lit}>
        <rect
          x={path.labelX - 66}
          y={path.labelY - 24}
          width={132}
          height={40}
          rx={20}
          fill="rgba(8,47,73,0.72)"
          stroke="rgba(125,211,252,0.42)"
          strokeWidth={1}
        />
        <text
          x={path.labelX}
          y={path.labelY + 3}
          textAnchor="middle"
          style={{
            fontFamily: FONT,
            fontSize: 22,
            fontWeight: 700,
            fill: "rgba(224,242,254,0.9)",
            letterSpacing: 0,
          }}
        >
          {path.label}
        </text>
      </g>
    </g>
  );
};

const CognitionCore: React.FC<{ frame: number }> = ({ frame }) => {
  const outage = outageProgressFor(frame, 0);
  const lit = 1 - outage;
  const pulse = getPulse(frame, 0.18, 1);
  const triggerShock = progressBetween(frame, [18, 27], Easing.out(Easing.cubic));
  const dayOne = progressBetween(frame, [96, 106], Easing.out(Easing.cubic));
  const dayOneHold = progressBetween(frame, [102, 120]);
  const energy = 0.78 + pulse * 0.22;
  const ringScale = 1 + triggerShock * 1.55;

  return (
    <g>
      <circle
        cx={COGNITION_CORE.x}
        cy={COGNITION_CORE.y}
        r={COGNITION_CORE.radius + 70}
        fill={`rgba(56,189,248,${0.07 * lit})`}
        filter="url(#wideGlow)"
      />
      <circle
        cx={COGNITION_CORE.x}
        cy={COGNITION_CORE.y}
        r={(COGNITION_CORE.radius + 18) * ringScale}
        fill="none"
        stroke={`rgba(255,255,255,${0.55 * triggerShock * (1 - triggerShock)})`}
        strokeWidth={6}
      />
      <circle
        cx={COGNITION_CORE.x}
        cy={COGNITION_CORE.y}
        r={COGNITION_CORE.radius}
        fill={`rgba(8,47,73,${0.64 * lit})`}
        stroke={`rgba(165,243,252,${(0.48 + energy * 0.42) * lit})`}
        strokeWidth={5}
        filter="url(#coreGlow)"
      />
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={COGNITION_CORE.x}
          cy={COGNITION_CORE.y}
          r={COGNITION_CORE.radius - 24 - i * 32}
          fill="none"
          stroke={`rgba(125,211,252,${(0.18 + i * 0.05) * lit})`}
          strokeWidth={2}
          strokeDasharray={`${34 + i * 8} ${38 - i * 4}`}
          strokeDashoffset={frame * (1.8 + i * 0.9)}
        />
      ))}
      <text
        x={COGNITION_CORE.x}
        y={COGNITION_CORE.y - 12}
        textAnchor="middle"
        style={{
          fontFamily: MONO,
          fontSize: 30,
          fontWeight: 800,
          fill: `rgba(224,242,254,${0.92 * lit})`,
          letterSpacing: 1,
        }}
      >
        PROJECT
      </text>
      <text
        x={COGNITION_CORE.x}
        y={COGNITION_CORE.y + 34}
        textAnchor="middle"
        style={{
          fontFamily: FONT,
          fontSize: 42,
          fontWeight: 800,
          fill: `rgba(240,249,255,${0.94 * lit})`,
          letterSpacing: 0,
        }}
      >
        认知核心
      </text>
      <g opacity={dayOne}>
        <circle
          cx={COGNITION_CORE.x}
          cy={COGNITION_CORE.y}
          r={COGNITION_CORE.radius + 8}
          fill={`rgba(2,6,23,${0.82 + dayOneHold * 0.08})`}
          stroke="rgba(148,163,184,0.46)"
          strokeWidth={2}
        />
        <text
          x={COGNITION_CORE.x}
          y={COGNITION_CORE.y - 2}
          textAnchor="middle"
          style={{
            fontFamily: MONO,
            fontSize: 86,
            fontWeight: 900,
            fill: "rgba(241,245,249,0.96)",
            letterSpacing: 2,
          }}
        >
          DAY 1
        </text>
        <text
          x={COGNITION_CORE.x}
          y={COGNITION_CORE.y + 58}
          textAnchor="middle"
          style={{
            fontFamily: FONT,
            fontSize: 26,
            fontWeight: 700,
            fill: "rgba(148,163,184,0.74)",
            letterSpacing: 0,
          }}
        >
          认知归零，项目仍在
        </text>
      </g>
    </g>
  );
};

const NewChatButton: React.FC<{ frame: number }> = ({ frame }) => {
  const press = progressBetween(frame, [18, 24], Easing.out(Easing.cubic));
  const release = progressBetween(frame, [24, 30], Easing.out(Easing.cubic));
  const active = clamp01(press - release);
  const scale = 1 - active * 0.08;
  const glow = progressBetween(frame, [18, 28], Easing.out(Easing.cubic));

  return (
    <g transform={`translate(1296 216) scale(${scale})`}>
      <rect
        x={-108}
        y={-34}
        width={216}
        height={68}
        rx={20}
        fill={`rgba(15,23,42,${0.62 + active * 0.18})`}
        stroke={`rgba(226,232,240,${0.18 + glow * 0.6})`}
        strokeWidth={2}
        filter="url(#buttonGlow)"
      />
      <circle
        cx={-72}
        cy={0}
        r={9 + glow * 8}
        fill={`rgba(248,250,252,${0.34 + glow * 0.58})`}
      />
      <text
        x={14}
        y={8}
        textAnchor="middle"
        style={{
          fontFamily: MONO,
          fontSize: 25,
          fontWeight: 900,
          fill: `rgba(248,250,252,${0.68 + glow * 0.28})`,
          letterSpacing: 1,
        }}
      >
        NEW CHAT
      </text>
    </g>
  );
};

const ErrorRoute: React.FC<{ frame: number }> = ({ frame }) => {
  const progress = progressBetween(frame, [66, 96], Easing.inOut(Easing.cubic));
  const startGlow = progressBetween(frame, [66, 74]);
  const warningPulse = getPulse(frame, 0.34, 1);

  return (
    <g opacity={progress > 0 ? 1 : 0}>
      <path
        d={ERROR_ROUTE.d}
        fill="none"
        stroke="rgba(127,29,29,0.42)"
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray="1060"
        strokeDashoffset={1060 * (1 - progress)}
      />
      <path
        d={ERROR_ROUTE.d}
        fill="none"
        stroke={`rgba(248,113,113,${0.74 + warningPulse * 0.22})`}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray="1060"
        strokeDashoffset={1060 * (1 - progress)}
        filter="url(#redGlow)"
      />
      <circle
        cx={410}
        cy={802}
        r={11 + startGlow * 7}
        fill={`rgba(248,113,113,${0.32 + startGlow * 0.58})`}
        filter="url(#redGlow)"
      />
      <rect
        x={344}
        y={826}
        width={138}
        height={38}
        rx={19}
        fill={`rgba(69,10,10,${0.42 + startGlow * 0.25})`}
        stroke={`rgba(248,113,113,${0.22 + startGlow * 0.4})`}
        strokeWidth={1}
      />
      <text
        x={413}
        y={852}
        textAnchor="middle"
        style={{
          fontFamily: MONO,
          fontSize: 19,
          fontWeight: 800,
          fill: `rgba(254,202,202,${0.44 + startGlow * 0.46})`,
        }}
      >
        {ERROR_ROUTE.startLabel}
      </text>
    </g>
  );
};

const OutageOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  const shock = progressBetween(frame, [18, 30], Easing.out(Easing.cubic));
  const outage = outageProgressFor(frame, 0);
  const flash = shock * (1 - shock);

  return (
    <>
      <AbsoluteFill
        style={{
          background: `rgba(255,255,255,${flash * 0.28})`,
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 46%, transparent 0%, rgba(0,0,0,${outage * 0.22}) 44%, rgba(0,0,0,${outage * 0.58}) 100%)`,
          pointerEvents: "none",
        }}
      />
    </>
  );
};

const ProjectWorldSvg: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <svg
      width="1920"
      height="1080"
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <filter id="coreGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="18" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.2 0 0 0 0 0.8 0 0 0 0 1 0 0 0 0.75 0"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="wideGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="44" />
        </filter>
        <filter id="cyanGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="redGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="buttonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform="translate(0 18) scale(1 0.94)">
        {PROJECT_BUILDINGS.map((building) => (
          <Building key={building.id} building={building} frame={frame} />
        ))}
        {KNOWLEDGE_PATHS.map((path, index) => (
          <KnowledgePath
            key={path.id}
            path={path}
            frame={frame}
            index={index}
          />
        ))}
        <ErrorRoute frame={frame} />
        <CognitionCore frame={frame} />
        <NewChatButton frame={frame} />
      </g>
    </svg>
  );
};

export const ProjectResetShot: React.FC = () => {
  const frame = useCurrentFrame();
  const outage = outageProgressFor(frame, 0);
  const cameraPush = interpolate(frame, [0, PROJECT_RESET_SHOT_FRAMES], [1, 1.055], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const shakeEnvelope =
    frame >= 24 && frame <= 42
      ? interpolate(frame, [24, 30, 42], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const shakeX = Math.sin(frame * 1.9) * 8 * shakeEnvelope;
  const shakeY = Math.cos(frame * 2.1) * 5 * shakeEnvelope;
  const dayOneSpring = spring({
    frame: Math.max(0, frame - PROJECT_RESET_TIMELINE.errorRouteEnd),
    fps: PROJECT_RESET_SHOT_FPS,
    config: { damping: 18, stiffness: 120, mass: 0.7 },
  });

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        fontFamily: FONT,
        backgroundColor: "#020617",
      }}
    >
      <BackgroundGrid frame={frame} outage={outage} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${shakeX}px, ${shakeY}px) scale(${cameraPush})`,
          transformOrigin: "50% 48%",
        }}
      >
        <ProjectWorldSvg frame={frame} />
      </div>
      <OutageOverlay frame={frame} />

      <div
        style={{
          position: "absolute",
          left: 58,
          top: 46,
          fontFamily: MONO,
          fontSize: 22,
          fontWeight: 800,
          color: `rgba(148,163,184,${0.56 - outage * 0.26})`,
          letterSpacing: 1.2,
        }}
      >
        SESSION MEMORY MAP
      </div>
      <div
        style={{
          position: "absolute",
          right: 58,
          top: 46,
          fontFamily: MONO,
          fontSize: 21,
          fontWeight: 800,
          color:
            frame < PROJECT_RESET_TIMELINE.outageEnd
              ? `rgba(125,211,252,${0.72 - outage * 0.48})`
              : "rgba(248,113,113,0.72)",
          letterSpacing: 1.1,
        }}
      >
        {frame < PROJECT_RESET_TIMELINE.outageEnd
          ? "CONTEXT ONLINE"
          : "NO PROJECT CONTEXT"}
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 54,
          transform: `translateX(-50%) translateY(${(1 - dayOneSpring) * 16}px)`,
          opacity: interpolate(frame, [96, 108], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontFamily: FONT,
          fontSize: 28,
          fontWeight: 700,
          color: "rgba(203,213,225,0.72)",
          letterSpacing: 0,
        }}
      >
        项目还在，但它又不认识这里了
      </div>
    </AbsoluteFill>
  );
};

export const AUDIENCE_VALIDATION_PROJECT_RESET_SHOT_FRAMES =
  PROJECT_RESET_SHOT_FRAMES;
