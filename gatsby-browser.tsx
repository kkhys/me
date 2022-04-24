import 'destyle.css';
import React from 'react';
import { Layout } from '@/layouts';
import type { GatsbyBrowser } from 'gatsby';

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  element,
  props,
}) => <Layout {...props}>{element}</Layout>;
