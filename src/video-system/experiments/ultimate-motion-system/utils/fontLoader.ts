// ─── Google Fonts 加载器 ─────────────────────────────────
// 使用 @remotion/google-fonts 加载 NotoSansSC

import { loadFont as loadNotoSansSC } from "@remotion/google-fonts/NotoSansSC";

/** 加载 NotoSansSC 字体，返回 fontFamily */
export function loadChineseFont(): string {
  const { fontFamily } = loadNotoSansSC();
  return fontFamily;
}

/** 默认中文字体 family（延迟加载） */
let _chineseFontFamily: string | null = null;

export function getChineseFontFamily(): string {
  if (!_chineseFontFamily) {
    _chineseFontFamily = loadChineseFont();
  }
  return _chineseFontFamily;
}
