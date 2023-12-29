import * as React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allLegals } from 'contentlayer/generated';

import { serverEnv } from '#/env/index.mjs';
import { LegalLayout } from '#/ui/feature/legal';

export const generateMetadata = () => {
  const privacyPolicy = allLegals.find((legal) => legal.title === 'Privacy Policy');
  if (!privacyPolicy) return {};
  const { title, description, slug, publishedAt, updatedAt } = privacyPolicy;
  const url = `${serverEnv.BASE_URL}/legal/${slug}`;

  return {
    title,
    description: description ?? undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      title,
      url,
      publishedTime: publishedAt,
      modifiedTime: updatedAt ?? undefined,
      siteName: 'Keisuke Hayashi',
      locale: 'ja_JP',
    },
    twitter: {
      title,
      card: 'summary',
      siteId: '5237731',
      creator: '@kkhys_',
      creatorId: '5237731',
    },
  } satisfies Metadata;
};

const Page = () => {
  const privacyPolicy = allLegals.find((legal) => legal.title === 'Privacy Policy');
  if (!privacyPolicy) return notFound();

  return <LegalLayout legal={privacyPolicy} />;
};

export default Page;
