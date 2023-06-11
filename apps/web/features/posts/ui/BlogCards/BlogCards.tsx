'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { type Post } from 'contentlayer/generated';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import twemoji from 'twemoji';

import { GridPattern } from '#/features/global/ui';

const BlogIcon = ({ emoji }: { emoji?: string }) => {
  const emojiSvg = twemoji.parse(emoji || '🐙', {
    folder: 'svg',
    ext: '.svg',
  });

  return (
    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-gray-900/25 backdrop-blur-[2px] transition duration-300 dark:bg-white/7.5 dark:ring-white/15'>
      <p
        className='h-8 w-8 p-0.5'
        dangerouslySetInnerHTML={{ __html: emojiSvg }}
      />
    </div>
  );
};

const BlogPattern = ({
  mouseX,
  mouseY,
  patternY,
  patternSquare,
}: {
  mouseX: number;
  mouseY: number;
  patternY: string;
  patternSquare: number[][];
}) => {
  const maskImage = useMotionTemplate`radial-gradient(180px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className='pointer-events-none'>
      <div className='absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(white,transparent)] group-hover:opacity-50'>
        <GridPattern
          width={72}
          height={56}
          x='50%'
          y={patternY}
          squares={patternSquare}
          className='absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/[0.02] stroke-black/5 dark:fill-white/1 dark:stroke-white/2.5'
        />
      </div>
      <motion.div
        className='absolute inset-0 rounded-2xl bg-gradient-to-r from-[#D7EDEA] to-[#F4FBDF] opacity-0 transition duration-300 group-hover:opacity-100 dark:from-[#202D2E] dark:to-[#303428]'
        style={style}
      />
      <motion.div
        className='absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay transition duration-300 group-hover:opacity-100'
        style={style}
      >
        <GridPattern
          width={72}
          height={56}
          x='50%'
          y={patternY}
          squares={patternSquare}
          className='absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/50 stroke-black/70 dark:fill-white/2.5 dark:stroke-white/10'
        />
      </motion.div>
    </div>
  );
};

const BlogCard = ({ post }: { post: Post }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const onMouseMove = ({
    currentTarget,
    clientX,
    clientY,
  }: {
    currentTarget: HTMLDivElement;
    clientX: number;
    clientY: number;
  }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <div
      key={post.title}
      onMouseMove={onMouseMove}
      className='group relative flex rounded-2xl bg-gray-50 transition-shadow hover:shadow-md hover:shadow-gray-900/5 dark:bg-white/2.5 dark:hover:shadow-black/5'
    >
      <BlogPattern
        mouseX={mouseX as unknown as number}
        mouseY={mouseY as unknown as number}
        patternY={post.pattern.y}
        patternSquare={post.pattern.square}
      />
      <div className='absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/7.5 group-hover:ring-gray-900/10 dark:ring-white/10 dark:group-hover:ring-white/20' />
      <div className='relative w-full rounded-2xl px-4 py-6'>
        <BlogIcon emoji={post.emoji} />
        <h2 className='mt-6 text-sm font-semibold leading-7 text-gray-800 dark:text-gray-100'>
          <Link href={post.url}>
            <span className='absolute inset-0 rounded-2xl' />
            {post.title}
          </Link>
        </h2>
        <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
          {post.publishedAtFormatted}
        </p>
      </div>
    </div>
  );
};

export const BlogCards = ({
  posts,
  className,
}: {
  posts: Post[];
  className?: string;
}) => {
  return (
    <div className={clsx('xl:max-w-none', className)}>
      <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3'>
        {posts.map((post) => (
          <BlogCard key={post.title} post={post} />
        ))}
      </div>
    </div>
  );
};
