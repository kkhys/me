import { DOMParser, parseHTML } from "linkedom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { initInfiniteScroll } from "../infinite-scroll";

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  readonly observed = new Set<Element>();

  constructor(
    readonly callback: IntersectionObserverCallback,
    readonly options: IntersectionObserverInit | undefined,
  ) {
    FakeIntersectionObserver.instances.push(this);
  }

  observe(element: Element) {
    this.observed.add(element);
  }

  unobserve(element: Element) {
    this.observed.delete(element);
  }

  disconnect() {
    this.observed.clear();
  }

  intersect(element: Element) {
    this.callback(
      [{ isIntersecting: true, target: element } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

const items = (ids: number[]) => ids.map((id) => `<li>${id}</li>`).join("");

const feed = (current: number, total: number, ids: number[]) =>
  `<ol id="feed" data-current-page="${current}" data-total-pages="${total}" data-base-path="/feed">${items(ids)}</ol>`;

const rootMarkup = `<div class="infinite-scroll-root" data-container-id="feed" data-end-message="the end" data-error-message="failed">
  <div id="scroll-trigger"></div>
  <div id="loading-indicator" class="loading-indicator hidden" aria-live="polite" aria-busy="false"><svg class="spinner"></svg></div>
</div>`;

const pages: Record<string, string> = {
  "/feed/2": `<html><body>${feed(2, 3, [4, 5, 6])}</body></html>`,
  "/feed/3": `<html><body>${feed(3, 3, [7, 8, 9])}</body></html>`,
};

const mount = (total = 3) => {
  const { document } = parseHTML(
    `<html><body><div class="scroller">${feed(1, total, [1, 2, 3])}${rootMarkup}</div></body></html>`,
  );
  const root = document.querySelector<HTMLElement>(".infinite-scroll-root");
  if (!root) throw new Error("fixture has no root");
  return { document, root };
};

const lastObserver = () => {
  const observer = FakeIntersectionObserver.instances.at(-1);
  if (!observer) throw new Error("no observer was created");
  return observer;
};

const ids = (document: Document) =>
  [...document.querySelectorAll("#feed > li")].map((li) => li.textContent);

const scrollerOf = (document: Document) => {
  const element = document.querySelector<HTMLElement>(".scroller");
  if (!element) throw new Error("fixture has no scroller");
  return element;
};

const indicator = (document: Document) => {
  const element = document.querySelector<HTMLElement>("#loading-indicator");
  if (!element) throw new Error("fixture has no indicator");
  return element;
};

/** Lets the fetch settle, then runs out the 500ms minimum spinner time. */
const settle = async () => {
  await vi.advanceTimersByTimeAsync(0);
  await vi.advanceTimersByTimeAsync(500);
};

type FetchLike = (url: string) => Promise<{ ok: boolean; text: () => Promise<string> }>;

const fetchMock = vi.fn<FetchLike>((url) => {
  const html = pages[url];
  return Promise.resolve(
    html === undefined
      ? { ok: false, text: () => Promise.resolve("") }
      : { ok: true, text: () => Promise.resolve(html) },
  );
});

beforeEach(() => {
  vi.useFakeTimers();
  FakeIntersectionObserver.instances = [];
  fetchMock.mockClear();
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  vi.stubGlobal("DOMParser", DOMParser);
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("initInfiniteScroll", () => {
  it("watches the trigger 200px ahead of the viewport", () => {
    const { document, root } = mount();
    initInfiniteScroll(root);
    const observer = lastObserver();
    expect(observer.options).toEqual({ rootMargin: "200px" });
    expect(observer.observed.has(document.querySelector("#scroll-trigger") as Element)).toBe(true);
  });

  it("appends the next page's items and hides the spinner again", async () => {
    const { document, root } = mount();
    initInfiniteScroll(root);
    const trigger = document.querySelector("#scroll-trigger") as Element;

    lastObserver().intersect(trigger);
    await vi.advanceTimersByTimeAsync(0);
    expect(indicator(document).classList.contains("hidden")).toBe(false);
    expect(indicator(document).getAttribute("aria-busy")).toBe("true");

    await vi.advanceTimersByTimeAsync(500);
    expect(fetchMock).toHaveBeenCalledWith("/feed/2");
    expect(ids(document)).toEqual(["1", "2", "3", "4", "5", "6"]);
    expect(indicator(document).classList.contains("hidden")).toBe(true);
    expect(indicator(document).getAttribute("aria-busy")).toBe("false");
  });

  it("keeps the spinner up for at least 500ms", async () => {
    const { document, root } = mount();
    initInfiniteScroll(root);
    lastObserver().intersect(document.querySelector("#scroll-trigger") as Element);

    await vi.advanceTimersByTimeAsync(300);
    expect(ids(document)).toHaveLength(3);
    await vi.advanceTimersByTimeAsync(200);
    expect(ids(document)).toHaveLength(6);
  });

  it("announces the end as a status after the last page and drops the trigger", async () => {
    const { document, root } = mount();
    initInfiniteScroll(root);
    const trigger = document.querySelector("#scroll-trigger") as Element;
    const observer = lastObserver();

    observer.intersect(trigger);
    await settle();
    observer.intersect(trigger);
    await settle();

    expect(ids(document)).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
    expect(indicator(document).innerHTML).toBe('<span role="status">the end</span>');
    expect(document.querySelector("#scroll-trigger")).toBeNull();
    expect(observer.observed.size).toBe(0);
  });

  it("announces a failed fetch as an alert", async () => {
    const { document, root } = mount(4);
    initInfiniteScroll(root);
    const observer = lastObserver();
    const trigger = document.querySelector("#scroll-trigger") as Element;

    observer.intersect(trigger);
    await settle();
    observer.intersect(trigger);
    await settle();
    observer.intersect(trigger);
    await settle();

    expect(fetchMock).toHaveBeenLastCalledWith("/feed/4");
    expect(ids(document)).toHaveLength(9);
    expect(indicator(document).innerHTML).toBe('<span role="alert">failed</span>');
    expect(indicator(document).getAttribute("aria-busy")).toBe("false");
  });

  it("ignores intersections while a page is loading", async () => {
    const { document, root } = mount();
    initInfiniteScroll(root);
    const trigger = document.querySelector("#scroll-trigger") as Element;
    const observer = lastObserver();

    observer.intersect(trigger);
    observer.intersect(trigger);
    await settle();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(ids(document)).toHaveLength(6);
  });

  it("does nothing without a root or with incomplete markup", () => {
    const { document } = parseHTML(
      "<html><body><div class='infinite-scroll-root'></div></body></html>",
    );
    initInfiniteScroll(null);
    initInfiniteScroll(document.querySelector<HTMLElement>(".infinite-scroll-root"));
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
  });

  it("starts over on markup that replaced an earlier feed", async () => {
    const { document, root } = mount();
    const scroller = scrollerOf(document);
    const pristine = scroller.cloneNode(true) as HTMLElement;
    initInfiniteScroll(root);
    const first = lastObserver();
    const staleTrigger = document.querySelector("#scroll-trigger") as Element;
    first.intersect(staleTrigger);
    await settle();
    expect(ids(document)).toHaveLength(6);

    scroller.replaceChildren(...[...pristine.childNodes].map((node) => node.cloneNode(true)));
    initInfiniteScroll(scroller.querySelector<HTMLElement>(".infinite-scroll-root"));
    expect(ids(document)).toEqual(["1", "2", "3"]);

    // The stale observer still fires on its detached trigger; nothing visible changes.
    first.intersect(staleTrigger);
    await settle();
    expect(ids(document)).toEqual(["1", "2", "3"]);

    lastObserver().intersect(document.querySelector("#scroll-trigger") as Element);
    await settle();
    expect(ids(document)).toEqual(["1", "2", "3", "4", "5", "6"]);
  });
});
