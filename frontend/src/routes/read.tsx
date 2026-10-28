import { createFileRoute } from "@tanstack/react-router";
import { Lock, Plus, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Composer } from "@/components/bw/Composer";
import { ReaderPage } from "@/components/bw/Shell";
import { DiscussionCard } from "@/components/bw/FeedFilters";
import { MomentsFeed } from "@/components/bw/MomentsFeed";
import { CHAPTERS } from "@/data/bookworm";
import { filterPosts, isPostVisible, visibleEvents } from "@/lib/gating";
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
          <div key={postId} className="relative mb-4 rounded-2xl border-2 border-prediction bg-prediction-soft p-4 animate-in zoom-in-95 fade-in duration-500">
            <button onClick={() => s.dismissResolved(postId)} className="absolute right-3 top-3 text-muted-foreground" aria-label="Dismiss"><X size={16} /></button>
            <div className="flex items-center gap-2 text-sm font-semibold"><Sparkles size={16} /> A prediction resolved!</div>
            <p className="mt-1 font-serif text-lg">"{p.body.replace(/^Prediction:\s*/, "").split(/[.!?]/)[0]}" — <strong>{p.prediction!.outcome === "correct" ? "Correct" : "Incorrect"}</strong>.</p>
            <p className="text-sm text-muted-foreground">{p.prediction!.agree}% of readers agreed.{my && (right ? " 🎉 You called it!" : " You voted the other way this time.")}</p>
          </div>
        );
      })}

      <section className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-event">Chapter {vc}</p>
        <h1 className="mt-1 text-4xl font-semibold">{info.title}</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">{info.recap}</p>
      </section>

      <DiscussionCard compact={compact} onCompact={setCompact}
        event={eventOptions.find((e) => e.id === activeEvents[0])} clear={() => setSelEvent(null)} shown={feed.length} total={inScope.length} />

      <MomentsFeed posts={feed} compact={compact} tags={allScope} showChapter={(p) => allScope || !!p.hindsight}
        onPick={(id) => { setSelEvent(id); setCompact(false); }} />
      {feed.length === 0 && <p className="py-8 text-center text-muted-foreground">No posts here yet — start the conversation.</p>}

      {locked > 0 && (
        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Lock size={14} /> {locked} discussions from later chapters are waiting for you.
        </p>
      )}

      <button onClick={() => setComposer(true)}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-event px-5 py-3 font-medium text-primary-foreground shadow-xl transition hover:scale-105 active:scale-95">
        <Plus size={18} /> New post
      </button>
      <Composer open={composer} onClose={() => setComposer(false)} />
    </>
  );
}
