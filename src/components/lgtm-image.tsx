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
    : "./lgtm-content/lgtm";

  const imagePath = join(lgtmBasePath, entry.id, entry.data.image);
  const baseImage = await readFile(imagePath);

  const resizedImage = await sharp(baseImage).resize(width).toBuffer();

  const metadata = await sharp(resizedImage).metadata();
  const imageWidth = metadata.width ?? width;
  const imageHeight = metadata.height ?? width;

  const BBHBartleRegular = await readFile("./src/assets/BBHBartle-Regular.ttf");

  const textColor = entry.data.color === "white" ? "#FEFEFE" : "#252426";

  const strokeColor = entry.data.color === "white" ? "#252426" : "#FEFEFE";

  const scale = 2;
  const renderWidth = imageWidth * scale;
  const renderHeight = imageHeight * scale;
  const fontSize = Math.floor((renderWidth / 800) * 90);

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
          fontFamily: "BBHBartle",
          color: textColor,
          WebkitTextStroke: `3px ${strokeColor}`,
        }}
      >
        LGTM
      </div>
    </div>,
    {
      width: renderWidth,
      height: renderHeight,
      fonts: [
        {
          name: "BBHBartle",
          data: BBHBartleRegular,
        },
      ],
    },
  );

  const textOverlay = await sharp(Buffer.from(svg))
    .png()
    .resize(imageWidth, imageHeight, {
      kernel: "lanczos3",
    })
    .toBuffer();

  const textOverlayWithOpacity = await sharp(textOverlay)
    .composite([
      {
        input: Buffer.from(
          `<svg width="${imageWidth}" height="${imageHeight}">
            <rect width="100%" height="100%" fill="black" opacity="0.85"/>
          </svg>`,
        ),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();

  const compositeImage = sharp(resizedImage).composite([
    {
      input: textOverlayWithOpacity,
      blend: "over",
    },
  ]);

  let finalImage: Buffer;
  switch (format) {
    case "avif":
      finalImage = await compositeImage.avif({ quality: 90 }).toBuffer();
      break;
    case "webp":
      finalImage = await compositeImage.webp({ quality: 90 }).toBuffer();
      break;
    default:
      finalImage = await compositeImage.png().toBuffer();
      break;
  }

  return finalImage;
};
