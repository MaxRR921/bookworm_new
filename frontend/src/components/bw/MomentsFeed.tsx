import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Post } from "@/data/bookworm";
import { cn } from "@/lib/utils";
import { ThreadPost } from "./Thread";
import { eventById } from "./ui";

// full: normal feed. rise: every post shrinks into a compact grid. merged: one stacked, expandable card per moment.
type Phase = "full" | "rise" | "merged";
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
// One shared timing so every card moves in sync.
const BEAT = { duration: 700, easing: "cubic-bezier(.65,0,.35,1)" };
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const title = (id: string) => (id ? eventById(id)?.title : "Other discussion");

/** The feed. In moments mode, cards rise into a grid, then posts on the same moment merge into one card whose thread opens below it. */
export function MomentsFeed({ posts, compact, tags, showChapter, onPick }: {
  posts: Post[];
  compact: boolean;
  tags: boolean; // moment tags on the regular feed's cards
  showChapter: (p: Post) => boolean;
  onPick: (eventId: string) => void;
}) {
  const [phase, setPhase] = useState<Phase>("full");
  const [open, setOpen] = useState<string | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const last = useRef(new Map<string, { x: number; y: number }>());
  const lastPhase = useRef(phase);

  // A post merges into its first moment; a cluster lists every post tagged with that moment.
  const primary = (p: Post) => p.events[0] ?? "";
  const clusters = [...new Set(posts.flatMap((p) => (p.events.length ? p.events : [""])))]
    .map((id) => ({ id, posts: posts.filter((p) => (id ? p.events.includes(id) : !p.events.length)) }))
    .sort((a, b) => b.posts.length - a.posts.length);

  useEffect(() => {
    setPhase(compact ? (reduced() ? "merged" : "rise") : "full");
    setOpen(null);
  }, [compact]);

  // Rise → merged, all on one beat: every card glides onto the first card of its moment at once and lands
  // under it; the receiving cards pulse together as they land. Then the clusters render.
  useEffect(() => {
    if (phase !== "rise") return;
    let live = true;
    const t = setTimeout(async () => {
      const leads = new Map<string, HTMLElement>();
      const receiving = new Set<HTMLElement>();
      const moves = [...(list.current?.querySelectorAll<HTMLElement>("[data-to]") ?? [])].flatMap((el) => {
        const key = el.getAttribute("data-to")!;
        const lead = leads.get(key);
        if (!lead) {
          leads.set(key, el);
          return [];
        }
        receiving.add(lead);
        const to = `translate(${lead.offsetLeft - el.offsetLeft}px, ${lead.offsetTop - el.offsetTop}px) scale(0.92)`;
        return [el.animate([{ transform: "none", opacity: 1 }, { transform: to, opacity: 1, offset: 0.8 }, { transform: to, opacity: 0 }],
          { ...BEAT, fill: "forwards" }).finished];
      });
      receiving.forEach((lead) => {
        lead.style.zIndex = "1"; // arriving cards slide in underneath
        lead.animate([{ transform: "none" }, { transform: "none", offset: 0.75 }, { transform: "scale(1.05)", offset: 0.88 }, { transform: "none" }], BEAT);
      });
      await Promise.allSettled(moves);
      if (live) setPhase("merged");
    }, BEAT.duration + 100);
    return () => { live = false; clearTimeout(t); };
  }, [phase]);

  // FLIP on every phase change: cards glide from where they were to where they are now.
  useIsoLayoutEffect(() => {
    const changed = lastPhase.current !== phase;
    lastPhase.current = phase;
    const next = new Map<string, { x: number; y: number }>();
    list.current?.querySelectorAll<HTMLElement>("[data-flip]").forEach((el) => {
      const pos = { x: el.offsetLeft, y: el.offsetTop };
      const key = el.getAttribute("data-flip")!, to = el.getAttribute("data-to");
      next.set(key, pos);
      if (to !== null && !next.has(`m:${to}`)) next.set(`m:${to}`, pos); // a cluster grows out of its lead card
      if (!changed || phase === "full" || reduced()) return;
      const from = last.current.get(key);
      el.animate(
        from ? [{ transform: `translate(${from.x - pos.x}px, ${from.y - pos.y}px)` }, { transform: "none" }]
          : [{ opacity: 0, transform: "scale(0.96)" }, { opacity: 1, transform: "none" }],
        BEAT);
    });
    last.current = next;
  });

  return (
    <div ref={list} className={cn("relative [overflow-anchor:none]", phase === "rise" ? "grid grid-cols-2 gap-2" : phase === "merged" ? "space-y-3" : "divide-y divide-border")}>
      {phase === "full" && posts.map((p) => (
        <div key={p.id} data-flip={p.id}><ThreadPost post={p} showChapter={showChapter(p)} tags={tags} onTag={onPick} /></div>
      ))}

      {phase === "rise" && posts.map((p) => (
        <div key={p.id} data-flip={p.id} data-to={primary(p)} className="relative rounded-xl border border-border bg-card p-3">
          <div className="truncate text-xs font-semibold">{title(primary(p))}</div>
          <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-foreground/80">{p.body}</p>
          <div className="mt-1.5 text-xs text-muted-foreground">{p.user}</div>
        </div>
      ))}

      {phase === "merged" && clusters.map((c) => {
        const isOpen = open === c.id;
        return (
          <div key={c.id} data-flip={`m:${c.id}`} className="relative">
            {/* Stacked edges show how many posts merged into this card. */}
            {c.posts.length > 2 && <div aria-hidden className="absolute inset-x-4 -bottom-2.5 h-full rounded-xl border border-border bg-muted" />}
            {c.posts.length > 1 && <div aria-hidden className="absolute inset-x-2 -bottom-1.5 h-full rounded-xl border border-border bg-card" />}
            <div className={cn("relative overflow-hidden rounded-xl border bg-card transition-colors", isOpen ? "border-input" : "border-border")}>
              <button onClick={() => setOpen(isOpen ? null : c.id)} aria-expanded={isOpen}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-semibold">{title(c.id)}</span>
                  <span className="mt-0.5 block truncate text-[13px] text-muted-foreground">{c.posts[0]!.user}: {c.posts[0]!.body}</span>
                </span>
                <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold tabular-nums text-muted-foreground">
                  {c.posts.length} {c.posts.length === 1 ? "post" : "posts"}
                </span>
                <ChevronDown size={18} className={cn("shrink-0 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
              </button>
              <div className={cn("grid transition-[grid-template-rows] duration-200 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden" inert={!isOpen}>
                  <div className="max-h-[60vh] overflow-y-auto border-t border-border px-4 pt-2">
                    {c.id && (
                      <button onClick={() => onPick(c.id)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-full bg-event-soft px-3 text-[13px] font-semibold text-event transition-colors hover:bg-event hover:text-primary-foreground">
                        Show only this moment in the feed <ArrowRight size={14} />
                      </button>
                    )}
                    <div className="divide-y divide-border">{c.posts.map((p) => <ThreadPost key={p.id} post={p} showChapter={showChapter(p)} tags />)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
