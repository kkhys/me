import type { Link, Resource } from 'mdast';
import type { State } from 'mdast-util-to-hast';
import type { Node, Parent } from 'unist';
import { is } from 'unist-util-is';
import { visit } from 'unist-util-visit';

interface YouTubeEmbed extends Parent, Resource {
  type: 'youtube-embed';
  meta: {
    videoId: string;
  };
}

const extractYouTubeVideoId = (url: string) => {
  const matched =
    /^https?:\/\/(www\.)?youtube\.com\/watch\?(.*&)?v=(?<videoId>[^&]+)/.exec(url) ??
    /^https?:\/\/youtu\.be\/(?<videoId>[^?]+)/.exec(url) ??
    /^https?:\/\/(www\.)?youtube\.com\/embed\/(?<videoId>[^?]+)/.exec(url);

  return matched?.groups?.videoId ?? null;
};

export const remarkYouTubeEmbed = () => {
  return (tree: Node) => {
    visit(tree, 'paragraph', (node: Parent, index: number, parent: Parent) => {
      if (node.children.length !== 1) return;

      const maybeLink = node.children[0] as Link;

      if (!is(maybeLink, 'link')) return;
      if (maybeLink.children.length !== 1) return;
      if (!(is(maybeLink.children[0], 'text') && maybeLink.url === maybeLink.children[0].value)) return;
      if (!parent) return;

      const videoId = extractYouTubeVideoId(maybeLink.url);

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
