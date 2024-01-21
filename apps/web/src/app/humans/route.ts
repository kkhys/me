import { NextResponse } from 'next/server';
import { format } from 'date-fns';

import { me } from '#/config';

// eslint-disable-next-line @typescript-eslint/require-await
export const GET = async (): Promise<NextResponse> => {
  const humans = `# TXT for Human Beings

  ###
   ##
   ##  ##
   ## ##
   ####
   ## ##
   ##  ##

## TEAM

  Owner,
  Developer,
  Publisher,
  Writer:    ${me.name}
  Location:  Tokyo, Japan
  GitHub:    ${me.social.github.url}
  X:         ${me.social.x.url}
  Instagram: ${me.social.instagram.url}
  
## SITE

  Last update: ${format(new Date(), 'yyyy-MM-dd')}
  Language:    ja-JP
  Timezone:    JST
  Standards:   Next.js, TypeScript, React, Tailwind CSS, Contentlayer, Vercel
  Software:    WebStorm
`;

  return new NextResponse(humans, {
    status: 200,
    headers: {
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
      'Content-Type': 'text/plain',
    },
  });
};
