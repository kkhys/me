/** @jsxImportSource react */
/** @jsxRuntime automatic */

import satori from "satori";

export const emojiSvg = async ({
  emoji,
  isColored = false,
}: {
  emoji: string;
  isColored?: boolean;
}) => {
  const firstEmoji = Array.from(emoji)[0];

  const selectedFont = isColored
    ? await Bun.file("./src/assets/Inter-Medium.ttf").arrayBuffer()
    : await Bun.file("./src/assets/NotoEmoji-Regular.ttf").arrayBuffer();

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
          return `data:image/svg+xml;base64,${btoa(result)}`;
        }
        return code;
      },
    },
  );
};
