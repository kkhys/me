/** @jsxImportSource react */
/** @jsxRuntime automatic */

import type { CollectionEntry } from "astro:content";
import { GITHUB_ACTIONS } from "astro:env/client";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import satori from "satori";
import sharp from "sharp";

export type LgtmFormat = "avif" | "webp";

export const formatForEntry = (entry: CollectionEntry<"lgtm">): LgtmFormat =>
  entry.data.animated ? "webp" : "avif";

const QUALITY = 90;

// Cache the font file across many LgtmImage calls in a single build. The
// promise is awaited per call but the underlying readFile happens once.
const fontPromise = readFile("./src/assets/BBHBartle-Regular.ttf");

const buildTextOverlay = async (imageWidth: number, imageHeight: number) => {
  const BBHBartleRegular = await fontPromise;

  const textColor = "#FEFEFE";
  const strokeColor = "#252426";

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
      fonts: [{ name: "BBHBartle", data: BBHBartleRegular }],
    },
  );

  const textOverlay = await sharp(Buffer.from(svg))
    .png()
    .resize(imageWidth, imageHeight, { kernel: "lanczos3" })
    .toBuffer();

  return sharp(textOverlay)
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
};

const generateStillAvif = async (baseImage: Buffer, width: number): Promise<Buffer> => {
  const resizedImage = await sharp(baseImage).resize(width).toBuffer();
  const metadata = await sharp(resizedImage).metadata();
  const imageWidth = metadata.width ?? width;
  const imageHeight = metadata.height ?? width;

  const textOverlay = await buildTextOverlay(imageWidth, imageHeight);

  return sharp(resizedImage)
    .composite([{ input: textOverlay, blend: "over" }])
    .avif({ quality: QUALITY })
    .toBuffer();
};

const generateAnimatedWebp = async (baseImage: Buffer, width: number): Promise<Buffer> => {
  // Decode all frames into a fully-composed RGBA strip first, then slice out
  // each page. Reading a GIF page directly (`{ page: N }`) returns only that
  // page's payload — which for GIFs that use frame disposal or delta updates
  // is a partial subframe, not the canvas state at that moment. Going through
  // the animated raw strip lets libvips do the disposal/composition for us so
  // each slice is the actual visible frame.
  const probeMeta = await sharp(baseImage, { animated: true }).metadata();
  const delay = probeMeta.delay;
  const loop = probeMeta.loop ?? 0;

  const strip = await sharp(baseImage, { animated: true })
    .resize({ width })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pageWidth = strip.info.width;
  const pageCount = strip.info.pages ?? 1;
  const pageHeight = strip.info.pageHeight ?? Math.floor(strip.info.height / pageCount);
  const channels = strip.info.channels;
  const bytesPerPage = pageWidth * pageHeight * channels;

  const textOverlay = await buildTextOverlay(pageWidth, pageHeight);

  // Process frames sequentially to keep peak memory bounded — parallel sharp
  // pipelines on a long clip can balloon memory usage.
  const frames: Buffer[] = [];
  for (let page = 0; page < pageCount; page++) {
    const pageBytes = strip.data.subarray(page * bytesPerPage, (page + 1) * bytesPerPage);
    const frame = await sharp(pageBytes, {
      raw: { width: pageWidth, height: pageHeight, channels },
    })
      .composite([{ input: textOverlay, blend: "over" }])
      .png()
      .toBuffer();
    frames.push(frame);
  }

  return sharp(frames, { join: { animated: true } })
    .webp({ quality: QUALITY, delay, loop })
    .toBuffer();
};

export const LgtmImage = async (entry: CollectionEntry<"lgtm">, width = 400): Promise<Buffer> => {
  const lgtmBasePath = GITHUB_ACTIONS ? "./src/__fixtures__/lgtm-sample" : "./lgtm-content/lgtm";

  const imagePath = join(lgtmBasePath, entry.id, entry.data.image);
  const baseImage = await readFile(imagePath);

  return entry.data.animated
    ? generateAnimatedWebp(baseImage, width)
    : generateStillAvif(baseImage, width);
};
