import sharp from "sharp";

export const MOBILE_FEED_CANVAS = {
  width: 390,
  height: 693,
  frameTop: 138,
};

export async function createMobileScaledPreview(
  inputFile: string,
  outputFile: string,
) {
  const scaled = await sharp(inputFile)
    .resize({
      width: MOBILE_FEED_CANVAS.width,
      fit: "contain",
      withoutEnlargement: false,
    })
    .png()
    .toBuffer();
  const metadata = await sharp(scaled).metadata();
  const left = Math.max(
    0,
    Math.round((MOBILE_FEED_CANVAS.width - (metadata.width ?? 0)) / 2),
  );

  await sharp({
    create: {
      width: MOBILE_FEED_CANVAS.width,
      height: MOBILE_FEED_CANVAS.height,
      channels: 4,
      background: { r: 245, g: 245, b: 245, alpha: 1 },
    },
  })
    .composite([
      {
        input: scaled,
        left,
        top: MOBILE_FEED_CANVAS.frameTop,
      },
    ])
    .png()
    .toFile(outputFile);
}
