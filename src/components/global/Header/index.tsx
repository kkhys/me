import { Link } from 'gatsby';
import React from 'react';
import { useWindowScroll } from 'react-use';
import { Heading, IconMenu } from '^/elements';
import { MenuDrawer, ThemeSelector, useDrawer } from '^/global';
import type { WindowLocation } from '@reach/router';
import type { FC } from 'react';

type DesktopHeaderProps = {
  isHome: boolean;
  title: string;
};

type MobileHeaderProps = {
  title: string;
  isHome: boolean;
  openMenu: () => void;
};

type HeaderProps = {
  title: string;
  location: WindowLocation;
};

const DesktopHeader: FC<DesktopHeaderProps> = ({ isHome, title }) => {
  const { y } = useWindowScroll();

  const styles = {
    button:
      'relative flex items-center justify-center w-8 h-8 focus:ring-primary/5',
    container: `bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader ${
      y > 50 ? 'shadow-lightHeader ' : ''
    }hidden h-nav lg:flex items-center sticky transition duration-300 backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-8 px-12 py-8`,
  };

  return (
    <header role='banner' className={styles.container}>
      <div className='container flex items-center justify-between gap-12'>
        <Link className='font-bold' to='/'>
          {title}
        </Link>
        {/* <nav className='flex gap-8'> */}
        {/*  {(menu?.items || []).map((item) => ( */}
        {/*    <Link key={item.id} to={item.to} target={item.target}> */}
        {/*      {item.title} */}
        {/*    </Link> */}
        {/*  ))} */}
        {/* </nav> */}
        <ThemeSelector className='relative' />
      </div>
    </header>
  );
};

const MobileHeader: FC<MobileHeaderProps> = ({ title, isHome, openMenu }) => {
  const { y } = useWindowScroll();

  const styles = {
    button: 'relative flex items-center justify-center w-8 h-8',
    container: `bg-contrast/80 text-primary ${
      y > 50 ? 'shadow-lightHeader ' : ''
    }flex lg:hidden items-center h-nav sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8`,
  };

  return (
    <header role='banner' className={styles.container}>
      <div className='flex w-full items-center justify-start gap-4'>
        <button type='button' onClick={openMenu} className={styles.button}>
          <IconMenu />
        </button>
      </div>

      <Link
        className='flex h-full w-full grow items-center justify-center self-stretch leading-[3rem] md:leading-[4rem]'
        to='/'
      >
        <Heading className='text-center font-bold' as={isHome ? 'h1' : 'h2'}>
          {title}
        </Heading>
      </Link>

      <div className='flex w-full items-center justify-end gap-4'>
        {/* <Link to='/account' className={styles.button}> */}
        {/* <IconAccount /> */}
        {/* </Link> */}
      </div>
    </header>
  );
};

export const Header: FC<HeaderProps> = ({ title, location: { pathname } }) => {
  const isHome = pathname === '/';

  const { isOpen, openDrawer, closeDrawer } = useDrawer();

  return (
    <>
      <MenuDrawer isOpen={isOpen} onClose={closeDrawer} />
      <DesktopHeader isHome={isHome} title={title} />
      <MobileHeader isHome={isHome} title={title} openMenu={openDrawer} />
    </>
  );
};
