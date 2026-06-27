/** @jsxImportSource react */
/** @jsxRuntime automatic */

import { readFile } from "node:fs/promises";
import satori from "satori";
import sharp from "sharp";
import { TITLE } from "#/config/constants";

export const OpengraphImage = async () => {
  const BBHBartleRegular = await readFile("./src/assets/BBHBartle-Regular.ttf");

  const textColor = "#FEFEFE";
  const strokeColor = "#252426";

  const svg = await satori(
    <div
      style={{
        background: "#fff",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: "120px",
          fontFamily: "BBHBartle",
          color: textColor,
          WebkitTextStroke: `3px ${strokeColor}`,
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
          name: "BBHBartle",
          data: BBHBartleRegular,
        },
      ],
    },
  );

  return sharp(Buffer.from(svg)).png().toBuffer();
};
