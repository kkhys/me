/** @jsxImportSource react */
/** @jsxRuntime automatic */

import { readFile } from "node:fs/promises";
import satori from "satori";
import sharp from "sharp";
import { getBudouxParser } from "#/lib/budoux";

const parser = getBudouxParser();

export const opengraphImage = async ({ title }: { title: string }) => {
  const interSemiBold = await readFile("./src/assets/NotoSerifJP-SemiBold.ttf");

  const svg = await satori(
    <div
      style={{
        background: "#fff",
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
          background: "#fdfdfc",
          fontFamily: "Inter",
          color: "#21201c",
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
