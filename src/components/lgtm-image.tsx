/** @jsxImportSource react */
/** @jsxRuntime automatic */

import type { CollectionEntry } from "astro:content";
import { GITHUB_ACTIONS } from "astro:env/client";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import satori from "satori";
import sharp from "sharp";

type ImageFormat = "png" | "avif" | "webp";

// Cache the font file across many LgtmImage calls in a single build. The
// promise is awaited per call but the underlying readFile happens once.
const fontPromise = readFile("./src/assets/BBHBartle-Regular.ttf");

const buildTextOverlay = async (
  entry: CollectionEntry<"lgtm">,
  imageWidth: number,
  imageHeight: number,
) => {
  const BBHBartleRegular = await fontPromise;

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

  // Animate only when the source has multiple pages AND output is WebP.
  // Detection is content-based (pages > 1) rather than extension-based so
  // any animated input format works. PNG/AVIF requests fall back to a still
  // first frame so blur placeholders, OG images, and legacy
  // <img src=".png"> snippets keep working.
  const probeMeta = await sharp(baseImage, { animated: true }).metadata();
  const animated = (probeMeta.pages ?? 1) > 1 && format === "webp";

  if (animated) {
    // Decode all frames into a fully-composed RGBA strip first, then slice
    // out each page. Reading a GIF page directly (`{ page: N }`) returns
    // only that page's payload — which for GIFs that use frame disposal or
    // delta updates is a partial subframe, not the canvas state at that
    // moment. Going through the animated raw strip lets libvips do the
    // disposal/composition for us so each slice is the actual visible frame.
    const delay = probeMeta.delay;
    const loop = probeMeta.loop ?? 0;

    const strip = await sharp(baseImage, { animated: true })
      .resize({ width })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pageWidth = strip.info.width;
    const pageCount = strip.info.pages ?? 1;
    const pageHeight =
      strip.info.pageHeight ?? Math.floor(strip.info.height / pageCount);
    const channels = strip.info.channels;
    const bytesPerPage = pageWidth * pageHeight * channels;

    const textOverlayWithOpacity = await buildTextOverlay(
      entry,
      pageWidth,
      pageHeight,
    );

    // Process frames sequentially to keep peak memory bounded — parallel
    // sharp pipelines on a long clip can balloon memory usage.
    const frames: Buffer[] = [];
    for (let page = 0; page < pageCount; page++) {
      const pageBytes = strip.data.subarray(
        page * bytesPerPage,
        (page + 1) * bytesPerPage,
      );
      const frame = await sharp(pageBytes, {
        raw: { width: pageWidth, height: pageHeight, channels },
      })
        .composite([{ input: textOverlayWithOpacity, blend: "over" }])
        .png()
        .toBuffer();
      frames.push(frame);
    }

    return sharp(frames, { join: { animated: true } })
      .webp({ quality: 90, delay, loop })
      .toBuffer();
  }

  const resizedImage = await sharp(baseImage).resize(width).toBuffer();
  const metadata = await sharp(resizedImage).metadata();
  const imageWidth = metadata.width ?? width;
  const imageHeight = metadata.height ?? width;

  const textOverlayWithOpacity = await buildTextOverlay(
    entry,
    imageWidth,
    imageHeight,
  );

  const compositeImage = sharp(resizedImage).composite([
    { input: textOverlayWithOpacity, blend: "over" },
  ]);

  switch (format) {
    case "avif":
      return compositeImage.avif({ quality: 90 }).toBuffer();
    case "webp":
      return compositeImage.webp({ quality: 90 }).toBuffer();
    default:
      return compositeImage.png().toBuffer();
  }
};
