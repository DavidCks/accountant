import { Briefcase, ChevronRight, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentController } from "./agent-controller";
import { ExtractedLink } from "./utils/html-transformer/types";

// Small, pretty pill for a link
export function LinkPill({
  link,
  kind,
  hasApplied,
  onClick,
}: {
  link: ExtractedLink;
  kind: "job" | "page" | "other";
  hasApplied?: boolean;
  onClick: (url: string) => void;
}) {
  const url = typeof link === "string" ? link : (link.absolute ?? "");
  if (!url) return null;

  const label =
    typeof link === "string"
      ? link
      : (link.text || "").trim() ||
        (() => {
          try {
            const u = new URL(url);
            return u.pathname.replace(/\/$/, "") || u.hostname;
          } catch {
            return url;
          }
        })();

  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {}

  const Icon =
    kind === "job" ? Briefcase : kind === "page" ? ChevronRight : LinkIcon;

  return (
    <div>
      <input
        type="checkbox"
        checked={hasApplied}
        onChange={(e) => {
          const checked = e.target.checked;
          localStorage.setItem(link.absolute!, String(checked));

          // IMPORTANT: write a NEW object so observers rerender
          const prev = AgentController.state.hasApplied.peek() || {};
          const next = { ...prev, [link.absolute!]: checked };
          AgentController.state.hasApplied.set(next);
        }}
      />

      <Button
        size="sm"
        variant={kind === "job" ? "secondary" : "outline"}
        className="max-w-[220px] 2xl:max-w-[280px] pr-3 pl-2 h-8 group overflow-hidden border-border/60 hover:border-border"
        title={url}
        onClick={() => onClick(url)}
      >
        <Icon className="h-3.5 w-3.5 mr-1.5 shrink-0 opacity-80" />
        <span className="truncate">{label}</span>

        {host && (
          <span className="ml-2 pl-2 truncate border-l text-[11px] text-muted-foreground/80 border-border/60 hidden sm:inline">
            {host}
          </span>
        )}
      </Button>
    </div>
  );
}
