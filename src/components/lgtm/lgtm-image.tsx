/** @jsxImportSource react */
/** @jsxRuntime automatic */

import type { CollectionEntry } from "astro:content";
import { GITHUB_ACTIONS } from "astro:env/client";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import satori from "satori";
import sharp from "sharp";

type ImageFormat = "png" | "avif" | "webp";

export const LgtmImage = async (
  entry: CollectionEntry<"lgtm">,
  width = 400,
  format: ImageFormat = "png",
) => {
  const lgtmBasePath = GITHUB_ACTIONS
    ? "./src/__fixtures__/lgtm-sample"
    : "./private-content/lgtm";

  const imagePath = join(lgtmBasePath, entry.id, entry.data.image);
  const baseImage = await readFile(imagePath);

  const resizedImage = await sharp(baseImage).resize(width).toBuffer();

  const metadata = await sharp(resizedImage).metadata();
  const imageWidth = metadata.width ?? width;
  const imageHeight = metadata.height ?? width;

  const interSemiBold = await readFile("./src/assets/Inter_28pt-SemiBold.ttf");

  const textColor =
    entry.data.color === "white"
      ? "oklch(99.4% 0 0)" // --uchu-yang
      : "oklch(14.38% 0.007 256.88)"; // --uchu-yin

  const fontSize = Math.floor((width / 800) * 120);

  const svg = await satori(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: `${fontSize}px`,
          fontFamily: "Inter",
          color: textColor,
          fontWeight: 900,
          letterSpacing: "0.05em",
          textShadow:
            entry.data.color === "white"
              ? "3px 3px 8px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 0, 0, 0.3)"
              : "3px 3px 8px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.3)",
        }}
      >
        LGTM
      </div>
    </div>,
    {
      width: imageWidth,
      height: imageHeight,
      fonts: [
        {
          name: "Inter",
          data: interSemiBold,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );

  const textOverlay = await sharp(Buffer.from(svg)).png().toBuffer();

  const compositeImage = sharp(resizedImage).composite([
    {
      input: textOverlay,
      blend: "over",
    },
  ]);

  let finalImage: Buffer;
  switch (format) {
    case "avif":
      finalImage = await compositeImage.avif({ quality: 80 }).toBuffer();
      break;
    case "webp":
      finalImage = await compositeImage.webp({ quality: 80 }).toBuffer();
      break;
    default:
      finalImage = await compositeImage.png().toBuffer();
      break;
  }

  return finalImage;
};
