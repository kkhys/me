/** @jsxImportSource react */
/** @jsxRuntime automatic */

import { readFile } from "node:fs/promises";
import satori from "satori";
import { getIconCode, loadEmoji } from "#/lib/api/emoji";

export const emojiSvg = async ({
  emoji,
  isColored = false,
}: {
  emoji: string;
  isColored?: boolean;
}) => {
  const firstEmoji = Array.from(emoji)[0];

  const selectedFont = isColored
    ? await readFile("./src/assets/Inter-Medium.ttf")
    : await readFile("./src/assets/NotoEmoji-Regular.ttf");

  return await satori(
    <div
      style={{
        fontSize: 21,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Selected Font",
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
          name: "Selected Font",
          data: selectedFont,
          style: "normal",
          weight: 400,
        },
      ],
      loadAdditionalAsset: async (code: string, segment: string) => {
        if (isColored && code === "emoji") {
          const result = await loadEmoji("fluent", getIconCode(segment));
          if (!result) {
            throw new Error(`Failed to load emoji for segment: ${segment}`);
          }
          return `data:image/svg+xml;base64,${Buffer.from(result, "utf8").toString("base64")}`;
        }
        return code;
      },
    },
  );
};
