/** @jsxImportSource react */
/** @jsxRuntime automatic */

import type { ReactElement } from "react";
import satori from "satori";
import sharp from "sharp";

interface IconStyleOptions {
  width?: number | string;
  height?: number | string;
}

interface SatoriOptions {
  width: number;
  height: number;
}

const createIconElement = (gradient: string, options?: IconStyleOptions) => {
  const { width = "100%", height = "100%" } = options ?? {};

  return (
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
          width,
          height,
          borderRadius: "50%",
          background: gradient,
        }}
      />
    </div>
  );
};

const generateSvg = (element: ReactElement, options: SatoriOptions) => {
  return satori(element, {
    width: options.width,
    height: options.height,
    fonts: [],
  });
};

const convertSvgToPng = (svg: string) => {
  return sharp(Buffer.from(svg)).png().toBuffer();
};

/**
 * Renders a circular gradient icon via satori. The `gradient` is any CSS
 * background value (e.g. linear/radial-gradient). Returns an SVG string, or a
 * PNG Buffer when `format` is "png".
 */
export const generateIcon = async (
  gradient: string,
  satoriOptions: SatoriOptions,
  iconStyleOptions?: IconStyleOptions,
  format: "svg" | "png" = "svg",
) => {
  const element = createIconElement(gradient, iconStyleOptions);
  const svg = await generateSvg(element, satoriOptions);

  if (format === "png") {
    return convertSvgToPng(svg);
  }

  return svg;
};

/**
 * Builds the five favicon asset generators bound to a single gradient. Each app
 * calls this with its own gradient and exposes the result to its favicon route
 * handlers.
 */
export const createFaviconGenerators = (gradient: string) => ({
  IconSvg: async () =>
    (await generateIcon(gradient, { width: 500, height: 500 }, undefined, "svg")) as string,
  Icon192Png: async () =>
    (await generateIcon(gradient, { width: 192, height: 192 }, undefined, "png")) as Buffer,
  Icon512Png: async () =>
    (await generateIcon(gradient, { width: 512, height: 512 }, undefined, "png")) as Buffer,
  IconMaskPng: async () =>
    (await generateIcon(
      gradient,
      { width: 512, height: 512 },
      { width: 409, height: 409 },
      "png",
    )) as Buffer,
  AppleTouchIconPng: async () =>
    (await generateIcon(
      gradient,
      { width: 180, height: 180 },
      { width: 140, height: 140 },
      "png",
    )) as Buffer,
});
