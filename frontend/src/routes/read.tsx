import { createFileRoute } from "@tanstack/react-router";
import { Lock, Plus, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Composer } from "@/components/bw/Composer";
import { ChapterSpine, ReaderPage } from "@/components/bw/Shell";
import { DiscussionCard } from "@/components/bw/FeedFilters";
import { MomentsFeed } from "@/components/bw/MomentsFeed";
import { CHAPTERS } from "@/data/bookworm";
import { filterPosts, isPostVisible, visibleEvents } from "@/lib/gating";
import { EXPERIMENTS } from "@/lib/experiments";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/read")({
  head: () => ({
    meta: [
      { title: "The Great Gatsby — Bookworm" },
      { name: "description", content: "Spoiler-free discussion of The Great Gatsby, chapter by chapter." },
      { property: "og:title", content: "The Great Gatsby — Bookworm" },
      { property: "og:description", content: "Spoiler-free discussion of The Great Gatsby, chapter by chapter." },
    ],
  }),
  component: () => (
    <ReaderPage>
      <ChapterView />
    </ReaderPage>
  ),
});

function ChapterView() {
  const s = useStore();
  const ch = s.chapter!;
  const vc = s.hindsight ? s.viewChapter : ch;
  const info = CHAPTERS[vc - 1]!;
  const [selEvent, setSelEvent] = useState<string | null>(null);
  const [composer, setComposer] = useState(false);
  const [compact, setCompact] = useState(false);

  // Grouping topics sets the selected moment aside (no pill, every topic); turning it off brings the selection back.
  const picked = compact ? null : selEvent;
  // The feed shows this chapter; a selected moment (possibly from an earlier chapter) widens it to everything read so far.
  const allScope = picked !== null;
  const inScope = s.posts.filter((p) => isPostVisible(p, ch, s.hindsight) && (allScope ? p.chapter <= vc : p.chapter === vc));
  const locked = s.posts.filter((p) => p.chapter > ch && !p.hindsight).length;
  const eventOptions = visibleEvents(vc);
  const activeEvents = picked && eventOptions.some((e) => e.id === picked) ? [picked] : [];
  // While a moment is selected, cards show only its tag.
  const feed = filterPosts(inScope, [], activeEvents).map((p) => (activeEvents.length ? { ...p, events: activeEvents } : p));

  return (
    <>
      {s.resolved.map(({ postId }) => {
        const p = s.posts.find((x) => x.id === postId)!;
        const my = s.votes[postId];
        const right = my && ((my === "agree") === (p.prediction!.outcome === "correct"));
        return (
          <div key={postId} className="relative mb-4 rounded-xl border border-prediction/40 bg-prediction-soft p-4 animate-in fade-in duration-200">
            <button onClick={() => s.dismissResolved(postId)} className="absolute right-3 top-3 text-muted-foreground" aria-label="Dismiss"><X size={16} /></button>
            <div className="flex items-center gap-2 text-sm font-semibold"><Sparkles size={16} /> A prediction resolved!</div>
            <p className="mt-1 text-[15px] font-medium">"{p.body.replace(/^Prediction:\s*/, "").split(/[.!?]/)[0]}" — <strong>{p.prediction!.outcome === "correct" ? "Correct" : "Incorrect"}</strong>.</p>
            <p className="text-sm text-muted-foreground">{p.prediction!.agree}% of readers agreed.{my && (right ? " 🎉 You called it!" : " You voted the other way this time.")}</p>
          </div>
        );
      })}

      <section className="mb-5">
        <h1 className="text-[28px] font-bold leading-tight">{info.title}</h1>
        {EXPERIMENTS.spine
          ? <ChapterSpine reached={ch} current={vc} onClick={() => s.setPickerOpen(true)} />
          : <p className="mt-1 text-[13px] font-medium text-muted-foreground">Chapter {vc} of {CHAPTERS.length}</p>}
        <p className="mt-3 max-w-[68ch] text-[15px] leading-6 text-foreground/80">{info.recap}</p>
      </section>

      <DiscussionCard compact={compact} onCompact={setCompact}
        event={eventOptions.find((e) => e.id === activeEvents[0])} clear={() => setSelEvent(null)} shown={feed.length} total={inScope.length} />

      <MomentsFeed posts={feed} compact={compact} tags={allScope} showChapter={(p) => allScope || !!p.hindsight}
        onPick={(id) => { setSelEvent(id); setCompact(false); }} />
      {feed.length === 0 && (
        <div className="py-12 text-center">
          <p className="font-semibold">No posts for this chapter yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Be the first to say what you made of it.</p>
        </div>
      )}

      {locked > 0 && (
        <p className="mt-6 flex items-center justify-center gap-2 border-t border-border pt-6 text-[13px] text-muted-foreground">
          <Lock size={14} /> {locked} discussions from later chapters are waiting for you.
        </p>
      )}

      <button onClick={() => setComposer(true)} aria-label="New post"
        className="fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center gap-1.5 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-[0_4px_14px_-2px_rgb(0_0_0/0.25)] transition-colors hover:bg-primary/90 sm:bottom-6 sm:right-6 sm:h-11 sm:w-auto sm:pl-4 sm:pr-5">
        <Plus size={20} strokeWidth={2.25} /> <span className="hidden sm:inline">New post</span>
      </button>
      <Composer open={composer} onClose={() => setComposer(false)} />
    </>
  );
}

