import { generateIcon } from "./utils";

export const Icon192Png = async () => {
  return (await generateIcon(
    { width: 192, height: 192 },
    undefined,
    "png",
  )) as Buffer;
};
