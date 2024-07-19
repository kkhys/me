import * as React from 'react';

type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  logo: (props: IconProps) => (
    <svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256' {...props}>
      <rect x='0' y='0' width='256' height='256' className='fill-[#0a0a0b]' />
      <path
        className='fill-white'
        d='M108.7 170.8L94.4 170.8L94.4 76.3L108.7 76.3L108.7 121.4L109.8 121.4L149.5 76.3L167.4 76.3L129.3 118.9L167.6 170.8L150.4 170.8L119.8 128.6L108.7 141.4L108.7 170.8Z '
      />
    </svg>
  ),
};
