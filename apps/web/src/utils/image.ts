import { readFileSync } from "node:fs";
import path from "node:path";
import { getPlaiceholder } from "plaiceholder";

export const getImage = async (src: string) => {
  const buffer = src.startsWith("http")
    ? await fetch(src).then(async (res) => Buffer.from(await res.arrayBuffer()))
    : readFileSync(path.join("./public", src));

  const {
    metadata: { height, width },
    ...plaiceholder
  } = await getPlaiceholder(buffer);

  return {
    ...plaiceholder,
    img: { src, height, width },
  };
};
