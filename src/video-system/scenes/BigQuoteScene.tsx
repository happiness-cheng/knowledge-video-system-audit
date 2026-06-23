/**
 * 大引言场景
 *
 * 居中大字引言 + 副标题说明。
 * 使用 Sequence 内部时间轴：引言 from=0，副标题 from=12。
 */

import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  interpolate,
} from "remotion";
import type { VideoTheme } from "../themes/types";
import { fadeSlideIn } from "../utils/animation";
import { BackgroundLayer } from "../components/BackgroundLayer";
import { SafeTitleText } from "../components/SafeTitleText";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";
import type { PresentationMode } from "../themes/types";
import { MotionBox } from "../components/motion/MotionBox";
import { MotionText } from "../components/motion/MotionText";
import { OperationTrace } from "../components/human/OperationTrace";
import { StrikeAndReplace } from "../components/visual/StrikeAndReplace";
import { MapLightUp } from "../components/visual/MapLightUp";

export interface BigQuoteSceneData {
  id?: string;
  type: "big-quote";
  semanticPattern?: "wrong-to-correct";
  quote: string;
  subtitle?: string;
  wrongText?: string;
  leadText?: string;
  replacementText?: string;
  keywords?: string[];
  animation?: string;
  visualRole?: string;
}

const isContextBoundaryMapScene = (scene: BigQuoteSceneData) =>
  scene.quote.includes("CLAUDE.md 是上下文") &&
  scene.quote.includes("不是保险丝");

const getWrongToCorrectCopy = (scene: BigQuoteSceneData) => {
  const lines = scene.quote
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const wrongFromQuote = lines[0]?.replace(/^不是/, "") || "错误判断";
  const replacementFromQuote =
    lines[lines.length - 1]?.replace(/^是/, "") || "正确判断";

  return {
    wrongText: scene.wrongText ?? wrongFromQuote,
    leadText: scene.leadText ?? "是",
    replacementText: scene.replacementText ?? replacementFromQuote,
  };
};

