import { parseHTML } from "linkedom";
import { describe, expect, it, vi } from "vitest";
import { cameFromThisSite, type HistoryBackWindow, initHistoryBack } from "../history-back";

const ORIGIN = "https://memo.example";

const fakeWindow = ({ referrer = `${ORIGIN}/`, length = 2 } = {}) => {
  const back = vi.fn<() => void>();
  const win: HistoryBackWindow = {
    document: { referrer },
    location: { origin: ORIGIN },
    history: { length, back },
  };
  return { win, back };
};

const mount = (attrs = 'data-history-back-label="戻る"') => {
  const { document, Event } = parseHTML(
    `<html><body><a href="/" class="back-button" aria-label="ホームへ戻る" ${attrs}></a></body></html>`,
  );
  const link = document.querySelector<HTMLAnchorElement>("a.back-button");
  if (!link) throw new Error("fixture has no back link");
  // linkedom has no MouseEvent, so the mouse fields ride on a plain Event.
  const click = (init: MouseEventInit = {}) => {
    const event = Object.assign(new Event("click", { bubbles: true, cancelable: true }), {
      button: 0,
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      ...init,
    });
    link.dispatchEvent(event);
    return event;
  };
  return { link, click };
};

describe("cameFromThisSite", () => {
  it("accepts a same-origin referrer with history behind it", () => {
    expect(cameFromThisSite(fakeWindow().win)).toBe(true);
    expect(cameFromThisSite(fakeWindow({ referrer: `${ORIGIN}/tag/astro` }).win)).toBe(true);
  });

  it("rejects a direct visit and another site", () => {
    expect(cameFromThisSite(fakeWindow({ referrer: "" }).win)).toBe(false);
    expect(cameFromThisSite(fakeWindow({ referrer: "https://kkhys.me/blog" }).win)).toBe(false);
  });

  it("rejects an origin that only shares the prefix", () => {
    expect(cameFromThisSite(fakeWindow({ referrer: `${ORIGIN}.evil.test/` }).win)).toBe(false);
  });

  it("rejects a link opened in a new tab, which has nothing to go back to", () => {
    expect(cameFromThisSite(fakeWindow({ length: 1 }).win)).toBe(false);
  });
});

describe("initHistoryBack", () => {
  it("steps back through history and renames the button", () => {
    const { win, back } = fakeWindow();
    const { link, click } = mount();
    initHistoryBack(link, win);

    expect(link.getAttribute("aria-label")).toBe("戻る");
    expect(click().defaultPrevented).toBe(true);
    expect(back).toHaveBeenCalledTimes(1);
  });

  it("stays a home link for a visitor from elsewhere", () => {
    const { win, back } = fakeWindow({ referrer: "" });
    const { link, click } = mount();
    initHistoryBack(link, win);

    expect(link.getAttribute("aria-label")).toBe("ホームへ戻る");
    expect(click().defaultPrevented).toBe(false);
    expect(back).not.toHaveBeenCalled();
  });

  it("stays a home link when the header did not opt in", () => {
    const { win, back } = fakeWindow();
    const { link, click } = mount("");
    initHistoryBack(link, win);

    expect(link.getAttribute("aria-label")).toBe("ホームへ戻る");
    expect(click().defaultPrevented).toBe(false);
    expect(back).not.toHaveBeenCalled();
  });

  it.each([
    { metaKey: true },
    { ctrlKey: true },
    { shiftKey: true },
    { altKey: true },
    { button: 1 },
  ])("leaves a modified click to the browser: %o", (init) => {
    const { win, back } = fakeWindow();
    const { link, click } = mount();
    initHistoryBack(link, win);

    expect(click(init).defaultPrevented).toBe(false);
    expect(back).not.toHaveBeenCalled();
  });

  it("does nothing without a link", () => {
    const { win, back } = fakeWindow();
    expect(() => initHistoryBack(null, win)).not.toThrow();
    expect(back).not.toHaveBeenCalled();
  });
});
