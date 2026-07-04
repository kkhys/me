/**
 * Studio frontend: compose form, image attachments, reply/quote selection,
 * feed rendering, and sync trigger. Bundled by Bun's HTML import.
 */

import { filterMemos } from "./memo-filter";

interface MemoSummary {
  dirName: string;
  id: string;
  createdAt: string;
  body: string;
  tag?: string;
  comment?: string;
  quote?: string;
  isDraft: boolean;
  images: string[];
}

const MAX_BODY_LENGTH = 500;
const MAX_IMAGES = 4;
const FEED_PAGE_SIZE = 20;
const SITE_URL = "https://memo.kkhys.me";

const $ = <T extends HTMLElement>(id: string): T => {
  const element = document.querySelector<T>(`#${id}`);
  if (!element) throw new Error(`Missing element: #${id}`);
  return element;
};

const form = $<HTMLFormElement>("compose");
const bodyInput = $<HTMLTextAreaElement>("body");
const counter = $<HTMLSpanElement>("counter");
const createdAtInput = $<HTMLInputElement>("created-at");
const tagInput = $<HTMLInputElement>("tag");
const tagList = $<HTMLDataListElement>("tag-list");
const isDraftInput = $<HTMLInputElement>("is-draft");
const hideLinkCardInput = $<HTMLInputElement>("hide-link-card");
const imagesInput = $<HTMLInputElement>("images");
const previews = $<HTMLDivElement>("previews");
const replyBanner = $<HTMLDivElement>("reply-banner");
const replyLabel = $<HTMLSpanElement>("reply-label");
const replyExcerpt = $<HTMLSpanElement>("reply-excerpt");
const replyClear = $<HTMLButtonElement>("reply-clear");
const postButton = $<HTMLButtonElement>("post");
const message = $<HTMLParagraphElement>("message");
const statusLabel = $<HTMLSpanElement>("status");
const syncButton = $<HTMLButtonElement>("sync");
const deployInput = $<HTMLInputElement>("deploy");
const feed = $<HTMLOListElement>("feed");
const loadMoreButton = $<HTMLButtonElement>("load-more");
const searchInput = $<HTMLInputElement>("search");

let memos: MemoSummary[] = [];
let attachedImages: File[] = [];
let replyTarget: { type: "comment" | "quote"; memo: MemoSummary } | null = null;
let feedLimit = FEED_PAGE_SIZE;

const showMessage = (text: string, isError = false): void => {
  message.textContent = text;
  message.classList.toggle("message--error", isError);
  message.hidden = false;
};

const updateCounter = (): void => {
  const count = bodyInput.value.length;
  counter.textContent = `${count} / ${MAX_BODY_LENGTH}`;
  counter.classList.toggle("compose__counter--over", count > MAX_BODY_LENGTH);
};

const renderPreviews = (): void => {
  previews.replaceChildren();
  attachedImages.forEach((file, index) => {
    const item = document.createElement("figure");
    item.className = "compose__preview";

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.alt = file.name;
    img.addEventListener("load", () => URL.revokeObjectURL(img.src));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "compose__preview-remove";
    remove.setAttribute("aria-label", `Remove image ${index + 1}`);
    remove.textContent = "×";
    remove.addEventListener("click", () => {
      attachedImages = attachedImages.filter((_, i) => i !== index);
      renderPreviews();
    });

    item.append(img, remove);
    previews.append(item);
  });
};

const addImages = (files: Iterable<File>): void => {
  for (const file of files) {
    if (file.type !== "image/jpeg" && file.type !== "image/png") continue;
    if (attachedImages.length >= MAX_IMAGES) {
      showMessage(`Up to ${MAX_IMAGES} images per memo`, true);
      break;
    }
    attachedImages.push(file);
  }
  renderPreviews();
};

const setReplyTarget = (type: "comment" | "quote", memo: MemoSummary): void => {
  replyTarget = { type, memo };
  replyLabel.textContent = type === "comment" ? "Reply to" : "Quote";
  replyExcerpt.textContent = memo.body.slice(0, 60) || memo.dirName;
  replyBanner.hidden = false;
  bodyInput.focus();
};

const clearReplyTarget = (): void => {
  replyTarget = null;
  replyBanner.hidden = true;
};

const renderTagList = (): void => {
  const tags = [...new Set(memos.map((memo) => memo.tag).filter(Boolean))] as string[];
  tagList.replaceChildren(
    ...tags.toSorted().map((tag) => {
      const option = document.createElement("option");
      option.value = tag;
      return option;
    }),
  );
};

