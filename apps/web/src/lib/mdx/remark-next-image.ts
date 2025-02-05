import type { Image } from "mdast";
import type { Node } from "unist";
import { visit } from "unist-util-visit";
import { getImage } from "#/utils/image";

export const remarkNextImage = () => {
  return async (tree: Node) => {
    const promises: (() => Promise<void>)[] = [];
    visit(tree, "image", (node: Image) => {
      const src = node.url;

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
