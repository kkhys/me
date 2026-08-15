import { NODE_ENV } from "astro:env/client";
import { isRasterImage } from "@kkhys/ui/image-signature";
import fetchSiteMetadata, { type Metadata } from "fetch-site-metadata";
import { parseHTML } from "linkedom";
import { createResolvedCache } from "#/lib/api/cache";

const cache = createResolvedCache<Metadata>();

const REQUEST_HEADERS = {
  accept: "text/html",
  "accept-language": "ja,en-US;q=0.7,en;q=0.3",
} as const;

// Astro's sharp service refuses SVG inputs unless `image.dangerouslyProcessSVG`
// is enabled, so drop SVG og:images here to keep `<Image>` from crashing the build.
const isSvgSrc = (src: string): boolean => {
  const pathname = src.split(/[?#]/u, 1)[0] ?? src;
  return pathname.toLowerCase().endsWith(".svg");
};

// Some og:image endpoints advertise `content-type: image/png` but actually serve
// HTML (e.g. a bot-protection challenge page) to non-browser clients. sharp then
// fails with "Could not process image metadata" and crashes the whole build, so
// we sniff the leading bytes and only keep images sharp can actually decode.
const isProcessableImage = async (src: string): Promise<boolean> => {
  try {
    const response = await fetch(src, { headers: { accept: "image/*" } });
    if (!response.ok || !response.body) return false;

    const reader = response.body.getReader();
    const bytes: number[] = [];
    while (bytes.length < 16) {
      const { done, value } = await reader.read();
      if (done) break;
      // Only the signature bytes are needed; spreading a whole multi-KB chunk
      // into push() can blow the argument-count limit.
      if (value) bytes.push(...value.subarray(0, 16 - bytes.length));
    }
    await reader.cancel();

    return isRasterImage(new Uint8Array(bytes));
  } catch {
    return false;
  }
};

// Astro only optimizes remote images matching `image.remotePatterns` (https
// only), so an `http:` og:image is emitted verbatim and then blocked as mixed
// content on our https pages: the `<img>` never fires `load`, so the blur
// placeholder never clears. Most such hosts also serve https.
const toHttps = (src: string): string =>
  src.startsWith("http://") ? `https://${src.slice("http://".length)}` : src;

const dropUnprocessableImage = async (metadata: Metadata): Promise<Metadata> => {
  const image = metadata.image;
  if (!image?.src) return metadata;
  if (isSvgSrc(image.src)) return { ...metadata, image: undefined };

  const src = toHttps(image.src);
  return (await isProcessableImage(src))
    ? { ...metadata, image: { ...image, src } }
    : { ...metadata, image: undefined };
};

// `fetch-site-metadata` streams the raw response bytes into an HTMLRewriter
// that always decodes as UTF-8, ignoring both `Content-Type: charset=` and
// `<meta charset>`. Legacy Japanese shops (item.rakuten.co.jp is EUC-JP) come
// back as U+FFFD soup, so re-extract the text fields with the declared charset.
const REPLACEMENT_CHAR = "�";
const CHARSET_SNIFF_BYTES = 4096;

const isGarbled = ({ title, description }: Metadata): boolean =>
  Boolean(title?.includes(REPLACEMENT_CHAR) ?? false) ||
  Boolean(description?.includes(REPLACEMENT_CHAR) ?? false);

const charsetFromContentType = /charset\s*=\s*"?([^";,\s]+)/iu;
const charsetFromMeta = /<meta[^>]+charset\s*=\s*["']?([\w.:-]+)/iu;

const decodeWithDeclaredCharset = (
  bytes: ArrayBuffer,
  contentType: string | null,
): string | undefined => {
  // Charset declarations are pure ASCII, so a latin1 pass over the head of the
  // document is enough to find one without knowing the encoding yet.
  const head = new TextDecoder("latin1").decode(bytes.slice(0, CHARSET_SNIFF_BYTES));
  const charset =
    charsetFromContentType.exec(contentType ?? "")?.[1] ?? charsetFromMeta.exec(head)?.[1];
  if (!charset || /^utf-?8$/iu.test(charset)) return undefined;

  try {
    return new TextDecoder(charset).decode(bytes);
  } catch {
    // Unknown encoding label; the UTF-8 reading is the best we have.
    return undefined;
  }
};

// Same precedence as fetch-site-metadata's own rules. Legacy sites capitalize
// these attributes (www.kinn-tailor.com writes `name="Description"`) and
// linkedom's selector engine lacks the `[name="description" i]` flag, so match
// attribute values manually, case-insensitively.
const TITLE_SOURCES = [
  ["property", "og:title"],
  ["name", "twitter:title"],
  ["property", "twitter:title"],
] as const;

const DESCRIPTION_SOURCES = [
  ["property", "og:description"],
  ["name", "description"],
  ["name", "twitter:description"],
] as const;

const firstContent = (
  document: ReturnType<typeof parseHTML>["document"],
  sources: readonly (readonly [attribute: string, value: string])[],
): string | undefined => {
  const metas = [...document.querySelectorAll("meta")];
  for (const [attribute, value] of sources) {
    for (const meta of metas) {
      if (meta.getAttribute(attribute)?.toLowerCase() !== value) continue;
      const content = meta.getAttribute("content")?.trim();
      if (content) return content;
    }
  }
  return undefined;
};

const reextractText = (html: string, metadata: Metadata): Metadata => {
  const { document } = parseHTML(html);
  const title = firstContent(document, TITLE_SOURCES) ?? document.title.trim();
  return {
    ...metadata,
    title: title || metadata.title,
    description: firstContent(document, DESCRIPTION_SOURCES) ?? metadata.description,
  };
};

const repairGarbledText = async (url: string, metadata: Metadata): Promise<Metadata> => {
  if (!isGarbled(metadata)) return metadata;

  try {
    const response = await fetch(url, { headers: REQUEST_HEADERS });
    if (!response.ok) return metadata;

    const html = decodeWithDeclaredCharset(
      await response.arrayBuffer(),
      response.headers.get("content-type"),
    );
    return html ? reextractText(html, metadata) : metadata;
  } catch {
    return metadata;
  }
};

export const getMetadata = (url: string) =>
  cache(url, async () => {
    if (NODE_ENV !== "production" || process.env.CI) {
      return {
        title: "リンク",
        description: "外部リンク",
        image: undefined,
        icon: undefined,
      };
    }

    return await fetchSiteMetadata(url, {
      suppressAdditionalRequest: true,
      headers: REQUEST_HEADERS,
    })
      .then((metadata) => repairGarbledText(url, metadata))
      .then(dropUnprocessableImage)
      .catch(() => ({
        title: "Not Found",
        description: "Page not found",
        image: undefined,
        icon: undefined,
      }));
  });
