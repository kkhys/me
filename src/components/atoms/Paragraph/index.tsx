import React from 'react';
import * as styles from './styles';
import type { ReactNode, FC } from 'react';

type ParagraphRoleProps = 'normal' | 'link';

type ParagraphProps = {
  tag?: 'p';
  size?: 's' | 'm' | 'l';
  children: ReactNode;
};

const paragraphFactory: (role: ParagraphRoleProps) => FC<ParagraphProps> =
  (role) =>
  ({ children, tag: Tag = 'p', size = 'm' }) =>
    <Tag css={[styles[role], styles[size]]}>{children}</Tag>;

const Paragraph = paragraphFactory('normal');
export default Paragraph;

export const LinkParagraph = paragraphFactory('link');
