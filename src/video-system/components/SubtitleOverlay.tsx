/**
 * SubtitleOverlay — 口播同步字幕叠加层
 *
 * 读取 subtitles.json，在视频底部显示与口播同步的字幕。
 * 底部居中，白底半透明背景，深灰文字，不遮挡主画面。
 */

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface SubtitleItem {
  sceneId: string;
  start: number;
  end: number;
  text: string;
}

interface SubtitleOverlayProps {
  subtitles: SubtitleItem[];
  sceneId: string;
  sceneIds?: string[];
  sceneStartFrame: number;
}

/**
 * 二分查找当前应显示的字幕
 */
function findActiveSubtitle(
  subtitles: SubtitleItem[],
  currentTime: number,
): SubtitleItem | null {
  let lo = 0;
  let hi = subtitles.length - 1;

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const item = subtitles[mid];

    if (currentTime < item.start) {
      hi = mid - 1;
    } else if (currentTime >= item.end) {
      lo = mid + 1;
    } else {
      return item;
    }
  }

  return null;
}

export const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({
  subtitles,
  sceneId,
  sceneIds,
  sceneStartFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 当前 scene 内的相对时间（秒）
  const relativeTime = frame / fps;
  // 转为全局时间
  const globalTime = sceneStartFrame / fps + relativeTime;

  // 过滤当前 scene 的字幕
  const activeSceneIds = sceneIds ?? [sceneId];
  const sceneSubtitles = subtitles.filter((s) =>
    activeSceneIds.includes(s.sceneId),
  );
  if (sceneSubtitles.length === 0) return null;

  const active = findActiveSubtitle(sceneSubtitles, globalTime);
  if (!active) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          borderRadius: 8,
          padding: "8px 24px",
          maxWidth: 900,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: 34,
            fontWeight: 600,
            color: "#1a1a1a",
            lineHeight: 1.5,
            fontFamily:
              "'Inter','Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif",
          }}
        >
          {active.text}
        </span>
      </div>
    </div>
  );
};
