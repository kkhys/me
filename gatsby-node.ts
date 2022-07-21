import path from 'path';
import type { GatsbyNode } from 'gatsby';

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions: { setWebpackConfig },
}) => {
  setWebpackConfig({
    resolve: {
      alias: {
        '@': path.resolve('src'),
        '^': path.resolve('src', 'components'),
      },
    },
  });
};
