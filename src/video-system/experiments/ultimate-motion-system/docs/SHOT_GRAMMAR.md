# Shot Grammar — V2

## 8 种镜头语法

### 1. Hook Shot
- **适用内容**: 痛点开场、误判开场
- **视觉中心**: 主标题分层入场
- **入场策略**: spring 入场，第一行先到第二行后到
- **active state**: 标题 breathing
- **持续 motion**: 背景 drift，标题轻微呼吸
- **禁止**: PPT 标题页、空白第一帧
- **迁移条件**: 可直接迁回

### 2. Mistake Shot
- **适用内容**: 错误现场、模糊提问对比
- **视觉中心**: 左右卡片 cue 切换
- **入场策略**: fadeSlide 入场，cue 驱动 active 切换
- **active state**: director cue 驱动，左→右
- **持续 motion**: active 卡片 lift，非 active 降权
- **禁止**: 普通双栏 PPT
- **迁移条件**: 需接入 resolveActiveTarget

### 3. Experiment Setup Shot
- **适用内容**: 变量改变、实验设计
- **视觉中心**: 步骤逐步出现
- **入场策略**: staggerReveal 逐个入场
- **active state**: 当前步骤高亮
- **持续 motion**: 步骤逐步出现，旧步骤保持可见
- **禁止**: 一步到位的静态列表
- **迁移条件**: 可直接迁回

### 4. Evidence Shot
- **适用内容**: 截图对比、前后对比
- **视觉中心**: 左右证据 cue 切换 + 结论
- **入场策略**: fadeSlide 入场，cue 驱动证据 active
- **active state**: director cue 驱动，左证据→右证据→结论
- **持续 motion**: active 证据 lift，边框高亮
- **禁止**: 乱框、截图太小、无标签
- **迁移条件**: 需接入 cue system

### 5. Insight Shot
- **适用内容**: 阶段结论、核心判断
- **视觉中心**: 结论文字聚焦 + breathing
- **入场策略**: spring 入场，标签 breathing
- **active state**: 引言渐变色，标签轻微呼吸
- **持续 motion**: 背景 glow，标签 breathing
- **禁止**: 励志海报、重复上一页
- **迁移条件**: 可直接迁回

### 6. Transfer Shot
- **适用内容**: 迁移证明、多场景验证
- **视觉中心**: 三栏 cue 切换
- **入场策略**: fadeSlide 入场，cue 驱动栏 active
- **active state**: director cue 驱动，第一栏→第二栏→第三栏收束
- **持续 motion**: active 栏 lift，旧栏降权保持可读
- **禁止**: 三栏等权无差异
- **迁移条件**: 需接入 resolveActiveTarget

### 7. Template Shot
- **适用内容**: 可截图模板、行动清单
- **视觉中心**: 模板项 progressive-retain
- **入场策略**: fadeSlide 逐项入场
- **active state**: progressive-retain，最终全体稳定
- **持续 motion**: 当前项最亮，已激活保持较高可见性
- **禁止**: 普通 bullet 墙
- **迁移条件**: 需接入 progressive-retain

### 8. CTA Shot
- **适用内容**: 行动号召、下一篇预告
- **视觉中心**: 按钮 pulse
- **入场策略**: spring 入场 + fadeSlide
- **active state**: 按钮轻微脉冲
- **持续 motion**: 按钮呼吸脉冲
- **禁止**: 营销海报、多个按钮并列
- **迁移条件**: 可直接迁回
