/**
 * Remotion public 资源路径协议。
 *
 * 文件实际存放在 public/ 下；传给 staticFile() 时必须是 public 内相对路径，
 * 不能携带 public/ 前缀。
 */

export function toPublicStaticFilePath(inputPath: string): string {
  return inputPath
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/^public\//, "");
}

export function assetIdToProcessedPath(assetId: string): string {
  return toPublicStaticFilePath(`assets/processed/${assetId}.png`);
}

export function audioTimingPathToStaticPath(filePath: string): string {
  return toPublicStaticFilePath(filePath);
}
