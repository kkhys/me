import type { Legal } from 'contentlayer/generated';
import * as React from 'react';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

import { FadeIn, FadeInStagger, Prose } from '@kkhys/ui';

import { BackButton, Container } from '#/ui/global';

export const LegalLayout = ({ legal }: { legal: Legal }) => {
  const {
    title,
    publishedAt,
    updatedAt,
    body: { html },
  } = legal;

  return (
    <Container>
      <BackButton />
      <FadeInStagger>
        <FadeIn>
          <h1 className='font-sans font-medium'>{title}</h1>
        </FadeIn>
        <Prose>
          <FadeIn>
            <div dangerouslySetInnerHTML={{ __html: html }} />
            <p className='mb-2 flex justify-end'>
              {format(parseISO(publishedAt), 'yyyy年M月d日', { locale: ja })}{' '}
              制定
            </p>
            {updatedAt && (
              <p className='mt-2 flex justify-end'>
                {format(parseISO(updatedAt), 'yyyy年M月d日', { locale: ja })}{' '}
                改定
              </p>
            )}
          </FadeIn>
        </Prose>
      </FadeInStagger>
    </Container>
  );
};
