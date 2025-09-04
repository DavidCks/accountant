"use client";

import * as React from "react";
import { observer, use$ } from "@legendapp/state/react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/toast";
import { AIController } from "./ai-controller";
import { SendHorizontal, RotateCcw } from "lucide-react";
import { ChatMsg } from "./ai-types";

export const AIModelChat = observer(function AIModelChat() {
  const chat = use$(AIController.state.chat); // <-- observe controller chat

  // UI-only state
  const [model, setModel] = React.useState<
    "prompt" | "writer" | "rewriter" | "translator"
  >("prompt");
  const [input, setInput] = React.useState("");
  const [context, setContext] = React.useState("");
  const [src, setSrc] = React.useState("en");
  const [dst, setDst] = React.useState("fr");

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const res =
      model === "translator"
        ? await AIController.chatSend({ model, input: trimmed, src, dst })
        : await AIController.chatSend({ model, input: trimmed, context });

    if (!res.ok) toast.error(<>{res.error}</>);
    if (res.ok) setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (!chat.busy) handleSend();
    }
  }

  function swapLangs() {
    setSrc((s) => {
      setDst(s);
      return dst;
    });
  }

  return (
    <div className="border-t border-border">
      {/* Header / controls */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">Model</span>
          <select
            className="text-sm bg-transparent border-0 border-b border-border focus:outline-none focus:border-foreground"
            value={model}
            onChange={(e) => setModel(e.target.value as any)}
          >
            <option value="prompt">Prompt</option>
            <option value="writer">Writer</option>
            <option value="rewriter">Rewriter</option>
            <option value="translator">Translator</option>
          </select>

          {model === "translator" ? (
            <div className="flex items-center gap-2 ml-2">
              <input
                value={src}
                onChange={(e) => setSrc(e.target.value)}
                placeholder="en"
                className="h-7 w-16 text-sm bg-transparent border-0 border-b border-border focus:outline-none focus:border-foreground placeholder:text-muted-foreground"
                aria-label="From language"
                spellCheck={false}
                autoComplete="off"
              />
              <button
                type="button"
                className="h-7 w-7 grid place-items-center rounded border border-border text-muted-foreground hover:bg-accent"
                onClick={swapLangs}
                title="Swap"
                aria-label="Swap"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <input
                value={dst}
                onChange={(e) => setDst(e.target.value)}
                placeholder="fr"
                className="h-7 w-16 text-sm bg-transparent border-0 border-b border-border focus:outline-none focus:border-foreground placeholder:text-muted-foreground"
                aria-label="To language"
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          ) : (
            <input
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Context (optional)"
              className="ml-2 h-7 w-56 text-sm bg-transparent border-0 border-b border-border focus:outline-none focus:border-foreground placeholder:text-muted-foreground"
              aria-label="Context"
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => AIController.chatClear()}
            disabled={chat.messages.length === 0}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="px-4 pb-2 space-y-2 max-h-64 overflow-auto">
        {chat.messages.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Type below and press{" "}
            <kbd className="px-1 border rounded">⌘/Ctrl + Enter</kbd> to send.
          </p>
        ) : (
          chat.messages.map((m: ChatMsg) => (
            <div
              key={m.id}
              className={[
                "text-sm rounded-md px-3 py-2 border",
                m.role === "user"
                  ? "self-end bg-accent/30 border-border"
                  : m.role === "assistant"
                    ? "bg-card text-card-foreground border-border"
                    : "bg-destructive/10 text-destructive border-destructive/20",
              ].join(" ")}
            >
              {m.text}
            </div>
          ))
        )}
      </div>

      {/* Composer */}
      <div className="px-4 pb-4">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-h-[70px] max-h-40 rounded-md border border-border bg-transparent p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder={
              model === "translator"
                ? `Translate (${src} → ${dst})…`
                : model === "writer"
                  ? "Write about…"
                  : model === "rewriter"
                    ? "Rewrite this text…"
                    : "Ask the model…"
            }
            spellCheck={true}
          />
          <Button
            size="sm"
            className="h-9"
            onClick={handleSend}
            disabled={chat.busy || !input.trim()}
          >
            <SendHorizontal className="h-4 w-4 mr-1" />
            {chat.busy ? "Running…" : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
});
