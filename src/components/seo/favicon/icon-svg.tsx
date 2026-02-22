import { generateIcon } from "./utils";

export const IconSvg = async () => {
  return (await generateIcon(
    { width: 500, height: 500 },
    undefined,
    "svg",
  )) as string;
};
