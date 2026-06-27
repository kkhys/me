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

const createIconElement = (options?: IconStyleOptions) => {
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
          background:
            "linear-gradient(to bottom right, #dbe7f0 0%, #527ce0 50%, #03077c 100%)",
        }}
      />
    </div>
  );
};

const generateSvg = async (element: ReactElement, options: SatoriOptions) => {
  return satori(element, {
    width: options.width,
    height: options.height,
    fonts: [],
  });
};

const convertSvgToPng = async (svg: string) => {
  return sharp(Buffer.from(svg)).png().toBuffer();
};

export const generateIcon = async (
  satoriOptions: SatoriOptions,
  iconStyleOptions?: IconStyleOptions,
  format: "svg" | "png" = "svg",
) => {
  const element = createIconElement(iconStyleOptions);
  const svg = await generateSvg(element, satoriOptions);

  if (format === "png") {
    return convertSvgToPng(svg);
  }

  return svg;
};
