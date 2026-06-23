# 审查范围

## 建议审查重点

### 1. V2 内容门禁

- `src/video-system/utils/contentBriefV2.ts` — contentBrief V2 结构定义
- `src/video-system/utils/preProductionGate.ts` — 制作前机器门禁
- `src/video-system/scripts/validate-content-brief.ts` — 内容校验
- `src/video-system/scripts/validate-preproduction-gate.ts` — 门禁校验
- `knowledge-video-system/prompts/17_PREPRODUCTION_REVIEW_GATE.md` — 门禁规则

### 2. 多 AI 审查与 promotion

- `src/video-system/scripts/prepare-preproduction-review.ts` — 审查准备
- `src/video-system/scripts/generate-preproduction-review-packet.ts` — 审查包生成
- `src/video-system/scripts/import-preproduction-review.ts` — 审查导入
- `src/video-system/scripts/promote-preproduction-candidates.ts` — promotion
- `knowledge-video-system/prompts/19_EXTERNAL_MULTI_AI_REVIEW.md` — 外部审查协议

### 3. Revision Router

- `knowledge-video-system/prompts/18_REVISION_ROUTER.md` — 修改路由规则

### 4. 根入口契约一致性

- `CLAUDE.md` / `AGENTS.md` — 共享 V2 核心区
- `docs/agent/KNOWLEDGE_VIDEO_V2_CONTRACT.md` — 详细契约
- `src/video-system/scripts/validate-agent-contracts.ts` — 一致性检查

### 5. 能力注册表与 Scene 实现

- `src/video-system/visual/capabilityRegistry.ts` — 能力注册
- `src/video-system/scenes/SceneRenderer.tsx` — 场景分发
- `src/video-system/themes/index.ts` — 主题注册

### 6. Validators

- `src/video-system/scripts/validate-video-spec.ts`
- `src/video-system/scripts/validate-subtitles.ts`
- `src/video-system/scripts/validate-render-code.ts`
- `src/video-system/scripts/validate-cover-spec.ts`
- `src/video-system/scripts/validate-system-registry.ts`
- `src/video-system/scripts/validate-quality-score.ts`

### 7. 文档与实现一致性

- prompts 00-19 描述的能力是否在源码中实现
- capabilityRegistry 状态是否与 SceneRenderer 一致
- 门禁条件是否与文档描述一致

### 8. 是否存在绕过路径

- `npm start` 是否真的先跑门禁
- 实验组件是否能绕过制作前门禁
- 候选稿修改后旧审查是否自动失效
