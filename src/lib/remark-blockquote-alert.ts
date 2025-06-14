import type { Paragraph, PhrasingContent, Root, Text } from "mdast";
import { visit } from "unist-util-visit";

const alertRegex = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)]/i;

const processAlertParagraph = (
  item: Paragraph,
  text: string,
): PhrasingContent[] => {
  if (text.includes("\n")) {
    item.children[0] = {
      type: "text",
      value: text.replace(alertRegex, "").replace(/^\n+/, ""),
    } as Text;
    return item.children;
  }

  return item.children
    .slice(1)
    .filter((child, idx) => !(idx === 0 && child.type === "break"));
};

const remarkBlockQuoteAlert = () => (tree: Root) => {
  visit(tree, "blockquote", (node) => {
    let alertType = "";
    let processed = false;

    node.children = node.children.map((item) => {
      if (processed || item.type !== "paragraph") return item;

      const paragraph = item as Paragraph;
      const firstNode = paragraph.children[0];
      if (!firstNode || firstNode.type !== "text") return item;

      const textNode = firstNode as Text;
      const match = textNode.value.match(alertRegex);
      if (!match?.[1]) return item;

      processed = true;
      alertType = match[1].toLowerCase();
      paragraph.children = processAlertParagraph(paragraph, textNode.value);

      return paragraph;
    });

    if (alertType) {
      node.data = {
        hName: "div",
        hProperties: {
          dataAlertType: alertType,
        },
      };
    }
  });
};

export default remarkBlockQuoteAlert;
