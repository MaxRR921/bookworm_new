import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, Moon, Sun } from "lucide-react";
import type { ReactNode } from "react";
import { BOOK, CHAPTERS } from "@/data/bookworm";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Modal } from "./ui";

export function ChapterPicker() {
  const { pickerOpen, setPickerOpen, chapter, setChapter } = useStore();
  const navigate = useNavigate();
  return (
    <Modal open={pickerOpen} onClose={() => setPickerOpen(false)} title="Where are you?">
      <p className="mb-4 text-sm text-muted-foreground">We'll hide everything past this point.</p>
      <div className="grid gap-2">
        {CHAPTERS.map((c) => (
          <button key={c.number}
            onClick={() => { setChapter(c.number); setPickerOpen(false); navigate({ to: "/read" }); }}
            className={cn("flex items-center gap-4 rounded-2xl border px-4 py-3 text-left transition hover:border-event hover:bg-event-soft",
              chapter === c.number ? "border-event bg-event-soft" : "border-border")}>
            <span className="font-serif text-2xl font-semibold text-event w-7">{c.number}</span>
            <span className="font-medium">{c.title}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}

export function DarkToggle() {
  const { dark, toggleDark } = useStore();
  return (
    <button onClick={toggleDark} aria-label="Toggle dark mode" className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export function TopBar() {
  const { chapter, setPickerOpen } = useStore();
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-serif text-lg font-semibold"><BookOpen size={18} className="text-event" /> <span className="hidden sm:inline">Bookworm</span></Link>
        <Link to="/read" className="truncate font-serif italic text-muted-foreground">{BOOK.title}</Link>
        <div className="ml-auto flex items-center gap-1">
          {chapter && (
            <button onClick={() => setPickerOpen(true)} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition hover:border-event">
              You're on Chapter <span className="text-event">{chapter}</span> · Change
            </button>
          )}
          <DarkToggle />
        </div>
      </div>
    </header>
  );
}

/** Wraps reading pages: requires a chapter to be chosen first. */
export function ReaderPage({ children }: { children: ReactNode }) {
  const { chapter, setPickerOpen } = useStore();
  return (
    <div className="min-h-screen">
      <TopBar />
      {chapter ? (
        <main className="mx-auto max-w-3xl px-4 pb-28 pt-6 animate-in fade-in duration-500">{children}</main>
      ) : (
        <main className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="text-3xl font-semibold">Pick up where you left off</h1>
          <p className="mt-2 text-muted-foreground">Tell us your chapter so we can keep things spoiler-free.</p>
          <button onClick={() => setPickerOpen(true)} className="mt-6 rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground">Choose chapter</button>
        </main>
      )}
    </div>
  );
}
