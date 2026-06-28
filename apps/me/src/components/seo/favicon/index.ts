import { createFaviconGenerators } from "@kkhys/og/favicon";

const gradient = "linear-gradient(to bottom right, #dbe7f0 0%, #527ce0 50%, #03077c 100%)";

export const { IconSvg, Icon192Png, Icon512Png, IconMaskPng, AppleTouchIconPng } =
  createFaviconGenerators(gradient);
