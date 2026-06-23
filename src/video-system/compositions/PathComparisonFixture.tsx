/**
 * PathComparisonFixture
 *
 * 用于验证“同一任务：先绕路、再直达”的路径对比组件。
 */

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { BackgroundLayer } from "../components/BackgroundLayer";
import { PathComparison } from "../components/visual/PathComparison";
import { getTheme } from "../themes";

export const PATH_COMPARISON_FIXTURE_FRAMES = 176;

export const PathComparisonFixture: React.FC = () => {
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
      <BackgroundLayer theme={theme} mode="grid" sectionNumber="07" />
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
      <PathComparison
        frame={frame}
        fps={fps}
        theme={theme}
        title="同一个任务，两条路径"
        subtitle="没有手册先摸路，有了手册直接进任务"
        startLabel="加导出功能"
        goalLabel="进入实现"
        manualLabel="CLAUDE.md"
        detourNodes={[
          { label: "重新摸结构", detail: "先找代码在哪" },
          { label: "误判目录", detail: "把职责看错" },
          { label: "反复确认", detail: "重复解释背景" },
        ]}
        conclusion="路径变短，沟通成本下降"
      />
    </div>
  );
};
