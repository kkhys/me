import type { Metadata } from "fetch-site-metadata";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMetadataFetcher } from "../link-metadata";

vi.mock("fetch-site-metadata", () => ({
  default: vi.fn<typeof import("fetch-site-metadata").default>(),
}));

const fetched = async () => (await import("fetch-site-metadata")).default;

const SITE: Metadata = {
  title: "Example",
  description: "An example site",
  image: undefined,
  icon: undefined,
};

// JPEG magic number, padded so the signature check can read past the header.
const JPEG_BYTES = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

// Spelled from the Response constructor rather than DOM's BodyInit: this
// package type-checks against bun's lib, which has no DOM globals.
type ResponseBody = ConstructorParameters<typeof Response>[0];

const VIDEO_ID = "YeohjAYgyQ4";
const HQ_THUMBNAIL = `https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`;
const MAXRES_THUMBNAIL = `https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

const documentWith = (meta: string) =>
  `<!doctype html><html><head><title></title></head><body><script>var a=1;</script>${meta}</body></html>`;

const OEMBED = {
  title: "I Left Tokyo for Rural Japan",
  author_name: "Keisuke",
  thumbnail_url: HQ_THUMBNAIL,
};

interface YoutubeStub {
  status?: number;
  payload?: Record<string, unknown>;
  /** Whether the 1280x720 still exists for this video. */
  maxres?: boolean;
  /** Whether the thumbnail oEmbed itself points at is reachable. */
  hq?: boolean;
}

// Typed from the call signature rather than `typeof fetch`: this package's
// lib declares static members on it that a bare mock can't satisfy.
const stubYoutube = ({
  status = 200,
  payload = OEMBED,
  maxres = true,
  hq = true,
}: YoutubeStub = {}) => {
  const image = (exists: boolean) =>
    Promise.resolve(
      exists
        ? new Response(JPEG_BYTES as unknown as ResponseBody)
        : new Response(null, { status: 404 }),
    );

  const spy = vi.fn<(input: string | URL | Request) => Promise<Response>>((input) => {
    const url = String(input);
    if (url.startsWith("https://www.youtube.com/oembed")) {
      return Promise.resolve(new Response(JSON.stringify(payload), { status }));
    }
    if (url === MAXRES_THUMBNAIL) return image(maxres);
    if (url === HQ_THUMBNAIL) return image(hq);
    throw new Error(`unexpected fetch: ${url}`);
  });
  vi.stubGlobal("fetch", spy);
  return spy;
};

describe("createMetadataFetcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("disabled", () => {
    it("returns the placeholder without touching the network", async () => {
      const getMetadata = createMetadataFetcher({ enabled: false });
      await expect(getMetadata("https://example.com")).resolves.toEqual({
        title: "リンク",
        description: "外部リンク",
        image: undefined,
        icon: undefined,
      });
      expect(await fetched()).not.toHaveBeenCalled();
    });

    it("uses the app's placeholder and hands out one object per URL", async () => {
      const placeholder: Metadata = {
        title: "Link",
        description: "External link",
        image: undefined,
        icon: undefined,
      };
      const getMetadata = createMetadataFetcher({ enabled: false, placeholder });
      const first = await getMetadata("https://a.example");
      const again = await getMetadata("https://a.example");
      const other = await getMetadata("https://b.example");
      expect(first).toEqual(placeholder);
      expect(again).toBe(first);
      expect(other).toEqual(first);
      expect(other).not.toBe(first);
    });
  });

  describe("enabled", () => {
    it("fetches with the shared headers and caches per URL", async () => {
      vi.mocked(await fetched()).mockResolvedValue(SITE);
      const getMetadata = createMetadataFetcher({ enabled: true });

      const first = await getMetadata("https://example.com");
      const second = await getMetadata("https://example.com");

      expect(first).toEqual(SITE);
      expect(second).toBe(first);
      expect(await fetched()).toHaveBeenCalledTimes(1);
      expect(await fetched()).toHaveBeenCalledWith("https://example.com", {
        suppressAdditionalRequest: true,
        headers: {
          accept: "text/html",
          "accept-language": "ja,en-US;q=0.7,en;q=0.3",
        },
      });
    });

    it("resolves to Not Found on failure and retries on the next call", async () => {
      vi.mocked(await fetched())
        .mockRejectedValueOnce(new Error("network"))
        .mockResolvedValueOnce(SITE);
      const getMetadata = createMetadataFetcher({ enabled: true });

      await expect(getMetadata("https://example.com")).resolves.toEqual({
        title: "Not Found",
        description: "Page not found",
        image: undefined,
        icon: undefined,
      });
      await expect(getMetadata("https://example.com")).resolves.toEqual(SITE);
      expect(await fetched()).toHaveBeenCalledTimes(2);
    });

    it("drops an SVG og:image so the image pipeline never sees it", async () => {
      vi.mocked(await fetched()).mockResolvedValue({
        ...SITE,
        image: { src: "https://example.com/og.svg", width: "1200", height: "630", alt: "" },
      });
      const getMetadata = createMetadataFetcher({ enabled: true });
      const metadata = await getMetadata("https://example.com");
      expect(metadata.image).toBeUndefined();
    });
  });

  describe("YouTube", () => {
    it("reads a video from oEmbed instead of the watch page", async () => {
      const fetchSpy = stubYoutube();
      const getMetadata = createMetadataFetcher({ enabled: true });

      await expect(getMetadata(`https://youtu.be/${VIDEO_ID}?si=Keif9yEo`)).resolves.toEqual({
        title: OEMBED.title,
        description: OEMBED.author_name,
        icon: "https://www.youtube.com/favicon.ico",
        image: { src: MAXRES_THUMBNAIL, width: undefined, height: undefined, alt: undefined },
      });
      expect(await fetched()).not.toHaveBeenCalled();
      expect(new URL(String(fetchSpy.mock.calls[0]?.[0])).searchParams.get("url")).toBe(
        `https://www.youtube.com/watch?v=${VIDEO_ID}`,
      );
    });

    it("keeps the oEmbed thumbnail when the 1280x720 still is missing", async () => {
      stubYoutube({ maxres: false });
      const getMetadata = createMetadataFetcher({ enabled: true });

      const metadata = await getMetadata(`https://youtu.be/${VIDEO_ID}`);
      expect(metadata.image?.src).toBe(HQ_THUMBNAIL);
    });

    it("drops the image when no thumbnail is reachable", async () => {
      stubYoutube({ maxres: false, hq: false });
      const getMetadata = createMetadataFetcher({ enabled: true });

      const metadata = await getMetadata(`https://youtu.be/${VIDEO_ID}`);
      expect(metadata).toMatchObject({ title: OEMBED.title, image: undefined });
    });

    it.each([
      `https://www.youtube.com/watch?v=${VIDEO_ID}&t=10s`,
      `https://m.youtube.com/watch?v=${VIDEO_ID}`,
      `https://music.youtube.com/watch?v=${VIDEO_ID}`,
      `https://www.youtube.com/shorts/${VIDEO_ID}`,
      `https://www.youtube.com/embed/${VIDEO_ID}`,
      `https://www.youtube.com/live/${VIDEO_ID}`,
    ])("recognizes %s as a video", async (url) => {
      stubYoutube();
      const getMetadata = createMetadataFetcher({ enabled: true });

      await expect(getMetadata(url)).resolves.toMatchObject({ title: OEMBED.title });
      expect(await fetched()).not.toHaveBeenCalled();
    });

    it.each([
      "https://www.youtube.com/@keisuke_life",
      "https://www.youtube.com/watch?v=too-short",
      "https://notyoutube.example/watch?v=YeohjAYgyQ4",
    ])("leaves %s to the scraper", async (url) => {
      const fetchSpy = stubYoutube();
      vi.mocked(await fetched()).mockResolvedValue(SITE);
      const getMetadata = createMetadataFetcher({ enabled: true });

      await expect(getMetadata(url)).resolves.toEqual(SITE);
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("falls back to the scraper when oEmbed refuses the video", async () => {
      stubYoutube({ status: 401 });
      vi.mocked(await fetched()).mockResolvedValue(SITE);
      const getMetadata = createMetadataFetcher({ enabled: true });

      await expect(getMetadata(`https://youtu.be/${VIDEO_ID}`)).resolves.toEqual(SITE);
      expect(await fetched()).toHaveBeenCalledTimes(1);
    });
  });

  describe("preloaded", () => {
    const CHANNEL = "https://www.youtube.com/@keisuke_life";
    const PRESET: Metadata = {
      title: "Channel",
      description: "A channel",
      image: undefined,
      icon: undefined,
    };

    it("answers from the preloaded entry without touching the network", async () => {
      const getMetadata = createMetadataFetcher({
        enabled: true,
        preloaded: { [CHANNEL]: PRESET },
      });

      await expect(getMetadata(CHANNEL)).resolves.toEqual(PRESET);
      expect(await fetched()).not.toHaveBeenCalled();
    });

    it("scrapes a URL the preload does not cover", async () => {
      vi.mocked(await fetched()).mockResolvedValue(SITE);
      const getMetadata = createMetadataFetcher({
        enabled: true,
        preloaded: { [CHANNEL]: PRESET },
      });

      await expect(getMetadata("https://example.com")).resolves.toEqual(SITE);
      expect(await fetched()).toHaveBeenCalledTimes(1);
    });

    it("still hands out the placeholder while disabled", async () => {
      const getMetadata = createMetadataFetcher({
        enabled: false,
        preloaded: { [CHANNEL]: PRESET },
      });

      await expect(getMetadata(CHANNEL)).resolves.toMatchObject({ title: "リンク" });
    });
  });

  // fetch-site-metadata stops parsing at the first element that cannot precede
  // <body>, and a YouTube channel page puts its og:* meta well past that point.
  describe("metadata past the end of the streaming parse", () => {
    const CHANNEL = "https://www.youtube.com/@keisuke_life";
    const ICON = "https://www.youtube.com/favicon.ico";
    const AVATAR = "https://yt3.example/avatar.jpg";

    const EMPTY: Metadata = {
      title: undefined,
      description: undefined,
      image: undefined,
      icon: ICON,
    };

    const stubDocument = (html: string) => {
      const spy = vi.fn<(input: string | URL | Request) => Promise<Response>>((input) =>
        Promise.resolve(
          String(input) === CHANNEL
            ? new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } })
            : new Response(JPEG_BYTES as unknown as ResponseBody),
        ),
      );
      vi.stubGlobal("fetch", spy);
      return spy;
    };

    it("re-reads the whole document when the stream yielded no title", async () => {
      vi.mocked(await fetched()).mockResolvedValue(EMPTY);
      const fetchSpy = stubDocument(
        documentWith(
          '<meta property="og:title" content="山白Shanbai">' +
            '<meta property="og:description" content="handicrafts">' +
            `<meta property="og:image" content="${AVATAR}">`,
        ),
      );
      const getMetadata = createMetadataFetcher({ enabled: true });

      await expect(getMetadata(CHANNEL)).resolves.toEqual({
        title: "山白Shanbai",
        description: "handicrafts",
        icon: ICON,
        image: { src: AVATAR, width: undefined, height: undefined, alt: undefined },
      });
      expect(fetchSpy.mock.calls[0]?.[0]).toBe(CHANNEL);
    });

    it("keeps the empty result when the document carries no metadata either", async () => {
      vi.mocked(await fetched()).mockResolvedValue(EMPTY);
      stubDocument(documentWith(""));
      const getMetadata = createMetadataFetcher({ enabled: true });

      await expect(getMetadata(CHANNEL)).resolves.toEqual(EMPTY);
    });

    it("leaves a page the stream read in full alone", async () => {
      vi.mocked(await fetched()).mockResolvedValue(SITE);
      const fetchSpy = stubDocument(documentWith(""));
      const getMetadata = createMetadataFetcher({ enabled: true });

      await expect(getMetadata(CHANNEL)).resolves.toEqual(SITE);
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });
});
