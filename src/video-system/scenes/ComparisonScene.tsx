/**
 * 对比场景
 *
 * 标题 + 左右两栏对比。
 * 支持图片素材模式：当 assetLayout 存在时，每栏上方显示截图。
 */

import React from "react";
import {
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import type { VideoTheme } from "../themes/types";
import { fadeSlideIn, progressiveReveal } from "../utils/animation";
import { Card } from "../components/Card";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";
import type { PresentationMode } from "../themes/types";
import { EvidenceBlock } from "../components/EvidenceBlock";
import { assetIdToProcessedPath } from "../utils/mediaPaths";
import { SafeTitleText } from "../components/SafeTitleText";

/** lab-evidence 标题子组件（Sequence 内调用 useCurrentFrame） */
const LabEvidenceTitle: React.FC<{
  title: string;
  theme: VideoTheme;
  titleScale: number;
  isLabEvidence: boolean;
}> = ({ title, theme, titleScale, isLabEvidence }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlideIn({ frame, fps });
  return (
    <h2
      style={{
        fontSize: Math.max(theme.titleStyle.fontSize * 0.88, 88) * titleScale,
        fontWeight: theme.titleStyle.fontWeight,
        color: theme.primaryText,
        marginBottom: isLabEvidence ? 16 : 24,
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
      }}
    >
      {title}
    </h2>
  );
};

/** lab-evidence 文字栏子组件（Sequence 内调用 useCurrentFrame） */
const SequenceTextColumn: React.FC<{
  accent: string;
  title: string;
  items: string[];
  theme: VideoTheme;
  focusProgress?: number;
}> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <TextColumn {...props} frame={frame} fps={fps} delay={0} />;
};

interface AssetHighlight {
  top: number;
  left: number;
  width: number;
  height: number;
  color?: string;
  label?: string;
}

interface AssetLayoutSide {
  assetId: string;
  label: string;
  caption: string;
  highlight?: AssetHighlight[];
}

export interface ComparisonSceneData {
  type: "comparison";
  id?: string;
  semanticPattern?: "detour-vs-direct-path";
  pathVariant?: "detour" | "direct";
  title: string;
  leftTitle: string;
  leftItems: string[];
  rightTitle: string;
  rightItems: string[];
  keywords?: string[];
  animation?: string;
  visualRole?: string;
  assetLayout?: {
    placement: string;
    left: AssetLayoutSide;
    right: AssetLayoutSide;
    animation?: string;
    highlight?: string[];
  };
}

/** 图片素材子组件 */
const AssetColumn: React.FC<{
  side: AssetLayoutSide;
  accent: string;
  title: string;
  items: string[];
  theme: VideoTheme;
  frame: number;
  fps: number;
  delay: number;
  focusProgress?: number;
}> = ({
  side,
  accent,
  title,
  items,
  theme,
  frame,
  fps,
  delay,
  focusProgress = 1,
}) => {
  const cardAnim = fadeSlideIn({ frame, fps, delay });
  const imagePath = staticFile(assetIdToProcessedPath(side.assetId));
  const focus = Math.max(0, Math.min(1, focusProgress));
  const focusScale = interpolate(focus, [0, 1], [0.985, 1]);
  const focusOpacity = interpolate(focus, [0, 1], [0.66, 1]);

  return (
    <div
      style={{
        position: "relative",
        opacity: cardAnim.opacity * focusOpacity,
        transform: `translateY(${cardAnim.translateY}px) scale(${focusScale})`,
      }}
    >
      <Card theme={theme} accent={accent}>
        <div
          style={{
            fontSize: 38,
            fontWeight: 800,
            color: accent,
            marginBottom: 10,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            borderRadius: 8,
            overflow: "hidden",
            marginBottom: 10,
            border: `1px solid ${theme.cardBorder}`,
          }}
        >
          <Img
            src={imagePath}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: theme.secondaryText,
            marginBottom: 8,
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          <SafeTitleText text={side.caption} maxCharsPerLine={16} />
        </div>
        {items.map((item, i) => {
          const anim = progressiveReveal({
            frame,
            fps,
            index: i,
            total: items.length,
            staggerDelay: 8,
          });
          return (
            <div
              key={i}
              style={{
                fontSize: 38,
                fontWeight: 600,
                color: theme.primaryText,
                padding: "6px 0",
                opacity: anim.opacity,
                transform: `translateY(${anim.translateY}px)`,
              }}
            >
              {item}
            </div>
          );
        })}
      </Card>
    </div>
  );
};

