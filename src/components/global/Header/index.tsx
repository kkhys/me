// FIXME
// @ts-nocheck
import { Fragment, useEffect, useRef } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { Popover, Transition } from '@headlessui/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import avatarImage from '@/assets/avatar.jpg';
import {
  ChevronDownIcon,
  CloseIcon,
  Container,
  MoonIcon,
  SunIcon,
} from '@/components/elements';

type NavigationItemProps = {
  href: string;
  children: string;
  isExternal?: boolean;
};

const MobileNavigationItem = ({
  href,
  children,
  isExternal = false,
}: NavigationItemProps) => {
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

const MobileNavigation = (props) => {
  return (
    <Popover {...props}>
      <Popover.Button className='group flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20'>
        Menu
        <ChevronDownIcon className='ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400' />
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
          <Popover.Overlay className='fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur-sm dark:bg-black/80' />
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
            className='fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-zinc-800'
          >
            <div className='flex flex-row-reverse items-center justify-between'>
              <Popover.Button aria-label='Close menu' className='-m-1 p-1'>
                <CloseIcon className='h-6 w-6 text-zinc-500 dark:text-zinc-400' />
              </Popover.Button>
              <h2 className='text-sm font-medium text-zinc-600 dark:text-zinc-400'>
                Navigation
              </h2>
            </div>
            <nav className='mt-6'>
              <ul className='-my-2 divide-y divide-zinc-100 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300'>
                <MobileNavigationItem
                  href='https://github.com/users/kkhys/projects/1'
                  isExternal
                >
                  Roadmap
                </MobileNavigationItem>
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
}: NavigationItemProps) => {
  let isActive = useRouter().pathname === href;
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

const DesktopNavigation = (props) => {
  return (
    <nav {...props}>
      <ul className='flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10'>
        <NavigationItem
          href='https://github.com/users/kkhys/projects/1/views/1'
          isExternal
        >
          Roadmap
        </NavigationItem>
      </ul>
    </nav>
  );
};

const ModeToggle = () => {
  const disableTransitionsTemporarily = () => {
    document.documentElement.classList.add('[&_*]:!transition-none');
    window.setTimeout(() => {
      document.documentElement.classList.remove('[&_*]:!transition-none');
    }, 0);
  };

  const toggleMode = () => {
    disableTransitionsTemporarily();

    let darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    let isSystemDarkMode = darkModeMediaQuery.matches;
    let isDarkMode = document.documentElement.classList.toggle('dark');

    if (isDarkMode === isSystemDarkMode) {
      delete window.localStorage.isDarkMode;
    } else {
      window.localStorage.isDarkMode = isDarkMode;
    }
  };

  return (
    <button
      type='button'
      aria-label='Toggle dark mode'
      className='group rounded-full bg-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20'
      onClick={toggleMode}
    >
      <SunIcon className='h-6 w-6 fill-zinc-100 stroke-zinc-500 transition group-hover:fill-zinc-200 group-hover:stroke-zinc-700 dark:hidden [@media(prefers-color-scheme:dark)]:fill-teal-50 [@media(prefers-color-scheme:dark)]:stroke-teal-500 [@media(prefers-color-scheme:dark)]:group-hover:fill-teal-50 [@media(prefers-color-scheme:dark)]:group-hover:stroke-teal-600' />
      <MoonIcon className='hidden h-6 w-6 fill-zinc-700 stroke-zinc-500 transition dark:block [@media(prefers-color-scheme:dark)]:group-hover:stroke-zinc-400 [@media_not_(prefers-color-scheme:dark)]:fill-teal-400/10 [@media_not_(prefers-color-scheme:dark)]:stroke-teal-500' />
    </button>
  );
};

const clamp = (number, a, b) => {
  let min = Math.min(a, b);
  let max = Math.max(a, b);
  return Math.min(Math.max(number, min), max);
};

const AvatarContainer = ({ className, ...props }) => {
  return (
    <div
      className={clsx(
        className,
        'h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:ring-white/10',
      )}
      {...props}
    />
  );
};

const Avatar = ({ large = false, className, ...props }) => {
  return (
    <Link
      href='/'
      aria-label='Home'
      className={clsx(className, 'pointer-events-auto')}
      {...props}
    >
      <Image
        src={avatarImage}
        alt=''
        sizes={large ? '4rem' : '2.25rem'}
        className={clsx(
          'rounded-full bg-zinc-100 object-cover dark:bg-zinc-800',
          large ? 'h-16 w-16' : 'h-9 w-9',
        )}
        priority
      />
    </Link>
  );
};

export const Header = () => {
  let isHomePage = useRouter().pathname === '/';

  let headerRef = useRef();
  let avatarRef = useRef();
  let isInitial = useRef(true);

  useEffect(() => {
    let downDelay = avatarRef.current?.offsetTop ?? 0;
    let upDelay = 64;

    const setProperty = (property, value) => {
      document.documentElement.style.setProperty(property, value);
    };

    const removeProperty = (property) => {
      document.documentElement.style.removeProperty(property);
    };

    const updateHeaderStyles = () => {
      let { top, height } = headerRef.current.getBoundingClientRect();
      let scrollY = clamp(
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
        let offset = Math.max(height, scrollY - upDelay);
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

      let fromScale = 1;
      let toScale = 36 / 64;
      let fromX = 0;
      let toX = 2 / 16;

      let scrollY = downDelay - window.scrollY;

      let scale = (scrollY * (fromScale - toScale)) / downDelay + toScale;
      scale = clamp(scale, fromScale, toScale);

      let x = (scrollY * (fromX - toX)) / downDelay + toX;
      x = clamp(x, fromX, toX);

      setProperty(
        '--avatar-image-transform',
        `translate3d(${x}rem, 0, 0) scale(${scale})`,
      );

      let borderScale = 1 / (toScale / scale);
      let borderX = (-toX + x) * borderScale;
      let borderTransform = `translate3d(${borderX}rem, 0, 0) scale(${borderScale})`;

      setProperty('--avatar-border-transform', borderTransform);
      setProperty('--avatar-border-opacity', scale === toScale ? 1 : 0);
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
      window.removeEventListener('scroll', updateStyles, { passive: true });
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
              style={{ position: 'var(--header-position)' }}
            >
              <div
                className='top-[var(--avatar-top,theme(spacing.3))] w-full'
                style={{ position: 'var(--header-inner-position)' }}
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
          style={{ position: 'var(--header-position)' }}
        >
          <Container
            className='top-[var(--header-top,theme(spacing.6))] w-full'
            style={{ position: 'var(--header-inner-position)' }}
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
                <div className='pointer-events-auto'>
                  <ModeToggle />
                </div>
              </div>
            </div>
          </Container>
        </div>
      </header>
      {isHomePage && <div style={{ height: 'var(--content-offset)' }} />}
    </>
  );
};
