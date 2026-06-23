/**
 * CoverComposition — 静态封面渲染
 *
 * 读取 coverSpec.json，用主题系统渲染单帧封面 PNG。
 * 支持 3:4 竖版和 4:3 横版两种构图。
 * 品牌角标（badge）和品牌水印在顶部。
 *
 * CoverComposition 字段状态
 *
 * LIVE（代码读取，影响渲染）：
 * - theme, title, subtitle, badge, brandName
 * - character.show, character.assetId, character.placement
 * - template（布局分支：big-title / big-title-character / split-left-right）
 * - cards[].text
 * - layout.titleFontSize, layout.subtitleFontSize
 * - colors.accentOverride, colors.highlightText, colors.highlightColor
 * - variants["3x4"].titleFontSize, variants["4x3"].titleFontSize
 *
 * METADATA ONLY（策划字段，代码不读取）：
 * - keywords, coverType
 * - character.pose
 * - decorations
 * - image2Needed（仅 validate 脚本使用）
 * - layout.titlePosition, layout.keywordFontSize, layout.badgePosition
 * - colors.titleColor
 * - variants.*.size, variants.*.layoutMode
 */

import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { getTheme } from "../themes";
import type { VideoTheme } from "../themes/types";
import { SafeTitleText } from "../components/SafeTitleText";
import { assetIdToProcessedPath } from "../utils/mediaPaths";

// 导入封面规格数据
import coverSpec from "../data/coverSpec.json";

// ─── 类型定义 ─────────────────────────────────────

type CoverTemplate = "big-title" | "big-title-character" | "split-left-right";
type CharacterPlacement = "left" | "right" | "center";

interface CoverSpec {
  theme: string;
  template: string;
  title: string;
  subtitle: string;
  keywords: string[];
  coverType: string;
  badge: string;
  brandName: string;
  character: {
    show: boolean;
    assetId: string | null;
    placement: string;
    pose: string;
  };
  decorations: Array<{
    type: string;
    assetId: string;
    position: string;
    size: number;
  }>;
  cards: Array<{
    text: string;
    style: string;
    position: string;
  }>;
  image2Needed: boolean;
  layout: {
    titlePosition: string;
    titleFontSize: number;
    subtitleFontSize: number;
    keywordFontSize: number;
    badgePosition: string;
  };
  colors: {
    titleColor: string | null;
    accentOverride: string | null;
    highlightText?: string;
    highlightColor?: string;
  };
  variants?: {
    "3x4"?: { titleFontSize?: number };
    "4x3"?: { titleFontSize?: number };
  };
}

export interface CoverProps {
  aspectRatio?: "3:4" | "4:3";
}

const spec = coverSpec as unknown as CoverSpec;

// ─── 角标组件 ─────────────────────────────────────

const Badge: React.FC<{
  badge: string;
  theme: VideoTheme;
  left: number;
  top: number;
}> = ({ badge, theme, left, top }) => (
  <div
    style={{
      position: "absolute",
      top,
      left,
      padding: "6px 16px",
      borderRadius: 6,
      background: theme.cardBackground,
      border: theme.cardBorder,
      fontFamily: theme.monoFont,
      fontSize: 22,
      fontWeight: 600,
      color: theme.secondaryText,
      letterSpacing: 1,
    }}
  >
    {badge}
  </div>
);

// ─── 品牌水印组件 ─────────────────────────────────

const BrandWatermark: React.FC<{
  brandName: string;
  theme: VideoTheme;
  right: number;
  top: number;
}> = ({ brandName, theme, right, top }) => (
  <div
    style={{
      position: "absolute",
      top,
      right,
      fontFamily: theme.fontFamily,
      fontSize: 20,
      fontWeight: 400,
      color: theme.secondaryText,
      opacity: 0.85,
    }}
  >
    {brandName}
  </div>
);

// ─── 标题渲染 ─────────────────────────────────────

const TitleBlock: React.FC<{
  spec: CoverSpec;
  theme: VideoTheme;
  fontSize: number;
  maxWidth: number;
}> = ({ spec, theme, fontSize, maxWidth }) => {
  const titleGradient = spec.colors.accentOverride ?? theme.accentGradient;
  const highlightColor = spec.colors.highlightColor ?? "#FF5C4D";
  const highlightText = spec.colors.highlightText ?? "";
  return (
    <h1
      style={{
        fontSize,
        fontWeight: theme.titleStyle.fontWeight,
        lineHeight: Math.max(Number(theme.titleStyle.lineHeight), 1.12),
        letterSpacing: theme.titleStyle.letterSpacing,
        maxWidth,
        whiteSpace: "pre-line",
        margin: 0,
        overflow: "visible",
        paddingBottom: fontSize * 0.12,
      }}
    >
      <SafeTitleText
        text={spec.title}
        maxCharsPerLine={10}
        highlightText={highlightText}
        highlightColor={highlightColor}
        gradient={titleGradient}
      />
    </h1>
  );
};

