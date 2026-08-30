import { parseExcerpt } from "./excerpt";
import { cycleIndex, isToggleShortcut } from "./keyboard";
import { createSearchRunner, type SearchStage } from "./runner";
import type { PagefindModule, PagefindSearchFragment, PagefindSearchOptions } from "./types";

export const requireElement = <T extends Element>(
  root: ParentNode,
  selector: string,
  guard: (element: Element) => element is T,
): T => {
  const element = root.querySelector(selector);
  if (!element || !guard(element)) {
    throw new Error(`search-dialog: missing element for "${selector}"`);
  }
  return element;
};

export const isHTMLElement = (element: Element): element is HTMLElement =>
  element instanceof HTMLElement;

/** Fills `element` with the excerpt as text nodes plus real `<mark>`s. */
export const renderExcerpt = (element: HTMLElement, excerpt: string) => {
  element.replaceChildren(
    ...parseExcerpt(excerpt).map(({ text, marked }) => {
      if (!marked) return document.createTextNode(text);
      const mark = document.createElement("mark");
      mark.textContent = text;
      return mark;
    }),
  );
};

export interface SearchDialogOptions {
  /** Leading and trailing slash required: `pagefind.js` is appended verbatim. */
  bundlePath: string;
  excerptLength: number;
  maxResults: number;
  debounceMs: number;
  /** What a result is called in the status line, e.g. 記事 / メモ. */
  noun: string;
  /** Builds one result row from the app's `<template>`. */
  renderResult: (fragment: PagefindSearchFragment, template: HTMLTemplateElement) => Node;
  /** Extra Pagefind options for the current UI state (filters). */
  searchOptions?: (() => PagefindSearchOptions) | undefined;
}

export interface SearchDialogApi {
  input: HTMLInputElement;
  runSearch: () => void;
  openDialog: () => void;
}

/**
 * Wires the shared dialog shell: Pagefind loading and warm-up, the search
 * runner, keyboard handling (⌘K / Ctrl+K, arrows, Escape, IME composition),
 * invoker and light-dismiss fallbacks. Returns the handles an app needs for
 * its own controls (e.g. re-running the search after a filter change).
 */
