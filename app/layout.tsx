import type { ReactNode } from 'react';

import '#/styles/globals.css';
import Script from 'next/script';

export const metadata = {
  title: {
    default: 'kkhys.me',
    template: '%s | kkhys.me',
  },
  description: 'Personal website of Keisuke Hayashi.',
};

// TODO: 圧縮した方が良いのか調査
const modeScript = `
  let darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  updateMode()
  darkModeMediaQuery.addEventListener('change', updateModeWithoutTransitions)
  window.addEventListener('storage', updateModeWithoutTransitions)
  function updateMode() {
    let isSystemDarkMode = darkModeMediaQuery.matches
    let isDarkMode = window.localStorage.isDarkMode === 'true' || (!('isDarkMode' in window.localStorage) && isSystemDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    if (isDarkMode === isSystemDarkMode) {
      delete window.localStorage.isDarkMode
    }
  }
  function disableTransitionsTemporarily() {
    document.documentElement.classList.add('[&_*]:!transition-none')
    window.setTimeout(() => {
      document.documentElement.classList.remove('[&_*]:!transition-none')
    }, 0)
  }
  function updateModeWithoutTransitions() {
    disableTransitionsTemporarily()
    updateMode()
  }
`;

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html className='h-full antialiased' lang='ja'>
      {/* TODO: サニタイズする（そもそもすべきなのか調査） */}
      <Script id='mode-script' dangerouslySetInnerHTML={{ __html: modeScript }} />
      {/* TODO: url を相対的にするとエラーになる件を調査 @see: https://github.com/vercel/turbo/issues/3573 */}
      <body className="bg-gray-1100 bg-[url('https://kkhys.me/grid.svg')]">{children}</body>
    </html>
  );
};

export default RootLayout;
