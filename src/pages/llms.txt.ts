import type { APIRoute } from "astro";
import { getPublicBlogEntries } from "#/features/blog/utils/entry";

const blogEntries = await getPublicBlogEntries();

const getLlmsTxt = () => `# Keisuke Hayashi's website

## Blog

${blogEntries.map((entry) => `- [${entry.data.title}](${import.meta.env.SITE}/blog/posts/${entry.id})`).join("\n")}

## Other

- [About me](${import.meta.env.SITE}/about)

## Contact & Social

- **Email**: hi@kkhys.me
- **GitHub**: https://github.com/kkhys
- **Mastodon**: https://mastodon.kkhys.me/@kkhys
- **Website**: https://kkhys.me
- **Support**: https://coff.ee/kkhys
`;

export const GET: APIRoute = () => new Response(getLlmsTxt());
