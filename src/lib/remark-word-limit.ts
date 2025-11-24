import type { Root } from "mdast";
import { toString as mdastToString } from "mdast-util-to-string";

const remarkWordLimit = () => (tree: Root) => {
  const text = mdastToString(tree);
  const totalLength = text.length;

  if (totalLength >= 140) {
    throw new Error(
      `Character count exceeds the limit: ${totalLength} characters (limit: 140 characters)`,
    );
  }
};

export default remarkWordLimit;
