import fetchSiteMetadata from "fetch-site-metadata";
import type { Link, Resource } from "mdast";
import type { State } from "mdast-util-to-hast";
import { getPlaiceholder } from "plaiceholder";
import type { Node, Parent } from "unist";
import { visit } from "unist-util-visit";

import { isSingleChildLinkWithText } from "./utils";

interface LinkCard extends Parent, Resource {
  type: "link-card";
  meta: {
    url: string;
    title: string;
    description: string;
    ogSrc?: string;
    ogWidth?: number;
    ogHeight?: number;
    ogBlurDataURL?: string;
    iconSrc?: string;
    iconWidth?: number;
    iconHeight?: number;
    iconBlurDataURL?: string;
  };
}

type OgType =
  | {
      ogSrc: string;
      ogWidth: number;
      ogHeight: number;
      ogBlurDataURL: string;
    }
  | undefined;

type IconType =
  | {
      iconSrc: string;
      iconWidth: number;
      iconHeight: number;
      iconBlurDataURL: string;
    }
  | undefined;

const fetchMeta = async (url: string) => {
  const data = await fetchSiteMetadata(url);

  return {
    url,
    title: data.title ?? "(No title)",
    description: data.description ?? "",
    og: data.image?.src?.startsWith("https") ? data.image?.src : undefined,
    icon: data.icon?.startsWith("https") ? data.icon : undefined,
  };
};

const getImage = async (src: string) => {
  const buffer = await fetch(src).then(async (res) =>
    Buffer.from(await res.arrayBuffer()),
  );

  const {
    metadata: { height, width },
    ...plaiceholder
  } = await getPlaiceholder(buffer);

  return {
    ...plaiceholder,
    img: { src, height, width },
  };
};

export const remarkLinkCard = () => {
  return async (tree: Node) => {
    const promises: (() => Promise<void>)[] = [];

    visit(tree, "paragraph", (node: Parent, index, parent: Parent) => {
      const linkNode = node.children[0] as Link;
      if (!isSingleChildLinkWithText(node, linkNode) || !parent) return;

      promises.push(async () => {
        const data = await fetchMeta(linkNode.url);
        const ogSrc = data.og;
        const iconSrc = data.icon;

        let og: OgType;
        if (typeof ogSrc === "string") {
          const { img, base64 } = await getImage(ogSrc);
          og = {
            ogSrc,
            ogWidth: img.width,
            ogHeight: img.height,
            ogBlurDataURL: base64,
          };
        }

        let icon: IconType;
        if (typeof iconSrc === "string") {
          const { img, base64 } = await getImage(iconSrc);
          icon = {
            iconSrc,
            iconWidth: img.width,
            iconHeight: img.height,
            iconBlurDataURL: base64,
          };
        }

        parent.children[index ?? 0] = {
          type: "link-card",
          meta: {
            url: data.url,
            title: data.title ?? "(No title)",
            description: data.description ?? "",
            ...og,
            ...icon,
          },
        } as LinkCard;
      });
    });

    await Promise.allSettled(promises.map((t) => t()));
  };
};

export const linkCardHandler = (_: State, node: LinkCard) => {
  return {
    type: "element",
    tagName: "link-card",
    properties: {
      url: node.meta.url,
      title: node.meta.title,
      description: node.meta.description,
      ogSrc: node.meta.ogSrc,
      ogWidth: node.meta.ogWidth,
      ogHeight: node.meta.ogHeight,
      ogBlurDataURL: node.meta.ogBlurDataURL,
      iconSrc: node.meta.iconSrc,
      iconWidth: node.meta.iconWidth,
      iconHeight: node.meta.iconHeight,
      iconBlurDataURL: node.meta.iconBlurDataURL,
    },
    children: [],
  };
};
