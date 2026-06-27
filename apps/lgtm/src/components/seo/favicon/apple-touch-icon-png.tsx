import { generateIcon } from "./utils";

export const AppleTouchIconPng = async () => {
  return (await generateIcon(
    { width: 180, height: 180 },
    { width: 140, height: 140 },
    "png",
  )) as Buffer;
};
