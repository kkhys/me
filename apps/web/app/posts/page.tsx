import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';

import { Footer, Header } from '#/features/global/ui';
import { BlogCards } from '#/features/posts/ui';
import { Container } from '#/ui';

const Page = () => {
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)),
  );

  return (
    <>
      <Header />
      <Container>
        <div className='mx-auto max-w-3xl py-8'>
          <BlogCards posts={posts} />
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default Page;
