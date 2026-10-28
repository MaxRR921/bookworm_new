import { Rows3, X } from "lucide-react";
import type { BookEvent } from "@/data/bookworm";
import { cn } from "@/lib/utils";

/** Says what the feed shows — all discussion, or the selected moment as a removable pill — and holds the "Group topics" switch. */
export function DiscussionCard({ compact, onCompact, event, clear, shown, total }: {
  compact: boolean;
  onCompact: (on: boolean) => void;
  event: BookEvent | undefined;
  clear: () => void;
  shown: number;
  total: number;
}) {
  return (
    <div className="mb-2 flex min-h-11 items-center gap-3 rounded-xl bg-muted px-2 py-1.5">
      {event ? (
        <>
          <button key={event.id} onClick={clear} aria-label={`Remove ${event.title} filter`}
            style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 9px) 50%, 100% 100%, 0 100%)" }}
            className="ribbon-unfurl inline-flex h-8 min-w-0 items-center gap-1.5 rounded-l-md bg-ribbon pl-3 pr-5 text-[13px] font-semibold text-ribbon-foreground transition-colors hover:bg-ribbon/90">
            <span className="truncate">{event.title}</span> <X size={14} className="shrink-0" />
          </button>
          <span className="shrink-0 text-[13px] text-muted-foreground tabular-nums">{shown} of {total} posts</span>
        </>
      ) : (
        <span className="pl-2 text-[13px] font-semibold">
          {compact ? "Grouped by moment" : "All discussion"}
        </span>
      )}
      <button onClick={() => onCompact(!compact)} aria-pressed={compact}
        className={cn("ml-auto inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold transition-colors",
          compact ? "bg-event-soft text-event ring-1 ring-inset ring-event/30" : "bg-card text-foreground hover:bg-accent")}>
        <Rows3 size={14} /> Group topics
      </button>
    </div>
  );
}
