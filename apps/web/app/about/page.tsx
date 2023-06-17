import { type Metadata } from 'next';
import { allFragments } from 'contentlayer/generated';
import { getMDXComponent } from 'next-contentlayer/hooks';

import {
  BasicLayout,
  Footer,
  Header,
  PageHeader,
  ThemeButton,
} from '#/features/global/ui';
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
    id,
    body: { code },
  } = allFragments.find((fragment) => fragment.id === 'about');

  const Content = getMDXComponent(code);

  return (
    <BasicLayout>
      <Container>
        <PageHeader title='About' className='mt-16' />
        {/*<div className='lg:pl-20'>*/}
        {/*  <div className='max-w-xs px-2.5 lg:max-w-none'>*/}
        {/*    <Image*/}
        {/*      src={portraitImage}*/}
        {/*      alt=''*/}
        {/*      sizes='(min-width: 1024px) 32rem, 20rem'*/}
        {/*      className='aspect-square rotate-3 rounded-2xl bg-gray-100 object-cover dark:bg-gray-800'*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</div>*/}
        <Prose className='mt-16'>
          <Content components={mdxComponents} />
        </Prose>
        <ThemeButton />
      </Container>
    </BasicLayout>
  );
};

export default AboutPage;
