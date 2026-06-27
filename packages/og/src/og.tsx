/** @jsxImportSource react */
/** @jsxRuntime automatic */

import satori from "satori";
import sharp from "sharp";

interface SiteOgImageOptions {
  /** Text rendered in the lower-left of the card. */
  text: string;
  /** Outer card background. */
  background: string;
  /** Inner text-block background. */
  innerBackground: string;
  /** Text color. */
  color: string;
  /** Inter SemiBold (weight 600) font data. */
  fontData: ArrayBuffer | Buffer;
}

/**
 * Renders the shared default/site OG card (1200x630) used by both apps. The
 * layout is fixed; only colors and text vary per app. Returns a PNG Buffer.
 */
export const createSiteOgImage = async ({
  text,
  background,
  innerBackground,
  color,
  fontData,
}: SiteOgImageOptions): Promise<Buffer> => {
  const svg = await satori(
    <div
      style={{
        background,
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
          background: innerBackground,
          fontFamily: "Inter",
          color,
        }}
      >
        {text}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );

  return sharp(Buffer.from(svg)).png().toBuffer();
};
