/**
 * Local-only dev server for composing memos.
 *
 * Serves the studio UI (bundled by Bun's HTML import) and a JSON API that
 * reads/writes the memo-content submodule directly. Never deployed; binds to
 * localhost only.
 */

import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { $, type BunRequest } from "bun";
import homepage from "./index.html";
import { createMemo, listMemos, type MemoImageInput } from "./memo-store";
import { isAllowedRequest } from "./request-guard";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const CONTENT_DIR = fileURLToPath(new URL("../../memo/memo-content", import.meta.url));
const MEMO_DIR = join(CONTENT_DIR, "memo");
const PORT = Number(process.env.PORT ?? 5757);

const ALLOWED_HOSTS: ReadonlySet<string> = new Set([`127.0.0.1:${PORT}`, `localhost:${PORT}`]);

const guarded =
  <T extends string>(handler: (req: BunRequest<T>) => Response | Promise<Response>) =>
  (req: BunRequest<T>): Response | Promise<Response> =>
    isAllowedRequest(req, ALLOWED_HOSTS)
      ? handler(req)
      : new Response("Forbidden", { status: 403 });

const DIR_NAME_PATTERN = /^\d{8}_\d{6}$/u;
const IMAGE_NAME_PATTERN = /^\d{2}\.(jpg|png)$/u;

const IMAGE_EXT_BY_MIME: Record<string, MemoImageInput["ext"]> = {
  "image/jpeg": "jpg",
  "image/png": "png",
};

const errorResponse = (error: unknown, status = 400) =>
  Response.json({ error: error instanceof Error ? error.message : String(error) }, { status });

const formField = (form: FormData, name: string): string | undefined => {
  const value = form.get(name);
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
};

const syncTimestamp = () =>
  new Date()
    .toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replaceAll("/", "-");

const server = Bun.serve({
  hostname: "127.0.0.1",
  port: PORT,
  development: true,
  routes: {
    "/": homepage,

    "/api/memos": {
      GET: guarded(() => Response.json({ memos: listMemos(MEMO_DIR) })),

      POST: guarded(async (req) => {
        try {
          const form = await req.formData();

          const images: MemoImageInput[] = [];
          for (const value of form.getAll("images")) {
            if (!(value instanceof File) || value.size === 0) continue;
            const ext = IMAGE_EXT_BY_MIME[value.type];
            if (!ext) return errorResponse(`Unsupported image type: ${value.type || "unknown"}`);
            images.push({ data: new Uint8Array(await value.arrayBuffer()), ext });
          }

          const memo = createMemo(MEMO_DIR, {
            body: formField(form, "body") ?? "",
            createdAt: formField(form, "createdAt"),
            tag: formField(form, "tag"),
            comment: formField(form, "comment"),
            quote: formField(form, "quote"),
            isDraft: form.get("isDraft") === "true",
            hideLinkCard: form.get("hideLinkCard") === "true",
            images,
          });

          return Response.json({ memo }, { status: 201 });
        } catch (error) {
          return errorResponse(error);
        }
      }),
    },

    "/api/images/:dirName/:file": guarded(async (req) => {
      const { dirName, file } = req.params;
      if (!DIR_NAME_PATTERN.test(dirName) || !IMAGE_NAME_PATTERN.test(file)) {
        return new Response("Not Found", { status: 404 });
      }

      const image = Bun.file(join(MEMO_DIR, dirName, file));
      if (!(await image.exists())) {
        return new Response("Not Found", { status: 404 });
      }

      return new Response(image);
    }),

    "/api/status": guarded(async () => {
      try {
        const status = await $`git -C ${CONTENT_DIR} status --porcelain`.text();
        return Response.json({ changes: status.split("\n").filter(Boolean).length });
      } catch (error) {
        return errorResponse(error, 500);
      }
    }),

    "/api/sync": {
      POST: guarded(async (req) => {
        const deploy = await req
          .json()
          .then((body: unknown) => (body as { deploy?: unknown } | null)?.deploy === true)
          .catch(() => false);

        try {
          const status = await $`git -C ${CONTENT_DIR} status --porcelain`.text();
          if (!status.trim()) {
            return Response.json({ synced: false, message: "No changes to commit" });
          }

          await $`git -C ${CONTENT_DIR} add -A`;
          await $`git -C ${CONTENT_DIR} commit -m ${`feat: update memos ${syncTimestamp()}`}`;
          await $`git -C ${CONTENT_DIR} push`;
        } catch (error) {
          return errorResponse(error, 500);
        }

        if (!deploy) {
          return Response.json({ synced: true, message: "Synced successfully" });
        }

        // Bump the submodule pointer in the main repo so the push actually
        // deploys (sync-submodule.yml opens an auto-merging PR).
        try {
          await $`gh workflow run sync-submodule.yml`.cwd(REPO_ROOT).quiet();
          return Response.json({ synced: true, message: "Synced, submodule sync triggered" });
        } catch (error) {
          const reason = error instanceof Error ? error.message : String(error);
          return Response.json({
            synced: true,
            message: `Synced, but workflow trigger failed: ${reason}`,
          });
        }
      }),
    },
  },

  fetch: () => new Response("Not Found", { status: 404 }),
});

console.log(`studio running at ${server.url}`);
