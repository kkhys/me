import type { MetadataRoute } from 'next';

const robots = (): MetadataRoute.Robots => {
  return {
    rules: [
      {
        userAgent: 'Yahoo Pipes 1.0',
        disallow: '/',
      },
      {
        userAgent: '008',
        disallow: '/',
      },
      {
        userAgent: 'voltron',
        disallow: '/',
      },
      {
        userAgent: 'Bytespider',
        disallow: '/',
      },
      {
        userAgent: 'Livelapbot',
        disallow: '/',
      },
      {
        userAgent: 'Megalodon',
        disallow: '/',
      },
      {
        userAgent: 'ia_archiver',
        disallow: '/',
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
    ],
    sitemap: 'https://kkhys.me/sitemap.xml',
  };
};

export default robots;
