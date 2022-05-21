import { Link } from 'gatsby';
import React from 'react';
import type { Interpolation, Theme } from '@emotion/react';
import type { FC, ReactNode } from 'react';

type AnchorProps = {
  to: string;
  children: ReactNode;
  className?: Interpolation<Theme>;
  isExternal?: boolean;
  isFollow?: boolean;
};

const Anchor: FC<AnchorProps> = ({
  to,
  children,
  className,
  isExternal = false,
  isFollow = false,
}) =>
  isExternal ? (
    <a
      href={to}
      target='_blank'
      rel={`noreferrer noopener ${isFollow ? '' : 'nofollow'}`}
      css={className}
    >
      {children}
    </a>
  ) : (
    <Link to={to} css={className}>
      {children}
    </Link>
  );

export default Anchor;
