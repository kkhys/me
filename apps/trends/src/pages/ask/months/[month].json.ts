import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import { getCollection } from "astro:content";

import { buildAskMonth } from "#/features/ask/utils/month";

/* The context the AI dialog fetches for the 7 / 30 日間 and 全期間 scopes
   (see features/ask): one JSON per month with each day's hero and counts, so
   a week costs one or two small files instead of seven days of rows. */
export const getStaticPaths = (async () => {
  const runs = await getCollection("runs");
  const months = new Set(runs.map((entry) => entry.id.slice(0, 7)));

  return [...months].map((month) => ({
    params: { month },
    props: { runs: runs.map((entry) => entry.data) },
  }));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = ({ params, props }) =>
  new Response(JSON.stringify(buildAskMonth(params.month ?? "", props.runs)), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
