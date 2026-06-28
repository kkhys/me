import { createFaviconGenerators } from "@kkhys/og/favicon";

const gradient = "radial-gradient(circle at 35% 35%, #c8e6c9 0%, #81c784 40%, #4caf50 100%)";

export const { IconSvg, Icon192Png, Icon512Png, IconMaskPng, AppleTouchIconPng } =
  createFaviconGenerators(gradient);
