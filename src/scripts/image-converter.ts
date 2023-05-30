import { readFileSync, writeFileSync } from "fs";
import sharp from "sharp";
import type { WebpOptions } from "sharp";

interface Options {
  webpOptions?: WebpOptions;
}

export default async function imageConverter(
  input: string,
  output: string,
  options: Options = {}
) {
  const file = readFileSync(input);
  const { webpOptions } = options;

  /**
   * File name without extension
   */
  const outputFileName = output.replace(/\.[\w-]+$/, "");

  sharp(file)
    .webp({ ...webpOptions, quality: webpOptions?.quality ?? 100 })
    .toBuffer()
    .then((buffer) => writeFileSync(`${outputFileName}.webp`, buffer));
}
