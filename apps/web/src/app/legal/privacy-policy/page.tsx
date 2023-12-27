import * as React from 'react';
import { notFound } from 'next/navigation';
import { allLegals } from 'contentlayer/generated';

import { LegalLayout } from '#/ui/feature/legal';

const Page = () => {
  const privacyPolicy = allLegals.find((legal) => legal.title === 'Privacy Policy');
  if (!privacyPolicy) return notFound();

  return <LegalLayout legal={privacyPolicy} />;
};

export default Page;
