import * as React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allLegals } from 'contentlayer/generated';

import { site } from '#/config';
import { LegalLayout } from '#/ui/feature/legal';

export const generateMetadata = () => {
  const privacyPolicy = allLegals.find((legal) => legal.title === 'Privacy Policy');
  if (!privacyPolicy) return {};
  const { title, description, slug, publishedAt, updatedAt } = privacyPolicy;
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
  const privacyPolicy = allLegals.find((legal) => legal.title === 'Privacy Policy');
  if (!privacyPolicy) return notFound();

  return <LegalLayout legal={privacyPolicy} />;
};

export default Page;
