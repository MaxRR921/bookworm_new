import { createFileRoute } from "@tanstack/react-router";
import { Lock, Star } from "lucide-react";
import { useState } from "react";
import { PostCard } from "@/components/bw/PostCard";
import { ReaderPage } from "@/components/bw/Shell";
import { SentimentChart } from "@/components/bw/SentimentChart";
import { CharAvatar } from "@/components/bw/ui";
import { CHAPTERS, CHARACTERS } from "@/data/bookworm";
import { isPostVisible } from "@/lib/gating";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/character/$characterId")({
  head: () => ({
    meta: [
      { title: "Character — Bookworm" },
      { name: "description", content: "How readers feel about a Great Gatsby character, chapter by chapter." },
      { property: "og:title", content: "Character — Bookworm" },
      { property: "og:description", content: "How readers feel about a Great Gatsby character, chapter by chapter." },
    ],
  }),
  component: () => (
    <ReaderPage>
      <CharacterView />
    </ReaderPage>
  ),
});

function CharacterView() {
  const { characterId } = Route.useParams();
  const s = useStore();
  const ch = s.chapter!;
  const c = CHARACTERS.find((x) => x.id === characterId);
  const [hover, setHover] = useState(0);
  if (!c || c.firstChapter > ch) {
    return <div className="py-20 text-center text-muted-foreground"><Lock className="mx-auto mb-3" /> You haven't met this character yet.</div>;
  }
  const appearances = CHAPTERS.filter((x) => x.number <= ch && x.notes[c.id]);
  const mine = s.ratings[c.id] ?? {};
  // Blend the reader's own rating in as an extra vote weighted against ~20 readers.
  const values = c.sentiment.map((v, i) => (v != null && mine[i + 1] ? Math.round(((v * 20 + mine[i + 1]!) / 21) * 100) / 100 : v));
  const myNow = mine[ch] ?? 0;
  const posts = s.posts.filter((p) => p.characters.includes(c.id) && isPostVisible(p, ch, s.hindsight));

  return (
    <>
      <div className="flex items-center gap-5">
        <CharAvatar c={c} size={84} />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-character">● Character</p>
          <h1 className="text-4xl font-semibold">{c.name}</h1>
        </div>
      </div>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{c.bio}</p>

      <h2 className="mb-3 mt-10 text-2xl font-semibold">As of Chapter {ch}</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {appearances.map((a) => (
          <div key={a.number} className={cn("w-48 shrink-0 rounded-2xl border bg-card p-4", a.number === ch ? "border-character" : "border-border")}>
            <div className="text-xs font-semibold uppercase tracking-wide text-character">Chapter {a.number}</div>
            <p className="mt-1 text-sm">{a.notes[c.id]}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-10 text-2xl font-semibold">How readers feel</h2>
      <div className="rounded-2xl border border-border bg-card p-4">
        <SentimentChart c={c} values={values} upTo={ch} />
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-sm font-medium">How do you feel about {c.name.split(" ")[0]} right now?</p>
          <div className="mt-2 flex gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onMouseEnter={() => setHover(n)} onClick={() => s.rate(c.id, ch, n)} aria-label={`${n} stars`} className="transition active:scale-90">
                <Star size={28} className={cn("transition", (hover || myNow) >= n ? "fill-prediction text-prediction" : "text-border")} />
              </button>
            ))}
          </div>
          {myNow > 0 && <p className="mt-1 text-xs text-muted-foreground">Thanks — your rating is in the chart.</p>}
        </div>
      </div>

      <h2 className="mb-4 mt-10 text-2xl font-semibold">Posts about {c.name.split(" ")[0]}</h2>
      <div className="space-y-4">
        {posts.map((p) => <PostCard key={p.id} post={p} showChapter />)}
      </div>
    </>
  );
}
