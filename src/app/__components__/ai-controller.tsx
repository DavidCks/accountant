// /ai-controller.ts
import { withControllerHelpers } from "@/lib/__state__/controller-helpers";
import { observable, Observable } from "@legendapp/state";
import type {
  AIState,
  DownloadTarget,
  ModelEntry,
  ModelType,
  // Names
  PromptModelName,
  RewriterModelName,
  WriterModelName,
  TranslatorModelName,
  ChatSendArgs,
  ChatMsg,
} from "./ai-types";
import type { AIModelManager } from "./ai-managers/base";
import { AIWriter } from "./ai-managers/writer";
import { AIRewriter } from "./ai-managers/rewriter";
import { AITranslator } from "./ai-managers/translator";
import { AIPrompter } from "./ai-managers/prompter";
import { ensureEntry, updateStatus } from "./ai-managers/base";

// ---------------- existing stuff kept ----------------
const managers = {
  writer: AIWriter,
  rewriter: AIRewriter,
  translator: AITranslator,
  prompt: AIPrompter,
} satisfies Record<ModelType, AIModelManager>;

// ---- NEW: result types (kept from your version) ----
export type AddTranslatorResult =
  | {
      ok: true;
      name: ModelEntry["name"];
      src: string;
      dst: string;
      warnings?: string[];
    }
  | {
      ok: false;
      reason: "empty" | "invalid" | "same" | "exists";
      messages: string[];
    };

// ---- NEW: BCP-47 validator using Intl.getCanonicalLocales (kept) ----
function validateLangTag(
  input: string,
): { ok: true; canonical: string; warning?: string } | { ok: false } {
  const raw = (input ?? "").trim();
  if (!raw) return { ok: false };
  try {
    const [canonical] = Intl.getCanonicalLocales(raw);
    if (!canonical || canonical.length > 32) return { ok: false };
    const warning =
      canonical !== raw
        ? `Canonicalized "${raw}" → "${canonical}".`
        : undefined;
    return { ok: true, canonical, warning };
  } catch {
    return { ok: false };
  }
}

// ---- NEW: light session cache for reuse ----
type SessionCache = {
  writer?: any;
  rewriter?: any;
  prompter?: any;
  translators: Map<string, any>; // key = `${src}->${dst}` in canonical form
};

const _sessions: SessionCache = {
  translators: new Map(),
};

function makeTranslatorName(src: string, dst: string): TranslatorModelName {
  return `Translator: ${src}->${dst}` as TranslatorModelName;
}

async function ensureReady(target: DownloadTarget): Promise<void> {
  const entry = AIController.state.model
    .peek()
    .find((m) => m.name === target.name);
  if (!entry || entry.status !== "available") {
    const ok = await AIController.download(target); // will throw on failure
    if (!ok) {
      const now = AIController.state.model
        .peek()
        .find((m) => m.name === target.name);
      const reason = now?.error || `Model "${target.name}" is not available.`;
      throw new Error(reason);
    }
  }
}

// =====================================================
// =============== CONTROLLER CLASS ====================
// =====================================================
class AIControllerBase {
  public static writer = AIWriter;
  public static rewriter = AIRewriter;
  public static translator = AITranslator;
  public static prompter = AIPrompter;

  public static state: Observable<AIState> = observable<AIState>({
    models: ["Prompt", "Rewriter", "Writer"],
    panelOpen: false,
    model: [
      {
        name: "Prompt",
        type: "prompt",
        downloadPercentage: 0,
        status: "downloadable",
      },
      {
        name: "Rewriter",
        type: "rewriter",
        downloadPercentage: 0,
        status: "downloadable",
      },
      {
        name: "Writer",
        type: "writer",
        downloadPercentage: 0,
        status: "downloadable",
      },
    ] as ModelEntry[],
    chat: {
      messages: [],
      busy: false,
    },
  });

  public static set(state: Partial<AIState>) {
    AIControllerBase.state.set({ ...AIControllerBase.state.peek(), ...state });
  }

