import type { MDXComponents } from "mdx/types";
import { useMDXComponent } from "next-contentlayer2/hooks";

const components = {} satisfies MDXComponents;

export const Mdx = ({ code }: { code: string }) => {
  const Component = useMDXComponent(code);

  return <Component components={{ ...components }} />;
};
