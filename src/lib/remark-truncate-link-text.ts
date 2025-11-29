import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export const truncateLinkText = (url: string) => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const pathname = urlObj.pathname;

    if (!pathname || pathname === "/") {
      return hostname;
    }

    const pathParts = pathname.split("/").filter(Boolean);
    return `${hostname}/${pathParts[0]}…`;
  } catch {
    return url;
  }
};

const remarkTruncateLinkText = () => (tree: Root) => {
  visit(tree, "link", (node) => {
    if (!/^https?:\/\//i.test(node.url)) {
      return;
    }

    const firstChild = node.children[0];
    if (node.children.length === 1 && firstChild?.type === "text") {
      const originalText = firstChild.value;

      if (/^https?:\/\//i.test(originalText)) {
        firstChild.value = truncateLinkText(node.url);
      }
    }
  });
};

export default remarkTruncateLinkText;
