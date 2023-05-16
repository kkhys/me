import { allPosts } from 'contentlayer/generated';
import { format, parseISO } from 'date-fns';
import { getMDXComponent } from 'next-contentlayer/hooks';

export const generateStaticParams = () =>
  allPosts.map(({ slug }) => ({ slug }));

export const generateMetadata = ({
  params: { slug },
}: {
  params: { slug: string };
}) => allPosts.find((post) => post.slug === slug).title;

const PostLayout = ({ params: { slug } }: { params: { slug: string } }) => {
  const { title, publishedAt, body } = allPosts.find(
    (post) => post.slug === slug,
  );

  const Content = getMDXComponent(body.code);

  return (
    <article className='mx-auto max-w-xl py-8'>
      <div className='mb-8 text-center'>
        <time dateTime={publishedAt} className='mb-1 text-xs text-gray-600'>
          {format(parseISO(publishedAt), 'LLLL d, yyyy')}
        </time>
        <h1>{title}</h1>
      </div>
      <Content />
    </article>
  );
};

export default PostLayout;
