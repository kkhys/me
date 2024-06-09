import * as React from 'react';

type Browser = 'internet explorer' | 'edge' | 'chrome' | 'safari' | 'firefox' | 'opera' | 'other';

export const useBrowser = () => {
  const [browser, setBrowser] = React.useState<Browser | null>(null);

  React.useEffect(() => {
    const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    const isOpera = !!window.opr;
    const isEdge = window.navigator.userAgent.indexOf('Edge') > -1;

    if (/Trident|MSIE/.test(userAgent)) setBrowser('internet explorer');
    else if (isEdge) setBrowser('edge');
    else if (/Chrome/.test(userAgent) && !isOpera && !isEdge) setBrowser('chrome');
    else if (/Safari/.test(userAgent) && !isOpera && !isEdge) setBrowser('safari');
    else if (/Firefox/.test(userAgent)) setBrowser('firefox');
    else if (isOpera || /OPR/.test(userAgent)) setBrowser('opera');
    else setBrowser('other');
  }, []);

  return { browser };
};
