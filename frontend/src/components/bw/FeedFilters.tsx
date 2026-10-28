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
    <div className="mb-4 flex items-center gap-3 rounded-2xl border bg-card p-3">
      {event ? (
        <>
          <button onClick={clear} aria-label={`Remove ${event.title} filter`}
            className="inline-flex min-w-0 items-center gap-1 rounded-full bg-event px-3 py-1 text-xs font-medium text-primary-foreground">
            <span className="truncate">◆ {event.title}</span> <X size={12} className="shrink-0" />
          </button>
          <span className="shrink-0 text-sm text-muted-foreground">{shown} of {total} posts</span>
        </>
      ) : (
        <span className={cn(compact ? "text-sm text-muted-foreground" : "font-serif font-semibold leading-tight")}>
          {compact ? "Overviews on Discussion Threads" : "All discussion"}
        </span>
      )}
      <button onClick={() => onCompact(!compact)} aria-pressed={compact}
        className={cn("ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition",
          compact ? "border-event bg-event text-primary-foreground" : "border-event/30 text-event hover:bg-event-soft")}>
        <Rows3 size={13} /> Group topics
      </button>
    </div>
  );
}
