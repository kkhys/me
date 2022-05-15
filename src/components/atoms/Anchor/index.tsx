import { Link } from 'gatsby';
import React from 'react';
import type { FC, ReactNode } from 'react';

type AnchorProps = {
  to: string;
  children: ReactNode;
  isExternal?: boolean;
  isFollow?: boolean;
};

const Anchor: FC<AnchorProps> = ({
  to,
  children,
  isExternal = false,
  isFollow = false,
}) =>
  isExternal ? (
    <a
      href={to}
      target='_blank'
      rel={`noreferrer noopener ${isFollow ? '' : 'nofollow'}`}
    >
      {children}
    </a>
  ) : (
    <Link to={to}>{children}</Link>
  );

export default Anchor;
