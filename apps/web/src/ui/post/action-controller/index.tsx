'use client';

import type { Post } from 'contentlayer/generated';
import type { Route } from 'next';
import * as React from 'react';
import Link from 'next/link';
import { ArrowTopRightIcon, CodeIcon, Share1Icon } from '@radix-ui/react-icons';

import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  toast,
} from '@kkhys/ui';

import type { allTags, categories } from '#/lib/contentlayer/constants';
import { site } from '#/config';

const NavLink = <T extends string>({
  href,
  children,
  isExternal = false,
}: {
  href: Route<T>;
  children: React.ReactNode;
  isExternal?: boolean;
}) => (
  <DropdownMenuItem asChild>
    <Link
      href={href}
      className='cursor-pointer'
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children}
      {isExternal && <ArrowTopRightIcon className='ml-1 size-3' />}
    </Link>
  </DropdownMenuItem>
);

const generateXShareLink = (url: string, title: string) =>
  `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&title=${encodeURIComponent(`${title} | ${site.title}`)}`;

const generateFacebookShareLink = (url: string) => `https://www.facebook.com/sharer.php?u=${encodeURIComponent(url)}`;

const generateHatebuSaveLink = (url: string, title: string) =>
  `https://b.hatena.ne.jp/add?mode=confirm&url=${encodeURIComponent(url)}&title=${title} | ${site.title}`;

/**
 * Copies a given URL to the clipboard and displays a success toast message.
 *
 * @param url - The URL to be copied.
 */
const handleCopyLink = (url: string) =>
  void window.navigator.clipboard.writeText(url).then(() => toast.success('Link copied.'));

const SharedAction = ({ post: { url, title } }: { post: Post }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant='ghost' size='icon'>
        <Share1Icon className='size-4' />
        <span className='sr-only'>Share</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align='end' className='font-sans'>
      <DropdownMenuItem asChild>
        <button className='w-full cursor-pointer' onClick={() => handleCopyLink(url)}>
          Copy link
        </button>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <NavLink href={generateXShareLink(url, title) as Route} isExternal>
        Share on X
      </NavLink>
      <NavLink href={generateFacebookShareLink(url) as Route} isExternal>
        Share on Facebook
      </NavLink>
      <NavLink href={generateHatebuSaveLink(url, title) as Route} isExternal>
        Save in Hatena Bookmark
      </NavLink>
    </DropdownMenuContent>
  </DropdownMenu>
);

