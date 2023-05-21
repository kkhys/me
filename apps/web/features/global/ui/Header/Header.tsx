'use client';

import {
  Fragment,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import Image from 'next/image';
import Link, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';

import { ChevronDownIcon, CloseIcon } from '#/features/global/ui';
import avatarImage from '#/assets/avatar.jpg';
import { Container } from '#/ui';

const MobileNavigationItem = ({
  href,
  children,
  isExternal = false,
}: {
  href: string;
  children: ReactNode;
  isExternal?: boolean;
}) => {
  const styles = 'block py-2';

  return (
    <li>
      {isExternal ? (
        <Popover.Button as='a' href={href} target='_blank' className={styles}>
          {children}
        </Popover.Button>
      ) : (
        <Popover.Button as={Link} href={href} className={styles}>
          {children}
        </Popover.Button>
      )}
    </li>
  );
};

const MobileNavigation = ({ className }: { className: string }) => {
  return (
    <Popover className={className}>
      <Popover.Button className='group flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-800 shadow-lg shadow-gray-800/5 ring-1 ring-gray-900/5 backdrop-blur dark:bg-gray-800/90 dark:text-gray-200 dark:ring-white/10 dark:hover:ring-white/20'>
        Menu
        <ChevronDownIcon className='ml-3 h-auto w-2 stroke-gray-500 group-hover:stroke-gray-700 dark:group-hover:stroke-gray-400' />
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter='duration-150 ease-out'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='duration-150 ease-in'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <Popover.Overlay className='fixed inset-0 z-50 bg-gray-800/40 backdrop-blur-sm dark:bg-black/80' />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter='duration-150 ease-out'
          enterFrom='opacity-0 scale-95'
          enterTo='opacity-100 scale-100'
          leave='duration-150 ease-in'
          leaveFrom='opacity-100 scale-100'
          leaveTo='opacity-0 scale-95'
        >
          <Popover.Panel
            focus
            className='fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-gray-900/5 dark:bg-gray-900 dark:ring-gray-800'
          >
            <div className='flex flex-row-reverse items-center justify-between'>
              <Popover.Button aria-label='Close menu' className='-m-1 p-1'>
                <CloseIcon className='h-6 w-6 text-gray-500 dark:text-gray-400' />
              </Popover.Button>
              <h2 className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                Navigation
              </h2>
            </div>
            <nav className='mt-6'>
              <ul className='-my-2 divide-y divide-gray-100 text-base text-gray-800 dark:divide-gray-100/5 dark:text-gray-300'>
                <MobileNavigationItem href='/about'>About</MobileNavigationItem>
                <MobileNavigationItem href='/articles'>
                  Articles
                </MobileNavigationItem>
                <MobileNavigationItem href='/projects'>
                  Projects
                </MobileNavigationItem>
                <MobileNavigationItem href='/speaking'>
                  Speaking
                </MobileNavigationItem>
                <MobileNavigationItem href='/uses'>Uses</MobileNavigationItem>
              </ul>
            </nav>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
};

const NavigationItem = ({
  href,
  children,
  isExternal = false,
}: {
  href: string;
  children: ReactNode;
  isExternal?: boolean;
}) => {
  const isActive = usePathname() === href;

  const styles = {
    text: clsx(
      'relative block px-3 py-2 transition',
      isActive
        ? 'text-teal-500 dark:text-teal-400'
        : 'hover:text-teal-500 dark:hover:text-teal-400',
    ),
    underline:
      'absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0 dark:from-teal-400/0 dark:via-teal-400/40 dark:to-teal-400/0',
  };

  return (
    <li>
      {isExternal ? (
        <a
          href={href}
          target='_blank'
          rel='noreferrer noopener'
          className={styles.text}
        >
          {children}
        </a>
      ) : (
        <Link href={href} className={styles.text}>
          {children}
          {isActive && <span className={styles.underline} />}
        </Link>
      )}
    </li>
  );
};

const DesktopNavigation = (props: JSX.IntrinsicElements['nav']) => {
  return (
    <nav {...props}>
      <ul className='flex rounded-lg bg-white/90 px-3 text-sm font-medium text-gray-800 shadow-lg shadow-gray-800/5 ring-1 ring-gray-900/5 backdrop-blur dark:bg-gray-800/90 dark:text-gray-200 dark:ring-white/10'>
        <NavigationItem href='/about'>About</NavigationItem>
        <NavigationItem href='/articles'>Articles</NavigationItem>
        <NavigationItem href='/projects'>Projects</NavigationItem>
        <NavigationItem href='/speaking'>Speaking</NavigationItem>
        <NavigationItem href='/uses'>Uses</NavigationItem>
      </ul>
    </nav>
  );
};

const clamp = (number: number, a: number, b: number) => {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return Math.min(Math.max(number, min), max);
};

const AvatarContainer = ({
  className,
  ...props
}: JSX.IntrinsicElements['div']) => {
  return (
    <div
      className={clsx(
        className,
        'h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg shadow-gray-800/5 ring-1 ring-gray-900/5 backdrop-blur dark:bg-gray-800/90 dark:ring-white/10',
      )}
      {...props}
    />
  );
};

const Avatar = ({
  large = false,
  className,
  style,
  ...props
}: {
  large?: boolean;
  className?: string;
  style?: Record<string, string>;
} & Omit<LinkProps, 'href'>) => {
  return (
    <Link
      href='/'
      aria-label='Home'
      className={clsx(className, 'pointer-events-auto')}
      style={style}
      {...props}
    >
      <Image
        src={avatarImage}
        alt=''
        sizes={large ? '4rem' : '2.25rem'}
        className={clsx(
          'rounded-full bg-gray-100 object-cover dark:bg-gray-800',
          large ? 'h-16 w-16' : 'h-9 w-9',
        )}
        priority
      />
    </Link>
  );
};

export const Header = () => {
  const isHomePage = usePathname() === '/';

  const headerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const isInitial = useRef(true);

  useEffect(() => {
    const downDelay = avatarRef.current?.offsetTop ?? 0;
    const upDelay = 64;

    const setProperty = (property: string, value: string | null) => {
      document.documentElement.style.setProperty(property, value);
    };

    const removeProperty = (property: string) => {
      document.documentElement.style.removeProperty(property);
    };

    const updateHeaderStyles = () => {
      const { top, height } = headerRef.current.getBoundingClientRect();
      const scrollY = clamp(
        window.scrollY,
        0,
        document.body.scrollHeight - window.innerHeight,
      );

      if (isInitial.current) {
        setProperty('--header-position', 'sticky');
      }

      setProperty('--content-offset', `${downDelay}px`);

      if (isInitial.current || scrollY < downDelay) {
        setProperty('--header-height', `${downDelay + height}px`);
        setProperty('--header-mb', `${-downDelay}px`);
      } else if (top + height < -upDelay) {
        const offset = Math.max(height, scrollY - upDelay);
        setProperty('--header-height', `${offset}px`);
        setProperty('--header-mb', `${height - offset}px`);
      } else if (top === 0) {
        setProperty('--header-height', `${scrollY + height}px`);
        setProperty('--header-mb', `${-scrollY}px`);
      }

      if (top === 0 && scrollY > 0 && scrollY >= downDelay) {
        setProperty('--header-inner-position', 'fixed');
        removeProperty('--header-top');
        removeProperty('--avatar-top');
      } else {
        removeProperty('--header-inner-position');
        setProperty('--header-top', '0px');
        setProperty('--avatar-top', '0px');
      }
    };

    const updateAvatarStyles = () => {
      if (!isHomePage) {
        return;
      }

      const fromScale = 1;
      const toScale = 36 / 64;
      const fromX = 0;
      const toX = 2 / 16;

      const scrollY = downDelay - window.scrollY;

      let scale = (scrollY * (fromScale - toScale)) / downDelay + toScale;
      scale = clamp(scale, fromScale, toScale);

      let x = (scrollY * (fromX - toX)) / downDelay + toX;
      x = clamp(x, fromX, toX);

      setProperty(
        '--avatar-image-transform',
        `translate3d(${x}rem, 0, 0) scale(${scale})`,
      );

      const borderScale = 1 / (toScale / scale);
      const borderX = (-toX + x) * borderScale;
      const borderTransform = `translate3d(${borderX}rem, 0, 0) scale(${borderScale})`;

      setProperty('--avatar-border-transform', borderTransform);
      setProperty('--avatar-border-opacity', scale === toScale ? '1' : '0');
    };

    const updateStyles = () => {
      updateHeaderStyles();
      updateAvatarStyles();
      isInitial.current = false;
    };

    updateStyles();
    window.addEventListener('scroll', updateStyles, { passive: true });
    window.addEventListener('resize', updateStyles);

    return () => {
      window.removeEventListener('scroll', updateStyles, true);
      window.removeEventListener('resize', updateStyles);
    };
  }, [isHomePage]);

  return (
    <>
      <header
        className='pointer-events-none relative z-50 flex flex-col'
        style={{
          height: 'var(--header-height)',
          marginBottom: 'var(--header-mb)',
        }}
      >
        {isHomePage && (
          <>
            <div
              ref={avatarRef}
              className='order-last mt-[calc(theme(spacing.16)-theme(spacing.3))]'
            />
            <Container
              className='top-0 order-last -mb-3 pt-3'
              style={
                {
                  position: 'var(--header-position)',
                } as unknown as CSSProperties
              }
            >
              <div
                className='top-[var(--avatar-top,theme(spacing.3))] w-full'
                style={
                  {
                    position: 'var(--header-inner-position)',
                  } as unknown as CSSProperties
                }
              >
                <div className='relative'>
                  <AvatarContainer
                    className='absolute left-0 top-3 origin-left transition-opacity'
                    style={{
                      opacity: 'var(--avatar-border-opacity, 0)',
                      transform: 'var(--avatar-border-transform)',
                    }}
                  />
                  <Avatar
                    large
                    className='block h-16 w-16 origin-left'
                    style={{ transform: 'var(--avatar-image-transform)' }}
                  />
                </div>
              </div>
            </Container>
          </>
        )}
        <div
          ref={headerRef}
          className='top-0 z-10 h-16 pt-6'
          style={
            { position: 'var(--header-position)' } as unknown as CSSProperties
          }
        >
          <Container
            className='top-[var(--header-top,theme(spacing.6))] w-full'
            style={
              {
                position: 'var(--header-inner-position)',
              } as unknown as CSSProperties
            }
          >
            <div className='relative flex gap-4'>
              <div className='flex flex-1'>
                {!isHomePage && (
                  <AvatarContainer>
                    <Avatar />
                  </AvatarContainer>
                )}
              </div>
              <div className='flex flex-1 justify-end md:justify-center'>
                <MobileNavigation className='pointer-events-auto md:hidden' />
                <DesktopNavigation className='pointer-events-auto hidden md:block' />
              </div>
              <div className='flex justify-end md:flex-1'>
                <div className='pointer-events-auto'>{/*<ModeToggle />*/}</div>
              </div>
            </div>
          </Container>
        </div>
      </header>
      {isHomePage && <div style={{ height: 'var(--content-offset)' }} />}
    </>
  );
};
