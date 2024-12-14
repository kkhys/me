import { readFile } from "node:fs/promises";
import * as path from "node:path";
import type { Image } from "mdast";
import { getPlaiceholder } from "plaiceholder";
import type { Node } from "unist";
import { visit } from "unist-util-visit";

export const remarkNextImage = () => {
  return async (tree: Node) => {
    const promises: (() => Promise<void>)[] = [];
    visit(tree, "image", (node: Image) => {
      const src = node.url;

      const getImage = async (src: string) => {
        const buffer = src.startsWith("http")
          ? await fetch(src).then(async (res) =>
              Buffer.from(await res.arrayBuffer()),
            )
          : await readFile(path.join("./public", src));

        const {
          metadata: { height, width },
          ...plaiceholder
        } = await getPlaiceholder(buffer);

        return {
          ...plaiceholder,
          img: { src, height, width },
        };
      };

      promises.push(async () => {
        const { img, base64 } = await getImage(src);

        node.data = {
          hProperties: {
            src: src,
            width: img.width,
            height: img.height,
            aspectRatio: `${img.width} / ${img.height}`,
            blurDataURL: base64,
          },
        };
      });
    });

    await Promise.allSettled(promises.map((t) => t()));
  };
};