  public static chatAppend(role: ChatMsg["role"], text: string) {
    const msg: ChatMsg = {
      id: crypto.randomUUID(),
      role,
      text,
      ts: Date.now(),
    };
    const cur = AIControllerBase.state.chat.messages.peek();
    AIControllerBase.state.chat.messages.set([...cur, msg]);
    return msg.id;
  }

  public static chatClear() {
    AIControllerBase.state.chat.messages.set([]);
  }

  public static async chatSend(
    args: ChatSendArgs,
  ): Promise<{ ok: true; output: string } | { ok: false; error: string }> {
    // guard: simple lock
    if (AIControllerBase.state.chat.busy.peek()) {
      const msg = "Another request is already running.";
      AIControllerBase.chatAppend("error", msg);
      return { ok: false, error: msg };
    }

    // record user message
    const userText =
      args.model === "translator"
        ? `${args.input}  [${args.src}→${args.dst}]`
        : args.input;
    AIControllerBase.chatAppend("user", userText);
    AIControllerBase.state.chat.busy.set(true);

    try {
      let out = "";
      if (args.model === "prompt") {
        out = await AIControllerBase.prompt({
          input: args.context
            ? [
                { role: "system", content: args.context },
                { role: "user", content: args.input },
              ]
            : args.input,
        });
      } else if (args.model === "writer") {
        out = await AIControllerBase.write({
          input: args.input,
          context: args.context,
        });
      } else if (args.model === "rewriter") {
        out = await AIControllerBase.rewrite({
          input: args.input,
          context: args.context,
        });
      } else {
        out = await AIControllerBase.translate({
          input: args.input,
          src: args.src,
          dst: args.dst,
        });
      }

      AIControllerBase.chatAppend("assistant", String(out ?? ""));
      return { ok: true, output: String(out ?? "") };
    } catch (e: any) {
      const err = String(e?.message ?? e ?? "Something went wrong.");
      AIControllerBase.chatAppend("error", err);
      return { ok: false, error: err };
    } finally {
      AIControllerBase.state.chat.busy.set(false);
    }
  }

  /** Add translator with validation + canonicalization */
  public static addTranslatorPair(
    src: string,
    dst: string,
  ): AddTranslatorResult {
    const vSrc = validateLangTag(src);
    const vDst = validateLangTag(dst);

    if (!vSrc.ok || !vDst.ok) {
      return {
        ok: false,
        reason: "invalid",
        messages: [
          'Please enter valid BCP-47 codes (e.g., "en", "fr", "en-US").',
        ],
      };
    }

    const s = vSrc.canonical;
    const d = vDst.canonical;

    if (s.toLowerCase() === d.toLowerCase()) {
      return {
        ok: false,
        reason: "same",
        messages: ["Source and target languages must differ."],
      };
    }

    const name = makeTranslatorName(s, d);

    // duplicate?
    const exists = AIControllerBase.state.model
      .peek()
      .some((m) => m.name === name);
    if (exists) {
      return {
        ok: false,
        reason: "exists",
        messages: [`Translator ${s}→${d} already exists.`],
      };
    }

    // insert model row
    ensureEntry(AIControllerBase.state, {
      name,
      type: "translator",
      downloadPercentage: 0,
      status: "downloadable",
    });

    // add to simple list
    const simple = AIControllerBase.state.models.peek();
    if (!simple.includes(name)) AIControllerBase.state.models.push(name);

    const warnings: string[] = [];
    if (vSrc.warning) warnings.push(vSrc.warning);
    if (vDst.warning) warnings.push(vDst.warning);

    return {
      ok: true,
      name,
      src: s,
      dst: d,
      warnings: warnings.length ? warnings : undefined,
    };
  }