const renderFeedItem = (memo: MemoSummary): HTMLLIElement => {
  const item = document.createElement("li");
  item.className = "feed__item";

  const meta = document.createElement("div");
  meta.className = "feed__meta";

  const time = document.createElement("time");
  time.textContent = memo.createdAt;

  if (memo.isDraft) {
    meta.append(time);
  } else {
    // Drafts are filtered out in production, so only published memos get a link
    const permalink = document.createElement("a");
    permalink.className = "feed__permalink";
    permalink.href = `${SITE_URL}/posts/${memo.id}`;
    permalink.target = "_blank";
    permalink.rel = "noopener";
    permalink.append(time);
    meta.append(permalink);
  }

  if (memo.tag) {
    const tag = document.createElement("span");
    tag.className = "chip";
    tag.textContent = `#${memo.tag}`;
    meta.append(tag);
  }
  if (memo.isDraft) {
    const draft = document.createElement("span");
    draft.className = "chip chip--draft";
    draft.textContent = "draft";
    meta.append(draft);
  }
  if (memo.comment) {
    const reply = document.createElement("span");
    reply.className = "chip";
    reply.textContent = "reply";
    meta.append(reply);
  }
  if (memo.quote) {
    const quote = document.createElement("span");
    quote.className = "chip";
    quote.textContent = "quote";
    meta.append(quote);
  }

  const body = document.createElement("p");
  body.className = "feed__body";
  body.textContent = memo.body;

  item.append(meta, body);

  if (memo.images.length > 0) {
    const gallery = document.createElement("div");
    gallery.className = "feed__images";
    for (const image of memo.images) {
      const img = document.createElement("img");
      img.src = `/api/images/${memo.dirName}/${image}`;
      img.alt = "";
      img.loading = "lazy";
      gallery.append(img);
    }
    item.append(gallery);
  }

  const actions = document.createElement("div");
  actions.className = "feed__actions";
  for (const [label, type] of [
    ["Reply", "comment"],
    ["Quote", "quote"],
  ] as const) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn--ghost btn--small";
    button.textContent = label;
    button.addEventListener("click", () => setReplyTarget(type, memo));
    actions.append(button);
  }
  item.append(actions);

  return item;
};

const renderFeed = (): void => {
  const visible = filterMemos(memos, searchInput.value);
  feed.replaceChildren(...visible.slice(0, feedLimit).map((memo) => renderFeedItem(memo)));
  loadMoreButton.hidden = visible.length <= feedLimit;
};

const refreshMemos = async (): Promise<void> => {
  const response = await fetch("/api/memos");
  const data = (await response.json()) as { memos: MemoSummary[] };
  memos = data.memos;
  renderFeed();
  renderTagList();
};

const refreshStatus = async (): Promise<void> => {
  const response = await fetch("/api/status");
  const data = (await response.json()) as { changes?: number };
  const changes = data.changes ?? 0;
  statusLabel.textContent = changes === 0 ? "clean" : `${changes} unsynced`;
  statusLabel.classList.toggle("header__status--dirty", changes > 0);
};

const toCreatedAt = (value: string): string | undefined => {
  if (value === "") return undefined;
  const normalized = value.replace("T", " ");
  return normalized.length === 16 ? `${normalized}:00` : normalized;
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.hidden = true;
  postButton.disabled = true;

  try {
    const formData = new FormData();
    formData.set("body", bodyInput.value);

    const createdAt = toCreatedAt(createdAtInput.value);
    if (createdAt) formData.set("createdAt", createdAt);
    if (tagInput.value.trim()) formData.set("tag", tagInput.value.trim());
    if (replyTarget) formData.set(replyTarget.type, replyTarget.memo.id);
    if (isDraftInput.checked) formData.set("isDraft", "true");
    if (hideLinkCardInput.checked) formData.set("hideLinkCard", "true");
    for (const file of attachedImages) formData.append("images", file);

    const response = await fetch("/api/memos", { method: "POST", body: formData });
    const data = (await response.json()) as { memo?: MemoSummary; error?: string };

    if (!response.ok) {
      showMessage(data.error ?? `Failed to post (${response.status})`, true);
      return;
    }

    form.reset();
    attachedImages = [];
    renderPreviews();
    clearReplyTarget();
    updateCounter();
    showMessage(`Posted: ${data.memo?.dirName ?? ""}`);
    await Promise.all([refreshMemos(), refreshStatus()]);
  } catch (error) {
    showMessage(error instanceof Error ? error.message : String(error), true);
  } finally {
    postButton.disabled = false;
  }
});

syncButton.addEventListener("click", async () => {
  message.hidden = true;
  syncButton.disabled = true;

  try {
    const response = await fetch("/api/sync", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ deploy: deployInput.checked }),
    });
    const data = (await response.json()) as { message?: string; error?: string };
    showMessage(data.message ?? data.error ?? "Sync failed", !response.ok);
    await refreshStatus();
  } catch (error) {
    showMessage(error instanceof Error ? error.message : String(error), true);
  } finally {
    syncButton.disabled = false;
  }
});

bodyInput.addEventListener("input", updateCounter);

bodyInput.addEventListener("paste", (event) => {
  const files = event.clipboardData?.files;
  if (files && files.length > 0) {
    event.preventDefault();
    addImages(files);
  }
});

form.addEventListener("dragover", (event) => event.preventDefault());
form.addEventListener("drop", (event) => {
  event.preventDefault();
  if (event.dataTransfer?.files) addImages(event.dataTransfer.files);
});

imagesInput.addEventListener("change", () => {
  if (imagesInput.files) addImages(imagesInput.files);
  imagesInput.value = "";
});

replyClear.addEventListener("click", clearReplyTarget);

loadMoreButton.addEventListener("click", () => {
  feedLimit += FEED_PAGE_SIZE;
  renderFeed();
});

searchInput.addEventListener("input", () => {
  feedLimit = FEED_PAGE_SIZE;
  renderFeed();
});

updateCounter();
void refreshMemos();
void refreshStatus();