/** 引言内容子组件（Sequence 内调用 useCurrentFrame） */
const QuoteContent: React.FC<{
  scene: BigQuoteSceneData;
  theme: VideoTheme;
  isLabInsight: boolean;
  labQuoteSize: number;
  labMaxWidth: number;
  localFrame: number;
}> = ({ scene, theme, isLabInsight, labQuoteSize, labMaxWidth, localFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlideIn({ frame, fps, delay: 0 });
  const focusScale = isLabInsight
    ? interpolate(Math.sin(frame * 0.035), [-1, 1], [1, 1.01])
    : 1;
  const isMemoryReframe =
    scene.quote.includes("不是记忆问题") && scene.quote.includes("入职问题");
  const isWrongToCorrect = scene.semanticPattern === "wrong-to-correct";
  const isContextBoundaryMap = isContextBoundaryMapScene(scene);

  if (isWrongToCorrect || isMemoryReframe) {
    const copy = getWrongToCorrectCopy(scene);
    return (
      <StrikeAndReplace
        frame={localFrame}
        wrongText={copy.wrongText}
        leadText={copy.leadText}
        replacementText={copy.replacementText}
        theme={theme}
      />
    );
  }

  if (isContextBoundaryMap) {
    return (
      <MapLightUp
        frame={localFrame}
        fps={fps}
        theme={theme}
        title="CLAUDE.md 是上下文，不是保险丝"
        manualTitle="CLAUDE.md"
        mapNodes={[
          { label: "项目规则", detail: "告诉它该按什么做" },
          { label: "目录职责", detail: "提醒应该改哪里" },
          { label: "验证路线", detail: "提醒交付前怎么查" },
        ]}
        lockZones={[
          { label: "删除文件", detail: "先确认，再执行" },
          { label: "改密钥", detail: "敏感字段不可擅动" },
          { label: "危险 git", detail: "reset / force push 拦截" },
        ]}
      />
    );
  }

  if (isLabInsight) {
    return (
      <MotionBox
        progress={anim.opacity}
        translateY={anim.translateY}
        scaleFrom={0.99}
        scaleTo={focusScale}
        style={{
          textAlign: "center",
        }}
      >
        {scene.quote.split("\n").map((line, i, arr) => {
          const isLast = i === arr.length - 1;
          return (
            <div
              key={i}
              style={{
                fontSize: isLast ? labQuoteSize * 1.2 : labQuoteSize * 0.85,
                fontWeight: isLast ? 900 : 700,
                lineHeight: 1.1,
                background: theme.accentGradient,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                maxWidth: labMaxWidth,
                margin: "0 auto",
                opacity: isLast ? 1 : 0.75,
                overflow: "visible",
                paddingBottom: isLast ? 8 : 0,
                whiteSpace: "nowrap",
                display: "inline-block",
              }}
            >
              {line}
            </div>
          );
        })}
      </MotionBox>
    );
  }

  return (
    <MotionBox
      progress={anim.opacity}
      translateY={anim.translateY}
      scaleFrom={0.99}
      scaleTo={1}
      style={{
        fontSize: labQuoteSize,
        fontWeight: 800,
        lineHeight: 1.15,
        background: theme.accentGradient,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        maxWidth: labMaxWidth,
        overflow: "visible",
        paddingBottom: 8,
      }}
    >
      <SafeTitleText text={scene.quote} maxCharsPerLine={14} />
    </MotionBox>
  );
};

/** 副标题子组件（Sequence 内调用 useCurrentFrame） */
const SubtitleContent: React.FC<{
  subtitle: string;
  theme: VideoTheme;
  isLabInsight: boolean;
  sectionGap: number;
}> = ({ subtitle, theme, isLabInsight, sectionGap }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlideIn({ frame, fps, delay: 0 });
  return (
    <p
      style={{
        ...theme.subtitleStyle,
        fontSize: isLabInsight ? 30 : theme.subtitleStyle.fontSize,
        color: theme.secondaryText,
        marginTop: isLabInsight ? 16 : sectionGap + 4,
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
      }}
    >
      <MotionText text={subtitle} mode="word" stagger={3} />
    </p>
  );
};

export const BigQuoteScene: React.FC<{
  scene: BigQuoteSceneData;
  theme: VideoTheme;
  totalFrames: number;
  sceneStartFrame?: number;
  layout?: LayoutMode;
  presentationMode?: PresentationMode;
}> = ({
  scene,
  theme,
  sceneStartFrame = 0,
  layout = "landscape",
  presentationMode = "default",
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame;
  const lc = useLayoutConfig(layout);
  const isLab = presentationMode === "knowledge-lab";
  const isLabInsight =
    isLab && (scene.visualRole === "insight" || scene.visualRole === "recap");
  const isContextBoundaryMap = isContextBoundaryMapScene(scene);

  // 实验台模式：引言更大、更强，无引号装饰
  const labQuoteSize = isLabInsight ? 96 : 84;
  const labMaxWidth = isLabInsight ? 900 : 1000;

  // S05 实验结论标签 breathing
  const labelScale = isLabInsight
    ? interpolate(Math.sin(frame * 0.04), [-1, 1], [1.0, 1.006])
    : 1;
  const labelOpacity = isLabInsight
    ? interpolate(Math.sin(frame * 0.04), [-1, 1], [0.97, 1.0])
    : 1;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: theme.background,
        fontFamily: theme.fontFamily,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: isContextBoundaryMap
          ? "34px 44px 34px"
          : isLabInsight
            ? "56px 48px 40px"
            : lc.padding,
        textAlign: "center",
      }}
    >
      <BackgroundLayer
        theme={theme}
        mode="glow"
        frame={frame}
        enableDrift={isLabInsight}
      />

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

      {/* 引号装饰：实验台模式下去掉 */}
      {!isLabInsight && (
        <div
          style={{
            fontSize: 160,
            fontWeight: 900,
            color: theme.accentColor,
            opacity: 0.15,
            lineHeight: 0.8,
            marginBottom: -30,
          }}
        >
          "
        </div>
      )}

      {/* 实验结论标签：仅 lab-insight 模式，极轻 breathing */}
      {isLabInsight && !isContextBoundaryMap && (
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: theme.accentColor,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 20,
            fontFamily: theme.fontFamily,
            transform: `scale(${labelScale})`,
            opacity: labelOpacity,
          }}
        >
          实验结论
        </div>
      )}

      {isLabInsight && !isContextBoundaryMap && (
        <OperationTrace
          theme={theme}
          label="判断落点"
          x={132}
          y={112}
          delay={16}
          tone="success"
        />
      )}

      {/* 引言：Sequence from=0 */}
      <Sequence from={0} layout="none">
        <QuoteContent
          scene={scene}
          theme={theme}
          isLabInsight={isLabInsight}
          labQuoteSize={labQuoteSize}
          labMaxWidth={labMaxWidth}
          localFrame={localFrame}
        />
      </Sequence>

      {/* 副标题：Sequence from=12 */}
      {scene.subtitle && !isContextBoundaryMap && (
        <Sequence from={12} layout="none">
          <SubtitleContent
            subtitle={scene.subtitle}
            theme={theme}
            isLabInsight={isLabInsight}
            sectionGap={lc.sectionGap}
          />
        </Sequence>
      )}
    </div>
  );
};
