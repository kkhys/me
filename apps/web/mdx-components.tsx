import type { MDXComponents } from 'mdx/types';

export const useMDXComponents = (components: MDXComponents): MDXComponents => {
  return {
    h1: ({ children }) => <h1 style={{ fontSize: '100px' }}>{children}</h1>,
    ...components,
  };
};
