# Knowledge Video System — 代码审查仓库

这是"知识视频生成系统"的脱敏审查版本，用于系统架构与代码审查。

## 项目目标

用 Remotion（React 组件化视频框架）制作知识类短视频，发布到 YouTube/Bilibili/抖音。系统采用 Content First V2 流程：内容审查通过后才进入制作。

## 系统模块

- **内容模块**：网页版 ChatGPT + 用户，负责吸引力、事实、证据、制作前审查
- **画面模块**：Agent，执行已批准内容的 Remotion、素材、音频、字幕、视觉验收

## 安装

```bash
npm ci --ignore-scripts
```

## 验证

```bash
npx tsc --noEmit
npm test
npm run validate:system
```

## 核心审查入口

- `CLAUDE.md` / `AGENTS.md` — 根入口契约
- `docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md` — V2 详细契约
- `knowledge-video-system/prompts/17_PREPRODUCTION_REVIEW_GATE.md` — 制作前门禁
- `knowledge-video-system/prompts/18_REVISION_ROUTER.md` — 修改路由
- `knowledge-video-system/prompts/19_EXTERNAL_MULTI_AI_REVIEW.md` — 外部审查协议
- `src/video-system/visual/capabilityRegistry.ts` — 能力注册表
- `src/video-system/utils/preProductionGate.ts` — 制作前机器门禁
- `src/video-system/utils/qualityScoreGate.ts` — 发布门禁

## 已排除内容

- 音频文件（TTS 语音、背景音乐）
- 视频成片（MP4）
- 图片素材（人物图、封面图、截图）
- 私人数据（.env、密钥、个人配置）
- Git 历史
- node_modules、构建缓存

## 说明

此仓库用于系统架构与代码审查，不代表完整生产素材库。生产数据已替换为脱敏样例或保留结构供审查。
