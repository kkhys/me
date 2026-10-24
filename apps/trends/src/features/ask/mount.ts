import { loadPagefind } from "@kkhys/search/loader";
import { type AskClient, createAskClient } from "#/features/ask/client";
import { askConfig } from "#/features/ask/config";
import { LANGUAGE_MODEL_EXPECTATIONS } from "#/features/ask/language-model";
import { createRetriever, type Retriever } from "#/features/ask/retrieval";
import type {
  AskReference,
  AskScope,
  LanguageModelAvailability,
  LanguageModelStatic,
} from "#/features/ask/types";
import { plainText } from "#/features/ask/utils/plain";
import { isAskScope } from "#/features/ask/utils/scope";
import { searchConfig } from "#/features/search/config";
import { formatRunDate } from "#/utils/runs";

/* The dialog's behaviour, loaded by ask-dialog.astro only once the Prompt
   API is found and not unavailable, so every other browser downloads the
   gate and nothing else. */

// Every selector points at markup in ask-dialog.astro, so a miss is a
// programming error and should fail loudly instead of leaving a dead UI.
const requireElement = <T extends Element>(
  root: ParentNode,
  selector: string,
  type: new () => T,
): T => {
  const element = root.querySelector(selector);
  if (!(element instanceof type)) {
    throw new TypeError(`ask-dialog: missing element for "${selector}"`);
  }
  return element;
};

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`ask-dialog: ${url} answered ${response.status}`);
  return (await response.json()) as T;
};

// Techmeme rows are titled with the whole headline; keep the list a line.
const MAX_REF_CHARS = 40;

const DEFAULT_SCOPE: AskScope = "day";

