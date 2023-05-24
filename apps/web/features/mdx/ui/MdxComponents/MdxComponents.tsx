export const mdxComponents = {
  h1: (props: JSX.IntrinsicElements['h2']) => <h2 {...props} />,
  h2: (props: JSX.IntrinsicElements['h3']) => <h3 {...props} />,
};
