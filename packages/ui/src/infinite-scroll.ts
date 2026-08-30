/* The behaviour behind infinite-scroll.astro: watch the trigger, fetch the
   next page, lift `#<containerId>` out of it and append its children. The
   container carries the paging state as data attributes: `data-current-page`,
   `data-total-pages`, and optionally `data-base-path` (default "/") — page N
   lives at `<basePath>/N`. */

const MIN_LOADING_MS = 500;

// Keep the loading indicator visible for at least 500ms so fast responses
// don't flash it.
const ensureMinDelay = async (startTime: number) => {
  const remainingTime = Math.max(0, MIN_LOADING_MS - (Date.now() - startTime));
  if (remainingTime > 0) {
    await new Promise((resolve) => {
      setTimeout(resolve, remainingTime);
    });
  }
};

/**
 * Wires one `.infinite-scroll-root` (the markup of infinite-scroll.astro).
 * Defaults to the first root in the document; pass a root to wire markup
 * inserted later, e.g. a demo that restores its first page and starts over.
 * A previous call keeps observing only the nodes it was given, so replacing
 * them leaves it inert: a detached trigger never intersects, and a fetch
 * still in flight appends to the detached container.
 */
export const initInfiniteScroll = (
  root: HTMLElement | null = document.querySelector<HTMLElement>(".infinite-scroll-root"),
): void => {
  if (!root) return;

  const containerId = root.dataset["containerId"];
  const endMessage = root.dataset["endMessage"] ?? "";
  const errorMessage = root.dataset["errorMessage"] ?? "";
  // `#` alone is an invalid selector and would throw instead of returning.
  if (!containerId) return;
  const container = root.ownerDocument.querySelector<HTMLElement>(`#${containerId}`);
  const trigger = root.querySelector<HTMLElement>("#scroll-trigger");
  const loadingIndicator = root.querySelector<HTMLElement>("#loading-indicator");

  if (!container || !trigger || !loadingIndicator) {
    return;
  }

  const basePath = container.dataset["basePath"] || "/";
  let currentPage = Math.trunc(Number(container.dataset["currentPage"] || "1"));
  const totalPages = Math.trunc(Number(container.dataset["totalPages"] || "1"));
  let isLoading = false;

  const showLoading = () => {
    loadingIndicator.classList.remove("hidden");
    loadingIndicator.setAttribute("aria-busy", "true");
  };

  const hideLoading = () => {
    loadingIndicator.classList.add("hidden");
    loadingIndicator.setAttribute("aria-busy", "false");
  };

  const showMessage = (role: "status" | "alert", text: string) => {
    const span = root.ownerDocument.createElement("span");
    span.setAttribute("role", role);
    span.textContent = text;
    loadingIndicator.replaceChildren(span);
    loadingIndicator.setAttribute("aria-busy", "false");
    loadingIndicator.classList.remove("hidden");
  };

  const showEndMessage = () => {
    trigger.remove();
    showMessage("status", endMessage);
  };

  const pageUrl = (page: number) => {
    if (page === 1) return basePath;
    return basePath === "/" ? `/${page}` : `${basePath}/${page}`;
  };

  const loadMore = async () => {
    const nextPage = currentPage + 1;

    if (nextPage > totalPages) {
      observer.unobserve(trigger);
      showEndMessage();
      return;
    }

    isLoading = true;
    showLoading();

    const startTime = Date.now();

    try {
      const response = await fetch(pageUrl(nextPage));

      if (!response.ok) {
        throw new Error(`Failed to fetch page ${nextPage}`);
      }

      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");

      const nextContainer = doc.querySelector(`#${containerId}`);
      if (!nextContainer) {
        throw new Error(`${containerId} not found in fetched page`);
      }

      await ensureMinDelay(startTime);

      for (const item of Array.from(nextContainer.children)) {
        container.append(item);
      }

      currentPage = nextPage;

      if (currentPage >= totalPages) {
        observer.unobserve(trigger);
        hideLoading();
        showEndMessage();
      } else {
        hideLoading();
      }
    } catch (error) {
      console.error("Failed to load more:", error);

      await ensureMinDelay(startTime);

      showMessage("alert", errorMessage);
    } finally {
      isLoading = false;
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const firstEntry = entries[0];
      if (firstEntry && firstEntry.isIntersecting && !isLoading && currentPage < totalPages) {
        loadMore();
      }
    },
    { rootMargin: "200px" },
  );

  observer.observe(trigger);
};
