import fetchSiteMetadata, { type Metadata } from "fetch-site-metadata";
import { parseHTML } from "linkedom";
import { isRasterImage } from "./image-signature";

export type { Metadata };

export interface MetadataFetcherOptions {
  /**
   * Whether to hit the network at all. Apps pass their own production check;
   * dev servers and CI builds get `placeholder` for every URL instead.
   */
  enabled: boolean;
  /** Returned (and cached per URL) while disabled. */
  placeholder?: Metadata | undefined;
  /** Returned when the fetch fails; not cached so a retry can succeed. */
  notFound?: Metadata | undefined;
  /**
   * Metadata resolved ahead of the build, keyed by URL. A hit skips the network
   * entirely, which is what lets a build render cards for hosts that answer its
   * IPs with a metadata-less page.
   */
  preloaded?: Readonly<Record<string, Metadata>> | undefined;
}

const PLACEHOLDER: Metadata = {
  title: "リンク",
  description: "外部リンク",
  image: undefined,
  icon: undefined,
};

const NOT_FOUND: Metadata = {
  title: "Not Found",
  description: "Page not found",
  image: undefined,
  icon: undefined,
};

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

// `fetch-site-metadata` streams the response through an HTMLRewriter that stops
// at the first element which cannot precede `<body>`, and decodes every chunk as
// UTF-8 whatever `Content-Type: charset=` and `<meta charset>` say. Two kinds of
// page come back unusable: legacy Japanese shops (item.rakuten.co.jp is EUC-JP)
// turn into U+FFFD soup, and a YouTube channel page carries its og:* meta some
// 50KB past `</head>`, so the stream ends before any of it is seen and every
// field but the icon is empty. Both are repaired by re-reading the whole
// document with linkedom.
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

const IMAGE_SOURCES = [
  ["property", "og:image:secure_url"],
  ["property", "og:image:url"],
  ["property", "og:image"],
  ["name", "twitter:image"],
  ["property", "twitter:image"],
  ["name", "thumbnail"],
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

// Whatever the stream did reach is kept: only the fields it left empty are
// filled in, so a page that merely needed a charset pass keeps its image.
const reextract = (html: string, metadata: Metadata): Metadata => {
  const { document } = parseHTML(html);
  const title = firstContent(document, TITLE_SOURCES) ?? document.title.trim();
  const src = metadata.image ? undefined : firstContent(document, IMAGE_SOURCES);
  return {
    ...metadata,
    title: title || metadata.title,
    description: firstContent(document, DESCRIPTION_SOURCES) ?? metadata.description,
    image: src ? { src, width: undefined, height: undefined, alt: undefined } : metadata.image,
  };
};

interface Page {
  bytes: ArrayBuffer;
  contentType: string | null;
}

// `fetch-site-metadata` parses whatever body comes back without ever looking at
// `response.ok`, so a host that answers the build's IPs with an error page is
// scraped into a card titled "403". Reading the page here first is what makes
// the status visible; the bytes are then reused by the repair pass, so the
// check costs no extra request on the pages that need repairing.
const fetchPage = async (url: string): Promise<Page> => {
  const response = await fetch(url, { headers: REQUEST_HEADERS });
  if (!response.ok) throw new Error(`${url} answered ${response.status}`);

  return {
    bytes: await response.arrayBuffer(),
    contentType: response.headers.get("content-type"),
  };
};

const repairMetadata = (page: Page, metadata: Metadata): Metadata => {
  const cutShort = !metadata.title;
  if (!cutShort && !isGarbled(metadata)) return metadata;

  try {
    // Garbled text only improves when the page declares a charset other than
    // UTF-8; re-decoding it as UTF-8 would reproduce the same U+FFFD. A parse
    // that ended early has nothing to lose either way.
    const declared = decodeWithDeclaredCharset(page.bytes, page.contentType);
    const html = declared ?? (cutShort ? new TextDecoder().decode(page.bytes) : undefined);
    return html ? reextract(html, metadata) : metadata;
  } catch {
    return metadata;
  }
};

// YouTube answers clients it treats as automated with a metadata-less variant
// of the watch page — title " - YouTube", the generic site description, no
// og:image — which is what memo's CI build (GitHub Actions IPs) gets. The
// public oEmbed endpoint has no such gate, so video URLs go through it instead
// of the scraper. It carries no description; the channel name takes that slot.
const YOUTUBE_OEMBED_ENDPOINT = "https://www.youtube.com/oembed";
const YOUTUBE_FAVICON = "https://www.youtube.com/favicon.ico";
const YOUTUBE_VIDEO_ID = /^[\w-]{11}$/u;
const YOUTUBE_PATH_PREFIXES = new Set(["embed", "shorts", "live", "v"]);
const YOUTUBE_HOSTS = new Set(["youtube.com", "m.youtube.com", "music.youtube.com"]);

interface YoutubeOEmbed {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
}

const asVideoId = (value: string | null | undefined): string | undefined =>
  value && YOUTUBE_VIDEO_ID.test(value) ? value : undefined;

const youtubeVideoId = (url: string): string | undefined => {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return undefined;
  }

  const host = parsed.hostname.replace(/^www\./u, "");
  const [first, second] = parsed.pathname.split("/").filter(Boolean);

  if (host === "youtu.be") return asVideoId(first);
  if (!YOUTUBE_HOSTS.has(host)) return undefined;
  if (first === "watch") return asVideoId(parsed.searchParams.get("v"));
  return first && YOUTUBE_PATH_PREFIXES.has(first) ? asVideoId(second) : undefined;
};

