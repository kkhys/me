'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import {
  cn,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Separator,
} from '@kkhys/ui';

import { categories } from '#/config/post';
import { Icons } from '#/ui/global';

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, children, ...props }, ref) => (
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          'block w-[calc(100%_-_2px)] select-none rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
          className,
        )}
        {...props}
      >
        {children}
      </a>
    </NavigationMenuLink>
  ),
);
ListItem.displayName = 'ListItem';

export const MainNavigation = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  return (
    <div className='mr-4 hidden md:flex'>
      <Link href='/' className='mr-6 flex flex-shrink-0 items-center'>
        <Icons.logo className='size-5 rounded-md' />
        <span className='sr-only'>Keisuke Hayashi</span>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={cn(pathname === '/posts' && 'bg-accent')}>Blog</NavigationMenuTrigger>
            <NavigationMenuContent className='min-w-[8rem] p-1'>
              <ListItem href='/posts' className={cn(pathname === '/posts' && !categoryParam && 'bg-accent')}>
                All Posts
              </ListItem>
              <Separator className='-mx-1 my-1 h-px w-[calc(100%_+_1rem)]' />
              <div className='grid gap-1'>
                {categories.map((category, index) => (
                  <ListItem
                    key={category.slug}
                    href={`/posts?category=${category.slug}`}
                    className={cn(
                      categories.length === index + 1 && 'mb-0.5',
                      categoryParam === category.slug && 'bg-accent',
                    )}
                  >
                    {category.title}
                  </ListItem>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuIndicator />
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};