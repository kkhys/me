import React from 'react';
import * as styles from './styles';
import type { Interpolation, Theme } from '@emotion/react';
import type { ReactNode, FC } from 'react';

type ParagraphRoleProps = 'normal' | 'link';

type ParagraphProps = {
  children: ReactNode;
  className?: Interpolation<Theme>;
  tag?: 'p';
  size?: 's' | 'm' | 'l';
};

const paragraphFactory: (role: ParagraphRoleProps) => FC<ParagraphProps> =
  (role) =>
  ({ children, className, tag: Tag = 'p', size = 'm' }) =>
    <Tag css={[styles[role], styles[size], className]}>{children}</Tag>;

const Paragraph = paragraphFactory('normal');
export default Paragraph;

export const LinkParagraph = paragraphFactory('link');
