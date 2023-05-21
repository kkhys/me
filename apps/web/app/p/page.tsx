import Link from 'next/link';
import { allPosts, type Post } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';

import { Header } from '#/features/global/ui';

const PostCard = (post: Post) => {
  return (
    <div className='mb-8'>
      <h2 className='text-xl'>
        <Link
          href={post.url}
          className='text-blue-700 hover:text-blue-900'
          legacyBehavior
        >
          {post.title}
        </Link>
      </h2>
      <time
        dateTime={post.publishedAt}
        className='mb-2 block text-xs text-gray-600'
      >
        {post.publishedAtFormatted}
      </time>
    </div>
  );
};

const Page = () => {
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)),
  );

  return (
    <div className='mx-auto max-w-xl py-8'>
      <Header />
      <h1 className='mb-8 text-center text-3xl font-bold'>Next.js Example</h1>
      {posts.map((post, idx) => (
        <PostCard key={idx} {...post} />
      ))}
    </div>
  );
};

export default Page;
