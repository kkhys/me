import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { formatForEntry } from "#/components/lgtm-image";

export const GET: APIRoute = async () => {
  const entries = await getCollection("lgtm");

  const items = entries.map((entry) => ({
    id: entry.id,
    format: formatForEntry(entry),
  }));

  const response = {
    ids: items.map(({ id }) => id),
    entries: items,
    count: items.length,
    updatedAt: new Date().toISOString(),
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, must-revalidate",
    },
  });
};
