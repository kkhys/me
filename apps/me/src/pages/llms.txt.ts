import type { APIRoute } from "astro";
import { me, siteConfig } from "#/config/site";
import { sites } from "#/config/sites";
import { getPublicBlogEntries } from "#/features/blog/utils/entry";
import { BASE_URL } from "#/utils/base-url";

const blogEntries = await getPublicBlogEntries();

const getLlmsTxt = () => `# ${siteConfig.title}'s website

## Blog

${blogEntries.map((entry) => `- [${entry.data.title}](${BASE_URL}/blog/posts/${entry.id})`).join("\n")}

## Other

- [About me](${BASE_URL}/about)
- [Bucket list](${BASE_URL}/bucket-list)

## Sites

${sites.map(({ label, href, description }) => `- [${label}](${href}): ${description}`).join("\n")}

## Contact & Social

- **Email**: ${me.email}
- **GitHub**: ${me.github.url}
- **Memo**: ${me.memo}
- **Website**: ${BASE_URL}
- **Support**: ${siteConfig.support}
`;

export const GET: APIRoute = () => new Response(getLlmsTxt());
