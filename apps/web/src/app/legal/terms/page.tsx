import * as React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allLegals } from 'contentlayer/generated';

import { site } from '#/config';
import { LegalLayout } from '#/ui/feature/legal';

export const generateMetadata = () => {
  const terms = allLegals.find((legal) => legal.title === 'Terms of Service');
  if (!terms) return {};
  const { title, description, slug, publishedAt, updatedAt } = terms;
  const url = `${site.url.base}/legal/${slug}`;

  return {
    title,
    description: description ?? undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url,
      publishedTime: publishedAt,
      modifiedTime: updatedAt ?? undefined,
    },
  } satisfies Metadata;
};

const Page = () => {
  const terms = allLegals.find((legal) => legal.title === 'Terms of Service');
  if (!terms) return notFound();

  return <LegalLayout legal={terms} />;
};

export default Page;
