import * as React from 'react';
import { Img } from '@react-email/components';

type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  logo: (_props: IconProps) => (
    <Img src='https://kkhys.me/twitter-image' width='20' height='20' alt='Site logo' className='rounded-md' />
  ),
};
