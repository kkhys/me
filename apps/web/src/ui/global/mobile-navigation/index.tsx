'use client';

import type { LinkProps } from 'next/link';
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MenuIcon } from 'lucide-react';

import { Button, cn, ScrollArea, Sheet, SheetContent, SheetTrigger } from '@kkhys/ui';

import { categories } from '#/config/post';
import { Icons } from '#/ui/global';

const MobileLink = ({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
} & LinkProps<string>) => {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        if (typeof href === 'string') {
          router.push(href);
        }
        onOpenChange?.(false);
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  );
};

export const MobileNavigation = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          className='mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden'
        >
          <MenuIcon className='size-5' />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='pr-0'>
        <MobileLink href='/' className='flex items-center' onOpenChange={setOpen}>
          <Icons.logo className='mr-2 size-4' />
          <span className='sr-only'>Keisuke Hayashi</span>
        </MobileLink>
        <ScrollArea className='my-4 h-[calc(100vh-8rem)] pb-10 pl-6'>
          <div className='flex flex-col space-y-2'>
            <div className='flex flex-col space-y-3 pt-6'>
              <h4 className='font-sans font-medium'>Blog</h4>
              <MobileLink href='/posts' className='font-sans text-muted-foreground' onOpenChange={setOpen}>
                All Posts
              </MobileLink>
              {categories.map((category) => (
                <React.Fragment key={category.title}>
                  <MobileLink
                    href={`/posts?category=${category.slug}`}
                    className='font-sans text-muted-foreground'
                    onOpenChange={setOpen}
                  >
                    {category.title}
                  </MobileLink>
                </React.Fragment>
              ))}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
