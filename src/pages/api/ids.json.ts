import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const entries = await getCollection("lgtm", ({ data }) => {
    return data.isDraft !== true;
  });

  const ids = entries.map((entry) => entry.id);

  const response = {
    ids,
    count: ids.length,
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