// oEmbed hands back `hqdefault` (480x360, letterboxed for 16:9 video). The
// 1280x720 still is sharper but only exists for recent enough uploads, and both
// are verified for the same reason og:images are: Astro fetches remote images
// at build time, so a 404 would take the build down.
const youtubeThumbnail = async (
  videoId: string,
  fallback: string | undefined,
): Promise<string | undefined> => {
  const maxres = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  if (await isProcessableImage(maxres)) return maxres;
  return fallback && (await isProcessableImage(fallback)) ? fallback : undefined;
};

const fetchYoutubeMetadata = async (videoId: string): Promise<Metadata | undefined> => {
  const target = encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`);

  try {
    const response = await fetch(`${YOUTUBE_OEMBED_ENDPOINT}?url=${target}&format=json`, {
      headers: { accept: "application/json" },
    });
    // Private, deleted and age-gated videos answer 401/403/404 here; falling
    // through to the scraper keeps whatever the watch page still exposes.
    if (!response.ok) return undefined;

    const data = (await response.json()) as YoutubeOEmbed;
    if (!data.title) return undefined;

    const src = await youtubeThumbnail(videoId, data.thumbnail_url);
    return {
      title: data.title,
      description: data.author_name,
      icon: YOUTUBE_FAVICON,
      image: src ? { src, width: undefined, height: undefined, alt: undefined } : undefined,
    };
  } catch {
    return undefined;
  }
};

const scrapeMetadata = async (url: string): Promise<Metadata> => {
  const page = await fetchPage(url);
  const fetched = await fetchSiteMetadata(url, {
    suppressAdditionalRequest: true,
    headers: REQUEST_HEADERS,
  });
  return dropUnprocessableImage(repairMetadata(page, fetched));
};

/**
 * Builds the `getMetadata(url)` used behind link cards: `fetch-site-metadata`
 * plus the repairs the blogs have needed in practice (garbled legacy charsets,
 * og:* meta the streaming parse never reaches, SVG or non-decodable og:images,
 * http-only image hosts), memoized per URL for the build. `preloaded` entries
 * win over the network, and YouTube video URLs come from oEmbed instead.
 * Failures — a refused connection as much as a non-2xx status — resolve to
 * `notFound` and are not cached.
 */
export const createMetadataFetcher = ({
  enabled,
  placeholder = PLACEHOLDER,
  notFound = NOT_FOUND,
  preloaded,
}: MetadataFetcherOptions) => {
  const cache = new Map<string, Metadata>();

  return async (url: string): Promise<Metadata> => {
    const cached = cache.get(url);
    if (cached) return cached;

    if (!enabled) {
      const copy = { ...placeholder };
      cache.set(url, copy);
      return copy;
    }

    const preset = preloaded?.[url];
    if (preset) {
      cache.set(url, preset);
      return preset;
    }

    try {
      const videoId = youtubeVideoId(url);
      const oembed = videoId ? await fetchYoutubeMetadata(videoId) : undefined;
      const metadata = oembed ?? (await scrapeMetadata(url));
      cache.set(url, metadata);
      return metadata;
    } catch {
      return { ...notFound };
    }
  };
};
