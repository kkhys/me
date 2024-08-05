import * as React from 'react';

type Browser = 'internet explorer' | 'edge' | 'chrome' | 'safari' | 'firefox' | 'opera' | 'other';

export const useBrowser = () => {
  const [browser, setBrowser] = React.useState<Browser | null>(null);

  React.useEffect(() => {
    const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    const isOpera = !!window.opr;
    const isEdge = window.navigator.userAgent.includes('Edge');

    if (/Trident|MSIE/.test(userAgent)) setBrowser('internet explorer');
    else if (isEdge) setBrowser('edge');
    else if (userAgent.includes('Chrome') && !isOpera && !isEdge) setBrowser('chrome');
    else if (userAgent.includes('Safari') && !isOpera && !isEdge) setBrowser('safari');
    else if (userAgent.includes('Firefox')) setBrowser('firefox');
    else if (isOpera || userAgent.includes('OPR')) setBrowser('opera');
    else setBrowser('other');
  }, []);

  return { browser };
};
