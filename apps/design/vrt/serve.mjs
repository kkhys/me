/* Foreground static server for dist/. `astro preview` daemonizes when run
   without a TTY, which breaks Playwright's webServer lifecycle management. */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const PORT = Number(process.argv[2] ?? 4381);
const ROOT = new URL("../dist", import.meta.url).pathname;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

createServer(async (req, res) => {
  const path = normalize(new URL(req.url ?? "/", "http://localhost").pathname);
  /* Cloudflare Pages resolves extensionless URLs to `.html`; mirror that so
     in-page links and the preview iframes work against dist/ too. */
  const file = path.endsWith("/")
    ? `${path}index.html`
    : extname(path) === ""
      ? `${path}.html`
      : path;
  try {
    const body = await readFile(join(ROOT, file));
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
  }
}).listen(PORT);
