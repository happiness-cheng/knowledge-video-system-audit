import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { MotionBox } from "../primitives/MotionBox";
import { MotionText } from "../primitives/MotionText";
import { MotionCard } from "../primitives/MotionCard";
import { MotionBadge } from "../primitives/MotionBadge";
import { MotionProgress } from "../primitives/MotionProgress";
import { MotionFrame } from "../primitives/MotionFrame";
import { MotionDivider } from "../primitives/MotionDivider";
import { MotionGrid } from "../primitives/MotionGrid";
import { SceneHeader } from "../components/SceneHeader";

/** Component Gallery — 展示所有可复用组件 */
export const ComponentGallery: React.FC = () => {
  const frame = useCurrentFrame();
  const activeOp = interpolate(frame, [60, 90], [0.4, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "60px 80px", overflow: "hidden" }}>
      <SceneHeader title="Component Gallery" subtitle="可复用组件库" />
      <MotionGrid columns={3} gap={20}>
        <MotionCard delay={5}>
          <MotionBadge text="MotionCard" delay={8} />
          <MotionText text="带 active 状态的卡片" fontSize={44} color="#a0a0b8" delay={12} />
        </MotionCard>
        <MotionCard delay={10}>
          <MotionBadge text="MotionBadge" color="#34d399" bg="rgba(52,211,153,0.1)" delay={13} />
          <MotionText text="标签/徽章组件" fontSize={44} color="#a0a0b8" delay={17} />
        </MotionCard>
        <MotionCard delay={15}>
          <MotionBadge text="MotionProgress" color="#fbbf24" bg="rgba(251,191,36,0.1)" delay={18} />
          <MotionProgress current={7} total={10} color="#fbbf24" style={{ marginTop: 12 }} />
        </MotionCard>
        <MotionFrame delay={20}>
          <MotionText text="MotionFrame — 带边框容器" fontSize={40} color="#a0a0b8" delay={23} />
        </MotionFrame>
        <MotionBox delay={25} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 24 }}>
          <MotionText text="MotionBox — 动画容器" fontSize={40} color="#a0a0b8" delay={28} />
        </MotionBox>
        <MotionCard delay={30} activeOpacity={activeOp}>
          <MotionText text="Cue Active 演示" fontSize={44} fontWeight={700} color="#f0f0f5" delay={33} />
          <MotionDivider delay={36} />
          <MotionText text="frame 驱动 active" fontSize={40} color="#a0a0b8" delay={39} />
        </MotionCard>
      </MotionGrid>
    </div>
  );
};