export const setupSearchDialog = (
  dialog: HTMLDialogElement,
  options: SearchDialogOptions,
): SearchDialogApi => {
  const pagefindUrl = `${options.bundlePath}pagefind.js`;

  // Every selector below points at markup in dialog.astro, so a miss is a
  // programming error and should fail loudly instead of leaving a dead UI.
  const input = requireElement(
    dialog,
    ".search-input",
    (element): element is HTMLInputElement => element instanceof HTMLInputElement,
  );
  const form = requireElement(
    dialog,
    ".search-form",
    (element): element is HTMLFormElement => element instanceof HTMLFormElement,
  );
  const status = requireElement(dialog, ".search-status", isHTMLElement);
  const list = requireElement(dialog, ".search-results", isHTMLElement);
  const template = requireElement(
    dialog,
    ".search-result-template",
    (element): element is HTMLTemplateElement => element instanceof HTMLTemplateElement,
  );
  const triggers = [
    ...document.querySelectorAll<HTMLButtonElement>(`button[commandfor="${dialog.id}"]`),
  ];

  let pagefindPromise: Promise<PagefindModule> | undefined;
  let composing = false;

  // The promise is cached even when it rejects: a failed module fetch is
  // recorded in the module map, so re-importing the same URL fails
  // identically without a page reload.
  const loadPagefind = () => {
    pagefindPromise ??= (async () => {
      const pagefind = (await import(
        /* @vite-ignore */
        pagefindUrl
      )) as PagefindModule;
      await pagefind.options({ excerptLength: options.excerptLength });
      await pagefind.init();
      return pagefind;
    })();
    return pagefindPromise;
  };

  // Best-effort warm-up on hover/open. The failure is swallowed here so that
  // hovering in a dev server without a build neither logs "Search failed"
  // nor writes to the status line; the next real search reports it.
  const warmUp = () => {
    loadPagefind().catch(() => {});
  };

  const search = createSearchRunner(
    {
      loadPagefind,
      render: (fragments) => {
        list.replaceChildren(
          ...fragments.map((fragment) => options.renderResult(fragment, template)),
        );
      },
      setStatus: (text) => {
        status.textContent = text;
      },
      onError: (stage: SearchStage, error) => {
        console.error(`Search failed at stage "${stage}"`, { query: input.value, error });
      },
    },
    { maxResults: options.maxResults, debounceMs: options.debounceMs, noun: options.noun },
  );

  const runSearch = () => {
    // The runner catches everything it expects; anything left is a bug.
    search(input.value, options.searchOptions?.()).catch((error: unknown) => {
      console.error("Search runner threw", error);
    });
  };

  const focusableItems = () => [
    input,
    ...list.querySelectorAll<HTMLAnchorElement>(".search-result"),
  ];

  const onOpened = () => {
    // `select()` on its own is not specified to move focus into the input.
    input.focus();
    input.select();
    warmUp();
  };

  const openDialog = () => {
    if (dialog.open) return;
    dialog.showModal();
    onOpened();
  };

  // Search committed text only: while an IME composes, every keystroke
  // fires `input` with provisional kana and would churn the list.
  input.addEventListener("input", () => {
    if (!composing) runSearch();
  });
  input.addEventListener("compositionstart", () => {
    composing = true;
  });
  input.addEventListener("compositionend", () => {
    composing = false;
    runSearch();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    // Some engines let the Enter that commits an IME candidate submit the
    // form; that Enter must not follow the first result.
    if (composing) return;
    list.querySelector<HTMLAnchorElement>(".search-result")?.click();
  });

  dialog.addEventListener("keydown", (event) => {
    // While an IME is composing, Escape and the arrow keys drive candidate
    // selection and must reach neither the dialog nor the result list.
    if (event.isComposing) return;
    if (event.key === "Escape") {
      // Chrome consumes the first Escape in a non-empty `type="search"` input
      // to clear it, so close explicitly instead of relying on cancel.
      // preventDefault also keeps the query, so reopening restores it
      // selected.
      event.preventDefault();
      dialog.close();
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const items = focusableItems();
    const index = cycleIndex(
      items.findIndex((item) => item === document.activeElement),
      event.key === "ArrowDown" ? 1 : -1,
      items.length,
    );
    const next = index === undefined ? undefined : items[index];
    if (!next) return;
    event.preventDefault();
    next.focus();
  });

  // Invoker-driven opens (`commandfor`) bypass `openDialog`, so the toggle
  // event is the one path that sees every open; `openDialog` still calls
  // `onOpened` itself for engines that do not fire toggle on dialogs yet.
  // Running it twice only re-selects the input.
  dialog.addEventListener("toggle", (event) => {
    if (event instanceof ToggleEvent && event.newState === "open") onOpened();
  });

  for (const trigger of triggers) {
    trigger.addEventListener("pointerenter", warmUp, { once: true });
  }

  // Modifier shortcuts only. A single-key shortcut such as `/` must be
  // switchable off or remappable (WCAG 2.1.4), and a static site with no
  // settings has nowhere to offer that.
  document.addEventListener("keydown", (event) => {
    if (!isToggleShortcut(event)) return;
    event.preventDefault();
    if (dialog.open) dialog.close();
    else openDialog();
  });

  // Invoker commands (`commandfor`) are Baseline 2025 (Safari 26.2); older
  // engines get click handlers.
  if (!("commandForElement" in HTMLButtonElement.prototype)) {
    for (const trigger of triggers) {
      trigger.addEventListener("click", () => {
        if (trigger.getAttribute("command") === "close") dialog.close();
        else openDialog();
      });
    }
  }

  // `closedby` is not Baseline yet (unshipped in stable Safari), so emulate
  // light dismiss. The dialog has no padding, so a click whose target is the
  // dialog itself came from the backdrop.
  if (!("closedBy" in HTMLDialogElement.prototype)) {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  return { input, runSearch, openDialog };
};

/** Finds the dialog by id and runs `setupSearchDialog`, logging a miss. */
export const mountSearchDialog = (
  dialogId: string,
  options: SearchDialogOptions,
): SearchDialogApi | undefined => {
  const dialog = document.querySelector(`#${dialogId}`);
  if (dialog instanceof HTMLDialogElement) return setupSearchDialog(dialog, options);
  console.error(`search-dialog: no <dialog id="${dialogId}"> in the document`);
  return undefined;
};
