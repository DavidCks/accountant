import {
  AIModelManager,
  updateProgress,
  updateStatus,
  assertUserActivation,
} from "./base";
import { onDownloadProgress } from "./util";

export const AIPrompter: AIModelManager = {
  async refresh(name, state) {
    if (typeof window === "undefined" || !("LanguageModel" in self)) {
      updateStatus(state, name, "unavailable", "Prompt API not supported.");
      return;
    }
    const availability = await LanguageModel.availability();
    if (availability === "available") updateStatus(state, name, "available");
    else if (availability === "unavailable")
      updateStatus(state, name, "unavailable");
    else updateStatus(state, name, "downloadable");
  },

  async download(name, state) {
    assertUserActivation();
    if (typeof window === "undefined" || !("LanguageModel" in self)) {
      updateStatus(state, name, "unavailable", "Prompt API not supported.");
      return;
    }

    const availability = await LanguageModel.availability();
    if (availability === "unavailable")
      return updateStatus(state, name, "unavailable");
    if (availability === "available")
      return updateStatus(state, name, "available");

    updateStatus(state, name, "downloading");
    try {
      const session = await LanguageModel.create({
        monitor(m: EventTarget) {
          onDownloadProgress(m, (loaded) => {
            updateProgress(state, name, loaded * 100, "downloading");
          });
        },
      });
      updateStatus(state, name, "available");
      (session as any).__ready = true;
    } catch (e: any) {
      updateStatus(state, name, "error", String(e?.message ?? e));
    }
  },
};