// ─── 人物图片组件 ─────────────────────────────────

const CharacterImg: React.FC<{
  assetId: string;
  maxHeight: number;
  objectPosition?: string;
}> = ({ assetId, maxHeight, objectPosition }) => (
  <Img
    src={staticFile(assetIdToProcessedPath(assetId))}
    style={{
      height: "100%",
      maxHeight,
      width: "auto",
      objectFit: "contain",
      objectPosition,
    }}
  />
);

// ─── 卡片按钮组件 ─────────────────────────────────

const CardButtons: React.FC<{
  cards: CoverSpec["cards"];
  theme: VideoTheme;
  fontSize?: number;
  paddingV?: number;
  paddingH?: number;
}> = ({ cards, theme, fontSize = 34, paddingV = 16, paddingH = 56 }) => (
  <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
    {cards.map((card, i) => (
      <div
        key={i}
        style={{
          padding: `${paddingV}px ${paddingH}px`,
          borderRadius: 16,
          background: theme.accentColor,
          color: "#fff",
          fontSize,
          fontWeight: 700,
          fontFamily: theme.fontFamily,
          letterSpacing: 1,
          boxShadow: "0 8px 24px rgba(123,97,255,0.25)",
        }}
      >
        <SafeTitleText text={card.text} maxCharsPerLine={8} />
      </div>
    ))}
  </div>
);

// ─── 副标题组件 ───────────────────────────────────

const SubtitleText: React.FC<{
  text: string;
  theme: VideoTheme;
  fontSize: number;
  maxWidth: number;
  align?: "left" | "center";
}> = ({ text, theme, fontSize, maxWidth, align = "left" }) => (
  <p
    style={{
      fontSize,
      fontWeight: theme.subtitleStyle.fontWeight,
      lineHeight: theme.subtitleStyle.lineHeight,
      color: theme.secondaryText,
      maxWidth,
      marginTop: 16,
      marginBottom: 0,
      textAlign: align,
    }}
  >
    <SafeTitleText text={text} maxCharsPerLine={18} />
  </p>
);

// ─── 模板：big-title ──────────────────────────────
// 原始布局：3:4 上标题+中人物+下按钮，4:3 左人右文

const BigTitleVertical: React.FC<{
  spec: CoverSpec;
  theme: VideoTheme;
  titleFontSize: number;
  placement: CharacterPlacement;
}> = ({ spec, theme, titleFontSize, placement }) => {
  // 3:4 竖版 placement：center 默认，left/right 通过 alignItems 控制
  const alignItems =
    placement === "left"
      ? "flex-start"
      : placement === "right"
        ? "flex-end"
        : "center";

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems,
        justifyContent: "center",
        padding: "120px 48px 60px",
        gap: 24,
      }}
    >
      <TitleBlock
        spec={spec}
        theme={theme}
        fontSize={titleFontSize}
        maxWidth={900}
      />
      {spec.subtitle && (
        <SubtitleText
          text={spec.subtitle}
          theme={theme}
          fontSize={spec.layout.subtitleFontSize + 4}
          maxWidth={800}
          align="center"
        />
      )}
      {spec.character.show && spec.character.assetId && (
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            justifyContent:
              placement === "left"
                ? "flex-start"
                : placement === "right"
                  ? "flex-end"
                  : "center",
            maxHeight: "50%",
          }}
        >
          <CharacterImg assetId={spec.character.assetId} maxHeight={680} />
        </div>
      )}
      {spec.cards.length > 0 && (
        <CardButtons cards={spec.cards} theme={theme} />
      )}
    </div>
  );
};

