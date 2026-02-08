/** @jsxImportSource react */
/** @jsxRuntime automatic */

import satori from "satori";
import sharp from "sharp";
import { getBudouxParser } from "#/lib/budoux";
import { loadFont } from "#/lib/font-loader";

const parser = getBudouxParser();

export const opengraphImage = async ({ title }: { title: string }) => {
  const interSemiBold = await loadFont("./src/assets/NotoSerifJP-SemiBold.ttf");

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
          display: "flex",
          flexWrap: "wrap",
          flexGrow: 1,
          fontSize: "50px",
          background: "#fcfcfc", // uchu-yang (oklch(99.4% 0 0))
          fontFamily: "Inter",
          color: "#0e1117", // uchu-yin (oklch(14.38% 0.007 256.88))
          lineHeight: "1.4",
        }}
      >
        {parser.parse(title).map((word) => (
          <span key={word} style={{ display: "block" }}>
            {word}
          </span>
        ))}
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
