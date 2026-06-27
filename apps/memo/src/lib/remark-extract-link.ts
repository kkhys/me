import type { Root } from "mdast";
import { visit } from "unist-util-visit";

interface VFile {
  data: {
    astro?: {
      frontmatter?: Record<string, unknown>;
    };
  };
}

const remarkExtractLink = () => (tree: Root, file: VFile) => {
  let firstExternalLink: string | null = null;

  visit(tree, "link", (node) => {
    if (firstExternalLink) return;

    const url = node.url;

    if (/^https?:\/\//i.test(url)) {
      firstExternalLink = url;
    }
  });

  if (!file.data.astro) {
    file.data.astro = {};
  }

  if (!file.data.astro.frontmatter) {
    file.data.astro.frontmatter = {};
  }

  file.data.astro.frontmatter.firstExternalLink = firstExternalLink;
};

export default remarkExtractLink;
