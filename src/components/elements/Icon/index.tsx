import clsx from 'clsx';
import React from 'react';
import type { FC } from 'react';

export type IconProps = {
  direction?: 'up' | 'right' | 'down' | 'left';
} & JSX.IntrinsicElements['svg'];

const Icon: FC<IconProps> = ({
  children,
  className,
  fill = 'currentColor',
  stroke,
  ...props
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 16 16'
    {...props}
    fill={fill}
    stroke={stroke}
    className={clsx('h-5 w-5', className)}
  >
    {children}
  </svg>
);

export const IconMenu: FC<IconProps> = ({
  stroke = 'currentColor',
  ...props
}) => (
  <Icon {...props} stroke={stroke}>
    <title>Menu</title>
    <line x1='3' y1='6.375' x2='17' y2='6.375' strokeWidth='1.25' />
    <line x1='3' y1='10.375' x2='17' y2='10.375' strokeWidth='1.25' />
    <line x1='3' y1='14.375' x2='17' y2='14.375' strokeWidth='1.25' />
  </Icon>
);

export const IconClose: FC<IconProps> = ({
  stroke = 'currentColor',
  ...props
}) => (
  <Icon {...props} stroke={stroke}>
    <title>Close</title>
    <line
      x1='4.44194'
      y1='4.30806'
      x2='15.7556'
      y2='15.6218'
      strokeWidth='1.25'
    />
    <line
      y1='-0.625'
      x2='16'
      y2='-0.625'
      transform='matrix(-0.707107 0.707107 0.707107 0.707107 16 4.75)'
      strokeWidth='1.25'
    />
  </Icon>
);

export const IconArrow: FC<IconProps> = ({ direction = 'right' }) => {
  let rotate;

  switch (direction) {
    case 'right':
      rotate = 'rotate-0';
      break;
    case 'left':
      rotate = 'rotate-180';
      break;
    case 'up':
      rotate = '-rotate-90';
      break;
    case 'down':
      rotate = 'rotate-90';
      break;
    default:
      rotate = 'rotate-0';
  }

  return (
    <Icon className={`h-5 w-5 ${rotate}`}>
      <title>Arrow</title>
      <path d='M7 3L14 10L7 17' strokeWidth='1.25' />
    </Icon>
  );
};

export const IconCaret: FC<IconProps> = ({
  direction = 'down',
  stroke = 'currentColor',
  ...props
}) => {
  let rotate;

  switch (direction) {
    case 'down':
      rotate = 'rotate-0';
      break;
    case 'up':
      rotate = 'rotate-180';
      break;
    case 'left':
      rotate = '-rotate-90';
      break;
    case 'right':
      rotate = 'rotate-90';
      break;
    default:
      rotate = 'rotate-0';
  }

  return (
    <Icon
      {...props}
      className={`h-5 w-5 transition ${rotate}`}
      fill='transparent'
      stroke={stroke}
    >
      <title>Caret</title>
      <path d='M14 8L10 12L6 8' strokeWidth='1.25' />
    </Icon>
  );
};

export const IconSearch: FC<IconProps> = (props) => (
  <Icon {...props}>
    <title>Search</title>
    <path
      fillRule='evenodd'
      d='M13.3 8.52a4.77 4.77 0 1 1-9.55 0 4.77 4.77 0 0 1 9.55 0Zm-.98 4.68a6.02 6.02 0 1 1 .88-.88l4.3 4.3-.89.88-4.3-4.3Z'
    />
  </Icon>
);

export const LightIcon: FC<IconProps> = (props) => (
  <Icon {...props}>
    <title>Light</title>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M7 1a1 1 0 0 1 2 0v1a1 1 0 1 1-2 0V1Zm4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm2.657-5.657a1 1 0 0 0-1.414 0l-.707.707a1 1 0 0 0 1.414 1.414l.707-.707a1 1 0 0 0 0-1.414Zm-1.415 11.313-.707-.707a1 1 0 0 1 1.415-1.415l.707.708a1 1 0 0 1-1.415 1.414ZM16 7.999a1 1 0 0 0-1-1h-1a1 1 0 1 0 0 2h1a1 1 0 0 0 1-1ZM7 14a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0v-1Zm-2.536-2.464a1 1 0 0 0-1.414 0l-.707.707a1 1 0 0 0 1.414 1.414l.707-.707a1 1 0 0 0 0-1.414Zm0-8.486A1 1 0 0 1 3.05 4.464l-.707-.707a1 1 0 0 1 1.414-1.414l.707.707ZM3 8a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1Z'
    />
  </Icon>
);

export const DarkIcon: FC<IconProps> = (props) => (
  <Icon {...props}>
    <title>Dark</title>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M7.23 3.333C7.757 2.905 7.68 2 7 2a6 6 0 1 0 0 12c.68 0 .758-.905.23-1.332A5.989 5.989 0 0 1 5 8c0-1.885.87-3.568 2.23-4.668ZM12 5a1 1 0 0 1 1 1 1 1 0 0 0 1 1 1 1 0 1 1 0 2 1 1 0 0 0-1 1 1 1 0 1 1-2 0 1 1 0 0 0-1-1 1 1 0 1 1 0-2 1 1 0 0 0 1-1 1 1 0 0 1 1-1Z'
    />
  </Icon>
);

export const SystemIcon: FC<IconProps> = (props) => (
  <Icon {...props}>
    <title>System</title>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M1 4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-1.5l.31 1.242c.084.333.36.573.63.808.091.08.182.158.264.24A1 1 0 0 1 11 15H5a1 1 0 0 1-.704-1.71c.082-.082.173-.16.264-.24.27-.235.546-.475.63-.808L5.5 11H4a3 3 0 0 1-3-3V4Zm3-1a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Z'
    />
  </Icon>
);
