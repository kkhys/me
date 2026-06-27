import type { Root } from "mdast";
import { visit } from "unist-util-visit";
import { isBareExternalLink } from "./mdast-util-node-is";

/**
 * Extract YouTube video ID from various YouTube URL formats
 *
 * @description Supports multiple YouTube URL formats including:
 * - Standard watch URLs: https://www.youtube.com/watch?v=VIDEO_ID
 * - Short URLs: https://youtu.be/VIDEO_ID
 * - Embed URLs: https://www.youtube.com/embed/VIDEO_ID
 * - Mobile URLs: https://m.youtube.com/watch?v=VIDEO_ID
 *
 * @param url - The YouTube URL to extract the video ID from
 * @returns The extracted video ID or null if not found
 *
 * @example
 * ```typescript
 * extractYoutubeId("https://www.youtube.com/watch?v=kpz_U8wHpa8")
 * // Returns: "kpz_U8wHpa8"
 *
 * extractYoutubeId("https://youtu.be/kpz_U8wHpa8")
 * // Returns: "kpz_U8wHpa8"
 * ```
 */
const extractYoutubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/i,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Remark plugin to convert bare YouTube URLs to youtube-block components
 *
 * @description This plugin automatically transforms standalone YouTube URLs
 * in MDX content into custom `youtube-block` components. It uses lite-youtube-embed
 * internally to provide lazy-loading YouTube embeds that only load resources
 * when the user clicks the play button.
 *
 * The plugin:
 * 1. Identifies paragraphs containing only a single bare external link
 * 2. Checks if the URL is a valid YouTube link
 * 3. Extracts the video ID from the URL
 * 4. Replaces the link with an MDX JSX element (youtube-block)
 *
 * @returns A unified transformer function
 *
 * @example
 * ```mdx
 * // Input MDX:
 * https://www.youtube.com/watch?v=kpz_U8wHpa8
 *
 * // Output (transformed):
 * <youtube-block videoId="kpz_U8wHpa8" />
 * ```
 */
const remarkYoutubeBlock = () => (tree: Root) => {
  visit(tree, "paragraph", (node, index, parent) => {
    if (!parent || typeof index !== "number" || node.children.length !== 1) {
      return;
    }

    const child = node.children[0];

    if (!isBareExternalLink(child)) {
      return;
    }

    const videoId = extractYoutubeId(child.url);

    if (!videoId) {
      return;
    }

    // Replace a paragraph with an MDX JSX element
    parent.children[index] = {
      type: "mdxJsxFlowElement",
      name: "youtube-block",
      attributes: [
        {
          type: "mdxJsxAttribute",
          name: "videoId",
          value: videoId,
        },
      ],
      children: [],
    };
  });
};

export default remarkYoutubeBlock;
