import React from "react";
import { formatTitleLines } from "../utils/titleLines";

export interface SafeTitleTextProps {
  text: string;
  maxCharsPerLine?: number;
  highlightText?: string;
  highlightColor?: string;
  gradient?: string;
}

const gradientTextStyle = (gradient?: string): React.CSSProperties | undefined =>
  gradient
    ? {
        background: gradient,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }
    : undefined;

function renderHighlightedLine({
  line,
  highlightText,
  highlightColor,
  gradient,
}: {
  line: string;
  highlightText?: string;
  highlightColor?: string;
  gradient?: string;
}): React.ReactNode {
  if (!highlightText || !line.includes(highlightText)) {
    return <span style={gradientTextStyle(gradient)}>{line}</span>;
  }

  const parts = line.split(highlightText);
  return (
    <>
      {parts[0] && (
        <span style={gradientTextStyle(gradient)}>{parts[0]}</span>
      )}
      <span style={{ color: highlightColor }}>{highlightText}</span>
      {parts.slice(1).join(highlightText) && (
        <span style={gradientTextStyle(gradient)}>
          {parts.slice(1).join(highlightText)}
        </span>
      )}
    </>
  );
}

export const SafeTitleText: React.FC<SafeTitleTextProps> = ({
  text,
  maxCharsPerLine,
  highlightText,
  highlightColor,
  gradient,
}) => {
  const lines = formatTitleLines(text, { maxCharsPerLine });
  return (
    <>
      {lines.map((line, index) => (
        <React.Fragment key={`${line}-${index}`}>
          {index > 0 && <br />}
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {renderHighlightedLine({
              line,
              highlightText,
              highlightColor,
              gradient,
            })}
          </span>
        </React.Fragment>
      ))}
    </>
  );
};
