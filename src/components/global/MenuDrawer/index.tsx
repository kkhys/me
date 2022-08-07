import React from 'react';
import { Drawer } from '^/global';
import type { FC } from 'react';

type MenuMobileNavProps = {
  onClose: () => void;
};

type MenuDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const MenuMobileNav: FC<MenuMobileNavProps> = ({ onClose }) => (
  <nav className='grid gap-4 p-6 sm:gap-6 sm:py-8 sm:px-12'>
    {/* {(menu?.items || []).map((item) => ( */}
    {/*  <Link key={item.id} to={item.to} target={item.target} onClick={onClose}> */}
    {/*    <Text as='span' size='copy'> */}
    {/*      {item.title} */}
    {/*    </Text> */}
    {/*  </Link> */}
    {/* ))} */}
  </nav>
);

export const MenuDrawer: FC<MenuDrawerProps> = ({ isOpen, onClose }) => (
  <Drawer open={isOpen} onClose={onClose} openFrom='left' heading='Menu'>
    <div className='grid'>
      <MenuMobileNav onClose={onClose} />
    </div>
  </Drawer>
);