  public static removeModel(name: string) {
    // drop cached session if translator
    if (name.startsWith("Translator:")) {
      const m =
        /Translator:\s*([^-\s>]+(?:-[^>\s]+)?)\s*->\s*([^-\s>]+(?:-[^>\s]+)?)/i.exec(
          name,
        );
      if (m) {
        const key = `${m[1]}->${m[2]}`.toLowerCase();
        _sessions.translators.delete(key);
      }
    } else if (name === "Writer") {
      _sessions.writer = undefined;
    } else if (name === "Rewriter") {
      _sessions.rewriter = undefined;
    } else if (name === "Prompt") {
      _sessions.prompter = undefined;
    }

    const list = AIControllerBase.state.model.peek();
    AIControllerBase.state.model.set(list.filter((m) => m.name !== name));
    const simple = AIControllerBase.state.models.peek();
    AIControllerBase.state.models.set(simple.filter((n) => n !== name));
  }

  public static async refresh() {
    const entries = AIControllerBase.state.model.peek();
    await Promise.all(
      entries.map((e) =>
        managers[e.type].refresh(e.name, AIControllerBase.state),
      ),
    );
  }

  public static async download(target: DownloadTarget): Promise<boolean> {
    ensureEntry(AIControllerBase.state, {
      name: target.name,
      type: target.type,
      downloadPercentage: 0,
      status: "downloadable",
    });

    try {
      await managers[target.type].download(target.name, AIControllerBase.state);
      const entry = AIControllerBase.state.model
        .peek()
        .find((m) => m.name === target.name);
      return entry?.status === "available";
    } catch (err: any) {
      updateStatus(
        AIControllerBase.state,
        target.name,
        "error",
        String(err?.message ?? err),
      );
      throw err;
    }
  }

  // =====================================================
  // =============== UNIFIED RUNTIME API =================
  // =====================================================

  /** Prompt (Prompt API / LanguageModel) */
  public static async prompt(opts: {
    input: string | Array<any>;
    // you can expose temperature/topK later if you want
  }): Promise<string> {
    const name = "Prompt" as PromptModelName;

    // ensure model row exists
    ensureEntry(AIControllerBase.state, {
      name,
      type: "prompt",
      downloadPercentage: 0,
      status: "downloadable",
    });

    await ensureReady({ type: "prompt", name });

    // create or reuse session
    if (!_sessions.prompter) {
      _sessions.prompter = await (LanguageModel as any).create();
    }

    const session = _sessions.prompter;
    const result = Array.isArray(opts.input)
      ? await session.prompt(opts.input)
      : await session.prompt(opts.input);
    return typeof result === "string" ? result : String(result);
  }

  /** Writer.write(...) -> string */
  public static async write(opts: {
    input: string;
    context?: string;
    tone?: "formal" | "neutral" | "casual";
    length?: "short" | "medium" | "long";
    format?: "markdown" | "plain-text";
  }): Promise<string> {
    const name = "Writer" as WriterModelName;

    ensureEntry(AIControllerBase.state, {
      name,
      type: "writer",
      downloadPercentage: 0,
      status: "downloadable",
    });

    await ensureReady({ type: "writer", name });

    if (!_sessions.writer) {
      _sessions.writer = await (Writer as any).create({
        tone: opts.tone,
        length: opts.length,
        format: opts.format,
      });
    }

    const writer = _sessions.writer;
    const result = await writer.write(
      opts.input,
      opts.context ? { context: opts.context } : undefined,
    );
    return typeof result === "string" ? result : String(result);
  }

  /** Rewriter.rewrite(...) -> string */
  public static async rewrite(opts: {
    input: string;
    context?: string;
    tone?: "more-formal" | "as-is" | "more-casual";
    length?: "shorter" | "as-is" | "longer";
    format?: "as-is" | "markdown" | "plain-text";
    sharedContext?: string;
  }): Promise<string> {
    const name = "Rewriter" as RewriterModelName;

    ensureEntry(AIControllerBase.state, {
      name,
      type: "rewriter",
      downloadPercentage: 0,
      status: "downloadable",
    });

    await ensureReady({ type: "rewriter", name });

    if (!_sessions.rewriter) {
      _sessions.rewriter = await (Rewriter as any).create({
        tone: opts.tone,
        length: opts.length,
        format: opts.format,
        sharedContext: opts.sharedContext,
      });
    }

    const rewriter = _sessions.rewriter;
    const result = await rewriter.rewrite(
      opts.input,
      opts.context ? { context: opts.context } : undefined,
    );
    return typeof result === "string" ? result : String(result);
  }

