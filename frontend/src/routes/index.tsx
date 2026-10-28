import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import cover from "@/assets/gatsby-cover.jpg";
import { DarkToggle } from "@/components/bw/Shell";
import { SHELF } from "@/data/bookworm";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bookworm — Your library" },
      { name: "description", content: "Pick a book and join spoiler-free, chapter-by-chapter discussions." },
      { property: "og:title", content: "Bookworm — Your library" },
      { property: "og:description", content: "Pick a book and join spoiler-free, chapter-by-chapter discussions." },
    ],
  }),
  component: Library,
});

const SPINE_HUES = [0, 150, 25, 260];

function Library() {
  const { setPickerOpen } = useStore();
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-4xl items-center px-5 py-5">
        <span className="flex items-center gap-2 font-serif text-xl font-semibold"><BookOpen className="text-event" size={20} /> Bookworm</span>
        <div className="ml-auto"><DarkToggle /></div>
      </header>
      <main className="mx-auto max-w-4xl px-5 pb-20">
        <section className="py-10 sm:py-16 animate-in fade-in slide-in-from-bottom-3 duration-700">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-event">Your library</p>
          <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">Talk about the book — <em className="text-character">only up to where you are.</em></h1>
          <p className="mt-4 max-w-lg text-muted-foreground">Discussions anchored to the events and characters of each chapter. Never a spoiler.</p>
        </section>
        <div className="rounded-3xl bg-secondary/60 p-6 sm:p-10">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {SHELF.map((b, i) => (
              <button key={b.id} disabled={!b.available} onClick={() => setPickerOpen(true)}
                className="group text-left disabled:cursor-not-allowed">
                <div className="relative aspect-[2/3] overflow-hidden rounded-r-xl rounded-l-sm shadow-[6px_8px_20px_-6px_var(--color-overlay)] transition-all duration-300 group-enabled:group-hover:-translate-y-2 group-enabled:group-hover:rotate-[-1deg]">
                  {b.available ? (
                    <img src={cover} alt={`${b.title} cover`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full flex-col justify-between p-4 opacity-60" style={{ background: `oklch(0.8 0.05 ${SPINE_HUES[i]})`, color: `oklch(0.3 0.05 ${SPINE_HUES[i]})` }}>
                      <span className="font-serif text-lg font-semibold leading-tight">{b.title}</span>
                      <span className="text-xs">{b.author}</span>
                    </div>
                  )}
                  {!b.available && <span className="absolute right-2 top-2 rounded-full bg-card px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">Coming soon</span>}
                </div>
                <div className="mt-3 font-serif font-semibold">{b.title}</div>
                <div className="text-xs text-muted-foreground">{b.author}</div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
