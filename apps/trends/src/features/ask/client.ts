import { askConfig } from "#/features/ask/config";
import { LANGUAGE_MODEL_EXPECTATIONS } from "#/features/ask/language-model";
import type { Retriever } from "#/features/ask/retrieval";
import type {
  AskReference,
  AskScope,
  LanguageModelSession,
  LanguageModelStatic,
} from "#/features/ask/types";
import {
  buildQuestionMessage,
  buildSystemPrompt,
  estimateTokens,
  type PackedBlocks,
  packBlocks,
  type PromptDates,
} from "#/features/ask/utils/context";

export interface AskClientOptions {
  languageModel: LanguageModelStatic;
  retriever: Retriever;
  dates: PromptDates;
  /** Download progress of the model, 0–1; only fires when a download runs. */
  onDownloadProgress?: ((loaded: number) => void) | undefined;
}

export interface AskQuestion {
  question: string;
  scope: AskScope;
}

export interface AskClient {
  /** Creates the base session, downloading the model first when needed. */
  prepare(): Promise<void>;
  /** Streams the answer through `onChunk`; resolves with what the model was given. */
  ask(
    input: AskQuestion,
    onChunk: (chunk: string) => void,
    signal?: AbortSignal,
  ): Promise<AskReference[]>;
  destroy(): void;
}

/* Free room in the session, under whichever names this build exposes. */
const readFreeTokens = (session: LanguageModelSession): number | undefined => {
  const window = session.contextWindow ?? session.inputQuota;
  const usage = session.contextUsage ?? session.inputUsage;
  return window !== undefined && usage !== undefined ? window - usage : undefined;
};

const isQuotaError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  Reflect.get(error, "name") === "QuotaExceededError";

const pump = async (stream: ReadableStream<string>, onChunk: (chunk: string) => void) => {
  const reader = stream.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) return;
      onChunk(value);
    }
  } finally {
    reader.releaseLock();
  }
};

/* The next budget to try when the engine disagrees with the estimate: a
   share of what was actually packed, not of the budget, so a fallback budget
   far above the content converges in one step instead of many prompts. */
const shrink = (packed: PackedBlocks): number => Math.floor(estimateTokens(packed.text) * 0.6);

/**
 * One page's questions to the on-device model. The base session holds only
 * the system prompt; every question runs in its own clone of it, which goes
 * when the answer does. There is no conversation: a wide question fills most
 * of the window with its material, so carrying it as history would only push
 * the next question's material out, and each question brings its own.
 */
export const createAskClient = ({
  languageModel,
  retriever,
  dates,
  onDownloadProgress,
}: AskClientOptions): AskClient => {
  const systemPrompt = buildSystemPrompt(dates);
  let basePromise: Promise<LanguageModelSession> | undefined;

  const prepareBase = () => {
    // A failed create (download refused, hardware) is not cached, so the next
    // click can try again.
    basePromise ??= languageModel
      .create({
        ...LANGUAGE_MODEL_EXPECTATIONS,
        initialPrompts: [{ role: "system", content: systemPrompt }],
        monitor(monitor) {
          monitor.addEventListener("downloadprogress", (event) => {
            const loaded: unknown = Reflect.get(event, "loaded");
            if (typeof loaded === "number") onDownloadProgress?.(loaded);
          });
        },
      })
      .catch((error: unknown) => {
        basePromise = undefined;
        throw error;
      });
    return basePromise;
  };

  const ask: AskClient["ask"] = async ({ question, scope }, onChunk, signal) => {
    // Retrieval first: it may take a Pagefind load and a few fetches, and the
    // session's free room is read right before the prompt is built.
    const material = await retriever.retrieve(question, scope);
    signal?.throwIfAborted();

    const session = await (await prepareBase()).clone();
    try {
      const free = readFreeTokens(session);
      const reserve = askConfig.answerReserveTokens + estimateTokens(question);
      const budget = Math.max(0, (free ?? askConfig.fallbackBudgetTokens) - reserve);
      let packed: PackedBlocks = packBlocks(material.blocks, budget);
      const message = () =>
        buildQuestionMessage({ period: material.period, references: packed.text, question });

      // The estimate is deliberately coarse; let the engine count when it can,
      // taking the overage it reports off the room until the message fits.
      if (session.measureContextUsage && free !== undefined) {
        while (packed.text !== "") {
          const overage = (await session.measureContextUsage(message())) - (free - reserve);
          if (overage <= 0) break;
          packed = packBlocks(material.blocks, estimateTokens(packed.text) - overage);
        }
      }

      for (;;) {
        try {
          await pump(session.promptStreaming(message(), { signal }), onChunk);
          return packed.refs;
        } catch (error) {
          if (!isQuotaError(error) || packed.text === "") throw error;
          // The engine still refused the input: retry with less of it.
          packed = packBlocks(material.blocks, shrink(packed));
        }
      }
    } finally {
      session.destroy();
    }
  };

  const destroy = () => {
    basePromise?.then((base) => base.destroy()).catch(() => {});
    basePromise = undefined;
  };

  return { prepare: async () => void (await prepareBase()), ask, destroy };
};