const MetadataCodeBlock = ({ post }: { post: Post }) => {
  const {
    _id,
    title,
    emoji,
    category,
    tags,
    status,
    publishedAt,
    publishedAtFormattedUs,
    publishedAtFormattedIso,
    updatedAt,
    updatedAtFormattedUs,
    updatedAtFormattedIso,
    type,
    excerpt,
    slug,
    url,
    editUrl,
    sourceUrl,
    _raw,
  } = post;

  const categoryObject = post.categoryObject as (typeof categories)[number];
  const tagObjectList = post.tagObjectList as (typeof allTags)[number][] | undefined;

  const DoubleQuote = () => <span className='text-[#a6accd]'>&quot;</span>;

  const KeyValuePair = ({ propName, value, isEnd = false }: { propName: string; value?: string; isEnd?: boolean }) => (
    <span>
      {'  '}
      <DoubleQuote />
      <span className='text-[#e4f0fb]'>{propName}</span>
      <DoubleQuote />
      <span className='text-[#a6accd]'>: </span>
      {value ? (
        <>
          <DoubleQuote />
          <span className='text-[#5de4c7]'>{value ?? 'undefined'}</span>
          <DoubleQuote />
        </>
      ) : (
        <span className='text-[#d0679d]'>undefined</span>
      )}
      {!isEnd && <span className='text-[#a6accd]'>,</span>}
    </span>
  );

  const KeyValuePairArray = <T,>({ propName, values }: { propName: string; values?: T[] }) => (
    <>
      <span>
        {'  '}
        <DoubleQuote />
        <span className='text-[#e4f0fb]'>{propName}</span>
        <DoubleQuote />
        <span className='text-[#a6accd]'>: </span>
        {values ? '[' : <span className='text-[#d0679d]'>undefined</span>}
      </span>
      {values?.map((value, index) => (
        <span key={index}>
          <span>{'    '}</span>
          <DoubleQuote />
          <span className='text-[#5de4c7]'>{String(value)}</span>
          <DoubleQuote />
          {values.length !== index + 1 && <span className='text-[#a6accd]'>,</span>}
        </span>
      ))}
      {values && <span className='text-[#a6accd]'>{'  ],'}</span>}
    </>
  );

  const InnerKeyValuePair = ({ propName, value }: { propName: string; value: string }) => (
    <span>
      <span>{'    '}</span>
      <DoubleQuote />
      <span className='text-[#add7ff]'>{propName}</span>
      <DoubleQuote />
      <span className='text-[#a6accd]'>: </span>
      <DoubleQuote />
      <span className='text-[#5de4c7]'>{value}</span>
      <DoubleQuote />
      <span className='text-[#a6accd]'>,</span>
    </span>
  );

  const KeyValuePairObject = <T extends Record<string, string>>({
    keyName,
    object,
  }: {
    keyName: string;
    object: T;
  }) => (
    <>
      <span>
        {'  '}
        <DoubleQuote />
        <span className='text-[#e4f0fb]'>{keyName}</span>
        <DoubleQuote />
        <span className='text-[#a6accd]'>{': {'}</span>
      </span>
      {Object.entries(object).map(([key, value], index) => (
        <InnerKeyValuePair key={index} propName={key} value={value} />
      ))}
      <span className='text-[#a6accd]'>{'  },'}</span>
    </>
  );

  const KeyValuePairObjectArray = <T extends Record<string, string>>({
    keyName,
    objectArray,
  }: {
    keyName: string;
    objectArray?: T[];
  }) => (
    <>
      <span>
        {'  '}
        <DoubleQuote />
        <span className='text-[#e4f0fb]'>{keyName}</span>
        <DoubleQuote />
        <span className='text-[#a6accd]'>{': '}</span>
        {objectArray ? '[' : <span className='text-[#d0679d]'>undefined</span>}
      </span>
      {objectArray?.map((object, outerIndex) => (
        <React.Fragment key={outerIndex}>
          <span className='text-[#a6accd]'>{'    {'}</span>
          {Object.entries(object).map(([key, value], innerIndex) => (
            <span key={innerIndex}>
              <span>{'      '}</span>
              <DoubleQuote />
              <span className='text-[#add7ff]'>{key}</span>
              <DoubleQuote />
              <span className='text-[#a6accd]'>: </span>
              <DoubleQuote />
              <span className='text-[#5de4c7]'>{value}</span>
              <DoubleQuote />
              {Object.entries(object).length !== innerIndex + 1 && <span className='text-[#a6accd]'>,</span>}
            </span>
          ))}
          <span>
            <span className='text-[#a6accd]'>{'    }'}</span>
            {objectArray.length !== outerIndex + 1 && <span className='text-[#a6accd]'>,</span>}
          </span>
        </React.Fragment>
      ))}
      {objectArray && <span className='text-[#a6accd]'>{'  ],'}</span>}
    </>
  );

  return (
    <div className='max-h-[450px] overflow-x-auto rounded-md bg-[#131316] p-6 shadow-md dark:border [&_span]:h-4'>
      <pre>
        <code className='grid gap-1.5 text-sm text-muted-foreground [&_span]:h-4'>
          <span className='text-[#a6accd]'>{'{'}</span>
          <KeyValuePair propName='title' value={title} />
          <KeyValuePair propName='emoji' value={emoji} />
          <KeyValuePair propName='excerpt' value={excerpt} />
          <KeyValuePair propName='category' value={category} />
          <KeyValuePairArray propName='tags' values={tags} />
          <KeyValuePair propName='status' value={status} />
          <KeyValuePair propName='publishedAt' value={publishedAt} />
          <KeyValuePair propName='publishedAtFormattedUs' value={publishedAtFormattedUs} />
          <KeyValuePair propName='publishedAtFormattedIso' value={publishedAtFormattedIso} />
          <KeyValuePair propName='updatedAt' value={updatedAt} />
          <KeyValuePair propName='updatedAtFormattedUs' value={updatedAtFormattedUs} />
          <KeyValuePair propName='updatedAtFormattedIso' value={updatedAtFormattedIso} />
          <KeyValuePair propName='slug' value={slug} />
          <KeyValuePair propName='url' value={url} />
          <KeyValuePair propName='editUrl' value={editUrl} />
          <KeyValuePair propName='sourceUrl' value={sourceUrl} />
          <KeyValuePairObject keyName='categoryObject' object={categoryObject} />
          <KeyValuePairObjectArray keyName='tagObjectList' objectArray={tagObjectList} />
          <KeyValuePair propName='_id' value={_id} />
          <KeyValuePairObject keyName='_raw' object={_raw} />
          <KeyValuePair propName='type' value={type} isEnd />
          <span className='text-[#a6accd]'>{'}'}</span>
        </code>
      </pre>
    </div>
  );
};

const ConfigAction = ({ post }: { post: Post }) => {
  const { editUrl, sourceUrl } = post;

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon'>
            <CodeIcon className='size-4' />
            <span className='sr-only'>Report</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='font-sans'>
          <DialogTrigger asChild>
            <DropdownMenuItem className='cursor-pointer'>Metadata</DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />
          <NavLink href={editUrl as Route} isExternal>
            Edit the page on GitHub
          </NavLink>
          <NavLink href='https://github.com/kkhys/me/issues/new' isExternal>
            Report the content issue
          </NavLink>
          <NavLink href={sourceUrl as Route} isExternal>
            View the source on GitHub
          </NavLink>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className='sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle className='font-serif'>Metadata</DialogTitle>
          <DialogDescription className='font-sans'>
            This metadata consists of the metadata automatically set by Contentlayer and my own implementation of
            Frontmatter in the MDX file. Generated by SSG.
          </DialogDescription>
        </DialogHeader>
        <MetadataCodeBlock post={post} />
      </DialogContent>
    </Dialog>
  );
};

export const ActionController = ({ post, className }: { post: Post; className?: string }) => (
  <div className={cn('flex justify-end gap-x-1', className)}>
    <ConfigAction post={post} />
    <SharedAction post={post} />
  </div>
);
