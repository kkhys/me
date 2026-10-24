import { describe, expect, it } from "vitest";

import { type AskQuestion, createAskClient } from "#/features/ask/client";
import { askConfig } from "#/features/ask/config";
import type { Retriever } from "#/features/ask/retrieval";
import type {
  AskDigest,
  AskItem,
  LanguageModelCreateOptions,
  LanguageModelSession,
  LanguageModelStatic,
} from "#/features/ask/types";
import {
  buildQuestionMessage,
  estimateTokens,
  packBlocks,
  rowBlock,
} from "#/features/ask/utils/context";
import { rankItems } from "#/features/ask/utils/rank";

interface FakeSession extends LanguageModelSession {
  prompts: string[];
  destroyed: boolean;
}

interface FakeConfig {
  contextWindow?: number | undefined;
  contextUsage?: number | undefined;
  /** Serve `measureContextUsage` with the same estimate the client uses. */
  measure?: boolean;
  /** Reject prompts estimated above this many tokens with QuotaExceededError. */
  rejectAbove?: number;
  chunks?: string[];
  progress?: number[];
}

const createFake = (config: FakeConfig = {}) => {
  const created: LanguageModelCreateOptions[] = [];
  const sessions: FakeSession[] = [];

  const makeSession = (): FakeSession => {
    const session: FakeSession = {
      prompts: [],
      destroyed: false,
      contextWindow: config.contextWindow,
      // Grows with what was prompted, as the real session's does.
      get contextUsage() {
        return config.contextUsage === undefined
          ? undefined
          : config.contextUsage + session.prompts.reduce((n, p) => n + estimateTokens(p), 0);
      },
      ...(config.measure
        ? { measureContextUsage: (input: string) => Promise.resolve(estimateTokens(input)) }
        : {}),
      promptStreaming(input, options) {
        session.prompts.push(input);
        if (config.rejectAbove !== undefined && estimateTokens(input) > config.rejectAbove) {
          throw new DOMException("too long", "QuotaExceededError");
        }
        return new ReadableStream<string>({
          start(controller) {
            if (options?.signal?.aborted) {
              controller.error(new DOMException("aborted", "AbortError"));
              return;
            }
            for (const chunk of config.chunks ?? ["答え"]) controller.enqueue(chunk);
            controller.close();
          },
        });
      },
      clone: () => Promise.resolve(makeSession()),
      destroy() {
        session.destroyed = true;
      },
    };
    sessions.push(session);
    return session;
  };

  const languageModel: LanguageModelStatic = {
    availability: () => Promise.resolve("available"),
    create(options) {
      created.push(options ?? {});
      const target = new EventTarget();
      options?.monitor?.(target);
      for (const loaded of config.progress ?? []) {
        target.dispatchEvent(Object.assign(new Event("downloadprogress"), { loaded }));
      }
      return Promise.resolve(makeSession());
    },
  };

  return { languageModel, created, sessions };
};

const item = (title: string, summary: string, anchor: string): AskItem => ({
  anchor,
  title,
  original: "",
  source: "Zenn",
  group: "日本",
  url: `https://example.com/${anchor}`,
  category: "",
  summary,
  detail: "",
});

const digest: AskDigest = {
  date: "2026-10-24",
  headline: "見出し",
  lead: "概要",
  highlights: [],
  items: [
    item("Rust の新版", "Rust 2.0 の話", "japan-zenn-1"),
    item("Astro の話", "静的サイト", "japan-zenn-2"),
    item("Rust と WASM", "Rust を WASM で", "japan-zenn-3"),
    item("Rust のツール", "Rust 製 CLI", "japan-zenn-4"),
  ],
};

/* The day-scope retriever over `digest`, as mount.ts would wire it. */
const blocksFor = (question: string) =>
  rankItems(question, digest.items, askConfig.maxReferences).map((row, rank) =>
    rowBlock(row, digest.date, rank, {
      detailed: rank < askConfig.detailedReferences,
      maxDetailChars: askConfig.maxDetailChars,
      href: `#${row.anchor}`,
      dated: false,
    }),
  );

const retriever: Retriever = {
  retrieve: (question) => Promise.resolve({ period: digest.date, blocks: blocksFor(question) }),
  warm: () => {},
};

const dates = { firstDate: "2026-05-01", date: "2026-10-24" };

const create = (languageModel: LanguageModelStatic) =>
  createAskClient({ languageModel, retriever, dates });

const q = (question: string): AskQuestion => ({ question, scope: "day" });

/** What a row costs the packer: its text plus the `[n] ` prefix. */
const cost = (text: string) => estimateTokens(text) + 2;

/* A Prompt API whose first `create()` is refused, as a missing user
   activation or a download error would be, and which works from then on. */
const refused = () => Promise.reject(new DOMException("no activation", "NotAllowedError"));

const refusingOnce = (languageModel: LanguageModelStatic) => {
  let attempts = 0;
  const once: LanguageModelStatic = {
    ...languageModel,
    create(options) {
      attempts += 1;
      const attempt = attempts === 1 ? refused : languageModel.create;
      return attempt(options);
    },
  };
  return { languageModel: once, attempts: () => attempts };
};

const collect = () => {
  const chunks: string[] = [];
  return { chunks, onChunk: (chunk: string) => chunks.push(chunk) };
};

