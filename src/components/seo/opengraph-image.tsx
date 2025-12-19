/** @jsxImportSource react */
/** @jsxRuntime automatic */

import { TITLE } from "#/config/constants";
import { readFile } from "node:fs/promises";
import satori from "satori";
import sharp from "sharp";

export const OpengraphImage = async () => {
  const interSemiBold = await readFile("./src/assets/Inter_28pt-SemiBold.ttf");

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
          fontSize: "70px",
          background: "#fdfdfc",
          fontFamily: "Inter",
          color: "#21201c",
        }}
      >
        {TITLE}
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
