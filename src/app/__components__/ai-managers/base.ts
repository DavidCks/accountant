// /ai-managers/base.ts
import type { Observable } from "@legendapp/state";
import { AIState, ModelEntry } from "../ai-types";

export interface AIModelManager {
  refresh(name: string, state: Observable<AIState>): Promise<void>;
  download(name: string, state: Observable<AIState>): Promise<void>;
}

export function ensureEntry(state: Observable<AIState>, entry: ModelEntry) {
  const list = state.model.peek();
  if (!list.find((m) => m.name === entry.name)) state.model.push(entry);
}

export function updateProgress(
  state: Observable<AIState>,
  name: string,
  pct: number,
  status?: ModelEntry["status"],
) {
  const list = state.model.peek();
  const idx = list.findIndex((m) => m.name === name);
  if (idx < 0) return;
  const next = { ...list[idx] };
  next.downloadPercentage = Math.min(100, Math.max(0, Math.round(pct)));
  if (status) next.status = status;
  state.model.set(list.map((m, i) => (i === idx ? next : m)));
}

export function updateStatus(
  state: Observable<AIState>,
  name: string,
  status: ModelEntry["status"],
  error?: string,
) {
  const modelObs: Observable<AIState["model"]> = state.model;
  const list = modelObs.peek() as AIState["model"];
  const idx = list.findIndex((m) => m.name === name);
  if (idx < 0) return;
  const next = { ...list[idx], status, error };
  if (status === "available" && next.downloadPercentage < 100)
    next.downloadPercentage = 100;
  state.model.set(list.map((m, i) => (i === idx ? next : m)));
}

export function parseTranslatorPair(
  name: string,
): { src: string; dst: string } | null {
  // name like: "Translator: en->fr" | "Translator: en→fr"
  const m = /Translator:\s*([a-z-]+)\s*(?:->|→|−>|–>|—>)\s*([a-z-]+)/i.exec(
    name,
  );
  return m ? { src: m[1].toLowerCase(), dst: m[2].toLowerCase() } : null;
}

export function assertUserActivation() {
  const isActive = (navigator as any).userActivation?.isActive;
  if (!isActive)
    console.warn("Download should be triggered by a user interaction.");
}
