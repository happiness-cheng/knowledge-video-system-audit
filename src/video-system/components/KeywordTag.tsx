/**
 * 关键词标签
 *
 * 用于封面、引言等场景底部的关键词展示。
 */

import React from "react";
import type { VideoTheme } from "../themes/types";

export interface KeywordTagProps {
  theme: VideoTheme;
  label: string;
}

export const KeywordTag: React.FC<KeywordTagProps> = ({ theme, label }) => (
  <span
    style={{
      display: "inline-block",
      padding: theme.tagStyle.padding,
      borderRadius: theme.tagStyle.borderRadius,
      border: theme.tagStyle.border,
      background: theme.tagStyle.background,
      color: theme.tagStyle.color,
      fontSize: theme.tagStyle.fontSize,
      fontWeight: theme.tagStyle.fontWeight,
      fontFamily: theme.fontFamily,
    }}
  >
    {label}
  </span>
);

/**
 * 关键词标签组
 */
export const KeywordTags: React.FC<{
  theme: VideoTheme;
  keywords: string[];
  gap?: number;
}> = ({ theme, keywords, gap = 10 }) => (
  <div style={{ display: "flex", gap, flexWrap: "wrap" }}>
    {keywords.map((kw) => (
      <KeywordTag key={kw} theme={theme} label={kw} />
    ))}
  </div>
);
