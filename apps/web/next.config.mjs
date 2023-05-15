/** @type { import('next').NextConfig } */

import { withContentlayer } from 'next-contentlayer';

const nextConfig = {
  experimental: {
    appDir: true,
    mdxRs: true,
  },
  transpilePackages: ['@kkhys/ui'],
};

export default withContentlayer(nextConfig);
