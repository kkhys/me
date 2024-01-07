import * as React from 'react';
import type { MDXComponents } from 'mdx/types';
import { useMDXComponent } from 'next-contentlayer/hooks';

import { Heading } from './heading';

const components = {
  h2: ({ children, ...props }: Omit<React.ComponentPropsWithoutRef<typeof Heading>, 'level'>) => (
    <Heading level={2} {...props}>
      {children}
    </Heading>
  ),
  h3: ({ children, ...props }: Omit<React.ComponentPropsWithoutRef<typeof Heading>, 'level'>) => (
    <Heading level={3} {...props}>
      {children}
    </Heading>
  ),
} satisfies MDXComponents;

export const Mdx = ({ code }: { code: string }) => {
  const Component = useMDXComponent(code);

  return <Component components={{ ...components }} />;
};
