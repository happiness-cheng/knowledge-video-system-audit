/**
 * MapLightUpFixture
 *
 * 用于验证“项目地图点亮 + 禁改区域上锁”的视觉表达。
 */

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { BackgroundLayer } from "../components/BackgroundLayer";
import { MapLightUp } from "../components/visual/MapLightUp";
import { getTheme } from "../themes";

export const MAP_LIGHT_UP_FIXTURE_FRAMES = 176;

export const MapLightUpFixture: React.FC = () => {
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
      <BackgroundLayer theme={theme} mode="grid" sectionNumber="06" />
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
      <MapLightUp
        frame={frame}
        fps={fps}
        theme={theme}
        title="CLAUDE.md 点亮地图，但不替你踩刹车"
        manualTitle="CLAUDE.md"
        mapNodes={[
          { label: "项目规则", detail: "知道按哪套约定写" },
          { label: "目录职责", detail: "知道应该改哪里" },
          { label: "验证路线", detail: "知道交付前怎么查" },
        ]}
        lockZones={[
          { label: "删除文件", detail: "先确认，再执行" },
          { label: "改密钥", detail: "敏感字段不可擅动" },
          { label: "危险 git", detail: "reset / force push 拦截" },
        ]}
      />
    </div>
  );
};
