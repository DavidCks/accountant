"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import type { ModelEntry } from "./ai-types";

const statusTone: Record<NonNullable<ModelEntry["status"]>, string> = {
  available:
    "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  downloading:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  downloadable:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  unavailable: "bg-muted text-muted-foreground border-border",
  error: "bg-destructive/10 text-destructive border-destructive/20",
};

export function StatusBadge({ status }: { status?: ModelEntry["status"] }) {
  if (!status) return null;
  return (
    <Badge variant="outline" className={statusTone[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export function AiManageCard({
  model,
  onDownload,
  onDelete, // optional, only used for translators
}: {
  model: ModelEntry;
  onDownload: () => void;
  onDelete?: () => void;
}) {
  const isDownloaded =
    model.status === "available" || model.downloadPercentage >= 100;

  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>({});
  const isOpen = openMap[model.name] ?? !isDownloaded;
  const toggle = () =>
    setOpenMap((p) => ({
      ...p,
      [model.name]: !(p[model.name] ?? !isDownloaded),
    }));

  const statusLabel = isDownloaded
    ? "Ready to use"
    : model.status === "downloading"
      ? `Downloading… ${model.downloadPercentage}%`
      : model.status === "downloadable"
        ? "Not downloaded"
        : model.status === "unavailable"
          ? "Unavailable on this device"
          : model.status === "error"
            ? "Error"
            : "";

  // Delete is shown ONLY for downloaded translators AND only if a handler is provided
  const canDelete =
    model.type === "translator" &&
    isDownloaded &&
    typeof onDelete === "function";

  return (
    <>
      <div className="mx-4 mb-2 mt-1 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{statusLabel}</span>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs ml-auto"
          onClick={toggle}
          aria-expanded={isOpen}
        >
          <ChevronDown
            className={[
              "mr-1 h-3.5 w-3.5 transition-transform",
              isOpen ? "rotate-180" : "",
            ].join(" ")}
          />
          Details
        </Button>

        {canDelete && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7"
            onClick={onDelete}
          >
            Delete
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="mx-4 mb-4 bg-card text-card-foreground">
          <CardContent className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Type: {model.type}
              </div>
              {isDownloaded && (
                <span className="text-xs text-muted-foreground">
                  Ready to use
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Progress value={model.downloadPercentage} className="w-full" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {model.downloadPercentage}% downloaded
                </span>
                <div className="flex items-center gap-2">
                  {model.status === "error" && model.error && (
                    <span className="text-xs text-destructive">
                      {model.error}
                    </span>
                  )}
                  <Button
                    size="sm"
                    onClick={onDownload}
                    disabled={
                      model.status === "downloading" ||
                      (model.downloadPercentage > 0 &&
                        model.downloadPercentage < 100)
                    }
                  >
                    {model.status === "error"
                      ? "Retry"
                      : isDownloaded
                        ? "Ready"
                        : model.status === "downloading"
                          ? "Downloading…"
                          : "Download"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
