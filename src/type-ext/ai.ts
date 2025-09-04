// src/types/chrome-builtins.d.ts
export {};

declare global {
  // Only runtime-provided globals; no app state types here.
  type Availability =
    | "unavailable"
    | "downloadable"
    | "downloading"
    | "available";

  interface DownloadProgressEvent extends Event {
    loaded: number; // 0..1
    total?: number;
  }

  const Writer: {
    availability(opts?: any): Promise<Availability>;
    create(opts?: {
      monitor?: (m: EventTarget) => void;
      signal?: AbortSignal;
    }): Promise<any>;
  };

  const Rewriter: {
    availability(opts?: any): Promise<Availability>;
    create(opts?: {
      monitor?: (m: EventTarget) => void;
      signal?: AbortSignal;
    }): Promise<any>;
  };

  const LanguageModel: {
    availability(opts?: any): Promise<Availability>;
    create(opts?: {
      monitor?: (m: EventTarget) => void;
      signal?: AbortSignal;
      initialPrompts?: any;
      temperature?: number;
      topK?: number;
    }): Promise<any>;
    params(): Promise<{
      defaultTopK: number;
      maxTopK: number;
      defaultTemperature: number;
      maxTemperature: number;
    }>;
  };

  const Translator: {
    availability(opts: {
      sourceLanguage: string;
      targetLanguage: string;
    }): Promise<Availability>;
    create(opts: {
      sourceLanguage: string;
      targetLanguage: string;
      monitor?: (m: EventTarget) => void;
      signal?: AbortSignal;
    }): Promise<any>;
  };
}
