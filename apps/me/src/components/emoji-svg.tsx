/** @jsxImportSource react */
/** @jsxRuntime automatic */

import satori from "satori";
import { getFirstGrapheme, getIconCode, loadEmoji } from "#/lib/api/emoji";
import { loadFont } from "#/utils/font-loader";

export const emojiSvg = async ({
  emoji,
  isColored = false,
}: {
  emoji: string;
  isColored?: boolean;
}) => {
  const firstEmoji = getFirstGrapheme(emoji);

  const selectedFont = isColored
    ? await loadFont("./src/assets/Inter-Medium.ttf")
    : await loadFont("./src/assets/NotoEmoji-Regular.ttf");

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
          const iconCode = getIconCode(segment);
          // Prefer fluent, but fall back to twemoji for emojis fluent omits
          // (notably country/region flags).
          const result =
            (await loadEmoji("fluent", iconCode)) ?? (await loadEmoji("twemoji", iconCode));
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
