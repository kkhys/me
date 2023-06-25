import { type Metadata } from 'next';
import { allFragments } from 'contentlayer/generated';
import { getMDXComponent } from 'next-contentlayer/hooks';

import { BasicLayout, PageHeader } from '#/features/global/ui';
import { mdxComponents } from '#/features/mdx';
import { Button, Container, Prose } from '#/ui';

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
          <p>
            <Button href='/about' variant='text' arrow='right'>
              Read more
            </Button>
          </p>
        </Prose>
      </Container>
    </BasicLayout>
  );
};

export default AboutPage;
