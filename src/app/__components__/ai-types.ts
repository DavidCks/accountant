// types/ai.ts

export type ModelType = "writer" | "rewriter" | "prompt" | "translator";

export type PromptModelName = "Prompt";
export type RewriterModelName = "Rewriter";
export type WriterModelName = "Writer";

// "en->fr", "en→fr", case-insensitive on both sides
export type LangArrow = "->" | "→" | "−>" | "–>" | "—>"; // include common dashes if you like
export type LangCode = Lowercase<string>;
export type TranslatorPairString = `${LangCode}${LangArrow}${LangCode}`;
export type TranslatorModelName = `Translator: ${TranslatorPairString}`;

export type ModelNameMap = {
  prompt: PromptModelName;
  rewriter: RewriterModelName;
  writer: WriterModelName;
  translator: TranslatorModelName;
};

export type ModelName<T extends ModelType> = ModelNameMap[T];
export type AnyModelName = ModelName<ModelType>;

export type ModelEntry = {
  name: AnyModelName; // constrained names
  type: ModelType; // constrained types
  downloadPercentage: number; // 0-100
  status?:
    | "unavailable"
    | "downloadable"
    | "downloading"
    | "available"
    | "error";
  error?: string;
};

export type ChatMsg = {
  id: string;
  role: "user" | "assistant" | "error";
  text: string;
  ts: number;
};

export type ChatSendArgs =
  | { model: "prompt"; input: string; context?: string }
  | { model: "writer"; input: string; context?: string }
  | { model: "rewriter"; input: string; context?: string }
  | { model: "translator"; input: string; src: string; dst: string };

export type AIState = {
  models: AnyModelName[];
  panelOpen: boolean;
  model: ModelEntry[];
  chat: {
    messages: ChatMsg[];
    busy: boolean;
  };
};

export type Availability =
  | "unavailable"
  | "downloadable"
  | "downloading"
  | "available";

// Strongly-typed download target (no guessing):
export type DownloadTarget =
  | { type: "prompt"; name: PromptModelName }
  | { type: "rewriter"; name: RewriterModelName }
  | { type: "writer"; name: WriterModelName }
  | { type: "translator"; name: TranslatorModelName };
