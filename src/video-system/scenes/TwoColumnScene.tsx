/**
 * 双栏场景
 *
 * 左右信息并列：观点+例子、问题+原因、旧方式+新方式。
 */

import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  interpolate,
} from "remotion";
import type { VideoTheme } from "../themes/types";
import { fadeSlideIn, progressiveReveal } from "../utils/animation";
import { Card } from "../components/Card";
import type { LayoutMode } from "../utils/useLayoutConfig";
import { useLayoutConfig } from "../utils/useLayoutConfig";
import type { PresentationMode } from "../themes/types";
import { EvidenceBlock } from "../components/EvidenceBlock";
import type { HighlightBoxConfig } from "../components/HighlightBox";
import { directorCuesDraft } from "../data/directorCuesDraft";
import {
  resolveActiveTarget,
  getSpotlightVisualState,
} from "../utils/directorCue";
import { SpotlightCue } from "../components/visual/SpotlightCue";
import { ConfusedToGuided } from "../components/visual/ConfusedToGuided";

/** lab-mistake 标题子组件（Sequence 内调用 useCurrentFrame） */
const LabTitle: React.FC<{
  title: string;
  theme: VideoTheme;
  titleScale: number;
  sectionGap: number;
}> = ({ title, theme, titleScale, sectionGap }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = fadeSlideIn({ frame, fps });
  return (
    <h2
      style={{
        fontSize: Math.max(theme.titleStyle.fontSize * 0.88, 88) * titleScale,
        fontWeight: theme.titleStyle.fontWeight,
        color: theme.primaryText,
        marginBottom: sectionGap,
        opacity: anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
      }}
    >
      {title}
    </h2>
  );
};

