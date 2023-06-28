import { allPosts } from 'contentlayer/generated';
import { getMDXComponent } from 'next-contentlayer/hooks';

import { mdxComponents } from '#/features/mdx/ui';
import { Container, Prose } from '#/ui';

import 'katex/dist/katex.min.css';

export const generateStaticParams = () =>
  allPosts.map(({ slug }) => ({ slug }));

export const generateMetadata = ({
  params: { slug },
}: {
  params: { slug: string };
}) => {
  const { title } = allPosts.find((post) => post.slug === slug);
  return {
    title,
  };
};

const Page = ({ params: { slug } }: { params: { slug: string } }) => {
  const {
    title,
    // emoji,
    // category,
    // tags,
    publishedAt,
    publishedAtFormatted,
    // updatedAt,
    body: { code },
  } = allPosts.find((post) => post.slug === slug);

  const Content = getMDXComponent(code);

  // const parsedEmoji = twemoji.parse(emoji || '🐙', {
  //   folder: 'svg',
  //   ext: '.svg',
  // });

  return (
    <Container>
      <div className='mt-16 xl:relative'>
        {/*{previousPathname && (*/}
        {/*<BrowserBackButton />*/}
        {/*)}*/}
        <article>
          <header className='flex flex-col'>
            <h1 className='mt-6 text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100 sm:text-4xl'>
              {title}
            </h1>
            <time
              dateTime={publishedAt}
              className='order-first flex items-center text-base text-gray-400 dark:text-gray-500'
            >
              <span className='h-4 w-0.5 rounded-full bg-gray-200 dark:bg-gray-500' />
              <span className='ml-3'>{publishedAtFormatted}</span>
            </time>
          </header>
          <Prose className='mt-8'>
            <Content components={mdxComponents} />
          </Prose>
        </article>
      </div>
    </Container>
  );
};

export default Page;
