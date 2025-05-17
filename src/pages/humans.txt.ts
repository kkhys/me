import type { APIRoute } from "astro";
import { me } from "#/config/site";

const lastUpdateDate = new Date();
const pad = (n: number) => n.toString().padStart(2, "0");
const lastUpdate = [
  lastUpdateDate.getFullYear(),
  pad(lastUpdateDate.getMonth() + 1),
  pad(lastUpdateDate.getDate()),
].join("-");

const getHumansTxt = () => `# TXT for Human Beings

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
  GitHub:    ${me.github.url}
  Mastodon:  ${me.mastodon}
  
## SITE

  Last update: ${lastUpdate}
  Language:    ja-JP
  Timezone:    JST
  Standards:   Astro, TypeScript, React, Tailwind CSS, Vercel
  Software:    WebStorm
`;

export const GET: APIRoute = () => new Response(getHumansTxt());
