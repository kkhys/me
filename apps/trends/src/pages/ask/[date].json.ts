import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import { getCollection } from "astro:content";

import { buildAskDigest } from "#/features/ask/utils/digest";

/* The context the AI dialog fetches for a day (see features/ask): one JSON
   per run, built from the same collection entry as the page, so the row
   anchors match the h4 ids the page renders. */
export const getStaticPaths = (async () => {
  const runs = await getCollection("runs");

  return runs.map((entry) => ({ params: { date: entry.id }, props: { entry } }));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = ({ props }) =>
  new Response(JSON.stringify(buildAskDigest(props.entry.data)), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
