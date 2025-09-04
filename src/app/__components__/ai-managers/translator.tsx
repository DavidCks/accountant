import {
  AIModelManager,
  updateProgress,
  updateStatus,
  parseTranslatorPair,
  assertUserActivation,
} from "./base";
import { onDownloadProgress } from "./util";

export const AITranslator: AIModelManager = {
  async refresh(name, state) {
    if (typeof window === "undefined" || !("Translator" in self)) {
      updateStatus(state, name, "unavailable", "Translator API not supported.");
      return;
    }
    const pair = parseTranslatorPair(name) ?? { src: "en", dst: "fr" };
    const availability = await Translator.availability({
      sourceLanguage: pair.src,
      targetLanguage: pair.dst,
    });
    if (availability === "available") updateStatus(state, name, "available");
    else if (availability === "unavailable")
      updateStatus(state, name, "unavailable");
    else updateStatus(state, name, "downloadable");
  },

  async download(name, state) {
    assertUserActivation();
    if (typeof window === "undefined" || !("Translator" in self)) {
      updateStatus(state, name, "unavailable", "Translator API not supported.");
      return;
    }
    const pair = parseTranslatorPair(name) ?? { src: "en", dst: "fr" };

    const availability = await Translator.availability({
      sourceLanguage: pair.src,
      targetLanguage: pair.dst,
    });
    if (availability === "unavailable")
      return updateStatus(state, name, "unavailable");
    if (availability === "available")
      return updateStatus(state, name, "available");

    updateStatus(state, name, "downloading");
    try {
      const translator = await Translator.create({
        sourceLanguage: pair.src,
        targetLanguage: pair.dst,
        monitor(m: EventTarget) {
          onDownloadProgress(m, (loaded) => {
            updateProgress(state, name, loaded * 100, "downloading");
          });
        },
      });
      updateStatus(state, name, "available");
      (translator as any).__ready = true;
    } catch (e: any) {
      updateStatus(state, name, "error", String(e?.message ?? e));
    }
  },
};
