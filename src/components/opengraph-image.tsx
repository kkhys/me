/** @jsxImportSource react */
/** @jsxRuntime automatic */

import { readFile } from "node:fs/promises";
import satori from "satori";
import sharp from "sharp";

export const opengraphImage = async ({ emoji }: { emoji: string }) => {
  const firstEmoji = Array.from(emoji)[0];

  const notoEmojiSemiBold = await readFile(
    "./src/assets/NotoEmoji-SemiBold.ttf",
  );

  const svg = await satori(
    <div
      style={{
        fontSize: 250,
        background: "#0a0a0b",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Noto Emoji",
        color: "#e4e4e7",
      }}
    >
      {firstEmoji}
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Noto Emoji",
          data: notoEmojiSemiBold,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );

  return sharp(Buffer.from(svg))
    .png({
      quality: 60,
    })
    .toBuffer();
};
