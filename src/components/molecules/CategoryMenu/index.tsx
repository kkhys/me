import React from 'react';
import { Anchor } from '^/atoms';
import * as styles from './styles';
import type { WindowLocation } from '@reach/router';
import type { FC } from 'react';

type CategoryLinkProps = {
  currentPage: number;
  path: string;
  link: string;
  icon: string;
  label: string;
};

type CategoryMenuProps = {
  location: WindowLocation;
  currentPage: number;
};

const CategoryLink: FC<CategoryLinkProps> = ({
  currentPage,
  path,
  link,
  icon,
  label,
}) => {
  const isActive =
    currentPage === 1
      ? path === link
      : link === '/'
      ? path === `/${currentPage}/`
      : path === `${link}/${currentPage}/`;
  return (
    <li css={styles.item()}>
      <Anchor to={link}>
        <div
          css={[styles.iconWrapper(), isActive && styles.iconWrapperActive()]}
        >
          <img
            src={icon}
            alt={label}
            css={[styles.icon(), isActive && styles.iconActive()]}
          />
        </div>
      </Anchor>
      <div css={styles.label()}>{label}</div>
    </li>
  );
};

const CategoryMenu: FC<CategoryMenuProps> = ({ location, currentPage }) => {
  const path = location.pathname;
  return (
    <nav css={styles.nav()}>
      <ul css={styles.list()}>
        <CategoryLink
          currentPage={currentPage}
          path={path}
          link='/'
          icon='/icons/new.svg'
          label='New'
        />
        <CategoryLink
          currentPage={currentPage}
          path={path}
          link='/t/'
          icon='/icons/tech.svg'
          label='Tech'
        />
      </ul>
    </nav>
  );
};

export default CategoryMenu;
