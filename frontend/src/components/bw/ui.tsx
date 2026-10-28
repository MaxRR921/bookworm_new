import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { CHARACTERS, EVENTS, REACTIONS, type CharacterId, type Character, type ReactionKey } from "@/data/bookworm";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function charById(id: CharacterId) {
  return CHARACTERS.find((c) => c.id === id)!;
}
export function eventById(id: string) {
  return EVENTS.find((e) => e.id === id);
}

export function CharAvatar({ c, size = 40, active }: { c: Character; size?: number; active?: boolean }) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-serif font-semibold ring-2 ring-offset-2 ring-offset-background transition-all", active ? "ring-character" : "ring-transparent")}
      style={{ width: size, height: size, fontSize: size * 0.36, background: `oklch(0.85 0.07 ${c.hue})`, color: `oklch(0.3 0.08 ${c.hue})` }}
    >
      {c.initials}
    </span>
  );
}

export function UserAvatar({ name, size = 36 }: { name: string; size?: number }) {
  const hue = [...name].reduce((a, ch) => a + ch.charCodeAt(0), 0) % 360;
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-full text-xs font-semibold uppercase"
      style={{ width: size, height: size, background: `oklch(var(--avatar-bg) 0.05 ${hue})`, color: `oklch(var(--avatar-fg) 0.08 ${hue})` }}>
      {name.slice(0, 2)}
    </span>
  );
}

export function EventPill({ id }: { id: string }) {
  const e = eventById(id);
  if (!e) return null;
  return (
    <Link to="/event/$eventId" params={{ eventId: id }} onClick={(ev) => ev.stopPropagation()}
      className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent">
      {e.title}
    </Link>
  );
}

export function CharPill({ id }: { id: CharacterId }) {
  const c = charById(id);
  return (
    <Link to="/character/$characterId" params={{ characterId: id }} onClick={(ev) => ev.stopPropagation()}
      className="inline-flex items-center gap-1 rounded-full bg-character-soft px-2.5 py-0.5 text-xs font-medium text-character transition hover:brightness-95">
      {c.name}
    </Link>
  );
}

export function ReactionBar({ id, counts, large }: { id: string; counts: Record<ReactionKey, number>; large?: boolean }) {
  const { myReactions, toggleReaction } = useStore();
  const mine = myReactions[id] ?? [];
  return (
    <div className="flex flex-wrap gap-1.5">
      {REACTIONS.map((r) => {
        const on = mine.includes(r.key);
        return (
          <button key={r.key} onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleReaction(id, r.key); }}
            aria-pressed={on}
            className={cn("inline-flex items-center gap-1 rounded-full font-semibold transition-colors active:scale-95",
              large ? "px-4 py-2 text-lg" : "h-7 min-w-9 justify-center px-2.5 text-xs",
              on ? "bg-event-soft text-event" : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground")}>
            <span>{r.emoji}</span>
            {counts[r.key] + (on ? 1 : 0) > 0 && <span className="tabular-nums">{counts[r.key] + (on ? 1 : 0)}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function Modal({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-overlay animate-in fade-in duration-150 sm:items-center" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-border bg-card p-5 shadow-[0_12px_40px_-8px_rgb(0_0_0/0.25)] animate-in slide-in-from-bottom-4 duration-200 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-muted-foreground hover:bg-muted" aria-label="Close"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
