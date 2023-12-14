import { notFound } from 'next/navigation';
import { allPosts } from 'contentlayer/generated';

import { Container } from '#/ui/feature/global';

export const generateStaticParams = () => allPosts.map(({ slug }) => ({ slug }));

export const generateMetadata = ({ params: { slug } }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
  };
};

const Page = ({ params: { slug } }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post.slug === slug);
  if (!post) return notFound();

  return (
    <Container>
      <p>{post.title}</p>
    </Container>
  );
};

export default Page;
