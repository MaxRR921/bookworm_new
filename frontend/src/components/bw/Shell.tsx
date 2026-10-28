import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, ChevronDown, Moon, Sun } from "lucide-react";
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
      <div className="grid gap-0.5">
        {CHAPTERS.map((c) => (
          <button key={c.number}
            onClick={() => { setChapter(c.number); setPickerOpen(false); navigate({ to: "/read" }); }}
            aria-current={chapter === c.number ? "true" : undefined}
            className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
              chapter === c.number ? "bg-event-soft text-event" : "hover:bg-muted")}>
            <span className={cn("w-6 text-right text-sm font-semibold tabular-nums", chapter === c.number ? "text-event" : "text-muted-foreground")}>{c.number}</span>
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
    <button onClick={toggleDark} aria-label="Toggle dark mode" className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export function TopBar() {
  const { chapter, setPickerOpen } = useStore();
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2 text-[15px] font-bold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground"><BookOpen size={15} strokeWidth={2.25} /></span>
          <span className="hidden sm:inline">Bookworm</span>
        </Link>
        <span aria-hidden className="h-5 w-px bg-border" />
        <Link to="/read" className="truncate text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{BOOK.title}</Link>
        <div className="ml-auto flex items-center gap-1">
          {chapter && (
            <button onClick={() => setPickerOpen(true)} aria-label={`You're on chapter ${chapter}. Change chapter`}
              className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-[13px] font-semibold transition-colors hover:bg-accent">
              Chapter {chapter} <ChevronDown size={14} className="text-muted-foreground" />
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
