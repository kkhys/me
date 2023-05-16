/** @type { import('next').NextConfig } */

import { withContentlayer } from 'next-contentlayer';

const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@kkhys/ui'],
};

export default withContentlayer(nextConfig);
