import type { Link, Resource } from "mdast";
import type { State } from "mdast-util-to-hast";
import type { Node, Parent } from "unist";
import { visit } from "unist-util-visit";

import { isSingleChildLinkWithText } from "./utils";

interface TweetEmbed extends Parent, Resource {
  type: "tweet-embed";
  meta: {
    tweetId: string;
  };
}

const extractTweetId = (url: string) => {
  const matched =
    /^https?:\/\/(www\.)?(twitter|x).com\/\w{1,15}\/status\/(?<tweetId>\d+)/.exec(
      url,
    );
  return matched?.groups?.tweetId ?? null;
};

export const remarkTweetEmbed = () => {
  return (tree: Node) => {
    visit(tree, "paragraph", (node: Parent, index: number, parent: Parent) => {
      const linkNode = node.children[0] as Link;
      if (!isSingleChildLinkWithText(node, linkNode) || !parent) return;

      const tweetId = extractTweetId(linkNode.url);
      if (!tweetId) return;

      parent.children[index] = {
        type: "tweet-embed",
        meta: { tweetId },
      } as TweetEmbed;
    });
  };
};

export const TweetEmbedHandler = (_: State, node: TweetEmbed) => {
  return {
    type: "element",
    tagName: "tweet-embed",
    properties: { tweetId: node.meta.tweetId },
    children: [],
  };
};