/** 纯文字子组件 */
const TextColumn: React.FC<{
  accent: string;
  title: string;
  items: string[];
  theme: VideoTheme;
  frame: number;
  fps: number;
  delay: number;
  focusProgress?: number;
}> = ({
  accent,
  title,
  items,
  theme,
  frame,
  fps,
  delay,
  focusProgress = 1,
}) => {
  const cardAnim = fadeSlideIn({ frame, fps, delay });
  const focus = Math.max(0, Math.min(1, focusProgress));
  const focusScale = interpolate(focus, [0, 1], [0.985, 1]);
  const focusOpacity = interpolate(focus, [0, 1], [0.66, 1]);

  return (
    <div
      style={{
        position: "relative",
        opacity: cardAnim.opacity * focusOpacity,
        transform: `translateY(${cardAnim.translateY}px) scale(${focusScale})`,
      }}
    >
      <Card theme={theme} accent={accent}>
        <div
          style={{
            fontSize: 38,
            fontWeight: 800,
            color: accent,
            marginBottom: 14,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {title}
        </div>
        {items.map((item, i) => {
          const anim = progressiveReveal({
            frame,
            fps,
            index: i,
            total: items.length,
            staggerDelay: 8,
          });
          return (
            <div
              key={i}
              style={{
                fontSize: 40,
                fontWeight: 600,
                color: theme.primaryText,
                padding: "8px 0",
                opacity: anim.opacity,
                transform: `translateY(${anim.translateY}px)`,
              }}
            >
              {item}
            </div>
          );
        })}
      </Card>
    </div>
  );
};

export const ComparisonScene: React.FC<{
  scene: ComparisonSceneData;
  theme: VideoTheme;
  totalFrames: number;
  layout?: LayoutMode;
  presentationMode?: PresentationMode;
}> = ({
  scene,
  theme,
  totalFrames,
  layout = "landscape",
  presentationMode = "default",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lc = useLayoutConfig(layout);
  const isLab = presentationMode === "knowledge-lab";
  const isLabEvidence = isLab && scene.visualRole === "evidence";

  // lab-evidence 模式：标题→大结论→左→右，逐步出现
  const titleDelay = 0;
  const leftDelay = isLabEvidence ? 18 : 8;
  const rightDelay = isLabEvidence ? 26 : 14;

  const titleAnim = fadeSlideIn({ frame, fps, delay: titleDelay });
  const hasAssets = !!scene.assetLayout;
  const leftAccent = theme.danger;
  const rightAccent = theme.success;
  const handoffStart = Math.max(72, Math.round(totalFrames * 0.46));
  const handoffEnd = handoffStart + 28;
  const leftFocus = interpolate(
    frame,
    [12, 36, handoffStart, handoffEnd],
    [0, 1, 1, 0.66],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const rightFocus = interpolate(
    frame,
    [0, handoffStart, handoffEnd],
    [0.58, 0.58, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // 字幕安全区：底部预留空间
  const subtitleSafeBottom = 150;

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
        padding: isLabEvidence
          ? `56px 48px ${subtitleSafeBottom}px`
          : lc.padding,
      }}
    >
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

      {/* 主标题 */}
      {isLabEvidence ? (
        <Sequence from={0} layout="none">
          <LabEvidenceTitle
            title={scene.title}
            theme={theme}
            titleScale={lc.titleScale}
            isLabEvidence={isLabEvidence}
          />
        </Sequence>
      ) : (
        <h2
          style={{
            fontSize:
              Math.max(theme.titleStyle.fontSize * 0.88, 88) * lc.titleScale,
            fontWeight: theme.titleStyle.fontWeight,
            color: theme.primaryText,
            marginBottom: lc.sectionGap,
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.translateY}px)`,
          }}
        >
          {scene.title}
        </h2>
      )}

      {/* 小标签：同题对比（原 keywords[0]，从大结论降级为小说明） */}
      {isLabEvidence && scene.keywords && scene.keywords.length > 0 && (
        <Sequence from={8} layout="none">
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              color: theme.secondaryText,
              textAlign: "center",
              marginBottom: 12,
              opacity: fadeSlideIn({ frame, fps, delay: 8 }).opacity,
              transform: `translateY(${fadeSlideIn({ frame, fps, delay: 8 }).translateY}px)`,
            }}
          >
            {scene.keywords[0]}
          </div>
        </Sequence>
      )}

      {/* lab-evidence 模式：使用 EvidenceBlock 展示截图证据 */}
      {isLabEvidence && hasAssets ? (
        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: lc.gridColumns.two,
            gap: 20,
            flex: 1,
            minHeight: 0,
          }}
        >
          <EvidenceBlock
            theme={theme}
            label={scene.leftTitle}
            conclusion={scene.assetLayout!.left.caption}
            assetId={scene.assetLayout!.left.assetId}
            highlights={scene.assetLayout!.left.highlight}
            focusProgress={leftFocus}
            focusTone="danger"
          />
          <EvidenceBlock
            theme={theme}
            label={scene.rightTitle}
            conclusion={scene.assetLayout!.right.caption}
            assetId={scene.assetLayout!.right.assetId}
            highlights={scene.assetLayout!.right.highlight}
            focusProgress={rightFocus}
            focusTone="success"
          />
        </div>
      ) : isLabEvidence ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: lc.gridColumns.two,
            gap: 20,
          }}
        >
          <Sequence from={18} layout="none">
            <SequenceTextColumn
              accent={leftAccent}
              title={scene.leftTitle}
              items={scene.leftItems}
              theme={theme}
              focusProgress={leftFocus}
            />
          </Sequence>
          <Sequence from={26} layout="none">
            <SequenceTextColumn
              accent={rightAccent}
              title={scene.rightTitle}
              items={scene.rightItems}
              theme={theme}
              focusProgress={rightFocus}
            />
          </Sequence>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: lc.gridColumns.two,
            gap: lc.sectionGap,
          }}
        >
          {hasAssets ? (
            <>
              <AssetColumn
                side={scene.assetLayout!.left}
                accent={leftAccent}
                title={scene.leftTitle}
                items={scene.leftItems}
                theme={theme}
                frame={frame}
                fps={fps}
                delay={8}
                focusProgress={leftFocus}
              />
              <AssetColumn
                side={scene.assetLayout!.right}
                accent={rightAccent}
                title={scene.rightTitle}
                items={scene.rightItems}
                theme={theme}
                frame={frame}
                fps={fps}
                delay={14}
                focusProgress={rightFocus}
              />
            </>
          ) : (
            <>
              <TextColumn
                accent={leftAccent}
                title={scene.leftTitle}
                items={scene.leftItems}
                theme={theme}
                frame={frame}
                fps={fps}
                delay={8}
                focusProgress={leftFocus}
              />
              <TextColumn
                accent={rightAccent}
                title={scene.rightTitle}
                items={scene.rightItems}
                theme={theme}
                frame={frame}
                fps={fps}
                delay={14}
                focusProgress={rightFocus}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
