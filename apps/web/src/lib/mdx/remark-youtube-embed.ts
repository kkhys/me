import type { Link, Resource } from 'mdast';
import type { State } from 'mdast-util-to-hast';
import type { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

import { isSingleChildLinkWithText } from './utils';

interface YouTubeEmbed extends Parent, Resource {
  type: 'youtube-embed';
  meta: {
    videoId: string;
  };
}

const extractYouTubeVideoId = (url: string) => {
  const matched =
    /^https?:\/\/(www\.)?youtube\.com\/watch\?(.*&)?v=(?<videoId>[^&]+)/.exec(
      url,
    ) ??
    /^https?:\/\/youtu\.be\/(?<videoId>[^?]+)/.exec(url) ??
    /^https?:\/\/(www\.)?youtube\.com\/embed\/(?<videoId>[^?]+)/.exec(url);

  return matched?.groups?.videoId ?? null;
};

export const remarkYouTubeEmbed = () => {
  return (tree: Node) => {
    visit(tree, 'paragraph', (node: Parent, index: number, parent: Parent) => {
      const linkNode = node.children[0] as Link;
      if (!isSingleChildLinkWithText(node, linkNode) || !parent) return;

      const videoId = extractYouTubeVideoId(linkNode.url);
      if (!videoId) return;

      parent.children[index] = {
        type: 'youtube-embed',
        meta: {
          videoId,
        },
      } as YouTubeEmbed;
    });
  };
};

export const YouTubeEmbedHandler = (_: State, node: YouTubeEmbed) => {
  return {
    type: 'element',
    tagName: 'youtube-embed',
    properties: {
      videoId: node.meta.videoId,
    },
    children: [],
  };
};
