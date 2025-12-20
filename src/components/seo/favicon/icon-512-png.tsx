/** @jsxImportSource react */
/** @jsxRuntime automatic */

import satori from "satori";
import sharp from "sharp";

export const Icon512Png = async () => {
  const svg = await satori(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, #ffffff 0%, #d0d0d0 40%, #808080 100%)",
        }}
      />
    </div>,
    {
      width: 512,
      height: 512,
      fonts: [],
    },
  );

  return sharp(Buffer.from(svg)).png().toBuffer();
};