const BigTitleHorizontal: React.FC<{
  spec: CoverSpec;
  theme: VideoTheme;
  titleFontSize: number;
  placement: CharacterPlacement;
}> = ({ spec, theme, titleFontSize, placement }) => {
  // 4:3 横版：通过 order 控制人物左右位置
  const isCharLeft = placement !== "right";
  const charOrder = isCharLeft ? 0 : 1;
  const textOrder = isCharLeft ? 1 : 0;
  const textPaddingLeft = isCharLeft ? 60 : 40;
  const textPaddingRight = isCharLeft ? 40 : 60;
  const containerPadding = isCharLeft ? "0 60px 0 120px" : "0 120px 0 60px";

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: containerPadding,
        gap: 30,
      }}
    >
      {spec.character.show && spec.character.assetId && (
        <div
          style={{
            order: charOrder,
            flex: "0 0 auto",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            height: "100%",
            maxHeight: "78%",
            paddingBottom: 20,
          }}
        >
          <CharacterImg assetId={spec.character.assetId} maxHeight={890} />
        </div>
      )}
      <div
        style={{
          order: textOrder,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minWidth: 0,
          paddingLeft: textPaddingLeft,
          paddingRight: textPaddingRight,
        }}
      >
        <TitleBlock
          spec={spec}
          theme={theme}
          fontSize={titleFontSize}
          maxWidth={720}
        />
        {spec.subtitle && (
          <SubtitleText
            text={spec.subtitle}
            theme={theme}
            fontSize={spec.layout.subtitleFontSize}
            maxWidth={560}
          />
        )}
        {spec.cards.length > 0 && (
          <div style={{ display: "flex", gap: 16, marginTop: 48 }}>
            <CardButtons
              cards={spec.cards}
              theme={theme}
              fontSize={40}
              paddingV={20}
              paddingH={72}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ─── 模板：big-title-character ─────────────────────
// 标题最大化 + 人物突出。3:4 标题占上半、人物占下半；4:3 标题 60%、人物 40%

const BigTitleCharVertical: React.FC<{
  spec: CoverSpec;
  theme: VideoTheme;
  titleFontSize: number;
  placement: CharacterPlacement;
}> = ({ spec, theme, titleFontSize, placement }) => {
  const alignItems =
    placement === "left"
      ? "flex-start"
      : placement === "right"
        ? "flex-end"
        : "center";

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: 0,
      }}
    >
      {/* 上半部分：标题区域 */}
      <div
        style={{
          flex: "0 0 48%",
          display: "flex",
          flexDirection: "column",
          alignItems,
          justifyContent: "flex-end",
          padding: "100px 56px 20px",
          gap: 12,
        }}
      >
        <TitleBlock
          spec={spec}
          theme={theme}
          fontSize={titleFontSize}
          maxWidth={920}
        />
        {spec.subtitle && (
          <SubtitleText
            text={spec.subtitle}
            theme={theme}
            fontSize={spec.layout.subtitleFontSize + 6}
            maxWidth={840}
            align="center"
          />
        )}
      </div>
      {/* 下半部分：人物 + 按钮 */}
      <div
        style={{
          flex: "0 0 52%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 48px 40px",
          gap: 16,
        }}
      >
        {spec.character.show && spec.character.assetId && (
          <div
            style={{
              flex: "1 1 auto",
              display: "flex",
              justifyContent: "center",
              minHeight: 0,
            }}
          >
            <CharacterImg assetId={spec.character.assetId} maxHeight={760} />
          </div>
        )}
        {spec.cards.length > 0 && (
          <CardButtons cards={spec.cards} theme={theme} />
        )}
      </div>
    </div>
  );
};

const BigTitleCharHorizontal: React.FC<{
  spec: CoverSpec;
  theme: VideoTheme;
  titleFontSize: number;
  placement: CharacterPlacement;
}> = ({ spec, theme, titleFontSize, placement }) => {
  const isCharLeft = placement !== "right";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "row", padding: 0 }}>
      {/* 标题区域 60% */}
      <div
        style={{
          order: isCharLeft ? 1 : 0,
          flex: "0 0 60%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 40px 60px 100px",
          gap: 16,
        }}
      >
        <TitleBlock
          spec={spec}
          theme={theme}
          fontSize={titleFontSize}
          maxWidth={720}
        />
        {spec.subtitle && (
          <SubtitleText
            text={spec.subtitle}
            theme={theme}
            fontSize={spec.layout.subtitleFontSize}
            maxWidth={560}
          />
        )}
        {spec.cards.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <CardButtons
              cards={spec.cards}
              theme={theme}
              fontSize={40}
              paddingV={20}
              paddingH={72}
            />
          </div>
        )}
      </div>
      {/* 人物区域 40% */}
      {spec.character.show && spec.character.assetId && (
        <div
          style={{
            order: isCharLeft ? 0 : 1,
            flex: "0 0 40%",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            height: "100%",
            paddingBottom: 20,
          }}
        >
          <CharacterImg assetId={spec.character.assetId} maxHeight={920} />
        </div>
      )}
    </div>
  );
};

// ─── 模板：split-left-right ────────────────────────
// 4:3 对比型：左标题+副标题+badge，右人物全高；3:4 fallback 到 big-title-character

