import type {
  FootnoteDefinition,
  FootnoteReference,
  Link,
  Paragraph,
  Text,
} from "mdast";
import type { Literal, Node, Parent } from "unist";

const isObject = (target: unknown): target is { [key: string]: unknown } =>
  typeof target === "object" && target !== null;

export const isNode = (node: unknown): node is Node =>
  isObject(node) && "type" in node;

export const isParent = (node: unknown): node is Parent =>
  isObject(node) && Array.isArray(node.children);

export const isLiteral = (node: unknown): node is Literal =>
  isObject(node) && "value" in node;

export const isParagraph = (node: unknown): node is Paragraph =>
  isNode(node) && node.type === "paragraph";

export const isText = (node: unknown): node is Text =>
  isLiteral(node) && node.type === "text" && typeof node.value === "string";

export const isLink = (node: unknown): node is Link =>
  isNode(node) && node.type === "link";

export const isBareExternalLink = (
  node: unknown,
): node is Link & { children: [Text] } =>
  isLink(node) &&
  isText(node.children[0]) &&
  node.children[0].value === node.url &&
  node.url.startsWith("http");

export const isFootnoteDefinition = (
  node: unknown,
): node is FootnoteDefinition =>
  isNode(node) && node.type === "footnoteDefinition";

export const isFootnoteReference = (node: unknown): node is FootnoteReference =>
  isNode(node) && node.type === "footnoteReference";
