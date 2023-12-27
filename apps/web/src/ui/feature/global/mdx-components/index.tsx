import { useMDXComponent } from 'next-contentlayer/hooks';

export const Mdx = ({ code }: { code: string }) => {
  const Component = useMDXComponent(code);

  return <Component />;
};
