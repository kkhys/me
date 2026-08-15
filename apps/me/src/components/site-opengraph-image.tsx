import { createSiteOgImage } from "@kkhys/og/og";
import { uchuHex } from "@kkhys/styles/colors";
import { loadFont } from "#/utils/font-loader";

export const siteOpengraphImage = async () => {
  const interSemiBold = await loadFont("./src/assets/Inter_28pt-SemiBold.ttf");

  return createSiteOgImage({
    text: "Keisuke Hayashi",
    background: uchuHex.yang,
    innerBackground: uchuHex.yang,
    color: uchuHex.yin,
    fontData: interSemiBold,
  });
};
