import type { Metadata } from 'next';
import * as React from 'react';
import { notFound } from 'next/navigation';
import { allLegals } from 'contentlayer/generated';

import { LegalLayout } from '#/ui/legal';
import { JsonLd } from './json-ld';

export const generateMetadata = () => {
  const terms = allLegals.find((legal) => legal.title === 'Terms of Service');
  if (!terms) return {};
  const { title, description, slug, publishedAt, updatedAt } = terms;
  const url = `/legal/${slug}`;

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

  return (
    <>
      <JsonLd />
      <LegalLayout legal={terms} />
    </>
  );
};

export default Page;
