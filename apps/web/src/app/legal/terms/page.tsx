import * as React from 'react';
import { notFound } from 'next/navigation';
import { allLegals } from 'contentlayer/generated';

import { LegalLayout } from '#/ui/feature/legal';

const Page = () => {
  const terms = allLegals.find((legal) => legal.title === 'Terms of Service');
  if (!terms) return notFound();

  return <LegalLayout legal={terms} />;
};

export default Page;
