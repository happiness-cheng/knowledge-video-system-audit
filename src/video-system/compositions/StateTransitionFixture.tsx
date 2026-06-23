/**
 * StateTransitionFixture
 *
 * 用于验证“未入职 -> 读手册 -> 已入职”的状态转换。
 */

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { BackgroundLayer } from "../components/BackgroundLayer";
import { StateTransition } from "../components/visual/StateTransition";
import { getTheme } from "../themes";

export const STATE_TRANSITION_FIXTURE_FRAMES = 160;

export const StateTransitionFixture: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = getTheme("xhs-white-editorial");

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: theme.background,
        fontFamily: theme.fontFamily,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <BackgroundLayer theme={theme} mode="grid" sectionNumber="05" />
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
      <StateTransition
        frame={frame}
        fps={fps}
        theme={theme}
        title="先读手册，再进入任务"
        beforeLabel="新会话"
        beforeStatus="未入职"
        afterLabel="新会话"
        afterStatus="已入职"
        manualTitle="CLAUDE.md"
        rules={["项目背景", "目录职责", "禁改区域", "验证方式"]}
      />
    </div>
  );
};
