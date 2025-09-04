"use client";

import React, { useState } from "react";
import { observer, use$ } from "@legendapp/state/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ChevronRight, Plus } from "lucide-react";
import { toast } from "@/components/toast";

import { AIController } from "./ai-controller";
import { AiManageCard, StatusBadge } from "./ai-manage-card";
import type {
  AIState,
  ModelEntry,
  DownloadTarget,
  PromptModelName,
  RewriterModelName,
  WriterModelName,
  TranslatorModelName,
} from "./ai-types";
import { AIModelChat } from "./ai-model-chat";

function toDownloadTarget(m: ModelEntry): DownloadTarget {
  switch (m.type) {
    case "prompt":
      return { type: "prompt", name: m.name as PromptModelName };
    case "rewriter":
      return { type: "rewriter", name: m.name as RewriterModelName };
    case "writer":
      return { type: "writer", name: m.name as WriterModelName };
    case "translator":
      return { type: "translator", name: m.name as TranslatorModelName };
  }
}

const AIModelsPanel = observer(() => {
  const open = AIController.use("panelOpen");
  const state: AIState = use$(AIController.state);

  // translator form state
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("fr");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addTranslator = () => {
    const res = AIController.addTranslatorPair(fromLang, toLang);

    if (!res.ok) {
      switch (res.reason) {
        case "invalid":
        case "empty":
          toast.error(
            <>
              Invalid language codes. Use BCP-47 (e.g., <code>en</code>,{" "}
              <code>fr</code>, <code>en-US</code>).
            </>,
          );
          setErrorMsg(
            "Please enter valid BCP-47 language codes (e.g., en, fr, en-US).",
          );
          break;
        case "same":
          toast.warning(<>Source and target languages must differ.</>);
          setErrorMsg("Source and target languages must differ.");
          break;
        case "exists":
          toast.info(<>{res.messages?.[0] ?? "Translator already exists."}</>);
          setErrorMsg(res.messages?.[0] ?? null);
          break;
      }
      return;
    }

    setErrorMsg(null);
    if (res.warnings?.length) {
      res.warnings.forEach((w) => toast.warning(<>{w}</>));
    }
    setFromLang(res.src);
    setToLang(res.dst);
    toast.success(
      <>
        Added translator{" "}
        <code>
          {res.src}→{res.dst}
        </code>
        .
      </>,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTranslator();
  };

  return (
    <div
      className={[
        "fixed top-0 right-0 h-full z-50 transition-all duration-300 ease-in-out flex flex-col",
        open
          ? "bg-background text-foreground border-l border-border shadow-xl max-w-[75%] w-[420px]"
          : "bg-border w-[2px]",
      ].join(" ")}
      aria-label="AI models panel"
    >
      {open ? (
        <button
          type="button"
          aria-label="Collapse AI panel"
          className="absolute top-4 left-[-22px] rounded-full shadow p-1 border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => AIController.state.panelOpen.set(false)}
        >
          <ChevronRight size={18} />
        </button>
      ) : (
        <button
          type="button"
          aria-label="Expand AI panel"
          className={[
            "absolute top-1/2 -translate-y-1/2",
            "left-[-16px]",
            "h-12 w-8 flex items-center justify-center",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          ].join(" ")}
          onClick={() => AIController.state.panelOpen.set(true)}
        >
          <span
            className={[
              "h-8 w-3 rounded-full",
              "bg-gradient-to-b from-purple-500 via-blue-500 to-cyan-400",
              "shadow-[0_0_6px_rgba(147,51,234,0.6),0_0_12px_rgba(59,130,246,0.4)]",
              "hover:opacity-90 transition-opacity",
            ].join(" ")}
          />
          <span className="sr-only">Expand</span>
        </button>
      )}

      {open && (
        <>
          <Card className="rounded-none border-0 border-b border-border bg-card text-card-foreground">
            <CardHeader className="py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">AI Models</h2>
                <p className="text-sm text-muted-foreground">
                  Manage downloads and usage
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => AIController.refresh()}
              >
                Refresh
              </Button>
            </CardHeader>
          </Card>

          <div className="flex-1 overflow-auto pb-4">
            <Accordion type="multiple" className="w-full">
              {state.model.map((m, idx) => (
                <AccordionItem
                  key={m.name}
                  value={`model-${idx}`}
                  className="border-border"
                >
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-sm">{m.name}</span>
                      <StatusBadge status={m.status} />
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-0">
                    <AiManageCard
                      model={m}
                      onDownload={() =>
                        AIController.download(toDownloadTarget(m))
                      }
                      onDelete={
                        m.type === "translator"
                          ? () => {
                              AIController.removeModel(m.name);
                              toast.info(
                                <>
                                  Removed <code>{m.name}</code>.
                                </>,
                              );
                            }
                          : undefined
                      }
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Add-translator row */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <div className="flex items-center gap-2 justify-between w-full">
                <span className="text-sm">Translator</span>
                <div className="flex flex-row items-center gap-2">
                  <input
                    id="fromLang"
                    value={fromLang}
                    onChange={(e) => setFromLang(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="en"
                    className="h-7 w-14 text-sm bg-transparent border-0 border-b border-border focus:outline-none focus:border-foreground placeholder:text-muted-foreground"
                    aria-label="From language code"
                    inputMode="text"
                    spellCheck={false}
                    autoComplete="off"
                    pattern="[A-Za-z-]{1,32}"
                  />
                  <span className="text-xs text-muted-foreground select-none">
                    →
                  </span>
                  <input
                    id="toLang"
                    value={toLang}
                    onChange={(e) => setToLang(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="fr"
                    className="h-7 w-14 text-sm bg-transparent border-0 border-b border-border focus:outline-none focus:border-foreground placeholder:text-muted-foreground"
                    aria-label="To language code"
                    inputMode="text"
                    spellCheck={false}
                    autoComplete="off"
                    pattern="[A-Za-z-]{1,32}"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={addTranslator}
                    aria-label="Add translator"
                    title="Add translator"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {errorMsg && (
              <p className="px-4 mt-1 text-xs text-destructive">{errorMsg}</p>
            )}
            <p className="px-4 mt-1 text-xs text-muted-foreground">
              Use BCP 47 codes, e.g. <code>en</code>, <code>fr</code>,{" "}
              <code>es</code>.
            </p>
          </div>
        </>
      )}
      <AIModelChat />
    </div>
  );
});

export default AIModelsPanel;
