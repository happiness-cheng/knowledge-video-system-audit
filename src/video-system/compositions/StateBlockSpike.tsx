/**
 * StateBlockSpike
 *
 * Visual Spike 01: 验证"审查未通过后，下游生产流程真实停止"的视觉能力。
 *
 * 时序阻断：步骤正常推进 → 审查失败 → 下游冻结。
 * 使用 ProcessStepsScene 的 blockAtFrame 实现时序阻断。
 */

import React from "react";
import { Composition } from "remotion";
import { SceneRenderer } from "../scenes/SceneRenderer";
import type { ProcessStepsSceneData } from "../scenes/ProcessStepsScene";
import { getTheme } from "../themes";

// 30fps × 10s = 300 frames
export const STATE_BLOCK_SPIKE_FRAMES = 300;
const FPS = 30;

/**
 * 生产流程步骤 + 时序阻断
 *
 * 时间线：
 * 0-60f (0-2s): 步骤 1-2 正常推进（内容候选 → 审查）
 * 60-120f (2-4s): 审查进行中
 * 120f (4s): 审查失败，阻断激活
 * 120-180f (4-6s): 阻断视觉效果展开
 * 180-270f (6-9s): 下游冻结
 * 270-300f (9-10s): 停留确认因果
 */
const scene: ProcessStepsSceneData = {
  type: "process-steps",
  title: "审查失败 → 生产停止",
  steps: ["内容候选", "审查", "音频", "字幕", "渲染", "发布"],
  revealMode: "progressive",
  blockedAfter: 1, // 审查之后的步骤被阻断
  blockAtFrame: 120, // 第 4 秒激活阻断
  blockedReason: "审查未通过，下游停止",
};

const StateBlockSpikeContent: React.FC = () => {
  const theme = getTheme("xhs-white-editorial");

  return (
    <SceneRenderer
      scene={scene}
      theme={theme}
      totalFrames={STATE_BLOCK_SPIKE_FRAMES}
      current={1}
      total={1}
      sceneStartFrame={0}
      layout="landscape"
      presentationMode="default"
      brand={{
        watermarkText: "世间一点尘",
        handle: "shijianyidianchen",
        logoAssetId: null,
      }}
      showProgress
    />
  );
};

export const StateBlockSpike: React.FC = () => {
  return <StateBlockSpikeContent />;
};

// Remotion Composition 注册
export const StateBlockSpikeComposition: React.FC = () => {
  return (
    <Composition
      id="StateBlockSpike"
      component={StateBlockSpike}
      durationInFrames={STATE_BLOCK_SPIKE_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  );
};
