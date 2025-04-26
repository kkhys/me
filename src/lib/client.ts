import { hc } from "hono/client";
import { BASE_URL } from "#/lib/base-url";
import type { APIType } from "#/pages/api/[...path]";

export const client = hc<APIType>(BASE_URL);
