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
      style={{ width: size, height: size, background: `oklch(0.9 0.04 ${hue})`, color: `oklch(0.35 0.06 ${hue})` }}>
      {name.slice(0, 2)}
    </span>
  );
}

export function EventPill({ id }: { id: string }) {
  const e = eventById(id);
  if (!e) return null;
  return (
    <Link to="/event/$eventId" params={{ eventId: id }} onClick={(ev) => ev.stopPropagation()}
      className="inline-flex items-center gap-1 rounded-full bg-event-soft px-2.5 py-0.5 text-xs font-medium text-event transition hover:brightness-95">
      ◆ {e.title}
    </Link>
  );
}

export function CharPill({ id }: { id: CharacterId }) {
  const c = charById(id);
  return (
    <Link to="/character/$characterId" params={{ characterId: id }} onClick={(ev) => ev.stopPropagation()}
      className="inline-flex items-center gap-1 rounded-full bg-character-soft px-2.5 py-0.5 text-xs font-medium text-character transition hover:brightness-95">
      ● {c.name}
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
            className={cn("inline-flex items-center gap-1 rounded-full border transition-all active:scale-90",
              large ? "px-4 py-2 text-lg" : "px-2 py-0.5 text-xs",
              on ? "border-event bg-event-soft" : "border-border bg-card hover:bg-muted")}>
            <span>{r.emoji}</span>
            <span className="tabular-nums text-muted-foreground">{counts[r.key] + (on ? 1 : 0)}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Modal({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-overlay backdrop-blur-sm animate-in fade-in sm:items-center" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-card p-6 shadow-2xl animate-in slide-in-from-bottom-8 duration-300 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-muted-foreground hover:bg-muted" aria-label="Close"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
