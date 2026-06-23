# Studio Review Guide — ExperimentVersionVideo

## 启动

```bash
npx remotion studio src/index.ts
```

选择 `ExperimentVersionVideo` Composition。

## 检查清单

### 1. 全片结构

- [ ] 8 个 scene 全部可见，无空白页
- [ ] scene 顺序正确：Hook → Mistake → Setup → Evidence → Insight → Transfer → Template → CTA
- [ ] 转场使用 fade，不突兀
- [ ] 动态背景贯穿全程，不抢主体

### 2. S01 Hook Shot

- [ ] 主标题分层入场（第一行先到，第二行后到）
- [ ] 不是 PPT 标题页
- [ ] 背景有轻微生命力
- [ ] 3 秒内看清主题

### 3. S02 Mistake Shot

- [ ] 左卡先成为视觉中心
- [ ] 右卡后接管视觉中心
- [ ] active 切换有平滑过渡
- [ ] 不是普通双栏 PPT

### 4. S03 Experiment Setup Shot

- [ ] 三个步骤逐个出现
- [ ] 当前步骤高亮
- [ ] 有 prompt 卡逐步补全感

### 5. S04 Evidence Shot

- [ ] 左证据先 active
- [ ] 右证据后 active
- [ ] 对比结论在最后阶段出现
- [ ] 不乱框，结构清晰

### 6. S05 Insight Shot

- [ ] 有聚焦感，不是普通标题页
- [ ] "实验结论" 标签有轻微 breathing
- [ ] 结论文字使用渐变色

### 7. S06 Transfer Shot

- [ ] 三栏依次成为视觉中心
- [ ] 旧栏降权但保持可读
- [ ] 第三栏作为视觉收束出现

### 8. S07 Template Shot

- [ ] 四行逐步 active
- [ ] 使用 progressive-retain（已说过的保持较高可见性）
- [ ] 最后阶段全体稳定
- [ ] 有截图保存价值

### 9. S08 CTA Shot

- [ ] 按钮有轻微行动感
- [ ] 不广告化
- [ ] 收束本集，钩住下一篇

### 10. Motion QA

- [ ] 全部 frame-driven（无 CSS animation）
- [ ] 当前重点突出
- [ ] 旧信息保留上下文
- [ ] 动效服务理解，不为炫技

### 11. Typography QA

- [ ] 字号足够大（手机端可读）
- [ ] 无单字孤行
- [ ] 无标点单独成行

### 12. 隔离验证

- [ ] 正式 videoSpec.json 未修改
- [ ] 正式 audioTiming.json 未修改
- [ ] 正式 subtitles.json 未修改
- [ ] 正式 KnowledgeVideo.tsx 未修改
- [ ] 正式 scene 文件未修改
