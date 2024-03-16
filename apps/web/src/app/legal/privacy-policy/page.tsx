import type { Metadata } from 'next';
import * as React from 'react';
import { notFound } from 'next/navigation';
import { allLegals } from 'contentlayer/generated';

import { LegalLayout } from '#/ui/feature/legal';
import { JsonLd } from './json-ld';

export const generateMetadata = () => {
  const privacyPolicy = allLegals.find((legal) => legal.title === 'Privacy Policy');
  if (!privacyPolicy) return {};
  const { title, description, slug, publishedAt, updatedAt } = privacyPolicy;
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
  const privacyPolicy = allLegals.find((legal) => legal.title === 'Privacy Policy');
  if (!privacyPolicy) return notFound();

  return (
    <>
      <JsonLd />
      <LegalLayout legal={privacyPolicy} />
    </>
  );
};

export default Page;
