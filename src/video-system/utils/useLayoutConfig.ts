/**
 * 布局配置 hook
 *
 * 根据 layout（landscape / portrait）返回对应的尺寸/间距/列数配置。
 * 所有 scene 组件共用此 hook，避免在每个组件里散落 if/else。
 */

export type LayoutMode = "landscape" | "portrait";

export interface LayoutConfig {
  /** 页面内边距 */
  padding: string;
  /** 标题字号倍率（乘以 theme.titleStyle.fontSize） */
  titleScale: number;
  /** 副标题字号倍率 */
  subtitleScale: number;
  /** 双栏布局 */
  gridColumns: { two: string; three: string };
  /** 多栏默认排列方向 */
  flexDirection: "row" | "column";
  /** 内容最大宽度 */
  maxWidth: number;
  /** 步骤/节点宽度 */
  nodeWidth: number;
  /** 卡片间距 */
  gap: number;
  /** section 间距 */
  sectionGap: number;
}

const LANDSCAPE: LayoutConfig = {
  padding: "48px 60px",
  titleScale: 1,
  subtitleScale: 1,
  gridColumns: { two: "1fr 1fr", three: "repeat(3, 1fr)" },
  flexDirection: "row",
  maxWidth: 1500,
  nodeWidth: 320,
  gap: 20,
  sectionGap: 36,
};

const PORTRAIT: LayoutConfig = {
  padding: "80px 48px",
  titleScale: 1.15,
  subtitleScale: 1.1,
  gridColumns: { two: "1fr", three: "1fr" },
  flexDirection: "column",
  maxWidth: 900,
  nodeWidth: 380,
  gap: 24,
  sectionGap: 32,
};

export function useLayoutConfig(layout: LayoutMode): LayoutConfig {
  return layout === "portrait" ? PORTRAIT : LANDSCAPE;
}
