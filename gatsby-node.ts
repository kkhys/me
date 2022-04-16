import type { GatsbyNode } from 'gatsby';
import path from 'path';

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions: { setWebpackConfig },
}) => {
  setWebpackConfig({
    resolve: {
      alias: {
        '@': path.resolve('src'),
        _: path.resolve('src/components'),
      },
    },
  });
};
