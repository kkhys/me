/**
 * Request guard against DNS rebinding and cross-origin requests.
 *
 * The server binds to localhost, but browsers will happily send cross-origin
 * POSTs to 127.0.0.1 from any page (CORS only blocks reading the response),
 * and DNS rebinding can point an attacker's hostname at 127.0.0.1. Both are
 * rejected here by validating the Host and Origin headers.
 */

export const isAllowedRequest = (req: Request, allowedHosts: ReadonlySet<string>): boolean => {
  const host = req.headers.get("host");
  if (!host || !allowedHosts.has(host)) return false;

  // Same-origin fetches may omit Origin; only validate it when present.
  const origin = req.headers.get("origin");
  if (origin === null) return true;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  return allowedHosts.has(originHost);
};
