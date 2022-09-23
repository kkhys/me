import clsx from 'clsx';
import React from 'react';
import type { ElementType, FC } from 'react';

type ProseProps = {
  as?: ElementType;
  className?: string;
  html: string;
};

export const Prose: FC<ProseProps> = ({
  as: Component = 'div',
  className = '',
  html,
}) => {
  const styles = clsx(
    className,
    'prose max-w-none dark:prose-invert',
    // headings
    // 'prose-headings:font-display prose-headings:scroll-mt-28 prose-headings:font-normal lg:prose-headings:scroll-mt-[8.5rem]',
    // lead
    // 'prose-lead:text-slate-500 dark:prose-lead:text-slate-400',
    // links
    // 'prose-a:font-semibold dark:prose-a:text-sky-400',
    // link underline
    // 'prose-a:no-underline',
    // pre
    // 'prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10',
    // hr
    // 'dark:prose-hr:border-slate-800',
  );
  return (
    <Component dangerouslySetInnerHTML={{ __html: html }} className={styles} />
  );
};
