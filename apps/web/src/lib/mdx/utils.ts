import type { Link } from 'mdast';
import type { Parent } from 'unist';
import { is } from 'unist-util-is';

export const isSingleChildLinkWithText = (node: Parent, child: Link) =>
  node.children.length === 1 &&
  is(child, 'link') &&
  child.children.length === 1 &&
  is(child.children[0], 'text') &&
  child.url === child.children[0].value;
