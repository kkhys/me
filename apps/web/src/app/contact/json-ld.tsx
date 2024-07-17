import type { BreadcrumbList, WithContext } from 'schema-dts';
import * as React from 'react';

import { site } from '#/config';

export const JsonLd = () => {
  /**
   * @see https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
   */
  const jsonLdBreadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: site.title,
        item: site.url.base,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Contact',
      },
    ],
  } satisfies WithContext<BreadcrumbList>;

  return (
    <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLdBreadcrumbList]) }} />
  );
};
