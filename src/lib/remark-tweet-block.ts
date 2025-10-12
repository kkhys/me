import type { Root } from "mdast";
import { visit } from "unist-util-visit";
import { isBareExternalLink } from "./mdast-util-node-is";

/**
 * Extract tweet ID from Twitter/X URL
 */
const extractTweetId = (url: string) => {
  const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/i);
  return match?.[1] ?? null;
};

/**
 * Remark plugin to convert bare Twitter/X URLs to tweet-block components
 */
const remarkTweetBlock = () => (tree: Root) => {
  visit(tree, "paragraph", (node, index, parent) => {
    if (!parent || typeof index !== "number" || node.children.length !== 1) {
      return;
    }

    const child = node.children[0];

    if (!isBareExternalLink(child)) {
      return;
    }

    const tweetId = extractTweetId(child.url);

    if (!tweetId) {
      return;
    }

    // Replace it with an MDX JSX element
    parent.children[index] = {
      type: "mdxJsxFlowElement",
      name: "tweet-block",
      attributes: [
        {
          type: "mdxJsxAttribute",
          name: "id",
          value: tweetId,
        },
      ],
      children: [],
    };
  });
};

export default remarkTweetBlock;
