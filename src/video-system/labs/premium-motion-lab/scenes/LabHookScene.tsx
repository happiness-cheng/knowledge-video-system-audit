import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { KineticTitle } from "../components/KineticTitle";
import { labContent } from "../labContent";

/**
 * S01 LabHookScene — 痛点放大页
 * - 主标题 spring 入场
 * - 副标题延迟出现
 * - 不放截图
 * - 不堆标签
 * - 第一眼知道这是痛点
 */
export const LabHookScene: React.FC = () => {
  const scene = labContent.scenes[0]; // S01

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <KineticTitle
        title={scene.title!}
        subtitle={scene.subtitle}
        delay={0}
        useSpring={true}
      />
    </AbsoluteFill>
  );
};
