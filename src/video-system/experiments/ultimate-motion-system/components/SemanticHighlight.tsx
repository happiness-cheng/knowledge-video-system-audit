import React from "react";

interface SemanticHighlightProps {
  text: string;
  keywords: string[];
  highlightColor?: string;
  textColor?: string;
}

/** SemanticHighlight — 语义块高亮 */
export const SemanticHighlight: React.FC<SemanticHighlightProps> = ({
  text, keywords, highlightColor = "rgba(99,102,241,0.15)", textColor = "#f0f0f5",
}) => {
  let result: React.ReactNode = text;
  for (const kw of keywords) {
    if (typeof result !== "string") break;
    const idx: number = result.indexOf(kw);
    if (idx >= 0) {
      const before = (result as string).slice(0, idx);
      const after = (result as string).slice(idx + kw.length);
      result = (
        <>
          {before}
          <span style={{ background: highlightColor, padding: "2px 8px", borderRadius: 4 }}>{kw}</span>
          {after}
        </>
      );
    }
  }
  return <span style={{ color: textColor }}>{result}</span>;
};
