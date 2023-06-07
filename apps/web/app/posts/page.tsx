import { type Metadata } from 'next';
import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';

import { Footer, Header, PageHeader } from '#/features/global/ui';
import { BlogCards } from '#/features/posts/ui';
import { Container } from '#/ui';

export const metadata = {
  title: 'Blog',
  openGraph: {
    title: 'Blog',
  },
} satisfies Metadata;

const PostsPage = () => {
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)),
  );

  return (
    <>
      <Header />
      <Container>
        <div className='mx-auto max-w-3xl'>
          <PageHeader title='Blog' className='mt-12' />
          <BlogCards posts={posts} className='mt-12' />
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default PostsPage;
