import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { PostCard } from "@/components/bw/PostCard";
import { ReaderPage } from "@/components/bw/Shell";
import { CharAvatar, charById, eventById, ReactionBar } from "@/components/bw/ui";
import { EVENTS } from "@/data/bookworm";
import { isPostVisible } from "@/lib/gating";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/event/$eventId")({
  head: () => ({
    meta: [
      { title: "Event — Bookworm" },
      { name: "description", content: "Discuss a moment from The Great Gatsby, spoiler-free." },
      { property: "og:title", content: "Event — Bookworm" },
      { property: "og:description", content: "Discuss a moment from The Great Gatsby, spoiler-free." },
    ],
  }),
  component: () => (
    <ReaderPage>
      <EventView />
    </ReaderPage>
  ),
});

const sum = (id: string) => [...id].reduce((a, c) => a + c.charCodeAt(0), 0);

function EventView() {
  const { eventId } = Route.useParams();
  const s = useStore();
  const ch = s.chapter!;
  const e = eventById(eventId);
  if (!e || e.chapter > ch) {
    return (
      <div className="py-20 text-center text-muted-foreground"><Lock className="mx-auto mb-3" /> This moment is further along in the book. Keep reading!</div>
    );
  }
  const reachable = EVENTS.filter((x) => x.chapter <= ch);
  const idx = reachable.findIndex((x) => x.id === e.id);
  const prev = reachable[idx - 1];
  const next = reachable[idx + 1];
  const posts = s.posts.filter((p) => p.events.includes(e.id) && isPostVisible(p, ch, s.hindsight));
  const base = sum(e.id);
  const counts = { wow: 20 + (base % 40), lol: base % 9, sad: 10 + (base % 30), mad: base % 17, hmm: 5 + (base % 22) };

  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-event">◆ Event · Chapter {e.chapter}</p>
      <h1 className="mt-1 text-4xl font-semibold leading-tight">{e.title}</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{e.description}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {e.characters.map(charById).filter((c) => c.firstChapter <= ch).map((c) => (
          <Link key={c.id} to="/character/$characterId" params={{ characterId: c.id }} className="flex items-center gap-2 rounded-full bg-character-soft py-1 pl-1 pr-3 text-sm font-medium text-character transition hover:brightness-95">
            <CharAvatar c={c} size={28} /> {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-6"><ReactionBar id={`event-${e.id}`} counts={counts} large /></div>

      <div className="mt-6 flex justify-between gap-3">
        {prev ? (
          <Link to="/event/$eventId" params={{ eventId: prev.id }} className="inline-flex max-w-[48%] items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm transition hover:bg-muted">
            <ChevronLeft size={16} /> <span className="truncate">Previous event</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link to="/event/$eventId" params={{ eventId: next.id }} className="inline-flex max-w-[48%] items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm transition hover:bg-muted">
            <span className="truncate">Next event</span> <ChevronRight size={16} />
          </Link>
        ) : (
          <button disabled className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm opacity-40">Next event <ChevronRight size={16} /></button>
        )}
      </div>

      <h2 className="mb-4 mt-10 text-2xl font-semibold">Discussion</h2>
      <div className="space-y-4">
        {posts.map((p) => <PostCard key={p.id} post={p} showChapter />)}
        {posts.length === 0 && <p className="text-muted-foreground">No posts yet.</p>}
      </div>
    </>
  );
}
