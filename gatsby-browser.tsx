import 'destyle.css';
import React from 'react';
import Layouts from '@/layouts';
import type { GatsbyBrowser } from 'gatsby';

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  element,
  props,
}) => <Layouts {...props}>{element}</Layouts>;