const SplitLeftRightHorizontal: React.FC<{
  spec: CoverSpec;
  theme: VideoTheme;
  titleFontSize: number;
  placement: CharacterPlacement;
}> = ({ spec, theme, titleFontSize, placement }) => {
  const isCharLeft = placement === "left";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "row", padding: 0 }}>
      {/* 文字区域 */}
      <div
        style={{
          order: isCharLeft ? 1 : 0,
          flex: "0 0 55%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 40px 80px 100px",
          gap: 20,
        }}
      >
        {/* 内嵌 badge */}
        <div
          style={{
            display: "inline-block",
            alignSelf: "flex-start",
            padding: "6px 20px",
            borderRadius: 6,
            background: theme.cardBackground,
            border: theme.cardBorder,
            fontFamily: theme.monoFont,
            fontSize: 20,
            fontWeight: 600,
            color: theme.secondaryText,
            letterSpacing: 1,
          }}
        >
          {spec.badge}
        </div>
        <TitleBlock
          spec={spec}
          theme={theme}
          fontSize={titleFontSize}
          maxWidth={640}
        />
        {spec.subtitle && (
          <SubtitleText
            text={spec.subtitle}
            theme={theme}
            fontSize={spec.layout.subtitleFontSize}
            maxWidth={520}
          />
        )}
        {spec.cards.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <CardButtons
              cards={spec.cards}
              theme={theme}
              fontSize={36}
              paddingV={18}
              paddingH={64}
            />
          </div>
        )}
      </div>
      {/* 人物全高区域 */}
      {spec.character.show && spec.character.assetId && (
        <div
          style={{
            order: isCharLeft ? 0 : 1,
            flex: "0 0 45%",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            height: "100%",
            paddingBottom: 0,
            overflow: "hidden",
          }}
        >
          <CharacterImg assetId={spec.character.assetId} maxHeight={1000} />
        </div>
      )}
    </div>
  );
};

// ─── 主组件 ─────────────────────────────────────

export const CoverComposition: React.FC<CoverProps> = ({
  aspectRatio = "4:3",
}) => {
  const theme = getTheme(spec.theme);
  const isVertical = aspectRatio === "3:4";
  const template: CoverTemplate =
    (spec.template as CoverTemplate) || "big-title";
  const placement: CharacterPlacement =
    (spec.character.placement as CharacterPlacement) ||
    (isVertical ? "center" : "left");

  // 按比例覆盖字号
  const titleFontSize = isVertical
    ? (spec.variants?.["3x4"]?.titleFontSize ?? 130)
    : (spec.variants?.["4x3"]?.titleFontSize ?? spec.layout.titleFontSize);

  // 角标安全区位置（按比例缩放）
  const badgeLeft = isVertical ? 48 : 260;
  const badgeTop = isVertical ? 48 : 40;
  const brandRight = isVertical ? 48 : 260;
  const brandTop = isVertical ? 48 : 40;

  // split-left-right 在 3:4 时 fallback 到 big-title-character
  const effectiveTemplate: CoverTemplate =
    template === "split-left-right" && isVertical
      ? "big-title-character"
      : template;

  // 渲染模板内容
  const renderContent = () => {
    if (effectiveTemplate === "big-title-character") {
      return isVertical ? (
        <BigTitleCharVertical
          spec={spec}
          theme={theme}
          titleFontSize={titleFontSize}
          placement={placement}
        />
      ) : (
        <BigTitleCharHorizontal
          spec={spec}
          theme={theme}
          titleFontSize={titleFontSize}
          placement={placement}
        />
      );
    }
    if (effectiveTemplate === "split-left-right") {
      return (
        <SplitLeftRightHorizontal
          spec={spec}
          theme={theme}
          titleFontSize={titleFontSize}
          placement={placement}
        />
      );
    }
    // big-title（默认）
    return isVertical ? (
      <BigTitleVertical
        spec={spec}
        theme={theme}
        titleFontSize={titleFontSize}
        placement={placement}
      />
    ) : (
      <BigTitleHorizontal
        spec={spec}
        theme={theme}
        titleFontSize={titleFontSize}
        placement={placement}
      />
    );
  };

  return (
    <AbsoluteFill
      style={{
        background: theme.background,
        fontFamily: theme.fontFamily,
        display: "flex",
        flexDirection: "column",
        padding: 0,
      }}
    >
      {/* 顶部装饰线 */}
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

      {/* 品牌角标（split-left-right 内嵌 badge 时隐藏顶部角标） */}
      {effectiveTemplate !== "split-left-right" && (
        <Badge
          badge={spec.badge}
          theme={theme}
          left={badgeLeft}
          top={badgeTop}
        />
      )}

      {/* 品牌水印 */}
      <BrandWatermark
        brandName={spec.brandName}
        theme={theme}
        right={brandRight}
        top={brandTop}
      />

      {renderContent()}
    </AbsoluteFill>
  );
};
