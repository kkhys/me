import Link from 'next/link';
import { allPosts, type Post } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import { getMDXComponent } from 'next-contentlayer/hooks';

const PostCard = (post: Post) => {
  const Content = getMDXComponent(post.body.code);

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
      <div className='text-sm'>
        <Content />
      </div>
    </div>
  );
};

const Page = () => {
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.updatedAt), new Date(b.updatedAt)),
  );

  return (
    <div className='mx-auto max-w-xl py-8'>
      <h1 className='mb-8 text-center text-3xl font-bold'>Next.js Example</h1>
      {posts.map((post, idx) => (
        <PostCard key={idx} {...post} />
      ))}
    </div>
  );
};

export default Page;
