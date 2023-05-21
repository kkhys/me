import { allPosts } from 'contentlayer/generated';
import { getMDXComponent } from 'next-contentlayer/hooks';
import twemoji from 'twemoji';

import { ModeToggle } from '#/features/global/ui/ModeToggle';
import { mdxComponents } from '#/features/mdx/ui';

export const generateStaticParams = () =>
  allPosts.map(({ slug }) => ({ slug }));

export const generateMetadata = ({
  params: { slug },
}: {
  params: { slug: string };
}) => allPosts.find((post) => post.slug === slug).title;

const Page = ({ params: { slug } }: { params: { slug: string } }) => {
  const {
    title,
    emoji,
    category,
    tags,
    publishedAt,
    publishedAtFormatted,
    updatedAt,
    body: { code },
  } = allPosts.find((post) => post.slug === slug);

  const Content = getMDXComponent(code);

  const parsedEmoji = twemoji.parse(emoji || '🐙', {
    folder: 'svg',
    ext: '.svg',
  });

  return (
    <article className='mx-auto max-w-xl py-8'>
      <div className='mb-8 text-center'>
        <time dateTime={publishedAt} className='mb-1 text-xs text-gray-600'>
          {publishedAtFormatted}
        </time>
        <h1>{title}</h1>
        <p dangerouslySetInnerHTML={{ __html: parsedEmoji }} className='w-8' />
        <p>category: {category.title}</p>
        <p>tags: {tags[0].title}</p>
        <p>updatedAt: {updatedAt}</p>
      </div>
      <ModeToggle />
      <Content components={mdxComponents} />
    </article>
  );
};

export default Page;
