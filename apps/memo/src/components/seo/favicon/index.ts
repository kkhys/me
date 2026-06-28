import { createFaviconGenerators } from "@kkhys/og/favicon";

const gradient = "radial-gradient(circle at 35% 35%, #ffffff 0%, #d0d0d0 40%, #808080 100%)";

export const { IconSvg, Icon192Png, Icon512Png, IconMaskPng, AppleTouchIconPng } =
  createFaviconGenerators(gradient);