/** lab-mistake 左栏子组件（用户提问框） */
const LabLeftCard: React.FC<{
  leftTitle: string;
  leftItems: string[];
  theme: VideoTheme;
}> = ({ leftTitle, leftItems, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardAnim = fadeSlideIn({ frame, fps });
  return (
    <div
      style={{
        opacity: cardAnim.opacity,
        transform: `translateY(${cardAnim.translateY}px)`,
        background: theme.softColors?.orange ?? "#FFF8F0",
        border: `2px solid ${theme.warning}`,
        borderRadius: 16,
        padding: "24px 28px",
      }}
    >
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: theme.warning,
          marginBottom: 12,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {leftTitle}
      </div>
      {leftItems.slice(0, 3).map((item, i) => {
        const anim = progressiveReveal({
          frame,
          fps,
          index: i,
          total: Math.min(leftItems.length, 3),
          staggerDelay: 8,
        });
        return (
          <div
            key={i}
            style={{
              fontSize: 44,
              fontWeight: 700,
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
    </div>
  );
};

/** lab-mistake 右栏子组件（AI 反应框） */
const LabRightCard: React.FC<{
  rightTitle: string;
  rightItems: string[];
  theme: VideoTheme;
}> = ({ rightTitle, rightItems, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardAnim = fadeSlideIn({ frame, fps });
  return (
    <div
      style={{
        opacity: cardAnim.opacity,
        transform: `translateY(${cardAnim.translateY}px)`,
        background: theme.softColors?.blue ?? "#F0F8FF",
        border: `2px solid ${theme.accentColor}`,
        borderRadius: 16,
        padding: "24px 28px",
      }}
    >
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: theme.accentColor,
          marginBottom: 12,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {rightTitle}
      </div>
      {rightItems.slice(0, 3).map((item, i) => {
        const anim = progressiveReveal({
          frame,
          fps,
          index: i,
          total: Math.min(rightItems.length, 3),
          staggerDelay: 8,
        });
        return (
          <div
            key={i}
            style={{
              fontSize: 42,
              fontWeight: 600,
              color: theme.secondaryText,
              padding: "6px 0",
              opacity: anim.opacity,
              transform: `translateY(${anim.translateY}px)`,
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};

interface AssetLayoutSide {
  assetId: string;
  label: string;
  caption: string;
  highlight?: HighlightBoxConfig[];
  imageObjectPosition?: string;
  imageTranslateY?: number;
}

export interface TwoColumnSceneData {
  type: "two-column";
  id?: string;
  semanticPattern?: "confused-to-guided";
  title: string;
  leftTitle: string;
  leftItems: string[];
  rightTitle: string;
  rightItems: string[];
  resultSubtitle?: string;
  keywords?: string[];
  animation?: string;
  visualRole?: string;
  assetLayout?: {
    placement: string;
    left: AssetLayoutSide;
    right: AssetLayoutSide;
    animation?: string;
  };
}

export const TwoColumnScene: React.FC<{
  scene: TwoColumnSceneData;
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
  const isLabMistake = isLab && scene.visualRole === "conflict";

  if (scene.semanticPattern === "confused-to-guided") {
    return (
      <ConfusedToGuided
        frame={frame}
        theme={theme}
        title={scene.title}
        confusionItems={scene.leftItems}
        guideSteps={scene.rightItems}
        resultTitle={scene.rightTitle}
        resultSubtitle={scene.resultSubtitle}
      />
    );
  }

  // lab-mistake 模式：标题→左卡→右卡，逐步出现
  const titleDelay = 0;
  const leftDelay = isLabMistake ? 10 : 8;
  const rightDelay = isLabMistake ? 20 : 14;

  const titleAnim = fadeSlideIn({ frame, fps, delay: titleDelay });
  const leftAnim = fadeSlideIn({ frame, fps, delay: leftDelay });
  const rightAnim = fadeSlideIn({ frame, fps, delay: rightDelay });
  const hasAssets = !!scene.assetLayout;
  const assetHandoffStart = Math.max(72, Math.round(totalFrames * 0.46));
  const assetHandoffEnd = assetHandoffStart + 28;
  const assetLeftFocus = interpolate(
    frame,
    [12, 36, assetHandoffStart, assetHandoffEnd],
    [0, 1, 1, 0.66],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const assetRightFocus = interpolate(
    frame,
    [0, assetHandoffStart, assetHandoffEnd],
    [0.58, 0.58, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Director cue active 叠加层（仅 visualRole=conflict 且有 cue 数据时启用）
  const cueData = scene.id ? directorCuesDraft[scene.id] : undefined;
  const useCueActive =
    scene.visualRole === "conflict" && !!cueData && !hasAssets;
  const cueState = useCueActive ? resolveActiveTarget(frame, cueData!) : null;
  const leftVisual = cueState
    ? getSpotlightVisualState(
        "left",
        cueState.activeTarget,
        cueState.targetOpacity,
        "strict-switch",
      )
    : null;
  const rightVisual = cueState
    ? getSpotlightVisualState(
        "right",
        cueState.activeTarget,
        cueState.targetOpacity,
        "strict-switch",
      )
    : null;

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
        padding: isLabMistake ? "56px 48px 40px" : lc.padding,
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

      {isLabMistake ? (
        <Sequence from={0} layout="none">
          <LabTitle
            title={scene.title}
            theme={theme}
            titleScale={lc.titleScale}
            sectionGap={lc.sectionGap}
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

      {/* 截图证据模式：assetLayout 存在时用 EvidenceBlock 展示 */}
      {hasAssets ? (
        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          <EvidenceBlock
            theme={theme}
            label={scene.leftTitle}
            conclusion={scene.assetLayout!.left.caption}
            assetId={scene.assetLayout!.left.assetId}
            highlights={scene.assetLayout!.left.highlight}
            imageObjectPosition={scene.assetLayout!.left.imageObjectPosition}
            imageTranslateY={scene.assetLayout!.left.imageTranslateY}
            focusProgress={assetLeftFocus}
            focusTone="warning"
          />
          <EvidenceBlock
            theme={theme}
            label={scene.rightTitle}
            conclusion={scene.assetLayout!.right.caption}
            assetId={scene.assetLayout!.right.assetId}
            highlights={scene.assetLayout!.right.highlight}
            imageObjectPosition={scene.assetLayout!.right.imageObjectPosition}
            imageTranslateY={scene.assetLayout!.right.imageTranslateY}
            focusProgress={assetRightFocus}
            focusTone="accent"
          />
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: isLabMistake ? 24 : lc.sectionGap,
          }}
        >
          {/* 左栏 */}
          {isLabMistake ? (
            <Sequence from={10} layout="none">
              <SpotlightCue
                visual={leftVisual}
                accentColor={theme.danger}
                tintColor={theme.warning}
                style={{
                  transform: leftVisual
                    ? `scale(${leftVisual.scale}) translateY(${leftVisual.translateY}px)`
                    : undefined,
                }}
              >
                <LabLeftCard
                  leftTitle={scene.leftTitle}
                  leftItems={scene.leftItems}
                  theme={theme}
                />
              </SpotlightCue>
            </Sequence>
          ) : (
            <SpotlightCue
              visual={leftVisual}
              accentColor={theme.danger}
              tintColor={theme.warning}
              showChip
              style={{
                opacity: leftVisual
                  ? leftAnim.opacity * leftVisual.cardOpacity
                  : leftAnim.opacity,
                transform: leftVisual
                  ? `translateY(${leftAnim.translateY + leftVisual.translateY}px) scale(${leftVisual.scale})`
                  : `translateY(${leftAnim.translateY}px)`,
              }}
            >
              <Card theme={theme} accent={theme.danger}>
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 800,
                    color: leftVisual
                      ? leftVisual.titleOpacity > 0.7
                        ? theme.danger
                        : theme.secondaryText
                      : theme.danger,
                    marginBottom: 14,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    opacity: leftVisual ? leftVisual.titleOpacity : 1,
                  }}
                >
                  {scene.leftTitle}
                </div>
                {scene.leftItems.slice(0, 3).map((item, i) => {
                  const anim = progressiveReveal({
                    frame,
                    fps,
                    index: i,
                    total: Math.min(scene.leftItems.length, 3),
                    staggerDelay: 8,
                  });
                  return (
                    <div
                      key={i}
                      style={{
                        fontSize: 42,
                        fontWeight: 600,
                        color: theme.primaryText,
                        padding: "8px 0",
                        opacity:
                          anim.opacity *
                          (leftVisual ? leftVisual.textOpacity : 1),
                        transform: `translateY(${anim.translateY}px)`,
                      }}
                    >
                      {item}
                    </div>
                  );
                })}
              </Card>
            </SpotlightCue>
          )}

          {/* 右栏 */}
          {isLabMistake ? (
            <Sequence from={20} layout="none">
              <SpotlightCue
                visual={rightVisual}
                accentColor={theme.accentColor}
                style={{
                  transform: rightVisual
                    ? `scale(${rightVisual.scale}) translateY(${rightVisual.translateY}px)`
                    : undefined,
                }}
              >
                <LabRightCard
                  rightTitle={scene.rightTitle}
                  rightItems={scene.rightItems}
                  theme={theme}
                />
              </SpotlightCue>
            </Sequence>
          ) : (
            <SpotlightCue
              visual={rightVisual}
              accentColor={theme.accentColor}
              showChip
              style={{
                opacity: rightVisual
                  ? rightAnim.opacity * rightVisual.cardOpacity
                  : rightAnim.opacity,
                transform: rightVisual
                  ? `translateY(${rightAnim.translateY + rightVisual.translateY}px) scale(${rightVisual.scale})`
                  : `translateY(${rightAnim.translateY}px)`,
              }}
            >
              <Card theme={theme} accent={theme.success}>
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 800,
                    color: rightVisual
                      ? rightVisual.titleOpacity > 0.7
                        ? theme.success
                        : theme.secondaryText
                      : theme.success,
                    marginBottom: 14,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    opacity: rightVisual ? rightVisual.titleOpacity : 1,
                  }}
                >
                  {scene.rightTitle}
                </div>
                {scene.rightItems.slice(0, 3).map((item, i) => {
                  const anim = progressiveReveal({
                    frame,
                    fps,
                    index: i,
                    total: Math.min(scene.rightItems.length, 3),
                    staggerDelay: 8,
                  });
                  return (
                    <div
                      key={i}
                      style={{
                        fontSize: 42,
                        fontWeight: 600,
                        color: theme.primaryText,
                        padding: "8px 0",
                        opacity:
                          anim.opacity *
                          (rightVisual ? rightVisual.textOpacity : 1),
                        transform: `translateY(${anim.translateY}px)`,
                      }}
                    >
                      {item}
                    </div>
                  );
                })}
              </Card>
            </SpotlightCue>
          )}
        </div>
      )}

    </div>
  );
};
