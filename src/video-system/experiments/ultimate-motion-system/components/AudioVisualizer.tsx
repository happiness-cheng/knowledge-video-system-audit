import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Sequence, Audio, staticFile } from "remotion";

interface AudioVisualizerProps {
  /** 音频文件路径（public 内相对路径） */
  audioSrc: string;
  /** 起始帧 */
  from?: number;
  /** 音量 */
  volume?: number;
  /** 是否显示波形 */
  showWaveform?: boolean;
  /** 波形颜色 */
  waveColor?: string;
  /** 波形高度 */
  waveHeight?: number;
}

/** AudioVisualizer — 音频播放 + 波形可视化 */
export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioSrc,
  from = 0,
  volume = 0.9,
  showWaveform = false,
  waveColor = "#6366f1",
  waveHeight = 40,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 模拟波形（基于当前帧的正弦波动）
  const waveBars = 32;
  const bars = Array.from({ length: waveBars }, (_, i) => {
    const phase = (frame * 0.1 + i * 0.3) % (Math.PI * 2);
    const amplitude = interpolate(
      Math.sin(phase),
      [-1, 1],
      [0.2, 1],
    );
    // 音频开始后才显示波形
    const progress = interpolate(
      frame,
      [from, from + 10],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    return amplitude * progress;
  });

  return (
    <>
      <Sequence from={from} layout="none">
        <Audio src={staticFile(audioSrc)} volume={volume} />
      </Sequence>
      {showWaveform && (
        <div
          style={{
            position: "absolute",
            bottom: 120,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 3,
            alignItems: "flex-end",
            height: waveHeight,
            opacity: interpolate(frame, [from, from + 15], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {bars.map((amplitude, i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: `${amplitude * 100}%`,
                background: waveColor,
                borderRadius: 2,
                minHeight: 4,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};
