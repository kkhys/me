'use client';

import Link from 'next/link';
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
    <div className='flex h-7 w-7 items-center justify-center rounded-full bg-gray-900/5 ring-1 ring-gray-900/25 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50 group-hover:ring-gray-900/25 dark:bg-white/7.5 dark:ring-white/15 dark:group-hover:bg-emerald-300/10 dark:group-hover:ring-emerald-400'>
      <p
        className='h-5 w-5 p-0.5'
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

const BlogCard = ({ frontMatter }: { frontMatter: Post }) => {
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
      key={frontMatter.title}
      onMouseMove={onMouseMove}
      className='group relative flex rounded-2xl bg-gray-50 transition-shadow hover:shadow-md hover:shadow-gray-900/5 dark:bg-white/2.5 dark:hover:shadow-black/5'
    >
      <BlogPattern
        mouseX={mouseX as unknown as number}
        mouseY={mouseY as unknown as number}
        patternY={frontMatter.pattern.y}
        patternSquare={frontMatter.pattern.squares}
      />
      <div className='absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/7.5 group-hover:ring-gray-900/10 dark:ring-white/10 dark:group-hover:ring-white/20' />
      <div className='relative rounded-2xl px-4 pb-4 pt-16'>
        <BlogIcon emoji={frontMatter.emoji} />
        <h3 className='mt-4 text-sm font-semibold leading-7 text-gray-900 dark:text-white'>
          <Link href={frontMatter.url}>
            <span className='absolute inset-0 rounded-2xl' />
            {frontMatter.title}
          </Link>
        </h3>
        <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
          {frontMatter.publishedAtFormatted}
        </p>
      </div>
    </div>
  );
};

export const BlogCards = ({ frontMatters }: { frontMatters: Post[] }) => {
  return (
    <div className='my-16 xl:max-w-none'>
      <div className='not-prose mt-4 grid grid-cols-1 gap-8 border-t border-gray-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-3'>
        {frontMatters.map((frontMatter) => (
          <BlogCard key={frontMatter.title} frontMatter={frontMatter} />
        ))}
      </div>
    </div>
  );
};
