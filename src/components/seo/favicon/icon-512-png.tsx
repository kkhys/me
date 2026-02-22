import { generateIcon } from "./utils";

export const Icon512Png = async () => {
  return (await generateIcon(
    { width: 512, height: 512 },
    undefined,
    "png",
  )) as Buffer;
};
