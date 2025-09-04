// ai-runtime.ts
import { AIController } from "./ai-controller";
import { type DownloadTarget, type ModelEntry } from "./ai-types";
import { parseTranslatorPair } from "./ai-managers/base";

/** The unified “simple call” interface */
export type UnifiedRunArgs = {
  input: string; // text to process
  context?: string; // optional task context / guidance
};

export type UnifiedRunner = (args: UnifiedRunArgs) => Promise<string>;

/** Streaming flavor: yields chunks as they arrive (where supported) */
export type UnifiedStreamRunner = (
  args: UnifiedRunArgs,
) => AsyncIterable<string>;

/**
 * Internal cache of live sessions/writers/rewriters/translators.
 * Keyed by the model entry name, e.g. "Prompt", "Writer", "Rewriter",
 * or "Translator: en->fr".
 */
const sessionCache = new Map<string, any>();

/** Helper: ensure the model exists in state; trigger download if needed */
async function ensureReady(target: DownloadTarget): Promise<void> {
  const entry0 = AIController.state.model
    .peek()
    .find((m) => m.name === target.name);

  if (!entry0 || entry0.status !== "available") {
    // This must be called from a user gesture the first time.
    const ok = await AIController.download(target); // now rejects on failure
    if (!ok) {
      const entry = AIController.state.model
        .peek()
        .find((m) => m.name === target.name);
      const reason = entry?.error || `Model "${target.name}" is not available.`;
      throw new Error(reason);
    }
  }
}

/** Build (or reuse) the underlying session/instance and return a uniform runner */
export async function getUnifiedRunner(
  target: DownloadTarget,
): Promise<UnifiedRunner> {
  await ensureReady(target);

  // Reuse existing instance if we already created it
  if (sessionCache.has(target.name)) {
    const cached = sessionCache.get(target.name);
    return makeRunnerFor(target, cached);
  }

  // Otherwise create per-API instance
  switch (target.type) {
    case "prompt": {
      // LanguageModel session
      const session = await LanguageModel.create();
      sessionCache.set(target.name, session);
      return makeRunnerFor(target, session);
    }

    case "writer": {
      // You can pass options here if you like; keeping minimal
      const writer = await Writer.create();
      sessionCache.set(target.name, writer);
      return makeRunnerFor(target, writer);
    }

    case "rewriter": {
      const rewriter = await Rewriter.create();
      sessionCache.set(target.name, rewriter);
      return makeRunnerFor(target, rewriter);
    }

    case "translator": {
      // Parse the pair from the model name
      const { src, dst } = parseTranslatorPair(target.name) ?? {
        src: "en",
        dst: "fr",
      };
      const translator = await Translator.create({
        sourceLanguage: src,
        targetLanguage: dst,
      });
      sessionCache.set(target.name, translator);
      return makeRunnerFor(target, translator);
    }
  }
}

/** Same, but streaming (returns AsyncIterable<string> when supported) */
export async function getUnifiedStreamRunner(
  target: DownloadTarget,
): Promise<UnifiedStreamRunner> {
  await ensureReady(target);

  if (sessionCache.has(target.name)) {
    return makeStreamRunnerFor(target, sessionCache.get(target.name));
  }

  switch (target.type) {
    case "prompt": {
      const session = await LanguageModel.create();
      sessionCache.set(target.name, session);
      return makeStreamRunnerFor(target, session);
    }
    case "writer": {
      const writer = await Writer.create();
      sessionCache.set(target.name, writer);
      return makeStreamRunnerFor(target, writer);
    }
    case "rewriter": {
      const rewriter = await Rewriter.create();
      sessionCache.set(target.name, rewriter);
      return makeStreamRunnerFor(target, rewriter);
    }
    case "translator": {
      // Translator has a streaming API, too
      const { src, dst } = parseTranslatorPair(target.name) ?? {
        src: "en",
        dst: "fr",
      };
      const translator = await Translator.create({
        sourceLanguage: src,
        targetLanguage: dst,
      });
      sessionCache.set(target.name, translator);
      return makeStreamRunnerFor(target, translator);
    }
  }
}

/** Convenience: run one-shot without keeping a handle */
export async function runModel(
  target: DownloadTarget,
  args: UnifiedRunArgs,
): Promise<string> {
  const run = await getUnifiedRunner(target);
  return run(args);
}

/** Convenience: stream one-shot */
export async function* streamModel(
  target: DownloadTarget,
  args: UnifiedRunArgs,
): AsyncIterable<string> {
  const runStream = await getUnifiedStreamRunner(target);
  for await (const chunk of runStream(args)) {
    yield chunk;
  }
}

/* ----------------- per-API adapters ----------------- */

function makeRunnerFor(target: DownloadTarget, instance: any): UnifiedRunner {
  switch (target.type) {
    case "prompt":
      // LanguageModel: use session.prompt(); inject context as a system line if provided
      return async ({ input, context }) => {
        if (context) {
          return instance.prompt([
            { role: "system", content: context },
            { role: "user", content: input },
          ]);
        }
        return instance.prompt(input);
      };

    case "writer":
      // Writer: writer.write(input, { context })
      return async ({ input, context }) => {
        const res = await instance.write(
          input,
          context ? { context } : undefined,
        );
        return typeof res === "string" ? res : String(res ?? "");
      };

    case "rewriter":
      // Rewriter: rewriter.rewrite(input, { context })
      return async ({ input, context }) => {
        const res = await instance.rewrite(
          input,
          context ? { context } : undefined,
        );
        return typeof res === "string" ? res : String(res ?? "");
      };

    case "translator":
      // Translator ignores context; just translate the input
      return async ({ input }) => {
        const res = await instance.translate(input);
        return typeof res === "string" ? res : String(res ?? "");
      };
  }
}

function makeStreamRunnerFor(
  target: DownloadTarget,
  instance: any,
): UnifiedStreamRunner {
  switch (target.type) {
    case "prompt":
      // LanguageModel: promptStreaming
      return async function* ({ input, context }) {
        const stream = context
          ? instance.promptStreaming([
              { role: "system", content: context },
              { role: "user", content: input },
            ])
          : instance.promptStreaming(input);
        for await (const chunk of stream) yield chunk;
      };

    case "writer":
      return async function* ({ input, context }) {
        const stream = instance.writeStreaming(
          input,
          context ? { context } : undefined,
        );
        for await (const chunk of stream) yield chunk;
      };

    case "rewriter":
      return async function* ({ input, context }) {
        const stream = instance.rewriteStreaming(
          input,
          context ? { context } : undefined,
        );
        for await (const chunk of stream) yield chunk;
      };

    case "translator":
      return async function* ({ input }) {
        const stream = instance.translateStreaming(input);
        for await (const chunk of stream) yield chunk;
      };
  }
}

/** Optional: drop a cached session (e.g., after Delete a translator) */
export function destroySession(name: ModelEntry["name"]) {
  const inst = sessionCache.get(name);
  if (inst?.destroy) {
    try {
      inst.destroy();
    } catch {}
  }
  sessionCache.delete(name);
}
