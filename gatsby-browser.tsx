import '@/styles/global.css';
import './src/styles/prism.css';
import 'prismjs/plugins/command-line/prism-command-line.css';
import React from 'react';
import { Layout } from '^/layouts';
import type { GatsbyBrowser } from 'gatsby';

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  element,
  props,
}) => <Layout {...props}>{element}</Layout>;
