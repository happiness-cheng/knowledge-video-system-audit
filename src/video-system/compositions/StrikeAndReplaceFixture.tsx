/**
 * StrikeAndReplaceFixture
 *
 * 用于验证“旧判断划掉，再替换成新判断”的纠偏动作。
 */

import React from "react";
import { SceneRenderer } from "../scenes/SceneRenderer";
import type { BigQuoteSceneData } from "../scenes/BigQuoteScene";
import { getTheme } from "../themes";

export const STRIKE_AND_REPLACE_FIXTURE_FRAMES = 110;

const scene: BigQuoteSceneData = {
  id: "strike-and-replace-fixture",
  type: "big-quote",
  semanticPattern: "wrong-to-correct",
  quote: "不是记忆问题\n是入职问题",
  wrongText: "记忆问题",
  leadText: "是",
  replacementText: "入职问题",
  subtitle: "旧判断被否定，新判断成为焦点",
  visualRole: "insight",
  keywords: ["纠偏", "划掉", "替换"],
  animation: "strike-and-replace",
};

export const StrikeAndReplaceFixture: React.FC = () => {
  const theme = getTheme("xhs-white-editorial");

  return (
    <SceneRenderer
      scene={scene}
      theme={theme}
      totalFrames={STRIKE_AND_REPLACE_FIXTURE_FRAMES}
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
