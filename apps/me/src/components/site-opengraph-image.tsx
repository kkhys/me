import { createSiteOgImage } from "@kkhys/og/og";
import { loadFont } from "#/utils/font-loader";

export const siteOpengraphImage = async () => {
  const interSemiBold = await loadFont("./src/assets/Inter_28pt-SemiBold.ttf");

  return createSiteOgImage({
    text: "Keisuke Hayashi",
    // uchu-yang (oklch(99.4% 0 0))
    background: "#fcfcfc",
    // uchu-yang (oklch(99.4% 0 0))
    innerBackground: "#fcfcfc",
    // uchu-yin (oklch(14.38% 0.007 256.88))
    color: "#0e1117",
    fontData: interSemiBold,
  });
};
