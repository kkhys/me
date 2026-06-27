/** @jsxImportSource react */
/** @jsxRuntime automatic */

import satori from "satori";
import sharp from "sharp";
import { loadFont } from "#/utils/font-loader";

export const siteOpengraphImage = async () => {
  const interSemiBold = await loadFont("./src/assets/Inter_28pt-SemiBold.ttf");

  const svg = await satori(
    <div
      style={{
        background: "#fcfcfc", // uchu-yang (oklch(99.4% 0 0))
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        padding: "80px",
      }}
    >
      <div
        style={{
          fontSize: "70px",
          background: "#fcfcfc", // uchu-yang (oklch(99.4% 0 0))
          fontFamily: "Inter",
          color: "#0e1117", // uchu-yin (oklch(14.38% 0.007 256.88))
        }}
      >
        Keisuke Hayashi
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
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

  return sharp(Buffer.from(svg)).png().toBuffer();
};