describe("createAskClient", () => {
  it("creates one base session with the system prompt and reports download progress", async () => {
    const fake = createFake({ progress: [0.5, 1] });
    const seen: number[] = [];
    const client = createAskClient({
      languageModel: fake.languageModel,
      retriever,
      dates,
      onDownloadProgress: (loaded) => seen.push(loaded),
    });

    await client.prepare();
    await client.prepare();

    expect(fake.created).toHaveLength(1);
    expect(fake.created[0]?.initialPrompts?.[0]).toMatchObject({ role: "system" });
    expect(fake.created[0]?.initialPrompts?.[0]?.content).toContain("2026-05-01 から 2026-10-24");
    expect(fake.created[0]?.expectedOutputs).toEqual([{ type: "text", languages: ["ja"] }]);
    expect(seen).toEqual([0.5, 1]);
  });

  it("streams the answer and hands the model the period and the rows for the question", async () => {
    const fake = createFake({ chunks: ["Rust", " です"] });
    const client = create(fake.languageModel);
    const { chunks, onChunk } = collect();

    const refs = await client.ask(q("Rust について"), onChunk);

    expect(chunks).toEqual(["Rust", " です"]);
    expect(refs.map((ref) => ref.href)).toEqual([
      "#japan-zenn-1",
      "#japan-zenn-3",
      "#japan-zenn-4",
    ]);
    const chat = fake.sessions[1];
    expect(chat?.prompts[0]).toMatch(/^期間: 2026-10-24\n/u);
    expect(chat?.prompts[0]).toContain("[1] Rust の新版（Zenn）\n要約: Rust 2.0 の話");
    expect(chat?.prompts[0]).toContain("[3] Rust のツール（Zenn）");
    expect(chat?.prompts[0]).toMatch(/質問: Rust について$/u);
  });

  it("answers each question in its own clone of the base and lets it go", async () => {
    const fake = createFake();
    const client = create(fake.languageModel);

    await client.ask(q("Rust"), () => {});
    await client.ask(q("Astro"), () => {});

    expect(fake.created).toHaveLength(1);
    expect(fake.sessions).toHaveLength(3);
    expect(fake.sessions[0]?.prompts).toEqual([]);
    expect(fake.sessions.slice(1).map((s) => s.prompts.length)).toEqual([1, 1]);
    expect(fake.sessions.map((s) => s.destroyed)).toEqual([false, true, true]);
  });

  it("packs the rows into the room the session reports", async () => {
    const question = "Rust";
    const first = cost("Rust の新版（Zenn）\n要約: Rust 2.0 の話");
    const second = cost("Rust と WASM（Zenn）\n要約: Rust を WASM で");
    const reserve = askConfig.answerReserveTokens + estimateTokens(question);
    // One token short of the second row: it is skipped, and the cheaper
    // third row takes the room instead.
    const fake = createFake({ contextWindow: reserve + first + second - 1, contextUsage: 0 });
    const client = create(fake.languageModel);

    const refs = await client.ask(q(question), () => {});

    expect(refs.map((ref) => ref.href)).toEqual(["#japan-zenn-1", "#japan-zenn-4"]);
  });

  it("lets the engine's own count drop rows the estimate let through", async () => {
    const question = "Rust";
    const reserve = askConfig.answerReserveTokens + estimateTokens(question);
    // The packer budgets the rows alone; the engine measures the whole
    // message, framing included, so a window one token short of that lets
    // all three rows through the estimate and then rejects the message.
    const whole = estimateTokens(
      buildQuestionMessage({
        period: digest.date,
        references: packBlocks(blocksFor(question), Number.POSITIVE_INFINITY).text,
        question,
      }),
    );
    const fake = createFake({ contextWindow: reserve + whole - 1, contextUsage: 0, measure: true });
    const client = create(fake.languageModel);

    const refs = await client.ask(q(question), () => {});

    expect(blocksFor(question)).toHaveLength(3);
    expect(refs.map((ref) => ref.href)).toEqual(["#japan-zenn-1", "#japan-zenn-3"]);
  });

  it("retries with less when the engine still refuses the input", async () => {
    const fake = createFake({ rejectAbove: 40 });
    const client = create(fake.languageModel);

    const refs = await client.ask(q("Rust"), () => {});

    expect(refs.map((ref) => ref.href)).toEqual(["#japan-zenn-1"]);
    expect(fake.sessions[1]?.prompts).toHaveLength(2);
  });

  it("gives up on a refusal that no row can explain", async () => {
    const fake = createFake({ rejectAbove: 0 });
    const client = create(fake.languageModel);

    await expect(client.ask(q("これは"), () => {})).rejects.toMatchObject({
      name: "QuotaExceededError",
    });
  });

  it("lets the clone go when the question fails too", async () => {
    const fake = createFake({ rejectAbove: 0 });
    const client = create(fake.languageModel);

    await expect(client.ask(q("これは"), () => {})).rejects.toBeDefined();

    expect(fake.sessions[1]?.destroyed).toBe(true);
  });

  it("lets an abort through untouched", async () => {
    const fake = createFake();
    const client = create(fake.languageModel);
    const controller = new AbortController();
    controller.abort();

    await expect(client.ask(q("Rust"), () => {}, controller.signal)).rejects.toMatchObject({
      name: "AbortError",
    });
  });

  it("does not cache a failed create, so the next attempt tries again", async () => {
    const fake = refusingOnce(createFake().languageModel);
    const client = create(fake.languageModel);

    await expect(client.prepare()).rejects.toMatchObject({ name: "NotAllowedError" });
    await client.prepare();

    expect(fake.attempts()).toBe(2);
  });

  it("destroy releases the clone and the base", async () => {
    const fake = createFake();
    const client = create(fake.languageModel);

    await client.ask(q("Rust"), () => {});
    client.destroy();
    await Promise.resolve();

    expect(fake.sessions.map((s) => s.destroyed)).toEqual([true, true]);
  });
});
