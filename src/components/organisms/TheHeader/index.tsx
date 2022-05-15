import { Link } from 'gatsby';
import React from 'react';
import { Container } from '^/atoms';
import * as styles from './styles';
import type { WindowLocation } from '@reach/router';
import type { FC } from 'react';

type TheHeaderProps = {
  title: string;
  location: WindowLocation;
};

const TheHeader: FC<TheHeaderProps> = ({ title, location }) => {
  const HeadingLevel = location.pathname === '/' ? 'h1' : 'h3';
  return (
    <header css={styles.header()}>
      <Container>
        <Link to='/'>
          <div css={styles.inner()}>
            <HeadingLevel css={styles.link()}>
              <img
                src='/icons/site-logo.svg'
                alt={title}
                css={styles.logo()}
                width={165}
                height={37}
              />
            </HeadingLevel>
          </div>
        </Link>
      </Container>
    </header>
  );
};

export default TheHeader;
