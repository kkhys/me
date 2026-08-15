import { readFile } from "node:fs/promises";
import { createSiteOgImage } from "@kkhys/og/og";
import { uchuHex } from "@kkhys/styles/colors";
import { TITLE } from "#/config/constants";

export const OpengraphImage = async () => {
  const interSemiBold = await readFile("./src/assets/Inter_28pt-SemiBold.ttf");

  return createSiteOgImage({
    text: TITLE,
    background: uchuHex.yang,
    innerBackground: uchuHex.yang,
    color: uchuHex.yin,
    fontData: interSemiBold,
  });
};
