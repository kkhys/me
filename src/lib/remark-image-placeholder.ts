import path from "node:path";

import { visit } from "unist-util-visit";

import type { Image, Root } from "mdast";

import type { VFile } from "vfile";
import { getBlur } from "./api/blur";

const remarkImagePlaceholder = () => async (tree: Root, file: VFile) => {
  const images: Image[] = [];

  visit(
    tree,
    "image",
    (node) => !node.url.startsWith("http") && images.push(node),
  );

  const mdxDir = path.dirname(file.path);

  await Promise.all(
    images.map(async (node) => {
      const buffer = await Bun.file(path.join(mdxDir, node.url)).arrayBuffer();
      const base64 = await getBlur(Buffer.from(buffer), 8, "webp");

      node.data = {
        ...node.data,
        hProperties: {
          placeholder: base64,
        },
      };
    }),
  );
};

export default remarkImagePlaceholder;
