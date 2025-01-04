import { readFileSync } from "node:fs";
import path from "node:path";
import * as React from "react";
import satori from "satori";

export const generateEmojiSvg = async ({
  emoji,
}: {
  emoji: string;
}) => {
  const firstEmoji = Array.from(emoji)[0];

  const notoEmojiRegular = readFileSync(
    path.resolve(process.cwd(), "assets", "fonts", "NotoEmoji-Regular.ttf"),
  );

  return await satori(
    <div
      style={{
        fontSize: 21,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Noto Emoji",
        fontSmooth: "antialiased",
      }}
    >
      {firstEmoji}
    </div>,
    {
      width: 24,
      height: 24,
      fonts: [
        {
          name: "Noto Emoji",
          data: notoEmojiRegular,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
};
