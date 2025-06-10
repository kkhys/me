import type { ClientResponse } from "hono/client";
import type { StatusCode } from "hono/utils/http-status";

export const fetcher =
  <T>(fn: () => Promise<ClientResponse<T, StatusCode, "json">>) =>
  () =>
    fn().then((res) => {
      if (res.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      return res.json();
    });
