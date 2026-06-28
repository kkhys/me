import type { Root } from "mdast";
import { visit } from "unist-util-visit";

const MAX_LENGTH = 60;

export const truncateLinkText = (url: string) => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const pathname = urlObj.pathname;
    const search = urlObj.search;
    const hash = urlObj.hash;

    if (!pathname || pathname === "/") {
      return hostname;
    }

    const firstPart = pathname.split("/").find(Boolean);
    const truncated = `${hostname}/${firstPart}`;

    // プロトコルを除いた全体のパス (クエリとハッシュも含む)
    const fullPath = `${hostname}${pathname}${search}${hash}`;

    // 省略後の長さが MAX_LENGTH 以下で、かつ元のURLに続きがある場合のみ … を付ける
    // (パスが複数セグメント、またはクエリ/ハッシュがある場合)
    if (truncated.length <= MAX_LENGTH && fullPath.length > truncated.length) {
      return `${truncated}…`;
    }

    return truncated;
  } catch {
    return url;
  }
};

const remarkTruncateLinkText = () => (tree: Root) => {
  visit(tree, "link", (node) => {
    if (!/^https?:\/\//iu.test(node.url)) {
      return;
    }

    const firstChild = node.children[0];
    if (node.children.length === 1 && firstChild?.type === "text") {
      const originalText = firstChild.value;

      if (/^https?:\/\//iu.test(originalText)) {
        firstChild.value = truncateLinkText(node.url);
      }
    }
  });
};

export default remarkTruncateLinkText;
