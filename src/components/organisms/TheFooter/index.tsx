import React from 'react';
import { Anchor, Container, Paragraph } from '^/atoms';
import * as styles from './styles';
import type { FC } from 'react';

const TheFooter: FC<{ copyright: string }> = ({ copyright }) => (
  <footer css={styles.footer()}>
    <Container>
      <div css={styles.copyright()}>
        <Anchor to='https://github.com/ktnkk/me/' isExternal>
          <Paragraph className={styles.sourceCode()}>SourceCode</Paragraph>
        </Anchor>
        <p>{copyright}</p>
      </div>
    </Container>
  </footer>
);

export default TheFooter;
