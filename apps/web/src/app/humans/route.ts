import { format } from "date-fns";
import { NextResponse } from "next/server";
import { me } from "#/config";

export const revalidate = 86400;

const lastUpdateDate = new Date();
const lastUpdate = format(lastUpdateDate, "yyyy-MM-dd");

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
  GitHub:    ${me.github}
  Mastodon:  ${me.mastodon}
  
## SITE

  Last update: ${lastUpdate}
  Language:    ja-JP
  Timezone:    JST
  Standards:   Next.js, TypeScript, React, Tailwind CSS, Contentlayer, Vercel
  Software:    WebStorm
`;

  return new NextResponse(humans, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
