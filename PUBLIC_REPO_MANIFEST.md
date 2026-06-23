# 审查仓库清单

## 包含的目录

- `src/video-system/` — 系统源码（compositions, scenes, themes, scripts, utils, components, visual, fixtures）
- `knowledge-video-system/prompts/` — 00-19 共 20 个提示词文件
- `docs/` — 系统设计、契约、迁移和审查文档
- 根目录配置文件（package.json, tsconfig.json, .gitignore, CLAUDE.md, AGENTS.md）

## 排除的内容类型

- `.git/` — 原仓库历史
- `node_modules/` — 依赖
- `out/` — 渲染产物
- `.env*` — 环境变量（密钥）
- 音频文件（.mp3, .m4a, .wav）
- 视频文件（.mp4）
- 图片文件（.png, .jpg, .jpeg, .gif, .webp）
- 压缩包（.zip, .tar, .gz）
- 密钥文件（.pem, .key, .p12）
- IDE 配置
- 临时目录
- 个人配置

## 生产数据替换说明

以下生产数据文件保留在审查仓库中，供系统结构审查：

- `contentBrief.json` — 实际视频内容策划（不含个人隐私）
- `videoSpec.json` — 实际场景定义（不含个人隐私）
- `audioTiming.json` — TTS 时序数据（仅结构参考）
- `subtitles.json` — 字幕数据（仅结构参考）
- `coverBrief.json` / `coverSpec.json` — 封面数据
- `assetManifest.json` — 素材登记（路径已脱敏）

已排除的生产数据：

- `previewVisualReport.json` — 包含本机绝对路径
- `visualMetrics.json` — 包含本机绝对路径
- 所有音频、视频、图片素材

## 原项目 Commit

原项目 commit hash: `afb61d5`

## 声明

- 不包含任何密钥、私人素材或 Git 历史
- 不包含个人邮箱、真实姓名、学校信息或本地路径
- 此仓库用于系统架构与代码审查，不代表完整生产素材库
