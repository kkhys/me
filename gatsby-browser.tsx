import type { GatsbyBrowser } from 'gatsby';
import 'destyle.css';
import Layout from '@/Layout';
import type React from 'react';
import Contexts from '@/contexts';

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element,
}) => <Contexts>{element}</Contexts>;

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  props,
  element,
}) => <Layout {...props}>{element}</Layout>;