export const mountAskDialog = (
  dialog: HTMLDialogElement,
  languageModel: LanguageModelStatic,
  availability: Exclude<LanguageModelAvailability, "unavailable">,
): void => {
  const { date, firstDate } = dialog.dataset;
  if (!date || !firstDate) throw new Error("ask-dialog: missing data-date / data-first-date");

  const setup = requireElement(dialog, ".ask-setup", HTMLElement);
  const download = requireElement(dialog, ".ask-download", HTMLButtonElement);
  const scopeGroup = requireElement(dialog, ".ask-scope", HTMLElement);
  const log = requireElement(dialog, ".ask-log", HTMLOListElement);
  const status = requireElement(dialog, ".ask-status", HTMLElement);
  const form = requireElement(dialog, ".ask-form", HTMLFormElement);
  const input = requireElement(dialog, ".ask-input", HTMLInputElement);
  const send = requireElement(dialog, ".ask-send", HTMLButtonElement);
  const stop = requireElement(dialog, ".ask-stop", HTMLButtonElement);
  const resetButton = requireElement(dialog, ".ask-reset", HTMLButtonElement);
  const template = requireElement(dialog, ".ask-turn-template", HTMLTemplateElement);
  const scopeButtons = [...scopeGroup.querySelectorAll<HTMLButtonElement>("button[data-scope]")];
  const suggestionGroups = [...dialog.querySelectorAll<HTMLElement>(".ask-suggestions")];
  const triggers = document.querySelectorAll<HTMLButtonElement>(
    `button[commandfor="${dialog.id}"]`,
  );

  const retriever: Retriever = createRetriever({
    date,
    firstDate,
    fetchJson,
    loadPagefind: () =>
      loadPagefind(searchConfig.bundlePath, { excerptLength: searchConfig.excerptLength }),
  });

  let needsDownload = availability === "downloadable";
  let ready = false;
  let composing = false;
  let scope: AskScope = DEFAULT_SCOPE;
  let client: AskClient | undefined;
  let inFlight: AbortController | undefined;

  const setStatus = (text: string) => {
    status.textContent = text;
  };

  const fail = (error: unknown, text: string) => {
    setStatus(text);
    console.error("ask-dialog", error);
  };

  const getClient = () => {
    client ??= createAskClient({
      languageModel,
      retriever,
      dates: { firstDate, date },
      onDownloadProgress: (loaded) => {
        setStatus(`モデルをダウンロード中 ${Math.round(loaded * 100)}%`);
      },
    });
    return client;
  };

  const showSetup = (visible: boolean) => {
    setup.hidden = !visible;
    form.hidden = visible;
    for (const group of suggestionGroups) group.hidden = visible;
  };

  const prepare = async () => {
    if (ready) return;
    setStatus(needsDownload ? "モデルをダウンロード中…" : "モデルを準備中…");
    await getClient().prepare();
    ready = true;
    needsDownload = false;
    showSetup(false);
    setStatus("");
    // The download button that had focus is gone with the setup panel.
    if (dialog.open) input.focus();
  };

  const setBusy = (controller: AbortController | undefined) => {
    inFlight = controller;
    send.hidden = controller !== undefined;
    stop.hidden = controller === undefined;
  };

  /* The chosen scope lives on the dialog: the CSS shows that scope's
     question examples, and the field's placeholder names it. */
  const applyScope = (next: AskScope) => {
    scope = next;
    dialog.dataset["scope"] = next;
    for (const button of scopeButtons) {
      button.setAttribute("aria-pressed", String(button.dataset["scope"] === next));
    }
    const config = askConfig.scopes.find((entry) => entry.id === next);
    if (config) input.placeholder = config.placeholder;
  };

  const renderTurn = (question: string) => {
    const node = template.content.cloneNode(true) as DocumentFragment;
    requireElement(node, ".ask-q", HTMLElement).textContent = question;
    const answer = requireElement(node, ".ask-a", HTMLElement);
    const refs = requireElement(node, ".ask-refs", HTMLElement);
    log.append(node);
    resetButton.hidden = false;
    log.scrollTop = log.scrollHeight;
    return { answer, refs };
  };

  /* Chunks arrive faster than frames; one write and one scroll per frame
     keeps a long answer from relayouting on every token. The whole text is
     rewritten each time so Markdown markers split across chunks still go. */
  const streamInto = (answer: HTMLElement) => {
    let text = "";
    let frame: number | undefined;
    const flush = () => {
      frame = undefined;
      answer.textContent = plainText(text);
      log.scrollTop = log.scrollHeight;
    };
    return {
      push(chunk: string) {
        text += chunk;
        frame ??= requestAnimationFrame(flush);
      },
      end() {
        if (frame !== undefined) {
          cancelAnimationFrame(frame);
          flush();
        }
      },
    };
  };

  const renderRefs = (element: HTMLElement, refs: readonly AskReference[]) => {
    if (refs.length === 0) return;
    refs.forEach((ref, i) => {
      if (i > 0) element.append("、");
      const link = document.createElement("a");
      link.href = ref.href;
      const label =
        ref.label.length > MAX_REF_CHARS ? `${ref.label.slice(0, MAX_REF_CHARS)}…` : ref.label;
      // A row on another day is named with its day; a day link already is the day.
      const dated = ref.kind === "row" && ref.date !== date;
      link.textContent = `[${i + 1}] ${dated ? `${formatRunDate(ref.date)} ` : ""}${label}`;
      // A row on this page sits behind the modal; close it and let the hash
      // jump run. Other pages navigate away, which closes it anyway.
      if (ref.href.startsWith("#")) link.addEventListener("click", () => dialog.close());
      element.append(link);
    });
    element.hidden = false;
  };

  const submit = async (question: string) => {
    input.value = "";
    const turn = renderTurn(question);
    const stream = streamInto(turn.answer);
    const controller = new AbortController();
    setBusy(controller);
    try {
      // prepare() writes its own status while the model loads.
      await prepare();
      setStatus("参考にする記事を集めています…");
      let started = false;
      const refs = await getClient().ask(
        { question, scope },
        (chunk) => {
          if (!started) {
            started = true;
            setStatus("回答を生成中…");
          }
          stream.push(chunk);
        },
        controller.signal,
      );
      stream.end();
      renderRefs(turn.refs, refs);
      setStatus("");
    } catch (error) {
      stream.end();
      if (controller.signal.aborted) setStatus("停止しました");
      else fail(error, "回答できませんでした。もう一度試してください。");
    } finally {
      setBusy(undefined);
      if (dialog.open) input.focus();
    }
  };

  const onOpened = async () => {
    retriever.warm(scope);
    // Asked again on every open until the session exists: Chrome drops the
    // model when the disk runs low and swaps it on an update, and a page can
    // stay open for days, so the load-time answer is no licence to download.
    if (!ready) {
      const now = await languageModel
        .availability(LANGUAGE_MODEL_EXPECTATIONS)
        .catch(() => "unavailable" as const);
      needsDownload = now === "downloadable";
    }
    if (needsDownload) {
      showSetup(true);
      download.focus();
      return;
    }
    showSetup(false);
    input.focus();
    prepare().catch((error: unknown) => fail(error, "この端末ではモデルを用意できませんでした"));
  };

  // The download needs a user activation, which this click provides.
  download.addEventListener("click", () => {
    prepare().catch((error: unknown) => fail(error, "モデルを用意できませんでした"));
  });

  scopeGroup.addEventListener("click", (event) => {
    const button =
      event.target instanceof Element
        ? event.target.closest<HTMLButtonElement>("button[data-scope]")
        : null;
    const next = button?.dataset["scope"];
    if (!isAskScope(next) || next === scope) return;
    applyScope(next);
    retriever.warm(next);
    input.focus();
  });

  // Send committed text only: while an IME composes, Enter picks a candidate.
  input.addEventListener("compositionstart", () => {
    composing = true;
  });
  input.addEventListener("compositionend", () => {
    composing = false;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (composing || inFlight) return;
    const question = input.value.trim();
    if (question) void submit(question);
  });

  stop.addEventListener("click", () => inFlight?.abort());

  // One listener for every scope's examples.
  dialog.addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest(".ask-suggestion") : null;
    if (!button || inFlight) return;
    input.value = button.textContent?.trim() ?? "";
    form.requestSubmit();
  });

  // The log is only a record: every question runs in a fresh clone, so there
  // is no conversation to forget, just the list to empty.
  resetButton.addEventListener("click", () => {
    inFlight?.abort();
    log.replaceChildren();
    resetButton.hidden = true;
    setStatus("");
    input.focus();
  });

  // Invoker-driven opens (`commandfor`) bypass any open function here, so
  // the toggle event is the one path that sees every open and close.
  dialog.addEventListener("toggle", (event) => {
    if (!(event instanceof ToggleEvent)) return;
    if (event.newState === "open") void onOpened();
    else inFlight?.abort();
  });

  window.addEventListener("pagehide", () => client?.destroy());

  // Only the JSON on hover: creating the session would load the model into
  // memory, or start its download, before any intent to ask.
  const warmCurrent = () => retriever.warm(scope);

  applyScope(DEFAULT_SCOPE);
  for (const trigger of triggers) {
    trigger.hidden = false;
    trigger.addEventListener("pointerenter", warmCurrent, { once: true });
  }
};
