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
 * Renders a circular gradient icon via satori as an SVG string. The `gradient`
 * is any CSS background value (e.g. linear/radial-gradient).
 */
const generateIconSvg = (
  gradient: string,
  satoriOptions: SatoriOptions,
  iconStyleOptions?: IconStyleOptions,
): Promise<string> => {
  const element = createIconElement(gradient, iconStyleOptions);
  return generateSvg(element, satoriOptions);
};

/** PNG variant of {@link generateIconSvg}. */
const generateIconPng = async (
  gradient: string,
  satoriOptions: SatoriOptions,
  iconStyleOptions?: IconStyleOptions,
): Promise<Buffer> =>
  convertSvgToPng(await generateIconSvg(gradient, satoriOptions, iconStyleOptions));

/**
 * Builds the five favicon asset generators bound to a single gradient. Each app
 * supplies its own gradient; the route factory in handlers.ts exposes the
 * result as dev-only endpoints.
 */
export const createFaviconGenerators = (gradient: string) => ({
  IconSvg: () => generateIconSvg(gradient, { width: 500, height: 500 }),
  Icon192Png: () => generateIconPng(gradient, { width: 192, height: 192 }),
  Icon512Png: () => generateIconPng(gradient, { width: 512, height: 512 }),
  IconMaskPng: () =>
    generateIconPng(gradient, { width: 512, height: 512 }, { width: 409, height: 409 }),
  AppleTouchIconPng: () =>
    generateIconPng(gradient, { width: 180, height: 180 }, { width: 140, height: 140 }),
});
