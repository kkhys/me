/* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/ban-ts-comment */
'use client';

import * as React from 'react';
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons';
import { clsx } from 'clsx';

import { cn } from '#/lib/shadcn-ui/utils';

const CodeHeader = ({ title }: { title: string }) => (
  <div className='flex flex-wrap items-start rounded-t-md border-b border-white/10 bg-zinc-800 px-4 dark:bg-zinc-900'>
    <h3 className='my-0 mr-auto py-3.5 font-mono text-xs font-medium text-zinc-300'>{title}</h3>
  </div>
);

const CopyButton = ({ value, hasTitle }: { value: string; hasTitle: boolean }) => {
  const [copyCount, setCopyCount] = React.useState(0);
  const copied = copyCount > 0;

  React.useEffect(() => {
    if (copyCount > 0) {
      const timeout = setTimeout(() => setCopyCount(0), 1000);
      return () => clearTimeout(timeout);
    }
  }, [copyCount]);

  return (
    <button
      className={cn(
        'focus-visible:ring-ring absolute right-4 flex items-center justify-center rounded-md border border-zinc-700 bg-transparent p-2 opacity-0 shadow-sm backdrop-blur transition hover:bg-zinc-800 hover:text-zinc-400 focus:opacity-100 focus-visible:outline-none focus-visible:ring-1 group-hover:opacity-100',
        hasTitle ? 'top-16' : 'top-4',
      )}
      onClick={() => void window.navigator.clipboard.writeText(value).then(() => setCopyCount((count) => count + 1))}
      aria-label='Copy code to clipboard'
    >
      <span aria-hidden={copied} className={clsx('transition duration-500', copied && 'scale-0 opacity-0')}>
        <CopyIcon className='size-4 text-zinc-400' />
      </span>
      <span
        aria-hidden={!copied}
        className={clsx(
          'absolute inset-0 flex items-center justify-center transition duration-500',
          !copied && 'scale-100 opacity-0',
        )}
      >
        <CheckIcon className='size-5 text-zinc-400' />
      </span>
    </button>
  );
};

const CodePanel = ({
  children,
  hasTitle = false,
  __rawString__,
}: {
  children: React.ReactNode;
  hasTitle?: boolean;
  __rawString__?: string;
}) => {
  const child = React.Children.only(children);
  if (React.isValidElement(child)) __rawString__ = (child.props?.__rawString__ as string | undefined) ?? __rawString__;
  if (!__rawString__) throw new Error('`CodePanel` requires a `code` prop, or a child with a `code` prop.');

  // @ts-expect-error
  const isShowLineNumbers = typeof child?.props?.children?.props?.['data-line-numbers'] !== 'undefined';

  // const language = child?.props['data-language'] as string | undefined;

  return (
    <div className='group max-h-[650px] overflow-x-auto'>
      <pre>
        <code className={cn('grid', isShowLineNumbers && 'show-line-numbers')}>
          {/* @ts-expect-error */}
          {child.props.children.props.children}
        </code>
      </pre>
      <CopyButton value={__rawString__} hasTitle={hasTitle} />
    </div>
  );
};

export const Code = ({
  children,
  ...props
}: {
  children: React.ReactNode | React.ReactNode[];
  title?: string;
  raw?: string;
  'data-rehype-pretty-code-figure'?: string;
}) => {
  if (typeof props?.['data-rehype-pretty-code-figure'] === 'undefined') return <figure {...props}>{children}</figure>;

  const containerClassName = 'relative overflow-hidden rounded-md bg-[#131316] shadow-md dark:border code-block';

  if (!Array.isArray(children))
    return (
      <div className={containerClassName}>
        <CodePanel {...props}>{children}</CodePanel>
      </div>
    );

  // @ts-expect-error
  const title = children[0]?.props?.children as string | undefined;
  const hasTitle = typeof title !== 'undefined';

  return (
    <div className={containerClassName}>
      {title && <CodeHeader title={title} />}
      <CodePanel hasTitle={hasTitle} {...props}>
        {children[1]}
      </CodePanel>
    </div>
  );
};