  /** Translator.translate(...) -> string */
  public static async translate(opts: {
    input: string;
    src: string;
    dst: string;
  }): Promise<string> {
    // 1) validate & (maybe) add the translator model row
    const added = AIControllerBase.addTranslatorPair(opts.src, opts.dst);
    if (!added.ok && added.reason !== "exists") {
      throw new Error(added.messages[0] ?? "Invalid translator pair.");
    }

    // SAFE narrows — no inline access to .canonical
    const vSrc = validateLangTag(opts.src);
    const vDst = validateLangTag(opts.dst);

    const src = added.ok ? added.src : vSrc.ok ? vSrc.canonical : opts.src;

    const dst = added.ok ? added.dst : vDst.ok ? vDst.canonical : opts.dst;

    const name = `Translator: ${src}->${dst}` as TranslatorModelName;

    // 2) ensure model is ready (downloads on demand)
    await ensureReady({ type: "translator", name });

    // 3) reuse or create cached translator
    const key = `${src}->${dst}`.toLowerCase();
    let translator = _sessions.translators.get(key);
    if (!translator) {
      translator = await (Translator as any).create({
        sourceLanguage: src,
        targetLanguage: dst,
      });
      _sessions.translators.set(key, translator);
    }

    // 4) run
    const result = await translator.translate(opts.input);
    return typeof result === "string" ? result : String(result);
  }

  public static async summarizeJobDescription(jd: string): Promise<string> {
    const input = String(jd ?? "").trim();
    if (!input)
      throw new Error("summarizeJobDescription: empty job description.");

    // The instruction we want the Rewriter to apply (kept per-call to avoid polluting shared sessions)
    const context = `Summarize the JOB POST into ONE paragraph (120–180 words) to help tailor a resume.

 Rules:
 - Plain English, no bullets, no headings, no line breaks—just one cohesive paragraph.
 - Keep only resume-relevant facts; strip marketing/fluff.
 - Use exact JD terms for ATS (quote short phrases like "microservices", "distributed systems" when helpful).
 - Do NOT invent details; if something isn’t stated, write "not mentioned".
 - Keep neutral, factual tone.

 Include, in this order (combine smoothly into one paragraph):
 1) Company domain/mission.
 2) Role title, seniority/YOE, team/area, location/remote (or "not mentioned").
 3) Core impact/objectives.
 4) 3–5 top responsibilities (condense with commas/semicolons).
 5) Must-have skills/tech (frontend, backend, languages/frameworks, databases, cloud/DevOps, architecture, security/testing).
 6) Hard requirements/deal breakers (degrees, YOE, certifications).
 7) Nice-to-haves or differentiators only if relevant to tailoring (e.g., equity, high growth).
 8) Any critical gaps as "Gaps: …".

 Output: one paragraph only. Make sure to inlcude the required tech stack and languages mentioned.

 JOB POST:
 `;

    // Use the Rewriter model to apply the above instructions to the JD.
    const raw = await AIControllerBase.rewrite({
      input, // the JD text itself
      context: context + input, // instructions + JD
      tone: "as-is",
      length: "shorter",
      format: "plain-text",
    });

    // Post-process: collapse to a single clean paragraph and trim.
    const cleaned = String(raw ?? "")
      .replace(/\r?\n+/g, " ") // remove line breaks
      .replace(/\s+/g, " ") // collapse whitespace
      .replace(/\s([.,;:!?])/g, "$1") // tidy spaces before punctuation
      .trim();

    return cleaned;
  }
}

export const AIController = withControllerHelpers(AIControllerBase);
