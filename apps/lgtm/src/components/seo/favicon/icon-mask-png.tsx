import { generateIcon } from "./utils";

export const IconMaskPng = async () => {
  return (await generateIcon(
    { width: 512, height: 512 },
    { width: 409, height: 409 },
    "png",
  )) as Buffer;
};
