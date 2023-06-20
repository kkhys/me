import { type Metadata } from 'next';
import { allFragments } from 'contentlayer/generated';
import { getMDXComponent } from 'next-contentlayer/hooks';

import { BasicLayout, PageHeader } from '#/features/global/ui';
import { mdxComponents } from '#/features/mdx';
import { Container, Prose } from '#/ui';

export const metadata = {
  title: 'About',
  openGraph: {
    title: 'About',
  },
} satisfies Metadata;

const AboutPage = () => {
  const {
    body: { code },
  } = allFragments.find((fragment) => fragment.id === 'about');

  const Content = getMDXComponent(code);

  return (
    <BasicLayout>
      <Container>
        <PageHeader title='About' className='mt-16' />
        <Prose className='mt-16'>
          <Content components={mdxComponents} />
        </Prose>
      </Container>
    </BasicLayout>
  );
};

export default AboutPage;
