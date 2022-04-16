import Contexts from '@/contexts';
import Layout from '@/Layout';
import type { GatsbyBrowser } from 'gatsby';
import 'destyle.css';
import type React from 'react';

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element,
}) => <Contexts>{element}</Contexts>;

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  props,
  element,
}) => <Layout {...props}>{element}</Layout>;
