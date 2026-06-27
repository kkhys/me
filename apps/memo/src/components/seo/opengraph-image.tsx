import { readFile } from "node:fs/promises";
import { createSiteOgImage } from "@kkhys/og/og";
import { TITLE } from "#/config/constants";

export const OpengraphImage = async () => {
  const interSemiBold = await readFile("./src/assets/Inter_28pt-SemiBold.ttf");

  return createSiteOgImage({
    text: TITLE,
    background: "#fff",
    innerBackground: "#fdfdfc",
    color: "#21201c",
    fontData: interSemiBold,
  });
};
