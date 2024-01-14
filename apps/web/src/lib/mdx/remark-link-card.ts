import fetchSiteMetadata from 'fetch-site-metadata';
import type { Link, Resource } from 'mdast';
import type { State } from 'mdast-util-to-hast';
import type { Node, Parent } from 'unist';
import { is } from 'unist-util-is';
import { visit } from 'unist-util-visit';

interface LinkCard extends Parent, Resource {
  type: 'link-card';
  meta: {
    url: string;
    title: string;
    description: string;
    og?: string;
    icon?: string;
  };
}

const fetchMeta = async (url: string) => {
  const data = await fetchSiteMetadata(url);

  return {
    url,
    title: data.title ?? '(No title)',
    description: data.description ?? '',
    og: data.image?.src?.startsWith('https') ? data.image?.src : undefined,
    icon: data.icon?.startsWith('https') ? data.icon : undefined,
  };
};

export const remarkLinkCard = () => {
  return async (tree: Node) => {
    const promises: (() => Promise<void>)[] = [];

    visit(tree, 'paragraph', (node: Parent, index, parent: Parent) => {
      if (node.children.length !== 1) return;

      const maybeLink = node.children[0] as Link;

      if (!is(maybeLink, 'link')) return;
      if (maybeLink.children.length !== 1) return;
      if (!(is(maybeLink.children[0], 'text') && maybeLink.url === maybeLink.children[0].value)) return;
      if (!parent) return;

      promises.push(async () => {
        const data = await fetchMeta(maybeLink.url);

        parent.children[index ?? 0] = {
          type: 'link-card',
          meta: data,
        } as LinkCard;
      });
    });

    await Promise.allSettled(promises.map((t) => t()));
  };
};

export const linkCardHandler = (_: State, node: LinkCard) => {
  return {
    type: 'element',
    tagName: 'link-card',
    properties: {
      url: node.meta.url,
      title: node.meta.title,
      description: node.meta.description,
      og: node.meta.og,
      icon: node.meta.icon,
    },
    children: [],
  };
};
