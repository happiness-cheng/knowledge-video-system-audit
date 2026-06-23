import React from "react";
import { Img, staticFile } from "remotion";

interface MotionImageProps {
  src: string;
  width?: string | number;
  height?: string | number;
  objectFit?: React.CSSProperties["objectFit"];
  borderRadius?: number;
  style?: React.CSSProperties;
}

/** MotionImage — 图片容器 */
export const MotionImage: React.FC<MotionImageProps> = ({
  src,
  width = "100%",
  height = "auto",
  objectFit = "contain",
  borderRadius = 12,
  style,
}) => (
  <div
    style={{
      borderRadius,
      overflow: "hidden",
      width,
      height,
      ...style,
    }}
  >
    <Img
      src={staticFile(src)}
      style={{ width: "100%", height: "100%", objectFit, display: "block" }}
    />
  </div>
);
